/**
 * Wellness Israel — Cookie Consent Banner
 * Підключити перед </body>:
 *   <script src="cookie-banner.js"></script>
 *
 * Не потребує сторонніх бібліотек.
 * Зберігає вибір користувача в localStorage на 365 днів.
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'wi_cookie_consent';
  var EXPIRE_DAYS = 365;

  // Перевіряємо чи вже є збережена відповідь
  function getConsent() {
    try {
      var item = localStorage.getItem(STORAGE_KEY);
      if (!item) return null;
      var data = JSON.parse(item);
      if (Date.now() > data.expires) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return data.value;
    } catch (e) {
      return null;
    }
  }

  // Зберігаємо відповідь
  function setConsent(value) {
    try {
      var expires = Date.now() + EXPIRE_DAYS * 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: value, expires: expires }));
    } catch (e) {}
  }

  // Будуємо HTML баннера
  function createBanner() {
    var banner = document.createElement('div');
    banner.className = 'wi-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Согласие на использование файлов cookie');
    banner.setAttribute('aria-live', 'polite');

    banner.innerHTML = [
      '<div class="wi-cookie-inner">',
        '<p class="wi-cookie-text">',
          'Мы используем файлы cookie для корректной работы сайта. ',
          'Аналитические cookie устанавливаются только с вашего согласия. ',
          '<a href="privacy.html">Политика конфиденциальности</a>',
        '</p>',
        '<div class="wi-cookie-actions">',
          '<button class="wi-cookie-btn wi-decline" type="button" id="wi-cookie-decline">',
            'Только необходимые',
          '</button>',
          '<button class="wi-cookie-btn wi-accept" type="button" id="wi-cookie-accept">',
            'Принять все',
          '</button>',
        '</div>',
      '</div>'
    ].join('');

    return banner;
  }

  // Показуємо баннер
  function showBanner() {
    var banner = createBanner();
    document.body.appendChild(banner);

    // Анімація появи (трохи затримка для рендеру)
    setTimeout(function () {
      banner.classList.add('is-visible');
    }, 300);

    // Кнопка «Прийняти»
    document.getElementById('wi-cookie-accept').addEventListener('click', function () {
      setConsent('accepted');
      hideBanner(banner);
      // Тут можна ініціалізувати аналітику (Google Analytics тощо):
      // if (typeof gtag === 'function') { gtag('consent', 'update', { analytics_storage: 'granted' }); }
    });

    // Кнопка «Тільки необхідні»
    document.getElementById('wi-cookie-decline').addEventListener('click', function () {
      setConsent('declined');
      hideBanner(banner);
    });
  }

  // Ховаємо баннер
  function hideBanner(banner) {
    banner.classList.remove('is-visible');
    setTimeout(function () {
      if (banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
    }, 400);
  }

  // Запуск
  function init() {
    if (getConsent() !== null) return; // вибір вже зроблено
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }

  init();

})();
