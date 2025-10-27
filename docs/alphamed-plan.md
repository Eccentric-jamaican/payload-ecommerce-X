# Alphamed Global CMS & Frontend Plan

## Project Goals
- Deliver a production-ready Alphamed Global Limited website where non-technical admins control all content via Payload CMS.
- Support dynamic page/section composition so the client can adapt messaging as the company evolves.
- Keep branding tokens configurable to accommodate future design refinements without code changes.

## Branding Defaults (Editable Later)
- Primary color default: `#4FB8FF` (medical light blue).
- Text black default: `#111827` (soft black).
- Font family: Poppins (Medium weight for headings, regular for body).
- Expose colors, typography, and CTA details in a `siteSettings` global to allow runtime overrides.

## Content Architecture

### Collections
- `pages` – each entry represents a route (home, about, products, etc.) with a flexible `sections` blocks array.
- `products` – contains product detail data; drives `/products` listing and dynamic `/products/[slug]` pages.
- `blogPosts` – optional thought leadership / investor updates with authors, tags, and publish scheduling.
- `testimonials` – reusable quotes linked to pages/sections where needed.
- `teamMembers` – name, title, bio, portrait, optional social links.
- `faqs` – question/answer pairs; can be grouped by topic for reuse.
- `partners` – logo, name, link; reused in About and other pages.
- `awards` – award name, description, logo, year.
- `jobs` – positions for Careers page with location, department, apply link.
- `siteSettings` (global) – navigation menus, footer content, brand tokens, global contact info, default CTAs, social links.
- `media` (upload collection) – central library for images/documents (enable cropping/focal point selection).

### Blocks (for `pages.sections`)
- `hero`: background image/video, eyebrow, heading (rich text), subheading, CTA buttons.
- `featureVideo`: YouTube/Vimeo URL or uploaded video, optional caption.
- `featureCards`: repeater of card items (image, title, description, CTA link); optional slider toggle.
- `featureList`: checklist style features with icon/image + copy.
- `benefits`: headline, supporting text, list of benefit items (title, description, optional icon).
- `testimonials`: select testimonial entries, layout toggle (grid, slider).
- `team`: select team members, optional max per row, background color choice.
- `ctaBanner`: headline, supporting text, CTA button(s), contact phone/email override.
- `faq`: select FAQ entries or inline FAQs per page.
- `timeline`: list of milestones (year/date, title, description, media).
- `logosStrip`: choose partners/awards; allow light/dark mode logos.
- `productHighlight`: reference a product, override hero image/copy per usage.
- `productList`: renders filtered list of products (e.g., by category tag).
- `howItWorks`: ordered steps with title, description, icon/image.
- `contactDetails`: address, phone, email, map embed.
- `contactForm`: toggles form rendering and determines recipients.

### Page Routing
- Static routes (`/`, `/about`, `/contact`, `/investors`, `/careers`, `/team`) – each tied to a `pages` document by slug.
- `/products` – listing page driven by `products` collection + blocks.
- `/products/[slug]` – dynamic product detail; fallback 404 if product hidden/unpublished.
- `/blog` and `/blog/[slug]` – optional blog listing/detail.

## Implementation Steps
1. **Create Collections in Payload**
   - Define TypeScript schemas inside `src/payload` (e.g., `collections/Products.ts`) with appropriate fields, access control, and admin UI grouping.
   - Enable `drafts`/`versioning` where beneficial (products, pages).

2. **Build Global `siteSettings`**
   - Fields for brand colors, typography choices, primary CTA text/link, contact info, nav/footer menus (array of link groups), social links.
   - Expose via Payload REST/GraphQL; configure Next.js to fetch settings server-side.

3. **Implement Blocks**
   - Create a central `blocks/index.ts` exporting each Payload block config.
   - Mirror the blocks in React components under `src/components/blocks/*`.
   - Ensure each block supports optional enable/disable, ordering, and per-instance styling toggles (background variant, padding).

4. **Frontend Wiring**
   - Configure Next.js layout to load `siteSettings` at build/request time and inject CSS variables for colors/typography.
   - Build page template that iterates over `page.sections`, rendering the corresponding block component.
   - Set up dynamic routes for `products/[slug]` and optional `blog/[slug]`.

5. **Navigation & Footer**
   - Use `siteSettings` menus to render header/footer links.
   - Include fallbacks if menus empty to avoid blank nav.

6. **Media Handling**
   - Enable Payload `Media` collection with image resizing (e.g., 300x300 thumbnails, 1200px hero).
   - Allow blocks to reference either `media` upload or external URL for videos.

7. **Deployment Prep**
   - Ensure environment variables cover Mongo connection, Payload secret, Next.js public URL.
   - Update `Dockerfile` and non-Docker deployment docs to reflect build pipeline.

## Editor Experience Considerations
- Group related fields in Payload tabs (Content, Media, SEO) for clarity.
- Provide preview fields (e.g., generated slug, preview URL).
- Add default values for CTA phone/email from `siteSettings` to minimize duplicate entry.
- Consider access control roles (e.g., Marketing Editors vs. Admins) before launch.

## Next Steps for You
1. Review and confirm collections/blocks align with Alphamed requirements.
2. Decide whether blog/jobs are in scope for MVP; remove if unnecessary.
3. Gather brand assets and prepare initial content to seed the CMS.
4. Let me know which collection/block implementation you want help with first—then I’ll give you the exact code steps to follow (or draft them if you prefer).

## Site Settings Integration Checklist
- Create/update `src/globals/SiteSettings.ts` with tabs for Branding, Contact, Navigation, and Footer content.
- Add helper `src/lib/getSiteSettings.ts` that uses `getPayload` (with `depth: 2`) and wraps the call in `cache(...)` for reuse.
- Convert `src/app/(frontend)/layout.tsx` to `async`, fetch site settings, and inject CSS variables + pass props to layout components (Navbar/Footer).
- Replace hard-coded navigation/footer components with prop-driven versions that read from Site Settings (see `src/components/layout/Navbar.tsx` and `Footer.tsx`).
- After schema changes run `pnpm generate:types` so Payload updates `payload-types.ts` for type safety.

## Pages Collection Checklist
- `src/collections/Pages.ts` defines slug, hero preview, versioning with drafts, SEO fields, and a flexible `sections` blocks array.
- Starter block stored at `src/blocks/RichTextBlock.ts`, exported via `src/blocks/index.ts` for easy expansion.
- Register the collection in `src/payload.config.ts` under the `collections` array.
- Regenerate payload types (`pnpm generate:types`) after modifying schemas.
- Future iterations: add new block configs to `src/blocks`, export them as part of `pageBlocks`, and implement matching React components in the frontend.

## Page Rendering Checklist
- Helper `src/lib/getPageBySlug.ts` fetches published pages (and slugs) with caching.
- `src/lib/buildPageMetadata.ts` maps page meta fields to Next.js metadata objects.
- Block components live under `src/components/page-blocks`; currently only `RichTextBlock` is implemented using Payload’s Lexical renderer.
- `src/components/page/PageRenderer.tsx` iterates over sections, warning (and skipping) if a block has no renderer—add new block components to `blockComponents` as you expand the system.
- Routes:
  * `/` (`src/app/(frontend)/(with_title)/page.tsx`) remains the legacy marketplace homepage (not CMS-driven).
  * `/{slug}` (`src/app/(frontend)/[slug]/page.tsx`) renders CMS-managed pages, 404s on missing slugs; `generateStaticParams` prebuilds published slugs with ISR (`revalidate = 60`).
