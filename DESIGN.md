# DESIGN.md — Requirements Engineering Interactive Web Application

An end-to-end audit of how this application was specified, planned, delegated, built, verified and shipped, and a reference for its architecture and front-end design system.

- **Live:** https://ahmedatefyoussef.github.io/Requirements-Engineering-Interactive-Web-Application/
- **Course:** CSEN406 Requirements Engineering, Dr. John Zaki
- **Stack:** vanilla HTML, CSS and JavaScript. No framework, no build-time dependencies, no runtime libraries.

---

## 1. The brief

The original request had six parts. Each is listed here with where it landed.

| # | Requirement | Outcome |
|---|---|---|
| 1 | Analyse every lecture, lab, practice assignment and the three reference books | All 5 lectures, Labs 3–5, Practice Assignments 1–2 and the $100 case were read in full. The three books (0.65–1.9 MB each) were mined with targeted search by a subagent into a 496-line notes file (§3.1). |
| 2 | Research what makes front-end design distinctive rather than average | Applied through the design skills the user named (§2) and their rules, which are recorded in §5. |
| 3 | Build an app that raises learning quality: visuals for every concept, high interactivity, flashcards, per-lecture quizzes testing concept, theory and practice, and per-lecture glossaries | 5 lecture sheets, 26 interactive figure types used in 35 places, 142 flashcards, 106 quiz questions, 121 glossary terms, 7 worked labs (§6). |
| 4 | A distinctive UI/UX: own palette in light and dark, premium type, proportionate layout, modular code, transitions between and within pages, an animated lecture title | The "drafting table" visual world (§5), page transitions using the browser's View Transitions feature, and an animated title block on every lecture (§5.5). |
| 5 | Performance, offline use, caching, maintainability | Lazy loading, idle prefetch, a cache-first service worker, `content-visibility`, and a fixed data contract for content and figures (§4.6). |
| 6 | Use the named skills, delegate to subagents, keep token use low without losing quality | Lead-plus-workers orchestration with 6 subagents built against fixed contracts (§3). |

Follow-up requests in the same conversation:

1. Publish to a GitHub repository.
2. Make it public and give the live URL (GitHub Pages).
3. Replace the logo with an animated document, rename the app to "Requirements Engineering", and rename the repository to "Requirements Engineering Interactive Web Application".
4. Add this document.

---

## 2. Skills and how each was applied

| Skill | Loaded | How it shaped the work |
|---|---|---|
| `impeccable:impeccable` | Yes | Ran its context loader (no product or design files existed, so a new surface). Asked the one direction question with a structured prompt. Followed its craft floor: themed browser surfaces (selection, caret, scrollbars, focus ring); no eyebrows above headings; no gradient text, glass or side-stripe cards; one authored motion moment per surface. Ran its mechanical detector at the end (§7.3). |
| `taste-skill:design-taste-frontend` | Yes | Classified the work as an app screen, not a marketing page. Its house rules were adopted: no gradients as decoration, no tiny tracked labels, no icon-topped card grids, one ground / one ink / one accent, square-ish geometry, a phone layout composed on its own terms. |
| `anthropic-skills:lean-swarm` | Yes | Lite mode: contracts first (`content/SCHEMA.md`, `js/viz/VIZ-CONTRACT.md`), disjoint file ownership per agent, cheapest suitable model tier (Sonnet for workers, the lead on Opus), and the lead re-checking every result itself. |
| `ecc:motion-foundations` | Yes | A token-driven motion system in CSS custom properties: duration tokens instant 80 ms / fast 180 / normal 350 / slow 600; exponential ease-out; reduced-motion handled first; only transform, opacity and stroke-dashoffset animate. |
| `ecc:motion-patterns`, `ecc:motion-advanced`, `ui-ux-pro-max:*`, `context-engineering:multi-agent-patterns` | Not loaded | Skipped to save tokens. Their ground (stagger, SVG path drawing, text reveals, orchestration) overlaps with the four skills above, and those principles are implemented directly (§5.5, §3). |

The single design question put to the user offered three visual worlds: **Drafting table** (chosen), Editorial journal, Night studio.

---

## 3. Orchestration audit

### 3.1 Agent roster

All workers ran in the background on Sonnet while the lead (Opus) built the application shell. No two agents owned the same file.

