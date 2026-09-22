const fs = require('fs'), path = require('path');
const SITE = path.resolve(__dirname, '../..');
const FILES = ['index.html', 'posters/index.html', 'posters/focus/index.html',
  'posters/artverse/index.html', 'posters/whynotme/index.html', 'posters/mevsme/index.html'];

const CSS = `
  /* --- Con trỏ dấu ấn: điểm dẫn trước, vòng trễ đàn hồi --- */
  /* cursor:none chỉ tồn tại sau khi JS gắn .cur-on, nên JS chết là con trỏ hệ thống trở lại */
  :root.cur-on, :root.cur-on *{cursor:none}
  .cur{position:fixed;top:0;left:0;z-index:9999;pointer-events:none;opacity:0;
    transition:opacity .18s linear;
    --cur-c:var(--brand, var(--accent, #AA4946))}
  :root.cur-ready .cur{opacity:1}
  .cur-dot{width:5px;height:5px;border-radius:50%;background:var(--cur-c);
    transition:width .18s ease,height .18s ease,opacity .18s ease}
  .cur-ring{width:30px;height:30px;border-radius:50%;border:1.5px solid var(--cur-c);
    transition:width .22s cubic-bezier(.16,1,.3,1),height .22s cubic-bezier(.16,1,.3,1),
      border-radius .22s ease,border-width .18s ease,background-color .22s ease,opacity .18s ease}
  /* phình ra trên liên kết */
  :root.cur-link .cur-ring{width:56px;height:56px;border-width:1px;
    background:transparent;background:color-mix(in srgb, var(--cur-c) 12%, transparent)}
  :root.cur-link .cur-dot{opacity:.35}
  /* hoá thành vạch nháy trên ô nhập chữ, cao theo cỡ chữ của chính ô đó */
  :root.cur-text .cur-ring{width:2px;height:var(--cur-bar,22px);border-radius:1px;
    border-width:0;background:var(--cur-c)}
  :root.cur-text .cur-dot{opacity:0}
  /* phản hồi lúc nhấn */
  :root.cur-down .cur-ring{border-width:2.5px}
  :root.cur-down .cur-dot{width:8px;height:8px}
  @media (prefers-reduced-motion:reduce){
    .cur,.cur-dot,.cur-ring{transition:none}
  }
`;

const JS = `<script>
(function(){
  "use strict";
  var root = document.documentElement;

  // 1. Thiết bị cảm ứng: giữ nguyên con trỏ hệ thống, không dựng gì cả.
  var fine = false;
  try { fine = matchMedia("(hover: hover) and (pointer: fine)").matches; } catch(e){}
  if (!fine) return;

  // 2. Máy yếu: bản thường, không hiệu ứng sống.
  var cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores > 0 && cores < 4) return;

  // 3. Giảm chuyển động: vẫn có con trỏ nhưng tĩnh — không lò xo, không trễ.
  var reduce = false;
  try { reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch(e){}

  var ring = document.createElement("div");
  ring.className = "cur cur-ring"; ring.setAttribute("aria-hidden", "true");
  var dot = document.createElement("div");
  dot.className = "cur cur-dot"; dot.setAttribute("aria-hidden", "true");
  document.body.appendChild(ring);
  document.body.appendChild(dot);
  root.classList.add("cur-on");

  var LINKS = 'a,button,[role="button"],summary,label,.btn,.chip,.card,.tone,.hue,input[type="checkbox"],input[type="range"]';
  var TEXTS = 'input[type="text"],input[type="search"],input[type="email"],input[type="url"],textarea,[contenteditable="true"]';

  var tx = 0, ty = 0;                  // vị trí trỏ thật
  var rx = 0, ry = 0, vx = 0, vy = 0;  // vòng: có vận tốc nên nảy nhẹ rồi lắng
  var dx = 0, dy = 0;                  // điểm: bám sát, dẫn trước vòng
  var seen = false, running = false, acc = 0, last = 0;
  var STEP = 1000 / 60, K = 0.16, D = 0.76, LEAD = 0.5;

  function place(el, x, y){
    el.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0) translate(-50%,-50%)";
  }

  function onMove(e){
    tx = e.clientX; ty = e.clientY;
    if (!seen) { seen = true; rx = dx = tx; ry = dy = ty; root.classList.add("cur-ready"); }
    if (reduce) { place(ring, tx, ty); place(dot, tx, ty); return; }
    start();
  }

  // Bước thời gian cố định: cảm giác lò xo không đổi giữa màn 60Hz và 120Hz.
  function frame(now){
    var dt = last ? now - last : STEP;
    last = now;
    acc = Math.min(acc + dt, 120);
    while (acc >= STEP) {
      vx += (tx - rx) * K; vy += (ty - ry) * K;
      vx *= D; vy *= D;
      rx += vx; ry += vy;
      dx += (tx - dx) * LEAD; dy += (ty - dy) * LEAD;
      acc -= STEP;
    }
    place(ring, rx, ry);
    place(dot, dx, dy);
    if (Math.abs(tx - rx) < 0.1 && Math.abs(ty - ry) < 0.1 && Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1) {
      running = false; last = 0;          // lắng rồi thì thôi quay vòng, đỡ pin
    } else {
      requestAnimationFrame(frame);
    }
  }
  function start(){ if (running) return; running = true; last = 0; requestAnimationFrame(frame); }

  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerdown", function(){ root.classList.add("cur-down"); });
  document.addEventListener("pointerup", function(){ root.classList.remove("cur-down"); });

  document.addEventListener("pointerover", function(e){
    var t = e.target;
    if (!t || t.nodeType !== 1) return;
    var box = t.closest(TEXTS);
    if (box) {
      var fs = parseFloat(getComputedStyle(box).fontSize) || 16;
      root.style.setProperty("--cur-bar", (fs * 1.35).toFixed(1) + "px");
      root.classList.add("cur-text");
      root.classList.remove("cur-link");
      return;
    }
    root.classList.remove("cur-text");
    if (t.closest(LINKS)) root.classList.add("cur-link");
    else root.classList.remove("cur-link");
  });

  function hide(){ root.classList.remove("cur-ready"); seen = false; }
  document.addEventListener("pointerleave", hide);
  window.addEventListener("blur", hide);
})();
</script>
`;

let done = 0;
for (const f of FILES) {
  const p = path.join(SITE, f);
  let s = fs.readFileSync(p, 'utf8');
  if (s.indexOf('cur-ring') >= 0) { console.log(f.padEnd(30) + 'da co, bo qua'); continue; }
  const st = s.lastIndexOf('</style>');
  if (st < 0) throw new Error(f + ': khong thay </style>');
  s = s.slice(0, st) + CSS + s.slice(st);
  const be = s.lastIndexOf('</body>');
  if (be < 0) throw new Error(f + ': khong thay </body>');
  s = s.slice(0, be) + JS + s.slice(be);
  fs.writeFileSync(p, s, 'utf8');
  console.log(f.padEnd(30) + (s.length / 1024).toFixed(1) + ' KB');
  done++;
}
console.log('\nda va ' + done + '/' + FILES.length + ' trang');
