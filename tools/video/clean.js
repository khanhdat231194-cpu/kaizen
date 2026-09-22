// Buoc 1: xoa vat thua o tung frame.
// Gan nhan vung lien thong (4 huong) tren mat na pixel toi, GIU khoi lon nhat (nhan vat),
// xoa moi khoi roi. Vat thua xoay theo canh 3D nen khong the va bang mot hop co dinh.
// Vung xoa to lai bang TRUNG VI nen theo tung hang, khong phai mau phang: nen video dao
// dong 244-254, to phang 250 se lech toi 17 gia tri va lo thanh o sang.
// Dung: node clean.js <thu muc vao> <thu muc ra>
const sharp = require('sharp'), fs = require('fs'), path = require('path');
const [inDir, outDir] = process.argv.slice(2);
const DARK = 232;

(async () => {
  const files = fs.readdirSync(inDir).filter(f => f.endsWith('.png')).sort();
  let removedTotal = 0;
  for (const f of files) {
    const { data, info } = await sharp(path.join(inDir, f)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width: W, height: H, channels: C } = info, N = W * H;
    const dark = new Uint8Array(N);
    for (let i = 0, p = 0; i < N; i++, p += C) if ((data[p] + data[p + 1] + data[p + 2]) / 3 < DARK) dark[i] = 1;

    const lab = new Int32Array(N), stack = new Int32Array(N), sizes = [0];
    let cur = 0;
    for (let s = 0; s < N; s++) {
      if (!dark[s] || lab[s]) continue;
      cur++; let sp = 0, cnt = 0; stack[sp++] = s; lab[s] = cur;
      while (sp) {
        const q = stack[--sp]; cnt++;
        const x = q % W, y = (q - x) / W;
        if (x > 0     && dark[q - 1] && !lab[q - 1]) { lab[q - 1] = cur; stack[sp++] = q - 1; }
        if (x < W - 1 && dark[q + 1] && !lab[q + 1]) { lab[q + 1] = cur; stack[sp++] = q + 1; }
        if (y > 0     && dark[q - W] && !lab[q - W]) { lab[q - W] = cur; stack[sp++] = q - W; }
        if (y < H - 1 && dark[q + W] && !lab[q + W]) { lab[q + W] = cur; stack[sp++] = q + W; }
      }
      sizes[cur] = cnt;
    }
    let keep = 0, best = -1;
    for (let k = 1; k <= cur; k++) if (sizes[k] > best) { best = sizes[k]; keep = k; }

    const out = Buffer.from(data);
    for (let y = 0; y < H; y++) {
      const vals = [];
      for (let x = 0; x < W; x += 3) { const i = y * W + x; if (!dark[i]) vals.push((data[i * C] + data[i * C + 1] + data[i * C + 2]) / 3); }
      if (!vals.length) continue;
      vals.sort((a, b) => a - b);
      const bg = Math.round(vals[vals.length >> 1]);
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (lab[i] && lab[i] !== keep) { const p = i * C; out[p] = out[p + 1] = out[p + 2] = bg; removedTotal++; }
      }
    }
    await sharp(out, { raw: { width: W, height: H, channels: C } }).png({ compressionLevel: 6 }).toFile(path.join(outDir, f));
  }
  console.log('clean: ' + files.length + ' frame, xoa ' + removedTotal.toLocaleString('vi') + ' pixel');
})();
