(() => {
  const scriptUrl = document.currentScript.src;
  const logoUrl = new URL('image/Logo.png', scriptUrl).href;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
  const minimumTime = reducedMotion ? 0 : 550;
  let activeLoader;

  function showLoader() {
    activeLoader?.remove();
    document.documentElement.classList.add('ovi-js');
    document.body.insertAdjacentHTML('afterbegin', `
      <div class="ovi-preloader" role="status" aria-label="Loading Ovi Design Academy">
        <div class="ovi-preloader__panel ovi-preloader__panel--back" aria-hidden="true"></div>
        <div class="ovi-preloader__panel ovi-preloader__panel--middle" aria-hidden="true"></div>
        <div class="ovi-preloader__panel ovi-preloader__panel--front">
          <div class="ovi-preloader__content">
          <div class="ovi-preloader__mark">
            <span class="ovi-preloader__orbit" aria-hidden="true"></span>
            <img src="${logoUrl}" width="454" height="210" alt="" decoding="async" />
          </div>
          <span class="ovi-preloader__caption">Design your next chapter</span>
          <span class="ovi-preloader__track" aria-hidden="true"><span></span></span>
          </div>
        </div>
      </div>`);

    const loader = document.body.firstElementChild;
    activeLoader = loader;
    const shownAt = performance.now();
    let finished = false;

    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(safetyTimer);
      const remaining = Math.max(0, minimumTime - (performance.now() - shownAt));
      window.setTimeout(() => {
        if (activeLoader !== loader) return;
        loader.classList.add('is-leaving');
        loader.setAttribute('aria-hidden', 'true');
        window.setTimeout(() => {
          loader.remove();
          if (activeLoader === loader) activeLoader = null;
        }, reducedMotion ? 0 : 1050);
      }, remaining);
    }

    const safetyTimer = window.setTimeout(finish, 2200);
    return finish;
  }

  const finishInitial = showLoader();
  document.addEventListener('DOMContentLoaded', () => {
    const firstImage = document.querySelector('main img[fetchpriority="high"], main img:not([loading="lazy"])');
    if (!firstImage || firstImage.complete) {
      finishInitial();
    } else {
      firstImage.addEventListener('load', finishInitial, { once: true });
      firstImage.addEventListener('error', finishInitial, { once: true });
    }
  }, { once: true });

  // Back/forward cache restores a page without running its scripts again.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      const finishRestored = showLoader();
      window.setTimeout(finishRestored, minimumTime);
    }
  });
})();
