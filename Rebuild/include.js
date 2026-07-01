// ============================================================================
// include.js — tiny HTML partial loader
// ----------------------------------------------------------------------------
// Any element with a `data-include="path.html"` attribute has that file fetched
// and injected as its contents. This is how the shared sidebar and thumbnail
// gallery live in ONE file each instead of being copy-pasted into every page.
//
// NOTE: fetch() needs an http(s) origin — opening a page with file:// will block
// the includes. Run a local server while developing (see README).
// ============================================================================

async function hydrateIncludes() {
  const slots = document.querySelectorAll('[data-include]');

  await Promise.all([...slots].map(async (slot) => {
    const url = slot.getAttribute('data-include');
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      slot.innerHTML = await res.text();
    } catch (err) {
      console.error(`[include] failed to load "${url}":`, err);
    }
  }));

  // Newly-injected content includes fade-in targets — (re)start the observer.
  if (window.scrollFadeInit) window.scrollFadeInit();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hydrateIncludes);
} else {
  hydrateIncludes();
}

// ---- Site footer: injected on every page; year auto-updates ----
function addFooter() {
  if (document.querySelector('.site-footer')) return;      // guard against doubles
  var footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.textContent = '© ' + new Date().getFullYear() +
    ' Thiago Da Costa - Tchaco. All Rights Reserved.';
  (document.querySelector('.main') || document.body).appendChild(footer);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addFooter);
} else {
  addFooter();
}