| # | Agent | Owned | Inputs | Delivered | Lead's verification and fixes |
|---|---|---|---|---|---|
| A1 | Book miner (general-purpose) | `scratchpad/book-notes.md` | The three reference books, via targeted search and offset reads only | 496 lines of paraphrased definitions tagged by book and chapter: Wiegers Table 1-1 (levels and types of requirements); quality attributes; Sommerville's non-functional requirement classification and metrics table; the five validation checks; the Wiegers prioritization formula with a worked check against Table 16-1; interview, workshop and questionnaire guidance; ethnography; traceability; Sommerville's modelling perspectives. Gaps it flagged: WRSPM, AHP, SMART and UML notation detail are not in the books, and there is no Kano model. | Its flags were carried into the content briefs. The note that Sommerville uses one diamond for both aggregation and composition (the hollow/filled distinction comes from UML) informed the L5 content. |
| A2 | Content writer, L1 and L2 | `content/l1.js`, `content/l2.js` | Slides, PA1, PA2, book notes | L1: 8 sections, 26 cards, 20 quiz questions, 22 terms, PA1 golf-cart practice. L2: 9 sections, 28 cards, 20 quiz questions, 23 terms, PA2 model answers (technique table plus clients A–E, each with SMART requirements). | `node --check`; schema counts checked by loading the file with a stub `RE.register`. It noted that some glossary `related` links name terms with no entry, so the glossary renderer falls back to filtering for that term. |
| A3 | Content writer, L3 | `content/l3.js` | Slides, Lab 3, $100 case, book notes | 9 sections, 29 cards, 25 quiz questions, 24 terms, 2 practices (Lab 3 AHP; $100 donation case with a 6-user table). AHP numbers recomputed by script. | **Defect found:** it stated Lab 3's consistency ratio as about 0.28. A4 computed 0.326 independently, and the lead corrected the text to "about 0.33". |
| A4 | Figure builder, L3 | `js/viz/l3.js` | `VIZ-CONTRACT.md`, `content/l3.js` | `urgency-grid`, `moscow-board`, `hundred-dollar` (preset `:donation`), `pairwise`, `wiegers-matrix`, `ahp` (presets `:lecture`, `:lab3`), plus `RE.vizMath.l3` so the maths can be tested in Node. Verified in Node: lecture EV .069/.395/.457/.079, consistency ratio 0.022; Lab 3 .269/.463/.101/.168; Wiegers example B 1.53 / A 1.05 / C 0.36. | Syntax check; rendered in the browser; AHP output read and matched the slides. |
| A5 | Content writer, L4 and L5 | `content/l4.js`, `content/l5.js` | Slides, Labs 4 and 5, book notes | L4: 7 sections, 27 cards, 19 quiz questions, 22 terms, smart-home and farm WRSPM practices. L5: 9 sections, 32 cards, 22 quiz questions, 30 terms, library use-case practice. | It flagged that the patient-monitor slide text was scrambled in the export, so its W/R/S/P/M assignment follows standard WRSPM. **Open item:** compare it with the slide image. |
| A6 | Figure builder, L4 and L5 | `js/viz/l4.js`, `js/viz/l5.js` | Contract and slides | `why-what-how`; `wrspm` (`:patient`, `:atm`, `:smart-home`, `:farm`); `uml-tree`; `perspectives`; `usecase` (`:instapay`, `:library` with a spot-the-error quiz); `sequence` (step-through with an `alt` frame); `class-diagram`; `state-activity`. It tested all 12 figures on a scratch page. | It left a test server running on port 8765. The environment blocked the lead from stopping it, and the user was told. **Assumption:** in the library diagram, Add/Remove book are drawn as generalizations of Manage catalog. |
| Lead | The lead (Opus) | Everything else | — | CSS design system, core runtime, shell and router, home / glossary / review views, lecture view, flashcards and quiz engine, L1 and L2 figures (12), service worker, manifest, build and serve scripts, deployment. | See §7. |

### 3.2 Why this split saved tokens

