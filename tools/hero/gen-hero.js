const fs = require('fs'), path = require('path');
const W = 1600, H = 900, FR = 30, DUR = 90;
const MX = 980;                                  // tâm cụm hình, dịch phải để nhường chỗ tiêu đề
const INK = [0.031, 0.035, 0.039, 1];
const ACCENT = [0.667, 0.286, 0.275, 1];
const PAPER = [0.957, 0.961, 0.969, 1];

const val = k => ({ a: 0, k });
const LIN = { o: { x: [0.5], y: [0.5] }, i: { x: [0.5], y: [0.5] } };
const SMOOTH = { o: { x: [0.4], y: [0] }, i: { x: [0.6], y: [1] } };
const kf = (pairs, ease = SMOOTH) => ({
  a: 1,
  k: pairs.map(([t, s], i) => i === pairs.length - 1
    ? { t, s: [].concat(s) }
    : Object.assign({ t, s: [].concat(s) }, ease)),
});

const tr = () => ({ ty: 'tr', p: val([0, 0]), a: val([0, 0]), s: val([100, 100]), r: val(0), o: val(100), sk: val(0), sa: val(0) });
const grp = items => ({ ty: 'gr', np: items.length + 1, nm: 'g', it: items.concat([tr()]) });
const rect = (w, h, r = 0) => ({ ty: 'rc', d: 1, s: val([w, h]), p: val([0, 0]), r: val(r) });
const fill = (c, o = 100) => ({ ty: 'fl', c: val(c), o: val(o), r: 1, bm: 0, nm: 'f' });
// gradient fill: 3 chặng màu + 3 chặng alpha, tắt dần hai đầu nên cạnh không cứng
const softFill = (c, peak) => ({
  ty: 'gf', o: val(100), r: 1, bm: 0, t: 1, nm: 'gf',
  s: val([-280, 0]), e: val([280, 0]),
  g: { p: 3, k: val([0, c[0], c[1], c[2], 0.5, c[0], c[1], c[2], 1, c[0], c[1], c[2], 0, 0, 0.5, peak, 1, 0]) },
});

let ind = 0;
const layer = (nm, shapes, ks, ip = 0, op = DUR) => ({
  ddd: 0, ind: ++ind, ty: 4, nm, sr: 1, ao: 0, bm: 0, st: 0, ip, op,
  ks: Object.assign({ o: val(100), r: val(0), p: val([W / 2, H / 2, 0]), a: val([0, 0, 0]), s: val([100, 100, 100]) }, ks),
  shapes,
});

const LINES = [
  { y: 118, w: 420, h: 8 }, { y: 206, w: 300, h: 6 }, { y: 292, w: 520, h: 9 },
  { y: 604, w: 340, h: 7 }, { y: 688, w: 470, h: 8 }, { y: 772, w: 280, h: 6 },
  { y: 846, w: 380, h: 7 },
];
const lineLayers = LINES.map((L, i) => {
  const ip = 3 + i * 6, op = ip + 46;
  return layer('tia-' + (i + 1), [grp([rect(L.w, L.h, L.h / 2), fill(PAPER)])], {
    p: kf([[ip, [-420, L.y, 0]], [op, [W + 420, L.y, 0]]], LIN),
    o: kf([[ip, 0], [ip + 8, 11], [op - 10, 11], [op, 0]], LIN),
  }, ip, op);
});

const layers = [
  layer('quet-sang', [grp([rect(560, 1500), softFill(PAPER, 0.16)])], {
    r: val(-16),
    p: kf([[0, [-520, H / 2, 0]], [DUR, [W + 520, H / 2, 0]]], LIN),
  }),
  layer('chip-vs', [grp([rect(190, 190, 12), fill(ACCENT)])], {
    p: val([MX, H / 2, 0]),
    r: kf([[0, 45], [45, 51], [DUR, 45]]),
    s: kf([[0, [100, 100, 100]], [45, [106, 106, 100]], [DUR, [100, 100, 100]]]),
  }),
  layer('truc-giua', [grp([rect(4, 660), fill(PAPER)])], {
    p: val([MX, H / 2, 0]),
    o: kf([[0, 20], [45, 34], [DUR, 20]]),
  }),
  layer('khoi-trai', [grp([rect(300, 124, 6), fill(PAPER)])], {
    p: kf([[0, [MX - 324, H / 2, 0]], [45, [MX - 338, H / 2, 0]], [DUR, [MX - 324, H / 2, 0]]]),
  }),
  layer('khoi-phai', [grp([rect(300, 124, 6), fill(ACCENT)])], {
    o: val(74),
    p: kf([[0, [MX + 324, H / 2, 0]], [45, [MX + 338, H / 2, 0]], [DUR, [MX + 324, H / 2, 0]]]),
  }),
  ...lineLayers,
  layer('nen', [grp([rect(W, H), fill(INK)])], {}),
];

const lottie = { v: '5.12.2', fr: FR, ip: 0, op: DUR, w: W, h: H, nm: 'Kaizen Doi Kinh hero', ddd: 0, assets: [], layers, markers: [] };
fs.writeFileSync(path.resolve(__dirname, '../../posters/hero.json'), JSON.stringify(lottie));

/* ---- áp phích tĩnh: cùng hình học, chốt ở khung 45 ---- */
const hex = c => '#' + c.slice(0, 3).map(v => ('0' + Math.round(v * 255).toString(16)).slice(-2)).join('');
const midLine = (L, i) => {
  const ip = 3 + i * 6, op = ip + 46, p = (45 - ip) / (op - ip);
  if (p < 0 || p > 1) return '';
  const x = -420 + p * (W + 840);
  return `<rect x="${(x - L.w / 2).toFixed(0)}" y="${L.y - L.h / 2}" width="${L.w}" height="${L.h}" rx="${L.h / 2}" fill="${hex(PAPER)}" opacity="0.11"/>`;
};
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs><linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="${hex(PAPER)}" stop-opacity="0"/>
<stop offset="0.5" stop-color="${hex(PAPER)}" stop-opacity="0.16"/>
<stop offset="1" stop-color="${hex(PAPER)}" stop-opacity="0"/>
</linearGradient></defs>
<rect width="${W}" height="${H}" fill="${hex(INK)}"/>
${LINES.map(midLine).join('\n')}
<rect x="${MX + 174}" y="388" width="300" height="124" rx="6" fill="${hex(ACCENT)}" opacity="0.74"/>
<rect x="${MX - 474}" y="388" width="300" height="124" rx="6" fill="${hex(PAPER)}"/>
<rect x="${MX - 2}" y="120" width="4" height="660" fill="${hex(PAPER)}" opacity="0.34"/>
<g transform="translate(${MX},${H / 2}) rotate(51) scale(1.06)"><rect x="-95" y="-95" width="190" height="190" rx="12" fill="${hex(ACCENT)}"/></g>
<g transform="translate(720,${H / 2}) rotate(-16)"><rect x="-280" y="-750" width="560" height="1500" fill="url(#sweep)"/></g>
</svg>`;
fs.writeFileSync(path.join(__dirname, 'hero-poster.svg'), svg);
console.log('hero.json        ' + (JSON.stringify(lottie).length / 1024).toFixed(1) + ' KB, ' + layers.length + ' lớp');
