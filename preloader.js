(() => {
  // Wireframe build preloader: a browser screen draws itself, the steps
  // Research → Design → Prototype → Build tick past with a % counter, then
  // four layers wipe upward to reveal the page.
  const scriptUrl = document.currentScript.src;
  const logoUrl = new URL('image/brand/logo-white.webp', scriptUrl).href;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true;
  // Min time lets the build animation finish; max keeps a slow asset from blocking the page.
  const MIN_TIME = 2400;
  const MAX_TIME = 6000;
  let activeLoader;

  const markup = `
    <div class="ovi-preloader" role="status" aria-label="Loading Ovi Design Academy">
      <div class="ovi-pl-layer ovi-pl-layer-3" aria-hidden="true"></div>
      <div class="ovi-pl-layer ovi-pl-layer-2" aria-hidden="true"></div>
      <div class="ovi-pl-layer ovi-pl-layer-1" aria-hidden="true"></div>
      <div class="ovi-pl-layer ovi-pl-main" aria-hidden="true">
        <div class="ovi-pl-grid"></div>
        <img src="${logoUrl}" alt="" class="ovi-pl-logo" decoding="async" />
        <div class="ovi-pl-stage">
          <svg class="ovi-pl-screen" viewBox="0 0 280 180" fill="none">
            <defs>
              <linearGradient id="oviPlGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#ff6a2c"/>
                <stop offset=".5" stop-color="#ffa45f"/>
                <stop offset="1" stop-color="#49c6ff"/>
              </linearGradient>
            </defs>
            <rect class="ovi-pl-draw ovi-pl-d1" pathLength="1" x="2" y="2" width="276" height="176" rx="14"/>
            <path class="ovi-pl-draw ovi-pl-d2" pathLength="1" d="M2 30 H278"/>
            <circle class="ovi-pl-dot" cx="18" cy="16" r="4"/>
            <circle class="ovi-pl-dot" cx="32" cy="16" r="4"/>
            <circle class="ovi-pl-dot" cx="46" cy="16" r="4"/>
            <rect class="ovi-pl-draw ovi-pl-d3 ovi-pl-fill" pathLength="1" x="18" y="46" width="110" height="80" rx="8"/>
            <path class="ovi-pl-draw ovi-pl-d4" pathLength="1" d="M146 52 H258"/>
            <path class="ovi-pl-draw ovi-pl-d5" pathLength="1" d="M146 70 H240"/>
            <path class="ovi-pl-draw ovi-pl-d6" pathLength="1" d="M146 88 H226"/>
            <rect class="ovi-pl-draw ovi-pl-d7 ovi-pl-btn" pathLength="1" x="146" y="104" width="76" height="22" rx="11"/>
            <path class="ovi-pl-draw ovi-pl-d8" pathLength="1" d="M18 146 H128 M18 160 H96"/>
            <path class="ovi-pl-cursor" d="M0 0 L0 16 L4.5 12 L8 19 L11 17.5 L7.5 11 L13 11 Z"/>
          </svg>
        </div>
        <div class="ovi-pl-caption">
          <span class="ovi-pl-caption-label">Design Engineer in progress</span>
          <span class="ovi-pl-words"><span class="ovi-pl-word-track">
            <span>Research</span><span>Design</span><span>Prototype</span><span>Build</span>
          </span></span>
        </div>
        <div class="ovi-pl-progress">
          <div class="ovi-pl-bar"><span></span></div>
          <span class="ovi-pl-count"><span>0</span>%</span>
        </div>
      </div>
    </div>`;

  function showLoader(isLoaded) {
    activeLoader?.remove();
    if (reducedMotion) return;
    document.documentElement.classList.add('ovi-js', 'ovi-is-loading');
    document.body.insertAdjacentHTML('afterbegin', markup);

    const loader = document.body.firstElementChild;
    activeLoader = loader;
    const bar = loader.querySelector('.ovi-pl-bar span');
    const count = loader.querySelector('.ovi-pl-count span');
    const startTime = performance.now();
    let progress = 0;

    const timer = window.setInterval(() => {
      if (activeLoader !== loader) return window.clearInterval(timer);
      const elapsed = performance.now() - startTime;
      const ready = (isLoaded() && elapsed >= MIN_TIME) || elapsed >= MAX_TIME;
      // Time-based curve toward 90%, then sprint to 100% once ready
      const target = ready ? 100 : Math.min(90, (elapsed / MIN_TIME) * 90);
      progress += (target - progress) * (ready ? 0.18 : 0.12);
      if (ready && progress > 99.5) progress = 100;
      bar.style.transform = `scaleX(${progress / 100})`;
      count.textContent = Math.round(progress);

      if (progress === 100) {
        window.clearInterval(timer);
        window.setTimeout(() => leave(loader), 250);
      }
    }, 30);
  }

  function leave(loader) {
    if (activeLoader !== loader) return;
    loader.classList.add('is-leaving');
    loader.setAttribute('aria-hidden', 'true');
    window.setTimeout(() => document.documentElement.classList.remove('ovi-is-loading'), 550);
    window.setTimeout(() => {
      loader.remove();
      if (activeLoader === loader) activeLoader = null;
    }, 1400);
  }

  let pageLoaded = document.readyState === 'complete';
  window.addEventListener('load', () => { pageLoaded = true; }, { once: true });
  showLoader(() => pageLoaded);

  // Back/forward cache restores a page without running its scripts again.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) showLoader(() => true);
  });
})();