- **Contracts first.** The two schemas were written before any agent started, so agents never needed live coordination and nothing had to be reworked when files were merged.
- **Pointers, not payloads.** Agents received file paths and quantity targets, not pasted content. Large books were only ever searched, never read whole.
- **Parallel with the lead.** The shell, views and study engines were built while all five content and figure agents ran.
- **Mechanical checks over trust.** Every file was syntax-checked by the lead. All 25 lecture tabs were rendered by a script that looked for figures stuck in their loading state and for script errors (§7).

---

## 4. Architecture

### 4.1 File map

```
page.html            Page body: title, meta, fonts, shell markup, script order (also the claude.ai artifact source)
index.html           Full document generated from page.html by build.js (doctype, manifest, icon)
css/app.css          Design tokens (light and dark), base, shell, every component, motion, responsive rules (649 lines)
js/core.js           RE namespace: DOM helpers, safe storage, events, content registry, lazy loader,
                     figure registry and mounter, progress, Leitner scheduler, motion helpers, toasts, icon set
js/shell.js          Navigation rail, hash router plus View Transitions, theme switch, command palette, offline registration, boot
js/views.js          Home (sheet set), Glossary (all terms), Review deck (all cards)
js/lecture.js        Title block and animation, tab bar with sliding underline, Learn panel (scroll-spy, read tracking), Practice panel
js/study.js          Flashcards (Leitner) and Quiz engine
js/viz/l1..l5.js     Interactive figures, loaded on demand per lecture
js/viz/VIZ-CONTRACT.md   Contract every figure file implements
content/l1..l5.js    Lecture data: sections, practice, flashcards, quiz, glossary
content/SCHEMA.md    Contract every content file implements
sw.js                Service worker: precache plus runtime caching
manifest.webmanifest, icon.svg   Installable app metadata
build.js, serve.js   Zero-dependency build (page.html → index.html) and static server
```

Size: about 6,400 lines and 564 KB of source, about half of it lecture content. There are no third-party scripts.

### 4.2 Runtime model

- **One global namespace, `RE`.** Each file is a self-contained function that attaches to it. Scripts load in a fixed order: `core → views → lecture → study → shell`. The shell boots last, after every view exists.
- **Content registry.** `content/lN.js` calls `RE.register({...})` once. `RE.loadLecture(id)` injects the script on first use, caches the promise, and resolves when the file registers.
- **Figure registry.** `RE.visual(key, {title, hint, blueprint, render(body, preset)})`. Content refers to a figure by key, as in `visual: 'ahp:lab3'`. `RE.mountVisual` builds the figure frame, uses `RE.VIZ_INDEX` to work out which `js/viz/lN.js` holds the key, loads it lazily and renders it. A failure shows a readable message in place of the figure.
- **Shared figure helpers.** `RE.sortBoard` (drag, or tap-then-tap, sorting with checking and explanations) and `RE.vizSeg` (segmented control) live in `viz/l1.js`. `viz/l2.js` loads them on demand.
- **Events.** A small publish/subscribe (`RE.on` / `RE.emit`) carries `content` and `progress` events, which repaint the progress bars in the rail and on the home page.

### 4.3 Routing

The router uses the URL hash only, because claude.ai artifact pages allow only plain `#tokens`.

| Hash | View |
|---|---|
| `#home` | Course plan |
| `#l1` … `#l5` | Lecture, Learn tab |
| `#l3-practice`, `-cards`, `-quiz`, `-glossary` | Lecture tabs |
| `#l2~elicitation-techniques` | Deep link to a section |
| `#glossary`, `#glossary~moscow` | Glossary, optionally focused on a term |
| `#review` | Course-wide flashcard deck |

- **Between pages**, the swap runs inside `document.startViewTransition`, and the lecture numeral carries `view-transition-name: num-lN` so it morphs from the home list into the lecture header.
- **Between tabs of the same lecture**, the header is kept and only the panel is swapped, sliding left or right according to tab order.

### 4.4 State and persistence

Everything is stored in `localStorage` under the `re406:` prefix, through `RE.store`. Every read and write is wrapped so the app still works in private windows; an in-memory copy is the fallback.

| Key | Holds |
|---|---|
| `theme` | `light` or `dark` |
| `read:lN` | Map of section → time read (a marker at the end of each section must scroll into view) |
| `quiz:lN` | `{best, last, tries}`. Saved for full runs or runs of 8 or more questions |
| `cards` | `{cardId: {box, due, seen}}` for the Leitner scheduler |
| `notes:lN:practiceId` | The student's own answers in the Practice steps |
| `last` | Last route, for "Continue where you stopped" |
| `viz:*` | Figure state, e.g. the elicitation-plan checklist |

