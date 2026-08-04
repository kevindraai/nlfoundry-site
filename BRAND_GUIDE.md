# N/L Foundry Brand System v1

This package translates the approved website mockup into a maintainable visual system.

## Brand idea

N/L Foundry is precise, practical and quietly technical. The identity should feel engineered rather than decorated. Literal flames, hammers and industrial theatre are avoided. The foundry metaphor appears through structure, material, depth and controlled light.

## Logo

The primary mark is a continuous-line `N/L` monogram. Both letters must remain visible. Do not crop the L, rotate the mark or replace the slash concept with a standalone N.

Assets:

- `public/brand/nlf-monogram.svg`
- `public/brand/nlf-wordmark-dark.svg`
- `public/brand/nlf-wordmark-light.svg`

Maintain clear space equal to the width of the monogram's vertical stroke. At small sizes use the monogram only.

## Colour

The N/L Foundry master brand is blue, steel and ice. Orange is reserved as a product accent for ClubPOS and should not become the generic Foundry colour.

Core tokens live in `src/styles/tokens.css`.

- Night 950: `#050b12`
- Night 900: `#07111d`
- Steel 700: `#23364a`
- Steel 500: `#4e6478`
- Ice 100: `#dceef8`
- Electric blue: `#2f9ed0`
- Light blue: `#59b8df`
- ClubPOS orange: `#f07a32`

## Typography

Use the system Inter stack for both display and body copy. This keeps the site fast and avoids an external font dependency. Headings use tight tracking and strong weight; body text remains neutral and readable.

## Product accents

- ExitLane: electric blue and teal
- ClubPOS: orange, used locally for product identity
- N/L Foundry: blue, steel, ice and near-black

## Components

Panels use dark layered surfaces, thin steel borders, restrained glow and large radii. Product badges must distinguish delivery model from development status. Animation should be subtle and respect reduced-motion preferences.

## Accessibility

Logos need useful alternative text when they communicate identity. Decorative illustrations are hidden from assistive technology. Text and controls must meet WCAG AA contrast and remain usable without animation.
