# N/L Foundry Brand System v3

Approved 5 September 2026 in the N/L Foundry design session. This replaces v2's continuous-line slash monogram, heavy panel styling and default dark homepage. Letter study 03 is the approved logo basis, with modestly stronger strokes. The other studies are not approved logo variants.

## Positioning

Independent design and software studio making open-source tools and digital products. Primary line: **Software, carefully made.** Personal by origin, practical by design. N/L has a personal origin; Foundry is where ideas take shape. Describe practical outcomes without exaggerated scale, availability or performance claims.

## Logo authority

The NL monogram is one filled shape: N and L share a full-height upright. There is no slash or diagonal cutout inside the mark. The full written name is always `N/L Foundry`.

- Master geometry: `M4 4H20L76 77V4H92V80H124V96H76L20 23V96H4Z`, on `0 0 128 100`.
- `public/brand/nlf-monogram.svg`: midnight vector master.
- `public/brand/nlf-wordmark-light.svg`: midnight outlined horizontal lockup for light backgrounds.
- `public/brand/nlf-wordmark-dark.svg`: ice outlined horizontal lockup for dark backgrounds.
- `BrandLockup.astro`: same master silhouette, with accessible text in locally hosted Inter.
- `public/favicon.svg` and `public/favicons/`: compact applications.
- Clear space: at least one stem width (16 design units) on all sides.
- Minimum: 20 px high / 6 mm for the monogram; 160 px wide / 42 mm for the horizontal lockup. 16 px favicon is a dedicated compact exception.

Do not redraw, rotate, stretch, add outlines or reconnect the letters differently. Use one colour with strong contrast. AI-generated steel-die imagery is a decorative interpretation, not an engraving master.

## Palette

- Night `#020914`: primary dark ink/surface.
- Steel `#21384A`: supporting text and material.
- Ice `#F7FAFE`: primary light surface/reversed ink.
- Electric blue `#63C4FF`: restrained accent and dark-surface controls.
- Link blue `#215E86`: readable text links on light backgrounds.

Use semantic tokens for interfaces. The website has one fixed light appearance, including without JavaScript. Dark contact sections are an intentional part of that single design. Reversed logo assets remain available for print and dark surfaces. Do not use electric blue for ordinary text on Ice.

## Typography

Locally hosted Inter Variable, SIL OFL 1.1. Licence: `public/fonts/Inter-LICENSE.txt`; upstream: https://github.com/rsms/inter . No external font requests. Body 400, display and wordmark 600. Use system fallbacks if loading fails. Main body at least 16 px; regular labels 14 px; small metadata 12–13 px. The standalone package's logo wordmarks use fixed letter outlines.

## Product boundaries

ExitLane remains independently identified as an open-source network tool. ClubPOS uses its newer approved 4 September 2026 identity from `kevindraai/nlfoundry/nl-foundry-design-foundation/products/clubpos`: Night `#172B3A`, Coral `#FF6757`, Fresh White `#F5F7F8`, supplied open-C symbol and outlined Inter Bold wordmark. This supersedes the site's old orange/copper product assets only. Neither product accent becomes Foundry's master colour. Delivery model and development status remain separate and must be accurate.

## Website

Homepage: precise typographic hero and steel-die photograph; two product presentations; personal studio story; journal; direct contact. Generous whitespace, straight-edged controls, fine dividers. Other routes retain Starlight's content, search, navigation and document structure while sharing the new identity and fixed light appearance. Photography remains subordinate to content. Avoid flames, anvils, neon glow, decorative circuits, fake customer logos and invented product screenshots.

Astro, Markdown publication and GitHub Pages remain the existing architecture. Contact uses native POST to the configured Stalwart `/form` endpoint. Preserve name/email/subject/message fields, honeypot, URL validation and disabled fallback. Product information comes from filtered content collections, so drafts remain private.

## Accessibility and delivery

Labels remain visible, controls keyboard operable, focus visible and meaning independent of colour. Use useful alternative text for informative images and empty alt for decorative imagery. Honour reduced motion. Check real rendered components; token contrast alone is not conformance.

Required handoff gates remain `npm run check`, production `npm run build` and `npm run verify:build`. Repository publishing and deployment rules remain in AGENTS.md. The standalone Brand Package v3 includes vector masters, PNGs, fonts, templates, approved presentation and a PDF guide.
