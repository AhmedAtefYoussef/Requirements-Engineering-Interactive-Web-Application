# Content contract (fixed — build against it, do not change it)

Each lecture lives in `app/content/l<N>.js` and is plain ES5-compatible JS that calls `RE.register({...})` exactly once.
No imports, no other globals. Strings use single quotes or template literals; escape carefully. File must parse (`node --check`).

```js
RE.register({
  id: 'l3', num: 3,
  title: 'Negotiation, Triage & Prioritization',   // full lecture name, ≤ 40 chars
  short: 'Prioritization',                           // ≤ 16 chars, nav label
  slides: 27,
  lede: 'One or two plain sentences: what this lecture is about and why it matters.',
  outcomes: ['Verb-led outcome', '...'],             // 3–5 items
  sections: [{
    id: 'kebab-id',                                  // unique in lecture
    title: 'Sentence-case heading ≤ 48 chars',
    html: '<p>…</p>',                                // teaching text, see HTML rules
    visual: 'moscow-board' | 'ahp:lab3' | null,     // key from the visual list below, optional ":preset"
    takeaways: ['≤ 20 words each', '...'],           // 2–4 items
    source: 'Lecture 3, slides 12–17 · Wiegers ch.16'
  }],                                                // 5–9 sections, in teaching order
  practice: [{
    id: 'lab3', title: 'Lab 3 — Movie rating app', source: 'Lab 3',
    prompt: '<p>scenario + tasks</p>',
    visual: 'ahp:lab3' | null,
    steps: [{ q: 'Step question the student should try first', a: '<p>worked answer</p>' }]  // 2–6 steps, revealed one by one
  }],
  flashcards: [{ id: 'l3-f01', front: 'Question or term', back: 'Answer, ≤ 45 words', tag: 'definition'|'compare'|'apply'|'example' }],
  quiz: [{
    id: 'l3-q01', kind: 'single'|'multi'|'tf', level: 'concept'|'theory'|'practice',
    prompt: 'Question text (scenarios welcome)',
    options: ['A', 'B', 'C', 'D'],                    // omit for tf
    answer: 1 | [0, 2] | true,                        // index, index list (multi), boolean (tf)
    why: 'Explanation of the right answer AND why the tempting wrong one is wrong, ≤ 60 words'
  }],
  glossary: [{ term: 'MoSCoW', def: '≤ 40 words, precise', related: ['Prioritization'] }]
});
```

## Quantities per lecture
- sections 5–9 · flashcards ≥ 24 · quiz ≥ 16 (≥ 5 concept, ≥ 5 theory, ≥ 6 practice/scenario) · glossary ≥ 18.
- Mix quiz kinds: mostly single, ≥ 3 multi, ≥ 3 tf. Vary the index of the correct option (do not cluster on one letter).

## HTML rules for `html`, `prompt`, `a`
Allowed: `p strong em ul ol li dfn blockquote table thead tbody tr th td code` and `<aside class="note">` (extra insight),
`<aside class="pitfall">` (common exam mistake), `<aside class="example">` (worked example), `<span class="term">` (key term).
Tables: `<table class="tbl">`. No inline styles, no headings (h1–h6), no images, no emoji, no links.

## Voice
Plain, precise, second person where helpful. Paraphrase sources, never copy long passages. Ground every claim in the
lecture slides first, then deepen with the reference books (Wiegers & Beatty *Software Requirements* 3e, Sommerville
*Software Engineering*, *Perspectives on Software Requirements*). Cite in `source`. Course: CSEN406, Dr. John Zaki.

## Visual keys (built in code by the app; reference them, do not implement them)
- L1: `failure-cases` (Dodge Dart/Cayenne, Polaroid, F-35, Alaris, NHS), `req-levels` (user vs system requirement zoom),
  `req-sorter` (classify statements FR / NFR product / organizational / external), `nfr-wheel` (NFR types + measurable metric),
  `re-process` (inception → elicitation → elaboration → negotiation → specification → V&V → management), `vv` (verification vs validation)
- L2: `elicit-plan` (plan items + before/during/after a session), `input-classifier` (Maria/Phil transcript → business req,
  user req, business rule, functional req, quality attribute, constraint), `technique-matrix` (8 techniques × criteria, filterable),
  `workshop-roles` (facilitator, timekeeper, focus maker, observer, agitator, note taker), `smart-builder` (rewrite vague → SMART)
- L3: `urgency-grid` (importance × urgency 2×2), `moscow-board` (drag requirements into Must/Should/Could/Won't),
  `hundred-dollar` (allocate $100; preset `:donation` uses RE1–RE8 donation system), `pairwise` (pairwise comparison → rank order),
  `wiegers-matrix` (value, cost, risk → priority), `ahp` (pairwise matrix → normalize → priorities; presets `:lecture`, `:lab3`)
- L4: `why-what-how` (business → user → system ladder), `wrspm` (W R S P M + eh ev sv sh; presets `:patient`, `:atm`, `:smart-home`, `:farm`)
- L5: `uml-tree` (structure vs behavior diagrams), `perspectives` (external, interaction, structural, behavioral),
  `usecase` (presets `:instapay`, `:library`), `sequence` (bank transfer with alt frame, step-through),
  `class-diagram` (visibility, multiplicity, inheritance, aggregation vs composition), `state-activity` (state machine + activity diagram)
- Practice: `golf-cart` (PA1 RE process walk-through)
