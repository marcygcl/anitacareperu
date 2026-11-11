// Anita Care · selector de idioma y pestañas del prototipo. Sin dependencias, sin analítica.
(function () {
  'use strict';
  var root = document.documentElement;

  function applyLang(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);

    // Atributos traducibles: título, meta description, aria-label, <title>/<desc> del SVG
    var titleEl = document.querySelector('head > title');
    if (titleEl && titleEl.dataset[lang]) document.title = titleEl.dataset[lang];
    var meta = document.querySelector('meta[name="description"]');
    if (meta && meta.dataset[lang]) meta.setAttribute('content', meta.dataset[lang]);
    document.querySelectorAll('[data-es-aria]').forEach(function (el) {
      el.setAttribute('aria-label', el.getAttribute('data-' + lang + '-aria'));
    });
    document.querySelectorAll('svg title[data-es], svg desc[data-es]').forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang);
    });

    document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-set-lang') === lang));
    });

    try { localStorage.setItem('anita-lang', lang); } catch (e) {}
    try {
      var url = new URL(location.href);
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
    } catch (e) {}
  }

  document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () { applyLang(btn.getAttribute('data-set-lang')); });
  });
  applyLang(root.getAttribute('data-lang') === 'en' ? 'en' : 'es');

  // Pestañas accesibles del prototipo (patrón WAI-ARIA tabs)
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.phone-tabs [role="tab"]'));
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); select(next, true); }
    });
  });
})();
