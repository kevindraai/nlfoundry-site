# Approved identity and website handoff

## Outcome

The approved letter-study-03 NL mark replaces the old interwoven slash logo. The homepage follows the approved editorial mockup: locally hosted Inter, ice-white canvas, midnight typography, a steel-die image, product presentations, studio text, journal and contact.

User review refinements: omit children's names from the public website; shorten form copy to “Your message will be sent to N/L Foundry.”; use one fixed light website appearance, including without JavaScript. The dark contact section is a designed section, not a second theme.

ClubPOS's product-owner-approved September identity is imported from the design-foundation repository (night/coral, open-C symbol, outlined wordmark). Product text and development states come from existing filtered collections. Existing project, engineering, journal, about, now, search and contact routes remain available.

## Implementation

- `FoundryHome.astro`, `FoundryHeader.astro` and `foundry.css`: homepage and responsive layout.
- `BrandLockup.astro`, `public/brand/`, `public/favicons/`: deterministic vector and icon family.
- `ContactForm.astro`: same native Stalwart form mapping, validation, required fields and honeypot on homepage and contact route.
- `public/fonts/`: Inter Variable and SIL OFL licence, served locally.
- `BRAND_GUIDE.md`: approved authority and provenance.
- Package manager, lockfile, dependencies and GitHub Pages workflow remain unchanged.

## Verification

`npm run check`, the canonical production build, and `npm run verify:build` pass. Additional static output review covers all 11 pages, internal links and anchors, one H1 per page, unique IDs, image alt attributes and asset availability, SVG validity, both forms' field mappings and seven key contrast pairs. The form-disabled build also passes when no endpoint is configured.

The public existing endpoint was read from the deployed contact page: `https://mail.draai-odijk.net/form`. It is used only in ignored local preview configuration and build checks. Deployment continues to obtain configuration from existing GitHub Actions variables. No email was submitted and mailbox delivery was not tested. Responsive behaviour and keyboard handling were reviewed in source; no automated browser tests were run.

The companion Brand Package v3 includes outlined SVG logos, transparent PNGs, favicon/app-icon sizes, local fonts and licence, business cards, letterhead, email signature, a PDF brand guide and final campaign presentation. The physical mockups are generated presentation imagery; the vector masters are the production source.

## Review boundary

Prepared on `design/approved-foundry-identity` from verified `origin/main` at `115c7ec91fc5eb3cb8b76bf39b1e0636d5654e22`. No push, PR, merge or deployment has been performed. Those steps follow the explicit-action approval contract in `AGENTS.md`.
