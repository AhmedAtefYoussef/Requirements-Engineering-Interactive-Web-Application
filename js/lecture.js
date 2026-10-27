/* Lecture view: animated title block, tabs, learn and practice panels. */
(function () {
  'use strict';
  var RE = window.RE, h = RE.h;
  var TABS = [
    { id: 'learn', label: 'Learn', icon: 'book' },
    { id: 'practice', label: 'Practice', icon: 'lab' },
    { id: 'cards', label: 'Flashcards', icon: 'cards' },
    { id: 'quiz', label: 'Quiz', icon: 'quiz' },
    { id: 'glossary', label: 'Glossary', icon: 'glossary' }
  ];
  var state = null; // { lid, root, panel, tab, spy }

  /* ---------- title block ---------- */
  function header(meta, c) {
    var animate = !RE.motion.reduced();
    var wrap = h('header', { class: 'lec-head' });
    var left = h('div');
    var num = RE.svg('svg', { class: 'lec-numeral' + (animate ? ' animate' : ''), viewBox: '0 0 260 150', 'aria-hidden': 'true', style: 'view-transition-name:num-' + meta.id });
    num.appendChild(RE.svg('text', { x: '4', y: '138', text: RE.pad(meta.num) }));
    left.appendChild(num);
    var title = h('h1', { class: 'lec-title' + (animate ? ' animate' : ''), 'aria-label': c.title });
    c.title.split(' ').forEach(function (w, i) {
      title.appendChild(h('span', { class: 'w', 'aria-hidden': 'true', style: { '--i': i } }, h('span', null, w)));
      title.appendChild(document.createTextNode(' '));
    });
    left.appendChild(title);
    // A drafting dimension line measures the title, labelled with the sheet number.
    var dim = h('div', { class: 'dim' + (animate ? ' animate' : ''), 'aria-hidden': 'true' });
    dim.innerHTML = '<svg preserveAspectRatio="none" viewBox="0 0 100 34"><g vector-effect="non-scaling-stroke">' +
      '<line class="dim-line" x1="0.6" y1="17" x2="99.4" y2="17" vector-effect="non-scaling-stroke"/>' +
      '<line class="dim-tick" x1="0.4" y1="6" x2="0.4" y2="28" vector-effect="non-scaling-stroke"/>' +
      '<line class="dim-tick" x1="99.6" y1="6" x2="99.6" y2="28" vector-effect="non-scaling-stroke"/></g></svg>' +
      '<span class="dim-label">sheet ' + RE.pad(meta.num) + ' of 05 · ' + c.slides + ' slides</span>';
    left.appendChild(dim);
    left.appendChild(h('p', { class: 'lec-lede' }, c.lede));
    wrap.appendChild(left);

    var tb = h('div', { class: 'title-block', role: 'group', 'aria-label': 'Sheet details' });
    function cell(label, value, cls) { return h('div', { class: cls || '' }, h('span', null, label), h('b', { class: cls === 'num-cell' ? 'big' : '' }, value)); }
    tb.appendChild(cell('Sheet', RE.pad(meta.num) + ' / 05', 'num-cell'));
    tb.appendChild(cell('Course', 'CSEN406'));
    tb.appendChild(h('div', { class: 'wide' }, h('span', null, 'Title'), h('b', null, c.title)));
    tb.appendChild(cell('Drawn by', 'Dr. John Zaki'));
    tb.appendChild(cell('Paired with', meta.lab));
    var sc = RE.lectureScore(meta.id);
    tb.appendChild(cell('Sections read', sc.readN + ' of ' + sc.secs));
    tb.appendChild(cell('Best quiz', sc.best == null ? 'Not taken' : sc.best + '%'));
    wrap.appendChild(tb);
    return wrap;
  }

  /* ---------- tabs ---------- */
  function tabBar(lid, c) {
    var bar = h('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Lecture sections' });
    var counts = { practice: (c.practice || []).length, cards: c.flashcards.length, quiz: c.quiz.length, glossary: c.glossary.length };
    TABS.forEach(function (t) {
      bar.appendChild(h('a', { class: 'tab', role: 'tab', id: 'tab-' + t.id, href: '#' + lid + (t.id === 'learn' ? '' : '-' + t.id), 'aria-controls': 'panel', 'data-tab': t.id },
        RE.icon(t.icon), t.label, counts[t.id] ? h('span', { class: 'count num' }, counts[t.id]) : null));
    });
    bar.appendChild(h('span', { class: 'tab-ink' }));
    bar.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var tabs = RE.$$('.tab', bar), i = tabs.indexOf(document.activeElement); if (i < 0) return;
      var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]; n.focus(); n.click();
    });
    return bar;
  }
  function moveInk(bar, tabId, instant) {
    var tab = bar.querySelector('[data-tab="' + tabId + '"]'), ink = bar.querySelector('.tab-ink');
    RE.$$('.tab', bar).forEach(function (t) { var on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    if (!tab) return;
    if (instant) ink.style.transition = 'none';
    ink.style.transform = 'translateX(' + tab.offsetLeft + 'px) scaleX(' + tab.offsetWidth + ')';
    if (instant) { void ink.offsetWidth; ink.style.transition = ''; }
    if (tab.scrollIntoView && bar.scrollWidth > bar.clientWidth) tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  /* ---------- learn ---------- */
  function wrapTables(el) {
    RE.$$('table', el).forEach(function (t) { if (t.parentNode.classList.contains('tbl-wrap')) return; var w = h('div', { class: 'tbl-wrap' }); t.parentNode.insertBefore(w, t); w.appendChild(t); t.classList.add('tbl'); });
  }
  function learnPanel(panel, lid, c, meta) {
    var grid = h('div', { class: 'learn' });
    var main = h('div');
    var outcomes = h('section', { class: 'outcomes', 'aria-labelledby': 'oc-' + lid }, h('h2', { id: 'oc-' + lid }, 'By the end of this sheet you can'));
    var ul = h('ul');
    c.outcomes.forEach(function (o) { ul.appendChild(h('li', null, RE.icon('target'), h('span', null, o))); });
    outcomes.appendChild(ul); main.appendChild(outcomes);
    var read = RE.progress.read(lid);
    var toc = h('nav', { class: 'toc', 'aria-label': 'On this sheet' }, h('h2', null, 'On this sheet'));
    c.sections.forEach(function (s, i) {
      var sec = h('section', { class: 'lsec', id: lid + '~' + s.id, 'aria-labelledby': 'h-' + lid + '-' + s.id });
      sec.appendChild(h('div', { class: 'lsec-head' }, h('span', { class: 'idx num' }, meta.num + '.' + (i + 1)), h('h2', { id: 'h-' + lid + '-' + s.id }, s.title)));
      var prose = h('div', { class: 'prose', html: s.html }); wrapTables(prose); sec.appendChild(prose);
      if (s.visual) RE.mountVisual(s.visual, sec);
      if (s.takeaways && s.takeaways.length) {
        var tk = h('div', { class: 'takeaways' }, h('h3', null, 'Remember'));
        var tul = h('ul'); s.takeaways.forEach(function (t) { tul.appendChild(h('li', null, t)); }); tk.appendChild(tul); sec.appendChild(tk);
      }
      if (s.source) sec.appendChild(h('p', { class: 'source' }, RE.icon('source'), s.source));
      sec.appendChild(h('span', { class: 'read-sentinel', 'data-sid': s.id, 'aria-hidden': 'true' }));
      main.appendChild(sec);
      toc.appendChild(h('a', { href: '#' + lid + '~' + s.id, 'data-sid': s.id, class: read[s.id] ? 'read' : '' }, h('span', { class: 'dot' }), s.title));
    });
    // Next steps at the end of the reading.
    var idx = RE.LECTURES.indexOf(meta), next = RE.LECTURES[idx + 1], prev = RE.LECTURES[idx - 1];
    main.appendChild(h('div', { class: 'two-col', style: { 'margin-top': '8px' } },
      h('div', { class: 'panel' }, h('h3', null, 'Check yourself'), h('p', null, c.quiz.length + ' questions on concepts, theory and practice, each with its explanation.'), h('a', { class: 'btn primary small', href: '#' + lid + '-quiz' }, 'Take the quiz', RE.icon('arrow'))),
      h('div', { class: 'panel' }, h('h3', null, next ? 'Next sheet' : 'Previous sheet'), h('p', null, next ? next.title : prev.title), h('a', { class: 'btn small', href: '#' + (next || prev).id }, next ? 'Open Lecture ' + next.num : 'Back to Lecture ' + prev.num))
    ));
    toc.appendChild(h('div', { class: 'toc-next' }, h('a', { class: 'btn small', href: '#' + lid + '-cards' }, RE.icon('cards'), 'Flashcards'), h('a', { class: 'btn small', href: '#' + lid + '-quiz' }, RE.icon('quiz'), 'Quiz')));
    toc.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-sid]'); if (!a) return;
      e.preventDefault(); history.replaceState(null, '', a.getAttribute('href')); scrollToSection(lid, a.getAttribute('data-sid'));
    });
    grid.appendChild(main); grid.appendChild(toc);
    panel.appendChild(grid);
    RE.$$('.lsec', main).forEach(RE.reveal);

    // Scroll spy + read tracking.
    if (!('IntersectionObserver' in window)) return null;
    var links = {}; RE.$$('a[data-sid]', toc).forEach(function (a) { links[a.getAttribute('data-sid')] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sid = e.target.id.split('~')[1];
        RE.$$('a.active', toc).forEach(function (a) { a.classList.remove('active'); });
        links[sid] && links[sid].classList.add('active');
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    var done = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sid = e.target.getAttribute('data-sid');
        RE.progress.markRead(lid, sid); links[sid] && links[sid].classList.add('read'); done.unobserve(e.target);
      });
    });
    RE.$$('.lsec', main).forEach(function (s) { spy.observe(s); });
    RE.$$('.read-sentinel', main).forEach(function (s) { done.observe(s); });
    return { disconnect: function () { spy.disconnect(); done.disconnect(); } };
  }
  function scrollToSection(lid, sid) {
    var el = document.getElementById(lid + '~' + sid);
    if (el) el.scrollIntoView({ behavior: RE.motion.reduced() ? 'auto' : 'smooth', block: 'start' });
  }

  /* ---------- practice ---------- */
  function practicePanel(panel, lid, c) {
    if (!c.practice || !c.practice.length) { panel.appendChild(h('div', { class: 'empty' }, h('b', null, 'No lab for this sheet'), 'Use the quiz and flashcards to practise.')); return; }
    c.practice.forEach(function (p) {
      var art = h('article', { class: 'prac', id: 'prac-' + p.id });
      art.appendChild(h('h2', null, p.title));
      art.appendChild(h('p', { class: 'src' }, 'From ' + p.source + '. Try each step yourself, then reveal the worked answer.'));
      var pr = h('div', { class: 'prose', html: p.prompt }); wrapTables(pr); art.appendChild(pr);
      if (p.visual) RE.mountVisual(p.visual, art);
      var steps = h('div', { class: 'steps' });
      var notes = RE.store.get('notes:' + lid + ':' + p.id, {});
      (p.steps || []).forEach(function (s, i) {
        var st = h('div', { class: 'step' });
        var ansId = 'ans-' + p.id + '-' + i;
        var btn = h('button', { class: 'btn small', 'aria-expanded': 'false', 'aria-controls': ansId }, 'Show answer');
        st.appendChild(h('div', { class: 'step-q' }, h('span', { class: 'n' }, i + 1), h('p', null, s.q), btn));
        var ta = h('textarea', { class: 'think', id: 'think-' + p.id + '-' + i, placeholder: 'Your answer first (saved on this device)', 'aria-label': 'Your answer to step ' + (i + 1) });
        ta.value = notes[i] || '';
        ta.addEventListener('input', function () { notes[i] = ta.value; RE.store.set('notes:' + lid + ':' + p.id, notes); });
        st.appendChild(h('div', { class: 'think-wrap' }, ta));
        var inner = h('div', { class: 'inner prose', html: s.a }); wrapTables(inner);
        st.appendChild(h('div', { class: 'step-a', id: ansId }, h('div', null, inner)));
        btn.addEventListener('click', function () {
          var open = st.classList.toggle('open');
          btn.textContent = open ? 'Hide answer' : 'Show answer'; btn.setAttribute('aria-expanded', String(open));
        });
        steps.appendChild(st);
      });
      art.appendChild(steps);
      panel.appendChild(art);
    });
  }

  /* ---------- panel switching ---------- */
  function showTab(r, dir) {
    var c = RE.content[r.lid], meta = RE.lecture(r.lid);
    if (state.spy) { state.spy.disconnect(); state.spy = null; }
    var panel = state.panel;
    panel.innerHTML = '';
    panel.setAttribute('aria-labelledby', 'tab-' + r.tab);
    if (r.tab === 'learn') state.spy = learnPanel(panel, r.lid, c, meta);
    else if (r.tab === 'practice') practicePanel(panel, r.lid, c);
    else if (r.tab === 'cards') RE.flashcards(panel, c.flashcards.map(function (f) { return Object.assign({ lid: r.lid }, f); }), { scope: r.lid });
    else if (r.tab === 'quiz') RE.quiz(panel, r.lid, c);
    else if (r.tab === 'glossary') RE.renderGlossary(panel, c.glossary.map(function (g) { return Object.assign({ lid: r.lid }, g); }), { scope: r.lid });
    if (dir != null && !RE.motion.reduced()) { panel.style.setProperty('--dir', (dir * 18) + 'px'); panel.classList.remove('tab-panel-enter'); void panel.offsetWidth; panel.classList.add('tab-panel-enter'); }
    moveInk(state.bar, r.tab, dir == null);
    state.tab = r.tab;
    var tabLabel = TABS.filter(function (t) { return t.id === r.tab; })[0].label;
    RE.crumbs([{ text: 'Course plan', href: '#home' }, { text: 'Lecture ' + meta.num, href: '#' + r.lid }, { text: r.tab === 'learn' ? meta.short : tabLabel }]);
    document.title = 'L' + meta.num + ' ' + tabLabel + ' · Requirements Engineering';
  }

  RE.lectureView = {
    mounted: function (lid) { return !!(state && state.lid === lid && state.root.isConnected); },
    mount: function (view, r) {
      var meta = RE.lecture(r.lid);
      RE.crumbs([{ text: 'Course plan', href: '#home' }, { text: 'Lecture ' + meta.num }]);
      var root = h('div');
      view.appendChild(root);
      root.appendChild(h('div', { class: 'viz-loading', style: { 'min-height': '50vh' } }, 'Unrolling sheet ' + RE.pad(meta.num) + '…'));
      state = { lid: r.lid, root: root, tab: null, spy: null };
      RE.loadLecture(r.lid).then(function (c) {
        if (!state || state.root !== root) return;
        root.innerHTML = '';
        root.appendChild(header(meta, c));
        state.bar = tabBar(r.lid, c); root.appendChild(state.bar);
        state.panel = h('div', { id: 'panel', role: 'tabpanel', tabindex: '-1' }); root.appendChild(state.panel);
        showTab(r);
        requestAnimationFrame(function () { moveInk(state.bar, r.tab, true); });
        if (r.sec) setTimeout(function () { scrollToSection(r.lid, r.sec); }, 120);
      }, function () {
        root.innerHTML = '';
        root.appendChild(h('div', { class: 'empty' }, h('b', null, 'This sheet did not load'), 'You may be offline and this lecture is not saved yet. Reconnect and ', h('button', { class: 'btn small', onclick: function () { RE.go(r.token); } }, 'try again')));
      });
    },
    update: function (r) {
      if (!state.panel) return;
      if (r.tab !== state.tab) {
        var order = TABS.map(function (t) { return t.id; });
        showTab(r, order.indexOf(r.tab) > order.indexOf(state.tab) ? 1 : -1);
        var top = state.bar.getBoundingClientRect().top;
        if (top < 0 || window.scrollY > state.bar.offsetTop) window.scrollTo({ top: state.bar.offsetTop - 70, behavior: 'auto' });
      }
      if (r.sec) scrollToSection(r.lid, r.sec);
      RE.progress.setLast(r.token);
    }
  };
  window.addEventListener('resize', function () { if (state && state.bar && state.bar.isConnected) moveInk(state.bar, state.tab, true); });
})();
