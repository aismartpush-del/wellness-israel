/**
 * Wellness Israel - Cookie Consent Banner
 * Add before </body>: <script src="cookie-banner.js"></script>
 * No external dependencies. Saves choice to localStorage for 365 days.
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'wi_cookie_consent';
  var EXPIRE_DAYS = 365;

  function getConsent() {
    try {
      var item = localStorage.getItem(STORAGE_KEY);
      if (!item) return null;
      var data = JSON.parse(item);
      if (Date.now() > data.expires) { localStorage.removeItem(STORAGE_KEY); return null; }
      return data.value;
    } catch (e) { return null; }
  }

  function setConsent(value) {
    try {
      var expires = Date.now() + EXPIRE_DAYS * 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: value, expires: expires }));
    } catch (e) {}
  }

  // Text labels as Unicode escapes to avoid server encoding issues
  var TEXT = {
    message:  '\u041c\u044b \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c \u0444\u0430\u0439\u043b\u044b cookie \u0434\u043b\u044f \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u043e\u0439 \u0440\u0430\u0431\u043e\u0442\u044b \u0441\u0430\u0439\u0442\u0430. \u0410\u043d\u0430\u043b\u0438\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 cookie \u2014 \u0442\u043e\u043b\u044c\u043a\u043e \u0441 \u0432\u0430\u0448\u0435\u0433\u043e \u0441\u043e\u0433\u043b\u0430\u0441\u0438\u044f. ',
    linkText:  '\u041f\u043e\u043b\u0438\u0442\u0438\u043a\u0430 \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438',
    decline:   '\u0422\u043e\u043b\u044c\u043a\u043e \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u044b\u0435',
    accept:    '\u041f\u0440\u0438\u043d\u044f\u0442\u044c \u0432\u0441\u0435',
    ariaLabel: '\u0421\u043e\u0433\u043b\u0430\u0441\u0438\u0435 \u043d\u0430 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u0444\u0430\u0439\u043b\u043e\u0432 cookie'
  };

  function createBanner() {
    var banner = document.createElement('div');
    banner.className = 'wi-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', TEXT.ariaLabel);
    banner.setAttribute('aria-live', 'polite');

    banner.innerHTML =
      '<div class="wi-cookie-inner">' +
        '<p class="wi-cookie-text">' +
          TEXT.message +
          '<a href="privacy.html">' + TEXT.linkText + '</a>' +
        '</p>' +
        '<div class="wi-cookie-actions">' +
          '<button class="wi-cookie-btn wi-decline" type="button" id="wi-cookie-decline">' + TEXT.decline + '</button>' +
          '<button class="wi-cookie-btn wi-accept"  type="button" id="wi-cookie-accept">'  + TEXT.accept  + '</button>' +
        '</div>' +
      '</div>';

    return banner;
  }

  function showBanner() {
    var banner = createBanner();
    document.body.appendChild(banner);

    setTimeout(function () { banner.classList.add('is-visible'); }, 300);

    document.getElementById('wi-cookie-accept').addEventListener('click', function () {
      setConsent('accepted');
      hideBanner(banner);
      // Uncomment to enable analytics after consent:
      // if (typeof gtag === 'function') { gtag('consent', 'update', { analytics_storage: 'granted' }); }
    });

    document.getElementById('wi-cookie-decline').addEventListener('click', function () {
      setConsent('declined');
      hideBanner(banner);
    });
  }

  function hideBanner(banner) {
    banner.classList.remove('is-visible');
    setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 400);
  }

  function init() {
    if (getConsent() !== null) return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }

  init();

})();
