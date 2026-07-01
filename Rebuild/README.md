# Tchaco — Portfolio Rebuild

A clean, hand-written rebuild of the original Cargo/SingleFile export. The goal is
code that's easy to read and edit often: no machine-generated wrappers, no
duplicated markup, every section commented.

**Full site: all pages, responsive (desktop + mobile), with light/dark mode and
an auto-updating footer.** See Roadmap for status.

## What's here

```
Rebuild/
├── index.html                 Home (sidebar + project gallery)
├── about.html                 About (text layout)
├── <project>.html × 19        One page per portfolio piece (see partials/gallery.html)
├── style.css                  One stylesheet, organised in 12 commented sections
├── include.js                 Injects the shared partials + the footer (auto year)
├── scroll-fade.js             Reveal-on-scroll animation
├── theme.js                   Light/dark toggle (saved choice + OS preference)
├── partials/
│   ├── sidebar.html           Intro + collapsible nav + social — shared
│   └── gallery.html           The 20-project thumbnail grid — shared
└── assets_compressed/         → symlink to ../Reference Files/assets_compressed
```

## Why partials (and why a local server)

The intro sidebar and the 20-thumbnail gallery used to be copy-pasted into every
page. Here they live in **one file each** (`partials/`) and are injected at load
time by `include.js`. Edit `partials/gallery.html` once and every page updates.

The trade-off: `include.js` uses `fetch()`, which browsers block on the
`file://` protocol. **Opening the .html files by double-clicking won't load the
sidebar or gallery.** Run a tiny local server instead:

```bash
cd ~/Projects/tchaco-rebuild/Rebuild
python3 -m http.server 8000
# then open http://localhost:8000/
```

(Any static server works — `npx serve`, VS Code "Live Server", etc.) Once the
site is hosted on a real server/CDN, includes work with no extra setup.

## How the layout works

- **Sidebar** is `position: fixed` on the left (20% wide), a flex column; the
  intro sits at the top and the social icons are pushed to the bottom with
  `margin-top: auto`.
- **Main column** is offset by the sidebar width and holds the page content.
- **Footer** ("© YEAR …") is appended to the bottom of `.main` by `include.js`;
  the year comes from `new Date().getFullYear()`, so it updates itself.
- **Thumbnails** are two curated columns; each tile keeps its true aspect ratio
  via an inline `--ar: width/height` custom property.
- **Galleries** come in two flavours: `.gallery-grid` (row-major; `--2/--3/--4`
  column modifiers) and `.gallery-columns` (masonry, used for the Cargo
  "columns"/"montessori" layouts).
- **Colours** are all CSS variables in `:root` (section 1 of `style.css`), which
  is what makes dark mode a small, contained change.

## Dark mode

Light values live in `:root` (section 1 of `style.css`); dark values override
them in the `:root[data-theme="dark"]` block right below — that one block *is*
the dark theme. `theme.js` sets `data-theme` on `<html>` before the page paints
(no flash), follows the OS preference by default, and remembers a manual choice.
The top-right pill toggle (section 12) flips between them.

## A note on sizing (px vs rem)

The root font-size is `79.38%` (inherited from the original design), so `rem`
values render smaller than the usual `1rem = 16px` and the math is unintuitive.
For anything you want at an exact, predictable size — the footer, the toggle,
captions — use `px` (or `pt`) rather than `rem`.

## Editing cheatsheet

| To change… | Edit… |
|---|---|
| Intro text, avatar, social links, category nav | `partials/sidebar.html` |
| Which projects appear in the thumbnail grid / their order | `partials/gallery.html` |
| Colours, spacing, fonts, layout | `style.css` (top-down, sections labelled) |
| Dark palette | the `:root[data-theme="dark"]` block in `style.css` |
| A project's images / text | that project's `.html` file |
| Footer text / separator | the `addFooter()` string in `include.js` |

## Verified

- All 195 asset references resolve.
- All 21 pages, both partials, CSS and JS serve `200` over HTTP.
- HTML tag structure is balanced on every file.
- Media image counts match the original sources on every project page.

Visual parity with https://tchaco.cc/ should still be eyeballed in the browser.

## Roadmap

1. **Desktop** — done (`v1-desktop`).
2. **Mobile** — done (`v2-mobile`). Two breakpoints (section 11 of `style.css`):
   tablet (≤768px) moves the sidebar to a top header and drops the poster grid
   to 2 columns; phone (≤480px) collapses everything to one column.
3. **Dark mode** — done (`v3-dark-mode`). Pill toggle, `#121212` palette,
   `theme.js` for no-flash apply + saved choice + OS preference.
4. **All pages** — done (`v4-all-pages`). 19 project pages + `about`, generated
   from the cleaned Cargo exports in `../Reference Files/` (about hand-built).
5. **Next: deploy.** Point `assets_compressed` at a real folder, switch gallery
   links to local/relative paths, and publish. See "What's left" below.

## What's left / next steps

- **Missing project:** the gallery links to *studio 61 / creative services
  illustrations* (`/studio-61-creative-services-illustrations`), but its source
  wasn't in `Reference Files/` (there's no `13-…` file), so it has no local page
  yet. Add the source to rebuild it.
- **Internal links** still point at `https://tchaco.cc/…` (matches the live
  site). For local click-through or before deploying, switch them to local/clean
  paths.
- **Assets at deploy time:** `assets_compressed` is a symlink to
  `../Reference Files/assets_compressed`. Replace it with the real image folder
  in the deployed build.

## Versioning

The repo lives at `~/Projects/tchaco-rebuild`. Commit each change from your
Terminal:

```bash
cd ~/Projects/tchaco-rebuild
git add -A
git commit -m "describe what changed"
git tag v5-...        # optional bookmark for milestones
```

History: `v1-desktop` → `v2-mobile` → `v3-dark-mode` → `v4-all-pages`. Each is a
commit (+ tag) you can diff or roll back to. For bigger experiments, branch them:
`git switch -c my-idea`.

Note: commits must be run from your Terminal — the in-app sandbox can edit files
but isn't allowed to delete git's lock files, so it can't complete a commit.
