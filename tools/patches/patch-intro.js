const fs = require("fs");
const P = process.argv[2];
let s = fs.readFileSync(P, "utf8");
if (s.indexOf("intro-splash") >= 0) { console.log("da co man mo dau, bo qua"); process.exit(0); }

const CSS = `
  /* --- Man mo dau: video xoay chay mot luot roi mo dan de trang chinh hien ra --- */
  /* Man nay chi ton tai khi JS dung no, nen JS chet thi trang hien binh thuong. */
  .intro-splash{position:fixed;inset:0;z-index:9000;display:grid;place-items:center;overflow:hidden;
    background:radial-gradient(130% 90% at 50% 42%, #FAFAFA 38%, #F4F5F7 100%);
    opacity:1;transition:opacity .9s cubic-bezier(.4,0,.2,1)}
  .intro-splash.is-out{opacity:0;pointer-events:none}
  .intro-sway{height:100%;width:auto;aspect-ratio:704/1248;max-width:100%;max-height:100%;
    transform:translateX(2.66%);animation:intro-sway 17s ease-in-out infinite}
  .intro-film{width:100%;height:100%;animation:intro-breathe 5.2s linear infinite}
  .intro-film video{width:100%;height:100%;object-fit:contain;display:block;
    filter:grayscale(1) contrast(1.03);animation:intro-ink 7.3s ease-in-out infinite alternate}
  @keyframes intro-sway{0%,100%{transform:translateX(2.66%)}50%{transform:translateX(2.66%) translateX(-.35%)}}
  @keyframes intro-breathe{
    0%{transform:translateY(0) scale(1);animation-timing-function:cubic-bezier(.33,.66,.3,1)}
    36%{transform:translateY(-.6%) scale(1.017);animation-timing-function:cubic-bezier(.45,0,.55,1)}
    45%{transform:translateY(-.52%) scale(1.015);animation-timing-function:cubic-bezier(.4,0,.22,1)}
    100%{transform:translateY(0) scale(1)}
  }
  @keyframes intro-ink{from{filter:grayscale(1) contrast(1.03)}to{filter:grayscale(1) contrast(1.15)}}
  .intro-skip{position:absolute;z-index:2;
    right:calc(18px + env(safe-area-inset-right,0px));bottom:calc(22px + env(safe-area-inset-bottom,0px));
    font:600 11.5px/1 var(--body);letter-spacing:.06em;padding:9px 14px;border-radius:2px;
    border:1px solid rgba(8,9,10,.22);background:rgba(250,250,250,.72);color:#41474F;cursor:pointer}
  .intro-skip:hover{border-color:#08090A;color:#08090A}
  .intro-skip:focus-visible{outline:2px solid #08090A;outline-offset:2px}
  .intro-bar{position:absolute;left:0;bottom:0;z-index:2;width:100%;height:2px;background:rgba(8,9,10,.08)}
  .intro-bar i{display:block;width:100%;height:100%;background:#08090A;transform-origin:left;transform:scaleX(0)}
  :root.intro-on,:root.intro-on body{overflow:hidden}
  @media (prefers-reduced-motion:reduce){.intro-splash{transition:none}}
`;

