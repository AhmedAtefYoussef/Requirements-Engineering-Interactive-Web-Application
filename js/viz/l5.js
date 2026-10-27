/* Lecture 5 figures: UML taxonomy, perspectives, use case, sequence, class, state and activity diagrams. */
(function () {
  'use strict';
  var RE = window.RE, h = RE.h, svg = RE.svg;

  var uidN = 0;
  function uid(p) { uidN++; return p + '-' + uidN + Math.random().toString(36).slice(2, 6); }
  function fbNode(kind, msg) {
    return h('div', { class: 'feedback ' + kind }, RE.icon(kind === 'ok' ? 'check' : kind === 'bad' ? 'x' : 'info'), h('div', null, msg));
  }
  function setFb(box, kind, msg) { box.innerHTML = ''; box.appendChild(fbNode(kind, msg)); RE.motion.enter(box.firstChild, { y: 6, duration: 260 }); }
  function activate(el, fn) {
    el.addEventListener('click', fn);
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); } });
  }
  function seg(label, opts, current, onPick) {
    var d = h('div', { class: 'seg', role: 'group', 'aria-label': label });
    opts.forEach(function (o) {
      d.appendChild(h('button', { type: 'button', 'aria-pressed': o[0] === current ? 'true' : 'false', onclick: function () {
        RE.$$('button', d).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        this.setAttribute('aria-pressed', 'true'); onPick(o[0]);
      } }, o[1]));
    });
    return d;
  }
  function T(x, y, t, o) {
    o = o || {};
    return svg('text', { x: x, y: y, 'text-anchor': o.a || 'middle', 'font-size': o.s || 13, 'font-weight': o.w || 400, class: o.c || '',
      style: (o.st || 'fill:var(--ink)') + (o.i ? ';font-style:italic' : ''), text: t });
  }
  function marker(defs, id, kind) {
    var m = svg('marker', { id: id, viewBox: '0 0 12 12', refX: kind === 'dia' ? 0 : 11, refY: 6, markerWidth: 11, markerHeight: 11, orient: 'auto', markerUnits: 'userSpaceOnUse' });
    if (kind === 'open') m.appendChild(svg('path', { d: 'M1 1 L11 6 L1 11', style: 'fill:none;stroke:var(--ink);stroke-width:1.6' }));
    else if (kind === 'filled') m.appendChild(svg('path', { d: 'M1 1 L11 6 L1 11 Z', style: 'fill:var(--ink);stroke:var(--ink);stroke-width:1' }));
    else if (kind === 'tri') m.appendChild(svg('path', { d: 'M1 1 L11 6 L1 11 Z', style: 'fill:var(--sheet);stroke:var(--ink);stroke-width:1.6' }));
    else if (kind === 'dia-hollow') { m.setAttribute('refX', 0); m.setAttribute('viewBox', '0 0 20 12'); m.setAttribute('markerWidth', 20); m.appendChild(svg('path', { d: 'M1 6 L10 1 L19 6 L10 11 Z', style: 'fill:var(--sheet);stroke:var(--ink);stroke-width:1.6' })); }
    else if (kind === 'dia-filled') { m.setAttribute('refX', 0); m.setAttribute('viewBox', '0 0 20 12'); m.setAttribute('markerWidth', 20); m.appendChild(svg('path', { d: 'M1 6 L10 1 L19 6 L10 11 Z', style: 'fill:var(--ink);stroke:var(--ink);stroke-width:1.6' })); }
    defs.appendChild(m);
  }

  /* ================= UML TREE ================= */
  var TREE = [
    { id: 'structure', label: 'Structure diagrams', note: 'Show the static parts of the system: what exists and how it is arranged.', kids: [
      { id: 'class', label: 'Class', top: true, note: 'Classes with attributes, operations and relationships: the vocabulary of the system.' },
      { id: 'component', label: 'Component', note: 'Replaceable software modules and the interfaces they provide and require.' },
      { id: 'object', label: 'Object', note: 'A snapshot of objects and their links at one moment, an instance of a class diagram.' },
      { id: 'deployment', label: 'Deployment', note: 'How software artefacts are placed on hardware nodes.' },
      { id: 'package', label: 'Package', note: 'Groups of model elements and the dependencies between those groups.' }
    ] },
    { id: 'behavior', label: 'Behavior diagrams', note: 'Show what the system does and how it changes over time.', kids: [
      { id: 'activity', label: 'Activity', top: true, note: 'The flow of actions and decisions in a process, including parallel paths.' },
      { id: 'usecase', label: 'Use case', top: true, note: 'Who uses the system and which goals they can achieve with it.' },
      { id: 'state', label: 'State machine', top: true, note: 'The states an object passes through and the events that trigger each change.' },
      { id: 'interaction', label: 'Interaction', note: 'How parts exchange messages to complete a task.', kids: [
        { id: 'sequence', label: 'Sequence', top: true, note: 'Messages between lifelines in time order, top to bottom.' },
        { id: 'communication', label: 'Communication', note: 'The same messages as a sequence diagram, but arranged around the links between objects.' }
      ] }
    ] }
  ];

  RE.visual('uml-tree', {
    title: 'UML diagram taxonomy',
    hint: 'Click a diagram type to see its purpose',
    blueprint: false,
    render: function (body) {
      var only = false, sel = null;
      var root = h('div');
      body.appendChild(root);
      var detail = h('div', { class: 'feedback info', 'aria-live': 'polite' }, RE.icon('info'), h('div', null, 'Select any box to read its purpose.'));
      function isTop(n) { return n.top || (n.kids || []).some(isTop); }
      function node(n, depth) {
        if (only && !isTop(n)) return null;
        var btn = h('button', { type: 'button', class: 'chip', 'aria-pressed': sel === n.id ? 'true' : 'false',
          style: n.top ? { 'border-color': 'var(--accent)', background: sel === n.id ? '' : 'var(--accent-wash)', 'font-weight': '700' } : {},
          onclick: function () { sel = n.id; paintDetail(n); draw(); } }, n.label, n.top ? h('span', { class: 'hand', style: { 'margin-left': '6px', color: sel === n.id ? 'var(--sheet)' : 'var(--accent-ink)' } }, 'top 5') : null);
        var wrap = h('div', { style: { display: 'grid', gap: '8px' } }, btn);
        if (n.kids) {
          var kids = h('div', { style: { display: 'grid', gap: '8px', 'margin-left': '14px', 'padding-left': '14px', 'border-left': '2px solid var(--rule-strong)' } });
          n.kids.forEach(function (k) { var c = node(k, depth + 1); if (c) kids.appendChild(c); });
          wrap.appendChild(kids);
        }
        wrap.firstChild.style.justifySelf = 'start';
        return wrap;
      }
      function paintDetail(n) {
        detail.innerHTML = '';
        detail.appendChild(RE.icon('info'));
        detail.appendChild(h('div', null, h('strong', null, n.label + (n.kids && !n.top ? '' : '') + ' diagram' + (n.id === 'structure' || n.id === 'behavior' ? 's' : '')), h('div', null, n.note)));
      }
      var holder = h('div');
      function draw() {
        holder.innerHTML = '';
        var top = h('button', { type: 'button', class: 'chip', style: { 'font-weight': '700' }, 'aria-pressed': sel === 'uml' ? 'true' : 'false',
          onclick: function () { sel = 'uml'; paintDetail({ id: 'uml', label: 'UML', note: 'The Unified Modeling Language: a standard visual notation with two families, structure and behavior diagrams.' }); draw(); } }, 'UML diagrams');
        top.style.justifySelf = 'start';
        var kids = h('div', { style: { display: 'grid', gap: '14px', 'margin-left': '14px', 'padding-left': '14px', 'border-left': '2px solid var(--rule-strong)', 'grid-template-columns': 'repeat(auto-fit, minmax(220px, 1fr))' } });
        TREE.forEach(function (n) { var c = node(n, 1); if (c) kids.appendChild(c); });
        holder.appendChild(h('div', { style: { display: 'grid', gap: '10px' } }, top, kids));
      }
      var toggle = h('button', { type: 'button', class: 'chip', 'aria-pressed': 'false', onclick: function () {
        only = !only; this.setAttribute('aria-pressed', only ? 'true' : 'false'); draw();
      } }, 'Most important 5');
      root.appendChild(h('div', { class: 'viz-actions', style: { 'margin-top': 0, 'margin-bottom': '14px' } }, toggle,
        h('span', { class: 'viz-note', style: { margin: 0 } }, 'Highlighted: use case, class, sequence, activity and state machine.')));
      root.appendChild(holder);
      root.appendChild(detail);
      draw();
    }
  });

  /* ================= PERSPECTIVES ================= */
  var PERSP = {
    external: { name: 'External', desc: 'The system in its context: who and what it interacts with from outside.', dia: ['Use case', 'Class', 'Sequence', 'State machine'], typical: 'Use case' },
    interaction: { name: 'Interaction', desc: 'How actors and parts talk to each other, message by message.', dia: ['Use case', 'Sequence', 'Class', 'Activity'], typical: 'Sequence' },
    structural: { name: 'Structural', desc: 'The static parts of the system and how they relate.', dia: ['Class', 'Sequence', 'State machine', 'Use case'], typical: 'Class' },
    behavioral: { name: 'Behavioral', desc: 'How the system or its objects behave and change over time.', dia: ['State machine', 'Class', 'Use case', 'Deployment'], typical: 'State machine' }
  };
  var QUESTIONS = [
    { q: 'Who uses the system and which goals can they achieve?', p: 'external', d: 'Use case', why: 'It looks at the system from outside, listing actors and their goals.' },
    { q: 'In what order do the Customer, App and Database exchange messages?', p: 'interaction', d: 'Sequence', why: 'Message order between participants is exactly what a sequence diagram shows.' },
    { q: 'What does the system store?', p: 'structural', d: 'Class', why: 'Stored things and their relationships are static structure: classes, attributes and associations.' },
    { q: 'How does an order change over its life: placed, paid, shipped, cancelled?', p: 'behavioral', d: 'State machine', why: 'Life-cycle changes triggered by events are modelled with states and transitions.' },
    { q: 'What are the steps and decisions in the checkout process?', p: 'behavioral', d: 'Activity', why: 'Step-by-step flow with decisions and parallel paths is an activity diagram, a behavioral view.' },
    { q: 'Which actors live outside the system boundary?', p: 'external', d: 'Use case', why: 'The boundary and the actors around it define the external view.' }
  ];
  PERSP.behavioral.dia = ['State machine', 'Activity', 'Class', 'Use case'];

  RE.visual('perspectives', {
    title: 'Four modelling perspectives',
    hint: 'Match the question to a perspective and a diagram',
    blueprint: false,
    render: function (body) {
      var qi = 0, stage = 'persp', chosenP = null;
      var order = RE.shuffle(QUESTIONS);
      var root = h('div'); body.appendChild(root);
      function draw() {
        root.innerHTML = '';
        var Q = order[qi % order.length];
        root.appendChild(h('div', { class: 'viz-note', style: { margin: '0 0 6px' } }, 'Question ' + ((qi % order.length) + 1) + ' of ' + order.length));
        root.appendChild(h('p', { style: { 'font-weight': '700', 'font-size': '1.05rem', margin: '0 0 14px' } }, Q.q));
        var fbox = h('div', { 'aria-live': 'polite' });
        var tiles = h('div', { style: { display: 'grid', gap: '10px', 'grid-template-columns': 'repeat(auto-fit, minmax(150px, 1fr))' } });
        Object.keys(PERSP).forEach(function (k) {
          var P = PERSP[k];
          var b = h('button', { type: 'button', class: 'btn ghost', 'aria-pressed': chosenP === k ? 'true' : 'false',
            style: { display: 'block', 'text-align': 'left', height: 'auto', padding: '14px', 'white-space': 'normal', 'border-color': chosenP === k ? 'var(--accent)' : '' },
            onclick: function () {
              if (stage !== 'persp') return;
              if (k === Q.p) {
                chosenP = k; stage = 'dia';
                draw(); setFb(root.querySelector('[aria-live]'), 'ok', 'Right perspective: ' + P.name.toLowerCase() + '. Now choose the diagram you would draw.');
              } else {
                RE.motion.shake(b);
                setFb(fbox, 'bad', 'Not the ' + P.name.toLowerCase() + ' view: ' + P.desc + ' This question needs the ' + PERSP[Q.p].name.toLowerCase() + ' view.');
              }
            } }, h('strong', null, P.name), h('div', { class: 'viz-note', style: { margin: '4px 0 0' } }, P.desc), h('div', { class: 'hand', style: { color: 'var(--accent-ink)', 'margin-top': '6px' } }, 'Typical: ' + P.typical));
          tiles.appendChild(b);
        });
        root.appendChild(tiles);
        if (stage === 'dia') {
          root.appendChild(h('p', { class: 'viz-note', style: { 'margin-top': '14px' } }, 'Which diagram answers it?'));
          var row = h('div', { class: 'viz-actions', style: { 'margin-top': 0 } });
          PERSP[chosenP].dia.forEach(function (d) {
            row.appendChild(h('button', { type: 'button', class: 'chip', onclick: function () {
              if (d === Q.d) {
                setFb(fbox, 'ok', d + ' diagram. ' + Q.why);
                stage = 'done'; RE.$$('.chip', row).forEach(function (c) { c.disabled = true; });
                this.setAttribute('aria-pressed', 'true');
                nextBtn.hidden = false;
              } else { RE.motion.shake(this); setFb(fbox, 'bad', 'A ' + d.toLowerCase() + ' diagram would not answer this directly. Think about what the question asks for. ' + Q.why.split('.')[0].replace(/^(It|Message order|Stored things|Life-cycle changes|Step-by-step flow|The boundary)/, '$1') + '.'); }
            } }, d));
          });
          root.appendChild(row);
        }
        root.appendChild(fbox);
        var nextBtn = h('button', { type: 'button', class: 'btn primary small', hidden: stage !== 'done', onclick: function () { qi++; stage = 'persp'; chosenP = null; draw(); } }, 'Next question', RE.icon('next'));
        root.appendChild(h('div', { class: 'viz-actions' }, nextBtn, h('button', { type: 'button', class: 'btn small', onclick: function () { order = RE.shuffle(QUESTIONS); qi = 0; stage = 'persp'; chosenP = null; draw(); } }, RE.icon('shuffle'), 'Shuffle')));
      }
      draw();
    }
  });

  /* ================= USE CASE ================= */
  var UCP = {
    instapay: {
      label: 'InstaPay', W: 770, H: 500, bx: 140, by: 15, bw: 500, bh: 475, title: 'InstaPay app',
      actors: [
        { id: 'cust', label: 'Customer', x: 60, y: 235, side: 'L' },
        { id: 'bank', label: 'Bank System', x: 710, y: 215, side: 'R' }
      ],
      ucs: [
        { id: 'login', label: 'Login', x: 270, y: 60 },
        { id: 'bal', label: 'Check balance', x: 270, y: 130 },
        { id: 'xfer', label: 'Transfer money', x: 270, y: 225 },
        { id: 'pin', label: 'Verify PIN', x: 510, y: 150 },
        { id: 'insuf', label: 'Show insufficient funds', x: 510, y: 225 },
        { id: 'fav', label: 'Add favourite', x: 510, y: 295 },
        { id: 'bills', label: 'Pay bills', x: 270, y: 395 },
        { id: 'elec', label: 'Pay electricity', x: 510, y: 380 },
        { id: 'mob', label: 'Pay mobile', x: 510, y: 440 }
      ],
      links: [
        { t: 'assoc', a: 'cust', b: 'login' }, { t: 'assoc', a: 'cust', b: 'bal' }, { t: 'assoc', a: 'cust', b: 'xfer' }, { t: 'assoc', a: 'cust', b: 'bills' },
        { t: 'assoc', a: 'bank', b: 'xfer' }, { t: 'assoc', a: 'bank', b: 'bills' },
        { t: 'include', a: 'xfer', b: 'pin' },
        { t: 'extend', a: 'insuf', b: 'xfer' }, { t: 'extend', a: 'fav', b: 'xfer' },
        { t: 'gen', a: 'elec', b: 'bills' }, { t: 'gen', a: 'mob', b: 'bills' }
      ],
      quiz: [
        ['The <<include>> arrow points from Transfer money to Verify PIN.', true, 'Include arrows run from the base use case to the included one, because the base always needs the included behaviour.'],
        ['The <<extend>> arrow points from Transfer money to Show insufficient funds.', false, 'Extend arrows run from the extending use case to the base: Show insufficient funds points to Transfer money, because it adds optional behaviour to it.'],
        ['Bank System is a secondary actor, so it is drawn on the right.', true, 'Primary actors that start the interaction go on the left; secondary actors that support the system go on the right.'],
        ['Generalization is drawn as a dashed line with an open arrowhead.', false, 'Generalization is a solid line with a hollow triangle at the general (parent) end. Dashed open arrows are for include and extend.']
      ]
    },
    library: {
      label: 'Library', W: 770, H: 590, bx: 135, by: 10, bw: 505, bh: 570, title: 'University library app',
      actors: [
        { id: 'lib', label: 'Librarian', x: 60, y: 225, side: 'L' },
        { id: 'head', label: 'Head Librarian', x: 60, y: 440, side: 'L' },
        { id: 'pay', label: 'Payment terminal', x: 710, y: 360, side: 'R' }
      ],
      ucs: [
        { id: 'login', label: 'Log in', x: 245, y: 50 },
        { id: 'manage', label: 'Manage catalog', x: 245, y: 150 },
        { id: 'add', label: 'Add book', x: 410, y: 110 },
        { id: 'isbn', label: 'Check ISBN', x: 565, y: 70 },
        { id: 'rem', label: 'Remove book', x: 410, y: 195 },
        { id: 'issue', label: 'Issue book', x: 245, y: 285 },
        { id: 'active', label: 'Check member active', x: 530, y: 285 },
        { id: 'ret', label: 'Receive return', x: 245, y: 375 },
        { id: 'fine', label: 'Collect fine', x: 500, y: 375 },
        { id: 'rep', label: 'Generate loan report', x: 245, y: 465 },
        { id: 'pdf', label: 'Export PDF', x: 500, y: 465 },
        { id: 'appr', label: 'Approve removal', x: 245, y: 540 }
      ],
      links: [
        { t: 'assoc', a: 'lib', b: 'login' }, { t: 'assoc', a: 'lib', b: 'manage' }, { t: 'assoc', a: 'lib', b: 'issue' }, { t: 'assoc', a: 'lib', b: 'ret' }, { t: 'assoc', a: 'lib', b: 'rep' },
        { t: 'gen', a: 'head', b: 'lib' },
        { t: 'assoc', a: 'head', b: 'appr' },
        { t: 'gen', a: 'add', b: 'manage' }, { t: 'gen', a: 'rem', b: 'manage' },
        { t: 'include', a: 'add', b: 'isbn' },
        { t: 'include', a: 'issue', b: 'active' },
        { t: 'extend', a: 'fine', b: 'ret' }, { t: 'extend', a: 'pdf', b: 'rep' },
        { t: 'assoc', a: 'pay', b: 'fine' }
      ],
      quiz: [
        ['Head Librarian inherits everything Librarian can do: the generalization arrow points to Librarian.', true, 'The hollow triangle sits at the general actor, so Head Librarian is a specialised Librarian that also gets Approve removal.'],
        ['Check ISBN extends Add book.', false, 'Checking the ISBN is mandatory every time a book is added, so it is an <<include>> from Add book to Check ISBN, not an extension.'],
        ['Collect fine is optional (only when a return is late), so its <<extend>> arrow points from Collect fine to Receive return.', true, 'Optional, conditional behaviour is an extension, and the arrow starts at the extending use case.'],
        ['Payment terminal is a primary actor because it triggers Collect fine.', false, 'It only supports the system by taking payment. Secondary (supporting) actors sit on the right side of the boundary.']
      ]
    }
  };
  var REL_TEXT = {
    assoc: { name: 'Association', how: 'A solid line between an actor and a use case: this actor takes part in this use case.' },
    include: { name: '<<include>>', how: 'Dashed open arrow from the BASE use case TO the included one. The included behaviour is mandatory: the base cannot finish without it.' },
    extend: { name: '<<extend>>', how: 'Dashed open arrow from the EXTENDING use case TO the base. It adds optional behaviour, only under a condition.' },
    gen: { name: 'Generalization', how: 'Solid line with a hollow triangle at the general (parent) end. The child specialises and inherits from the parent. It works for actors and for use cases.' }
  };

  RE.visual('usecase', {
    title: 'Use case diagram',
    hint: 'Highlight relationship types and spot the errors',
    blueprint: true,
    render: function (body, preset) {
      var pk = UCP[preset] ? preset : (RE.store.get('viz:usecase:p', 'instapay'));
      if (!UCP[pk]) pk = 'instapay';
      var root = h('div'); body.appendChild(root);
      var filter = 'all';

      function ellipseDims(u) {
        var lines = splitLabel(u.label);
        var mx = Math.max.apply(null, lines.map(function (l) { return l.length; }));
        return { lines: lines, rx: Math.max(52, mx * 3.5 + 20), ry: lines.length > 1 ? 27 : 23 };
      }
      function splitLabel(t) {
        if (t.length <= 14 || t.indexOf(' ') < 0) return [t];
        var words = t.split(' '), best = 0, bd = 1e9;
        for (var i = 1; i < words.length; i++) {
          var d = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length);
          if (d < bd) { bd = d; best = i; }
        }
        return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
      }
      function edgePt(n, tx, ty) {
        var dx = tx - n.x, dy = ty - n.y, k = 1 / Math.sqrt((dx / n.rx) * (dx / n.rx) + (dy / n.ry) * (dy / n.ry));
        return { x: n.x + dx * k, y: n.y + dy * k };
      }

      function build() {
        root.innerHTML = '';
        filter = 'all';
        var P = UCP[pk];
        root.appendChild(seg('Example', Object.keys(UCP).map(function (k) { return [k, UCP[k].label]; }), pk, function (k) { pk = k; RE.store.set('viz:usecase:p', k); build(); }));
        var nodes = {};
        P.actors.forEach(function (a) { nodes[a.id] = { x: a.x, y: a.y, rx: 18, ry: 40, actor: a }; });
        P.ucs.forEach(function (u) { var d = ellipseDims(u); nodes[u.id] = { x: u.x, y: u.y, rx: d.rx, ry: d.ry, uc: u, lines: d.lines }; });

        var s = svg('svg', { viewBox: '0 0 ' + P.W + ' ' + P.H, role: 'img', 'aria-label': 'Use case diagram: ' + P.title });
        var defs = svg('defs'); s.appendChild(defs);
        var mOpen = uid('uc-open'), mTri = uid('uc-tri');
        marker(defs, mOpen, 'open'); marker(defs, mTri, 'tri');
        s.appendChild(svg('rect', { x: P.bx, y: P.by, width: P.bw, height: P.bh, rx: 6, style: 'fill:var(--sheet);stroke:var(--ink);stroke-width:2' }));
        s.appendChild(T(P.bx + 12, P.by + 20, P.title + ' (system boundary)', { a: 'start', c: 'hand', s: 14, st: 'fill:var(--ink-2)' }));

        var info = h('div', { class: 'feedback info', 'aria-live': 'polite' }, RE.icon('info'), h('div', null, 'Click any actor, use case or line to read what it means, or pick a relationship below.'));
        function explain(title, text) { info.innerHTML = ''; info.appendChild(RE.icon('info')); info.appendChild(h('div', null, h('strong', null, title), h('div', null, text))); }

        var edgeEls = [];
        P.links.forEach(function (l) {
          var A = nodes[l.a], B = nodes[l.b];
          var p1 = edgePt(A, B.x, B.y), p2 = edgePt(B, A.x, A.y);
          var g = svg('g', { tabindex: '0', role: 'button', 'aria-label': REL_TEXT[l.t].name + ' between ' + (A.actor || A.uc).label + ' and ' + (B.actor || B.uc).label, style: 'cursor:pointer' });
          var dashed = l.t === 'include' || l.t === 'extend';
          var ln = svg('line', { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, style: 'fill:none;stroke:var(--ink);stroke-width:1.6' + (dashed ? ';stroke-dasharray:6 4' : '') });
          if (dashed) ln.setAttribute('marker-end', 'url(#' + mOpen + ')');
          if (l.t === 'gen') ln.setAttribute('marker-end', 'url(#' + mTri + ')');
          g.appendChild(svg('line', { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, style: 'stroke:transparent;stroke-width:14;fill:none' }));
          g.appendChild(ln);
          if (dashed) {
            var mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
            var lab = T(mx, my - 5, l.t === 'include' ? '«include»' : '«extend»', { s: 12, c: 'hand', st: 'fill:var(--ink);stroke:var(--sheet);stroke-width:4px;paint-order:stroke' });
            g.appendChild(lab);
          }
          var from = (A.actor || A.uc).label, to = (B.actor || B.uc).label;
          activate(g, function () {
            var extra = {
              assoc: from + ' is connected to ' + to + ': the actor takes part in that use case.',
              include: from + ' always includes ' + to + '. The arrow starts at the base (' + from + ') and points to the included use case (' + to + ').',
              extend: from + ' optionally extends ' + to + ' under some condition. The arrow starts at the extending use case (' + from + ') and points to the base (' + to + ').',
              gen: from + ' is a specialisation of ' + to + ': it inherits what ' + to + ' does and may add more. The hollow triangle touches the parent (' + to + ').'
            }[l.t];
            explain(REL_TEXT[l.t].name, extra);
          });
          edgeEls.push({ g: g, t: l.t }); s.appendChild(g);
        });
        P.actors.forEach(function (a) {
          var g = svg('g', { tabindex: '0', role: 'button', 'aria-label': 'Actor ' + a.label, style: 'cursor:pointer' });
          var st = 'fill:var(--sheet);stroke:var(--ink);stroke-width:2';
          g.appendChild(svg('rect', { x: a.x - 40, y: a.y - 44, width: 80, height: 100, style: 'fill:transparent;stroke:none' }));
          g.appendChild(svg('circle', { cx: a.x, cy: a.y - 30, r: 9, style: st }));
          g.appendChild(svg('path', { d: 'M' + a.x + ' ' + (a.y - 21) + ' V' + (a.y + 10) + ' M' + (a.x - 17) + ' ' + (a.y - 8) + ' H' + (a.x + 17) + ' M' + a.x + ' ' + (a.y + 10) + ' L' + (a.x - 14) + ' ' + (a.y + 34) + ' M' + a.x + ' ' + (a.y + 10) + ' L' + (a.x + 14) + ' ' + (a.y + 34), style: 'fill:none;stroke:var(--ink);stroke-width:2;stroke-linecap:round' }));
          g.appendChild(T(a.x, a.y + 54, a.label, { s: 13, w: 700 }));
          activate(g, function () {
            var who = a.side === 'L' ? 'a primary actor (starts the interaction), drawn on the left.' : 'a secondary actor (supports the system), drawn on the right.';
            var more = a.id === 'head' ? ' It inherits all Librarian use cases through generalization and also gets Approve removal.' : '';
            explain(a.label, a.label + ' is ' + who + more);
          });
          s.appendChild(g);
        });
        var ucEls = [];
        P.ucs.forEach(function (u) {
          var n = nodes[u.id];
          var g = svg('g', { tabindex: '0', role: 'button', 'aria-label': 'Use case ' + u.label, style: 'cursor:pointer' });
          g.appendChild(svg('ellipse', { cx: n.x, cy: n.y, rx: n.rx, ry: n.ry, style: 'fill:var(--accent-wash);stroke:var(--ink);stroke-width:1.8' }));
          n.lines.forEach(function (ln, i) { g.appendChild(T(n.x, n.y + 5 + (i - (n.lines.length - 1) / 2) * 15, ln, { s: 13 })); });
          activate(g, function () {
            var rels = P.links.filter(function (l) { return l.a === u.id || l.b === u.id; }).map(function (l) {
              var other = l.a === u.id ? l.b : l.a;
              var nm = (nodes[other].actor || nodes[other].uc).label;
              if (l.t === 'assoc') return 'connected to ' + nm;
              if (l.t === 'include') return l.a === u.id ? 'includes ' + nm : 'is included by ' + nm;
              if (l.t === 'extend') return l.a === u.id ? 'extends ' + nm : 'is extended by ' + nm;
              return l.a === u.id ? 'specialises ' + nm : 'is generalised by ' + nm;
            });
            explain(u.label, 'A use case is a goal-sized piece of functionality (an ellipse inside the boundary). ' + (rels.length ? u.label + ': ' + rels.join('; ') + '.' : ''));
          });
          ucEls.push(g); s.appendChild(g);
        });
        root.appendChild(h('div', { class: 'viz-scroll', style: { 'margin-top': '14px' } }, s));

        /* toolbar */
        var bar = h('div', { class: 'viz-actions', style: { 'margin-top': '12px' }, role: 'group', 'aria-label': 'Highlight relationship' });
        function setFilter(f) {
          filter = f;
          RE.$$('button', bar).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-f') === f ? 'true' : 'false'); });
          edgeEls.forEach(function (e) {
            var on = f === 'all' || e.t === f;
            e.g.style.opacity = on ? '1' : '0.15';
            RE.$$('line', e.g).forEach(function (l) { if (l.getAttribute('style').indexOf('transparent') < 0) l.style.stroke = (f !== 'all' && on) ? 'var(--accent)' : 'var(--ink)'; if (l.getAttribute('style').indexOf('transparent') < 0) l.style.strokeWidth = (f !== 'all' && on) ? '3' : '1.6'; });
          });
          if (f === 'all') explain('All relationships', 'Association links actors to goals. <<include>> and <<extend>> link use cases to use cases. Generalization links actors to actors or use cases to use cases.');
          else explain(REL_TEXT[f].name, REL_TEXT[f].how);
        }
        [['all', 'All'], ['assoc', 'Association'], ['include', '«include»'], ['extend', '«extend»'], ['gen', 'Generalization']].forEach(function (o) {
          var b = h('button', { type: 'button', class: 'chip', 'data-f': o[0], 'aria-pressed': o[0] === 'all' ? 'true' : 'false', onclick: function () { setFilter(o[0]); } }, o[1]);
          bar.appendChild(b);
        });
        root.appendChild(bar);
        root.appendChild(info);

        /* spot the error */
        root.appendChild(h('h4', { style: { margin: '22px 0 4px' } }, 'Spot the error'));
        root.appendChild(h('p', { class: 'viz-note', style: { 'margin-top': 0 } }, 'Is each statement about this diagram true or false?'));
        var qwrap = h('div', { style: { display: 'grid', gap: '10px' } });
        var scoreEl = h('span', { class: 'num viz-note', style: { margin: 0 } });
        var correct = 0, answered = 0;
        P.quiz.forEach(function (q) {
          var fbox = h('div', { 'aria-live': 'polite' });
          var row = h('div', { class: 'viz-actions', style: { margin: '6px 0 0' } });
          [true, false].forEach(function (val) {
            row.appendChild(h('button', { type: 'button', class: 'chip', onclick: function () {
              if (row.getAttribute('data-done')) return;
              row.setAttribute('data-done', '1');
              this.setAttribute('aria-pressed', 'true');
              answered++;
              var ok = val === q[1];
              if (ok) correct++;
              scoreEl.textContent = correct + ' / ' + P.quiz.length + ' correct';
              setFb(fbox, ok ? 'ok' : 'bad', (ok ? 'Correct. ' : 'Not quite. This is ' + (q[1] ? 'true' : 'false') + '. ') + q[2]);
              if (!ok) RE.motion.shake(this);
            } }, val ? 'True' : 'False'));
          });
          qwrap.appendChild(h('div', { style: { padding: '12px 14px', border: '1px solid var(--rule)', 'border-radius': '10px', background: 'var(--sheet)' } },
            h('div', null, q[0].replace(/<<(\w+)>>/g, '«$1»')), row, fbox));
        });
        root.appendChild(qwrap);
        root.appendChild(h('div', { class: 'viz-actions' }, h('button', { type: 'button', class: 'btn small', onclick: build }, RE.icon('reset'), 'Reset'), scoreEl));
        setFilter('all');
      }
      build();
    }
  });

  /* ================= SEQUENCE ================= */
  RE.visual('sequence', {
    title: 'Sequence diagram: transfer',
    hint: 'Step through the messages in time order',
    blueprint: true,
    render: function (body) {
      var LX = { cust: 70, ui: 225, acc: 395, db: 560, rec: 705 };
      var HEAD = { cust: 'Customer', ui: 'App UI', acc: 'Account service', db: 'Bank DB', rec: 'Receipt' };
      var STEPS = [
        { id: 0, from: 'cust', to: 'ui', kind: 'sync', label: 'submitTransfer(amount, payee)', y: 112, cap: 'The Customer (an actor) asks the App UI to make a transfer. A synchronous call: solid line, filled arrowhead; the sender waits.' },
        { id: 1, from: 'ui', to: 'acc', kind: 'sync', label: 'transfer(amount, payee)', y: 154, cap: 'The UI forwards the request to the Account service. A thin activation bar shows when each part is busy.' },
        { id: 2, from: 'acc', to: 'db', kind: 'sync', label: 'getBalance(account)', y: 196, cap: 'The Account service needs the balance, so it calls the Bank DB synchronously and waits.' },
        { id: 3, from: 'db', to: 'acc', kind: 'return', label: 'balance', y: 238, cap: 'The reply comes back as a return message: dashed line, open arrowhead.' },
        { id: 4, from: 'acc', to: 'db', kind: 'sync', label: 'debit(amount)', y: 306, branch: 'ok', cap: 'Inside the alt frame, the guard [sufficient funds] is true, so the first branch runs: the money is debited.' },
        { id: 5, from: 'acc', to: 'rec', kind: 'create', label: '«create»', y: 348, branch: 'ok', cap: 'A create message (dashed, open arrowhead) brings a new Receipt object into existence. Its box is drawn at that height, not at the top.' },
        { id: 6, from: 'acc', to: 'db', kind: 'async', label: 'log(transaction)', y: 390, branch: 'ok', cap: 'An asynchronous message: solid line, open arrowhead. The sender does not wait for an answer.' },
        { id: 7, from: 'acc', to: 'ui', kind: 'return', label: 'confirmation', y: 432, branch: 'ok', cap: 'The service returns a confirmation to the UI.' },
        { id: 8, from: 'acc', to: 'ui', kind: 'return', label: 'insufficientFunds', y: 510, branch: 'else', cap: 'The guard [sufficient funds] is false, so the [else] branch runs: no debit, no receipt, only an error is returned.' },
        { id: 9, from: 'ui', to: 'cust', kind: 'return', label: 'showResult()', y: 552, cap: 'After the alt frame, the UI shows the outcome to the Customer. Both branches end here.' }
      ];
      var branch = 'ok', cur = -1, timer = null;
      var root = h('div'); body.appendChild(root);
      var holder = h('div', { class: 'viz-scroll', style: { 'margin-top': '14px' } });
      var cap = h('div', { class: 'feedback info', 'aria-live': 'polite' }, RE.icon('info'), h('div', null, 'Press Next to reveal the first message.'));
      function path() { return STEPS.filter(function (s) { return !s.branch || s.branch === branch; }); }
      function stop() { if (timer) { clearInterval(timer); timer = null; } playBtn.innerHTML = ''; playBtn.appendChild(RE.icon('play')); playBtn.appendChild(document.createTextNode('Play')); }
      function go(i) {
        var p = path(); cur = Math.max(-1, Math.min(p.length - 1, i));
        draw();
        cap.innerHTML = ''; cap.appendChild(RE.icon('info'));
        cap.appendChild(h('div', null, cur < 0 ? 'Press Next to reveal the first message.' : h('span', null, h('strong', null, 'Step ' + (cur + 1) + ' of ' + p.length + '. '), p[cur].cap)));
        prevBtn.disabled = cur < 0; nextBtn.disabled = cur >= p.length - 1;
        if (cur >= p.length - 1) stop();
      }
      function draw() {
        holder.innerHTML = '';
        var p = path();
        var shown = {}; p.forEach(function (s, i) { if (i <= cur) shown[s.id] = true; });
        var s = svg('svg', { viewBox: '0 0 780 600', role: 'img', 'aria-label': 'Sequence diagram of a banking transfer' });
        var defs = svg('defs'); s.appendChild(defs);
        var mF = uid('sq-f'), mO = uid('sq-o');
        marker(defs, mF, 'filled'); marker(defs, mO, 'open');
        var created = shown[5] || (branch === 'ok' && cur >= p.indexOf(STEPS[5]));
        Object.keys(LX).forEach(function (k) {
          var x = LX[k], y0 = 24, top = 24;
          if (k === 'rec') { if (!shown[5]) return; top = 332; }
          if (k === 'cust') {
            s.appendChild(svg('circle', { cx: x, cy: 36, r: 8, style: 'fill:var(--sheet);stroke:var(--ink);stroke-width:2' }));
            s.appendChild(svg('path', { d: 'M' + x + ' 44 V64 M' + (x - 14) + ' 52 H' + (x + 14) + ' M' + x + ' 64 L' + (x - 11) + ' 80 M' + x + ' 64 L' + (x + 11) + ' 80', style: 'fill:none;stroke:var(--ink);stroke-width:2;stroke-linecap:round' }));
            s.appendChild(T(x, 98, HEAD[k], { w: 700 }));
            s.appendChild(svg('line', { x1: x, y1: 104, x2: x, y2: 580, style: 'stroke:var(--ink-3);stroke-width:1.5;stroke-dasharray:7 5' }));
          } else {
            s.appendChild(svg('rect', { x: x - 58, y: top, width: 116, height: 32, rx: 4, style: 'fill:var(--accent-wash);stroke:var(--ink);stroke-width:1.8' }));
            s.appendChild(T(x, top + 21, HEAD[k], { w: 700 }));
            s.appendChild(svg('line', { x1: x, y1: top + 32, x2: x, y2: 580, style: 'stroke:var(--ink-3);stroke-width:1.5;stroke-dasharray:7 5' }));
          }
        });
        /* activation bars */
        function bar(k, y1, y2, need) {
          if (!need) return;
          if (k === 'rec' && !shown[5]) return;
          s.appendChild(svg('rect', { x: LX[k] - 5, y: y1, width: 10, height: y2 - y1, style: 'fill:var(--sheet);stroke:var(--ink);stroke-width:1.6' }));
        }
        var last = p[Math.max(cur, 0)];
        bar('ui', 104, 558, shown[0]);
        bar('acc', 148, shown[7] ? 438 : (shown[8] ? 516 : (cur >= 0 ? Math.max(238 + 10, last && last.y + 8) : 238)), shown[1]);
        bar('db', 190, 244, shown[2]);
        bar('db', 300, 312, shown[4]);
        bar('db', 384, 396, shown[6]);
        bar('rec', 340, 358, shown[5]);
        /* alt frame */
        var altShown = shown[4] || shown[8] || (cur >= 0 && p.some(function (q, i) { return i <= cur && q.branch; }));
        if (altShown) {
          s.appendChild(svg('rect', { x: 150, y: 262, width: 590, height: 262, style: 'fill:none;stroke:var(--ink);stroke-width:1.6' }));
          s.appendChild(svg('path', { d: 'M150 262 H198 V274 L190 282 H150 Z', style: 'fill:var(--sheet);stroke:var(--ink);stroke-width:1.6' }));
          s.appendChild(T(158, 276, 'alt', { a: 'start', w: 700, s: 12 }));
          s.appendChild(T(214, 280, '[sufficient funds]', { a: 'start', c: 'hand', s: 13, st: 'fill:' + (branch === 'ok' ? 'var(--green)' : 'var(--ink-3)') }));
          s.appendChild(svg('line', { x1: 150, y1: 466, x2: 740, y2: 466, style: 'stroke:var(--ink);stroke-width:1.4;stroke-dasharray:8 5' }));
          s.appendChild(T(158, 484, '[else]', { a: 'start', c: 'hand', s: 13, st: 'fill:' + (branch === 'else' ? 'var(--red)' : 'var(--ink-3)') }));
        }
        /* messages */
        STEPS.forEach(function (m) {
          var onPath = !m.branch || m.branch === branch;
          var vis = shown[m.id];
          var ghost = !vis && altShown && m.branch && !onPath;
          if (!vis && !ghost) return;
          var dir = LX[m.to] > LX[m.from] ? 1 : -1;
          var x1 = LX[m.from] + dir * 6, x2 = LX[m.to] - dir * 6;
          if (m.kind === 'create') x2 = LX[m.to] - dir * 58;
          if (m.from === 'cust') x1 = LX.cust + 4; if (m.to === 'cust') x2 = LX.cust + 6;
          var g = svg('g', { style: 'opacity:' + (ghost ? '0.22' : '1') });
          var dashed = m.kind === 'return' || m.kind === 'create';
          var ln = svg('line', { x1: x1, y1: m.y, x2: x2, y2: m.y, style: 'fill:none;stroke:var(--ink);stroke-width:1.8' + (dashed ? ';stroke-dasharray:6 4' : '') });
          ln.setAttribute('marker-end', 'url(#' + (m.kind === 'sync' ? mF : mO) + ')');
          g.appendChild(ln);
          g.appendChild(T((x1 + x2) / 2, m.y - 7, m.label, { s: 13, c: 'hand', st: 'fill:var(--ink);stroke:var(--sheet);stroke-width:4px;paint-order:stroke' }));
          if (vis && m.id === p[cur].id) RE.motion.enter(g, { y: 0, duration: 380 });
          s.appendChild(g);
        });
        holder.appendChild(s);
      }
      var prevBtn = h('button', { type: 'button', class: 'btn small', onclick: function () { stop(); go(cur - 1); } }, RE.icon('prev'), 'Prev');
      var nextBtn = h('button', { type: 'button', class: 'btn small primary', onclick: function () { stop(); go(cur + 1); } }, 'Next', RE.icon('next'));
      var playBtn = h('button', { type: 'button', class: 'btn small', onclick: function () {
        if (timer) { stop(); return; }
        if (cur >= path().length - 1) go(-1);
        playBtn.innerHTML = ''; playBtn.appendChild(RE.icon('x')); playBtn.appendChild(document.createTextNode('Pause'));
        timer = setInterval(function () { go(cur + 1); }, 1800);
        go(cur + 1);
      } }, RE.icon('play'), 'Play');
      var resetBtn = h('button', { type: 'button', class: 'btn small', onclick: function () { stop(); go(-1); } }, RE.icon('reset'), 'Reset');
      root.appendChild(h('div', { style: { display: 'flex', gap: '12px', 'flex-wrap': 'wrap', 'align-items': 'center' } },
        h('span', { class: 'viz-note', style: { margin: 0 } }, 'Alt branch:'),
        seg('Alt branch outcome', [['ok', 'Sufficient funds'], ['else', 'Insufficient funds']], branch, function (v) { stop(); branch = v; go(-1); })));
      root.appendChild(holder);
      root.appendChild(h('div', { class: 'viz-actions' }, prevBtn, nextBtn, playBtn, resetBtn));
      root.appendChild(cap);
      go(-1);
      var obs = new MutationObserver(function () { if (!document.body.contains(root)) { stop(); obs.disconnect(); } });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  });

  /* ================= CLASS DIAGRAM ================= */
  RE.visual('class-diagram', {
    title: 'Class diagram',
    hint: 'Visibility, multiplicity, aggregation vs composition',
    blueprint: true,
    render: function (body) {
      var CL = {
        user: { x: 270, y: 10, w: 210, name: 'User', abs: true, attrs: [['-', 'id: int'], ['+', 'name: String'], ['#', 'email: String']], ops: [['+', 'login(): void'], ['~', 'resetStats(): void']] },
        cust: { x: 20, y: 205, w: 210, name: 'Customer', attrs: [['-', 'address: String'], ['+', 'loyaltyPoints: int']], ops: [['+', 'placeOrder(): Order']] },
        admin: { x: 520, y: 205, w: 210, name: 'Admin', attrs: [['#', 'permissions: String[]']], ops: [['+', 'banUser(u: User): void']] },
        order: { x: 20, y: 365, w: 210, name: 'Order', attrs: [['-', 'orderId: int'], ['+', 'date: Date']], ops: [['+', 'total(): double']] },
        line: { x: 270, y: 365, w: 210, name: 'OrderLine', attrs: [['-', 'quantity: int'], ['-', 'price: double']], ops: [['+', 'subtotal(): double']] },
        cart: { x: 520, y: 365, w: 210, name: 'Cart', attrs: [['-', 'createdAt: Date']], ops: [['+', 'add(p: Product): void']] },
        prod: { x: 520, y: 510, w: 210, name: 'Product', attrs: [['+', 'sku: String'], ['+', 'price: double']], ops: [] }
      };
      var RH = 19, HH = 30;
      Object.keys(CL).forEach(function (k) {
        var c = CL[k]; c.hA = Math.max(1, c.attrs.length) * RH + 8; c.hO = Math.max(1, c.ops.length) * RH + 8; c.h = HH + c.hA + c.hO;
        if (!c.ops.length) c.hO = 8, c.h = HH + c.hA + c.hO;
      });
      var root = h('div'); body.appendChild(root);
      var visSel = 'all', gens = {};
      var info = h('div', { class: 'feedback info', 'aria-live': 'polite' }, RE.icon('info'), h('div', null, 'Choose a visibility symbol, click a multiplicity label to read it, or try the delete buttons.'));
      function explain(t, x) { info.innerHTML = ''; info.appendChild(RE.icon('info')); info.appendChild(h('div', null, h('strong', null, t), h('div', null, x))); }

      var s = svg('svg', { viewBox: '0 0 760 630', role: 'img', 'aria-label': 'Class diagram with User, Customer, Admin, Order, OrderLine, Cart and Product' });
      var defs = svg('defs'); s.appendChild(defs);
      var mTri = uid('cd-tri'), mDiaF = uid('cd-df'), mDiaH = uid('cd-dh');
      marker(defs, mTri, 'tri'); marker(defs, mDiaF, 'dia-filled'); marker(defs, mDiaH, 'dia-hollow');
      var rows = [], boxes = {}, rels = {};

      function line(x1, y1, x2, y2, extra) { return svg('line', { x1: x1, y1: y1, x2: x2, y2: y2, style: 'fill:none;stroke:var(--ink);stroke-width:1.8' + (extra || '') }); }
      /* relationships first (under boxes) */
      var gU = svg('g'); s.appendChild(gU);
      var path1 = svg('path', { d: 'M125 205 V175 H375 V' + (CL.user.y + CL.user.h + 1), style: 'fill:none;stroke:var(--ink);stroke-width:1.8' }); path1.setAttribute('marker-end', 'url(#' + mTri + ')');
      var path2 = svg('path', { d: 'M625 205 V175 H375', style: 'fill:none;stroke:var(--ink);stroke-width:1.8' });
      gU.appendChild(path1); gU.appendChild(path2);
      var rCO = svg('g'); rCO.appendChild(line(125, CL.cust.y + CL.cust.h, 125, 365));
      var rOL = svg('g'); var lnOL = line(250, 412, 270, 412); lnOL.setAttribute('x1', 250);
      var rCP = svg('g');
      s.appendChild(rCO); s.appendChild(rOL); s.appendChild(rCP);
      /* composition: filled diamond at Order, line to OrderLine */
      var olLine = line(230, 412, 270, 412); olLine.setAttribute('marker-start', 'url(#' + mDiaF + ')'); rOL.appendChild(olLine);
      /* aggregation: hollow diamond at Cart, line to Product */
      var cpLine = line(625, CL.cart.y + CL.cart.h, 625, 510); cpLine.setAttribute('marker-start', 'url(#' + mDiaH + ')');
      /* vertical lines: markers start at the owner's edge, so draw from owner downward */
      rCP.appendChild(cpLine);
      var mult = {
        co1: [135, CL.cust.y + CL.cust.h + 18, '1', 'Each order belongs to exactly one customer.'],
        co2: [135, 358, '0..*', 'One customer has zero or more orders.'],
        ol1: [236, 404, '1', 'Each order line belongs to exactly one order (and cannot exist without it).'],
        ol2: [246, 432, '1..*', 'One order has one or more order lines.'],
        cp1: [635, CL.cart.y + CL.cart.h + 18, '1', 'Each product entry is held by one cart at a time here, but the product itself exists independently.'],
        cp2: [635, 502, '0..*', 'One cart holds zero or more products.']
      };
      var multEls = {};
      Object.keys(mult).forEach(function (k) {
        var m = mult[k];
        var g = svg('g', { tabindex: '0', role: 'button', 'aria-label': 'Multiplicity ' + m[2], style: 'cursor:pointer' });
        g.appendChild(svg('rect', { x: m[0] - 4, y: m[1] - 15, width: m[2].length * 8 + 10, height: 22, rx: 4, style: 'fill:var(--amber-wash);stroke:var(--amber);stroke-width:1' }));
        g.appendChild(T(m[0] + 1, m[1], m[2], { a: 'start', s: 13, w: 700 }));
        activate(g, function () { explain('Multiplicity ' + m[2], m[3]); });
        multEls[k] = g; s.appendChild(g);
      });
      /* association labels */
      /* class boxes */
      Object.keys(CL).forEach(function (k) {
        var c = CL[k], g = svg('g'); boxes[k] = g;
        g.appendChild(svg('rect', { x: c.x, y: c.y, width: c.w, height: c.h, style: 'fill:var(--sheet);stroke:var(--ink);stroke-width:2' }));
        g.appendChild(svg('rect', { x: c.x, y: c.y, width: c.w, height: HH, style: 'fill:var(--accent-wash);stroke:var(--ink);stroke-width:2' }));
        g.appendChild(T(c.x + c.w / 2, c.y + 20, c.name, { w: 700, s: 14, i: c.abs }));
        if (c.abs) g.appendChild(T(c.x + c.w / 2, c.y + 28, '', { s: 1 }));
        g.appendChild(svg('line', { x1: c.x, y1: c.y + HH + c.hA, x2: c.x + c.w, y2: c.y + HH + c.hA, style: 'stroke:var(--ink);stroke-width:1.5' }));
        function row(items, y0) {
          items.forEach(function (it, i) {
            var y = y0 + 4 + i * RH;
            var r = svg('rect', { x: c.x + 3, y: y, width: c.w - 6, height: RH, style: 'fill:transparent' });
            var tx = T(c.x + 10, y + 14, it[0] + ' ' + it[1], { a: 'start', s: 13 });
            g.appendChild(r); g.appendChild(tx); rows.push({ vis: it[0], r: r, t: tx });
          });
        }
        row(c.attrs, c.y + HH); row(c.ops, c.y + HH + c.hA);
        s.appendChild(g);
      });
      s.appendChild(T(375 + 56, 108, '', {}));
      s.appendChild(T(205, 196 - 76, '', {}));
      s.appendChild(T(325, 244, '', {}));
      /* names on relationships */
      s.appendChild(T(165, 340, 'places', { s: 12, c: 'hand', a: 'start', st: 'fill:var(--ink-2)' }));
      s.appendChild(T(690, 482, 'aggregation', { s: 12, c: 'hand', st: 'fill:var(--ink-2)' }));
      s.appendChild(T(490, 168, 'generalization', { s: 12, c: 'hand', a: 'start', st: 'fill:var(--ink-2)' }));
      var nodesDel = { order: [boxes.order, rCO, rOL, boxes.line, multEls.co1, multEls.co2, multEls.ol1, multEls.ol2], cart: [boxes.cart, rCP, multEls.cp1, multEls.cp2] };
      var legend = h('div', { class: 'viz-note', style: { margin: '10px 0 0' } }, '+ public    - private    # protected    ~ package    Italic name = abstract class');
      root.appendChild(h('div', { class: 'viz-scroll', style: { 'margin-top': '0' } }, s));
      root.appendChild(legend);

      /* visibility */
      function setVis(v) {
        visSel = v;
        RE.$$('button', visBar).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-v') === v ? 'true' : 'false'); });
        rows.forEach(function (r) {
          var on = v === 'all' || r.vis === v;
          r.r.style.fill = (v !== 'all' && on) ? 'var(--accent-wash)' : 'transparent';
          r.t.style.opacity = on ? '1' : '0.25';
        });
        var names = { '+': 'public: visible to every class.', '-': 'private: visible only inside its own class.', '#': 'protected: visible to the class and its subclasses.', '~': 'package: visible to classes in the same package.' };
        if (v !== 'all') explain('Visibility ' + v, 'Highlighted members are ' + names[v]);
      }
      var visBar = h('div', { class: 'viz-actions', role: 'group', 'aria-label': 'Highlight visibility' });
      visBar.appendChild(h('button', { type: 'button', class: 'chip', 'data-v': 'all', 'aria-pressed': 'true', onclick: function () { setVis('all'); } }, 'All'));
      ['+', '-', '#', '~'].forEach(function (v) { visBar.appendChild(h('button', { type: 'button', class: 'chip', 'data-v': v, 'aria-pressed': 'false', 'aria-label': 'Highlight ' + v, onclick: function () { setVis(v); } }, v)); });
      root.appendChild(h('div', { class: 'viz-note', style: { margin: '12px 0 0' } }, 'Highlight a visibility:'));
      root.appendChild(visBar);

      /* delete demo */
      var deleted = {};
      function fade(list, off) {
        list.forEach(function (n) {
          if (!n) return;
          n.style.transition = RE.motion.reduced() ? 'none' : 'opacity 500ms ease';
          n.style.opacity = off ? '0.12' : '1';
        });
      }
      function reset() {
        deleted = {}; fade(nodesDel.order, false); fade(nodesDel.cart, false); fade([boxes.prod], false);
        boxes.prod.firstChild.style.stroke = ''; boxes.line.firstChild.style.stroke = '';
        explain('Restored', 'All objects are back. Try deleting the Order, then the Cart, and compare.');
      }
      var demo = h('div', { class: 'viz-actions' },
        h('button', { type: 'button', class: 'btn small', onclick: function () {
          reset(); fade(nodesDel.order, true);
          explain('Composition: delete the Order', 'The Order owns its order lines (filled diamond), so when the Order is deleted its OrderLines are deleted with it. A part cannot outlive the whole.');
        } }, 'Delete the Order'),
        h('button', { type: 'button', class: 'btn small', onclick: function () {
          reset(); fade(nodesDel.cart, true);
          boxes.prod.firstChild.style.stroke = 'var(--green)'; boxes.prod.firstChild.style.strokeWidth = '3';
          explain('Aggregation: delete the Cart', 'The Cart only groups products (hollow diamond). Deleting the Cart leaves the Products untouched: they still exist and can sit in other carts.');
        } }, 'Delete the Cart'),
        h('button', { type: 'button', class: 'btn small', onclick: reset }, RE.icon('reset'), 'Restore'));
      root.appendChild(h('div', { class: 'viz-note', style: { margin: '12px 0 0' } }, 'Aggregation vs composition:'));
      root.appendChild(demo);
      root.appendChild(info);
      setVis('all');
    }
  });

  /* ================= STATE + ACTIVITY ================= */
  RE.visual('state-activity', {
    title: 'State machine and activity',
    hint: 'Fire events, or step a token through a flow',
    blueprint: true,
    render: function (body) {
      var tab = RE.store.get('viz:sa:tab', 'state');
      var root = h('div'); body.appendChild(root);
      var content = h('div');
      function show(t) { tab = t; RE.store.set('viz:sa:tab', t); content.innerHTML = ''; cleanup(); (t === 'state' ? buildState : buildAct)(content); }
      var cleanups = [];
      function cleanup() { cleanups.forEach(function (f) { f(); }); cleanups = []; }
      root.appendChild(seg('Diagram type', [['state', 'State machine'], ['act', 'Activity diagram']], tab, show));
      root.appendChild(content);

      /* ---------- state machine ---------- */
      function buildState(host) {
        var ST = {
          idle: { x: 40, y: 160, w: 130, h: 54, t: 'Idle' },
          card: { x: 250, y: 40, w: 150, h: 54, t: 'Card inserted' },
          auth: { x: 530, y: 160, w: 150, h: 54, t: 'Authenticated' },
          disp: { x: 250, y: 290, w: 150, h: 54, t: 'Dispensing' }
        };
        var EV = [
          { id: 'insert', label: 'insertCard' },
          { id: 'pinOk', label: 'enterPIN [valid]' },
          { id: 'pinBad', label: 'enterPIN [invalid]' },
          { id: 'wOk', label: 'withdraw [amount ≤ balance]' },
          { id: 'wBig', label: 'withdraw [amount > balance]' },
          { id: 'taken', label: 'cashTaken' },
          { id: 'cancel', label: 'cancel' }
        ];
        var cur = 'idle', tries = 0, hist = [];
        var s = svg('svg', { viewBox: '0 0 760 480', role: 'img', 'aria-label': 'ATM state machine' });
        var defs = svg('defs'); s.appendChild(defs);
        var mO = uid('st-o'); marker(defs, mO, 'open');
        var mF = uid('st-f'); marker(defs, mF, 'filled');
        var g = svg('g', { transform: 'translate(0,30)' }); s.appendChild(g);
        var edges = {};
        function edge(id, d, lx, ly, label, anchor) {
          var p = svg('path', { d: d, style: 'fill:none;stroke:var(--ink);stroke-width:1.8' }); p.setAttribute('marker-end', 'url(#' + mF + ')');
          g.appendChild(p);
          g.appendChild(T(lx, ly, label, { s: 12, c: 'hand', a: anchor || 'middle', st: 'fill:var(--ink);stroke:var(--sheet);stroke-width:4px;paint-order:stroke' }));
          edges[id] = p;
        }
        edge('insert', 'M140 160 L250 76', 150, 98, 'insertCard', 'middle');
        edge('pinOk', 'M400 68 L545 160', 500, 94, 'enterPIN [valid]', 'start');
        edge('wOk', 'M590 214 L400 310', 560, 278, 'withdraw [amount ≤ balance]', 'start');
        edge('taken', 'M250 322 L130 214', 112, 290, 'cashTaken / eject card', 'middle');
        edge('cancelCard', 'M290 94 Q285 190 170 192', 296, 160, 'cancel or 3rd wrong PIN / eject', 'start');
        edge('cancelAuth', 'M640 214 C640 470 70 470 70 214', 350, 436, 'cancel / eject card', 'middle');
        edge('pinBad', 'M290 40 C270 -5 380 -5 360 40', 325, -8, 'enterPIN [invalid, tries < 3] / tries++', 'middle');
        edge('wBig', 'M610 160 C595 112 680 112 665 160', 600, 106, 'withdraw [amount > balance] / show error', 'middle');
        var init = svg('circle', { cx: 105, cy: 108, r: 8, style: 'fill:var(--ink);stroke:var(--ink)' }); g.appendChild(init);
        var ip = svg('path', { d: 'M105 116 V158', style: 'fill:none;stroke:var(--ink);stroke-width:1.8' }); ip.setAttribute('marker-end', 'url(#' + mF + ')'); g.appendChild(ip);
        var stEls = {};
        Object.keys(ST).forEach(function (k) {
          var a = ST[k];
          var r = svg('rect', { x: a.x, y: a.y, width: a.w, height: a.h, rx: 16, style: 'fill:var(--sheet);stroke:var(--ink);stroke-width:2' });
          g.appendChild(r); g.appendChild(T(a.x + a.w / 2, a.y + a.h / 2 + 5, a.t, { w: 700, s: 14 })); stEls[k] = r;
        });
        function paint() {
          Object.keys(stEls).forEach(function (k) {
            stEls[k].style.fill = k === cur ? 'var(--accent-wash)' : 'var(--sheet)';
            stEls[k].style.stroke = k === cur ? 'var(--accent)' : 'var(--ink)';
            stEls[k].style.strokeWidth = k === cur ? '4' : '2';
          });
        }
        function flash(id) {
          var p = edges[id]; if (!p) return;
          p.style.stroke = 'var(--accent)'; p.style.strokeWidth = '3.5';
          setTimeout(function () { p.style.stroke = 'var(--ink)'; p.style.strokeWidth = '1.8'; }, 900);
        }
        var fbox = h('div', { class: 'feedback info', 'aria-live': 'polite' }, RE.icon('info'), h('div', null, 'The machine is in state Idle. Fire an event below.'));
        var histEl = h('div', { class: 'viz-note', style: { margin: '8px 0 0' } });
        function say(kind, msg) { fbox.className = 'feedback ' + kind; fbox.innerHTML = ''; fbox.appendChild(RE.icon(kind === 'ok' ? 'check' : kind === 'bad' ? 'x' : 'info')); fbox.appendChild(h('div', null, msg)); RE.motion.enter(fbox.firstChild, { y: 4, duration: 240 }); }
        function accepts(state) {
          return { idle: ['insertCard'], card: ['enterPIN [valid]', 'enterPIN [invalid]', 'cancel'], auth: ['withdraw [amount ≤ balance]', 'withdraw [amount > balance]', 'cancel'], disp: ['cashTaken'] }[state];
        }
        function fire(ev) {
          var from = cur, to = null, edgeId = null, msg = '';
          if (cur === 'idle' && ev.id === 'insert') { to = 'card'; edgeId = 'insert'; msg = 'Card read. Idle to Card inserted.'; tries = 0; }
          else if (cur === 'card' && ev.id === 'pinOk') { to = 'auth'; edgeId = 'pinOk'; msg = 'The guard [valid] is true, so the machine moves to Authenticated.'; }
          else if (cur === 'card' && ev.id === 'pinBad') {
            tries++;
            if (tries >= 3) { to = 'idle'; edgeId = 'cancelCard'; msg = 'Third wrong PIN: the card is retained and the machine returns to Idle.'; tries = 0; }
            else { to = 'card'; edgeId = 'pinBad'; msg = 'The guard [invalid, tries < 3] is true, so the machine stays in Card inserted (a self-transition). Wrong tries: ' + tries + ' of 3.'; }
          }
          else if (cur === 'card' && ev.id === 'cancel') { to = 'idle'; edgeId = 'cancelCard'; msg = 'Cancelled: the card is ejected and the machine returns to Idle.'; tries = 0; }
          else if (cur === 'auth' && ev.id === 'wOk') { to = 'disp'; edgeId = 'wOk'; msg = 'The guard [amount ≤ balance] holds, so the machine starts Dispensing.'; }
          else if (cur === 'auth' && ev.id === 'wBig') { to = 'auth'; edgeId = 'wBig'; msg = 'The guard [amount > balance] holds: an error is shown and the machine stays Authenticated.'; }
          else if (cur === 'auth' && ev.id === 'cancel') { to = 'idle'; edgeId = 'cancelAuth'; msg = 'Cancelled: the card is ejected and the machine returns to Idle.'; }
          else if (cur === 'disp' && ev.id === 'taken') { to = 'idle'; edgeId = 'taken'; msg = 'Cash taken: the card is ejected and the machine returns to Idle.'; }
          if (!to) {
            RE.motion.shake(fbox);
            say('bad', 'The event "' + ev.label + '" is not accepted in state ' + ST[cur].t + '. A state machine only reacts to events that have an outgoing transition from the current state. Here it accepts: ' + accepts(cur).join(', ') + '.');
            return;
          }
          cur = to; paint(); flash(edgeId);
          hist.push(ev.label + ' → ' + ST[to].t);
          histEl.textContent = 'History: ' + hist.slice(-4).join('  |  ');
          say('ok', msg);
        }
        var evBar = h('div', { class: 'viz-actions', style: { 'margin-top': '12px' }, role: 'group', 'aria-label': 'Events' });
        EV.forEach(function (e) { evBar.appendChild(h('button', { type: 'button', class: 'chip', onclick: function () { fire(e); } }, e.label)); });
        host.appendChild(h('div', { class: 'viz-scroll', style: { 'margin-top': '14px' } }, s));
        host.appendChild(h('div', { class: 'viz-note', style: { margin: '10px 0 0' } }, 'Fire an event (including ones that do not fit the current state):'));
        host.appendChild(evBar);
        host.appendChild(h('div', { class: 'viz-actions' }, h('button', { type: 'button', class: 'btn small', onclick: function () { cur = 'idle'; tries = 0; hist = []; histEl.textContent = ''; paint(); say('info', 'Reset. The machine starts in Idle.'); } }, RE.icon('reset'), 'Reset')));
        host.appendChild(fbox); host.appendChild(histEl);
        paint();
      }

      /* ---------- activity ---------- */
      function buildAct(host) {
        var ok = true, stop = 0, timer = null;
        var NODES = {
          init: { k: 'init', x: 300, y: 26 },
          sel: { k: 'act', x: 300, y: 82, t: 'Select items' },
          pay: { k: 'act', x: 300, y: 152, t: 'Enter payment' },
          dec: { k: 'dec', x: 300, y: 230 },
          fork: { k: 'bar', x: 300, y: 305, w: 240 },
          pack: { k: 'act', x: 190, y: 372, t: 'Pack items' },
          mail: { k: 'act', x: 410, y: 372, t: 'Send email' },
          join: { k: 'bar', x: 300, y: 440, w: 240 },
          ship: { k: 'act', x: 300, y: 495, t: 'Ship order' },
          fin: { k: 'fin', x: 300, y: 555 },
          err: { k: 'act', x: 560, y: 230, t: 'Show error' },
          fin2: { k: 'fin', x: 560, y: 310 }
        };
        var STOPS = {
          yes: [
            { at: ['init'], cap: 'The initial node (filled circle) starts the flow. One token begins here.' },
            { at: ['sel'], cap: 'Action: Select items. Actions are rounded rectangles; the token moves along the arrow when an action finishes.' },
            { at: ['pay'], cap: 'Action: Enter payment.' },
            { at: ['dec'], cap: 'A decision diamond has one incoming flow and several outgoing flows. Exactly one is taken, chosen by the guards.' },
            { at: ['fork'], cap: 'Guard [card valid] is true. The fork bar splits one flow into parallel flows.' },
            { at: ['pack', 'mail'], cap: 'Two tokens run in parallel: Pack items and Send email happen at the same time, in any order.' },
            { at: ['join'], cap: 'The join bar waits for both flows to arrive and then continues with a single token.' },
            { at: ['ship'], cap: 'Action: Ship order.' },
            { at: ['fin'], cap: 'The activity final node (circle with a ring) ends the whole activity.' }
          ],
          no: [
            { at: ['init'], cap: 'The initial node starts the flow.' },
            { at: ['sel'], cap: 'Action: Select items.' },
            { at: ['pay'], cap: 'Action: Enter payment.' },
            { at: ['dec'], cap: 'The decision diamond is reached. This time the card is declined.' },
            { at: ['err'], cap: 'Guard [card declined] is true, so the token follows the other branch to Show error. The guards must not overlap.' },
            { at: ['fin2'], cap: 'This branch ends at its own activity final node, and the activity finishes without shipping.' }
          ]
        };
        var s = svg('svg', { viewBox: '0 0 760 590', role: 'img', 'aria-label': 'Checkout activity diagram' });
        var defs = svg('defs'); s.appendChild(defs);
        var mF = uid('ac-f'); marker(defs, mF, 'filled');
        function arrow(x1, y1, x2, y2, label, lx, ly, a) {
          var p = svg('line', { x1: x1, y1: y1, x2: x2, y2: y2, style: 'fill:none;stroke:var(--ink);stroke-width:1.8' }); p.setAttribute('marker-end', 'url(#' + mF + ')'); s.appendChild(p);
          if (label) s.appendChild(T(lx, ly, label, { s: 13, c: 'hand', a: a || 'start', st: 'fill:var(--ink);stroke:var(--sheet);stroke-width:4px;paint-order:stroke' }));
        }
        arrow(300, 34, 300, 64); arrow(300, 100, 300, 134); arrow(300, 170, 300, 206);
        arrow(300, 254, 300, 301, '[card valid]', 310, 282);
        arrow(190, 309, 190, 354); arrow(410, 309, 410, 354);
        arrow(190, 390, 190, 436); arrow(410, 390, 410, 436);
        arrow(300, 444, 300, 477); arrow(300, 513, 300, 544);
        arrow(324, 230, 496, 230, '[card declined]', 410, 220, 'middle'); arrow(560, 248, 560, 297);
        var els = {};
        Object.keys(NODES).forEach(function (k) {
          var n = NODES[k], e;
          if (n.k === 'init') e = svg('circle', { cx: n.x, cy: n.y, r: 9, style: 'fill:var(--ink);stroke:var(--ink)' });
          else if (n.k === 'fin') {
            e = svg('g'); e.appendChild(svg('circle', { cx: n.x, cy: n.y, r: 13, style: 'fill:var(--sheet);stroke:var(--ink);stroke-width:2' }));
            e.appendChild(svg('circle', { cx: n.x, cy: n.y, r: 8, style: 'fill:var(--ink);stroke:var(--ink)' }));
          } else if (n.k === 'bar') e = svg('rect', { x: n.x - n.w / 2, y: n.y - 4, width: n.w, height: 8, style: 'fill:var(--ink);stroke:var(--ink)' });
          else if (n.k === 'dec') e = svg('path', { d: 'M' + n.x + ' ' + (n.y - 24) + ' L' + (n.x + 24) + ' ' + n.y + ' L' + n.x + ' ' + (n.y + 24) + ' L' + (n.x - 24) + ' ' + n.y + ' Z', style: 'fill:var(--sheet);stroke:var(--ink);stroke-width:2' });
          else { e = svg('g'); e.appendChild(svg('rect', { x: n.x - 62, y: n.y - 18, width: 124, height: 36, rx: 14, style: 'fill:var(--sheet);stroke:var(--ink);stroke-width:2' })); e.appendChild(T(n.x, n.y + 5, n.t, { s: 13, w: 700 })); }
          s.appendChild(e); els[k] = e;
        });
        s.appendChild(T(190, 340, 'fork', { s: 12, c: 'hand', a: 'middle', st: 'fill:var(--ink-3)' }));
        s.appendChild(T(300, 232 - 36, 'decision', { s: 12, c: 'hand', st: 'fill:var(--ink-3)' }));
        s.appendChild(T(432, 304, 'fork', { s: 12, c: 'hand', a: 'start', st: 'fill:var(--ink-3)' }));
        s.appendChild(T(432, 436, 'join', { s: 12, c: 'hand', a: 'start', st: 'fill:var(--ink-3)' }));
        function mkTok() { var c = svg('circle', { cx: 0, cy: 0, r: 8, style: 'fill:var(--accent);stroke:var(--sheet);stroke-width:2' }); c.style.transition = RE.motion.reduced() ? 'none' : 'transform 480ms cubic-bezier(0.22,1,0.36,1), opacity 200ms'; return c; }
        var t1 = mkTok(), t2 = mkTok(); s.appendChild(t1); s.appendChild(t2);
        function place(el, k) { el.style.transform = 'translate(' + NODES[k].x + 'px,' + NODES[k].y + 'px)'; }
        var fbox = h('div', { class: 'feedback info', 'aria-live': 'polite' });
        var prevB, nextB, playB;
        function go(i) {
          var list = STOPS[ok ? 'yes' : 'no']; stop = Math.max(0, Math.min(list.length - 1, i));
          var st = list[stop];
          place(t1, st.at[0]); place(t2, st.at.length > 1 ? st.at[1] : st.at[0]); t2.style.opacity = st.at.length > 1 ? '1' : '0';
          Object.keys(els).forEach(function (k) {
            var on = st.at.indexOf(k) >= 0;
            var target = els[k].tagName === 'g' ? els[k].firstChild : els[k];
            if (NODES[k].k === 'act' || NODES[k].k === 'dec') { target.style.fill = on ? 'var(--accent-wash)' : 'var(--sheet)'; target.style.stroke = on ? 'var(--accent)' : 'var(--ink)'; target.style.strokeWidth = on ? '3.5' : '2'; }
          });
          fbox.innerHTML = ''; fbox.appendChild(RE.icon('info'));
          fbox.appendChild(h('div', null, h('strong', null, 'Step ' + (stop + 1) + ' of ' + list.length + '. '), st.cap));
          prevB.disabled = stop === 0; nextB.disabled = stop >= list.length - 1;
          if (stop >= list.length - 1) pause();
        }
        function pause() { if (timer) { clearInterval(timer); timer = null; } if (playB) { playB.innerHTML = ''; playB.appendChild(RE.icon('play')); playB.appendChild(document.createTextNode('Play')); } }
        cleanups.push(pause);
        prevB = h('button', { type: 'button', class: 'btn small', onclick: function () { pause(); go(stop - 1); } }, RE.icon('prev'), 'Prev');
        nextB = h('button', { type: 'button', class: 'btn small primary', onclick: function () { pause(); go(stop + 1); } }, 'Next', RE.icon('next'));
        playB = h('button', { type: 'button', class: 'btn small', onclick: function () {
          if (timer) { pause(); return; }
          if (stop >= STOPS[ok ? 'yes' : 'no'].length - 1) go(0);
          playB.innerHTML = ''; playB.appendChild(RE.icon('x')); playB.appendChild(document.createTextNode('Pause'));
          timer = setInterval(function () { go(stop + 1); }, 1700); go(stop + 1);
        } }, RE.icon('play'), 'Play');
        host.appendChild(h('div', { style: { display: 'flex', gap: '12px', 'flex-wrap': 'wrap', 'align-items': 'center', 'margin-top': '14px' } },
          h('span', { class: 'viz-note', style: { margin: 0 } }, 'Payment outcome:'),
          seg('Payment outcome', [['yes', 'Card valid'], ['no', 'Card declined']], 'yes', function (v) { pause(); ok = v === 'yes'; go(0); })));
        host.appendChild(h('div', { class: 'viz-scroll', style: { 'margin-top': '12px' } }, s));
        host.appendChild(h('div', { class: 'viz-actions' }, prevB, nextB, playB, h('button', { type: 'button', class: 'btn small', onclick: function () { pause(); go(0); } }, RE.icon('reset'), 'Reset')));
        host.appendChild(fbox);
        go(0);
      }
      show(tab);
    }
  });
})();
