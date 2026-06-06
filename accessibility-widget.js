/**
 * Wellness Israel — Accessibility Widget
 * Підключити перед </body>:
 *   <script src="accessibility-widget.js"></script>
 *
 * Функції:
 *  - Збільшення розміру шрифту (3 рівні)
 *  - Зупинка анімацій
 *  - Підкреслення посилань
 *  - Висококонтрастний режим
 *  - Темний режим
 *  - Читабельний шрифт (без серифів)
 *  - Великий курсор
 *
 * Зберігає налаштування в localStorage.
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'wi_a11y_prefs';
  var bodyEl = document.body;

  // Налаштування за замовчуванням
  var defaultPrefs = {
    fontSize: 0,         // 0 = normal, 1 = large, 2 = xlarge
    noAnimations: false,
    underlineLinks: false,
    highContrast: false,
    darkMode: false,
    readableFont: false,
    bigCursor: false
  };

  var prefs = loadPrefs();

  /* ---- Збереження/завантаження ---- */

  function loadPrefs() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return Object.assign({}, defaultPrefs, JSON.parse(stored));
    } catch (e) {}
    return Object.assign({}, defaultPrefs);
  }

  function savePrefs() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {}
  }

  /* ---- Застосування налаштувань ---- */

  function applyPrefs() {
    // Font size classes
    bodyEl.classList.remove('wi-large-text', 'wi-xlarge-text');
    if (prefs.fontSize === 1) bodyEl.classList.add('wi-large-text');
    if (prefs.fontSize === 2) bodyEl.classList.add('wi-xlarge-text');

    toggleClass('wi-no-animations', prefs.noAnimations);
    toggleClass('wi-underline-links', prefs.underlineLinks);
    toggleClass('wi-high-contrast', prefs.highContrast);
    toggleClass('wi-dark-mode', prefs.darkMode);
    toggleClass('wi-readable-font', prefs.readableFont);
    toggleClass('wi-big-cursor', prefs.bigCursor);
  }

  function toggleClass(cls, active) {
    if (active) {
      bodyEl.classList.add(cls);
    } else {
      bodyEl.classList.remove(cls);
    }
  }

  /* ---- Побудова HTML ---- */

  function buildWidget() {
    // Кнопка-тригер
    var trigger = document.createElement('button');
    trigger.className = 'wi-a11y-trigger';
    trigger.setAttribute('aria-label', 'Открыть меню доступности');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'wi-a11y-panel');
    trigger.innerHTML = [
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"',
        ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
        '<circle cx="12" cy="4" r="1.5"/>',
        '<path d="M6 8h12M12 8v13M8 13l-2 5M16 13l2 5"/>',
      '</svg>'
    ].join('');

    // Панель
    var panel = document.createElement('div');
    panel.className = 'wi-a11y-panel';
    panel.id = 'wi-a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Настройки доступности');

    panel.innerHTML = [
      '<div class="wi-a11y-panel-header">',
        '<span>Доступность</span>',
        '<button class="wi-a11y-close" aria-label="Закрыть">✕</button>',
      '</div>',
      '<div class="wi-a11y-panel-body">',

        // Font size
        '<div class="wi-a11y-option" role="group" aria-label="Размер шрифта">',
          '<div class="wi-a11y-option-label">',
            '<span class="wi-a11y-option-icon" aria-hidden="true">🔤</span>',
            '<span>Размер текста</span>',
          '</div>',
          '<div class="wi-a11y-font-controls">',
            '<button class="wi-a11y-font-btn" id="wi-font-minus" aria-label="Уменьшить текст">−</button>',
            '<span class="wi-a11y-font-value" id="wi-font-label" aria-live="polite">100%</span>',
            '<button class="wi-a11y-font-btn" id="wi-font-plus" aria-label="Увеличить текст">+</button>',
          '</div>',
        '</div>',

        // Animations
        buildToggleOption('wi-no-animations', '🎞', 'Остановить анимации', prefs.noAnimations),
        // Underline links
        buildToggleOption('wi-underline-links', '🔗', 'Подчёркивать ссылки', prefs.underlineLinks),
        // High contrast
        buildToggleOption('wi-high-contrast', '◑', 'Высокий контраст', prefs.highContrast),
        // Dark mode
        buildToggleOption('wi-dark-mode', '🌙', 'Тёмный режим', prefs.darkMode),
        // Readable font
        buildToggleOption('wi-readable-font', '📖', 'Читаемый шрифт', prefs.readableFont),
        // Big cursor
        buildToggleOption('wi-big-cursor', '🖱', 'Большой курсор', prefs.bigCursor),

        '<button class="wi-a11y-reset" id="wi-a11y-reset">Сбросить все настройки</button>',
      '</div>'
    ].join('');

    document.body.appendChild(trigger);
    document.body.appendChild(panel);

    bindEvents(trigger, panel);
  }

  function buildToggleOption(id, icon, label, checked) {
    var inputId = 'wi-toggle-' + id;
    return [
      '<label class="wi-a11y-option" for="' + inputId + '">',
        '<div class="wi-a11y-option-label">',
          '<span class="wi-a11y-option-icon" aria-hidden="true">' + icon + '</span>',
          '<span>' + label + '</span>',
        '</div>',
        '<span class="wi-a11y-toggle">',
          '<input type="checkbox" id="' + inputId + '" data-pref="' + id + '"' +
            (checked ? ' checked' : '') + '>',
          '<span class="wi-a11y-toggle-track" aria-hidden="true"></span>',
        '</span>',
      '</label>'
    ].join('');
  }

  /* ---- Обробники подій ---- */

  var isOpen = false;

  function bindEvents(trigger, panel) {
    // Відкрити/закрити
    trigger.addEventListener('click', function () {
      isOpen = !isOpen;
      panel.classList.toggle('is-open', isOpen);
      trigger.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        panel.querySelector('.wi-a11y-close').focus();
      }
    });

    // Кнопка закрити
    panel.querySelector('.wi-a11y-close').addEventListener('click', function () {
      isOpen = false;
      panel.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    });

    // Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        isOpen = false;
        panel.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });

    // Кліки поза панеллю
    document.addEventListener('click', function (e) {
      if (isOpen && !panel.contains(e.target) && e.target !== trigger) {
        isOpen = false;
        panel.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Toggle перемикачі
    panel.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        var key = this.dataset.pref;
        // Перетворюємо 'wi-no-animations' → 'noAnimations'
        var prefKey = key.replace(/^wi-/, '').replace(/-([a-z])/g, function (_, c) {
          return c.toUpperCase();
        });
        prefs[prefKey] = this.checked;
        applyPrefs();
        savePrefs();
      });
    });

    // Розмір шрифту
    var fontSizes = [100, 115, 130]; // відсотки для відображення
    var fontLabel = document.getElementById('wi-font-label');

    function updateFontLabel() {
      if (fontLabel) fontLabel.textContent = fontSizes[prefs.fontSize] + '%';
    }
    updateFontLabel();

    document.getElementById('wi-font-plus').addEventListener('click', function () {
      if (prefs.fontSize < 2) {
        prefs.fontSize++;
        applyPrefs();
        savePrefs();
        updateFontLabel();
      }
    });

    document.getElementById('wi-font-minus').addEventListener('click', function () {
      if (prefs.fontSize > 0) {
        prefs.fontSize--;
        applyPrefs();
        savePrefs();
        updateFontLabel();
      }
    });

    // Скинути
    document.getElementById('wi-a11y-reset').addEventListener('click', function () {
      prefs = Object.assign({}, defaultPrefs);
      applyPrefs();
      savePrefs();

      // Оновити чекбокси
      panel.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
        cb.checked = false;
      });
      updateFontLabel();
    });
  }

  /* ---- Ініціалізація ---- */

  function init() {
    applyPrefs(); // застосовуємо збережені префи одразу
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', buildWidget);
    } else {
      buildWidget();
    }
  }

  init();

})();
