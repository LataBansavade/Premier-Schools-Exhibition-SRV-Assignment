# Premier Schools Exhibition — Landing Page

Static landing page for the Premier Schools Exhibition 2025, built to the
development guidelines: **semantic HTML5 + custom CSS + vanilla JS, no frameworks.**

## Run it

No build step. Open `index.html` in any modern browser, or serve the folder:

```bash
# any static server works, e.g.
npx serve .
# or
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Structure

```
.
├── index.html        # semantic markup, BEM classes, ARIA, skip-link
├── css/styles.css    # custom CSS — tokens, layout, responsive, reduced-motion
├── js/main.js        # accessible sliders + form validation (no dependencies)
├── assets/           # images (hero/school/icon PNGs, wreath, logo)
└── README.md
```

## Sections & features

| Section | Behaviour |
|---|---|
| **Header** | White + sticky; logo and Register button shrink on scroll and across breakpoints. |
| **Hero** | **Dual-axis slider** — horizontal slides (swipe, prev/next, dots, play/pause, keyboard; **horizontal autoplay is off by default**, user-controlled) *plus* vertical auto-scrolling image columns (alternating up/down). All controls sit in a bottom bar. Pauses on hover/focus and when the tab is hidden. |
| **Stats** | Four laurel-wreath facts using the `graphics.png` wreath image; gradient-filled text. |
| **Participating Schools** | Continuous **marquee** — row 1 flows left→right, row 2 right→left. Pauses on hover/focus. |
| **Choose the School** | Four cards on desktop; becomes a **swipe slider with pagination dots** at ≤1280px (CSS scroll-snap + synced dots). |
| **Pre-schedule** | Split layout with angled (clip-path) image on desktop; image stacks below the text on tablet/mobile. |
| **Exhibition** | Entire section is a **carousel** of 5 highlight cards (icons `g-1…g-5.png`) — responsive cards-per-view (4 / 2 / 1), prev/next, swipe, keyboard, autoplay, consistent card height, curved swoosh divider. |
| **Footer** | Offices and phone (tel: links) with icon tiles, social links (image icons), copyright bar. |

## Accessibility (WCAG 2.2 AA target)

- Skip-to-content link, semantic landmarks (`header`/`main`/`section`/`footer`), one `h1`.
- Carousels use `role="region"` + `aria-roledescription="carousel"`, slides as groups, polite `aria-live` status announcements, real `<button>` controls with `aria-label`.
- Full keyboard support (Tab, Enter/Space, ←/→ on carousels). Visible `:focus-visible` outlines.
- Form fields have associated labels (visually hidden) + client-side validation with `role="status"`.
- **`prefers-reduced-motion`** honored: marquees, vertical scroll, autoplay and transitions are disabled; marquee becomes a normal scroll container.
- Images have descriptive `alt`; decorative/duplicated images use empty `alt`/`aria-hidden`.
- Hero horizontal autoplay is **off by default** (no auto-moving content without explicit user start); the play/pause control remains available.

## Cross-browser

Targets the latest 2 versions of Chrome, Firefox, Safari, Edge + iOS/Android.
Uses widely-supported features with vendor fallbacks (`-webkit-clip-path`,
`-webkit-mask-image`, `-webkit-background-clip`, Pointer Events for swipe,
`min()`/`clamp()` for fluid sizing).

## Assets

`assets/` holds the production images used by the page:

- `hero-1…hero-9.png` — hero vertical-scroll gallery
- `sch-1…sch-4.png` — Choose-the-School cards
- `g-1…g-5.png` — Exhibition highlight-card icons
- `graphics.png` — laurel wreath behind each stat
- `location.png`, `call.png`, `insta.png`, `feb.png`, `youtube.png` — footer icon tiles
- `logo 1.png` — header/footer logo badge
- school-logo PNGs — Participating Schools marquee

Fonts load from Google Fonts (Poppins, Quicksand) with system fallbacks.

## QA checklist

- [ ] HTML/CSS validation (W3C validators)
- [ ] axe accessibility scan (0 critical issues)
- [ ] Keyboard-only pass through every interactive control
- [ ] Test on Chrome / Firefox / Safari / Edge + iOS Safari + Android Chrome
- [ ] Toggle "reduce motion" in OS and confirm animations stop
