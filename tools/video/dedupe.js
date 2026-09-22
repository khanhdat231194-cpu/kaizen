// Buoc 2: bo frame lap. Video Dreamina khai container 60fps nhung chuyen dong chi ~24fps,
// tuc frame bi giu lap. Phai loc ra frame duy nhat thi noi suy 60fps moi muot that.
// Dung: node dedupe.js <thu muc vao> <thu muc ra>   -> in ra so frame duy nhat
const sharp = require('sharp'), fs = require('fs'), path = require('path');
const [inDir, outDir] = process.argv.slice(2);
const THRESH = 0.6;   // lech trung binh /255 tren ban xam thu nho, do tren video goc

(async () => {
  const files = fs.readdirSync(inDir).filter(f => f.endsWith('.png')).sort();
  let prev = null, kept = 0;
  for (const f of files) {
    const g = await sharp(path.join(inDir, f)).greyscale().resize(176).raw().toBuffer();
    let diff = 0;
    if (prev) for (let i = 0; i < g.length; i++) diff += Math.abs(g[i] - prev[i]);
    if (!prev || diff / g.length > THRESH) {
      kept++;
      fs.copyFileSync(path.join(inDir, f), path.join(outDir, 'u' + String(kept).padStart(4, '0') + '.png'));
      prev = g;
    }
  }
  console.log(kept);
})();
