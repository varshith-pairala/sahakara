import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgPath = path.resolve(process.cwd(), 'public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  console.log('Generating PWA PNG icons from icon.svg...');

  // 192x192 standard icon
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve(process.cwd(), 'public/pwa-192x192.png'));

  // 512x512 standard icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve(process.cwd(), 'public/pwa-512x512.png'));

  // 512x512 maskable icon with safe zone padding (10%)
  await sharp(svgBuffer)
    .resize(410, 410)
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: '#064e3b'
    })
    .png()
    .toFile(path.resolve(process.cwd(), 'public/pwa-maskable-512x512.png'));

  // 180x180 Apple touch icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve(process.cwd(), 'public/apple-touch-icon.png'));

  console.log('PWA icons successfully generated!');
}

generate().catch(err => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
