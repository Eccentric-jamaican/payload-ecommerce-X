# Alphamed Global CMS & Frontend Plan

## Project Goals
- Deliver a production-ready Alphamed Global Limited website where non-technical editors manage all content through Payload CMS.
- Support dynamic page/section composition so the team can evolve messaging without deployments.
- Keep brand tokens (color, typography, CTAs) configurable from Site Settings for future redesigns.

## Current Content Model
- `users` — admin/editor accounts with email+password auth.
- `media` — centralized asset library for images and documents.
- `pages` — flexible static pages driven by a blocks array (hero, carousels, partner strip, team, etc.).
- `blogs` — long-form articles with Lexical rich text, featured media, author attribution, and scheduling support.
- `products` — catalogue entries with gallery, specs, key uses, CTA controls, and publication status.
- `categories`, `clinical-areas`, `product-families` — supporting taxonomies for product filters and grouping.
- `notifications` — admin broadcast messages.
- Globals: `siteSettings` (branding, navigation, footer content, CTAs) and `banner` (stackable announcement messages).

## Blog Experience
- Listing (`/blog`) pulls hero copy, social links, filters (topic + date), and newsletter CTA from Site Settings.
- Blog posts (`/blog/[slug]`) render hero metadata, featured images, and Lexical content with structured typography (headings, lists, quotes, media uploads).
- Editors can tag posts with topics via the `blog-topics` collection to power filtering and chips.

## Product Catalogue
- **Schema**: `products` tracks name, slug, SKU, status (draft/published/discontinued), short+rich descriptions, media gallery (min. one upload), optional YouTube embed, key uses, technical specs, stock flag, CTA label/url, and relationships to `categories`, `clinical-areas`, and optional `product-families`. Drafts/versioning are enabled for approvals.
- **Taxonomies**: `categories`, `clinical-areas`, `product-families` auto-generate slugs for URL-safe filtering; admins can add/remove items freely.
- **Listing**: `/products` presents a hero summary, total count, procurement CTA, and a three-column grid. Filters for category and clinical area update the Payload query directly.
- **Detail View**: `/products/[slug]` showcases hero metadata (stock badge, family, code), gallery, additional imagery, key uses, technical specs stack, Lexical description, optional YouTube embed, and CTA button.

## Page Composition
1. Editors create a page, pick a layout variant, and add blocks to the `sections` field.
2. Each block exposes the core editable fields (headline, copy, CTAs, imagery).
3. `page.client.tsx` maps blocks to React components. Unknown blocks are skipped safely so new ones can ship without breaking rendering.
4. Every page resolves via `/{slug}`; the legacy home continues to consume CMS-driven sections under the hood.

## Site Settings Integration
- `layout.tsx` fetches Site Settings server-side and injects CSS custom properties for brand theming.
- `Navbar` and `Footer` read navigation arrays, CTAs, and contact info from Site Settings.
- `BannerCarousel` renders the rotating announcement stack from the `banner` global.

## Editorial Workflows
- Versioning/drafts enabled on `pages`, `blogs`, and `products` so editors can stage updates.
- Hero blocks support animated headings, background imagery, and CTA controls.
- Carousels (“See Alphamed in action”, “Who we are”) let editors reorder slides, toggle view-all links, and apply deep links.
- Team showcase adapts between single-row and three-column layouts based on member counts.

## Maintenance Notes
- Run `pnpm generate:types` after schema changes so `payload-types.ts` stays in sync (expect the SMTP warning if env vars are unset).
- Validate with `pnpm exec tsc --noEmit` prior to commits; the project blocks on type errors.
- Update `next.config.mjs` remote image hosts if brand assets move to new CDNs.

## Open Questions / Future Enhancements
1. Additional block library: benefits lists, timelines, resource downloads, contact forms, etc.
2. Broader content collections (awards, partners, testimonials, careers) if reuse demands it.
3. Authentication scope: keep public sign-up or restrict to invited editors only?
4. Deployment runbook covering environments with/without Docker.
