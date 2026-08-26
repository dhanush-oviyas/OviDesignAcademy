# Design QA — Choices Section

- Source visual truth: `C:\Users\dhanush\Downloads\screencapture-coachx-tamilbusinesstribe-2026-08-24-15_24_55.png`
- Normalized source crop: `C:\Users\dhanush\OneDrive\Desktop\projects\ovi-design-academy\design-qa\choices-source-reference.png`
- Implementation screenshot: `C:\Users\dhanush\OneDrive\Desktop\projects\ovi-design-academy\design-qa\choices-implementation-desktop.png`
- Side-by-side evidence: `C:\Users\dhanush\OneDrive\Desktop\projects\ovi-design-academy\design-qa\choices-side-by-side.png`
- Viewport: 1509 × 712 CSS px
- Pixel dimensions: source crop 1509 × 712; implementation 1509 × 712
- Density normalization: both captures at 1 CSS px to 1 image px
- State: desktop choices section, default state

## Full-view comparison evidence

The normalized side-by-side comparison confirms the requested composition: the mentor is centered between two choice cards, overlaps both cards, and visually connects the decision to the CTA below. Ovi's existing blue/orange palette, typography, copy, radii, and button treatment are intentionally retained instead of cloning the reference brand.

## Focused region comparison

The full comparison is already a focused crop of this single section, and all typography, card boundaries, portrait edges, CTA spacing, and overlap points are clearly readable. A second crop was not necessary.

## Required fidelity surfaces

- Fonts and typography: Ovi's League Spartan and DM Sans hierarchy remains consistent; heading and card copy wrap cleanly.
- Spacing and layout rhythm: three-column desktop composition matches the reference structure; Rajkumar is centered and overlaps the cards without obscuring text. The CTA remains centered below.
- Colors and visual tokens: existing Ovi deep blue, cyan-blue, white, and orange tokens are preserved as requested.
- Image quality and asset fidelity: the supplied existing transparent Rajkumar portrait is sharp, centered, and displayed as a half-body figure without changing his face.
- Copy and content: existing Ovi choice labels and benefits are preserved.

## Findings

- No actionable P0, P1, or P2 issues remain.
- P3: the reference uses pill headers above the cards, while the implementation keeps Ovi's established card-heading treatment. This is an intentional brand-system difference, not a fidelity blocker for the requested center-image composition.

## Comparison history

1. Initial responsive pass found a mobile overlap between the portrait and the final line of the first card.
2. Fixed by removing the negative mobile margin and matching the portrait and center-container heights at 245 px.
3. Post-fix evidence confirms the first card ends before the portrait begins and the second card begins after the portrait ends, with no horizontal overflow.

## Interaction and browser checks

- Choices-section CTA opens the registration dialog.
- Dialog closes through its close control.
- Dialog width equals scroll width, so no horizontal crop is present.
- Mobile viewport checked at 390 px; page and section have no horizontal overflow.
- No application console errors were found. Browser-extension errors were excluded from application QA.

## Implementation checklist

- [x] Center Rajkumar between both cards on desktop.
- [x] Preserve the Ovi visual system.
- [x] Keep portrait text-safe on mobile.
- [x] Keep CTA interaction working.
- [x] Verify responsive overflow and modal behavior.

final result: passed
