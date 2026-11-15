import http from 'http';
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const WORKSPACE_ROOT = "c:\\workspace\\gitrepositories\\New folder\\Naveenkumar2313";
const ARTIFACT_DIR = "C:\\Users\\win 10\\.gemini\\antigravity\\brain\\eb529677-987f-405a-9ae1-ee23835540d3";

// Simple static server
const mimeTypes = {
  '.html': 'text/html',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const safePath = path.normalize(path.join(WORKSPACE_ROOT, urlPath));
  if (!safePath.startsWith(WORKSPACE_ROOT)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }
  fs.readFile(safePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }
    const ext = path.extname(safePath).toLowerCase();
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    res.end(data);
  });
});

await new Promise(resolve => server.listen(8095, resolve));
console.log('Static preview server listening on port 8095');

const targets = [
  {
    name: 'final-opt2-desktop-light',
    url: 'http://localhost:8095/render-lab/readme-preview.html?theme=light',
    width: 1280,
    height: 3800
  },
  {
    name: 'final-opt2-desktop-dark',
    url: 'http://localhost:8095/render-lab/readme-preview.html?theme=dark',
    width: 1280,
    height: 3800
  },
  {
    name: 'final-opt2-mobile-light',
    url: 'http://localhost:8095/render-lab/readme-preview.html?theme=light',
    width: 390,
    height: 3000
  },
  {
    name: 'final-opt2-mobile-dark',
    url: 'http://localhost:8095/render-lab/readme-preview.html?theme=dark',
    width: 390,
    height: 3000
  }
];

fs.mkdirSync(path.join(WORKSPACE_ROOT, 'render-lab/screenshots'), { recursive: true });
fs.mkdirSync(path.join(ARTIFACT_DIR, 'screenshots'), { recursive: true });

for (const t of targets) {
  const outPath = path.join(WORKSPACE_ROOT, `render-lab/screenshots/${t.name}.png`);
  const artifactPath = path.join(ARTIFACT_DIR, `screenshots/${t.name}.png`);
  console.log(`Capturing ${t.name} (${t.width}x${t.height})...`);
  
  await execFileAsync(CHROME_PATH, [
    '--headless',
    '--disable-gpu',
    '--user-data-dir=c:\\temp\\chrome-preview-profile',
    `--window-size=${t.width},${t.height}`,
    `--screenshot=${outPath}`,
    t.url
  ]);

  fs.copyFileSync(outPath, artifactPath);
  console.log(`Saved to ${outPath} and ${artifactPath}`);
}

server.close();
console.log('Capture finished cleanly.');

