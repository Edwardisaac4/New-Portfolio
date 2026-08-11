/**
 * Re-encodes the project preview videos to web-friendly H.264 (max 1280 wide, CRF 28, no audio).
 * Run with: npm run compress:videos
 *
 * NOTE: the source files below are intentionally NOT in the working tree — they were removed
 * once the `-opt.mp4` outputs were verified, to keep the deployed `public/` folder small.
 * To re-encode at different settings, restore them from git history first, e.g.
 *   git checkout 354ec6c -- "public/project videos" public/images
 * Missing inputs are skipped, so a bare run is a safe no-op.
 */
import { execSync } from 'child_process';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';

const videos = [
  { in: 'public/project videos/EAN.mp4', out: 'public/project videos/EAN-opt.mp4' },
  { in: 'public/project videos/Luxe.mp4', out: 'public/project videos/Luxe-opt.mp4' },
  { in: 'public/project videos/Portfolio.mp4', out: 'public/project videos/Portfolio-opt.mp4' },
  { in: 'public/project videos/SyntaxHire.mp4', out: 'public/project videos/SyntaxHire-opt.mp4' },
  { in: 'public/project videos/new gaming.mp4', out: 'public/project videos/new-gaming-opt.mp4' },
  { in: 'public/project videos/zentry clone.mp4', out: 'public/project videos/zentry-clone-opt.mp4' },
  { in: 'public/images/project3.mp4', out: 'public/images/project3-opt.mp4' },
];

console.log('Starting video compression using ffmpeg-static...\n');

let totalBefore = 0;
let totalAfter = 0;

for (const item of videos) {
  const inPath = path.resolve(item.in);
  const outPath = path.resolve(item.out);

  if (!fs.existsSync(inPath)) {
    console.log(`Skipping missing file: ${item.in}`);
    continue;
  }

  const beforeSize = fs.statSync(inPath).size;
  totalBefore += beforeSize;

  console.log(`Compressing ${item.in} (${(beforeSize / (1024 * 1024)).toFixed(2)} MB)...`);

  const cmd = `"${ffmpegPath}" -y -i "${inPath}" -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 28 -an -preset fast -pix_fmt yuv420p "${outPath}"`;

  try {
    execSync(cmd, { stdio: 'inherit' });
    const afterSize = fs.statSync(outPath).size;
    totalAfter += afterSize;

    const savedPct = (((beforeSize - afterSize) / beforeSize) * 100).toFixed(1);
    console.log(`✓ Done ${item.out}: ${(beforeSize / (1024 * 1024)).toFixed(2)} MB -> ${(afterSize / (1024 * 1024)).toFixed(2)} MB (${savedPct}% saved)\n`);
  } catch (err) {
    console.error(`Error compressing ${item.in}:`, err.message);
  }
}

console.log('==================================================');
if (totalBefore === 0) {
  console.log('No source videos found — nothing to do.');
  console.log('Restore the originals from git history to re-encode (see header comment).');
} else {
  console.log(`TOTAL BEFORE: ${(totalBefore / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`TOTAL AFTER:  ${(totalAfter / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`TOTAL SAVED:  ${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%`);
}
console.log('==================================================');
