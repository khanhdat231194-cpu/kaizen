const fs = require('fs');
const P = require('path').resolve(__dirname, '../../posters/index.html');
let s = fs.readFileSync(P, 'utf8');
if (s.indexOf('hero-anim') >= 0) { console.log('da co hero, bo qua'); process.exit(0); }

// rút ba mảnh chữ từ header cũ rồi bỏ header + hr
const m = s.match(/[ \t]*<header>\s*<p class="eyebrow">([\s\S]*?)<\/p>\s*<h1>([\s\S]*?)<\/h1>\s*<p class="lede">([\s\S]*?)<\/p>\s*<\/header>\s*<hr>\n/);
if (!m) throw new Error('khong tach duoc header cu');
const [block, eyebrow, h1, lede] = m;
s = s.replace(block, '');

const CSS = `
  /* --- Hero tràn lề, hình động Lottie làm hậu cảnh --- */
  .hero{position:relative;isolation:isolate;min-height:clamp(420px,64vh,660px);display:grid;align-items:end;overflow:hidden;background:var(--ink)}
  .hero-media{position:absolute;inset:0;z-index:0}
  .hero-poster,.hero-anim{position:absolute;inset:0;width:100%;height:100%}
  .hero-poster{object-fit:cover;display:block}
  .hero-anim{opacity:0;transition:opacity .55s ease}
  .hero-anim.on{opacity:1}
  .hero-anim svg{display:block;width:100%!important;height:100%!important}
  /* chuyển màu tối phía sau chữ: ngang cho màn rộng, dọc cho màn hẹp */
  .hero-scrim{position:absolute;inset:0;z-index:1;pointer-events:none;
    background:linear-gradient(100deg, rgba(7,8,10,.96) 0%, rgba(7,8,10,.9) 34%, rgba(7,8,10,.36) 66%, rgba(7,8,10,.08) 100%),
               linear-gradient(to top, rgba(7,8,10,.93) 0%, rgba(7,8,10,0) 54%)}
  .hero-copy{position:relative;z-index:2;width:100%;max-width:1060px;margin:0 auto;
    padding:clamp(24px,5vw,54px) 20px clamp(26px,5vw,50px)}
  .hero-copy h1{font-size:clamp(38px,8.4vw,74px)}
  .hero-copy .lede{max-width:46ch}
  .hero-loader{position:absolute;z-index:3;left:20px;bottom:13px;display:flex;align-items:center;gap:9px;
    font-family:var(--mono);font-size:9.5px;letter-spacing:.15em;text-transform:uppercase;color:var(--fg-dim)}
  .hero-loader .bar{position:relative;width:38px;height:2px;background:rgba(235,237,240,.18);overflow:hidden}
  .hero-loader .bar::after{content:"";position:absolute;inset:0;width:40%;background:var(--fg-dim);animation:hero-load 1s ease-in-out infinite}
  @keyframes hero-load{from{transform:translateX(-110%)}to{transform:translateX(260%)}}
  @media (max-width:767px){.hero{min-height:clamp(320px,52vh,430px)}}
  @media (prefers-reduced-motion:reduce){
    .hero-anim{transition:none}
    .hero-loader .bar::after{animation:none;width:100%}
  }
`;

const HERO = `<section class="hero" id="hero">
  <div class="hero-media">
    <img class="hero-poster" src="hero-poster.png" width="1600" height="900" alt="Hình khối thương hiệu Kaizen: một khối trắng và một khối đỏ đối nhau qua trục dọc, chip hình thoi ở giữa, các tia tốc độ chạy ngang nền mực.">
    <div class="hero-anim" id="heroAnim" aria-hidden="true"></div>
  </div>
  <div class="hero-scrim"></div>
  <div class="hero-copy">
    <p class="eyebrow">${eyebrow.trim()}</p>
    <h1>${h1.trim()}</h1>
    <p class="lede">${lede.trim()}</p>
  </div>
  <div class="hero-loader" id="heroLoader" hidden><span class="bar"></span>đang dựng hình động</div>
</section>

`;

const JS = `<script>
(function(){
  "use strict";
  var hero = document.getElementById("hero");
  var mount = document.getElementById("heroAnim");
  var loader = document.getElementById("heroLoader");
  if (!hero || !mount) return;

  // Dưới 768px hoặc bật giảm chuyển động: giữ áp phích tĩnh, không tải gì thêm.
  var skip = false;
  try { skip = matchMedia("(max-width: 767px)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches; } catch(e){}
  if (skip) return;

  var LIB = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
  var DATA = "hero.json";   // đổi nguồn ở đây nếu có .riv hay scene Spline thật
  var started = false;

  function hideLoader(){ if (loader) loader.hidden = true; }

  function start(){
    if (started) return;
    started = true;
    if (loader) loader.hidden = false;

    var s = document.createElement("script");
    s.src = LIB; s.async = true;
    s.onerror = hideLoader;                       // thất bại thì áp phích tĩnh ở lại
    s.onload = function(){
      if (!window.lottie) { hideLoader(); return; }
      var anim;
      try {
        anim = window.lottie.loadAnimation({
          container: mount, renderer: "svg", loop: true, autoplay: true, path: DATA,
          rendererSettings: { preserveAspectRatio: "xMidYMid slice", progressiveLoad: true }
        });
      } catch (e) { hideLoader(); return; }

      anim.addEventListener("DOMLoaded", function(){ mount.classList.add("on"); hideLoader(); });
      anim.addEventListener("data_failed", hideLoader);

      var inView = true;
      function sync(){ (inView && document.visibilityState !== "hidden") ? anim.play() : anim.pause(); }
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function(es){
          es.forEach(function(e){ inView = e.isIntersecting; });
          sync();
        }, { threshold: 0 }).observe(hero);
      }
      document.addEventListener("visibilitychange", sync);
    };
    document.head.appendChild(s);
  }

  // Tải muộn: chờ trang vẽ xong rồi mới xin thư viện, không tranh lần vẽ đầu.
  function queue(){
    if (window.requestIdleCallback) requestIdleCallback(start, { timeout: 1500 });
    else setTimeout(start, 400);
  }
  if (document.readyState === "complete") queue();
  else window.addEventListener("load", queue);
})();
</script>
`;

const st = s.lastIndexOf('</style>');
s = s.slice(0, st) + CSS + s.slice(st);
const wrapAt = s.indexOf('  <div class="wrap">');
if (wrapAt < 0) throw new Error('khong thay .wrap');
s = s.slice(0, wrapAt) + HERO + s.slice(wrapAt);
const bodyEnd = s.lastIndexOf('</body>');
s = s.slice(0, bodyEnd) + JS + s.slice(bodyEnd);

fs.writeFileSync(P, s, 'utf8');
console.log('posters/index.html: ' + (s.length / 1024).toFixed(1) + ' KB');
console.log('  tieu de da chuyen vao hero: ' + h1.trim());
