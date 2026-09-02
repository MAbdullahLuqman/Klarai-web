# Redirects

Canonical host: `https://www.klarai.uk`

Host redirects are handled in `src/proxy.js`. Retired path redirects are enforced via `next.config.mjs` and `src/proxy.js`.

Vercel should set `www.klarai.uk` as the primary production domain and permanently redirect `klarai.uk` to `www.klarai.uk`.

| From | To | Status | Reason |
| --- | --- | --- | --- |
| `/niche/seo-for-pest-control` | `/services/seo-services` | 301 | Thin niche page consolidated into core SEO service. |
| `/niche/seo-for-will-writers-uk` | `/services/seo-services` | 301 | Thin niche page consolidated into core SEO service. |
| `/niche/seo-for-custom-tuning-garages-uk` | `/industries/seo-for-garages` | 301 | Consolidated into new garage industry hub. |
| `/niche/web-design-for-tuning-garages-uk` | `/industries/seo-for-garages` | 301 | Consolidated into new garage industry hub. |
| `/niche/web-design-for-architects-uk` | `/services/web-development` | 301 | Thin niche page consolidated into core web development service. |
| `/niche/seo-for-plumbers` | `/blog/seo-for-plumbers` | 301 | Thin duplicate consolidated into the stronger plumber blog post. |
| `/case-studies/pitchside-ai` | `/case-studies/pitchside-ai-free-tools-strategy` | 301 | Sparse duplicate consolidated into the full Pitchside case study. |

## Page-level redirects (already in place)

| From | To | Mechanism | Reason |
| --- | --- | --- | --- |
| `/seo-services` | `/services/seo-services` | Page-level `redirect()` | Legacy top-level path; canonical lives at `/services/<slug>`. |
| `/aeo-services` | `/services/aeo-services` | Page-level `redirect()` | Legacy top-level path. |
| `/web-development` | `/services/web-development` | Page-level `redirect()` | Legacy top-level path. |
