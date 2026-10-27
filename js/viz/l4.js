/* Lecture 4 figures: Why-What-How ladder and the WRSPM reference model. */
(function () {
  'use strict';
  var RE = window.RE, h = RE.h, svg = RE.svg;

  function fbNode(kind, msg) {
    return h('div', { class: 'feedback ' + kind }, RE.icon(kind === 'ok' ? 'check' : kind === 'bad' ? 'x' : 'info'), h('div', null, msg));
  }
  function setFb(box, kind, msg) { box.innerHTML = ''; box.appendChild(fbNode(kind, msg)); RE.motion.enter(box.firstChild, { y: 6, duration: 260 }); }
  function activate(el, fn) {
    el.addEventListener('click', fn);
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); } });
  }
  function mkToken(text, onPick) {
    var t = h('button', { class: 'token', type: 'button', draggable: 'true' }, text);
    t.addEventListener('click', function () { onPick(t); });
    t.addEventListener('dragstart', function (e) {
      try { e.dataTransfer.setData('text/plain', 'token'); e.dataTransfer.effectAllowed = 'move'; } catch (x) {}
      t.classList.add('dragging'); onPick(t, true);
    });
    t.addEventListener('dragend', function () { t.classList.remove('dragging'); });
    return t;
  }
  function mkZone(onDrop) {
    var z = h('div', { class: 'drop-zone', tabindex: '0', role: 'button' });
    z.addEventListener('dragover', function (e) { e.preventDefault(); z.classList.add('over'); });
    z.addEventListener('dragleave', function () { z.classList.remove('over'); });
    z.addEventListener('drop', function (e) { e.preventDefault(); z.classList.remove('over'); onDrop(); });
    activate(z, function (e) { if (e.target === z || e.target.classList.contains('zone-label')) onDrop(); });
    return z;
  }

  /* ================= WHY / WHAT / HOW ================= */
  var RUNGS = [
    { id: 'why', word: 'WHY', name: 'Business requirement', short: 'Why does the organisation want this?', tag: 'concept',
      arts: [['Business goals and objectives', 'Measurable aims of the organisation'], ['Vision and scope', 'What is in and out of the project'], ['Success criteria', 'How the business will know it worked']],
      rule: 'A business requirement states a goal of the organisation. It names no feature and no screen.' },
    { id: 'what', word: 'WHAT', name: 'User requirement', short: 'What must users be able to do?', tag: 'theory',
      arts: [['Use cases and scenarios', 'Tasks users perform with the system'], ['Sketches and storyboards', 'Rough pictures of how a task unfolds'], ['Prototypes', 'Clickable mock-ups users can react to']],
      rule: 'A user requirement describes what users need to accomplish, in the problem domain, without saying how the software does it.' },
    { id: 'how', word: 'HOW', name: 'System requirement', short: 'How exactly must the system behave?', tag: 'practice',
      arts: [['Functional requirements', 'Specific behaviours: the system shall ...'], ['Non-functional requirements', 'Quality limits: speed, security, usability'], ['Implementation requirements', 'Technology and design constraints']],
      rule: 'A system requirement is a precise, testable statement of behaviour or constraint that developers can build.' }
  ];
  var SCEN = {
    retail: {
      label: 'Retail chain',
      why: 'Increase the retail chain profit by 30% within a year.',
      what: 'Customers order online and collect in store; managers see daily sales per branch.',
      how: 'The system shall email an order confirmation and answer any search in under 2 seconds.',
      ex: [
        ['Profit +30% in 12 months; fewer lost sales from stock-outs', 'Online sales channel is in scope, loyalty cards are not', 'Average basket size and online order share both rise'],
        ['Use case: Customer places an online order and picks it up', 'Storyboard of the pick-up counter queue', 'Clickable prototype of the product page and cart'],
        ['The system shall send an email confirmation after payment', 'Search results appear within 2 seconds for 500 users', 'Runs on the existing cloud database']
      ],
      items: [
        ['Raise annual profit by 30%', 'why'], ['Reduce stock-outs so fewer sales are lost', 'why'],
        ['A store manager can view yesterday\'s sales for each branch', 'what'], ['A customer can reserve an item online and collect it in store', 'what'],
        ['The checkout service shall respond within 2 seconds', 'how'], ['Order data is kept in a relational database with nightly backup', 'how']
      ]
    },
    hospital: {
      label: 'Hospital',
      why: 'Cut the average emergency room waiting time by 25%.',
      what: 'A nurse registers a patient in under a minute and sees who is next in the triage queue.',
      how: 'The system shall sort the queue by triage level and refresh it every 5 seconds.',
      ex: [
        ['Waiting time down 25%; fewer patients leave unseen', 'Emergency room only; wards and billing are out of scope', 'Median wait measured monthly'],
        ['Use case: Nurse registers a patient and assigns a triage level', 'Sketch of the triage board on a wall screen', 'Prototype of the registration form'],
        ['The system shall sort the queue by triage level then arrival time', 'Patient records are encrypted and every access is logged', 'Integrates with the hospital\'s existing HL7 interface']
      ],
      items: [
        ['Reduce emergency room waiting time by 25%', 'why'], ['Fewer patients leave without being seen', 'why'],
        ['A nurse can register a patient and give a triage level', 'what'], ['A doctor sees which patient is next', 'what'],
        ['Patient records shall be encrypted at rest and in transit', 'how'], ['The queue display shall refresh every 5 seconds', 'how']
      ]
    },
    atm: {
      label: 'ATM',
      why: 'Serve customers outside branch hours and cut teller costs.',
      what: 'A customer withdraws cash using a card and a PIN at any time of day.',
      how: 'The system shall dispense cash only after the bank approves the PIN and the amount.',
      ex: [
        ['Customers served 24/7; teller costs reduced', 'Cash withdrawal and balance only; deposits are out of scope', 'Share of withdrawals done at ATMs'],
        ['Use case: Customer withdraws cash', 'Storyboard: insert card, enter PIN, take cash and card', 'Paper prototype of the screens and buttons'],
        ['The system shall verify the PIN with the bank before dispensing', 'A transaction shall complete within 30 seconds', 'Runs on the ATM\'s embedded operating system']
      ],
      items: [
        ['Let customers get cash outside branch hours', 'why'], ['Lower the cost of staffing tellers', 'why'],
        ['A customer can withdraw cash with a card and PIN', 'what'], ['A customer can check an account balance', 'what'],
        ['The PIN shall be encrypted between keypad and bank', 'how'], ['The roller shall not dispense until the bank approves', 'how']
      ]
    }
  };
  var WHY_EXPLAIN = {
    why: 'It is a goal in business terms: why the organisation wants a system at all.',
    what: 'It says what users need to do, from the user\'s point of view, without saying how the software does it.',
    how: 'It is precise, testable behaviour or a constraint on the system that developers can implement.'
  };

  RE.visual('why-what-how', {
    title: 'Why, What, How ladder',
    hint: 'Climb down from business goal to system behaviour',
    blueprint: true,
    render: function (body, preset) {
      var key = SCEN[preset] ? preset : (RE.store.get('viz:wwh:scen', 'retail'));
      if (!SCEN[key]) key = 'retail';
      var root = h('div');
      body.appendChild(root);
      var openRung = null, sel = null, score = 0, done = 0;

      function build() {
        root.innerHTML = '';
        var sc = SCEN[key];
        openRung = null; sel = null; score = 0; done = 0;
        var seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Scenario' });
        Object.keys(SCEN).forEach(function (k) {
          var b = h('button', { type: 'button', 'aria-pressed': k === key ? 'true' : 'false', onclick: function () { key = k; RE.store.set('viz:wwh:scen', k); build(); } }, SCEN[k].label);
          seg.appendChild(b);
        });
        root.appendChild(seg);

        var ladder = h('div', { style: { display: 'grid', gap: '10px', 'margin-top': '16px' } });
        RUNGS.forEach(function (r, i) {
          var panel = h('div', { id: 'wwh-p-' + r.id + key, hidden: true, style: { padding: '4px 4px 4px 54px' } });
          var list = h('div', { style: { display: 'grid', gap: '8px', 'grid-template-columns': 'repeat(auto-fit, minmax(190px, 1fr))' } });
          r.arts.forEach(function (a, j) {
            list.appendChild(h('div', { class: 'viz-note', style: { margin: 0, padding: '10px 12px', border: '1px solid var(--rule)', 'border-radius': '10px', background: 'var(--sheet)' } },
              h('strong', null, a[0]), h('div', null, a[1]), h('div', { class: 'hand', style: { color: 'var(--accent-ink)', 'margin-top': '4px' } }, 'In this case: ' + sc.ex[i][j])));
          });
          panel.appendChild(h('p', { class: 'viz-note', style: { 'margin-bottom': '8px' } }, r.rule));
          panel.appendChild(list);
          var btn = h('button', { type: 'button', class: 'btn ghost', 'aria-expanded': 'false', 'aria-controls': panel.id,
            style: { width: '100%', display: 'flex', 'align-items': 'center', gap: '14px', 'text-align': 'left', height: 'auto', padding: '12px 16px', 'margin-left': (i * 14) + 'px', 'max-width': 'calc(100% - ' + (i * 14) + 'px)' },
            onclick: function () {
              var willOpen = openRung !== r.id;
              openRung = willOpen ? r.id : null;
              RE.$$('[data-rung]', ladder).forEach(function (n) {
                var on = n.getAttribute('data-rung') === openRung;
                n.setAttribute('aria-expanded', on ? 'true' : 'false');
                var p = document.getElementById(n.getAttribute('aria-controls'));
                if (p) { p.hidden = !on; if (on) RE.motion.enter(p, { y: 8, duration: 280 }); }
              });
            } },
            h('span', { class: 'tag ' + r.tag, style: { flex: 'none' } }, r.word),
            h('span', { style: { flex: '1' } }, h('strong', null, r.name), h('span', { class: 'viz-note', style: { display: 'block', margin: 0 } }, sc[r.id])),
            RE.icon('next'));
          btn.setAttribute('data-rung', r.id);
          btn.querySelector('svg').style.width = '18px';
          ladder.appendChild(btn);
          ladder.appendChild(panel);
          if (i < 2) ladder.appendChild(h('div', { class: 'hand', style: { 'padding-left': (i * 14 + 20) + 'px', color: 'var(--ink-3)' }, 'aria-hidden': 'true' }, i === 0 ? 'achieved by letting users ...' : 'which the system realises by ...'));
        });
        root.appendChild(ladder);

        /* sorting game */
        root.appendChild(h('h4', { style: { margin: '24px 0 4px' } }, 'Sort the statements'));
        root.appendChild(h('p', { class: 'viz-note', style: { 'margin-top': 0 } }, 'Pick a statement, then pick the rung it belongs to (or drag it there).'));
        var pool = h('div', { style: { display: 'flex', 'flex-wrap': 'wrap', gap: '8px', 'min-height': '44px' } });
        var fbox = h('div', { 'aria-live': 'polite' });
        var scoreEl = h('span', { class: 'num viz-note', style: { margin: 0 } }, '0 / ' + sc.items.length + ' placed');
        var zonesWrap = h('div', { style: { display: 'grid', gap: '10px', 'grid-template-columns': 'repeat(auto-fit, minmax(150px, 1fr))', 'margin-top': '14px' } });
        function pick(t, fromDrag) {
          if (t.classList.contains('ok')) return;
          if (sel && sel !== t) sel.classList.remove('selected');
          if (!fromDrag && sel === t) { t.classList.remove('selected'); sel = null; return; }
          sel = t; t.classList.add('selected');
        }
        RE.shuffle(sc.items).forEach(function (it) {
          var t = mkToken(it[0], pick); t._rung = it[1]; pool.appendChild(t);
        });
        RUNGS.forEach(function (r) {
          var z = mkZone(function () {
            if (!sel) { setFb(fbox, 'info', 'Pick a statement first, then choose its rung.'); return; }
            var t = sel; sel = null; t.classList.remove('selected');
            if (t._rung === r.id) {
              t.classList.add('ok'); t.draggable = false; t.setAttribute('draggable', 'false');
              z.appendChild(t); done++; score++;
              scoreEl.textContent = done + ' / ' + sc.items.length + ' placed';
              RE.motion.pop(t);
              setFb(fbox, 'ok', 'Correct: this is a ' + r.name.toLowerCase() + '. ' + WHY_EXPLAIN[r.id]);
              if (done === sc.items.length) setFb(fbox, 'ok', 'All sorted. Notice how each rung is a refinement of the one above it: the goal drives the user needs, and the user needs drive the system behaviour.');
            } else {
              RE.motion.shake(t); t.classList.add('bad');
              setTimeout(function () { t.classList.remove('bad'); }, 700);
              var right = RUNGS.filter(function (x) { return x.id === t._rung; })[0];
              setFb(fbox, 'bad', 'Not the ' + r.word + ' rung. This is a ' + right.name.toLowerCase() + ' (' + right.word + '). ' + WHY_EXPLAIN[t._rung]);
            }
          });
          z.setAttribute('aria-label', r.word + ' rung: ' + r.name);
          z.appendChild(h('div', { class: 'zone-label hand', style: { 'margin-bottom': '8px', color: 'var(--ink-2)' } }, r.word + ' · ' + r.name));
          zonesWrap.appendChild(z);
        });
        root.appendChild(pool);
        root.appendChild(zonesWrap);
        root.appendChild(h('div', { class: 'viz-actions' }, h('button', { class: 'btn small', type: 'button', onclick: build }, RE.icon('reset'), 'Reset'), scoreEl));
        root.appendChild(fbox);
      }
      build();
    }
  });

  /* ================= WRSPM ================= */
  var DEF = {
    W: { name: 'World assumptions', region: 'Environment', def: 'Facts about the environment that hold whether or not the system exists. They are hard to capture, but the requirements depend on them.' },
    R: { name: 'Requirements', region: 'Environment', def: 'What the stakeholders want, written in the language of the problem domain (the environment).' },
    S: { name: 'Specification', region: 'Interface', def: 'What the system must do at the interface, written only in phenomena both sides can see (ev and sv). It bridges the requirement and the machine.' },
    P: { name: 'Program', region: 'System', def: 'The software that implements the specification, running on the machine. Code and frameworks.' },
    M: { name: 'Machine (programming platform)', region: 'System', def: 'The hardware and platform the program runs on, including the sensors and actuators.' },
    eh: { name: 'Environment-hidden (eh)', region: 'Environment', def: 'Phenomena in the environment that the system cannot see. Often the things users really care about.' },
    ev: { name: 'Environment-visible (ev)', region: 'Interface', def: 'Environment phenomena the system can observe: its inputs, as sensed or typed.' },
    sv: { name: 'System-visible (sv)', region: 'Interface', def: 'System phenomena the environment can observe: its outputs, such as screens, sounds and motion.' },
    sh: { name: 'System-hidden (sh)', region: 'System', def: 'Internal phenomena of the system, invisible to the environment: data structures, internal calls.' }
  };
  var WHY_PLACE = {
    W: 'a world assumption: a fact about the environment, independent of the system',
    R: 'a requirement: what the stakeholder wants, in environment terms',
    S: 'a specification: what the system does at the interface using visible phenomena',
    P: 'the program: the software that implements the specification',
    M: 'the machine: the hardware or platform the program runs on',
    eh: 'environment-hidden: part of the environment the system never sees',
    ev: 'environment-visible: an input the system can sense',
    sv: 'system-visible: an output the environment can observe',
    sh: 'system-hidden: internal to the system and invisible outside'
  };
  var WR = {
    patient: {
      label: 'Patient monitoring',
      W: 'A nurse is close enough to hear the buzzer.',
      R: 'Warn the nurse if the patient\'s heartbeat stops.',
      S: 'Sound the buzzer when the sensor reads no heartbeat.',
      P: 'The program that reads the sensor and sounds the buzzer.',
      M: 'The platform with sensors and actuators that runs the program.',
      eh: 'The nurse and the heartbeat itself.',
      ev: 'The sound from the chest, picked up by the sensor.',
      sv: 'The buzzer sound.',
      sh: 'The internal data representation of the heartbeat signal.'
    },
    atm: {
      label: 'ATM',
      W: 'A person who has the card and knows the PIN is the account owner.',
      R: 'A customer can withdraw money from their account.',
      S: 'When the card and PIN are valid and the bank approves, dispense the requested amount.',
      P: 'The software controlling the card reader, screen, bank link and roller.',
      M: 'The hardware: card reader, keypad, roller and lockbox.',
      eh: 'The card itself and the customer\'s wish for cash.',
      ev: 'The mag-strip data and the PIN entered.',
      sv: 'Buttons and the information shown on the screen.',
      sh: 'The roller and the bank approval.'
    },
    'smart-home': {
      label: 'Smart home',
      W: 'Running the air conditioner and closing curtains change room temperature and light.',
      R: 'Each room\'s temperature and lighting match the owner\'s chosen criteria.',
      S: 'Switch the AC and curtain motors when sensor readings differ from the target.',
      P: 'The control program that compares readings with the targets.',
      M: 'Controller board, temperature and humidity sensors, AC and curtain actuators.',
      eh: 'The real climate in the room and the owner\'s comfort.',
      ev: 'Temperature and humidity readings from the sensors.',
      sv: 'Curtain position and AC output.',
      sh: 'The control loop state and stored target settings.'
    },
    farm: {
      label: 'Smart farm',
      W: 'Each animal type has its own feeding, grooming and sleeping section, and tags stay under the skin.',
      R: 'Barn keepers are notified if an animal is missing or in a wrong place.',
      S: 'Show each tag as a dot on the map; flash it and peep when its sensor is in a wrong section.',
      P: 'The program that maps tag reads to sections and raises alerts.',
      M: 'The monitor, wifi sensors and speaker.',
      eh: 'The animals\' actual movements and the keepers\' attention.',
      ev: 'Wifi tag signals read by nearby sensors.',
      sv: 'The map dot, its flashing and the peep notification.',
      sh: 'The sensor-to-section lookup table and tag-to-type records.'
    }
  };
  var ORDER = ['W', 'R', 'S', 'P', 'M', 'eh', 'ev', 'sv', 'sh'];

  RE.visual('wrspm', {
    title: 'WRSPM reference model',
    hint: 'Click any letter, then classify real examples',
    blueprint: true,
    render: function (body, preset) {
      var pk = WR[preset] ? preset : 'patient';
      var picked = null, sel = null;
      var root = h('div'); body.appendChild(root);
      var mid = RE.store.get('viz:wrspm:preset', null);
      if (!WR[preset] && mid && WR[mid]) pk = mid;

      function build() {
        root.innerHTML = '';
        var P = WR[pk]; picked = null; sel = null;
        var seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Example system' });
        Object.keys(WR).forEach(function (k) {
          seg.appendChild(h('button', { type: 'button', 'aria-pressed': k === pk ? 'true' : 'false', onclick: function () { pk = k; RE.store.set('viz:wrspm:preset', k); build(); } }, WR[k].label));
        });
        root.appendChild(seg);

        /* diagram */
        var W = 720, H = 410;
        var s = svg('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'WRSPM reference model: environment and system overlap at the specification interface' });
        function rect(x, y, w, hh, st, rx) { return svg('rect', { x: x, y: y, width: w, height: hh, rx: rx || 0, style: st }); }
        function txt(x, y, t, cls, st, anchor) { return svg('text', { x: x, y: y, class: cls || '', style: st || 'fill:var(--ink)', 'text-anchor': anchor || 'middle', text: t, 'font-size': 14 }); }
        s.appendChild(rect(20, 20, 440, 340, 'fill:var(--accent-wash);stroke:var(--accent);stroke-width:2', 18));
        s.appendChild(rect(260, 20, 440, 340, 'fill:var(--amber-wash);stroke:var(--amber);stroke-width:2', 18));
        s.appendChild(rect(260, 20, 200, 340, 'fill:var(--green-wash);stroke:var(--green);stroke-width:1.5;stroke-dasharray:6 4', 0));
        s.appendChild(txt(40, 50, 'ENVIRONMENT', 'hand', 'fill:var(--accent-ink)', 'start'));
        s.appendChild(txt(680, 50, 'SYSTEM', 'hand', 'fill:var(--ink)', 'end'));
        s.appendChild(txt(360, 76, 'shared interface', 'hand', 'fill:var(--ink-2)'));
        var detail = h('div', { 'aria-live': 'polite', class: 'feedback info', style: { 'margin-top': '12px' } });
        var nodes = {};
        function showDetail(k) {
          picked = k;
          Object.keys(nodes).forEach(function (n) { nodes[n].circle.style.strokeWidth = n === k ? '4' : '2'; nodes[n].circle.style.fill = n === k ? 'var(--accent-wash)' : 'var(--sheet)'; });
          detail.innerHTML = '';
          detail.appendChild(RE.icon('info'));
          detail.appendChild(h('div', null, h('strong', null, k + ' · ' + DEF[k].name + ' (' + DEF[k].region.toLowerCase() + ')'),
            h('div', null, DEF[k].def), h('div', { class: 'hand', style: { color: 'var(--accent-ink)', 'margin-top': '4px', 'font-size': '1.05rem' } }, P.label + ': ' + P[k])));
        }
        function letter(k, x, y, r, cap) {
          var g = svg('g', { tabindex: '0', role: 'button', 'aria-label': k + ': ' + DEF[k].name, style: 'cursor:pointer' });
          var c = svg('circle', { cx: x, cy: y, r: r, style: 'fill:var(--sheet);stroke:var(--ink);stroke-width:2' });
          g.appendChild(c);
          g.appendChild(svg('text', { x: x, y: y + 6, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 700, style: 'fill:var(--ink)', text: k }));
          var lines = cap.split('|');
          lines.forEach(function (ln, i) { g.appendChild(svg('text', { x: x, y: y + r + 18 + i * 15, 'text-anchor': 'middle', 'font-size': 13, style: 'fill:var(--ink-2)', text: ln })); });
          activate(g, function () { showDetail(k); RE.motion.pop(c); });
          nodes[k] = { circle: c }; s.appendChild(g);
        }
        letter('W', 90, 130, 26, 'World|assumptions'); letter('R', 195, 130, 26, 'Requirements');
        letter('S', 360, 130, 26, 'Specification'); letter('P', 540, 130, 26, 'Program'); letter('M', 645, 130, 26, 'Machine');
        letter('eh', 130, 285, 22, 'environment|hidden'); letter('ev', 310, 285, 22, 'env.|visible'); letter('sv', 415, 285, 22, 'system|visible');
        letter('sh', 585, 285, 22, 'system|hidden');
        s.appendChild(txt(360, 392, 'W, S entail R        P, M entail S', 'hand', 'fill:var(--ink-2)'));
        var wrap = h('div', { class: 'viz-scroll', style: { 'margin-top': '14px' } }, s);
        root.appendChild(wrap);
        root.appendChild(detail);
        showDetail(picked || 'W');

        /* exercise */
        root.appendChild(h('h4', { style: { margin: '24px 0 4px' } }, 'Classify: ' + P.label));
        root.appendChild(h('p', { class: 'viz-note', style: { 'margin-top': 0 } }, 'Each statement belongs to exactly one box. Pick a statement, then the box (or drag it). Press Check when you are done.'));
        var pool = h('div', { style: { display: 'flex', 'flex-wrap': 'wrap', gap: '8px', 'min-height': '44px' } });
        var fbox = h('div', { 'aria-live': 'polite' });
        var zones = {};
        var poolZone = h('div', { style: { padding: '2px' } }, pool);
        function pickTok(t, fromDrag) {
          if (sel && sel !== t) sel.classList.remove('selected');
          if (!fromDrag && sel === t) { t.classList.remove('selected'); sel = null; return; }
          sel = t; t.classList.add('selected');
        }
        function place(zoneKey) {
          if (!sel) return;
          var t = sel; sel = null; t.classList.remove('selected', 'ok', 'bad');
          if (zoneKey === 'pool') { pool.appendChild(t); return; }
          var z = zones[zoneKey], old = RE.$('.token', z);
          if (old && old !== t) { old.classList.remove('ok', 'bad'); pool.appendChild(old); }
          z.appendChild(t);
        }
        poolZone.addEventListener('dragover', function (e) { e.preventDefault(); });
        poolZone.addEventListener('drop', function (e) { e.preventDefault(); place('pool'); });
        poolZone.addEventListener('click', function (e) { if (e.target === poolZone || e.target === pool) place('pool'); });
        RE.shuffle(ORDER).forEach(function (k) { var t = mkToken(P[k], pickTok); t._key = k; pool.appendChild(t); });
        var grid = h('div', { style: { display: 'grid', gap: '10px', 'grid-template-columns': 'repeat(auto-fit, minmax(170px, 1fr))', 'margin-top': '14px' } });
        ORDER.forEach(function (k) {
          var z = mkZone(function () { place(k); });
          z.style.minHeight = '70px';
          z.setAttribute('aria-label', 'Box ' + k + ': ' + DEF[k].name);
          z.appendChild(h('div', { class: 'zone-label hand', style: { 'margin-bottom': '6px', color: 'var(--ink-2)' } }, k + ' · ' + DEF[k].name));
          zones[k] = z; grid.appendChild(z);
        });
        root.appendChild(poolZone);
        root.appendChild(grid);
        var check = h('button', { class: 'btn primary small', type: 'button', onclick: function () {
          var right = 0, placed = 0, wrong = [];
          ORDER.forEach(function (k) {
            var t = RE.$('.token', zones[k]);
            if (!t) return;
            placed++;
            if (t._key === k) { right++; t.classList.add('ok'); t.classList.remove('bad'); }
            else { t.classList.add('bad'); t.classList.remove('ok'); wrong.push(t); }
          });
          if (!placed) { setFb(fbox, 'info', 'Place at least one statement in a box first.'); return; }
          if (right === ORDER.length) { setFb(fbox, 'ok', 'All nine correct. Remember the pattern: W and R live in the environment, S sits on the shared interface, P and M are the system.'); return; }
          var msg = right + ' of ' + ORDER.length + ' correct' + (placed < ORDER.length ? ' (' + (ORDER.length - placed) + ' not placed yet)' : '') + '. ';
          if (wrong.length) {
            var w = wrong[0];
            msg += 'For example "' + w.textContent + '" is ' + WHY_PLACE[w._key] + '.';
          }
          setFb(fbox, 'bad', msg);
        } }, RE.icon('check'), 'Check');
        root.appendChild(h('div', { class: 'viz-actions' }, check, h('button', { class: 'btn small', type: 'button', onclick: build }, RE.icon('reset'), 'Reset')));
        root.appendChild(fbox);
      }
      build();
    }
  });
})();
