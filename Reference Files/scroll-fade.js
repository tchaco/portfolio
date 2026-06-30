// scroll-fade.js
// Restores the scroll-triggered fade-in behavior that Cargo Collective
// originally powered with their own JS (stripped out when the site was
// archived as static files). The CSS classes/transitions this relies on
// (.scroll-transition-fade / .below-viewport) already exist in style.css —
// this script just adds/removes .below-viewport as elements cross into the
// viewport, exactly like the original behavior.
//
// Applies to both inline project images AND the thumbnail gallery, since
// both use the same .scroll-transition-fade class in the original markup.

(function () {
  // Cargo's JS stamped transition-duration:initial on project images to
  // suppress their own animation engine — we need to clear that so our
  // CSS transition (defined in style.css) can actually fire.
  function enableTransition(el) {
    if (el.style.transitionDuration === 'initial') {
      el.style.transitionDuration = '';
    }
  }

  if (!('IntersectionObserver' in window)) {
    // Older browser without IntersectionObserver support: just show everything,
    // no animation, rather than leaving images stuck invisible.
    document.querySelectorAll('.scroll-transition-fade').forEach(function (el) {
      el.classList.remove('below-viewport');
      enableTransition(el);
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          enableTransition(entry.target);
          entry.target.classList.remove('below-viewport');
          // once it's faded in, no need to keep watching it
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -50px 0px', // trigger slightly before fully in view
      threshold: 0.1,
    }
  );

  function observeAll() {
    document.querySelectorAll('.scroll-transition-fade').forEach(function (el) {
      // Set initial hidden state for elements starting below viewport
      var rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        el.classList.add('below-viewport');
      }
      enableTransition(el);
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeAll);
  } else {
    observeAll();
  }
})();
