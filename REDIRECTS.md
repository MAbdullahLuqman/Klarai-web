# Redirects

Canonical host: `https://klarai.uk`

All redirects are enforced via `next.config.mjs` (`async redirects()`), returning HTTP 301.

| From | To | Status | Reason |
| --- | --- | --- | --- |
| `/niche/seo-for-pest-control` | `/services/seo-services` | 301 | Thin niche page consolidated into core SEO service. |
| `/niche/seo-for-will-writers-uk` | `/services/seo-services` | 301 | Thin niche page consolidated into core SEO service. |
| `/niche/seo-for-custom-tuning-garages-uk` | `/industries/seo-for-garages` | 301 | Consolidated into new garage industry hub. |
| `/niche/web-design-for-tuning-garages-uk` | `/industries/seo-for-garages` | 301 | Consolidated into new garage industry hub. |
| `/niche/web-design-for-architects-uk` | `/services/web-development` | 301 | Thin niche page consolidated into core web development service. |
| `/niche/seo-for-plumbers` | `/blog/seo-for-plumbers` | 301 | Thin duplicate consolidated into the stronger plumber blog post. |

## Page-level redirects (already in place)

| From | To | Mechanism | Reason |
| --- | --- | --- | --- |
| `/seo-services` | `/services/seo-services` | Page-level `redirect()` | Legacy top-level path; canonical lives at `/services/<slug>`. |
| `/aeo-services` | `/services/aeo-services` | Page-level `redirect()` | Legacy top-level path. |
| `/web-development` | `/services/web-development` | Page-level `redirect()` | Legacy top-level path. |
