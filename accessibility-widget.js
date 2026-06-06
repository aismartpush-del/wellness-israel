/**
 * Wellness Israel - Accessibility Widget
 * Add before </body>: <script src="accessibility-widget.js"></script>
 * No external dependencies. Saves preferences to localStorage.
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'wi_a11y_prefs';
  var bodyEl = document.body;

  var defaultPrefs = {
    fontSize: 0,
    noAnimations: false,
    underlineLinks: false,
    highContrast: false,
    darkMode: false,
    readableFont: false,
    bigCursor: false
  };

  var prefs = loadPrefs();

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

  function applyPrefs() {
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
    if (active) { bodyEl.classList.add(cls); }
    else { bodyEl.classList.remove(cls); }
  }

  // Labels (Russian, kept as Unicode escapes to avoid encoding issues)
  var L = {
    panelTitle:    '\u0414\u043e\u0441\u0442\u0443\u043f\u043d\u043e\u0441\u0442\u044c',
    close:         '\u0417\u0430\u043a\u0440\u044b\u0442\u044c',
    openMenu:      '\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u043e\u0441\u0442\u0438',
    fontSize:      '\u0420\u0430\u0437\u043c\u0435\u0440 \u0442\u0435\u043a\u0441\u0442\u0430',
    decrease:      '\u0423\u043c\u0435\u043d\u044c\u0448\u0438\u0442\u044c \u0442\u0435\u043a\u0441\u0442',
    increase:      '\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0442\u044c \u0442\u0435\u043a\u0441\u0442',
    stopAnim:      '\u041e\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c \u0430\u043d\u0438\u043c\u0430\u0446\u0438\u0438',
    underline:     '\u041f\u043e\u0434\u0447\u0451\u0440\u043a\u0438\u0432\u0430\u0442\u044c \u0441\u0441\u044b\u043b\u043a\u0438',
    contrast:      '\u0412\u044b\u0441\u043e\u043a\u0438\u0439 \u043a\u043e\u043d\u0442\u0440\u0430\u0441\u0442',
    dark:          '\u0422\u0451\u043c\u043d\u044b\u0439 \u0440\u0435\u0436\u0438\u043c',
    readable:      '\u0427\u0438\u0442\u0430\u0435\u043c\u044b\u0439 \u0448\u0440\u0438\u0444\u0442',
    cursor:        '\u0411\u043e\u043b\u044c\u0448\u043e\u0439 \u043a\u0443\u0440\u0441\u043e\u0440',
    reset:         '\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438'
  };

  function buildWidget() {
    var trigger = document.createElement('button');
    trigger.className = 'wi-a11y-trigger';
    trigger.setAttribute('aria-label', L.openMenu);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'wi-a11y-panel');
    trigger.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="4" r="1.5"/>' +
        '<path d="M6 8h12M12 8v13M8 13l-2 5M16 13l2 5"/>' +
      '</svg>';

    var panel = document.createElement('div');
    panel.className = 'wi-a11y-panel';
    panel.id = 'wi-a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', L.panelTitle);

    panel.innerHTML =
      '<div class="wi-a11y-panel-header">' +
        '<span>' + L.panelTitle + '</span>' +
        '<button class="wi-a11y-close" aria-label="' + L.close + '">\u2715</button>' +
      '</div>' +
      '<div class="wi-a11y-panel-body">' +
        '<div class="wi-a11y-option" role="group" aria-label="' + L.fontSize + '">' +
          '<div class="wi-a11y-option-label">' +
            '<span class="wi-a11y-option-icon" aria-hidden="true">\uD83D\uDD24</span>' +
            '<span>' + L.fontSize + '</span>' +
          '</div>' +
          '<div class="wi-a11y-font-controls">' +
            '<button class="wi-a11y-font-btn" id="wi-font-minus" aria-label="' + L.decrease + '">\u2212</button>' +
            '<span class="wi-a11y-font-value" id="wi-font-label" aria-live="polite">100%</span>' +
            '<button class="wi-a11y-font-btn" id="wi-font-plus" aria-label="' + L.increase + '">+</button>' +
          '</div>' +
        '</div>' +
        buildToggle('wi-no-animations',  '\uD83C\uDFAC', L.stopAnim,  prefs.noAnimations) +
        buildToggle('wi-underline-links','\uD83D\uDD17', L.underline, prefs.underlineLinks) +
        buildToggle('wi-high-contrast',  '\u25D1',       L.contrast,  prefs.highContrast) +
        buildToggle('wi-dark-mode',      '\uD83C\uDF19', L.dark,      prefs.darkMode) +
        buildToggle('wi-readable-font',  '\uD83D\uDCD6', L.readable,  prefs.readableFont) +
        buildToggle('wi-big-cursor',     '\uD83D\uDDB1', L.cursor,    prefs.bigCursor) +
        '<button class="wi-a11y-reset" id="wi-a11y-reset">' + L.reset + '</button>' +
      '</div>';

    document.body.appendChild(trigger);
    document.body.appendChild(panel);
    bindEvents(trigger, panel);
  }

  function buildToggle(id, icon, label, checked) {
    var inputId = 'wi-toggle-' + id;
    return '<label class="wi-a11y-option" for="' + inputId + '">' +
      '<div class="wi-a11y-option-label">' +
        '<span class="wi-a11y-option-icon" aria-hidden="true">' + icon + '</span>' +
        '<span>' + label + '</span>' +
      '</div>' +
      '<span class="wi-a11y-toggle">' +
        '<input type="checkbox" id="' + inputId + '" data-pref="' + id + '"' + (checked ? ' checked' : '') + '>' +
        '<span class="wi-a11y-toggle-track" aria-hidden="true"></span>' +
      '</span>' +
    '</label>';
  }

  var isOpen = false;

  function bindEvents(trigger, panel) {
    trigger.addEventListener('click', function () {
      isOpen = !isOpen;
      panel.classList.toggle('is-open', isOpen);
      trigger.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) panel.querySelector('.wi-a11y-close').focus();
    });

    panel.querySelector('.wi-a11y-close').addEventListener('click', function () {
      isOpen = false;
      panel.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        isOpen = false;
        panel.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (isOpen && !panel.contains(e.target) && e.target !== trigger) {
        isOpen = false;
        panel.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    panel.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        var key = this.dataset.pref;
        var prefKey = key.replace(/^wi-/, '').replace(/-([a-z])/g, function (_, c) {
          return c.toUpperCase();
        });
        prefs[prefKey] = this.checked;
        applyPrefs();
        savePrefs();
      });
    });

    var fontSizes = [100, 115, 130];
    var fontLabel = document.getElementById('wi-font-label');

    function updateFontLabel() {
      if (fontLabel) fontLabel.textContent = fontSizes[prefs.fontSize] + '%';
    }
    updateFontLabel();

    document.getElementById('wi-font-plus').addEventListener('click', function () {
      if (prefs.fontSize < 2) { prefs.fontSize++; applyPrefs(); savePrefs(); updateFontLabel(); }
    });

    document.getElementById('wi-font-minus').addEventListener('click', function () {
      if (prefs.fontSize > 0) { prefs.fontSize--; applyPrefs(); savePrefs(); updateFontLabel(); }
    });

    document.getElementById('wi-a11y-reset').addEventListener('click', function () {
      prefs = Object.assign({}, defaultPrefs);
      applyPrefs();
      savePrefs();
      panel.querySelectorAll('input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
      updateFontLabel();
    });
  }

  function init() {
    applyPrefs();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', buildWidget);
    } else {
      buildWidget();
    }
  }

  init();

})();