### 4.5 Learning engines

- **Flashcards (Leitner, 5 boxes).** Again → box 1, shown again in about a minute and re-queued this session. Hard → stays in its box. Good → up one box. Intervals are 0 / 1 / 3 / 7 / 14 days. Modes: Due now, All cards, Weakest first; filter by card type. Keys: Space flips, 1–3 rate, ←/→ browse. The card flips in 3D and is dealt or thrown off with the Web Animations API.
- **Quiz.** Questions are filtered by level (concept, theory or practice), shuffled, and answer options are shuffled within each question. Single, multiple-choice and true/false are supported. Checking marks correct answers with a green check, crosses out wrong picks in red, and always shows the explanation. Results break the score down by level, list the missed questions with answers, and offer "Retake missed" or "Retake all". Keys: A–D or 1–4 choose, Enter checks and moves on.
- **Glossary.** Live filter with highlighted matches, an A–Z jump bar, a lecture filter (course-wide view), related-term chips, and a highlight on the focused term.
- **Command palette (Ctrl K or /).** A ranked search over sections, terms, flashcards and practice items, built once all lectures have loaded. Keyboard navigation follows the listbox pattern (`aria-activedescendant`).

### 4.6 Performance and offline

| Technique | Where |
|---|---|
| Lectures and figure files load only when first opened | `RE.loadLecture`, `RE.mountVisual` |
| Remaining lectures prefetch when the browser is idle | `requestIdleCallback` in `shell.js` |
| Long sections skip rendering until needed (`content-visibility: auto`) | `.lsec` |
| Only compositor-friendly properties animate (transform, opacity, stroke-dashoffset, clip-path) | All motion |
| Font server connections opened early; `display=swap` with real fallback stacks | `page.html` |
| Service worker precaches the shell, all figures and all content; same-origin requests are served from cache and refreshed in the background; Google Fonts are cached as fetched | `sw.js` (cache `rdt-v3`, fonts `rdt-fonts-v1`) |
| Update notice when a new worker installs | `shell.js` |
| No framework or library code to download | Whole app |

The service worker runs on GitHub Pages and on the local server. It cannot run inside the claude.ai artifact sandbox, where the app falls back to on-demand loading.

---

## 5. Front-end design system

### 5.1 Concept

Requirements engineering is drawing a system before it is built, so the app is laid out as **a set of engineering drawing sheets**. Each lecture is a sheet: it has a sheet number (01 / 05), a **title block** like those on technical drawings (sheet, course, title, drawn by, paired lab, progress), and a **dimension line** that measures the title with a handwritten label. Diagram figures sit on a blueprint grid, the one place a grid is used, because there it is the actual drawing surface. Annotations are set in an architect's lettering face.

### 5.2 Colour

Light mode is navy ink on vellum; dark mode is a cyanotype (deep blueprint blue). Every colour is a token, with a full dark set under both `prefers-color-scheme` and `[data-theme]`, so system, light and dark all work.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--paper` | `#E6ECEA` | `#081630` | Page background |
| `--sheet` / `--sheet-2` | `#F7F9F8` / `#EDF2F1` | `#0D1F3F` / `#12284D` | Surfaces, one tone step apart |
| `--ink` / `--ink-2` / `--ink-3` | `#12203A` / `#485A73` / `#6E7E94` | `#E7EEF9` / `#A9BBD8` / `#7F95B8` | Text levels |
| `--rule` / `--rule-strong` | `#C7D1D5` / `#9FAEB8` | `#22406E` / `#35588C` | Borders |
| `--accent` (+ `-wash`) | Cobalt `#1E47C4` | Sky `#8DBBFF` | The one accent: actions, current state |
| `--red`, `--green`, `--amber` (+ washes) | Red pencil, green ink, amber | Lighter versions | Meaning only: wrong, right, theory level |
| `--doc-paper` / `--doc-ink` | `#FFFFFF` / `#1E47C4` | `#EEF4FF` / `#173462` | Logo page stays paper-white in both themes |

The palette deliberately avoids the common machine-made defaults: warm cream with terracotta, violet, and purple-to-blue gradient heroes.

