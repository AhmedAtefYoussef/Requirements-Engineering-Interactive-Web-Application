/* Active recall: Leitner flashcards and explained quizzes. */
(function () {
  'use strict';
  var RE = window.RE, h = RE.h;
  var BOX_COLORS = ['var(--ink-3)', 'var(--red)', 'var(--amber)', 'var(--accent)', 'var(--accent)', 'var(--green)'];

  function keyScope(host, handler) {
    function fn(e) {
      if (!host.isConnected) { document.removeEventListener('keydown', fn); return; }
      if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || e.ctrlKey || e.metaKey || e.altKey) return;
      if (document.querySelector('dialog[open]')) return;
      handler(e);
    }
    document.addEventListener('keydown', fn);
  }

  /* ================= flashcards ================= */
  RE.flashcards = function (host, cards, opts) {
    opts = opts || {};
    var mode = 'due', tag = 'all', queue = [], i = 0, flipped = false, sessionDone = 0;
    var bar = h('div', { class: 'deck-bar' });
    var modeSeg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Which cards' });
    [['due', 'Due now'], ['all', 'All cards'], ['weak', 'Weakest first']].forEach(function (m) {
      modeSeg.appendChild(h('button', { 'aria-pressed': m[0] === mode ? 'true' : 'false', onclick: function (e) { mode = m[0]; press(modeSeg, e.currentTarget); build(); } }, m[1]));
    });
    var tags = {}; cards.forEach(function (c) { tags[c.tag] = 1; });
    var tagSeg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Card type' });
    ['all'].concat(Object.keys(tags)).forEach(function (t) {
      tagSeg.appendChild(h('button', { 'aria-pressed': t === 'all' ? 'true' : 'false', onclick: function (e) { tag = t; press(tagSeg, e.currentTarget); build(); } }, t === 'all' ? 'Every type' : t[0].toUpperCase() + t.slice(1)));
    });
    var stats = h('div', { class: 'deck-stats num' });
    bar.appendChild(h('div', { style: { display: 'flex', gap: '8px', 'flex-wrap': 'wrap' } }, modeSeg, tagSeg));
    bar.appendChild(h('div', { style: { display: 'flex', gap: '8px', 'align-items': 'center' } }, stats,
      h('button', { class: 'icon-btn', 'aria-label': 'Shuffle the deck', title: 'Shuffle', onclick: function () { queue = RE.shuffle(queue.slice(i)).concat([]); i = 0; paint(true); RE.toast('Deck shuffled'); } }, RE.icon('shuffle'))));
    host.appendChild(bar);
    var stage = h('div'); host.appendChild(stage);
    host.appendChild(h('p', { class: 'viz-note', style: { 'text-align': 'center' } }, h('kbd', null, 'Space'), ' flip · ', h('kbd', null, '1'), ' again · ', h('kbd', null, '2'), ' hard · ', h('kbd', null, '3'), ' good · ', h('kbd', null, '←'), ' ', h('kbd', null, '→'), ' browse'));

    function press(seg, btn) { RE.$$('button', seg).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); }); }
    function paintStats() {
      var b = [0, 0, 0, 0, 0, 0]; cards.forEach(function (c) { b[RE.leitner.state(c.id).box]++; });
      stats.innerHTML = '';
      [['New', 0], ['Learning', 1], ['Reviewing', 2], ['Mastered', 5]].forEach(function (p) {
        var n = p[1] === 2 ? b[2] + b[3] + b[4] : b[p[1]];
        stats.appendChild(h('span', { class: 'box-pill', style: { '--c': BOX_COLORS[p[1]] } }, h('i'), p[0] + ' ' + n));
      });
    }
    function build() {
      var pool = cards.filter(function (c) { return tag === 'all' || c.tag === tag; });
      if (mode === 'due') pool = RE.shuffle(pool.filter(function (c) { return RE.leitner.isDue(c.id); }));
      if (mode === 'weak') pool = pool.slice().sort(function (a, b) { return (RE.leitner.state(a.id).box || 0.5) - (RE.leitner.state(b.id).box || 0.5); });
      queue = pool; i = 0; sessionDone = 0; paint(true);
    }
    function paint(deal) {
      paintStats();
      stage.innerHTML = ''; flipped = false;
      if (!queue.length || i >= queue.length) {
        var nextDue = cards.map(function (c) { return RE.leitner.state(c.id).due || 0; }).filter(function (d) { return d > Date.now(); }).sort()[0];
        stage.appendChild(h('div', { class: 'done-card' },
          h('h3', null, queue.length ? 'Session complete' : 'Nothing due right now'),
          h('p', null, queue.length ? 'You went through ' + sessionDone + ' cards. Cards you rated Good move to a later box and come back less often.' : (nextDue ? 'The next card comes back ' + when(nextDue) + '. You can still study every card.' : 'Every card is scheduled. Study all cards to keep going.')),
          h('div', { class: 'hero-actions', style: { 'justify-content': 'center' } },
            h('button', { class: 'btn primary', onclick: function () { mode = 'all'; press(modeSeg, modeSeg.children[1]); build(); } }, 'Study all cards'),
            h('button', { class: 'btn', onclick: function () { mode = 'weak'; press(modeSeg, modeSeg.children[2]); build(); } }, 'Weakest first'))));
        RE.motion.enter(stage.firstChild);
        return;
      }
      var c = queue[i], st = RE.leitner.state(c.id);
      stage.appendChild(h('div', { class: 'deck-progress num' },
        h('span', { class: 'meter' }, h('i', { style: { '--v': (i / queue.length).toFixed(3) } })),
        h('span', null, (i + 1) + ' / ' + queue.length)));
      var card = h('div', { class: 'fcard' + (deal && !RE.motion.reduced() ? ' enter' : ''), role: 'button', tabindex: '0', 'aria-label': 'Flashcard. Press Space to flip.', 'aria-live': 'polite' });
      var top = function () { return h('div', { class: 'face-top' }, h('span', null, (opts.showLecture ? 'L' + c.lid.slice(1) + ' · ' : '') + c.tag), h('span', { class: 'box-pill', style: { '--c': BOX_COLORS[st.box] } }, h('i'), RE.leitner.label(st.box))); };
      card.appendChild(h('div', { class: 'face front' }, top(), h('div', { class: 'face-body' }, c.front), h('div', { class: 'face-hint' }, 'tap or press space to turn over')));
      card.appendChild(h('div', { class: 'face back', 'aria-hidden': 'true' }, top(), h('div', { class: 'face-body' }, c.back), h('div', { class: 'face-hint' }, 'how well did you know it?')));
      card.addEventListener('click', flip);
      card.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); flip(); } });
      stage.appendChild(h('div', { class: 'card-stage' }, card));
      var rate = h('div', { class: 'rate-row' });
      [['again', 'Again', 'see it in a minute'], ['hard', 'Hard', 'keep in this box'], ['good', 'Good', 'move up a box']].forEach(function (g, gi) {
        rate.appendChild(h('button', { class: 'btn ' + g[0], onclick: function () { grade(g[0]); }, 'aria-keyshortcuts': String(gi + 1) }, g[1], h('small', null, g[2])));
      });
      stage.appendChild(rate);
    }
    function flip() {
      var card = RE.$('.fcard', stage); if (!card) return;
      flipped = !flipped; card.classList.toggle('flipped', flipped);
      card.children[0].setAttribute('aria-hidden', String(flipped)); card.children[1].setAttribute('aria-hidden', String(!flipped));
    }
    function grade(g) {
      var c = queue[i]; if (!c) return;
      if (!flipped) { flip(); return; }
      var s = RE.leitner.rate(c.id, g);
      sessionDone++;
      if (g === 'again' && mode !== 'all') queue.push(c); // see it again this session
      var card = RE.$('.fcard', stage);
      if (card && card.animate && !RE.motion.reduced()) {
        var x = g === 'again' ? -60 : g === 'hard' ? 0 : 60;
        card.animate([{ transform: card.style.transform || 'rotateY(180deg)', opacity: 1 }, { transform: 'translateX(' + x + 'px) translateY(' + (g === 'hard' ? 30 : 0) + 'px) rotateY(180deg)', opacity: 0 }], { duration: 260, easing: 'ease-in', fill: 'forwards' })
          .onfinish = function () { i++; paint(true); };
      } else { i++; paint(true); }
      if (s.box === 5 && g === 'good') RE.toast('Mastered: back in two weeks');
    }
    function when(t) { var d = Math.round((t - Date.now()) / 864e5); return d <= 0 ? 'later today' : d === 1 ? 'tomorrow' : 'in ' + d + ' days'; }
    keyScope(host, function (e) {
      if (e.key === ' ') { if (/BUTTON|A/.test(document.activeElement.tagName)) return; e.preventDefault(); flip(); }
      else if (e.key === '1') grade('again');
      else if (e.key === '2') grade('hard');
      else if (e.key === '3') grade('good');
      else if (e.key === 'ArrowRight' && i < queue.length) { i++; paint(true); }
      else if (e.key === 'ArrowLeft' && i > 0) { i--; paint(true); }
    });
    build();
  };

  /* ================= quiz ================= */
  var LEVELS = { concept: 'Concept', theory: 'Theory', practice: 'Practice' };
  RE.quiz = function (host, lid, c) {
    var all = c.quiz, run = [], i = 0, picked = null, checked = false, results = [];
    intro();

    function intro() {
      host.innerHTML = '';
      var best = RE.progress.quiz(lid);
      var counts = { concept: 0, theory: 0, practice: 0 }; all.forEach(function (q) { counts[q.level]++; });
      var level = 'all';
      var wrap = h('div', { class: 'quiz-wrap view-enter' });
      var left = h('div', { class: 'q-card' },
        h('h2', { style: { 'font-family': 'var(--f-display)', 'font-size': 'var(--step-3)', 'text-transform': 'uppercase', 'line-height': '1', 'margin-top': '0' } }, 'Lecture ' + c.num + ' quiz'),
        h('p', { style: { color: 'var(--ink-2)', 'max-width': '52ch' } }, all.length + ' questions. Concept questions check definitions, theory questions check why things work, practice questions put you in a scenario. Every answer is explained.'),
        best ? h('p', { class: 'num', style: { color: 'var(--ink-2)' } }, 'Best score ' + best.best + '% · last ' + best.last + '% · ' + best.tries + (best.tries === 1 ? ' attempt' : ' attempts')) : null);
      var seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Question level' });
      [['all', 'All ' + all.length]].concat(Object.keys(LEVELS).map(function (k) { return [k, LEVELS[k] + ' ' + counts[k]]; })).forEach(function (o) {
        seg.appendChild(h('button', { 'aria-pressed': o[0] === 'all' ? 'true' : 'false', onclick: function (e) { level = o[0]; RE.$$('button', seg).forEach(function (b) { b.setAttribute('aria-pressed', String(b === e.currentTarget)); }); } }, o[1]));
      });
      left.appendChild(seg);
      left.appendChild(h('div', { class: 'q-foot' },
        h('span', { class: 'viz-note', style: { margin: '0' } }, 'Keys: A–D or 1–4 to choose, Enter to check and continue.'),
        h('button', { class: 'btn primary', onclick: function () { start(all.filter(function (q) { return level === 'all' || q.level === level; })); } }, 'Start the quiz', RE.icon('arrow'))));
      wrap.appendChild(left);
      host.appendChild(wrap);
    }
    function start(list) {
      run = RE.shuffle(list).map(function (q) {
        if (q.kind === 'tf') return q;
        var order = RE.shuffle(q.options.map(function (_, k) { return k; }));
        return Object.assign({}, q, { order: order });
      });
      i = 0; results = []; question();
    }
    function correctSet(q) { return q.kind === 'multi' ? q.answer.slice().sort() : q.kind === 'tf' ? [q.answer ? 0 : 1] : [q.answer]; }
    function options(q) { return q.kind === 'tf' ? [{ k: 0, t: 'True' }, { k: 1, t: 'False' }] : q.order.map(function (k) { return { k: k, t: q.options[k] }; }); }
    function question() {
      host.innerHTML = ''; picked = []; checked = false;
      var q = run[i];
      var wrap = h('div', { class: 'quiz-wrap' });
      var steps = h('div', { class: 'q-steps', 'aria-hidden': 'true' });
      run.forEach(function (_, k) { steps.appendChild(h('i', { class: k < i ? (results[k].ok ? 'ok' : 'bad') : k === i ? 'cur' : '' })); });
      wrap.appendChild(h('div', { class: 'q-top num' }, h('span', null, 'Question ' + (i + 1) + ' of ' + run.length), h('span', null, results.filter(function (r) { return r.ok; }).length + ' correct')));
      wrap.appendChild(steps);
      var card = h('div', { class: 'q-card' });
      card.appendChild(h('span', { class: 'tag ' + q.level }, LEVELS[q.level]));
      card.appendChild(h('h2', { id: 'qp' }, q.prompt));
      card.appendChild(h('p', { class: 'q-kind' }, q.kind === 'multi' ? 'Select every answer that applies.' : q.kind === 'tf' ? 'True or false?' : 'Choose one answer.'));
      var opts = h('div', { class: 'opts', role: q.kind === 'multi' ? 'group' : 'radiogroup', 'aria-labelledby': 'qp' });
      options(q).forEach(function (o, n) {
        opts.appendChild(h('button', { class: 'opt', role: q.kind === 'multi' ? 'checkbox' : 'radio', 'aria-checked': 'false', 'data-k': o.k, onclick: function () { choose(o.k); } },
          h('span', { class: 'key' }, 'ABCDEFG'[n]), h('span', { class: 'txt' }, o.t), h('span', { class: 'mark' })));
      });
      card.appendChild(opts);
      var why = h('div', { 'aria-live': 'polite' }); card.appendChild(why);
      var action = h('button', { class: 'btn primary', disabled: true, onclick: next }, 'Check answer');
      card.appendChild(h('div', { class: 'q-foot' }, h('button', { class: 'btn ghost small', onclick: intro }, 'Quit quiz'), action));
      wrap.appendChild(card); host.appendChild(wrap);
      RE.motion.enter(card, { y: 12, duration: 420 });
      state = { q: q, opts: opts, why: why, action: action };
    }
    var state = null;
    function choose(k) {
      if (checked) return;
      var q = state.q;
      if (q.kind === 'multi') { var at = picked.indexOf(k); if (at >= 0) picked.splice(at, 1); else picked.push(k); }
      else picked = [k];
      RE.$$('.opt', state.opts).forEach(function (b) { b.setAttribute('aria-checked', String(picked.indexOf(+b.getAttribute('data-k')) >= 0)); });
      state.action.disabled = !picked.length;
    }
    function next() {
      if (!checked) return check();
      i++;
      if (i < run.length) question(); else finish();
    }
    function check() {
      if (!picked.length) return;
      checked = true;
      var q = state.q, right = correctSet(q), mine = picked.slice().sort();
      var ok = right.length === mine.length && right.every(function (v, n) { return v === mine[n]; });
      results.push({ q: q, ok: ok, mine: mine });
      RE.$$('.opt', state.opts).forEach(function (b) {
        var k = +b.getAttribute('data-k'), isRight = right.indexOf(k) >= 0, isMine = mine.indexOf(k) >= 0;
        b.disabled = true;
        if (isRight) { b.classList.add('right'); b.querySelector('.mark').appendChild(RE.icon('check')); }
        else if (isMine) { b.classList.add('wrong'); b.querySelector('.mark').appendChild(RE.icon('x')); }
      });
      state.why.appendChild(h('div', { class: 'feedback ' + (ok ? 'ok' : 'bad') }, RE.icon(ok ? 'check' : 'x'), h('strong', null, ok ? 'Correct.' : 'Not quite.')));
      state.why.appendChild(h('div', { class: 'why' }, h('b', null, 'Why'), q.why));
      if (ok) RE.motion.pop(state.why.firstChild); else RE.motion.shake(state.opts);
      state.action.textContent = i + 1 < run.length ? 'Next question' : 'See results';
      state.action.focus({ preventScroll: true });
    }
    function finish() {
      var score = results.filter(function (r) { return r.ok; }).length, pct = Math.round(score / results.length * 100);
      if (results.length === all.length || results.length >= 8) RE.progress.saveQuiz(lid, pct);
      host.innerHTML = '';
      var wrap = h('div', { class: 'quiz-wrap view-enter' });
      var by = {}; results.forEach(function (r) { var b = by[r.q.level] = by[r.q.level] || [0, 0]; b[1]++; if (r.ok) b[0]++; });
      var bars = h('div', { class: 'level-bars num' });
      Object.keys(LEVELS).forEach(function (k) {
        if (!by[k]) return;
        bars.appendChild(h('div', { class: 'meter-line' }, h('span', null, LEVELS[k]), h('span', { class: 'meter ' + (k === 'theory' ? 'a' : k === 'practice' ? 'g' : '') }, h('i', { style: { '--v': by[k][0] / by[k][1] } })), h('span', null, by[k][0] + '/' + by[k][1])));
      });
      var verdict = pct >= 90 ? 'Exam ready on this sheet' : pct >= 70 ? 'Solid, with a few gaps' : pct >= 50 ? 'Halfway there' : 'Worth another pass through Learn';
      wrap.appendChild(h('div', { class: 'result-hero' },
        h('div', { class: 'result-score num' }, pct, h('small', null, '%')),
        h('div', null, h('h2', null, verdict), h('p', { style: { color: 'var(--ink-2)', margin: '6px 0 0' } }, score + ' of ' + results.length + ' correct.'), bars)));
      var missed = results.filter(function (r) { return !r.ok; });
      wrap.appendChild(h('div', { class: 'q-foot' },
        h('button', { class: 'btn', onclick: intro }, RE.icon('reset'), 'Back to quiz start'),
        h('div', { style: { display: 'flex', gap: '8px', 'flex-wrap': 'wrap' } },
          missed.length ? h('button', { class: 'btn', onclick: function () { start(missed.map(function (r) { return all.filter(function (q) { return q.id === r.q.id; })[0]; })); } }, 'Retake the ' + missed.length + ' missed') : null,
          h('button', { class: 'btn primary', onclick: function () { start(all); } }, 'Retake all, reshuffled'))));
      if (missed.length) {
        var list = h('div', { class: 'review-list', 'data-stagger': '' });
        list.appendChild(h('h3', { style: { font: '700 var(--step-2)/1 var(--f-display)', 'text-transform': 'uppercase', margin: '10px 0 0' } }, 'Review what you missed'));
        missed.forEach(function (r) {
          var q = r.q, ans = q.kind === 'tf' ? (q.answer ? 'True' : 'False') : correctSet(q).map(function (k) { return q.options[k]; }).join(' · ');
          list.appendChild(h('div', { class: 'review-item' }, h('span', { class: 'tag ' + q.level }, LEVELS[q.level]), h('p', { style: { color: 'var(--ink)', 'font-weight': '600' } }, q.prompt), h('p', null, 'Answer: ', h('span', { class: 'ans' }, ans)), h('p', null, q.why)));
        });
        wrap.appendChild(list);
      } else wrap.appendChild(h('div', { class: 'feedback ok', style: { 'margin-top': '22px' } }, RE.icon('check'), 'A clean sheet. Move on to the flashcards to keep it in long-term memory.'));
      host.appendChild(wrap);
    }
    keyScope(host, function (e) {
      if (!state || !state.opts || !state.opts.isConnected) return;
      var k = e.key.toLowerCase(), n = 'abcdefg'.indexOf(k); if (n < 0) n = '1234567'.indexOf(k);
      var btns = RE.$$('.opt', state.opts);
      if (n >= 0 && btns[n]) { e.preventDefault(); btns[n].click(); }
      else if (e.key === 'Enter' && !(document.activeElement && /BUTTON|A/.test(document.activeElement.tagName))) { if (!state.action.disabled) { e.preventDefault(); next(); } }
    });
  };
})();
