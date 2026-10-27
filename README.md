# Requirements Engineering Interactive Web Application

A study companion for **CSEN406 Requirements Engineering** (Dr. John Zaki). Five lecture "sheets" laid out like an engineering drawing set, each with:

- **Learn** — the lesson in sections, with key takeaways and sources (slides + Wiegers & Beatty, Sommerville, *Perspectives on Software Requirements*)
- **Practice** — the labs and practice assignments as step-by-step worked exercises
- **Flashcards** — spaced repetition with five Leitner boxes (1, 3, 7, 14 days)
- **Quiz** — concept, theory and practice questions, every answer explained
- **Glossary** — searchable, A–Z, with related-term links

Plus 26 interactive figure types (used in 35 places) (requirement sorter, SMART builder, MoSCoW board, $100 method, AHP calculator, WRSPM model, use case / sequence / class / state diagrams), a course-wide review deck, and Ctrl K search.

## Run it

No dependencies. Requires Node 18+.

```bash
node build.js   # writes index.html from page.html
node serve.js   # http://localhost:5179
```

Once opened over http, a service worker caches the whole app for offline study.

## Structure

```
page.html            page body (also the claude.ai artifact source)
index.html           full document built from page.html
css/app.css          design tokens (light vellum / dark cyanotype) and components
js/core.js           helpers, storage, content registry, lazy loading, motion
js/shell.js          navigation, routing, view transitions, theme, search, offline
js/views.js          home, glossary, review deck
js/lecture.js        lecture header animation, tabs, learn and practice panels
js/study.js          flashcards and quizzes
js/viz/l1..l5.js     interactive figures per lecture (see js/viz/VIZ-CONTRACT.md)
content/l1..l5.js    lecture content (see content/SCHEMA.md)
sw.js                service worker
```

See [DESIGN.md](DESIGN.md) for the full design and architecture audit.
