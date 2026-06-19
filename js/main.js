
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  
  function addSwipe(el, onSwipe) {
    var startX = 0, startY = 0, tracking = false;
    var THRESHOLD = 40;

    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      tracking = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    el.addEventListener('pointerup', function (e) {
      if (!tracking) return;
      tracking = false;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (Math.abs(dx) > THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        onSwipe(dx < 0 ? 1 : -1);
      }
    });

    el.addEventListener('pointercancel', function () { tracking = false; });
  }

  /* =========================================================
     1. STICKY HEADER — solid background after scrolling past hero
     ========================================================= */
  (function header() {
    var el = document.querySelector('[data-header]');
    if (!el) return;
    var threshold = 80;
    function onScroll() {
      el.classList.toggle('header--solid', window.scrollY > threshold);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* =========================================================
     2. HERO — dual-axis carousel
        Vertical axis   : columns auto-scroll via CSS animation
     ========================================================= */
  (function heroCarousel() {
    var root = document.querySelector('[data-hero-carousel]');
    if (!root) return;

    var track = root.querySelector('[data-hero-track]');
    var viewport = root.querySelector('[data-hero-viewport]');
    var slides = Array.prototype.slice.call(track.children);
    var prevBtn = root.querySelector('[data-hero-prev]');
    var nextBtn = root.querySelector('[data-hero-next]');
    var dotsWrap = root.querySelector('[data-hero-dots]');
    var playBtn = root.querySelector('[data-hero-playpause]');
    var playIcon = root.querySelector('[data-hero-playpause-icon]');
    var live = root.querySelector('[data-hero-live]');

    var index = 0;
    var total = slides.length;
    var timer = null;
    var INTERVAL = 5000;
    var playing = !prefersReduced;

    // Build dots
    var dots = [];
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.dataset.index = i;
      dotsWrap.appendChild(dot);
      dots.push(dot);
    }

    function update() {
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      slides.forEach(function (s, i) {
        s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
      });
      dots.forEach(function (d, i) {
        d.setAttribute('aria-selected', i === index ? 'true' : 'false');
        d.tabIndex = i === index ? 0 : -1;
      });
      if (live) live.textContent = 'Slide ' + (index + 1) + ' of ' + total;
    }

    function goTo(i) { index = (i + total) % total; update(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function start() {
      if (!playing || timer) return;
      timer = window.setInterval(next, INTERVAL);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    function setPlaying(on) {
      playing = on;
      root.dataset.paused = on ? 'false' : 'true';
      if (playIcon) playIcon.innerHTML = on ? '&#10073;&#10073;' : '&#9654;';
      playBtn.setAttribute('aria-label', on ? 'Pause auto-play' : 'Start auto-play');
      if (on) start(); else stop();
    }

    nextBtn.addEventListener('click', function () { next(); });
    prevBtn.addEventListener('click', function () { prev(); });
    playBtn.addEventListener('click', function () { setPlaying(!playing); });

    dotsWrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.carousel__dot');
      if (btn) goTo(parseInt(btn.dataset.index, 10));
    });

    // Keyboard on the carousel region
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    });

    // Pause on hover / focus (both axes)
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', function () { if (playing) start(); });
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', function () { if (playing) start(); });

    // Pause when tab hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else if (playing) start();
    });

    // Swipe (horizontal axis)
    addSwipe(viewport, function (dir) { dir > 0 ? next() : prev(); });

    update();
    setPlaying(false); // horizontal axis does not auto-play; user controls it
  })();

  /* =========================================================
     3. PARTICIPATING SCHOOLS — marquee
        Animation
     ========================================================= */
  (function marquee() {
    var root = document.querySelector('[data-marquee]');
    if (!root || prefersReduced) return;
    // make logo links/items focusable region pause already via CSS :focus-within
    // expose a manual pause when any descendant receives focus (older Safari)
    root.addEventListener('focusin', function () { root.classList.add('is-paused'); });
    root.addEventListener('focusout', function () { root.classList.remove('is-paused'); });
  })();

  /* =========================================================
     4. CHOOSE THE SCHOOL — mobile scroll-snap slider + dots
     ========================================================= */
  (function chooseSlider() {
    var slider = document.querySelector('[data-choose-slider]');
    if (!slider) return;
    var track = slider.querySelector('[data-choose-track]');
    var slides = Array.prototype.slice.call(track.querySelectorAll('[data-choose-slide]'));
    var dotsWrap = slider.querySelector('[data-choose-dots]');

    var dots = slides.map(function (_, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'choose__dot';
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', 'Go to card ' + (i + 1));
      d.dataset.index = i;
      dotsWrap.appendChild(d);
      return d;
    });

    function activeIndex() {
      var center = track.scrollLeft + track.clientWidth / 2;
      var best = 0, bestDist = Infinity;
      slides.forEach(function (s, i) {
        var mid = s.offsetLeft + s.offsetWidth / 2;
        var dist = Math.abs(mid - center);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      return best;
    }

    function sync() {
      var idx = activeIndex();
      dots.forEach(function (d, i) {
        d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      });
    }

    var raf;
    track.addEventListener('scroll', function () {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(sync);
    }, { passive: true });

    dotsWrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.choose__dot');
      if (!btn) return;
      var s = slides[parseInt(btn.dataset.index, 10)];
      track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2, behavior: prefersReduced ? 'auto' : 'smooth' });
    });

    sync();
  })();

  /* =========================================================
     5. EXHIBITION — highlights carousel
        
     ========================================================= */
  (function exhibitionCarousel() {
    var root = document.querySelector('[data-exh-carousel]');
    if (!root) return;

    var track = root.querySelector('[data-exh-track]');
    var viewport = root.querySelector('[data-exh-viewport]');
    var slides = Array.prototype.slice.call(track.querySelectorAll('[data-exh-slide]'));
    var prevBtn = root.querySelector('[data-exh-prev]');
    var nextBtn = root.querySelector('[data-exh-next]');
    var live = root.querySelector('[data-exh-live]');

    var index = 0;
    var total = slides.length;
    var timer = null;
    var INTERVAL = 4500;
    var playing = !prefersReduced;

    function perView() {
      var w = window.innerWidth;
      if (w <= 620) return 1;
      if (w <= 860) return 2;
      if (w <= 1120) return 3;
      return 4;
    }
    function maxIndex() { return Math.max(0, total - perView()); }

    function update() {
      var pv = perView();
      var step = 100 / pv;
      var i = Math.min(index, maxIndex());
      index = i;
      track.style.transform = 'translateX(' + (-index * step) + '%)';
      var lastStart = maxIndex();
      prevBtn.disabled = index <= 0;
      nextBtn.disabled = index >= lastStart;
      slides.forEach(function (s, n) {
        var visible = n >= index && n < index + pv;
        s.setAttribute('aria-hidden', visible ? 'false' : 'true');
      });
      if (live) live.textContent = 'Showing highlight ' + (index + 1) + ' to ' + Math.min(index + pv, total) + ' of ' + total;
    }

    function next() { index = index >= maxIndex() ? 0 : index + 1; update(); }
    function prev() { index = index <= 0 ? maxIndex() : index - 1; update(); }

    function start() { if (playing && !timer) timer = window.setInterval(next, INTERVAL); }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    addSwipe(viewport, function (dir) { dir > 0 ? next() : prev(); });

    var rt;
    window.addEventListener('resize', function () {
      window.clearTimeout(rt);
      rt = window.setTimeout(update, 150);
    });

    update();
    start();
  })();

  /* =========================================================
     6. ENQUIRY FORM — accessible client-side validation
     ========================================================= */
  (function enquiryForm() {
    var form = document.getElementById('enquire');
    if (!form) return;
    var status = form.querySelector('[data-enquiry-status]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        if (status) status.textContent = 'Please complete all the fields.';
        return;
      }
      if (status) status.textContent = 'Thank you! We will contact you shortly.';
      form.reset();
    });
  })();

})();
