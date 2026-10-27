/* Shell: navigation rail, routing with view transitions, theme, command palette, offline. */
(function () {
  'use strict';
  var RE = window.RE, h = RE.h, $ = RE.$;
  var view = $('#view'), rail = $('#rail'), scrim = $('#rail-scrim');
  var current = null;

  /* ---------- rail ---------- */
  function navItem(href, numNode, text, meterId) {
    var a = h('a', { class: 'nav-item', href: href, 'data-route': href.slice(1) },
      h('span', { class: 'nav-num' }, numNode), h('span', { class: 'nav-text' }, text));
    if (meterId) a.appendChild(h('span', { class: 'nav-meter', 'data-meter': meterId, title: 'Progress' }, h('i')));
    return a;
  }
  $('#nav-main').appendChild(navItem('#home', RE.icon('home'), 'Course plan'));
  RE.LECTURES.forEach(function (l) { $('#nav-lectures').appendChild(navItem('#' + l.id, RE.pad(l.num), l.short, l.id)); });
  $('#nav-tools').appendChild(navItem('#review', RE.icon('cards'), 'Review deck'));
  $('#nav-tools').appendChild(navItem('#glossary', RE.icon('glossary'), 'Glossary'));
  $('#menu-btn').appendChild(RE.icon('menu'));

  function lectureScore(lid) {
    var c = RE.content[lid], read = Object.keys(RE.progress.read(lid)).length, q = RE.progress.quiz(lid);
    var secs = c ? c.sections.length : 7;
    var cardsAll = RE.progress.cards(), known = 0, total = c ? c.flashcards.length : 25;
    if (c) c.flashcards.forEach(function (f) { var s = cardsAll[f.id]; if (s && s.box >= 3) known++; });
    return { read: Math.min(1, read / secs), quiz: q ? q.best / 100 : 0, cards: total ? known / total : 0, readN: read, secs: secs, known: known, total: total, best: q ? q.best : null };
  }
  RE.lectureScore = lectureScore;
  function paintMeters() {
    RE.$$('[data-meter]').forEach(function (m) {
      var s = lectureScore(m.getAttribute('data-meter'));
      m.firstChild.style.transform = 'scaleX(' + ((s.read + s.quiz + s.cards) / 3) + ')';
    });
  }
  RE.on('progress', paintMeters); RE.on('content', paintMeters);

  function setRail(open) {
    rail.classList.toggle('open', open); scrim.classList.toggle('open', open);
    $('#menu-btn').setAttribute('aria-expanded', String(open));
    if (open) { var f = rail.querySelector('[aria-current="page"]') || rail.querySelector('a'); f && f.focus(); }
  }
  $('#menu-btn').addEventListener('click', function () { setRail(!rail.classList.contains('open')); });
  scrim.addEventListener('click', function () { setRail(false); });
  rail.addEventListener('click', function (e) { if (e.target.closest('a')) setRail(false); });

  /* ---------- theme ---------- */
  function effectiveDark() {
    var t = document.documentElement.getAttribute('data-theme');
    return t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  $('#theme-btn').addEventListener('click', function (e) {
    var next = effectiveDark() ? 'light' : 'dark';
    function apply() { document.documentElement.setAttribute('data-theme', next); RE.store.set('theme', next); }
    // Ink spreads from the button, like flooding a cyanotype.
    if (document.startViewTransition && !RE.motion.reduced()) {
      var r = e.currentTarget.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      var rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      document.documentElement.classList.add('theme-vt');
      var vt = document.startViewTransition(apply);
      vt.ready.then(function () {
        document.documentElement.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + rad + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 650, easing: RE.motion.ease, pseudoElement: '::view-transition-new(root)' });
      });
      vt.finished.then(function () { document.documentElement.classList.remove('theme-vt'); });
    } else apply();
    $('#theme-btn').setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  });
  var css = document.createElement('style');
  css.textContent = '.theme-vt::view-transition-old(root),.theme-vt::view-transition-new(root){animation:none;mix-blend-mode:normal}';
  document.head.appendChild(css);

  /* ---------- topbar ---------- */
  var topbar = $('#topbar');
  window.addEventListener('scroll', function () { topbar.classList.toggle('scrolled', window.scrollY > 8); }, { passive: true });
  function crumbs(parts) {
    var c = $('#crumbs'); c.innerHTML = '';
    parts.forEach(function (p, i) {
      if (i) c.appendChild(h('span', { 'aria-hidden': 'true' }, '/'));
      c.appendChild(p.href ? h('a', { href: p.href }, p.text) : h('b', null, p.text));
    });
  }
  RE.crumbs = crumbs;

  /* ---------- routing ---------- */
  function parse(hash) {
    var t = (hash || '').replace(/^#/, '') || 'home';
    var m = /^(l[1-5])(?:-(learn|practice|cards|quiz|glossary))?(?:~([\w-]+))?$/.exec(t);
    if (m) return { page: 'lecture', lid: m[1], tab: m[2] || 'learn', sec: m[3] || null, token: t };
    if (t === 'glossary' || t === 'review' || t === 'home') return { page: t, token: t };
    var g = /^glossary~([\w-]+)$/.exec(t);
    if (g) return { page: 'glossary', term: g[1], token: t };
    return { page: 'home', token: 'home' };
  }
  function markNav(r) {
    RE.$$('.nav-item').forEach(function (a) {
      var on = a.getAttribute('data-route') === (r.page === 'lecture' ? r.lid : r.page);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function render(r, opts) {
    markNav(r);
    if (r.page !== 'home') RE.progress.setLast(r.token);
    // Same lecture: only the tab or section changed, keep the title block in place.
    if (current && current.page === 'lecture' && r.page === 'lecture' && current.lid === r.lid && RE.lectureView.mounted(r.lid)) {
      RE.lectureView.update(r);
      current = r; return;
    }
    var swap = function () {
      view.innerHTML = '';
      window.scrollTo(0, 0);
      if (r.page === 'lecture') RE.lectureView.mount(view, r);
      else RE.views[r.page](view, r);
      if (!opts || !opts.initial) view.focus({ preventScroll: true });
    };
    if (document.startViewTransition && !RE.motion.reduced() && current && !(opts && opts.initial)) document.startViewTransition(swap);
    else swap();
    current = r;
  }
  RE.go = function (token) { if (location.hash.slice(1) === token) render(parse(token)); else location.hash = token; };
  window.addEventListener('hashchange', function () { render(parse(location.hash)); });

  /* ---------- command palette ---------- */
  var pal = $('#palette'), q = $('#pal-q'), results = $('#pal-results'), items = [], active = 0, index = null;
  function buildIndex() {
    index = [];
    RE.LECTURES.forEach(function (l) {
      var c = RE.content[l.id]; if (!c) return;
      c.sections.forEach(function (s) { index.push({ kind: 'Sections', icon: 'book', title: s.title, sub: RE.strip(s.html).slice(0, 140), where: 'L' + l.num, go: l.id + '~' + s.id, hay: (s.title + ' ' + RE.strip(s.html)).toLowerCase() }); });
      c.glossary.forEach(function (g) { index.push({ kind: 'Glossary', icon: 'glossary', title: g.term, sub: g.def, where: 'L' + l.num, go: 'glossary~' + slug(g.term), hay: (g.term + ' ' + g.def).toLowerCase(), boost: 2 }); });
      c.flashcards.forEach(function (f) { index.push({ kind: 'Flashcards', icon: 'cards', title: f.front, sub: f.back, where: 'L' + l.num, go: l.id + '-cards', hay: (f.front + ' ' + f.back).toLowerCase() }); });
      (c.practice || []).forEach(function (p) { index.push({ kind: 'Practice', icon: 'lab', title: p.title, sub: p.source, where: 'L' + l.num, go: l.id + '-practice', hay: (p.title + ' ' + RE.strip(p.prompt)).toLowerCase() }); });
    });
  }
  RE.slug = slug;
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function search(term) {
    term = term.trim().toLowerCase();
    if (!term) {
      return RE.LECTURES.map(function (l) { return { kind: 'Jump to', icon: 'book', title: 'Lecture ' + l.num + ' · ' + l.title, sub: 'Learn, practice, flashcards, quiz, glossary', where: '', go: l.id }; })
        .concat([{ kind: 'Jump to', icon: 'cards', title: 'Review deck', sub: 'Every due flashcard across the course', go: 'review', where: '' }, { kind: 'Jump to', icon: 'glossary', title: 'Glossary', sub: 'Every term, A to Z', go: 'glossary', where: '' }]);
    }
    var words = term.split(/\s+/);
    return index.map(function (it) {
      var score = 0, t = it.title.toLowerCase();
      for (var i = 0; i < words.length; i++) { if (it.hay.indexOf(words[i]) < 0) return null; if (t.indexOf(words[i]) >= 0) score += 3; }
      if (t.indexOf(term) === 0) score += 6;
      return { it: it, s: score + (it.boost || 0) };
    }).filter(Boolean).sort(function (a, b) { return b.s - a.s; }).slice(0, 40).map(function (x) { return x.it; });
  }
  function paintResults() {
    items = search(q.value); active = 0; results.innerHTML = '';
    if (!items.length) { results.appendChild(h('div', { class: 'empty' }, h('b', null, 'Nothing matches'), 'Try a shorter term, such as "extend" or "AHP".')); return; }
    var last = null;
    items.forEach(function (it, i) {
      if (it.kind !== last) { results.appendChild(h('div', { class: 'pal-group' }, it.kind)); last = it.kind; }
      results.appendChild(h('button', { class: 'pal-item' + (i === 0 ? ' active' : ''), role: 'option', id: 'pal-' + i, 'data-i': i, onclick: function () { choose(i); }, onmousemove: function () { setActive(i); } },
        RE.icon(it.icon), h('span', { style: { 'min-width': '0' } }, it.title, h('small', null, it.sub)), h('span', { class: 'where' }, it.where)));
    });
    q.setAttribute('aria-activedescendant', 'pal-0');
  }
  function setActive(i) {
    var all = RE.$$('.pal-item', results); if (!all.length) return;
    active = (i + all.length) % all.length;
    all.forEach(function (b, j) { b.classList.toggle('active', j === active); });
    all[active].scrollIntoView({ block: 'nearest' });
    q.setAttribute('aria-activedescendant', 'pal-' + active);
  }
  function choose(i) { var it = items[i]; if (!it) return; pal.close(); RE.go(it.go); }
  function openPalette() {
    if (pal.open) return;
    q.value = ''; pal.showModal(); paintResults(); q.focus();
    RE.loadAll().then(function () { buildIndex(); if (pal.open) paintResults(); });
  }
  RE.openPalette = openPalette;
  $('#search-btn').addEventListener('click', openPalette);
  q.addEventListener('input', paintResults);
  q.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
  });
  pal.addEventListener('click', function (e) { if (e.target === pal) pal.close(); });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
    else if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !pal.open) { e.preventDefault(); openPalette(); }
    else if (e.key === 'Escape' && rail.classList.contains('open')) setRail(false);
  });

  /* ---------- offline ---------- */
  var note = $('#offline-note');
  function setNote(t) { note.textContent = t; }
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && RE.store.get('nosw', 0) !== 1) {
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      setNote('Saved for offline study.');
      reg.addEventListener('updatefound', function () { var w = reg.installing; w && w.addEventListener('statechange', function () { if (w.state === 'installed' && navigator.serviceWorker.controller) RE.toast('A new version is ready. Reload to use it.'); }); });
    }).catch(function () { setNote('Runs in this browser; pages load as you open them.'); });
  } else setNote('Runs in this browser; pages load as you open them.');
  window.addEventListener('offline', function () { RE.toast('You are offline. Saved lectures still work.'); });

  /* ---------- boot ---------- */
  render(parse(location.hash), { initial: true });
  paintMeters();
  // Warm the content cache when the browser is idle, so later pages open instantly.
  (window.requestIdleCallback || function (f) { setTimeout(f, 1200); })(function () { RE.loadAll().then(paintMeters); });
})();
