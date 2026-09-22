const fs = require('fs');
const path = require('path');
const SITE = path.resolve(__dirname, '../..');

const CSS = `
  /* --- Hé thẻ khi hàng cuộn vào tầm nhìn --- */
  /* Mặc định thẻ hiện bình thường: không JS, hoặc bật giảm chuyển động, thì không bao giờ bị ẩn. */
  :root.reveal-on .reveal-row > *{opacity:0}
  :root.reveal-on .reveal-row.is-in > *{
    animation:reveal-up 520ms cubic-bezier(.16,1,.3,1) both;
    animation-delay:calc(var(--i,0) * 120ms);
  }
  /* Xong thì nhả animation ra, để transform trở về cho hover dùng. */
  :root.reveal-on .reveal-row.is-done > *{animation:none;opacity:1}
  @keyframes reveal-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
  @media (prefers-reduced-motion:reduce){
    :root.reveal-on .reveal-row > *,
    :root.reveal-on .reveal-row.is-in > *{animation:none;opacity:1;transform:none}
  }
`;

const JS = `
<script>
(function(){
  "use strict";
  var rows = document.querySelectorAll(".reveal-row");
  if (!rows.length) return;
  var each = function(list, fn){ Array.prototype.forEach.call(list, fn); };

  each(rows, function(row){
    each(row.children, function(el, i){ el.style.setProperty("--i", i); });
  });

  function revealNow(list){
    each(list, function(row){
      if (row.dataset.revealed) return;
      row.dataset.revealed = "1";
      row.classList.add("is-in", "is-done");
    });
  }

  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch(e){}
  if (reduce || !("IntersectionObserver" in window)) { revealNow(rows); return; }

  document.documentElement.classList.add("reveal-on");

  var sawCallback = false;
  var io = new IntersectionObserver(function(entries, obs){
    sawCallback = true;
    entries.forEach(function(en){
      if (!en.isIntersecting) return;
      if (en.target.dataset.revealed) return;
      en.target.dataset.revealed = "1";
      en.target.classList.add("is-in");
      obs.unobserve(en.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

  each(rows, function(row){
    io.observe(row);
    row.addEventListener("animationend", function(e){
      if (e.target === row.lastElementChild) row.classList.add("is-done");
    });
  });

  setTimeout(function(){ if (!sawCallback) revealNow(rows); }, 2000);
})();
</script>
`;

const targets = [
  { file: 'posters/index.html', from: '<div class="grid">',  to: '<div class="grid reveal-row">' },
  { file: 'index.html',         from: '<div class="tests">', to: '<div class="tests reveal-row">' },
];

for (const t of targets) {
  const p = path.join(SITE, t.file);
  let s = fs.readFileSync(p, 'utf8');
  if (s.indexOf('reveal-row') >= 0) { console.log(t.file + ': da co, bo qua'); continue; }

  if (s.indexOf(t.from) < 0) throw new Error(t.file + ': khong thay ' + t.from);
  s = s.replace(t.from, t.to);

  const styleEnd = s.lastIndexOf('</style>');
  if (styleEnd < 0) throw new Error(t.file + ': khong thay </style>');
  s = s.slice(0, styleEnd) + CSS + s.slice(styleEnd);

  const bodyEnd = s.lastIndexOf('</body>');
  if (bodyEnd < 0) throw new Error(t.file + ': khong thay </body>');
  s = s.slice(0, bodyEnd) + JS + s.slice(bodyEnd);

  fs.writeFileSync(p, s, 'utf8');

  const n = (s.match(/reveal-row/g) || []).length;
  console.log(t.file + ': xong, ' + n + ' cho nhac reveal-row, ' + (s.length/1024).toFixed(1) + ' KB');
}
