# screenhand.com — ScreenHand website

Static site (plain HTML/CSS, no build step). Android-led, with a `/desktop/` section.

## Structure
- `index.html` — Android landing (hero)
- `desktop/` — desktop product page
- `privacy/`, `terms/` — legal (⚠ still desktop-flavored; needs Android adaptation)
- `assets/` — logo, images, demo video
- `404.html`, `robots.txt`, `sitemap.xml`, `llms.txt`

## Deploy
GitHub Pages, served from the repo root (static). `.nojekyll` keeps files served as-is.
Custom domain `screenhand.com` via a `CNAME` file + DNS (added at go-live).
Note: `mcp.screenhand.com` is the bridge/API — separate, not part of this site.

## Known follow-ups
- "Get your link" is an email capture (GitHub Pages is static; live token-minting needs a serverless function).
- Adapt `privacy/` and `terms/` to the Android data flow.
