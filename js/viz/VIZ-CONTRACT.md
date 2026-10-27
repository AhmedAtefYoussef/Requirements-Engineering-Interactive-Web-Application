# Interactive figure contract

Each file `app/js/viz/l<N>.js` is an IIFE, vanilla ES2017 (no modules, no libraries, no network), that registers figures:

```js
(function () {
  'use strict';
  var RE = window.RE, h = RE.h, svg = RE.svg;
  RE.visual('ahp', {
    title: 'AHP calculator',                 // ≤ 32 chars, shown uppercase in the figure header
    hint: 'Change a judgement and watch the priorities move', // ≤ 60 chars, handwritten caption
    blueprint: false,                        // true = drafting-grid background behind body (use for diagrams)
    render: function (body, preset, figure) { /* build DOM into body; preset is the string after ':' or null */ }
  });
})();
```

## Helpers already on `window.RE` (from js/core.js)
- `RE.h(tag, attrs, ...children)` — attrs: `class`, `text`, `html`, `on<event>` handlers (e.g. `onclick`), `style` object, others as attributes.
- `RE.svg(tag, attrs, ...children)` — SVG element; attr `text` sets textContent.
- `RE.icon(name)` — SVG icon: home book cards quiz glossary lab search arrow back check x info compass shuffle reset flag target source review play next prev.
- `RE.motion.enter(el, {delay, y})`, `RE.motion.pop(el)`, `RE.motion.shake(el)`, `RE.motion.reduced()` — always respect reduced motion.
- `RE.store.get(key, default)` / `RE.store.set(key, value)` — safe localStorage (prefix keys with `viz:<key>:`).
- `RE.shuffle(arr)`, `RE.toast(msg)`, `RE.esc(str)`.

## CSS classes ready in css/app.css (use these, do not add a stylesheet)
`.btn` `.btn.primary` `.btn.ghost` `.btn.small` · `.chip` (+ `aria-pressed="true"`) · `.seg` (segmented control: buttons with `aria-pressed`) ·
`.drop-zone` (+ `.over`) · `.token` (+ `.selected` `.ok` `.bad`) · `.feedback.ok|.bad|.info` (put `RE.icon('check'|'x'|'info')` first) ·
`.matrix` (numeric tables; `select`/`input` inside are styled) · `.tbl` · `.viz-actions` (button row) · `.viz-note` (small explanation) ·
`.viz-scroll` (wrap a wide SVG; the SVG gets min-width 620px) · `.tag.concept|.theory|.practice` · `.meter` + `<i style="--v:0.4">` (bar) ·
`.hand` (on SVG text: architect's handwriting face) · `.num` (tabular numbers).
Inline `style` is allowed for layout only (grid/flex/gap/width). Use `display:grid; gap` for layout.

## Colour — tokens only, both themes must work
CSS variables: `--sheet --sheet-2 --paper --ink --ink-2 --ink-3 --rule --rule-strong --accent --accent-ink --accent-wash --red --red-wash --green --green-wash --amber --amber-wash`.
In SVG, presentation attributes do NOT resolve `var()`. Write `style: 'fill:var(--accent);stroke:var(--ink)'` or set
`el.style.fill = 'var(--accent)'`. Never hard-code hex colours.
SVG text: font-size 13–15 in a viewBox ≈ width 640–760; use class `hand` for annotations. Give every shape an explicit fill (`fill:none` where outline).
UML notation must be correct: dashed arrows `stroke-dasharray:6 4`, open arrowheads via `<marker>` (give markers unique ids per figure, e.g. `uc-open-<random>`),
hollow vs filled diamonds, stick-figure actors, ellipses for use cases, system boundary rectangle, lifelines dashed, activation bars.

## Interaction rules
- Every interaction works with mouse, touch and keyboard: drag-and-drop must ALSO work as click-a-token → click-a-zone (zones are buttons or have `tabindex=0` + Enter/Space).
- Native `<button>` for clickable things, `aria-pressed` for toggles, `aria-live="polite"` on feedback regions, `aria-label` on SVG (`role="img"`) or meaningful `<title>`.
- Works at 360px wide: stack with `grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))`; wide diagrams inside `.viz-scroll`.
- Animate only transform/opacity/stroke-dashoffset; short (≤ 600ms); nothing hidden at rest without script.
- Give immediate feedback with an explanation of WHY (teaching, not just scoring). Provide a reset.
- No emoji, no gradients, no shadows beyond the existing classes, no monospace.

## Done when
`node --check app/js/viz/l<N>.js` passes; every key listed for your file is registered; presets listed are handled (unknown preset → default).