### 5.3 Typography

| Role | Face | Use |
|---|---|---|
| Display | **Big Shoulders Display** 600–800, uppercase | Lecture titles, section headings, numerals, scores. Its condensed, lettered look fits the drafting world. |
| Body | **Atkinson Hyperlegible Next** 400–700 | All reading text. Designed for legibility, and its slashed zero suits numeric content. |
| Annotation | **Architects Daughter** | Dimension labels, figure captions, the "Remember" and "Why" labels. Used sparingly. |

The type scale is fluid, from `--step--1` to `--step-4` using `clamp()`. Headings use `text-wrap: balance`, paragraphs use `pretty`, reading width is held to about 70 characters, and figures use tabular numerals.

### 5.4 Layout

- **Shell:** a 272 px navigation rail plus the main column, with a sticky top bar holding the breadcrumb, search and theme switch. Below 960 px the rail becomes a slide-in drawer with a scrim.
- **Lecture:** title block, then a sticky tab bar with a sliding underline, then the Learn grid (content column plus a 232 px "On this sheet" outline with scroll-spy and read ticks). The outline is hidden below 1180 px.
- **Home:** a hero with a hand-drafted SVG of the RE process; a progress strip; the sheet set (one row per lecture with an outline numeral and three progress bars); an interactive process strip; a "How to use it" panel.
- **Phone (≤ 560 px):** 16 px side gutter, a single-crumb breadcrumb, stacked controls, and wide diagrams inside their own horizontal scroller, so the page itself never scrolls sideways.
- **Notched screens:** safe-area insets are respected throughout.

### 5.5 Motion

| Moment | Implementation |
|---|---|
| **Lecture title (signature)** | The outline numeral draws its stroke, then fills with the accent wash. Title words rise from behind a mask with a slight rotation, 70 ms apart. The dimension line grows from its centre, then the end ticks and handwritten label fade in. |
| Page change | View Transitions cross-fade with a lift; the lecture numeral morphs from the home list into the header. |
| Tab change | Panel slides in the direction of travel; the underline glides to the new tab. |
| Theme switch | New theme spreads as a circle from the toggle button; sun and moon icons rotate. |
| Scroll reveals | Sections fade up 18 px as they enter view. Content on screen at load is never hidden. |
| Hero drawing | Process path draws in, then nodes and labels fade in, staggered. |
| Feedback | Correct answers pulse slightly; wrong ones shake; tokens pop when placed; ranked rows glide to their new positions. |
| Flashcards | 3D flip; card dealt in; card thrown left, right or down according to the rating. |
| **Logo (document)** | On hover or focus: the page lifts and tilts −5°, the tile grows slightly, the folded corner flexes, three text lines write in one after another, then a green check draws. |

Rules: ease-out curves only (the detector flagged the earlier overshoot curve, which was replaced); durations come from the motion tokens; under `prefers-reduced-motion`, every animation and transition collapses to 1 ms and stroke drawings show complete.

### 5.6 Component inventory

Buttons (primary, plain, ghost, small, fully rounded), segmented controls, toggle chips, tags by level, progress bars, drop zones and tokens (selected, right, wrong states), feedback banners (right, wrong, info), matrix tables, figure frames with optional blueprint grid, note / pitfall / example callouts with masked icons, takeaway boxes, outline with read ticks, flashcard faces, quiz options with check / cross marks, result block, glossary entries, command palette dialog, toasts. There is one stroke-icon set of 26 icons, drawn on a 24-unit grid at 1.75 weight; no emoji are used as icons.

### 5.7 Accessibility

- A skip link to the content.
- Visible focus rings everywhere.
- Every figure works by keyboard and touch: drag-and-drop always has a tap-or-Enter alternative.
- ARIA roles used: `tablist` / `tab` / `tabpanel` (arrow keys move between tabs); `radiogroup` / `radio` and `checkbox` for quiz options; `aria-pressed` on toggles; live regions for feedback, scores and toasts; labelled SVGs.
- The `<html lang>` is set, and the reduced-motion preference is honoured.

---

## 6. Content inventory

