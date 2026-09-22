const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const FONTS = [
  path.join(__dirname, 'fonts', 'Anton-Regular.ttf'),
  path.join(__dirname, 'fonts', 'Archivo.ttf'),
];
const OUT = path.resolve(__dirname, '../../assets');
fs.mkdirSync(OUT, { recursive: true });

const A = '#AA4946';
const INK = '#08090A';
const PAPER = '#F4F5F7';

// Thân mark, khổ gốc 400x250. fg = màu chữ chính.
function mark(fg) {
  return `
  <line x1="200" y1="52" x2="200" y2="196" stroke="${fg}" stroke-width="2" opacity="0.22"/>
  <text x="168" y="150" font-family="Anton" font-size="50" text-anchor="end" fill="${fg}">KAIZEN</text>
  <g transform="translate(400,0) scale(-1,1)">
    <text x="168" y="150" font-family="Anton" font-size="50" text-anchor="end" fill="${A}" opacity="0.62">KAIZEN</text>
  </g>
  <g transform="translate(200,131) rotate(45)"><rect x="-17" y="-17" width="34" height="34" fill="${A}"/></g>
  <text x="200" y="137" font-family="Anton" font-size="16" text-anchor="middle" fill="#FFFFFF">VS</text>
  <text x="200" y="226" font-family="Archivo" font-size="11" font-weight="600" letter-spacing="5" text-anchor="middle" fill="${fg}" opacity="0.6">ME VS ME</text>`;
}

// Icon vuông: K và K phản chiếu quanh chip VS.
function icon(bg, fg) {
  const plate = bg ? `<rect width="200" height="200" fill="${bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">${plate}
  <line x1="100" y1="44" x2="100" y2="156" stroke="${fg}" stroke-width="3" opacity="0.22"/>
  <text x="74" y="126" font-family="Anton" font-size="70" text-anchor="end" fill="${fg}">K</text>
  <g transform="translate(200,0) scale(-1,1)">
    <text x="74" y="126" font-family="Anton" font-size="70" text-anchor="end" fill="${A}" opacity="0.62">K</text>
  </g>
  <g transform="translate(100,101) rotate(45)"><rect x="-14" y="-14" width="28" height="28" fill="${A}"/></g>
  <text x="100" y="106" font-family="Anton" font-size="14" text-anchor="middle" fill="#FFFFFF">VS</text>
</svg>`;
}

const jobs = [
  { name: 'preview.png', width: 1200,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="${INK}"/>
      <g transform="translate(200,65) scale(2)">${mark(PAPER)}</g></svg>` },

  { name: 'logo-for-dark.png', width: 1200,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250">${mark(PAPER)}</svg>` },

  { name: 'logo-for-light.png', width: 1200,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250">${mark(INK)}</svg>` },

  { name: 'icon-512.png', width: 512, svg: icon(INK, PAPER) },

  { name: 'icon-512-transparent.png', width: 512, svg: icon(null, PAPER) },
];

for (const job of jobs) {
  const r = new Resvg(job.svg, {
    font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Anton' },
    fitTo: { mode: 'width', value: job.width },
  });
  const png = r.render().asPng();
  fs.writeFileSync(path.join(OUT, job.name), png);
  const d = r.render();
  console.log(`${job.name.padEnd(28)} ${d.width}x${d.height}  ${(png.length/1024).toFixed(1)} KB`);
}
console.log('\nthu muc: ' + OUT);
