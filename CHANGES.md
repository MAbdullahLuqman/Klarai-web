# Changes

## Week 1 Content + Architecture (2026-06-08)

### Added

- **Three industry hub pages** (new `/industries/[slug]` dynamic route, Firestore-backed):
  - `/industries/seo-for-plumbers`
  - `/industries/seo-for-garages`
  - `/industries/aeo-for-local-business`
- **Four new blog posts** (Firestore `blog_posts` collection):
  - `/blog/plumbing-keywords-list`
  - `/blog/best-keywords-for-car-garages`
  - `/blog/how-many-keywords-plumber-website`
  - `/blog/emergency-plumber-seo`
- **Programmatic sitemap** at `src/app/sitemap.js` (replaces static `public/sitemap.xml`).
- **Seed script** `scripts/seed-firestore.mjs` for the 3 industry + 4 blog records.

### Changed

- `next.config.mjs`: added `async redirects()` with all 6 niche 301s + `/free-sudit` 301.
- `src/lib/seo-config.js`: populated `removedNicheRedirects` map.
- `GlobalHeader.js`: mobile-menu "Contact" button now links to `/contact` (previously `/free-audit`).
- Two existing garage `/niche/` redirects retargeted to `/industries/seo-for-garages` (new hub) instead of the blog article.

### Removed

- `src/app/free-sudit/` (typo route).
- `public/sitemap.xml` (replaced by app-router sitemap).

### Already correct (audited, no change needed)

- Single shared `GlobalHeader` + `GlobalFooter` used on every route.
- No "Architects" nav link.
- No duplicate Contact links in footer.
- Brand consistently spelled "Klarai" everywhere (no `KlarAI` / `Klar AI` / `KLARAI` variants found).

## Manual To-Dos

1. **Run the seed script** to publish new content to Firestore:
   ```bash
   export KLARAI_ADMIN_EMAIL=...
   export KLARAI_ADMIN_PASSWORD=...
   node scripts/seed-firestore.mjs
   ```
2. **Update existing service pages** via `/admin` panel using Part A of `klarai-master-content-file.md`:
   - `/services/seo-services`, `/services/aeo-services`, `/services/web-development`
3. **Update existing blog posts** via `/admin` panel using Part A:
   - `/blog/seo-for-plumbers`, `/blog/seo-for-garages-uk`, `/blog/what-is-answer-engine-optimisation`, `/blog/plumbing-seo-keywords`
4. **Resubmit sitemap** at `https://www.klarai.uk/sitemap.xml` in Google Search Console.
5. **Request reindex** in GSC for: the 3 new industries, 4 new blog posts, and all 6 redirected niche URLs.
6. **Honesty checks before publishing live**: no fake testimonials, Pitchside AI reference only with Dave Coombs' written approval, Klarai GBP must be live before recommending GBP best practice.
7. Monitor plumber + garage clusters in GSC for ranking movement over the next 4 weeks.

## Prior Cleanup (kept)

- Canonical host standardised to `https://www.klarai.uk`.
- `robots.txt` points at `https://www.klarai.uk/sitemap.xml`.
- Sitewide `Organization` and `WebSite` JSON-LD.
- Blog post schema is `BlogPosting`; `BreadcrumbList` added.
- `klarai.com` canonicals in generated `llms.txt` routes corrected.
