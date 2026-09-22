const fs = require('fs');
const path = require('path');

const SITE = path.resolve(__dirname, '../..');

// CHOT CHAN: script nay dung lai toan bo posters/ tu template goc.
// Chay no la XOA cac ban va da lam sau do: he the, hero Lottie, con tro, man mo dau.
if (!process.argv.includes('--force')) {
  console.error('build-site.js se ghi de posters/ va xoa moi ban va lam sau. ' +
    'Chay lai voi --force neu chac chan, roi chay lai patches/ theo thu tu trong tools/README.md.');
  process.exit(1);
}
const BASE = 'https://khanhdat231194-cpu.github.io/kaizen';
const OUT = path.join(SITE, 'posters');

const pages = [
  { key:'focus',    name:'Focus',      accent:'#DCE3E8',
    caption:'Lưng dàn thành cánh, từng thớ cơ khắc bằng nét mực; chữ FOCUS uốn theo vòm sọ.' },
  { key:'artverse', name:'Artverse',   accent:'#C8342B',
    caption:'Mặt nạ đỏ sau lớp kính nứt, mỗi vết nứt thành một đường bắt sáng.' },
  { key:'whynotme', name:'Why Not Me', accent:'#EDEDED',
    caption:'Câu hỏi dựng thành ba tầng chữ, đôi tay băng trắng khoét ngang dòng giữa.' },
  { key:'mevsme',   name:'Me Vs Me',   accent:'#A9B2B8',
    caption:'Bốn lần ME VS ME xếp thành vách chữ vây quanh bộ giáp chiến binh.' },
];

const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

for (const p of pages) {
  const src = fs.readFileSync(path.join(__dirname, 'page-' + p.key + '.html'), 'utf8');
  const cut = src.indexOf('</style>');
  if (cut < 0) throw new Error('khong thay </style> trong ' + p.key);
  const head = src.slice(0, cut + 8);
  const body = src.slice(cut + 8);

  const dir = path.join(OUT, p.key);
  fs.mkdirSync(dir, { recursive: true });

  const doc = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="dark">
<meta name="description" content="${esc(p.caption)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(p.name)} — bích chương sống">
<meta property="og:description" content="${esc(p.caption)}">
<meta property="og:image" content="${BASE}/posters/${p.key}/art.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="art.jpg">
${head}
</head>
<body>
${body}
</body>
</html>
`;
  fs.writeFileSync(path.join(dir, 'index.html'), doc, 'utf8');
  // Anh goc: bo vao tools/posters/src/<key>.jpg thi dung, khong thi giu art.jpg dang co.
  const srcImg = path.join(__dirname, 'src', p.key + '.jpg');
  if (fs.existsSync(srcImg)) fs.copyFileSync(srcImg, path.join(dir, 'art.jpg'));
  console.log('posters/' + p.key + '/  ' + (doc.length/1024).toFixed(1) + ' KB + art.jpg');
}

/* ---- trang tổng ---- */
const cards = pages.map((p, i) => `      <a class="card" href="${p.key}/" style="--ac:${p.accent}">
        <span class="thumb"><img src="${p.key}/art.jpg" alt="${esc(p.name)}" loading="${i < 2 ? 'eager' : 'lazy'}"></span>
        <span class="meta">
          <b><i>0${i + 1}</i> ${esc(p.name)}</b>
          <em>${esc(p.caption)}</em>
        </span>
      </a>`).join('\n');

const hub = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="dark">
<title>Bốn Bích Chương Sống</title>
<meta name="description" content="Bon bich chuong manga voi lop nghieng theo con tro, den re va bang cai dat chuyen dong.">
<meta property="og:type" content="website">
<meta property="og:title" content="Bốn bích chương sống">
<meta property="og:description" content="Nghiêng theo con trỏ, đèn rê, vệt sáng quét — mỗi trang có bảng cài đặt riêng.">
<meta property="og:image" content="${BASE}/posters/focus/art.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="focus/art.jpg">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
  :root{--ink:#07080A;--panel:#12151A;--line:#242A31;--fg:#EBEDF0;--fg-dim:#8A929B;
    --mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
    --body:Archivo,"Helvetica Neue",Helvetica,Arial,sans-serif;
    --display:Anton,Haettenschweiler,Impact,"Arial Narrow",sans-serif}
  *{box-sizing:border-box}
  body{margin:0;background:var(--ink);color:var(--fg);font-family:var(--body);line-height:1.5;-webkit-font-smoothing:antialiased}
  .wrap{max-width:1060px;margin:0 auto;padding-inline:20px;padding-block:34px 60px}
  .eyebrow{margin:0;font-family:var(--mono);font-size:10.5px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--fg-dim)}
  h1{font-family:var(--display);font-weight:400;font-size:clamp(34px,7vw,58px);line-height:.96;margin:11px 0 0;text-transform:uppercase}
  .lede{margin:13px 0 0;max-width:58ch;color:var(--fg-dim);font-size:15px}
  hr{border:0;height:1px;background:var(--line);margin:28px 0 26px}
  .grid{display:grid;gap:16px;grid-template-columns:1fr}
  @media (min-width:620px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  .card{display:flex;gap:14px;align-items:center;text-decoration:none;color:inherit;
    background:var(--panel);border:1px solid var(--line);border-radius:5px;padding:12px;transition:border-color .16s,transform .16s}
  .card:hover{border-color:var(--ac);transform:translateY(-2px)}
  .card:focus-visible{outline:2px solid var(--ac);outline-offset:3px}
  .thumb{flex:0 0 78px;width:78px;aspect-ratio:736/1308;border-radius:3px;overflow:hidden;background:#000;box-shadow:0 0 0 1px rgba(255,255,255,.06)}
  .thumb img{width:100%;height:100%;object-fit:cover;display:block}
  .meta{display:flex;flex-direction:column;gap:5px;min-width:0}
  .meta b{font-size:15px;font-weight:700;display:flex;align-items:baseline;gap:8px}
  .meta i{font-family:var(--mono);font-style:normal;font-size:11px;color:var(--ac);font-variant-numeric:tabular-nums}
  .meta em{font-style:normal;font-size:12.5px;color:var(--fg-dim)}
  footer{margin-top:34px;border-top:1px solid var(--line);padding-top:16px;color:var(--fg-dim);font-size:12px;max-width:74ch}
  footer a{color:var(--fg)}
  @media (prefers-reduced-motion:reduce){.card{transition:none}.card:hover{transform:none}}
</style>
</head>
<body>
  <div class="wrap">
    <header>
      <p class="eyebrow">Bốn trang · một bảng điều khiển mỗi trang</p>
      <h1>Bốn Bích Chương Sống</h1>
      <p class="lede">Mỗi tấm nghiêng theo con trỏ, có đèn rê bám chuột và vệt sáng quét ngang mặt giấy. Bảng cài đặt trong từng trang cho bạn chỉnh biên độ lắc, tốc độ, cường độ đèn và chất phim — thiết lập lưu lại trên máy bạn.</p>
    </header>
    <hr>
    <div class="grid">
${cards}
    </div>
    <footer>
      <p>Ảnh gốc do chủ trang cung cấp; các trang này chỉ dựng lớp chuyển động và ánh sáng lên trên, không sửa vào ảnh. Máy nào bật chế độ giảm chuyển động thì phần lắc tự tắt. Xem thêm <a href="../">trang nhận diện Đối Kính</a>.</p>
    </footer>
  </div>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, 'index.html'), hub, 'utf8');
console.log('posters/index.html  ' + (hub.length/1024).toFixed(1) + ' KB');
