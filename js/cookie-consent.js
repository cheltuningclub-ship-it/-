(function () {
  'use strict';

  const STORAGE_KEY = 'im_cookie_consent';
  const CONSENT_VERSION = '1';

  function getConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveConsent(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...data,
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
    }));
  }

  function loadYandexMetrika() {
    const cfg = window.SITE_CONFIG?.yandexMetrika;
    if (!cfg?.enabled || !cfg?.id) return;

    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      for (let j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) return;
      }
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

    window.ym(cfg.id, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false,
    });
  }

  function initBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const existing = getConsent();
    if (existing?.version === CONSENT_VERSION) {
      if (existing.analytics) loadYandexMetrika();
      return;
    }

    banner.classList.add('visible');
    document.body.style.paddingBottom = banner.offsetHeight + 'px';

    const btnAccept = document.getElementById('cookie-accept-all');
    const btnReject = document.getElementById('cookie-reject-all');
    const btnSettings = document.getElementById('cookie-settings-toggle');
    const btnSave = document.getElementById('cookie-save-settings');
    const settingsPanel = document.getElementById('cookie-settings-panel');
    const analyticsToggle = document.getElementById('cookie-analytics');

    function hideBanner(consent) {
      saveConsent(consent);
      banner.classList.remove('visible');
      document.body.style.paddingBottom = '';
      if (consent.analytics) loadYandexMetrika();
    }

    btnAccept?.addEventListener('click', () => {
      hideBanner({ necessary: true, analytics: true });
    });

    btnReject?.addEventListener('click', () => {
      hideBanner({ necessary: true, analytics: false });
    });

    btnSettings?.addEventListener('click', () => {
      settingsPanel?.classList.toggle('open');
    });

    btnSave?.addEventListener('click', () => {
      hideBanner({
        necessary: true,
        analytics: analyticsToggle?.checked ?? false,
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initBanner);
})();
