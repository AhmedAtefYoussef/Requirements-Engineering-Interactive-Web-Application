/* Core: namespace, DOM helpers, storage, content registry, lazy loading, icons, motion. */
(function () {
  'use strict';
  var RE = (window.RE = window.RE || {});

  RE.LECTURES = [
    { id: 'l1', num: 1, short: 'Introduction', title: 'Introduction to Requirements Engineering', slides: 38, lab: 'Practice Assignment 1' },
    { id: 'l2', num: 2, short: 'Elicitation', title: 'Requirements Elicitation', slides: 36, lab: 'Practice Assignment 2' },
    { id: 'l3', num: 3, short: 'Prioritization', title: 'Negotiation, Triage & Prioritization', slides: 27, lab: 'Lab 3 · $100 case' },
    { id: 'l4', num: 4, short: 'Modeling', title: 'Requirements Modeling', slides: 15, lab: 'Lab 5' },
    { id: 'l5', num: 5, short: 'UML', title: 'Unified Modeling Language', slides: 34, lab: 'Lab 4' }
  ];
  RE.lecture = function (id) { return RE.LECTURES.filter(function (l) { return l.id === id; })[0]; };

  /* ---------- DOM ---------- */
  RE.$ = function (s, r) { return (r || document).querySelector(s); };
  RE.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  RE.h = function (tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'style' && typeof v === 'object') for (var s in v) el.style.setProperty(s, v[s]);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  };
  function append(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) return c.forEach(function (x) { append(el, x); });
    el.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c)));
  }
  RE.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  RE.strip = function (html) { var d = document.createElement('div'); d.innerHTML = html || ''; return d.textContent || ''; };
  RE.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  RE.pad = function (n) { return (n < 10 ? '0' : '') + n; };
  RE.svg = function (tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) { if (k === 'text') el.textContent = attrs[k]; else el.setAttribute(k, attrs[k]); }
    for (var i = 2; i < arguments.length; i++) if (arguments[i]) el.appendChild(arguments[i]);
    return el;
  };

  /* ---------- storage (never trusted, always wrapped) ---------- */
  var mem = {};
  RE.store = {
    get: function (k, d) {
      try { var v = localStorage.getItem('re406:' + k); return v == null ? (k in mem ? mem[k] : d) : JSON.parse(v); }
      catch (e) { return k in mem ? mem[k] : d; }
    },
    set: function (k, v) { mem[k] = v; try { localStorage.setItem('re406:' + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- events ---------- */
  var subs = {};
  RE.on = function (ev, fn) { (subs[ev] = subs[ev] || []).push(fn); };
  RE.emit = function (ev, data) { (subs[ev] || []).forEach(function (fn) { fn(data); }); };

  /* ---------- content registry + lazy loader ---------- */
  RE.content = {};
  var waiting = {};
  RE.register = function (lec) {
    RE.content[lec.id] = lec;
    (waiting[lec.id] || []).forEach(function (fn) { fn(lec); });
    delete waiting[lec.id];
    RE.emit('content', lec);
  };
  var scriptPromises = {};
  RE.loadScript = function (src) {
    if (scriptPromises[src]) return scriptPromises[src];
    scriptPromises[src] = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = function () { res(); };
      s.onerror = function () { delete scriptPromises[src]; rej(new Error('Could not load ' + src)); };
      document.head.appendChild(s);
    });
    return scriptPromises[src];
  };
  RE.loadLecture = function (id) {
    if (RE.content[id]) return Promise.resolve(RE.content[id]);
    return RE.loadScript('content/' + id + '.js').then(function () {
      if (RE.content[id]) return RE.content[id];
      return new Promise(function (res) { (waiting[id] = waiting[id] || []).push(res); });
    });
  };
  RE.loadAll = function () { return Promise.all(RE.LECTURES.map(function (l) { return RE.loadLecture(l.id).catch(function () { return null; }); })); };

  /* ---------- visuals registry ---------- */
  RE.visuals = {};
  RE.visual = function (key, def) { RE.visuals[key] = def; RE.emit('visual', key); };
  var vizFile = { 'golf-cart': 'l1' };
  RE.mountVisual = function (spec, host) {
    var parts = String(spec).split(':'), key = parts[0], preset = parts[1] || null;
    var file = vizFile[key];
    if (!file) RE.LECTURES.forEach(function (l) { if ((RE.VIZ_INDEX[l.id] || []).indexOf(key) >= 0) file = l.id; });
    var fig = RE.h('figure', { class: 'viz', 'data-viz': key });
    var head = RE.h('div', { class: 'viz-head' });
    var body = RE.h('div', { class: 'viz-body' }, RE.h('div', { class: 'viz-loading' }, 'Drafting the figure…'));
    fig.appendChild(head); fig.appendChild(body); host.appendChild(fig);
    function render() {
      var def = RE.visuals[key];
      if (!def) { body.innerHTML = '<div class="viz-loading">This figure is not available.</div>'; return; }
      head.innerHTML = '';
      head.appendChild(RE.h('h3', null, RE.icon('compass'), def.title));
      if (def.hint) head.appendChild(RE.h('p', null, def.hint));
      body.innerHTML = '';
      if (def.blueprint) body.classList.add('blueprint');
      try { def.render(body, preset, fig); }
      catch (e) { body.innerHTML = '<div class="viz-loading">The figure failed to draw.</div>'; if (window.console) console.error(e); }
    }
    if (RE.visuals[key]) render();
    else if (file) RE.loadScript('js/viz/' + file + '.js').then(render, function () { body.innerHTML = '<div class="viz-loading">Could not load this figure. Check your connection, then reload.</div>'; });
    else render();
    return fig;
  };
  RE.VIZ_INDEX = {
    l1: ['failure-cases', 'req-levels', 'req-sorter', 'nfr-wheel', 're-process', 'vv', 'golf-cart'],
    l2: ['elicit-plan', 'input-classifier', 'technique-matrix', 'workshop-roles', 'smart-builder'],
    l3: ['urgency-grid', 'moscow-board', 'hundred-dollar', 'pairwise', 'wiegers-matrix', 'ahp'],
    l4: ['why-what-how', 'wrspm'],
    l5: ['uml-tree', 'perspectives', 'usecase', 'sequence', 'class-diagram', 'state-activity']
  };

  /* ---------- progress ---------- */
  RE.progress = {
    read: function (lid) { return RE.store.get('read:' + lid, {}); },
    markRead: function (lid, sid) { var r = RE.progress.read(lid); if (!r[sid]) { r[sid] = Date.now(); RE.store.set('read:' + lid, r); RE.emit('progress', lid); } },
    quiz: function (lid) { return RE.store.get('quiz:' + lid, null); },
    saveQuiz: function (lid, pct) { var q = RE.progress.quiz(lid) || { best: 0, tries: 0 }; q.best = Math.max(q.best, pct); q.last = pct; q.tries++; RE.store.set('quiz:' + lid, q); RE.emit('progress', lid); },
    cards: function () { return RE.store.get('cards', {}); },
    saveCards: function (c) { RE.store.set('cards', c); RE.emit('progress'); },
    last: function () { return RE.store.get('last', null); },
    setLast: function (route) { RE.store.set('last', route); }
  };

  /* ---------- Leitner scheduling ---------- */
  var DAY = 864e5, INTERVALS = [0, 0, 1, 3, 7, 14];
  RE.leitner = {
    boxes: 5,
    state: function (id) { return RE.progress.cards()[id] || { box: 0, due: 0 }; },
    isDue: function (id) { var s = RE.leitner.state(id); return !s.due || s.due <= Date.now(); },
    rate: function (id, grade) {
      var all = RE.progress.cards(), s = all[id] || { box: 0, due: 0 };
      if (grade === 'again') s.box = 1;
      else if (grade === 'hard') s.box = Math.max(1, s.box);
      else s.box = Math.min(5, s.box + 1);
      var days = grade === 'again' ? 0 : INTERVALS[s.box];
      s.due = Date.now() + (grade === 'again' ? 60e3 : days * DAY);
      s.seen = (s.seen || 0) + 1;
      all[id] = s; RE.progress.saveCards(all); return s;
    },
    label: function (box) { return ['New', 'Learning', 'Box 2 · 1 day', 'Box 3 · 3 days', 'Box 4 · 1 week', 'Mastered · 2 weeks'][box] || 'New'; }
  };

  /* ---------- motion ---------- */
  var rm = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  RE.motion = {
    reduced: function () { return rm.matches; },
    ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
    // Animate an element that is already visible: plays a keyed entrance, leaves it at rest.
    enter: function (el, opts) {
      if (!el || RE.motion.reduced() || !el.animate) return;
      opts = opts || {};
      el.animate([{ opacity: 0, transform: 'translateY(' + (opts.y == null ? 16 : opts.y) + 'px)' }, { opacity: 1, transform: 'none' }],
        { duration: opts.duration || 560, delay: opts.delay || 0, easing: RE.motion.ease, fill: 'backwards' });
    },
    pop: function (el) {
      if (!el || RE.motion.reduced() || !el.animate) return;
      el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 320, easing: 'cubic-bezier(0.16,1,0.3,1)' });
    },
    shake: function (el) {
      if (!el || RE.motion.reduced() || !el.animate) return;
      el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }], { duration: 360, easing: 'ease-out' });
    }
  };
  // Reveal groups as they scroll into view; content is visible without script.
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      var kids = e.target.hasAttribute('data-stagger') ? Array.prototype.slice.call(e.target.children) : [e.target];
      kids.forEach(function (k, i) { RE.motion.enter(k, { delay: i * 70, y: 20 }); });
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) : null;
  RE.reveal = function (el) {
    if (!io || RE.motion.reduced()) return;
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92) return; // already on screen at load: leave at rest
    io.observe(el);
  };

  /* ---------- toast ---------- */
  RE.toast = function (msg) {
    var wrap = RE.$('.toasts') || document.body.appendChild(RE.h('div', { class: 'toasts', role: 'status', 'aria-live': 'polite' }));
    var t = RE.h('div', { class: 'toast' }, msg);
    wrap.appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 220); }, 2200);
  };

  /* ---------- icons (one stroke family, 24 grid, 1.75 weight) ---------- */
  var P = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
    cards: '<rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6"/><path d="M12 17.2v.3"/>',
    glossary: '<path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M8 9h6M8 13h6"/><path d="M18 7h2v13"/>',
    lab: '<path d="M9 3h6"/><path d="M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 14h9"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    compass: '<path d="M12 3v3"/><circle cx="12" cy="8" r="2"/><path d="m10.8 9.7-5.3 11.3M13.2 9.7l5.3 11.3"/><path d="M7.2 17.3h9.6"/>',
    shuffle: '<path d="M3 7h3.5c2 0 3.2 1 4.3 2.7l2.4 4.6C14.3 16 15.5 17 17.5 17H21"/><path d="M3 17h3.5c1.4 0 2.4-.5 3.2-1.4M14.3 8.4c.8-.9 1.8-1.4 3.2-1.4H21"/><path d="m18 4 3 3-3 3M18 14l3 3-3 3"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v4.5h4.5"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    source: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 17h4"/>',
    review: '<path d="M4 4h16v12H8l-4 4z"/><path d="M8 9h8M8 12h5"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    next: '<path d="M9 5l7 7-7 7"/>',
    prev: '<path d="M15 5l-7 7 7 7"/>',
    offline: '<path d="M3 3l18 18"/><path d="M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 4-2.5M19 13a10 10 0 0 0-3.2-2.2M2 9.5a15 15 0 0 1 4.5-3M22 9.5A15 15 0 0 0 11 5.1"/><path d="M12 20h.01"/>',
    keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>'
  };
  RE.icon = function (name, cls) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '1.75'); s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round');
    s.setAttribute('aria-hidden', 'true'); if (cls) s.setAttribute('class', cls);
    s.innerHTML = P[name] || '';
    return s;
  };
  RE.iconHTML = function (name) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || '') + '</svg>'; };
})();
