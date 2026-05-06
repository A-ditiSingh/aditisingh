(function () {
  // Inject overlay markup
  var overlay = document.createElement('div');
  overlay.id = 'lightbox-overlay';
  overlay.innerHTML = '<button id="lightbox-close" aria-label="Close">&times;</button><img id="lightbox-img" src="" alt="">';
  document.body.appendChild(overlay);

  var img = overlay.querySelector('#lightbox-img');
  var closeBtn = overlay.querySelector('#lightbox-close');

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    img.src = '';
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  function initTriggers() {
    document.querySelectorAll('img').forEach(function (imgEl) {
      if (imgEl.closest('#lightbox-overlay')) return;
      if (imgEl.closest('nav')) return;
      if (imgEl.closest('footer')) return;
      if (imgEl.closest('.hero-image-card')) return;
      if (imgEl.dataset.lightboxInit) return;
      imgEl.dataset.lightboxInit = '1';
      imgEl.style.cursor = 'zoom-in';
      imgEl.addEventListener('click', function () {
        open(imgEl.src, imgEl.alt);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTriggers);
  } else {
    initTriggers();
  }
})();
