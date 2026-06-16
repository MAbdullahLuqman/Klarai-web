# Klarai Design System

This document defines the current Klarai website direction based on the redesigned homepage. Use it as the reference before editing pages, components, service layouts, admin-editable content views, or the footer.

## Brand Position

Klarai should feel calm, premium, technical, and trustworthy. The site is for search visibility, AEO, SEO, and web development, so the interface should communicate engineering clarity rather than marketing noise.

Core line:

Visibility is not an accident. Neither is trust.

## Visual Direction

- Cinematic but controlled.
- Editorial typography paired with dense, useful information.
- Real photographic hero imagery instead of decorative vector scenes.
- No neon green.
- No fake metrics.
- No generic SaaS gradients as the main visual device.
- No nested cards inside cards.
- Use cards only for repeated items, metrics, browser previews, and clear content modules.

## Palette

Primary background:

- Warm canvas: `#f4efe4`
- Soft panel: `#f9f5ec`
- White surface: `#ffffff`

Primary ink:

- Charcoal: `#2f3438`
- Deep dark: `#151b1e`
- Near black: `#0d1214`

Brand accent:

- Copper: `#ad5b2b`
- Copper hover: `#8d4822`
- Warm highlight: `#e0b48b`

Secondary accent:

- Mist blue: `#6f8fa3`

Use mist blue sparingly for secondary links, subtle borders, data accents, or cold technical contrast. Copper remains the main action color.

Do not use:

- Neon lime or neon green.
- One-note blue dashboard themes.
- Heavy purple gradients.

## Typography

Hero and major editorial headings:

- Serif via current `font-serif`.
- Large, calm, high contrast.
- No negative letter spacing.
- Keep line-height tight but readable.

Body and UI:

- Current sans stack.
- Buttons use simple, direct labels.
- Avoid overly clever labels when a buyer needs clarity.

Content punctuation:

- Avoid em dashes in page copy.
- Prefer commas, periods, or short separate sentences.

## Homepage Hero

Hero uses:

- Local image: `/images/hero-mountain.jpg`
- Sticky scroll scene.
- Full-frame image overlay only. Never add a half-width overlay panel.
- Sun moves down on scroll and fades behind the mountain area.
- Hero text remains visible using warm white text and shadow.
- Second section overlaps the hero with a raised panel reveal.

Hero navigation:

- Rounded glass pill.
- Centered Klarai wordmark.
- Left links: Home, Services, About.
- Right links: Projects, Contact, SEO Audit.
- Primary CTA is dark charcoal or copper, not neon.

Hero CTAs:

- `SEO Audit`
- `Contact`

## Motion

Use Framer Motion for:

- Scroll-linked hero image scale and parallax.
- Sun movement.
- Text fade and subtle scale during sticky scroll.
- Section reveal and browser preview lift.

Motion should be smooth and restrained:

- Use ease `[0.22, 1, 0.36, 1]`.
- Avoid constant decorative movement.
- Motion must clarify hierarchy or create a scroll story.

## Section Structure

Section 2, What We Do:

- Overlaps hero.
- Explains the offer within 5 seconds.
- Three service cards only.
- Cards link to canonical service routes under `/services/<slug>`.

Proof section:

- Use real work only.
- Current featured work is Pitchside AI.
- Metrics must be real or clearly marked as forecast.
- If a value is still ongoing, say ongoing or in progress.

Process section:

- Simple numbered system.
- Audit, Architect, Build & optimise, Grow.
- Avoid vague agency language.

Trust and founder sections:

- Keep founder-led transparency.
- No fake testimonials.

FAQ:

- 40 to 80 word answers.
- Keep FAQ JSON-LD in place where used.

Final CTA:

- Clear audit action.
- No credit card, no commitment.

## Service Pages

Canonical route pattern:

- `/services/seo-services`
- `/services/aeo-services`
- `/services/web-development`

Legacy top-level URLs can redirect to canonical URLs, but new internal links should use the canonical route.

Service pages should be server-rendered and read content from the admin-managed Firestore document IDs:

- `seo`
- `aeo`
- `web`
- `ads`
- `smma`

Service page design should follow the homepage:

- Warm canvas.
- Copper primary CTA.
- Mist blue as a secondary technical accent.
- Editorial hero.
- Clear cards with restrained radius.
- No neon green or blue-heavy SaaS treatment.

## Footer

Footer should feel like a closing brand system, not a generic link dump.

Use:

- Dark charcoal background.
- Copper and mist-blue accents.
- Large Klarai wordmark.
- Clear CTA block.
- Useful link groups.

Do not:

- Duplicate Contact labels.
- Use neon accents.
- Use fake social links if real accounts are not ready.

## Admin Compatibility

Admin content should remain the source for service page copy. Route restructuring must not rename Firestore document IDs unless admin tools are migrated at the same time.

When adding future content:

- Keep slugs stable.
- Keep document IDs stable.
- Add fields instead of hardcoding page-specific copy where the admin panel is intended to control the content.
