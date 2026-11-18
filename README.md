# ckovacs.dev

Personal site and portfolio. Built with React, TypeScript, and Vite.

The first version was hand-built with an art-deco design, then refined with Claude Code. The current version is a redesign done with Claude Code: a dark, single-column profile page.

**Live:** https://ckovacs.dev

## Design

| Desktop | Mobile |
|---|---|
| <img src="docs/home-screenshot.png" width="600"> | <img src="docs/home-screenshot-mobile.png" width="200"> |
| <img src="docs/work-screenshot.png" width="600"> | <img src="docs/work-screenshot-mobile.png" width="200"> |

## Design Ideals

- Dark mode only: one near-black palette with a single warm accent, set in Geist and Geist Mono
- A centered profile page: one column framed by hairline rails, with full-width lines between sections
- Each section shares the same frame but has its own layout: profile facts grid, contribution heatmap, project cards, expandable roles, skills table, contact tiles
- Details on demand: experience roles and project write-ups expand in place
- Subtle pointer motion only: a spotlight on the profile cover and a light edge on project cards
- Native scrolling, no scroll hijacking
- Responsive down to phone widths, and respects `prefers-reduced-motion` throughout

## Stack

- React + TypeScript
- Vite
- HTML & CSS
- Deployed on Cloudflare via GitHub Actions
- GitHub contribution data from [github-contributions-api](https://github.com/grubersjoe/github-contributions-api), fetched in the browser

## Running locally

```bash
npm install
npm run dev
```