/* Lecture 3 figures: urgency grid, MoSCoW, $100, pairwise, Wiegers matrix, AHP. */
(function () {
  'use strict';
  var RE = window.RE, h = RE.h, svg = RE.svg;

  /* ---------------- pure maths (exposed for testing) ---------------- */
  var RI = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
  function ahpCalc(M) {
    var n = M.length, cs = [], N = [], w = [], i, j;
    for (j = 0; j < n; j++) { cs[j] = 0; for (i = 0; i < n; i++) cs[j] += M[i][j]; }
    for (i = 0; i < n; i++) { N[i] = []; var s = 0; for (j = 0; j < n; j++) { N[i][j] = M[i][j] / cs[j]; s += N[i][j]; } w[i] = s / n; }
    var lambda = 0; for (j = 0; j < n; j++) lambda += cs[j] * w[j];
    var ci = n > 1 ? (lambda - n) / (n - 1) : 0, ri = RI[Math.min(n, 10) - 1] || 0;
    return { n: n, cs: cs, N: N, w: w, lambda: lambda, ci: ci, ri: ri, cr: ri > 0 ? ci / ri : 0 };
  }
  function wiegersCalc(rows, wt) {
    var tv = 0, tc = 0, tr = 0;
    var out = rows.map(function (r) { var v = r.ben * wt.ben + r.pen * wt.pen; tv += v; tc += r.cost; tr += r.risk; return { id: r.id, value: v }; });
    out.forEach(function (o, i) {
      o.vp = tv ? o.value / tv * 100 : 0; o.cp = tc ? rows[i].cost / tc * 100 : 0; o.rp = tr ? rows[i].risk / tr * 100 : 0;
      var d = o.cp * wt.cost + o.rp * wt.risk; o.pri = d > 0 ? o.vp / d : (o.vp > 0 ? Infinity : 0);
    });
    return out;
  }
  RE.vizMath = RE.vizMath || {}; RE.vizMath.l3 = { ahpCalc: ahpCalc, wiegersCalc: wiegersCalc };

  /* ---------------- small helpers ---------------- */
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1); }
  function f2(v) { return (Math.round(v * 100) / 100).toFixed(2); }
  function f3(v) { return (Math.round(v * 1000) / 1000).toFixed(3); }
  function meter(frac, cls) { return h('div', { class: 'meter' + (cls ? ' ' + cls : '') }, h('i', { style: { '--v': clamp(frac, 0, 1) } })); }
  function fb(kind, icon, content) { return h('div', { class: 'feedback ' + kind }, RE.icon(icon), h('div', null, content)); }
  function grid(min) { return { display: 'grid', gap: '12px', 'grid-template-columns': 'repeat(auto-fit, minmax(' + (min || 150) + 'px, 1fr))' }; }

  /* ---------------- shared token sorter (urgency grid, MoSCoW) ---------------- */
  function sorter(cfg) {
    var place = {}, sel = null, tok = {}, zoneEl = {};
    var root = h('div');
    var info = h('p', { class: 'viz-note', 'aria-live': 'polite' }, cfg.hintText);
    var result = h('div', { 'aria-live': 'polite' });
    function setSel(id) {
      sel = sel === id ? null : id;
      Object.keys(tok).forEach(function (k) { var on = k === sel; tok[k].classList.toggle('selected', on); tok[k].setAttribute('aria-pressed', on ? 'true' : 'false'); });
      info.textContent = sel ? 'Selected: "' + byId(sel).text + '". Now choose a box (click it, or focus it and press Enter).' : cfg.hintText;
    }
    function byId(id) { return cfg.items.filter(function (i) { return i.id === id; })[0]; }
    function clearMarks() { Object.keys(tok).forEach(function (k) { tok[k].classList.remove('ok', 'bad'); }); result.innerHTML = ''; }
    function moveTo(id, zid) {
      place[id] = zid; clearMarks();
      (zid === 'pool' ? poolBody : zoneEl[zid].body).appendChild(tok[id]);
      RE.motion.pop(tok[id]);
      if (sel === id) setSel(id);
      var left = cfg.items.filter(function (i) { return place[i.id] === 'pool'; }).length;
      poolWrap.style.display = left ? '' : 'none';
      checkBtn.disabled = false;
    }
    cfg.items.forEach(function (it) {
      place[it.id] = 'pool';
      tok[it.id] = h('button', {
        class: 'token', type: 'button', draggable: 'true', 'aria-pressed': 'false', text: it.text,
        onclick: function (e) { e.stopPropagation(); setSel(it.id); },
        ondragstart: function (e) { try { e.dataTransfer.setData('text/plain', it.id); e.dataTransfer.effectAllowed = 'move'; } catch (x) {} tok[it.id].classList.add('dragging'); },
        ondragend: function () { tok[it.id].classList.remove('dragging'); }
      });
    });
    function wireZone(el, zid) {
      el.addEventListener('click', function () { if (sel) moveTo(sel, zid); });
      el.addEventListener('keydown', function (e) { if (e.target === el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); if (sel) moveTo(sel, zid); } });
      el.addEventListener('dragover', function (e) { e.preventDefault(); el.classList.add('over'); });
      el.addEventListener('dragleave', function () { el.classList.remove('over'); });
      el.addEventListener('drop', function (e) {
        e.preventDefault(); el.classList.remove('over');
        var id = ''; try { id = e.dataTransfer.getData('text/plain'); } catch (x) {}
        if (id && tok[id]) moveTo(id, zid);
      });
    }
    var poolBody = h('div', { style: { display: 'flex', 'flex-wrap': 'wrap', gap: '8px' } });
    var poolWrap = h('div', { class: 'drop-zone', tabindex: '0', role: 'group', 'aria-label': 'Unsorted requirements' }, h('strong', null, 'To sort'), poolBody);
    wireZone(poolWrap, 'pool');
    cfg.items.forEach(function (it) { poolBody.appendChild(tok[it.id]); });
    var zonesWrap = h('div', { style: grid(cfg.zoneMin || 170) });
    cfg.zones.forEach(function (z) {
      var body = h('div', { style: { display: 'flex', 'flex-direction': 'column', gap: '8px', 'margin-top': '8px' } });
      var el = h('div', { class: 'drop-zone', tabindex: '0', role: 'group', title: z.def || null, 'aria-label': 'Box: ' + z.label + (z.def ? '. ' + z.def : '') },
        h('strong', null, z.label), z.sub ? h('div', { class: 'viz-note', style: { 'margin-top': '2px' } }, z.sub) : null, body);
      zoneEl[z.id] = { el: el, body: body };
      wireZone(el, z.id);
      if (z.def) {
        var show = function () { info.textContent = z.label + ': ' + z.def; };
        el.addEventListener('mouseenter', show); el.addEventListener('focus', show);
      }
      zonesWrap.appendChild(el);
    });
    var checkBtn = h('button', {
      class: 'btn primary', type: 'button', text: 'Check my answers',
      onclick: function () {
        clearMarks();
        var right = 0, unplaced = 0, list = h('div');
        cfg.items.forEach(function (it) {
          var p = place[it.id];
          if (p === 'pool') { unplaced++; return; }
          var ok = p === it.answer; if (ok) right++;
          tok[it.id].classList.add(ok ? 'ok' : 'bad');
          var zl = function (id) { return cfg.zones.filter(function (z) { return z.id === id; })[0].label; };
          list.appendChild(fb(ok ? 'ok' : 'bad', ok ? 'check' : 'x', [h('strong', null, '"' + it.text + '" '), ok ? 'is correct (' + zl(p) + '). ' : 'is not ' + zl(p) + ': it belongs in ' + zl(it.answer) + '. ', it.why]));
        });
        var total = cfg.items.length;
        result.appendChild(fb(right === total ? 'ok' : 'info', right === total ? 'check' : 'info',
          right + ' of ' + total + ' correct.' + (unplaced ? ' ' + unplaced + ' still unsorted, so they are not scored.' : '') + (cfg.after ? ' ' + cfg.after : '')));
        result.appendChild(list);
        if (right < total - unplaced) RE.motion.shake(result);
      }
    });
    var resetBtn = h('button', {
      class: 'btn ghost', type: 'button', onclick: function () {
        sel = null; clearMarks();
        cfg.items.forEach(function (it) { place[it.id] = 'pool'; tok[it.id].classList.remove('selected'); tok[it.id].setAttribute('aria-pressed', 'false'); poolBody.appendChild(tok[it.id]); });
        poolWrap.style.display = ''; info.textContent = cfg.hintText;
      }
    }, RE.icon('reset'), ' Reset');
    var shuffleBtn = h('button', { class: 'btn ghost', type: 'button', onclick: function () { RE.shuffle(cfg.items).forEach(function (it) { poolBody.appendChild(tok[it.id]); }); } }, RE.icon('shuffle'), ' Shuffle');
    root.appendChild(cfg.intro);
    root.appendChild(h('div', { style: { display: 'grid', gap: '12px', 'margin-top': '12px' } }, poolWrap, zonesWrap));
    root.appendChild(info);
    root.appendChild(h('div', { class: 'viz-actions' }, checkBtn, shuffleBtn, resetBtn));
    root.appendChild(result);
    return root;
  }

  /* ---------------- 1. urgency grid ---------------- */
  RE.visual('urgency-grid', {
    title: 'Importance x urgency grid',
    hint: 'Sort each requirement into High, Medium, Low or Don\'t do',
    blueprint: false,
    render: function (body) {
      var items = [
        { id: 'u1', text: 'The system must comply with a new tax rule that takes effect next month', answer: 'high', why: 'Important (legal duty) and urgent (a fixed deadline in the next release), so High.' },
        { id: 'u2', text: 'Payment gateway integration, needed before the first donations arrive next sprint', answer: 'high', why: 'Without it no donation can be taken (important) and it is needed in the very next release (urgent): High.' },
        { id: 'u3', text: 'A reporting dashboard we want by the release after next', answer: 'medium', why: 'It matters to the business but nothing forces it into this release: important, not urgent, so Medium.' },
        { id: 'u4', text: 'Donor segmentation for campaigns planned two releases from now', answer: 'medium', why: 'Valuable, but the campaigns are later, so it can wait: important, not urgent, Medium.' },
        { id: 'u5', text: 'The VP wants a new colour theme by Friday, with no link to any business objective', answer: 'dont', why: 'Urgent only because someone is pushing. It does not serve a goal, so do not spend effort on it (scrub it or set it low).' },
        { id: 'u6', text: 'A board member demands the logo be redrawn before tomorrow\'s demo; it changes no behaviour', answer: 'dont', why: 'Urgent pressure with no value to the system goals: urgent but not important, so Don\'t do.' },
        { id: 'u7', text: 'Optional animation on the About page', answer: 'low', why: 'Neither important nor urgent, so Low.' },
        { id: 'u8', text: 'Customizable fonts for thank-you notes, someday', answer: 'low', why: 'A nice-to-have with no deadline: not important, not urgent, Low.' }
      ];
      body.appendChild(sorter({
        items: items, zoneMin: 200,
        hintText: 'Click a requirement, then click a box. Or drag it. Judge against the forthcoming release.',
        intro: h('p', { class: 'viz-note', style: { 'margin-top': '0' } }, 'Ask two separate questions: is it important (does it serve the goals)? Is it urgent (is it needed in the next release or by a hard deadline)?'),
        zones: [
          { id: 'high', label: 'High', sub: 'Important and urgent', def: 'Important and urgent: needed in the next release, or a contract or compliance deadline.' },
          { id: 'medium', label: 'Medium', sub: 'Important, not urgent', def: 'Important but not urgent: matters, but can wait for a later release.' },
          { id: 'dont', label: 'Don\'t do', sub: 'Urgent, not important', def: 'Urgent but not important: often someone\'s political pressure. Do not spend effort; scrub it or set it low.' },
          { id: 'low', label: 'Low', sub: 'Neither important nor urgent', def: 'Neither important nor urgent.' }
        ],
        after: 'Keep the two dimensions separate: shouting makes something urgent, not important.'
      }));
    }
  });

  /* ---------------- 2. MoSCoW board ---------------- */
  RE.visual('moscow-board', {
    title: 'MoSCoW board',
    hint: 'Scope an online food-delivery MVP: Must, Should, Could, Won\'t',
    blueprint: false,
    render: function (body) {
      var items = [
        { id: 'm1', text: 'Customer can browse restaurant menus', answer: 'must', why: 'Delete it and nobody can order: the product fails without it.' },
        { id: 'm2', text: 'Customer pays for the order online', answer: 'must', why: 'No payment, no business. Test: remove it and the MVP is not a success.' },
        { id: 'm3', text: 'Restaurant receives and accepts incoming orders', answer: 'must', why: 'Orders that never reach a kitchen cannot be delivered.' },
        { id: 'm4', text: 'Customer sees the driver on a live map', answer: 'should', why: 'Important and expected, but deliveries still work without it, so it is not mandatory for success.' },
        { id: 'm5', text: 'Status notifications (accepted, out for delivery)', answer: 'should', why: 'Reduces "where is my food" calls; include if possible, but not essential for the first release.' },
        { id: 'm6', text: 'Save favourite restaurants', answer: 'could', why: 'Desirable convenience that can be deferred without harming success.' },
        { id: 'm7', text: 'Promo codes and discounts', answer: 'could', why: 'Helps marketing later; implement only if time and resources permit.' },
        { id: 'm8', text: 'Customer rates driver and restaurant after delivery', answer: 'could', why: 'Nice for quality over time, but the MVP can launch without it.' },
        { id: 'm9', text: 'Loyalty points programme', answer: 'wont', why: 'Not for this release: it can come in a future release. Write "Won\'t this release", not "never".' },
        { id: 'm10', text: 'Drone delivery option', answer: 'wont', why: 'Out of scope for the MVP; maybe a future release.' }
      ];
      body.appendChild(sorter({
        items: items, zoneMin: 150,
        hintText: 'Hover or focus a column to read its definition. Click a requirement, then a column (or drag).',
        intro: h('p', { class: 'viz-note', style: { 'margin-top': '0' } }, 'Scenario: first release (MVP) of an online food-delivery app. Test for Must: if you delete the item and the product still succeeds, it is not a Must.'),
        zones: [
          { id: 'must', label: 'Must', def: 'Must be satisfied for the solution to be considered a success.' },
          { id: 'should', label: 'Should', def: 'Important and should be included if possible, but not mandatory for success.' },
          { id: 'could', label: 'Could', def: 'Desirable, but could be deferred or eliminated. Implement only if time and resources permit.' },
          { id: 'wont', label: 'Won\'t (this release)', def: 'Will not be implemented at this time but could be included in a future release. Deferred, not never.' }
        ],
        after: 'Should versus Could is a judgement call; what matters is that you can give a reason for every Must.'
      }));
    }
  });

  /* ---------------- 3. $100 method ---------------- */
  var DONATION = ['Donor History Tracking', 'Automated Email Reminders', 'Detailed Reporting', 'Volunteer Management', 'Donor Segmentation', 'Integration with Payment Gateways', 'Customizable Thank You Notes', 'Event Management'];
  var TEAM = [ // RE1..RE8 x U1..U6, from the lecture's sample table
    [20, 15, 25, 20, 10, 20], [10, 10, 5, 15, 10, 10], [15, 20, 10, 15, 25, 15], [5, 0, 5, 5, 5, 10],
    [10, 10, 15, 5, 10, 10], [25, 30, 25, 30, 20, 25], [5, 5, 5, 5, 10, 0], [10, 10, 10, 5, 10, 10]
  ];
  var GENERIC = ['Search', 'Offline mode', 'Dark theme', 'Export to PDF', 'Share with friends'];

  function rankList(names, vals) { // dense-by-position ranks with ties sharing a rank
    var idx = names.map(function (n, i) { return i; }).sort(function (a, b) { return vals[b] - vals[a] || a - b; });
    var ranks = []; idx.forEach(function (i, p) { ranks[i] = p > 0 && vals[idx[p - 1]] === vals[i] ? ranks[idx[p - 1]] : p + 1; });
    return { order: idx, ranks: ranks };
  }

  RE.visual('hundred-dollar', {
    title: '$100 method',
    hint: 'Spend exactly $100: more dollars, higher priority',
    blueprint: false,
    render: function (body, preset) {
      var donation = preset === 'donation';
      var names = donation ? DONATION.map(function (n, i) { return 'RE' + (i + 1) + ': ' + n; }) : GENERIC.slice();
      var alloc = names.map(function () { return 0; });
      var mode = 'mine', locked = false;
      var root = h('div');
      body.appendChild(root);
      function remaining() { return 100 - alloc.reduce(function (a, b) { return a + b; }, 0); }
      var refs = {};
      function draw() {
        root.innerHTML = '';
        if (donation) {
          root.appendChild(h('div', { class: 'seg', role: 'group', 'aria-label': 'Mode', style: { 'margin-bottom': '14px' } },
            h('button', { type: 'button', 'aria-pressed': String(mode === 'mine'), onclick: function () { mode = 'mine'; draw(); } }, 'My $100'),
            h('button', { type: 'button', 'aria-pressed': String(mode === 'team'), onclick: function () { mode = 'team'; draw(); } }, 'Team of 6')));
        }
        if (mode === 'team') return drawTeam();
        drawMine();
      }
      function drawMine() {
        refs = { rows: [] };
        refs.rem = h('div', { class: 'num', 'aria-live': 'polite', style: { 'font-size': '2.6rem', 'font-weight': '700', 'line-height': '1' } });
        refs.remNote = h('div', { class: 'viz-note', style: { margin: '0' } });
        root.appendChild(h('div', { style: { display: 'flex', 'align-items': 'baseline', gap: '12px', 'flex-wrap': 'wrap', 'margin-bottom': '12px' } }, refs.rem, refs.remNote));
        var list = h('div', { style: { display: 'grid', gap: '10px' } });
        names.forEach(function (n, i) {
          var id = 'hd-' + Math.random().toString(36).slice(2, 7);
          var range = h('input', { type: 'range', min: '0', max: '100', step: '1', value: String(alloc[i]), 'aria-label': 'Dollars for ' + n, style: { width: '100%' } });
          var num = h('input', { type: 'number', min: '0', max: '100', step: '1', value: String(alloc[i]), id: id, 'aria-label': 'Dollars for ' + n, style: { width: '72px' } });
          var bar = meter(0, '');
          var upd = function (raw) {
            var v = clamp(Math.round(Number(raw) || 0), 0, alloc[i] + remaining());
            alloc[i] = v; range.value = v; num.value = v;
            if (locked) { locked = false; }
            refresh();
          };
          range.addEventListener('input', function () { upd(range.value); });
          num.addEventListener('change', function () { upd(num.value); });
          refs.rows.push({ bar: bar, val: null });
          list.appendChild(h('div', { style: grid(180) },
            h('label', { for: id, text: n, style: { 'font-weight': '600' } }),
            h('div', { style: { display: 'grid', 'grid-template-columns': '1fr 80px', gap: '10px', 'align-items': 'center' } }, range, num)));
          list.appendChild(h('div', { style: { display: 'grid', 'grid-template-columns': '1fr 44px', gap: '8px', 'align-items': 'center', 'margin-top': '-6px' } }, bar, h('span', { class: 'num', text: '$0' })));
          refs.rows[i].val = list.lastChild.lastChild;
        });
        root.appendChild(list);
        refs.out = h('div', { 'aria-live': 'polite' });
        root.appendChild(h('div', { class: 'viz-actions' },
          h('button', { class: 'btn primary', type: 'button', onclick: lock }, RE.icon('flag'), ' Lock in'),
          h('button', { class: 'btn ghost', type: 'button', onclick: function () { alloc = alloc.map(function () { return 0; }); locked = false; draw(); } }, RE.icon('reset'), ' Reset')));
        root.appendChild(refs.out);
        root.appendChild(h('p', { class: 'viz-note' }, 'The budget is fixed: a slider stops when the money is gone. The method sees only perceived value and ignores cost.'));
        refresh();
      }
      function refresh() {
        var r = remaining();
        refs.rem.textContent = '$' + r + ' left';
        refs.remNote.textContent = r === 0 ? 'Budget fully spent.' : 'of $100. Spend all of it before locking in.';
        alloc.forEach(function (v, i) { refs.rows[i].bar.firstChild.style.setProperty('--v', v / 100); refs.rows[i].val.textContent = '$' + v; });
        if (!locked) refs.out.innerHTML = '';
      }
      function lock() {
        var r = remaining(); refs.out.innerHTML = '';
        if (r > 0) { refs.out.appendChild(fb('info', 'info', 'You still have $' + r + ' to spend. The method spends exactly $100 before ranking.')); RE.motion.shake(refs.out); return; }
        locked = true;
        var rk = rankList(names, alloc), ol = h('ol', { style: { 'padding-left': '1.4em', margin: '6px 0 0' } });
        rk.order.forEach(function (i) { ol.appendChild(h('li', null, names[i] + ' ', h('span', { class: 'num', text: '($' + alloc[i] + ')' }), rk.order.filter(function (k) { return alloc[k] === alloc[i]; }).length > 1 ? ' (tie, rank ' + rk.ranks[i] + ')' : '')); });
        refs.out.appendChild(fb('ok', 'check', [h('strong', null, 'Priority order'), ol]));
        var top = Math.max.apply(null, alloc);
        if (top >= 60) refs.out.appendChild(fb('info', 'info', 'One item took $' + top + '. That is the gaming risk: one favourite can swamp everything. Caps and a "why?" discussion reduce it.'));
        RE.motion.enter(refs.out, { y: 8 });
      }
      function drawTeam() {
        var n = TEAM[0].length, sums = TEAM.map(function (r) { return r.reduce(function (a, b) { return a + b; }, 0); });
        var avgs = sums.map(function (s) { return s / n; }), rk = rankList(names, sums);
        var colOk = []; for (var u = 0; u < n; u++) colOk.push(TEAM.reduce(function (a, r) { return a + r[u]; }, 0));
        var head = ['Requirement'].concat(['U1', 'U2', 'U3', 'U4', 'U5', 'U6'], ['Value', 'Average', 'Rank']);
        var table = h('table', { class: 'matrix' }, h('thead', null, h('tr', null, head.map(function (t) { return h('th', { scope: 'col', text: t }); }))),
          h('tbody', null, TEAM.map(function (r, i) {
            return h('tr', null, h('th', { scope: 'row', text: 'RE' + (i + 1), title: DONATION[i], style: { 'text-align': 'left' } }),
              r.map(function (v) { return h('td', { class: 'num', text: String(v) }); }),
              h('td', { class: 'num', text: String(sums[i]) }), h('td', { class: 'num', text: f1(avgs[i]) }), h('td', { class: 'num', text: String(rk.ranks[i]) }));
          })),
          h('tfoot', null, h('tr', null, h('th', { scope: 'row', text: 'Column total', style: { 'text-align': 'left' } }),
            colOk.map(function (v) { return h('td', { class: 'num', text: String(v) }); }),
            h('td', { class: 'num', text: String(sums.reduce(function (a, b) { return a + b; }, 0)) }), h('td', { class: 'num', text: f1(avgs.reduce(function (a, b) { return a + b; }, 0)) }), h('td'))));
        root.appendChild(h('div', { class: 'viz-scroll', style: { 'overflow-x': 'auto' } }, table));
        var chart = h('div', { style: { display: 'grid', gap: '8px', 'margin-top': '14px' } });
        rk.order.forEach(function (i) {
          chart.appendChild(h('div', { style: { display: 'grid', 'grid-template-columns': 'minmax(120px,220px) 1fr 44px', gap: '10px', 'align-items': 'center' } },
            h('span', { text: names[i] }), meter(avgs[i] / 30), h('span', { class: 'num', text: f1(avgs[i]) })));
        });
        root.appendChild(chart);
        root.appendChild(fb('info', 'info', 'Each user spends exactly $100 (every column totals 100), so the grand total is 6 x 100 = 600 and the averages total 100. Ranking: RE6, RE1, RE3, then RE2 = RE5 (tie), RE8, then RE4 = RE7. Ties need a "why?" discussion.'));
      }
      draw();
    }
  });

  /* ---------------- 4. pairwise comparison ---------------- */
  RE.visual('pairwise', {
    title: 'Pairwise comparison',
    hint: 'Compare every pair, tally the wins, then see why it does not scale',
    blueprint: false,
    render: function (body) {
      var names = ['FR1: Mark a director as favourite', 'FR2: Critics post reviews', 'FR3: Users rate reviews', 'FR4: Notify on a new film by a favourite', 'NFR1: Runs on Windows, iOS and Android'];
      var pairs = []; for (var i = 0; i < names.length; i++) for (var j = i + 1; j < names.length; j++) pairs.push([i, j]);
      var choice = [], step = 0;
      var root = h('div'), duel = h('div'), res = h('div', { 'aria-live': 'polite' });
      function draw() {
        duel.innerHTML = ''; res.innerHTML = '';
        if (step < pairs.length) {
          var p = pairs[step];
          var pick = function (w) { choice[step] = w; step++; draw(); };
          duel.appendChild(h('p', { style: { margin: '0 0 8px', 'font-weight': '600' }, text: 'Comparison ' + (step + 1) + ' of ' + pairs.length + ': which has higher priority?' }));
          duel.appendChild(meter(step / pairs.length));
          duel.appendChild(h('div', { style: Object.assign(grid(200), { 'margin-top': '12px' }) },
            [p[0], p[1]].map(function (k) { return h('button', { class: 'btn primary', type: 'button', style: { 'min-height': '84px', 'white-space': 'normal' }, onclick: function () { pick(k); } }, names[k]); })));
          duel.appendChild(h('div', { class: 'viz-actions' }, h('button', { class: 'btn ghost small', type: 'button', disabled: step === 0 ? true : null, onclick: function () { if (step > 0) { step--; draw(); } } }, RE.icon('prev'), ' Back')));
        } else {
          var wins = names.map(function () { return 0; }); choice.forEach(function (w) { wins[w]++; });
          var rk = rankList(names, wins);
          duel.appendChild(h('p', { style: { margin: '0 0 8px', 'font-weight': '600' }, text: 'All ' + pairs.length + ' comparisons done. Wins per requirement:' }));
          var chart = h('div', { style: { display: 'grid', gap: '8px' } });
          rk.order.forEach(function (k) {
            chart.appendChild(h('div', { style: { display: 'grid', 'grid-template-columns': 'minmax(130px,260px) 1fr 70px', gap: '10px', 'align-items': 'center' } },
              h('span', { text: rk.ranks[k] + '. ' + names[k] }), meter(wins[k] / (names.length - 1), 'g'), h('span', { class: 'num', text: wins[k] + ' wins' })));
          });
          duel.appendChild(chart);
          var tie = rk.order.some(function (k, p) { return p > 0 && wins[rk.order[p - 1]] === wins[k]; });
          res.appendChild(fb(tie ? 'info' : 'ok', tie ? 'info' : 'check', tie ? 'Some requirements tie, so this tally gives no unique order. Votes can also contradict themselves (A beats B, B beats C, C beats A). AHP, later in the lecture, measures that inconsistency.' : 'A unique rank order: the most wins is the highest priority. (Each requirement can win at most ' + (names.length - 1) + ' times.)'));
          duel.appendChild(h('div', { class: 'viz-actions' }, h('button', { class: 'btn ghost', type: 'button', onclick: function () { choice = []; step = 0; draw(); } }, RE.icon('reset'), ' Start again')));
        }
      }
      var cnt = h('div', { class: 'num', 'aria-live': 'polite', style: { 'font-size': '1.6rem', 'font-weight': '700' } });
      var bar = meter(0, 'a');
      var rng = h('input', { type: 'range', min: '2', max: '40', value: '5', 'aria-label': 'Number of requirements n', style: { width: '100%' } });
      var cap = h('p', { class: 'viz-note', style: { margin: '6px 0 0' } });
      function scale() {
        var n = Number(rng.value), c = n * (n - 1) / 2;
        cnt.textContent = 'n = ' + n + ' requirements: n(n-1)/2 = ' + c + ' comparisons';
        bar.firstChild.style.setProperty('--v', c / 780);
        cap.textContent = n <= 10 ? 'Fine for a short list.' : n <= 24 ? 'Getting heavy: a couple of dozen items is about the practical limit.' : 'Far too many judgments. Doubling n roughly quadruples the work (n = 10 gives 45, n = 20 gives 190, n = 40 gives 780).';
      }
      rng.addEventListener('input', scale);
      root.appendChild(duel); root.appendChild(res);
      root.appendChild(h('div', { style: { 'margin-top': '22px', 'padding-top': '16px', 'border-top': '1px solid var(--rule)' } },
        h('h4', { text: 'Why it does not scale' }), h('label', { class: 'viz-note' }, 'Slide n: '), rng, cnt, bar, cap));
      body.appendChild(root); draw(); scale();
    }
  });

  /* ---------------- 5. Wiegers matrix ---------------- */
  RE.visual('wiegers-matrix', {
    title: 'Value, cost and risk matrix',
    hint: 'Edit the ratings and weights, watch the ranking re-sort',
    blueprint: false,
    render: function (body) {
      var uid = 3;
      var rows = [{ id: 1, name: 'A', ben: 8, pen: 4, cost: 3, risk: 2 }, { id: 2, name: 'B', ben: 5, pen: 8, cost: 2, risk: 1 }, { id: 3, name: 'C', ben: 9, pen: 3, cost: 8, risk: 8 }];
      var wt = { ben: 2, pen: 1, cost: 1, risk: 0.5 };
      var els = {}; // id -> {tr, cells}
      var tbody = h('tbody');
      function numIn(val, min, max, step, label, on) {
        var inp = h('input', { type: 'number', min: String(min), max: String(max), step: String(step), value: String(val), 'aria-label': label });
        inp.addEventListener('input', function () { on(inp, false); });
        inp.addEventListener('change', function () { on(inp, true); });
        return inp;
      }
      function fix(inp, lo, hi) { var v = Number(inp.value); if (!isFinite(v)) v = lo; v = clamp(v, lo, hi); return v; }
      function makeRow(r) {
        var tr = h('tr'), c = {};
        var name = h('input', { type: 'text', value: r.name, 'aria-label': 'Feature name', style: { width: '90px', 'text-align': 'left' } });
        name.addEventListener('input', function () { r.name = name.value; });
        var ins = ['ben', 'pen', 'cost', 'risk'].map(function (k) {
          return h('td', null, numIn(r[k], 1, 9, 1, k + ' for ' + r.name, function (inp, commit) { r[k] = fix(inp, 1, 9); if (commit) inp.value = r[k]; recalc(commit); }));
        });
        ['val', 'vp', 'cp', 'rp', 'pri', 'rank'].forEach(function (k) { c[k] = h('td', { class: 'num' }); });
        var del = h('button', { class: 'btn ghost small', type: 'button', 'aria-label': 'Remove ' + r.name, onclick: function () { if (rows.length > 2) { rows = rows.filter(function (x) { return x !== r; }); tr.remove(); delete els[r.id]; recalc(true); } } }, RE.icon('x'));
        tr.appendChild(h('td', null, name)); ins.forEach(function (td) { tr.appendChild(td); });
        ['val', 'vp', 'cp', 'rp', 'pri', 'rank'].forEach(function (k) { tr.appendChild(c[k]); });
        tr.appendChild(h('td', null, del));
        els[r.id] = { tr: tr, c: c }; tbody.appendChild(tr);
      }
      function recalc(reorder) {
        var res = wiegersCalc(rows, wt), byId = {};
        res.forEach(function (o) { byId[o.id] = o; });
        var order = rows.slice().sort(function (a, b) { return (byId[b.id].pri === Infinity ? 1e12 : byId[b.id].pri) - (byId[a.id].pri === Infinity ? 1e12 : byId[a.id].pri); });
        rows.forEach(function (r) {
          var o = byId[r.id], c = els[r.id].c;
          c.val.textContent = f1(o.value); c.vp.textContent = f1(o.vp) + '%'; c.cp.textContent = f1(o.cp) + '%'; c.rp.textContent = f1(o.rp) + '%';
          c.pri.textContent = o.pri === Infinity ? 'inf' : f2(o.pri); c.rank.textContent = String(order.indexOf(r) + 1);
        });
        if (reorder) {
          var cur = Array.prototype.slice.call(tbody.children), want = order.map(function (r) { return els[r.id].tr; });
          if (cur.some(function (t, i) { return t !== want[i]; })) {
            var tops = new Map(); cur.forEach(function (t) { tops.set(t, t.getBoundingClientRect().top); });
            var act = document.activeElement, s0 = null; try { s0 = act && act.selectionStart; } catch (e) {}
            want.forEach(function (t) { tbody.appendChild(t); });
            if (act && act.focus && tbody.contains(act)) { act.focus(); try { if (s0 != null) act.setSelectionRange(s0, s0); } catch (e) {} }
            if (!RE.motion.reduced()) want.forEach(function (t) {
              var d = tops.get(t) - t.getBoundingClientRect().top;
              if (d && t.animate) t.animate([{ transform: 'translateY(' + d + 'px)' }, { transform: 'none' }], { duration: 420, easing: RE.motion.ease });
            });
          }
        }
        var top = order[0];
        verdict.textContent = top ? 'Do first: ' + top.name + ' (priority ' + (byId[top.id].pri === Infinity ? 'inf' : f2(byId[top.id].pri)) + '). ' + explain(order, byId) : '';
      }
      function explain(order, byId) {
        var hi = rows.slice().sort(function (a, b) { return byId[b.id].vp - byId[a.id].vp; })[0];
        return hi !== order[0] ? hi.name + ' has the highest value (' + f1(byId[hi.id].vp) + '%) but ranks lower because it costs more and carries more risk.' : 'It also has the highest value share.';
      }
      var verdict = h('p', { class: 'viz-note', 'aria-live': 'polite' });
      var wrow = h('div', { style: grid(120) });
      [['ben', 'Benefit weight'], ['pen', 'Penalty weight'], ['cost', 'Cost weight'], ['risk', 'Risk weight']].forEach(function (p) {
        var id = 'wg-' + p[0] + Math.random().toString(36).slice(2, 6);
        wrow.appendChild(h('div', null, h('label', { for: id, class: 'viz-note', style: { display: 'block', margin: '0 0 4px' }, text: p[1] }),
          (function () { var i = numIn(wt[p[0]], 0, 5, 0.5, p[1], function (inp, commit) { wt[p[0]] = fix(inp, 0, 5); if (commit) inp.value = wt[p[0]]; recalc(commit); }); i.id = id; i.style.width = '80px'; return i; })()));
      });
      var heads = ['Feature', 'Benefit', 'Penalty', 'Cost', 'Risk', 'Value', 'Value %', 'Cost %', 'Risk %', 'Priority', 'Rank', ''];
      var table = h('table', { class: 'matrix' }, h('thead', null, h('tr', null, heads.map(function (t) { return h('th', { scope: 'col', text: t }); }))), tbody);
      rows.forEach(makeRow);
      body.appendChild(h('div', null,
        h('p', { class: 'viz-note', style: { 'margin-top': 0 } }, 'Customers rate benefit and penalty (1-9); developers rate cost and risk (1-9). Priority = Value% / (Cost% x cost weight + Risk% x risk weight).'),
        wrow, h('div', { class: 'viz-scroll', style: { 'margin-top': '14px', 'overflow-x': 'auto' } }, table), verdict,
        h('div', { class: 'viz-actions' },
          h('button', { class: 'btn ghost', type: 'button', onclick: function () { if (rows.length < 10) { uid++; var r = { id: uid, name: 'D' + (uid - 3), ben: 5, pen: 5, cost: 5, risk: 5 }; rows.push(r); makeRow(r); recalc(true); } } }, 'Add feature'),
          h('button', { class: 'btn ghost', type: 'button', onclick: function () { body.innerHTML = ''; RE.visuals['wiegers-matrix'].render(body); } }, RE.icon('reset'), ' Reset')),
        h('p', { class: 'viz-note' }, 'A weight of 0 drops that term. Try setting the risk weight to 0, or the cost weight to 0, and see whether C moves up.')));
      recalc(true);
    }
  });

  /* ---------------- 6. AHP ---------------- */
  var AHP_VALS = [1 / 9, 1 / 8, 1 / 7, 1 / 6, 1 / 5, 1 / 4, 1 / 3, 1 / 2, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  function fracLabel(v) {
    if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v));
    var inv = 1 / v; if (Math.abs(inv - Math.round(inv)) < 1e-9) return '1/' + Math.round(inv);
    return f3(v);
  }
  var AHP_PRESETS = {
    lecture: {
      label: 'Lecture', names: ['Stakeholder Commitment', 'Financial', 'Strategic', 'Risk'], short: ['SC', 'F', 'S', 'R'],
      M: [[1, 1 / 5, 1 / 9, 1], [5, 1, 1, 5], [9, 1, 1, 5], [1, 1 / 5, 1 / 5, 1]], slide: [0.07, 0.39, 0.46, 0.08]
    },
    lab3: {
      label: 'Lab 3', names: ['FR1', 'FR2', 'FR4', 'NFR1'], short: ['FR1', 'FR2', 'FR4', 'NFR1'],
      M: [[1, 1 / 3, 2, 5], [3, 1, 3, 4], [1 / 2, 1 / 3, 1, 1 / 4], [1 / 5, 1 / 4, 4, 1]], slide: [0.269, 0.463, 0.101, 0.168]
    },
    equal: {
      label: 'Blank', names: ['A', 'B', 'C', 'D'], short: ['A', 'B', 'C', 'D'],
      M: [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]], slide: null
    }
  };
  var STAGES = ['1  Matrix', '2  Column sums', '3  Normalize', '4  Average'];
  var STAGE_TEXT = [
    'Stage 1: the pairwise matrix. Row i versus column j: 5 means row i is strongly more important than column j; below the diagonal are the reciprocals.',
    'Stage 2: add each column of the matrix. These sums are the divisors for the next step.',
    'Stage 3: divide every cell by its column sum. Each normalized column now adds up to 1.',
    'Stage 4: average each row of the normalized matrix. The row averages are the priority vector (the slide calls it EV) and add up to 1.'
  ];

  RE.visual('ahp', {
    title: 'AHP calculator',
    hint: 'Change a judgement and watch the priorities move',
    blueprint: false,
    render: function (body, preset) {
      var key = AHP_PRESETS[preset] ? preset : 'lecture';
      var S = { key: key, M: [], asGiven: true, step: false, stage: 1 };
      var root = h('div');
      body.appendChild(root);
      function load(k) {
        S.key = k; S.M = AHP_PRESETS[k].M.map(function (r) { return r.slice(); }); S.asGiven = true;
      }
      load(key);
      var lastFocus = null;
      function draw() {
        var P = AHP_PRESETS[S.key], n = S.M.length, C = ahpCalc(S.M);
        root.innerHTML = '';
        // preset + step controls
        root.appendChild(h('div', { style: { display: 'flex', gap: '12px', 'flex-wrap': 'wrap', 'align-items': 'center', 'margin-bottom': '14px' } },
          h('div', { class: 'seg', role: 'group', 'aria-label': 'Preset' }, Object.keys(AHP_PRESETS).map(function (k) {
            return h('button', { type: 'button', 'aria-pressed': String(k === S.key), onclick: function () { load(k); draw(); } }, AHP_PRESETS[k].label);
          })),
          h('button', { class: 'chip', type: 'button', 'aria-pressed': String(S.step), onclick: function () { S.step = !S.step; draw(); } }, 'Step through')));
        if (S.step) {
          root.appendChild(h('div', { style: { display: 'flex', gap: '8px', 'flex-wrap': 'wrap', 'align-items': 'center', 'margin-bottom': '8px' } },
            h('div', { class: 'seg', role: 'group', 'aria-label': 'Stage' }, STAGES.map(function (s, i) { return h('button', { type: 'button', 'aria-pressed': String(S.stage === i + 1), onclick: function () { S.stage = i + 1; draw(); } }, s); })),
            h('button', { class: 'btn small', type: 'button', disabled: S.stage <= 1 ? true : null, onclick: function () { S.stage--; draw(); } }, RE.icon('prev'), ' Prev'),
            h('button', { class: 'btn small primary', type: 'button', disabled: S.stage >= 4 ? true : null, onclick: function () { S.stage++; draw(); } }, 'Next ', RE.icon('next'))));
          root.appendChild(fb('info', 'info', STAGE_TEXT[S.stage - 1]));
        }
        function op(k) { return S.step ? (S.stage === k ? 1 : S.stage > k ? 0.6 : 0.2) : 1; }
        function sect(k, title, child) { return h('div', { style: { opacity: String(op(k)), transition: 'opacity 0.3s', 'margin-top': '16px' } }, h('h4', { style: { margin: '0 0 6px' }, text: title }), child); }
        // matrix
        var thead = h('thead', null, h('tr', null, h('th'), P.short.map(function (s, j) { return h('th', { scope: 'col', title: P.names[j], text: s }); })));
        var tb = h('tbody');
        for (var i = 0; i < n; i++) {
          var tr = h('tr', null, h('th', { scope: 'row', title: P.names[i], text: P.short[i] }));
          for (var j = 0; j < n; j++) {
            if (i === j) tr.appendChild(h('td', { class: 'num', text: '1' }));
            else if (i < j) {
              (function (i, j) {
                var sel = h('select', { 'aria-label': P.short[i] + ' versus ' + P.short[j], 'data-cell': i + '-' + j });
                var cur = 0, best = 1e9; AHP_VALS.forEach(function (v, k) { var d = Math.abs(Math.log(v) - Math.log(S.M[i][j])); if (d < best) { best = d; cur = k; } });
                AHP_VALS.forEach(function (v, k) { sel.appendChild(h('option', { value: String(k), selected: k === cur ? true : null, text: fracLabel(v) })); });
                if (Math.abs(AHP_VALS[cur] - S.M[i][j]) > 1e-9) sel.title = 'Loaded value ' + f3(S.M[i][j]) + ' is not on the scale';
                sel.addEventListener('change', function () {
                  S.M[i][j] = AHP_VALS[Number(sel.value)];
                  if (S.asGiven) { for (var a = 0; a < n; a++) for (var b = a + 1; b < n; b++) S.M[b][a] = 1 / S.M[a][b]; S.asGiven = false; }
                  else S.M[j][i] = 1 / S.M[i][j];
                  lastFocus = i + '-' + j; draw();
                });
                tr.appendChild(h('td', null, sel));
              })(i, j);
            } else tr.appendChild(h('td', { class: 'num', title: 'Reciprocal of the cell above the diagonal', text: fracLabel(S.M[i][j]) }));
          }
          tb.appendChild(tr);
        }
        var tf = h('tfoot', null, h('tr', { style: { opacity: String(S.step ? (S.stage >= 2 ? 1 : 0.2) : 1), 'font-weight': S.step && S.stage === 2 ? '700' : '400' } }, h('th', { scope: 'row', text: 'Sum' }), C.cs.map(function (s) { return h('td', { class: 'num', text: f2(s) }); })));
        root.appendChild(sect(1, 'Pairwise matrix and column sums', h('div', { class: 'viz-scroll', style: { 'overflow-x': 'auto' } }, h('table', { class: 'matrix' }, thead, tb, tf))));
        // normalized
        var nb = h('tbody');
        for (var r = 0; r < n; r++) {
          var row = h('tr', null, h('th', { scope: 'row', text: P.short[r] }));
          for (var c = 0; c < n; c++) row.appendChild(h('td', { class: 'num', text: f3(C.N[r][c]) }));
          row.appendChild(h('td', { class: 'num', style: { 'font-weight': S.step && S.stage === 4 ? '700' : '400' }, text: f3(C.w[r]) }));
          nb.appendChild(row);
        }
        var nsum = h('tr', null, h('th', { scope: 'row', text: 'Column sum' }), C.N[0].map(function (_, c) { var s = 0; C.N.forEach(function (rw) { s += rw[c]; }); return h('td', { class: 'num', text: f2(s) }); }), h('td', { class: 'num', text: f2(C.w.reduce(function (a, b) { return a + b; }, 0)) }));
        root.appendChild(sect(3, 'Normalized matrix (each cell / its column sum)', h('div', { class: 'viz-scroll', style: { 'overflow-x': 'auto' } },
          h('table', { class: 'matrix' }, h('thead', null, h('tr', null, h('th'), P.short.map(function (s) { return h('th', { scope: 'col', text: s }); }), h('th', { text: 'Row average' }))), nb, h('tfoot', null, nsum)))));
        // priorities
        var hi = 0, lo = 0; C.w.forEach(function (v, i) { if (v > C.w[hi]) hi = i; if (v < C.w[lo]) lo = i; });
        var pv = h('div', { style: { display: 'grid', gap: '8px' } });
        C.w.forEach(function (v, i) {
          pv.appendChild(h('div', { style: { display: 'grid', 'grid-template-columns': 'minmax(110px,200px) 1fr 54px minmax(60px,auto)', gap: '10px', 'align-items': 'center' } },
            h('span', { text: P.names[i] }), meter(v / C.w[hi], i === hi ? 'g' : i === lo ? 'a' : ''),
            h('span', { class: 'num', text: f3(v) }),
            i === hi ? h('span', { class: 'tag practice', text: 'Highest' }) : i === lo ? h('span', { class: 'tag concept', text: 'Lowest' }) : h('span')));
        });
        var slideNote = P.slide ? h('p', { class: 'viz-note' }, (S.key === 'lecture' ? 'Slide values (2 decimals): ' : 'Lab answer (3 decimals): ') + P.slide.map(function (v, i) { return P.short[i] + ' ' + (S.key === 'lecture' ? v.toFixed(2) : v.toFixed(3)); }).join(', ') + (S.key === 'lecture' ? '. The slide rounds each step to 2 decimals (for example 5/16 = 0.31, 9/16 = 0.56, and column 1 then sums to 0.99), so its EV agrees with the exact figures above only up to rounding.' : '.') + (S.asGiven ? '' : ' You have edited the matrix, so these no longer apply.')) : null;
        root.appendChild(sect(4, 'Priority vector (row averages)', h('div', null, pv, slideNote)));
        // consistency
        var cr = C.cr, okc = cr < 0.1;
        var cons = h('div', null,
          h('table', { class: 'matrix' }, h('tbody', null,
            h('tr', null, h('th', { scope: 'row', text: 'lambda max' }), h('td', { class: 'num', text: f3(C.lambda) })),
            h('tr', null, h('th', { scope: 'row', text: 'CI = (lambda max - n) / (n - 1)' }), h('td', { class: 'num', text: f3(C.ci) })),
            h('tr', null, h('th', { scope: 'row', text: 'RI for n = ' + n }), h('td', { class: 'num', text: String(C.ri) })),
            h('tr', null, h('th', { scope: 'row', text: 'CR = CI / RI' }), h('td', { class: 'num', text: f3(cr) })))),
          fb(okc ? 'ok' : 'bad', okc ? 'check' : 'x', n < 3 ? 'With fewer than 3 items there is nothing to contradict, so the judgements are trivially consistent.' :
            okc ? 'CR = ' + f3(cr) + ' is below 0.10: your judgements are consistent enough to trust the priorities. Consistent means transitive: if A is 5x B and B is 4x C, A should be about 20x C.' :
              'CR = ' + f3(cr) + ' is above 0.10: your judgements contradict each other (for example A over B and B over C, but C close to A). Revisit the comparisons before trusting the ranking.'),
          h('p', { class: 'viz-note' }, 'Random-index table (RI) for n = 1 to 10: ' + RI.join(', ') + '. This check is an extension from the literature, not on the slides.'));
        if (S.step) cons.style.opacity = S.stage === 4 ? '1' : '0.2';
        root.appendChild(h('div', { style: { 'margin-top': '16px' } }, h('h4', { style: { margin: '0 0 6px' }, text: 'Consistency' }), cons));
        // reciprocity note
        var dev = 0; for (var a = 0; a < n; a++) for (var b = a + 1; b < n; b++) dev = Math.max(dev, Math.abs(S.M[a][b] * S.M[b][a] - 1));
        root.appendChild(h('p', { class: 'viz-note' }, S.asGiven
          ? (dev > 1e-9 ? 'The preset matrix is loaded exactly as printed, and it is not strictly reciprocal (some mirrored pairs do not multiply to 1). The lower triangle stays as given until you change a judgement; then it is rebuilt as reciprocals.'
            : 'The preset matrix is loaded exactly as printed. Checked: every mirrored pair multiplies to 1, so it is strictly reciprocal. Change a judgement above and the lower triangle follows automatically.')
          : 'Only the cells above the diagonal are choices; the lower triangle is always the reciprocal (a 3 above becomes 1/3 below).'));
        if (lastFocus) { var f = root.querySelector('[data-cell="' + lastFocus + '"]'); if (f) f.focus(); lastFocus = null; }
      }
      draw();
    }
  });
})();
