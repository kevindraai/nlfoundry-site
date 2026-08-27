# N/L Foundry Brand System v2

This package translates the approved website mockup into a maintainable visual system.

## Brand idea

N/L Foundry is precise, practical and quietly technical. The identity should feel engineered rather than decorated. Literal flames, hammers and industrial theatre are avoided. The foundry metaphor appears through structure, material, depth and controlled light.

## Logo

The primary mark is a continuous-line `N/L` monogram. Both letters must remain visible. Do not crop the L, rotate the mark or replace the slash concept with a standalone N.

Assets:

- `public/brand/nlf-monogram.svg`
- `public/brand/nlf-wordmark-dark.svg`
- `public/brand/nlf-wordmark-light.svg`

Website application roles are deliberately provisional rather than a new brand decision:

- `src/components/BrandLockup.astro` applies the primary wordmark in the header and footer with theme-aware CSS tokens.
- `public/brand/nlf-monogram.svg` and `public/favicon.svg` remain the compact mark for icons and very small contexts.
- The forge/anvil is an illustrative homepage accent, not a second primary logo.

Maintain clear space equal to the width of the monogram's vertical stroke. At small sizes use the monogram only.

### Minimum sizes

- Monogram: minimum 20px icon height.
- N/L wordmark: minimum 120px width.
- Combined logo in full header: keep at least one base line-height of clear space above and below.

### Minimum clear-space

- Monogram and wordmark require clear space equal to the monogram stroke width.
- Never place the logo flush against text, controls, or edge geometry.
- Do not use logo color inversion in logos against gradients or busy photography.

## Colour

The N/L Foundry master brand is blue, steel and ice. Orange is reserved as a product accent for ClubPOS and should not become the generic Foundry colour.

Core tokens live in `src/styles/tokens.css`.

- Night: `#020914`
- Night 2: `#071523`
- Steel: `#0B1A2A`
- Steel 2: `#21384A`
- Ice: `#F7FAFE`
- Electric blue: `#63C4FF`
- ExitLane blue: `#4CB4E8`
- ClubPOS copper: `#FF7A21`

## Typography

Use a system-first stack and do not fetch fonts from a third party. Sora may be used for display copy when it is available locally; Inter and platform fonts provide the deterministic fallback. Headings use tight tracking and strong weight; body text remains neutral and readable.

Preferred stacks:

- Display: `Sora`, `Inter`, `ui-sans-serif`, `system-ui`, `sans-serif`
- Body: `Inter`, `ui-sans-serif`, `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`

Use the same stack in light and dark themes for visual stability.

## Product accents

- ExitLane: electric blue and teal
- ClubPOS: orange, used locally for product identity
- N/L Foundry: blue, steel, ice and near-black

## Components

Panels use dark layered surfaces, thin steel borders, restrained glow and large radii. Product badges must distinguish delivery model from development status. Animation should be subtle and respect reduced-motion preferences.

Homepage pattern:

- Hero uses left-aligned statement and right-side technical illustration.
- `src/components/ForgeHero.astro` uses paired, theme-aware N/L anvil assets from `src/assets/brand/`. They are SVG wrappers around embedded raster imagery: a pragmatic hero improvement, not a pure-vector logo or final brand mark. The active Starlight theme selects the matching light or dark asset; the illustration remains decorative and subordinate to the homepage statement. The primary lockup stays authoritative. Hand-vectorisation, social-card work and a final logo family remain a separate brand sprint.
- Product cards should be separated by sufficient spacing and support mobile stacking.
- Footer includes products, engineering, journal, about, privacy/AI transparency, GitHub, and copyright.
- No screenshot mockups are used; composition is structural and native in the DOM.

## Accessibility

Logos need useful alternative text when they communicate identity. Decorative illustrations are hidden from assistive technology. Text and controls must meet WCAG AA contrast and remain usable without animation.

## Prohibited usage

- No literal fire or sparks in master-brand imagery.
- No generic orange identity usage for N/L Foundry.
- No proprietary font, cookie-based tracking, or analytics script on the public website by default.
