/* Lecture 1 figures: failure cases, requirement levels, the sorter, NFR wheel, RE process, V&V, golf cart walk-through. */
(function () {
  'use strict';
  var RE = window.RE, h = RE.h, svg = RE.svg;

  function seg(options, value, onChange, label) {
    var s = h('div', { class: 'seg', role: 'group', 'aria-label': label || 'Options' });
    options.forEach(function (o) {
      s.appendChild(h('button', { 'aria-pressed': String(o[0] === value), onclick: function (e) {
        RE.$$('button', s).forEach(function (b) { b.setAttribute('aria-pressed', String(b === e.currentTarget)); }); onChange(o[0]);
      } }, o[1]));
    });
    return s;
  }
  RE.vizSeg = seg;

  /* Tap-or-drag sorting board shared by several figures. */
  RE.sortBoard = function (body, cfg) {
    // cfg: { zones:[{id,label,hint}], items:[{text,zone,why}], columns }
    var selected = null, placed = {};
    var pool = h('div', { class: 'drop-zone', 'aria-label': 'Unsorted statements', style: { 'min-height': '64px', 'margin-bottom': '14px' } });
    var zonesWrap = h('div', { style: { display: 'grid', gap: '10px', 'grid-template-columns': 'repeat(auto-fit, minmax(' + (cfg.min || 160) + 'px, 1fr))' } });
    var fb = h('div', { 'aria-live': 'polite' });
    var zoneEls = {};
    cfg.zones.forEach(function (z) {
      var el = h('div', { class: 'drop-zone', role: 'button', tabindex: '0', 'aria-label': 'Place selected statement in ' + z.label, 'data-zone': z.id },
        h('div', { style: { 'font-weight': '700', 'margin-bottom': '4px' } }, z.label), z.hint ? h('div', { class: 'viz-note', style: { margin: '0 0 6px' } }, z.hint) : null);
      el.addEventListener('click', function (e) { if (e.target.closest('.token')) return; drop(z.id); });
      el.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); drop(z.id); } });
      el.addEventListener('dragover', function (e) { e.preventDefault(); el.classList.add('over'); });
      el.addEventListener('dragleave', function () { el.classList.remove('over'); });
      el.addEventListener('drop', function (e) { e.preventDefault(); el.classList.remove('over'); var i = e.dataTransfer.getData('text/plain'); if (i !== '') { selected = +i; drop(z.id); } });
      zoneEls[z.id] = el; zonesWrap.appendChild(el);
    });
    pool.addEventListener('click', function (e) { if (!e.target.closest('.token')) drop(null); });
    pool.addEventListener('dragover', function (e) { e.preventDefault(); });
    pool.addEventListener('drop', function (e) { e.preventDefault(); var i = e.dataTransfer.getData('text/plain'); if (i !== '') { selected = +i; drop(null); } });
    var tokens = cfg.items.map(function (it, i) {
      var t = h('button', { class: 'token', draggable: 'true', 'aria-pressed': 'false' }, it.text);
      t.addEventListener('click', function (e) { e.stopPropagation(); select(i); });
      t.addEventListener('dragstart', function (e) { e.dataTransfer.setData('text/plain', String(i)); t.classList.add('dragging'); });
      t.addEventListener('dragend', function () { t.classList.remove('dragging'); });
      return t;
    });
    function select(i) {
      selected = selected === i ? null : i;
      tokens.forEach(function (t, k) { t.classList.toggle('selected', k === selected); t.setAttribute('aria-pressed', String(k === selected)); });
    }
    function drop(zone) {
      if (selected == null) return;
      var t = tokens[selected]; t.classList.remove('ok', 'bad', 'selected'); t.setAttribute('aria-pressed', 'false');
      (zone ? zoneEls[zone] : pool).appendChild(t); placed[selected] = zone;
      RE.motion.pop(t); selected = null; fb.innerHTML = '';
    }
    RE.shuffle(tokens.map(function (t, i) { return i; })).forEach(function (i) { pool.appendChild(tokens[i]); });
    body.appendChild(h('p', { class: 'viz-note', style: { 'margin-top': '0' } }, 'Drag a statement onto a box, or tap a statement and then tap a box.'));
    body.appendChild(pool); body.appendChild(zonesWrap);
    body.appendChild(h('div', { class: 'viz-actions' },
      h('button', { class: 'btn primary small', onclick: check }, RE.icon('check'), 'Check my sorting'),
      h('button', { class: 'btn small', onclick: reveal }, 'Show the answers'),
      h('button', { class: 'btn ghost small', onclick: reset }, RE.icon('reset'), 'Reset')));
    body.appendChild(fb);
    function check() {
      var right = 0, wrong = [], total = cfg.items.length, unplaced = 0;
      cfg.items.forEach(function (it, i) {
        if (placed[i] == null) { unplaced++; return; }
        var ok = placed[i] === it.zone; tokens[i].classList.toggle('ok', ok); tokens[i].classList.toggle('bad', !ok);
        if (ok) right++; else wrong.push(it);
      });
      fb.innerHTML = '';
      var msg = right + ' of ' + total + ' placed correctly' + (unplaced ? ', ' + unplaced + ' still unsorted' : '') + '.';
      fb.appendChild(h('div', { class: 'feedback ' + (right === total ? 'ok' : 'info') }, RE.icon(right === total ? 'check' : 'info'), msg));
      wrong.slice(0, 3).forEach(function (it) {
        var zl = cfg.zones.filter(function (z) { return z.id === it.zone; })[0].label;
        fb.appendChild(h('div', { class: 'feedback bad' }, RE.icon('x'), h('span', null, h('strong', null, '“' + it.text + '”'), ' belongs in ', h('strong', null, zl), '. ', it.why)));
      });
    }
    function reveal() { cfg.items.forEach(function (it, i) { selected = i; drop(it.zone); }); check(); }
    function reset() { tokens.forEach(function (t, i) { t.classList.remove('ok', 'bad'); pool.appendChild(t); placed[i] = null; }); fb.innerHTML = ''; }
  };

  /* ---------- failure cases ---------- */
  var CASES = [
    { name: 'Dodge Dart vs Porsche Cayenne', tag: 'Misread need', what: 'Two cars side by side on the slide: one product built for the brief as written, another for the need behind it.', lesson: 'A product can meet its written specification and still miss what the customer valued. Requirements describe value to a stakeholder, not just features.', cost: 'Lost market fit' },
    { name: 'The Polaroid project', tag: 'Missing requirements', what: 'An instant-video product with a 2.5 minute limit, no sound, and no way to play it on an ordinary TV.', lesson: 'Nobody captured how people would actually use the product. Each omission is a requirement that elicitation never found.', cost: 'Commercial failure' },
    { name: 'F-35 target error', tag: 'Ambiguous scenario', what: 'Jets flying in formation saw one target as two: a software error that made pilots see double.', lesson: 'The behaviour for a multi-sensor, multi-aircraft situation was not specified precisely. Edge scenarios are requirements too.', cost: 'Safety risk, rework' },
    { name: 'CareFusion Alaris pump', tag: 'Safety-critical NFR', what: 'Infusion pumps overdosed when not needed or delayed infusion because of a software error. Recalled.', lesson: 'Reliability and safety are non-functional requirements. In medical devices a missed NFR is deadly, not inconvenient.', cost: 'Recall, patient harm' },
    { name: 'NHS civilian IT', tag: 'Scope creep', what: 'Electronic health records and integrated IT across hospitals; scope kept growing without control.', lesson: 'Without requirements management and negotiation, scope creep consumed about £11.4 billion.', cost: '£11.4 billion' }
  ];
  RE.visual('failure-cases', {
    title: 'When requirements fail',
    hint: 'Pick a case to read what went wrong',
    render: function (body) {
      var list = h('div', { style: { display: 'grid', gap: '8px', 'grid-template-columns': 'repeat(auto-fit, minmax(150px, 1fr))' } });
      var detail = h('div', { 'aria-live': 'polite', style: { 'margin-top': '14px' } });
      CASES.forEach(function (c, i) {
        list.appendChild(h('button', { class: 'chip', 'aria-pressed': String(i === 0), style: { height: 'auto', padding: '10px 14px', 'border-radius': '8px', 'text-align': 'left', display: 'grid', gap: '2px' }, onclick: function (e) {
          RE.$$('button', list).forEach(function (b) { b.setAttribute('aria-pressed', String(b === e.currentTarget)); }); show(i);
        } }, h('span', null, c.name), h('small', { style: { 'font-weight': '400', opacity: '0.8' } }, c.tag)));
      });
      function show(i) {
        var c = CASES[i]; detail.innerHTML = '';
        var card = h('div', { style: { display: 'grid', 'grid-template-columns': 'minmax(0,1fr) auto', gap: '18px', padding: '18px 20px', background: 'var(--paper)', 'border-radius': '8px' } },
          h('div', null, h('p', { style: { margin: '0 0 8px' } }, h('strong', null, 'What happened. '), c.what), h('p', { style: { margin: '0' } }, h('strong', null, 'Requirements lesson. '), c.lesson)),
          h('div', { style: { 'text-align': 'right' } }, h('div', { class: 'viz-note', style: { margin: '0' } }, 'Cost'), h('div', { style: { font: '800 1.6rem/1.1 var(--f-display)', color: 'var(--red)', 'max-width': '9ch' } }, c.cost)));
        detail.appendChild(card); RE.motion.enter(card, { y: 10 });
      }
      body.appendChild(list); body.appendChild(detail); show(0);
      body.appendChild(h('p', { class: 'viz-note' }, 'Survey data shown in the lecture lists poor or changing requirements among the top causes of project failure. Fixing an error after deployment can cost on the order of a hundred times more than fixing it during requirements.'));
    }
  });

  /* ---------- requirement levels zoom ---------- */
  RE.visual('req-levels', {
    title: 'User vs system requirements',
    hint: 'Zoom from what the user asks to what the system does',
    render: function (body) {
      var level = 'user';
      var user = 'The system shall generate monthly management reports showing the cost of drugs prescribed by each clinic during that month.';
      var sys = [
        'On the last working day of each month, a summary of the drugs prescribed, their cost and the prescribing clinics shall be generated.',
        'The system shall generate the report for printing after 17.30 on the last working day of the month.',
        'A report shall be created for each clinic and shall list the individual drug names, the total number of prescriptions, the number of doses prescribed and the total cost.',
        'If drugs are available in different dose units (for example 10 mg, 20 mg), separate reports shall be created for each dose unit.',
        'Access to drug cost reports shall be restricted to authorized users listed on a management access control list.'
      ];
      var readers = { user: ['Client managers', 'System end-users', 'Client engineers', 'Contractor managers', 'System architects'], system: ['System end-users', 'Client engineers', 'System architects', 'Software developers'] };
      var stage = h('div', { 'aria-live': 'polite' });
      body.appendChild(seg([['user', 'User requirement'], ['system', 'System requirements']], level, function (v) { level = v; paint(); }, 'Level'));
      body.appendChild(stage);
      function paint() {
        stage.innerHTML = '';
        var grid = h('div', { style: { display: 'grid', 'grid-template-columns': 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', 'margin-top': '16px' } });
        var left = h('div');
        if (level === 'user') left.appendChild(h('blockquote', { style: { margin: '0', padding: '18px 20px', background: 'var(--accent-wash)', 'border-radius': '8px', 'font-size': '1.1rem' } }, user));
        else {
          var ol = h('ol', { style: { margin: '0', 'padding-left': '1.3em', display: 'grid', gap: '8px' } });
          sys.forEach(function (s, i) { var li = h('li', null, s); ol.appendChild(li); RE.motion.enter(li, { delay: i * 70, y: 8 }); });
          left.appendChild(h('div', { class: 'viz-note', style: { margin: '0 0 8px' } }, '1.1 to 1.5 refine the single user requirement'));
          left.appendChild(ol);
        }
        var right = h('div', { style: { padding: '14px 16px', background: 'var(--paper)', 'border-radius': '8px' } },
          h('div', { style: { 'font-weight': '700', 'margin-bottom': '6px' } }, 'Who reads it'),
          h('ul', { style: { margin: '0', 'padding-left': '1.1em' } }, readers[level].map(function (r) { return h('li', null, r); })),
          h('p', { class: 'viz-note' }, level === 'user' ? 'Natural language and diagrams. High level: what services the system provides and its constraints.' : 'Detailed: functions, services and operational constraints. Precise enough to be part of a contract.'));
        grid.appendChild(left); grid.appendChild(right); stage.appendChild(grid);
      }
      paint();
      body.appendChild(h('p', { class: 'viz-note' }, 'Example from Sommerville, chapter 4: the mental health care patient management system (Mentcare).'));
    }
  });

  /* ---------- sorter ---------- */
  RE.visual('req-sorter', {
    title: 'Sort the requirements',
    hint: 'Functional, or which kind of non-functional?',
    render: function (body) {
      RE.sortBoard(body, {
        min: 150,
        zones: [
          { id: 'fr', label: 'Functional', hint: 'A service or behaviour' },
          { id: 'product', label: 'NFR: product', hint: 'How the product must behave' },
          { id: 'org', label: 'NFR: organizational', hint: 'From the organization’s policies' },
          { id: 'ext', label: 'NFR: external', hint: 'From law or outside the system' }
        ],
        items: [
          { text: 'A user shall be able to search the appointment lists for all clinics.', zone: 'fr', why: 'It names a service the user can perform.' },
          { text: 'The system shall be available Mon–Fri 08.30–17.30 with under five seconds of downtime a day.', zone: 'product', why: 'Availability is a quality of the product itself.' },
          { text: 'Users shall authenticate with their health authority identity card.', zone: 'org', why: 'It comes from the organization’s operating procedures.' },
          { text: 'The system shall implement patient privacy provisions as set by law.', zone: 'ext', why: 'The source is legislation outside the organization.' },
          { text: 'The system shall generate a daily list of patients expected at each clinic.', zone: 'fr', why: 'A concrete function the system provides.' },
          { text: 'Search results shall appear within two seconds for 95% of queries.', zone: 'product', why: 'Performance, a measurable product property.' },
          { text: 'The system shall be developed using the hospital’s approved programming language.', zone: 'org', why: 'A development process constraint set by the organization.' },
          { text: 'Each staff member shall be identified by an eight-digit employee number.', zone: 'fr', why: 'It defines data the system must handle, a functional detail.' }
        ]
      });
    }
  });

  /* ---------- NFR wheel ---------- */
  var NFR = [
    ['Security', 'Resist unauthorized access and misuse.', 'Accounts lock after 3 failed logins; all traffic over TLS.'],
    ['Performance', 'Respond fast enough under load.', '95% of searches return in under 2 s with 500 users.'],
    ['Usability', 'Easy to learn and use.', 'New staff complete a booking after 2 hours of training with under 2 errors per hour.'],
    ['Scalability', 'Grow with users and data.', 'Supports 10x users with under 20% added response time.'],
    ['Availability', 'Ready when needed.', 'Up 99.5% of working hours each month.'],
    ['Reliability', 'Operate without failure.', 'Mean time to failure at least 500 hours.'],
    ['Maintainability', 'Easy to change and fix.', 'A typical change request is implemented in under 3 developer-days.'],
    ['Recoverability', 'Restore after a failure.', 'Service restored within 10 minutes, no more than 1 minute of data lost.']
  ];
  RE.visual('nfr-wheel', {
    title: 'Product NFR wheel',
    hint: 'Each quality needs a measurable target',
    blueprint: true,
    render: function (body) {
      var wrap = h('div', { style: { display: 'grid', 'grid-template-columns': 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', 'align-items': 'center' } });
      var S = 300, cx = 150, cy = 150, R = 130, r0 = 52;
      var s = svg('svg', { viewBox: '0 0 300 300', role: 'img', 'aria-label': 'Wheel of eight product non-functional requirement types', style: 'max-width:340px;width:100%;margin:auto;display:block' });
      var detail = h('div', { 'aria-live': 'polite' });
      var paths = [];
      NFR.forEach(function (n, i) {
        var a0 = (i / 8) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / 8) * Math.PI * 2 - Math.PI / 2;
        var p = function (rad, a) { return (cx + rad * Math.cos(a)).toFixed(1) + ' ' + (cy + rad * Math.sin(a)).toFixed(1); };
        var d = 'M' + p(r0, a0) + ' L' + p(R, a0) + ' A' + R + ' ' + R + ' 0 0 1 ' + p(R, a1) + ' L' + p(r0, a1) + ' A' + r0 + ' ' + r0 + ' 0 0 0 ' + p(r0, a0) + 'Z';
        var g = svg('g', { tabindex: '0', role: 'button', 'aria-label': n[0], style: 'cursor:pointer;outline:none' });
        var path = svg('path', { d: d, style: 'fill:var(--sheet);stroke:var(--ink-2);stroke-width:1.2;transition:fill .2s' });
        var am = (a0 + a1) / 2, tx = cx + (r0 + R) / 2 * Math.cos(am), ty = cy + (r0 + R) / 2 * Math.sin(am);
        var t = svg('text', { x: tx.toFixed(1), y: (ty + 4).toFixed(1), 'text-anchor': 'middle', style: 'font-size:11px;font-weight:700;pointer-events:none', text: n[0].length > 11 ? n[0].slice(0, 8) + '.' : n[0] });
        g.appendChild(path); g.appendChild(t); s.appendChild(g); paths.push(path);
        g.addEventListener('click', function () { pick(i); });
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(i); } });
        g.addEventListener('focus', function () { path.style.stroke = 'var(--accent)'; path.style.strokeWidth = '2.5'; });
        g.addEventListener('blur', function () { path.style.stroke = 'var(--ink-2)'; path.style.strokeWidth = '1.2'; });
      });
      s.appendChild(svg('text', { x: cx, y: cy - 2, 'text-anchor': 'middle', style: 'font:800 18px var(--f-display);letter-spacing:.5px', text: 'PRODUCT' }));
      s.appendChild(svg('text', { x: cx, y: cy + 16, 'text-anchor': 'middle', style: 'font:800 18px var(--f-display);letter-spacing:.5px', text: 'NFR' }));
      function pick(i) {
        paths.forEach(function (p, k) { p.style.fill = k === i ? 'var(--accent-wash)' : 'var(--sheet)'; });
        detail.innerHTML = '';
        var d = h('div', null,
          h('div', { style: { font: '800 var(--step-2)/1 var(--f-display)', 'text-transform': 'uppercase', 'margin-bottom': '8px' } }, NFR[i][0]),
          h('p', { style: { margin: '0 0 10px', color: 'var(--ink-2)' } }, NFR[i][1]),
          h('div', { style: { padding: '12px 14px', background: 'var(--sheet)', 'border-radius': '8px' } }, h('div', { class: 'viz-note', style: { margin: '0 0 4px' } }, 'Written as a testable requirement'), NFR[i][2]));
        detail.appendChild(d); RE.motion.enter(d, { y: 8 });
      }
      wrap.appendChild(s); wrap.appendChild(detail); body.appendChild(wrap); pick(0);
      body.appendChild(h('p', { class: 'viz-note' }, 'NFRs are system-wide, not tied to one feature. One NFR can create functional requirements: a security NFR leads to a login function.'));
    }
  });

  /* ---------- RE process ---------- */
  var STAGES = [
    ['Inception', 'First phase: understand the business, the market, the business case and feasibility.', 'Brainstorming, joint application development meetings.', 'Business case, preliminary solution'],
    ['Elicitation', 'Define scope, identify user requirements and constraints, hold interviews, observe users at work.', 'Brainstorming, interviews, observation, use cases, scenarios, prototyping.', 'Raw requirements from stakeholders, documents, existing systems, domain experts'],
    ['Elaboration', 'Refine the first two phases, expanding and looking deeper.', 'Prototyping, analysis models.', 'Refined, modelled requirements'],
    ['Negotiation', 'Needs versus wants: what to drop, priorities, risk.', 'Discussions about resources, delivery time, cost, scope; conflict removal.', 'Agreed, prioritized set'],
    ['Specification', 'Document functions, features and constraints for the customer in language they understand.', 'SRS, UML, ERD, Figma or InVision prototypes.', 'Software requirements specification'],
    ['V & V', 'Technical review: missing information, errors, standards.', 'Sanity checks, test-case generation, inspection, reviews, coded and design prototypes.', 'Validated baseline'],
    ['Management', 'Identify, control and track requirements as they change.', 'Traceability, change control, versioning.', 'Controlled, traceable requirements']
  ];
  RE.visual('re-process', {
    title: 'The RE process, step by step',
    hint: 'Walk the activities; volatility loops back',
    blueprint: true,
    render: function (body) {
      var cur = 0;
      var W = 760, s = svg('svg', { viewBox: '0 0 ' + W + ' 140', role: 'img', 'aria-label': 'Seven requirements engineering activities in sequence' });
      var defs = svg('defs'); var mk = 'pr-arrow-' + Math.random().toString(36).slice(2, 7);
      var m = svg('marker', { id: mk, viewBox: '0 0 10 10', refX: '9', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto' }, svg('path', { d: 'M0 0 L10 5 L0 10', style: 'fill:none;stroke:var(--ink-2);stroke-width:1.5' }));
      defs.appendChild(m); s.appendChild(defs);
      var nodes = [];
      STAGES.forEach(function (st, i) {
        var x = 20 + i * 104;
        if (i) s.appendChild(svg('path', { d: 'M' + (x - 16) + ' 52 H' + (x - 4), style: 'stroke:var(--ink-2);stroke-width:1.5;fill:none', 'marker-end': 'url(#' + mk + ')' }));
        var g = svg('g', { tabindex: '0', role: 'button', 'aria-label': st[0], style: 'cursor:pointer;outline:none' });
        var r = svg('rect', { x: x, y: 30, width: 88, height: 44, rx: 6, style: 'fill:var(--sheet);stroke:var(--ink);stroke-width:1.5;transition:fill .25s' });
        g.appendChild(r); g.appendChild(svg('text', { x: x + 44, y: 57, 'text-anchor': 'middle', style: 'font:700 15px var(--f-display);letter-spacing:.3px;text-transform:uppercase', text: st[0] }));
        g.addEventListener('click', function () { go(i); });
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(i); } });
        s.appendChild(g); nodes.push(r);
      });
      s.appendChild(svg('path', { d: 'M712 78 C712 118, 70 118, 64 80', style: 'fill:none;stroke:var(--accent);stroke-width:1.3;stroke-dasharray:5 5', 'marker-end': 'url(#' + mk + ')' }));
      s.appendChild(svg('text', { x: 380, y: 134, 'text-anchor': 'middle', class: 'hand', style: 'font-size:14px;fill:var(--accent)', text: 'requirements change: the cycle repeats' }));
      var wrapS = h('div', { class: 'viz-scroll' }, s);
      var detail = h('div', { 'aria-live': 'polite', style: { 'margin-top': '10px' } });
      var prev = h('button', { class: 'btn small', onclick: function () { go(cur - 1); } }, RE.icon('prev'), 'Previous');
      var next = h('button', { class: 'btn primary small', onclick: function () { go(cur + 1); } }, 'Next activity', RE.icon('next'));
      function go(i) {
        cur = Math.max(0, Math.min(STAGES.length - 1, i));
        nodes.forEach(function (r, k) { r.style.fill = k === cur ? 'var(--accent-wash)' : k < cur ? 'var(--green-wash)' : 'var(--sheet)'; r.style.stroke = k === cur ? 'var(--accent)' : 'var(--ink)'; });
        var st = STAGES[cur]; detail.innerHTML = '';
        var d = h('div', { style: { display: 'grid', gap: '10px', 'grid-template-columns': 'repeat(auto-fit, minmax(200px, 1fr))', background: 'var(--sheet)', padding: '16px 18px', 'border-radius': '8px' } },
          h('div', null, h('div', { class: 'viz-note', style: { margin: '0' } }, 'Activity ' + (cur + 1) + ' of 7'), h('div', { style: { font: '800 1.5rem/1.1 var(--f-display)', 'text-transform': 'uppercase' } }, st[0]), h('p', { style: { margin: '6px 0 0' } }, st[1])),
          h('div', null, h('strong', null, 'How'), h('p', { style: { margin: '4px 0 0', color: 'var(--ink-2)' } }, st[2])),
          h('div', null, h('strong', null, 'Produces'), h('p', { style: { margin: '4px 0 0', color: 'var(--ink-2)' } }, st[3])));
        detail.appendChild(d); RE.motion.enter(d, { y: 8, duration: 380 });
        prev.disabled = cur === 0; next.disabled = cur === STAGES.length - 1;
      }
      body.appendChild(wrapS); body.appendChild(detail); body.appendChild(h('div', { class: 'viz-actions' }, prev, next));
      go(0);
    }
  });

  /* ---------- verification vs validation ---------- */
  RE.visual('vv', {
    title: 'Verification or validation?',
    hint: 'Right product, or product right?',
    render: function (body) {
      var items = [
        ['Inspect the SRS against the company’s documentation standard.', 'ver', 'Checks the work against a standard or specification: building the product right.'],
        ['Show a clickable prototype to nurses and ask if it fits their ward routine.', 'val', 'Checks against real stakeholder needs: building the right product.'],
        ['Derive test cases from each requirement to see if each is testable.', 'ver', 'Testability is a property of the written requirement itself.'],
        ['Ask the client whether the agreed features actually achieve the business goal.', 'val', 'Compares the solution with the purpose it should serve.'],
        ['Check that requirement 4.2 does not contradict requirement 7.1.', 'ver', 'Internal consistency is checked against the specification.'],
        ['Run an acceptance demo with end users before sign-off.', 'val', 'Users confirm it is what they need.']
      ];
      var i = 0, score = 0;
      var top = h('div', { style: { display: 'grid', 'grid-template-columns': 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', 'margin-bottom': '14px' } },
        h('div', { style: { padding: '14px 16px', background: 'var(--accent-wash)', 'border-radius': '8px' } }, h('strong', null, 'Verification'), h('p', { style: { margin: '4px 0 0' } }, 'Are we building the product right? Checked against specifications and standards.')),
        h('div', { style: { padding: '14px 16px', background: 'var(--green-wash)', 'border-radius': '8px' } }, h('strong', null, 'Validation'), h('p', { style: { margin: '4px 0 0' } }, 'Are we building the right product? Checked against what stakeholders really need.')));
      var stage = h('div', { 'aria-live': 'polite' });
      body.appendChild(top); body.appendChild(stage);
      function paint() {
        stage.innerHTML = '';
        if (i >= items.length) {
          stage.appendChild(h('div', { class: 'feedback ok' }, RE.icon('check'), h('span', null, 'You got ' + score + ' of ' + items.length + '. ', h('button', { class: 'btn small', onclick: function () { i = 0; score = 0; paint(); } }, 'Play again'))));
          return;
        }
        var it = items[i];
        var card = h('div', { style: { padding: '18px 20px', background: 'var(--paper)', 'border-radius': '8px' } }, h('div', { class: 'viz-note', style: { margin: '0 0 6px' } }, 'Activity ' + (i + 1) + ' of ' + items.length), h('p', { style: { margin: '0', 'font-size': '1.08rem', 'font-weight': '600' } }, it[0]));
        var acts = h('div', { class: 'viz-actions' });
        [['ver', 'Verification'], ['val', 'Validation']].forEach(function (o) {
          acts.appendChild(h('button', { class: 'btn', onclick: function () {
            var ok = o[0] === it[1]; if (ok) score++;
            RE.$$('button', acts).forEach(function (b) { b.disabled = true; });
            stage.appendChild(h('div', { class: 'feedback ' + (ok ? 'ok' : 'bad') }, RE.icon(ok ? 'check' : 'x'), h('span', null, h('strong', null, (ok ? 'Yes. ' : 'It is ' + (it[1] === 'ver' ? 'verification' : 'validation') + '. ')), it[2])));
            stage.appendChild(h('div', { class: 'viz-actions' }, h('button', { class: 'btn primary small', onclick: function () { i++; paint(); } }, 'Next', RE.icon('next'))));
          } }, o[1]));
        });
        stage.appendChild(card); stage.appendChild(acts); RE.motion.enter(card, { y: 8 });
      }
      paint();
    }
  });

  /* ---------- golf cart (PA1) ---------- */
  RE.visual('golf-cart', {
    title: 'Golf cart: the RE team at work',
    hint: 'Follow one stakeholder vision through every activity',
    blueprint: true,
    render: function (body) {
      var steps = [
        ['Inception', 'A stakeholder approaches the company with a vision for a golf cart. The engineer learns the business goal, the market (courses, resorts), and checks feasibility.'],
        ['Elicitation', 'Interview the owner, observe golfers and course staff, review existing carts. Gather needs such as seating, range, slope handling, scorecard display.'],
        ['Analysis & negotiation', 'Conflicts surface: longer battery range vs lower price. Prioritize, drop or defer wants, and agree on scope with the stakeholder.'],
        ['Specification', 'Write FRs (e.g. the cart shall display distance to the hole) and NFRs (e.g. range of at least 36 holes per charge) in the SRS with models.'],
        ['Validation', 'Review the SRS with the stakeholder and test a prototype on a real course: is this the cart they need?'],
        ['Management', 'A new request arrives: GPS tracking. Assess impact, trace affected requirements, update the baseline under change control.']
      ];
      var cur = 0;
      var track = h('div', { style: { display: 'grid', 'grid-template-columns': 'repeat(auto-fit, minmax(100px, 1fr))', gap: '6px' } });
      var d = h('div', { 'aria-live': 'polite', style: { 'margin-top': '14px' } });
      steps.forEach(function (s, i) {
        track.appendChild(h('button', { class: 'chip', 'aria-pressed': String(i === 0), style: { 'justify-content': 'center' }, onclick: function () { go(i); } }, (i + 1) + '. ' + s[0]));
      });
      var cartSvg = '<svg viewBox="0 0 220 120" style="width:180px;max-width:100%;display:block" aria-hidden="true"><g fill="none" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--ink);stroke-width:2">' +
        '<path d="M40 30 H170 M60 30 V70 M160 30 V70"/><path d="M30 70 H190 V90 H30 Z"/><circle cx="62" cy="96" r="14" style="fill:var(--sheet)"/><circle cx="160" cy="96" r="14" style="fill:var(--sheet)"/>' +
        '<path d="M120 70 V48 H145"/><path d="M178 70 l14 -30" style="stroke:var(--accent)"/><path d="M190 40 l10 -4 -6 8" style="stroke:var(--accent)"/></g></svg>';
      function go(i) {
        cur = i;
        RE.$$('button', track).forEach(function (b, k) { b.setAttribute('aria-pressed', String(k === i)); });
        d.innerHTML = '';
        var c = h('div', { style: { display: 'flex', gap: '18px', 'align-items': 'center', 'flex-wrap': 'wrap', background: 'var(--sheet)', padding: '16px 18px', 'border-radius': '8px' } },
          h('div', { html: cartSvg }), h('div', { style: { flex: '1', 'min-width': '200px' } }, h('div', { style: { font: '800 1.4rem/1.1 var(--f-display)', 'text-transform': 'uppercase', 'margin-bottom': '6px' } }, steps[i][0]), h('p', { style: { margin: '0' } }, steps[i][1])));
        d.appendChild(c); RE.motion.enter(c, { y: 8 });
      }
      body.appendChild(track); body.appendChild(d); go(0);
    }
  });
})();