const INTRO = `<script>
(function(){
  "use strict";
  var root = document.documentElement;

  // Bo qua man mo dau khi nguoi dung khong muon chuyen dong hoac dang tiet kiem du lieu.
  var skip = false;
  try { skip = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch(e){}
  try { if (navigator.connection && navigator.connection.saveData) skip = true; } catch(e){}
  if (skip) return;

  var done = false, raf = 0, stall = 0, el, video, bar;

  // Moi loi thoat deu di qua day va LUON phat su kien intro-done,
  // de script he the phia duoi khong bao gio doi mai.
  function finish(){
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    clearTimeout(stall);
    if (el) {
      el.classList.add("is-out");
      setTimeout(function(){ if (el && el.parentNode) el.parentNode.removeChild(el); }, 950);
    }
    root.classList.remove("intro-on");
    try { document.dispatchEvent(new CustomEvent("kaizen:intro-done")); } catch(e){}
  }

  try {
    el = document.createElement("div");
    el.className = "intro-splash";
    el.setAttribute("role", "presentation");
    el.innerHTML =
      '<div class="intro-sway"><div class="intro-film">' +
        '<video src="intro.mp4" poster="intro-poster.webp" muted playsinline autoplay preload="auto" aria-hidden="true"></video>' +
      '</div></div>' +
      '<button class="intro-skip" type="button">Bỏ qua</button>' +
      '<div class="intro-bar" aria-hidden="true"><i></i></div>';
    document.body.insertBefore(el, document.body.firstChild);
    video = el.querySelector("video");
    bar = el.querySelector(".intro-bar i");
    root.classList.add("intro-on");
  } catch (e) { finish(); return; }

  // Chay het mot luot thi mo dan.
  video.addEventListener("ended", finish);
  video.addEventListener("error", finish);
  el.querySelector(".intro-skip").addEventListener("click", finish);
  document.addEventListener("keydown", function(e){ if (e.key === "Escape") finish(); });

  // Thanh tien do bam dung currentTime cua video, khong doan theo dong ho.
  function tick(){
    if (done) return;
    if (video.duration) bar.style.transform = "scaleX(" + (video.currentTime / video.duration).toFixed(4) + ")";
    raf = requestAnimationFrame(tick);
  }
  video.addEventListener("playing", function(){
    clearTimeout(stall);
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  });

  // Video khong khoi dong duoc thi khong nhot nguoi dung truoc man trang.
  // Chi tinh gio khi trang dang duoc xem; tab nen thi doi.
  function armStall(){
    clearTimeout(stall);
    stall = setTimeout(function(){
      if (done) return;
      if (document.visibilityState === "hidden") { waitVisible(); return; }
      if (video.paused || video.readyState < 3) finish();
    }, 4000);
  }
  function waitVisible(){
    document.addEventListener("visibilitychange", function once(){
      if (document.visibilityState === "hidden") return;
      document.removeEventListener("visibilitychange", once);
      armStall();
    });
  }
  if (document.visibilityState === "hidden") waitVisible(); else armStall();

  // Autoplay bi chan thi di thang vao trang, khong bat cho 4 giay.
  var p = video.play && video.play();
  if (p && p.catch) p.catch(finish);
})();
</script>
`;

// 1. CSS
const st = s.lastIndexOf("</style>");
if (st < 0) throw new Error("khong thay </style>");
s = s.slice(0, st) + CSS + s.slice(st);

// 2. Script man mo dau ngay sau <body>: man che phai co mat truoc lan ve dau tien,
//    khong thi trang chinh loe len mot khung roi moi bi che.
const bo = s.indexOf("<body>");
if (bo < 0) throw new Error("khong thay <body>");
s = s.slice(0, bo + 6) + "\n" + INTRO + s.slice(bo + 6);

// 3. He the doi man mo dau. Thay dong khoi dong CUOI truoc, roi moi boc khoi observe,
//    vi sau buoc boc thi dong do se xuat hien hai lan.
const B = `  if (document.visibilityState === "hidden") { waitForVisible(); } else { armFailsafe(); }
})();`;
const bi = s.lastIndexOf(B);
if (bi < 0) throw new Error("khong thay dong khoi dong he the");
const B2 = `  if (document.documentElement.classList.contains("intro-on")) {
    document.addEventListener("kaizen:intro-done", begin, { once: true });
  } else {
    begin();
  }
})();`;
s = s.slice(0, bi) + B2 + s.slice(bi + B.length);

const A = `  each(rows, function(row){
    io.observe(row);
    row.addEventListener("animationend", function(e){
      if (e.target === row.lastElementChild) row.classList.add("is-done");
    });
  });
`;
if (s.indexOf(A) < 0) throw new Error("khong thay khoi observe");
const A2 = `  // Bat dau theo doi. Man mo dau dang chay thi doi no xong: khong thi hang the
  // he xong sau lung man video va nguoi xem khong bao gio thay hieu ung.
  function begin(){
    each(rows, function(row){
      io.observe(row);
      row.addEventListener("animationend", function(e){
        if (e.target === row.lastElementChild) row.classList.add("is-done");
      });
    });
    if (document.visibilityState === "hidden") { waitForVisible(); } else { armFailsafe(); }
  }
`;
s = s.replace(A, A2);

fs.writeFileSync(P, s, "utf8");
console.log("da va: " + (s.length / 1024).toFixed(1) + " KB");

// KIEM CU PHAP tung khoi script: chi parse, khong chay
const scripts = [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let bad = 0;
scripts.forEach((code, i) => {
  try { new Function(code); console.log("  script " + (i + 1) + "/" + scripts.length + ": cu phap OK"); }
  catch (e) { bad++; console.log("  script " + (i + 1) + ": LOI -> " + e.message); }
});
if (bad) process.exitCode = 1;