| Lecture | Sections | Figures in Learn | Practice | Cards | Quiz (C/T/P) | Kinds (single/multi/tf) | Terms |
|---|---|---|---|---|---|---|---|
| L1 Introduction | 8 | failure-cases, req-levels, req-sorter, nfr-wheel, re-process, vv | PA1 golf cart (`golf-cart`) | 26 | 20 (6/6/8) | 13/3/4 | 22 |
| L2 Elicitation | 9 | elicit-plan, input-classifier, workshop-roles, technique-matrix, smart-builder | PA2 techniques and clients A–E | 28 | 20 (6/6/8) | 14/3/3 | 23 |
| L3 Prioritization | 9 | pairwise, urgency-grid, moscow-board, hundred-dollar, wiegers-matrix, ahp:lecture | Lab 3 (`ahp:lab3`), $100 case (`hundred-dollar:donation`) | 29 | 25 (6/8/11) | 17/3/5 | 24 |
| L4 Modeling | 7 | why-what-how, wrspm, wrspm:patient, wrspm:atm | Lab 5 smart home, smart farm | 27 | 19 (5/7/7) | 12/3/4 | 22 |
| L5 UML | 9 | perspectives, uml-tree, usecase:instapay, sequence, class-diagram, state-activity | Lab 4 library (`usecase:library`) | 32 | 22 (6/7/9) | 15/3/4 | 30 |
| **Total** | **42** | **26 figure types, 35 placements** | **7** | **142** | **106** | | **121** |

Sources are cited on every section: slide ranges plus Wiegers & Beatty (*Software Requirements*, 3rd ed.), Sommerville (*Software Engineering*), and *Perspectives on Software Requirements*.

---

## 7. Verification log

### 7.1 Checks run

- `node --check` passes on every script (core, views, lecture, study, shell, five figure files, five content files, service worker).
- Schema counts verified for each content file with a stub `RE.register`.
- AHP and Wiegers maths reproduced in Node against the slide and lab values (§3.1, A4).
- A browser script visited all 25 lecture tabs plus the review deck: every panel rendered, no figure was stuck loading, and no script errors.
- Viewed in light and dark at desktop width and at 375 px. The phone check found no horizontal page overflow; the use-case diagram scrolls inside its own container.
- Live GitHub Pages site checked: Lecture 3 rendered 9 sections and 6 figures, no console errors, offline caching switched on.

### 7.2 Defects found and fixed by the lead

| Defect | Cause | Fix |
|---|---|---|
| Main column rendered underneath the rail on desktop | The drawer's scrim element took a grid column | Scrim hidden by default, shown only in the drawer layout |
| Menu button visible on desktop | `.icon-btn` display rule overrode `.menu-btn` | Raised the selector specificity |
| Text visible through the top bar | Translucent background | Solid `--paper` background |
| Hero drawing labels clipped at the edges | Tight SVG viewBox | Added 50 units of padding on each side |
| Breadcrumb wrapped into three lines on phones | Full trail shown | Only the current crumb shown at ≤ 560 px |
| Search button empty on phones | Label hidden, no icon | Added the search icon |
| Enter in the quiz advanced twice | Global key handler plus the button's own click | The handler ignores Enter when a button or link has focus |
| Space flipped a card while a rating button had focus | Global handler | Ignored when a button or link has focus |
| Review deck boxes in the wrong order | Off-by-one in assembling the grid | Rebuilt as a straight six-box list with a six-column grid |
| SMART builder could render without its controls | Depended on helpers from `viz/l1.js` | Waits for that file to load (`ensureSort`) |
| Process diagram labels too small and overlapping | 13 px text, caption on the loop path | 15 px labels, taller viewBox, caption moved down |
| L3 content stated Lab 3 consistency ratio ≈ 0.28 | Content agent's estimate | Corrected to ≈ 0.33 (computed 0.326) |
| Old styles served during development | Cache-first service worker | Development opt-out flag (`re406:nosw`); cache version raised on each release (v1 → v3) |

### 7.3 Design detector (`impeccable detect`)

| Finding | Severity | Resolution |
|---|---|---|
| Overshoot easing `cubic-bezier(0.34,1.4,0.64,1)` | Advisory | Replaced with `cubic-bezier(0.16,1,0.3,1)` |
| Thick bottom border on a rounded element (`kbd`) | Warning | Removed the thicker bottom border |
| Decorative grid background (`.blueprint`) | Advisory | **Kept on purpose:** used only on diagram canvases, where it is the drawing surface |

