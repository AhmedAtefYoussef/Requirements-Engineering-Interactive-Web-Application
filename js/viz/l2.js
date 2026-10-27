/* Lecture 2 figures: elicitation plan, input classifier, technique matrix, workshop roles, SMART builder. */
(function () {
  'use strict';
  var RE = window.RE, h = RE.h;
  function ensureSort(cb) { if (RE.sortBoard) cb(); else RE.loadScript('js/viz/l1.js').then(cb); }

  /* ---------- elicitation plan ---------- */
  RE.visual('elicit-plan', {
    title: 'Plan an elicitation session',
    hint: 'Tick the plan off, then run the session',
    render: function (body) {
      var plan = [
        ['Elicitation objective', 'What this session must produce, e.g. the user requirements for employee training reports.'],
        ['Planned techniques', 'Which techniques fit these stakeholders: interviews with HR, a workshop with managers, document analysis of the old system.'],
        ['Schedule', 'Who, when, how long. Sessions are timeboxed; stakeholders are busy.'],
        ['Documents needed', 'Existing manuals, forms, reports, regulations (e.g. the new law on Social Security numbers).'],
        ['Elicitation risks', 'Unavailable stakeholders, conflicting views, scope creep, the wrong people in the room.']
      ];
      var phases = [
        ['Before', ['Plan scope and agenda for the session', 'Prepare questions and straw-man models', 'Research the domain and existing documents', 'Invite the right stakeholders']],
        ['During', ['Establish rapport and explain the goal', 'Ask, actively listen, suggest ideas', 'Stay in scope; park side topics', 'Take notes or record with permission']],
        ['After', ['Organize and share notes quickly', 'Classify the input by requirement type', 'Document open issues and questions', 'Follow up with stakeholders to confirm']]
      ];
      var done = RE.store.get('viz:elicit-plan', {});
      var list = h('div', { style: { display: 'grid', gap: '8px' } });
      var meter = h('i', { style: { '--v': 0 } });
      function count() { var n = Object.keys(done).filter(function (k) { return done[k]; }).length; meter.style.setProperty('--v', n / plan.length); return n; }
      plan.forEach(function (p, i) {
        var id = 'ep-' + i + '-' + Math.random().toString(36).slice(2, 6);
        var cb = h('input', { type: 'checkbox', id: id, style: { width: '20px', height: '20px', 'accent-color': 'var(--accent)', 'margin-top': '3px' } });
        cb.checked = !!done[i];
        cb.addEventListener('change', function () { done[i] = cb.checked; RE.store.set('viz:elicit-plan', done); var n = count(); if (n === plan.length) RE.toast('Plan complete. Ready to elicit.'); });
        list.appendChild(h('label', { for: id, style: { display: 'grid', 'grid-template-columns': '28px 1fr', gap: '8px', padding: '10px 12px', background: 'var(--paper)', 'border-radius': '8px', cursor: 'pointer' } }, cb, h('span', null, h('strong', null, p[0]), h('br'), h('span', { style: { color: 'var(--ink-2)', 'font-size': '0.94rem' } }, p[1]))));
      });
      body.appendChild(h('div', { style: { display: 'grid', 'grid-template-columns': 'minmax(0,1fr) auto', gap: '12px', 'align-items': 'center', 'margin-bottom': '10px' } }, h('strong', null, 'The elicitation plan'), h('span', { class: 'meter g', style: { width: '120px' } }, meter)));
      body.appendChild(list); count();
      body.appendChild(h('div', { style: { 'margin-top': '20px', 'font-weight': '700' } }, 'One session, three phases'));
      var tl = h('div', { style: { display: 'grid', 'grid-template-columns': 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px', 'margin-top': '8px' }, 'data-stagger': '' });
      phases.forEach(function (ph, i) {
        tl.appendChild(h('div', { style: { padding: '14px 16px', background: i === 1 ? 'var(--accent-wash)' : 'var(--sheet-2)', 'border-radius': '8px' } },
          h('div', { style: { font: '800 1.3rem/1 var(--f-display)', 'text-transform': 'uppercase', 'margin-bottom': '8px' } }, ph[0] + ' the session'),
          h('ul', { style: { margin: '0', 'padding-left': '1.1em', display: 'grid', gap: '4px', 'font-size': '0.94rem' } }, ph[1].map(function (t) { return h('li', null, t); }))));
      });
      body.appendChild(tl); RE.reveal(tl);
    }
  });

  /* ---------- Maria's interview → requirement types ---------- */
  RE.visual('input-classifier', {
    title: 'Classify Maria’s wishes',
    hint: 'Phil’s notes, sorted into requirement types',
    render: function (body) {
      body.appendChild(h('blockquote', { style: { margin: '0 0 14px', padding: '14px 18px', background: 'var(--paper)', 'border-radius': '8px', 'font-family': 'var(--f-hand)', 'font-size': '1.05rem', color: 'var(--ink-2)' } },
        'Maria, product champion for the new employee information system, lists what she wants in one breath. Phil writes it all down but cannot tell what kind of requirement each item is. Help him.'));
      ensureSort(function () {
        RE.sortBoard(body, {
          min: 150,
          zones: [
            { id: 'biz', label: 'Business requirement', hint: 'Why the org wants it' },
            { id: 'user', label: 'User requirement', hint: 'A task a user must do' },
            { id: 'rule', label: 'Business rule', hint: 'Policy, law, standard' },
            { id: 'fr', label: 'Functional requirement', hint: 'System behaviour' },
            { id: 'qa', label: 'Quality attribute', hint: 'How well it works' },
            { id: 'con', label: 'Constraint', hint: 'Limits design choices' }
          ],
          items: [
            { text: 'The new system should be a lot faster than the old one.', zone: 'qa', why: 'Speed is a quality attribute, and it still needs a measurable target to be useful.' },
            { text: 'Employee IDs cannot be Social Security numbers anymore.', zone: 'rule', why: 'A new law dictates it: a business rule that drives functionality (re-issuing IDs).' },
            { text: 'I need a report of each employee’s training hours this year.', zone: 'user', why: 'A goal a user needs to achieve with the system.' },
            { text: 'The system shall accept names up to 100 characters without failing.', zone: 'fr', why: 'A specific behaviour the system must exhibit, fixing the long-name crash.' },
            { text: 'Reduce help-desk calls about employee records by 50% within a year.', zone: 'biz', why: 'A business objective: why the organization funds the project.' },
            { text: 'The system must run on the company’s existing Oracle database.', zone: 'con', why: 'It restricts the design options available to developers.' },
            { text: 'A new client must pay 30% of the estimated fee in advance.', zone: 'rule', why: 'A policy of the business, from the lecture example of a business rule.' },
            { text: 'The user must be able to sort the project list in forward and reverse alphabetical order.', zone: 'fr', why: 'The lecture’s example of a functional requirement.' },
            { text: 'Increase market share in region X by Y% within Z months.', zone: 'biz', why: 'The lecture’s example of a business requirement.' }
          ]
        });
      });
    }
  });

  /* ---------- technique matrix ---------- */
  var TECH = [
    { n: 'Interviews', g: 'Individuals', cost: 2, depth: 3, scale: 1, tacit: 2, when: 'Need depth from a few key people; sensitive topics.', avoid: 'Hundreds of users, or interviewer is unprepared.' },
    { n: 'Workshops', g: 'Groups', cost: 3, depth: 3, scale: 2, tacit: 2, when: 'Resolve conflicts across many stakeholder types quickly.', avoid: 'Starting from a blank slate, or no skilled facilitator.' },
    { n: 'Focus groups', g: 'Groups', cost: 2, depth: 2, scale: 2, tacit: 1, when: 'Commercial products; attitudes and preferences of representative users.', avoid: 'You need decisions, not opinions.' },
    { n: 'Observation', g: 'Individuals', cost: 3, depth: 3, scale: 1, tacit: 3, when: 'Habitual tasks users struggle to describe; high-risk tasks.', avoid: 'Tight schedule; tasks rarely happen.' },
    { n: 'Questionnaires', g: 'Many', cost: 1, depth: 1, scale: 3, tacit: 1, when: 'Large, distributed user populations; statistics to feed other techniques.', avoid: 'You cannot write clear, unbiased questions.' },
    { n: 'System interface analysis', g: 'Systems', cost: 1, depth: 2, scale: 3, tacit: 1, when: 'Your system exchanges data and services with others.', avoid: 'Standalone system with no interfaces.' },
    { n: 'User interface analysis', g: 'Systems', cost: 1, depth: 2, scale: 2, tacit: 2, when: 'An existing or similar product exists to study.', avoid: 'Assuming the old flow must be copied.' },
    { n: 'Document analysis', g: 'Documents', cost: 1, depth: 2, scale: 3, tacit: 1, when: 'Regulations, standards, manuals, old SRS; info people forget to say.', avoid: 'Documents are out of date or poorly written.' }
  ];
  RE.visual('technique-matrix', {
    title: 'Choose an elicitation technique',
    hint: 'Set your situation; the matrix ranks the fits',
    render: function (body) {
      var want = { scale: 1, depth: 2, tacit: 1, budget: 2 };
      var ctl = h('div', { style: { display: 'grid', 'grid-template-columns': 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px 20px', 'margin-bottom': '16px' } });
      [['scale', 'How many users?', ['A few', 'Dozens', 'Thousands']], ['depth', 'Depth needed', ['Overview', 'Detailed', 'Very deep']], ['tacit', 'Hidden, habitual know-how', ['Little', 'Some', 'A lot']], ['budget', 'Time and money', ['Tight', 'Moderate', 'Generous']]].forEach(function (c) {
        var id = 'tm-' + c[0] + '-' + Math.random().toString(36).slice(2, 6);
        var out = h('output', { for: id, style: { 'font-weight': '700', color: 'var(--accent)' } }, c[2][want[c[0]] - 1]);
        var r = h('input', { type: 'range', class: 'range', id: id, min: '1', max: '3', step: '1', value: String(want[c[0]]) });
        r.addEventListener('input', function () { want[c[0]] = +r.value; out.textContent = c[2][want[c[0]] - 1]; paint(); });
        ctl.appendChild(h('div', null, h('label', { for: id, style: { display: 'flex', 'justify-content': 'space-between', gap: '8px', 'font-size': '0.92rem' } }, c[1], out), r));
      });
      body.appendChild(ctl);
      var table = h('div', { style: { display: 'grid', gap: '6px' } });
      body.appendChild(table);
      function score(t) { return -Math.abs(t.scale - want.scale) * 1.4 - Math.abs(t.depth - want.depth) - Math.abs(t.tacit - want.tacit) * 1.2 - Math.max(0, t.cost - want.budget) * 1.5; }
      var rows = {};
      TECH.forEach(function (t) {
        rows[t.n] = h('div', { style: { display: 'grid', 'grid-template-columns': 'minmax(130px, 1fr) 90px minmax(0, 2fr)', gap: '12px', 'align-items': 'center', padding: '10px 12px', 'border-radius': '8px', background: 'var(--paper)', transition: 'transform .45s var(--ease-out), background .25s' } },
          h('strong', null, t.n), h('span', { class: 'meter' }, h('i')), h('span', { style: { 'font-size': '0.9rem', color: 'var(--ink-2)' } }, h('span', null, 'Use when: ' + t.when), h('br'), h('span', null, 'Avoid when: ' + t.avoid)));
      });
      function paint() {
        var first = {}; RE.$$(':scope > div', table).forEach(function (r) { first[r.firstChild.textContent] = r.getBoundingClientRect().top; });
        var ranked = TECH.map(function (t) { return { t: t, s: score(t) }; }).sort(function (a, b) { return b.s - a.s; });
        var max = ranked[0].s, min = ranked[ranked.length - 1].s;
        table.innerHTML = '';
        ranked.forEach(function (x, i) {
          var row = rows[x.t.n]; row.style.background = i < 2 ? 'var(--accent-wash)' : 'var(--paper)';
          row.children[1].firstChild.style.setProperty('--v', max === min ? 1 : (0.15 + 0.85 * (x.s - min) / (max - min)).toFixed(2));
          table.appendChild(row);
        });
        // FLIP: rows glide to their new rank.
        if (!RE.motion.reduced()) ranked.forEach(function (x) {
          var row = rows[x.t.n], was = first[x.t.n]; if (was == null) return;
          var dy = was - row.getBoundingClientRect().top; if (!dy) return;
          row.animate([{ transform: 'translateY(' + dy + 'px)' }, { transform: 'none' }], { duration: 450, easing: RE.motion.ease });
        });
      }
      paint();
      body.appendChild(h('p', { class: 'viz-note' }, 'Ranking is a study aid, not a rule: real projects combine techniques, e.g. a questionnaire to find themes, then interviews and a workshop to go deep.'));
    }
  });

  /* ---------- workshop roles ---------- */
  var ROLES = [
    ['Facilitator', 'Plans the session, runs the agenda, keeps everyone engaged and enforces ground rules. Neutral about the outcome.'],
    ['Timekeeper', 'Tracks the timeboxes and warns the group when a discussion runs over.'],
    ['Focus maker', 'Pulls the group back to the session objective and the agreed scope.'],
    ['Observer', 'Watches dynamics and quieter participants; notices what is not said.'],
    ['Agitator', 'Deliberately challenges assumptions so the group does not settle too early.'],
    ['Note taker', 'Records decisions, requirements, open issues and the parking lot.']
  ];
  RE.visual('workshop-roles', {
    title: 'The workshop table',
    hint: 'Who does what around the table',
    blueprint: true,
    render: function (body) {
      var s = RE.svg('svg', { viewBox: '0 0 420 300', role: 'img', 'aria-label': 'Workshop table with six roles seated around it', style: 'max-width:420px;width:100%;display:block;margin:0 auto' });
      s.appendChild(RE.svg('rect', { x: 110, y: 95, width: 200, height: 110, rx: 55, style: 'fill:var(--sheet);stroke:var(--ink);stroke-width:1.8' }));
      s.appendChild(RE.svg('text', { x: 210, y: 146, 'text-anchor': 'middle', class: 'hand', style: 'font-size:15px;fill:var(--ink-2)', text: 'agenda · ground rules' }));
      s.appendChild(RE.svg('text', { x: 210, y: 166, 'text-anchor': 'middle', class: 'hand', style: 'font-size:15px;fill:var(--ink-2)', text: 'parking lot' }));
      var pos = [[210, 52], [340, 100], [340, 200], [210, 250], [80, 200], [80, 100]];
      var detail = h('div', { 'aria-live': 'polite', style: { 'margin-top': '10px', 'min-height': '64px' } });
      var seats = [];
      ROLES.forEach(function (r, i) {
        var g = RE.svg('g', { tabindex: '0', role: 'button', 'aria-label': r[0], style: 'cursor:pointer;outline:none' });
        var c = RE.svg('circle', { cx: pos[i][0], cy: pos[i][1], r: 26, style: 'fill:var(--sheet);stroke:var(--ink);stroke-width:1.8;transition:fill .2s' });
        g.appendChild(c);
        g.appendChild(RE.svg('text', { x: pos[i][0], y: pos[i][1] + 5, 'text-anchor': 'middle', style: 'font:800 15px var(--f-display)', text: r[0].split(' ').map(function (w) { return w[0]; }).join('').toUpperCase() }));
        g.appendChild(RE.svg('text', { x: pos[i][0], y: pos[i][1] + (i === 0 ? -34 : i === 3 ? 44 : 44), 'text-anchor': 'middle', style: 'font-size:12px;fill:var(--ink-2)', text: r[0] }));
        g.addEventListener('click', function () { pick(i); });
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(i); } });
        s.appendChild(g); seats.push(c);
      });
      function pick(i) {
        seats.forEach(function (c, k) { c.style.fill = k === i ? 'var(--accent-wash)' : 'var(--sheet)'; c.style.stroke = k === i ? 'var(--accent)' : 'var(--ink)'; });
        detail.innerHTML = '';
        var d = h('p', { style: { margin: '0', padding: '12px 16px', background: 'var(--sheet)', 'border-radius': '8px' } }, h('strong', null, ROLES[i][0] + '. '), ROLES[i][1]);
        detail.appendChild(d); RE.motion.enter(d, { y: 6 });
      }
      body.appendChild(h('div', { class: 'viz-scroll', style: { overflow: 'visible' } }, s)); body.appendChild(detail); pick(0);
      body.appendChild(h('p', { class: 'viz-note' }, 'Workshop rules from the lecture: small team of the right stakeholders, fill every role, plan an agenda, timebox discussions, stay in scope, use parking lots, keep everyone engaged.'));
    }
  });

  /* ---------- SMART builder ---------- */
  var SMART = [
    ['S', 'Specific', 'Names exactly what, for whom, under which condition.'],
    ['M', 'Measurable', 'Has a number or test that decides pass or fail.'],
    ['A', 'Agreed upon', 'Stakeholders have accepted it.'],
    ['R', 'Realistic', 'Achievable with the available technology, budget and time.'],
    ['T', 'Time-based', 'States when or how fast it must happen.']
  ];
  var CASES = [
    { vague: 'The system should be fast.', parts: [
      ['S', 'Search for an employee by name or ID', 'The system should be fast.'],
      ['M', 'shall return results in under 2 seconds for 95% of queries', null],
      ['A', 'as agreed with HR in the requirements review of 12 March', null],
      ['R', 'on the current server hardware with up to 200 concurrent users', null],
      ['T', 'from the first production release in Q3', null]] },
    { vague: 'The app should be easy to use.', parts: [
      ['S', 'A first-time customer placing a food order', 'The app should be easy to use.'],
      ['M', 'shall complete checkout in at most 5 taps and under 90 seconds', null],
      ['A', 'per the usability targets signed off by the product owner', null],
      ['R', 'using the existing payment gateway', null],
      ['T', 'by the launch milestone']] }
  ];
  RE.visual('smart-builder', {
    title: 'Make it SMART',
    hint: 'Add one criterion at a time to a vague wish',
    render: function (body) { ensureSort(function () { smart(body); }); }
  });
  function smart(body) {
      var ci = 0, on = {};
      var picker = RE.vizSeg(CASES.map(function (c, i) { return [i, '“' + c.vague + '”']; }), 0, function (v) { ci = v; on = {}; paint(); }, 'Example');
      body.appendChild(picker);
      var toggles = h('div', { style: { display: 'flex', gap: '8px', 'flex-wrap': 'wrap', margin: '14px 0' } });
      var out = h('div', { 'aria-live': 'polite' });
      SMART.forEach(function (s) {
        toggles.appendChild(h('button', { class: 'chip', 'aria-pressed': 'false', title: s[2], onclick: function (e) { on[s[0]] = !on[s[0]]; e.currentTarget.setAttribute('aria-pressed', String(!!on[s[0]])); paint(); } }, h('b', { style: { font: '800 1rem/1 var(--f-display)' } }, s[0]), s[1]));
      });
      body.appendChild(toggles); body.appendChild(out);
      function paint() {
        RE.$$('button', toggles).forEach(function (b, i) { b.setAttribute('aria-pressed', String(!!on[SMART[i][0]])); });
        var c = CASES[ci], n = Object.keys(on).filter(function (k) { return on[k]; }).length;
        out.innerHTML = '';
        var sentence = h('p', { style: { margin: '0', 'font-size': '1.12rem', 'line-height': '1.6' } });
        if (!on.S) sentence.appendChild(h('span', { style: { color: 'var(--red)', 'text-decoration': 'underline wavy', 'text-underline-offset': '4px' } }, c.vague));
        c.parts.forEach(function (p) {
          if (!on[p[0]]) return;
          var span = h('span', { style: { background: 'var(--accent-wash)', 'border-radius': '4px', padding: '1px 4px', 'margin-right': '4px', 'box-decoration-break': 'clone' } }, p[1] + ' ', h('sup', { style: { color: 'var(--accent)', 'font-weight': '700' } }, p[0]));
          sentence.appendChild(span); RE.motion.enter(span, { y: 6, duration: 300 });
        });
        out.appendChild(h('div', { style: { padding: '16px 18px', background: 'var(--paper)', 'border-radius': '8px' } }, sentence));
        out.appendChild(h('div', { class: 'feedback ' + (n === 5 ? 'ok' : 'info') }, RE.icon(n === 5 ? 'check' : 'info'),
          n === 5 ? 'Now it is SMART: specific, measurable, agreed upon, realistic and time-based. A tester could pass or fail it.' : n + ' of 5 criteria. Missing: ' + SMART.filter(function (s) { return !on[s[0]]; }).map(function (s) { return s[1] + ' (' + s[2].toLowerCase().replace(/\.$/, '') + ')'; }).join('; ') + '.'));
      }
      paint();
  }
})();
