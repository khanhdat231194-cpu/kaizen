// Buoc 3 (tuy chon): dung vong lap mot huong lien mach.
// Video goc KHONG khep kin 360 do. Script tu tim frame khop nhat voi frame dau lam diem cat,
// roi hoa tan N frame DAU chuoi voi N frame DUOI: bat dau chu yeu la duoi, chuyen dan
// sang dau — nhu vay no bac qua dung diem noi.
// Hoa tan vao DUOI (lam nguoc) thi diem noi van ho, vi frame cuoi luc do gan bang frame
// N+1 chu khong phai frame 1. Da mac loi nay mot lan.
// Dung: node crossfade.js <thu muc frame duy nhat> <thu muc ra> [N=12]
const sharp = require('sharp'), fs = require('fs'), path = require('path');
const [inDir, outDir, nArg] = process.argv.slice(2);
const N = parseInt(nArg || '12', 10);

(async () => {
  const files = fs.readdirSync(inDir).filter(f => f.endsWith('.png')).sort();
  const src = i => path.join(inDir, files[i - 1]);
  const dst = i => path.join(outDir, 'x' + String(i).padStart(4, '0') + '.png');
  const sig = f => sharp(f).greyscale().resize(120).raw().toBuffer();
  const diff = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]); return s / a.length; };

  // diem khep vong: frame khop nhat voi frame 1, bo qua 30 frame dau
  const first = await sig(src(1));
  let L = 0, bestD = 1e9;
  for (let i = 31; i <= files.length; i++) { const d = diff(first, await sig(src(i))); if (d < bestD) { bestD = d; L = i; } }
  const raw = diff(first, await sig(src(files.length)));

  const LOOP = L - N;
  for (let k = 1; k <= N; k++) {
    const w = k / (N + 1);
    const head = await sharp(src(k)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const tail = await sharp(src(L - N + k)).ensureAlpha().raw().toBuffer();
    const { width: W, height: H, channels: C } = head.info, out = Buffer.alloc(W * H * C);
    for (let j = 0; j < W * H * C; j++) out[j] = Math.round(tail[j] * (1 - w) + head.data[j] * w);
    await sharp(out, { raw: { width: W, height: H, channels: C } }).png({ compressionLevel: 6 }).toFile(dst(k));
  }
  for (let k = N + 1; k <= LOOP; k++) fs.copyFileSync(src(k), dst(k));

  const seam = diff(await sig(dst(LOOP)), await sig(dst(1)));
  console.log('diem cat: frame ' + L + ' (lech ' + bestD.toFixed(2) + ')');
  console.log('lech diem noi: chua xu ly ' + raw.toFixed(2) + ' -> sau hoa tan ' + seam.toFixed(2) + (seam < 8 ? ' (du kin)' : ' (VAN THAY)'));
  console.log('vong lap ' + LOOP + ' frame');
})();
