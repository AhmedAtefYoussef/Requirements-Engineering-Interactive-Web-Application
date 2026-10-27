/* Course-level views: home (the sheet set), glossary, review deck. */
(function () {
  'use strict';
  var RE = window.RE, h = RE.h;
  RE.views = {};

  var PROCESS = [
    ['Inception', 'Business case', 'Understand the business, the market and feasibility. Talk to managers, marketing, end users and engineers; sketch a preliminary solution. Brainstorming and joint application development meetings.'],
    ['Elicitation', 'Gather', 'Define scope, identify user requirements and constraints, interview and observe users. Sources: stakeholders, documents, existing systems, domain experts.'],
    ['Elaboration', 'Refine', 'Expand and look deeper at what was gathered. Build analysis models and prototypes.'],
    ['Negotiation', 'Decide', 'Separate needs from wants, prioritize, factor in risk, and resolve conflicts over resources, time, cost and scope.'],
    ['Specification', 'Write down', 'Produce the SRS, models, use cases, UML and UI prototypes, in language the customer understands.'],
    ['V & V', 'Check', 'Verification: built the product right. Validation: built the right product. Reviews, inspections, test-case generation, prototypes.'],
    ['Management', 'Track change', 'Identify, control and trace requirements as they change across the life of the system.']
  ];

  /* A hand-drafted drawing: the RE process as a sheet with dimension lines. */
  function heroDrawing() {
    var w = 500, H = 400;
    var s = '<svg viewBox="-50 0 ' + (w + 100) + ' ' + H + '" role="img" aria-label="Drawing of the requirements engineering process from inception to management">';
    s += '<g fill="none" stroke-linecap="round" stroke-linejoin="round">';
    var nodes = [[70, 90], [190, 70], [320, 95], [430, 160], [360, 270], [220, 300], [95, 245]];
    var names = ['inception', 'elicitation', 'elaboration', 'negotiation', 'specification', 'V & V', 'management'];
    var d = 'M' + nodes.map(function (n) { return n[0] + ' ' + n[1]; }).join(' L') + ' Z';
    s += '<path class="draw-path" d="' + d + '" style="stroke:var(--accent);stroke-width:2;--len:1500;--d:.2s"/>';
    s += '<path class="draw-path" d="M250 185 m-62 0 a62 62 0 1 0 124 0 a62 62 0 1 0 -124 0" style="stroke:var(--ink-3);stroke-width:1.2;stroke-dasharray:4 6;--len:400;--d:.9s"/>';
    nodes.forEach(function (n, i) {
      s += '<circle class="fade-late" cx="' + n[0] + '" cy="' + n[1] + '" r="9" style="fill:var(--sheet);stroke:var(--ink);stroke-width:2;--d:' + (0.5 + i * 0.12) + 's"/>';
      s += '<text class="fade-late hand" x="' + (n[0] + (n[0] > 250 ? 14 : -14)) + '" y="' + (n[1] + (n[1] > 185 ? 26 : -16)) + '" text-anchor="' + (n[0] > 250 ? 'start' : 'end') + '" style="font:15px var(--f-hand);fill:var(--ink-2);--d:' + (0.7 + i * 0.12) + 's">' + names[i] + '</text>';
    });
    s += '<text class="fade-late" x="250" y="180" text-anchor="middle" style="font:800 26px var(--f-display);fill:var(--ink);letter-spacing:1px;--d:1.4s">STAKEHOLDER</text>';
    s += '<text class="fade-late" x="250" y="206" text-anchor="middle" style="font:800 26px var(--f-display);fill:var(--ink);letter-spacing:1px;--d:1.5s">NEEDS</text>';
    s += '<g class="fade-late" style="--d:1.7s;stroke:var(--ink-3);stroke-width:1"><path d="M40 360 H460"/><path d="M40 352 v16 M460 352 v16"/><path d="M40 360 l8 -4 v8 z M460 360 l-8 -4 v8 z" style="fill:var(--ink-3)"/></g>';
    s += '<text class="fade-late hand" x="250" y="352" text-anchor="middle" style="font:14px var(--f-hand);fill:var(--ink-3);--d:1.8s">5 lectures · 5 labs · 1 system, drawn before it is built</text>';
    s += '</g></svg>';
    return s;
  }

  RE.views.home = function (view) {
    RE.crumbs([{ text: 'Course plan' }]);
    var last = RE.progress.last();
    var due = 0, total = 0;
    var root = h('div', { class: 'view-enter' });
    root.appendChild(h('section', { class: 'home-hero' },
      h('div', null,
        h('h1', null, 'Requirements, drawn to scale'),
        h('p', { class: 'lead' }, 'Every CSEN406 lecture turned into sheets you can study: figures to play with, flashcards that space themselves, quizzes that explain each answer, and a glossary that keeps every term in one place.'),
        h('div', { class: 'hero-actions' },
          h('a', { class: 'btn primary', href: '#' + (last || 'l1') }, last ? 'Continue where you stopped' : 'Start with Lecture 1', RE.icon('arrow')),
          h('a', { class: 'btn', href: '#review' }, RE.icon('cards'), 'Review due cards'),
          h('button', { class: 'btn ghost', onclick: RE.openPalette }, RE.icon('search'), 'Search')
        )),
      h('div', { class: 'hero-drawing blueprint', html: heroDrawing() })
    ));

    var strip = h('div', { class: 'stat-strip num' });
    root.appendChild(strip);
    function paintStats() {
      var secs = 0, read = 0, cards = 0, known = 0, quizzes = 0, best = 0, terms = 0;
      due = 0; total = 0;
      RE.LECTURES.forEach(function (l) {
        var c = RE.content[l.id]; if (!c) return;
        var sc = RE.lectureScore(l.id);
        secs += sc.secs; read += sc.readN; cards += sc.total; known += sc.known; terms += c.glossary.length;
        if (sc.best != null) { quizzes++; best += sc.best; }
        c.flashcards.forEach(function (f) { if (RE.leitner.isDue(f.id)) due++; });
      });
      strip.innerHTML = '';
      [[read + ' / ' + secs, 'sections read'], [known + ' / ' + cards, 'cards in long-term boxes'], [quizzes ? Math.round(best / quizzes) + '%' : '—', 'average best quiz score'], [terms, 'glossary terms'], [due, 'cards due today']]
        .forEach(function (p) { strip.appendChild(h('div', null, h('b', null, p[0]), h('span', null, p[1]))); });
    }

    root.appendChild(h('div', { class: 'section-head' }, h('h2', null, 'The sheet set'), h('p', null, 'Five lectures in teaching order. Each sheet has its lesson, a worked lab, flashcards, a quiz and its own glossary.')));
    var set = h('div', { class: 'sheet-set', 'data-stagger': '' });
    RE.LECTURES.forEach(function (l) {
      var row = h('a', { class: 'sheet-row', href: '#' + l.id },
        h('span', { class: 'sheet-num', style: { 'view-transition-name': 'num-' + l.id } }, RE.pad(l.num)),
        h('div', null, h('h3', null, l.title), h('p', { 'data-lede': l.id }, l.slides + ' slides · paired with ' + l.lab)),
        h('div', { class: 'sheet-meta num', 'data-meta': l.id }),
        h('span', { class: 'sheet-go' }, RE.icon('arrow')));
      set.appendChild(row);
    });
    root.appendChild(set);
    function paintRows() {
      RE.LECTURES.forEach(function (l) {
        var c = RE.content[l.id], meta = root.querySelector('[data-meta="' + l.id + '"]');
        if (c) root.querySelector('[data-lede="' + l.id + '"]').textContent = c.lede;
        var s = RE.lectureScore(l.id);
        meta.innerHTML = '';
        [['Read', s.read, '', s.readN + '/' + s.secs], ['Cards', s.cards, 'g', s.known + '/' + s.total], ['Quiz', s.quiz, 'a', s.best == null ? '—' : s.best + '%']].forEach(function (m) {
          meta.appendChild(h('div', { class: 'meter-line' }, h('span', null, m[0]), h('span', { class: 'meter ' + m[2] }, h('i', { style: { '--v': m[1] } })), h('span', null, m[3])));
        });
      });
    }

    root.appendChild(h('div', { class: 'section-head' }, h('h2', null, 'The process at a glance'), h('p', null, 'The seven requirements activities from Lecture 1. Pick one to see what happens there.')));
    var detail = h('div', { class: 'process-detail', 'aria-live': 'polite' });
    var ps = h('div', { class: 'process-strip', role: 'group', 'aria-label': 'Requirements engineering activities' });
    PROCESS.forEach(function (p, i) {
      ps.appendChild(h('button', { 'aria-pressed': i === 0 ? 'true' : 'false', onclick: function (e) {
        RE.$$('button', ps).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        e.currentTarget.setAttribute('aria-pressed', 'true'); showStep(i);
      } }, h('b', null, p[0]), h('span', null, p[1])));
    });
    function showStep(i) {
      detail.innerHTML = '';
      detail.appendChild(h('p', { style: { margin: '0' } }, h('strong', null, PROCESS[i][0] + ': '), PROCESS[i][2]));
      RE.motion.enter(detail.firstChild, { y: 8, duration: 360 });
    }
    root.appendChild(ps); root.appendChild(detail); showStep(0);

    root.appendChild(h('div', { class: 'section-head' }, h('h2', null, 'How to use it'), h('p', null, 'A study loop that works for this course.')));
    root.appendChild(h('div', { class: 'two-col', 'data-stagger': '' },
      h('div', { class: 'panel' }, h('h3', null, 'Learn, then play'), h('p', null, 'Read a section, then use its figure: sort the statements, move the AHP judgements, step through the sequence diagram. Sections you finish are ticked in the outline.'), h('a', { class: 'btn small', href: '#l1' }, 'Open Lecture 1')),
      h('div', { class: 'panel' }, h('h3', null, 'Recall, don’t reread'), h('p', null, 'Flashcards use five Leitner boxes. Rate each card honestly and it comes back in one, three, seven or fourteen days.'), h('a', { class: 'btn small', href: '#review' }, 'Open the review deck')),
      h('div', { class: 'panel' }, h('h3', null, 'Test three ways'), h('p', null, 'Each quiz mixes concept, theory and practice questions. Every answer comes with the reason, and you can retake only the ones you missed.'), h('a', { class: 'btn small', href: '#l3-quiz' }, 'Try the prioritization quiz')),
      h('div', { class: 'panel' }, h('h3', null, 'Keyboard first'), h('p', null, 'Press Ctrl K or / to search anything. In flashcards, Space flips and 1, 2, 3 rate. In quizzes, A to D choose and Enter checks.'), h('button', { class: 'btn small', onclick: RE.openPalette }, 'Open search'))
    ));

    view.appendChild(root);
    RE.$$('[data-stagger], .section-head', root).forEach(RE.reveal);
    paintStats(); paintRows();
    RE.loadAll().then(function () { if (root.isConnected) { paintStats(); paintRows(); } });
  };

  /* ---------- glossary ---------- */
  RE.renderGlossary = function (host, entries, opts) {
    opts = opts || {};
    var q = '', lecFilter = 'all';
    var tools = h('div', { class: 'gl-tools' });
    var input = h('input', { type: 'search', id: 'gl-q-' + (opts.scope || 'all'), placeholder: 'Filter ' + entries.length + ' terms', 'aria-label': 'Filter terms' });
    tools.appendChild(h('label', { class: 'field' }, RE.icon('search'), input));
    var seg = null;
    if (opts.lectureFilter) {
      seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Lecture' });
      ['all'].concat(RE.LECTURES.map(function (l) { return l.id; })).forEach(function (id) {
        seg.appendChild(h('button', { 'aria-pressed': id === 'all' ? 'true' : 'false', onclick: function (e) {
          lecFilter = id; RE.$$('button', seg).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); }); e.currentTarget.setAttribute('aria-pressed', 'true'); paint();
        } }, id === 'all' ? 'All' : 'L' + id.slice(1)));
      });
      tools.appendChild(seg);
    }
    var count = h('span', { class: 'num', style: { color: 'var(--ink-3)', 'font-size': '0.9rem' }, 'aria-live': 'polite' });
    tools.appendChild(count);
    var alpha = h('div', { class: 'alpha', role: 'navigation', 'aria-label': 'Jump to letter' });
    var list = h('dl', { class: 'gl-list' });
    host.appendChild(tools); host.appendChild(alpha); host.appendChild(list);
    var sorted = entries.slice().sort(function (a, b) { return a.term.localeCompare(b.term); });
    function hl(text) {
      var safe = RE.esc(text); if (!q) return safe;
      var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      return safe.replace(re, '<mark>$1</mark>');
    }
    function paint() {
      var shown = sorted.filter(function (e) {
        if (lecFilter !== 'all' && e.lid !== lecFilter) return false;
        return !q || (e.term + ' ' + e.def).toLowerCase().indexOf(q.toLowerCase()) >= 0;
      });
      list.innerHTML = ''; alpha.innerHTML = '';
      var letters = {}; shown.forEach(function (e) { letters[e.term[0].toUpperCase()] = 1; });
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function (L) {
        alpha.appendChild(h('button', { disabled: !letters[L], 'aria-label': 'Jump to ' + L, onclick: function () { var t = list.querySelector('[data-letter="' + L + '"]'); t && t.scrollIntoView({ behavior: RE.motion.reduced() ? 'auto' : 'smooth', block: 'start' }); } }, L));
      });
      var cur = null;
      shown.forEach(function (e) {
        var L = e.term[0].toUpperCase();
        if (L !== cur && !q) { list.appendChild(h('div', { class: 'gl-letter', 'data-letter': L }, L)); cur = L; }
        var item = h('div', { class: 'gl-item', id: 'term-' + RE.slug(e.term) });
        item.appendChild(h('dt', null, h('span', { html: hl(e.term) }), opts.lectureFilter ? h('a', { class: 'tag', href: '#' + e.lid }, 'L' + e.lid.slice(1)) : null));
        item.appendChild(h('dd', { html: hl(e.def) }));
        if (e.related && e.related.length) {
          var rel = h('div', { class: 'rel' });
          e.related.forEach(function (r) {
            var exists = sorted.some(function (x) { return x.term.toLowerCase() === r.toLowerCase(); });
            rel.appendChild(h('button', { title: exists ? 'Show ' + r : 'Search for ' + r, onclick: function () { if (exists) focusTerm(r); else { input.value = r; q = r; paint(); } } }, r));
          });
          item.appendChild(h('dd', null, rel));
        }
        list.appendChild(item);
      });
      if (!shown.length) list.appendChild(h('div', { class: 'empty', style: { 'grid-column': '1 / -1' } }, h('b', null, 'No terms match'), 'Clear the filter or try a broader word.'));
      count.textContent = shown.length + ' of ' + entries.length;
    }
    function focusTerm(term) {
      q = ''; input.value = ''; lecFilter = 'all';
      if (seg) RE.$$('button', seg).forEach(function (b, i) { b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false'); });
      paint();
      var el = document.getElementById('term-' + RE.slug(term));
      if (el) { el.scrollIntoView({ behavior: RE.motion.reduced() ? 'auto' : 'smooth', block: 'center' }); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
    }
    input.addEventListener('input', function () { q = input.value.trim(); paint(); });
    paint();
    return { focus: focusTerm };
  };

  RE.views.glossary = function (view, r) {
    RE.crumbs([{ text: 'Course plan', href: '#home' }, { text: 'Glossary' }]);
    var root = h('div', { class: 'view-enter' });
    root.appendChild(h('div', { class: 'section-head', style: { 'margin-top': '8px' } }, h('h2', { style: { 'font-size': 'var(--step-4)' } }, 'Glossary'), h('p', null, 'Every term from the five lectures. Filter by lecture, jump by letter, follow related terms.')));
    var host = h('div', null, h('div', { class: 'viz-loading' }, 'Collecting terms…'));
    root.appendChild(host); view.appendChild(root);
    RE.loadAll().then(function () {
      var all = [];
      RE.LECTURES.forEach(function (l) { var c = RE.content[l.id]; if (c) c.glossary.forEach(function (g) { all.push({ term: g.term, def: g.def, related: g.related, lid: l.id }); }); });
      host.innerHTML = '';
      var g = RE.renderGlossary(host, all, { lectureFilter: true, scope: 'all' });
      if (r.term) { var match = all.filter(function (e) { return RE.slug(e.term) === r.term; })[0]; if (match) setTimeout(function () { g.focus(match.term); }, 80); }
    });
  };

  /* ---------- review deck (all lectures) ---------- */
  RE.views.review = function (view) {
    RE.crumbs([{ text: 'Course plan', href: '#home' }, { text: 'Review deck' }]);
    var root = h('div', { class: 'view-enter' });
    root.appendChild(h('div', { class: 'section-head', style: { 'margin-top': '8px' } }, h('h2', { style: { 'font-size': 'var(--step-4)' } }, 'Review deck'), h('p', null, 'Flashcards from every lecture, scheduled by five Leitner boxes. Cards you know come back less often.')));
    var host = h('div', null, h('div', { class: 'viz-loading' }, 'Shuffling the deck…'));
    root.appendChild(host); view.appendChild(root);
    RE.loadAll().then(function () {
      var cards = [];
      RE.LECTURES.forEach(function (l) { var c = RE.content[l.id]; if (c) c.flashcards.forEach(function (f) { cards.push(Object.assign({ lid: l.id }, f)); }); });
      host.innerHTML = '';
      var boxes = [0, 0, 0, 0, 0, 0];
      cards.forEach(function (c) { boxes[RE.leitner.state(c.id).box]++; });
      var grid = h('div', { class: 'review-grid num' });
      ['Not seen yet', 'Box 1 · again', 'Box 2 · 1 day', 'Box 3 · 3 days', 'Box 4 · 1 week', 'Mastered'].forEach(function (n, i) {
        grid.appendChild(h('div', { class: 'box' }, h('b', null, boxes[i]), h('span', null, n)));
      });
      host.appendChild(grid);
      var deckHost = h('div'); host.appendChild(deckHost);
      RE.flashcards(deckHost, cards, { scope: 'all', showLecture: true });
    });
  };
})();
