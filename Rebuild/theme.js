// ============================================================================
// theme.js — light / dark mode
// ----------------------------------------------------------------------------
// Loaded SYNCHRONOUSLY in <head> so the saved/OS theme is applied to <html>
// before the page paints (no white flash). It then injects the pill toggle
// (top-right) and remembers the user's choice in localStorage.
//
// Precedence: a manual choice (saved) always wins; otherwise follow the OS.
// ============================================================================

(function () {
  var KEY = 'tchaco-theme';
  var root = document.documentElement;

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function osDark() {
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function apply(theme) {
    root.setAttribute('data-theme', theme);
  }

  // 1. Apply immediately (this runs during <head> parse → before first paint)
  apply(saved() || (osDark() ? 'dark' : 'light'));

  // 2. Build the toggle once the body exists
  function build() {
    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle dark mode');

    var knob = document.createElement('span');
    knob.className = 'theme-toggle__knob';
    btn.appendChild(knob);

    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });

    document.body.appendChild(btn);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }

  // 3. Follow live OS changes — but only while the user hasn't chosen manually
  if (window.matchMedia) {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (saved()) return;
      apply(e.matches ? 'dark' : 'light');
    });
  }
})();