### 7.4 Phone layout pass (375 px)

A script measured every screen at phone width: page width, the size of each tap target, and whether any control row ran past the side margin. These issues were found and fixed:

| Issue | Fix |
|---|---|
| The page scrolled sideways on the flashcard and quiz screens, because the 3D card flip and the drawer scrim widened it | `overflow-x: clip` on the main column and the card stage |
| Segmented controls wrapped into multi-row pills and ran past the margin | They scroll sideways in one row. The flashcard filter bar no longer wraps, because wrapping had stretched its children to their natural width |
| Tap targets were 26–34 px (chips, filters, glossary links, the A–Z bar, small buttons) | 40–48 px on phones and touch screens. The A–Z bar scrolls sideways in one row |
| Top-bar buttons were heavy bordered boxes | Borderless 44 px icon buttons; the top bar is 56 px tall |
| The drawer had no close button or theme switch, and the page behind it still scrolled | Close button, a theme button in the footer within thumb reach, swipe left to close, page scroll locked while open, 48 px rows |
| The phone status bar stayed the system colour after a theme switch | The `theme-color` meta tag follows the chosen theme |
| Headings were oversized and spacing too loose on phones | Phone sizes for the hero, lecture titles, sections and stats; the hero buttons sit in a two-column grid |
| The flashcard covered its own rating buttons | Shorter card; the rating row sits below it |
| Quiz footer buttons were cramped side by side | Stacked full width, primary action first |
| Search opened as a floating box | Opens as a sheet from the top of the screen |
| Lecture tab icons crowded the tab row | Icons hidden on phones; tabs run edge to edge and scroll sideways |

After the fixes, no screen scrolls sideways on a phone. The only controls under 40 px are slider tracks and number fields inside figures (34 px).

---

## 8. Delivery timeline

1. **Plan.** Skills loaded; visual world chosen by the user; content and figure contracts written.
2. **Parallel build.** A1 book mining; A2, A3, A5 content; A4, A6 figures. The lead built the CSS, core, shell, views, lecture, study and L1/L2 figures.
3. **Integrate and verify.** Merged the workers' files, ran the checks in §7, and fixed the defects in §7.2.
4. **Ship.**
   - Private claude.ai artifact.
   - GitHub repository (private) via `gh repo create --push`.
   - Made public; GitHub Pages enabled from `main` at the root; live URL set as the repository homepage.
5. **Rebrand.**
   - Document logo with hover animation; name changed to "Requirements Engineering" in the title, rail, manifest and README.
   - Repository renamed to `Requirements-Engineering-Interactive-Web-Application` (GitHub replaces spaces with hyphens).
   - Pages URL moved with it; the artifact was republished.
6. **Documentation.** This file.

---

## 9. Known limitations and open items

- **WRSPM patient monitor (L4):** the slide export was scrambled, so the W/R/S/P/M assignment follows the standard model. Compare it with the original slide.
- **Library use case (Lab 4):** Add book and Remove book are drawn as generalizations of Manage catalog, an assumption the lab does not specify.
- **Workshop roles (L2):** the slides list the six roles without defining them; the definitions are natural readings and the text says so.
- **Progress is per browser and per address.** It lives in `localStorage`, so it does not sync across devices, and progress saved under the old Pages URL did not carry over after the rename.
- **Artifact copy:** no offline mode, because service workers are blocked in the claude.ai sandbox.
- **Development note:** a test server started by A6 on port 8765 may still be running on the build machine.

---

## 10. Maintaining it

- **Edit lecture content** in `content/lN.js`, following `content/SCHEMA.md`. No code changes needed.
- **Add a figure:**
  1. Register it in the right `js/viz/lN.js` under `js/viz/VIZ-CONTRACT.md`.
  2. Add its key to `RE.VIZ_INDEX` in `core.js`.
  3. Reference it from content as `visual: 'key[:preset]'`.
- **Restyle** through the tokens at the top of `css/app.css`. Components use only tokens, so both themes update together.
- **Release:**
  1. Run `node build.js`.
  2. Raise `VERSION` in `sw.js` so returning visitors receive the update.
  3. Commit and push to `main`; GitHub Pages redeploys within about a minute.
