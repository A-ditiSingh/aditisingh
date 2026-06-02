(function () {
  const nav = document.querySelector('nav');
  if (!nav) return;

  // Read colours from data attributes on <body>
  // e.g. <body data-nav-top="#f0e8dc" data-nav-bottom="#fafafa">
  const topHex    = document.body.dataset.navTop;
  const bottomHex = document.body.dataset.navBottom;
  if (!topHex || !bottomHex) return; // index page or any page without attrs — do nothing

  // ── helpers ───────────────────────────────────────────────────────────────
  function hex2rgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    return [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)];
  }

  function lerp(a, b, t) {
    return a.map((v, i) => Math.round(v + (b[i] - v) * t));
  }

  function luminance([r, g, b]) {
    const l = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v+0.055)/1.055, 2.4); };
    return 0.2126*l(r) + 0.7152*l(g) + 0.0722*l(b);
  }

  const TOP    = hex2rgb(topHex);
  const BOTTOM = hex2rgb(bottomHex);
  const LERP   = 0.08;

  let current = null;
  let target  = TOP.slice();

  nav.style.backdropFilter = 'none';
  nav.style.webkitBackdropFilter = 'none';

  function applyColor([r, g, b]) {
    nav.style.background = `rgb(${r},${g},${b})`;
    const lum = luminance([r, g, b]);
    const dark = lum < 0.45;
    nav.style.setProperty('--ink',  dark ? '#f5f0e8' : '#1a1a1a');
    nav.style.setProperty('--mid',  dark ? 'rgba(245,240,232,0.65)' : '#6b6560');
    nav.style.setProperty('--rule', dark ? 'rgba(245,240,232,0.25)' : '#ddd8ce');
  }

  function tick() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
    target = lerp(TOP, BOTTOM, ratio);
    if (!current) current = target.slice();
    current = lerp(current, target, LERP);
    applyColor(current);
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
