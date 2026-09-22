// Render ap phich tinh cua hero tu hero-poster.svg (do gen-hero.js sinh ra).
// Anh nay dung cho man hep duoi 768px va khi bat giam chuyen dong.
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const svg = fs.readFileSync(path.join(__dirname, 'hero-poster.svg'), 'utf8');
const r = new Resvg(svg, { fitTo: { mode: 'width', value: 1600 } });
const png = r.render().asPng();
const out = path.resolve(__dirname, '../../posters/hero-poster.png');
fs.writeFileSync(out, png);
console.log('hero-poster.png  ' + (png.length / 1024).toFixed(1) + ' KB');
