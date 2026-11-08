import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const FPS = 60;
const TOTAL = 10;
const FRAMES = TOTAL * FPS;
const OUT_DIR = path.resolve('out/opener-frames');
const OUT_VIDEO = path.resolve('out/opener.mp4');
const BASE_URL = 'http://localhost:3000';

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const f of fs.readdirSync(OUT_DIR)) if (f.endsWith('.png')) fs.unlinkSync(path.join(OUT_DIR, f));

const server = spawn('npm', ['run', 'start'], { stdio: 'inherit', shell: true, cwd: process.cwd() });
await new Promise((r) => setTimeout(r, 6000));

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 3840, height: 2160 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

await page.goto(`${BASE_URL}/opener?render=1&t=0`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__openerReady === true, null, { timeout: 15000 });

for (let i = 0; i < FRAMES; i++) {
  const t = i / FPS;
  await page.evaluate((time) => window.__openerSeek(time), t);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const num = String(i).padStart(5, '0');
  await page.screenshot({ path: path.join(OUT_DIR, `frame_${num}.png`), type: 'png' });
  if (i % 60 === 0) console.log(`rendered ${i}/${FRAMES} (${t.toFixed(2)}s)`);
}

await browser.close();
server.kill();

console.log('Encoding with ffmpeg...');
const ff = spawn('ffmpeg', [
  '-y',
  '-framerate', String(FPS),
  '-i', path.join(OUT_DIR, 'frame_%05d.png'),
  '-c:v', 'libx264',
  '-preset', 'slow',
  '-crf', '16',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  OUT_VIDEO,
], { stdio: 'inherit' });
ff.on('close', (code) => {
  console.log('ffmpeg exit', code);
  process.exit(code ?? 0);
});
