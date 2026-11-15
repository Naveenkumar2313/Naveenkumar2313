import fs from 'fs';
import path from 'path';
import { theme } from './theme.mjs';
import { initFonts } from './font-outliner.mjs';
import { buildActivitySvg } from './components/activity.mjs';

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

async function fetchGitHubCalendar(username, token) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Project-SIGNAL-Activity-Fetcher'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables: { login: username } })
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.errors && data.errors.length > 0) {
    throw new Error(`GitHub GraphQL Errors: ${data.errors.map(e => e.message).join('; ')}`);
  }

  return data.data?.user?.contributionsCollection?.contributionCalendar;
}

function computeStatsFromCalendar(calendar) {
  let totalContributions = calendar.totalContributions || 0;
  let activeDays = 0;
  let currentStreak = 0;
  let longestStreak = 0;

  const allDays = [];
  for (const wk of (calendar.weeks || [])) {
    for (const day of (wk.contributionDays || [])) {
      allDays.push(day);
      if (day.contributionCount > 0) {
        activeDays++;
        currentStreak++;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
    }
  }

  return {
    weeks: calendar.weeks || [],
    totalContributions,
    activeDays,
    longestStreak,
    timestamp: new Date().toISOString().slice(0, 10)
  };
}

function getFallbackData() {
  // Generate a realistic 52-week baseline if API token is absent in local development
  const weeks = [];
  let total = 0;
  let active = 0;
  for (let w = 0; w < 52; w++) {
    const days = [];
    let weekTotal = 0;
    for (let d = 0; d < 7; d++) {
      // Deterministic pseudo-activity wave
      const count = (w % 3 === 0 && d > 1 && d < 6) ? ((w * 7 + d) % 4) + 1 : 0;
      days.push({ contributionCount: count });
      weekTotal += count;
      if (count > 0) active++;
    }
    total += weekTotal;
    weeks.push({ contributionDays: days, total: weekTotal });
  }

  return {
    weeks,
    totalContributions: total,
    activeDays: active,
    longestStreak: 9,
    timestamp: new Date().toISOString().slice(0, 10)
  };
}

async function main() {
  console.log('--- Project SIGNAL: Activity Fetcher ---');
  const config = JSON.parse(fs.readFileSync(path.resolve('src/profile.config.json'), 'utf8'));
  const username = config.handle || 'Naveenkumar2313';
  const token = process.env.GH_PAT || process.env.GITHUB_TOKEN;

  const assetsDir = path.resolve('assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  await initFonts();

  let calendarData = null;

  if (token) {
    try {
      console.log(`[Activity] Querying GitHub GraphQL for @${username}...`);
      const calendar = await fetchGitHubCalendar(username, token);
      if (calendar) {
        calendarData = computeStatsFromCalendar(calendar);
        console.log(`[Activity] Successfully fetched: ${calendarData.totalContributions} total, ${calendarData.activeDays} active days`);
      }
    } catch (err) {
      console.warn(`[Activity] Warning: GitHub GraphQL fetch failed: ${err.message}`);
    }
  } else {
    console.log('[Activity] Notice: No GH_PAT or GITHUB_TOKEN set. Using baseline/cached telemetry.');
  }

  // If fetch failed or no token, preserve existing assets or use fallback
  const darkPath = path.join(assetsDir, 'activity-dark.svg');
  const lightPath = path.join(assetsDir, 'activity-light.svg');

  if (!calendarData) {
    if (fs.existsSync(darkPath) && fs.existsSync(lightPath)) {
      console.log('[Activity] Preserving existing activity-*.svg assets. Exiting cleanly.');
      process.exit(0);
    }
    console.log('[Activity] Generating initial baseline activity assets...');
    calendarData = getFallbackData();
  }

  // Render Activity SVGs
  const actDarkSvg = await buildActivitySvg('dark', calendarData, theme.dark);
  const actLightSvg = await buildActivitySvg('light', calendarData, theme.light);

  fs.writeFileSync(darkPath, actDarkSvg);
  fs.writeFileSync(lightPath, actLightSvg);

  const darkSize = (fs.statSync(darkPath).size / 1024).toFixed(1);
  const lightSize = (fs.statSync(lightPath).size / 1024).toFixed(1);
  console.log(`[Activity] Emitted: activity-dark.svg (${darkSize} KB), activity-light.svg (${lightSize} KB)`);
  console.log('[Activity] Done.\n');
}

main().catch(err => {
  console.warn('[Activity] Non-fatal exception caught:', err.message);
  process.exit(0);
});

