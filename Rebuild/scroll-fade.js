// ============================================================================
// scroll-fade.js — reveal elements as they scroll into view
// ----------------------------------------------------------------------------
// Adds `.below-viewport` to any `.scroll-transition-fade` element that starts
// below the fold, then removes it (triggering the CSS transition in style.css)
// once the element enters the viewport.
//
// Exposed as window.scrollFadeInit() so include.js can re-run it after the
// shared partials are injected. Calling it again is safe — already-revealed and
// already-observed elements are skipped.
// ============================================================================

(function () {
  var supported = 'IntersectionObserver' in window;
  var observer = supported
    ? new IntersectionObserver(onIntersect, {
        root: null,
        rootMargin: '0px 0px -50px 0px', // reveal slightly before fully in view
        threshold: 0.1,
      })
    : null;

  function onIntersect(entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.remove('below-viewport');
        observer.unobserve(entry.target);
      }
    });
  }

  function init() {
    var targets = document.querySelectorAll('.scroll-transition-fade');

    targets.forEach(function (el) {
      if (el.dataset.fadeBound) return; // don't double-process
      el.dataset.fadeBound = '1';

      if (!supported) return; // no observer → leave fully visible, no animation

      // Hide only what currently starts below the viewport.
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('below-viewport');
      }
      observer.observe(el);
    });
  }

  window.scrollFadeInit = init;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
