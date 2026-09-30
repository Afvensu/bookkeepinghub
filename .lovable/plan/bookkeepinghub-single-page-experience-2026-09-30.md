# BookkeepingHub Single-Page Experience

## Goal
Create a polished, responsive BookkeepingHub website that combines marketing, pricing, booking, and onboarding into one continuous experience. All interactions will use in-page state only; no backend, account system, or external integration will be added yet.

## Experience
- Replace the blank home page with a premium midnight-navy glass interface using emerald and warm metallic-gold accents from the supplied brand.
- Add a sticky navigation bar using the supplied BookkeepingHub logo, with direct links to Services, Pricing, Process, Team, FAQ, and the booking flow.
- Build a high-impact opening section with the provided headline, supporting copy, trust signals, and both requested actions.
- Present the three service tiers clearly, followed by a live pricing estimator with service selection, additional-account stepper, catch-up toggle, and CAD/USD/NGN currency control.
- Keep the current estimate when the visitor opens booking from the estimator and show it in the intake journey.
- Add the four-step onboarding story, time-saved calculator, client portal preview, team profiles using both uploaded portraits, FAQ accordion, and complete business contact details.

## Booking Flow
- Open an in-page modal from every booking action.
- Step 1: choose from upcoming Monday–Friday dates and available 30-minute slots between 9:00 AM and 4:00 PM EST.
- Step 2: complete the full consultation intake form with clear validation and accounting-software options.
- Step 3: show an instant confirmation with Chinevu Amadi as consultant, the chosen time, captured business details, a Zoho Meeting access button, a Google Calendar link, and a generated `.ics` download.
- Preserve modal progress while it remains open, allow back/forward movement, and reset cleanly after completion when requested.

## Brand, Accessibility, and Search
- Store the uploaded logo and portraits through the project asset flow and create a correctly sized favicon from the uploaded mark.
- Add page-specific title, description, Open Graph, Twitter, canonical, and relevant local accounting-business structured data.
- Use semantic headings, labeled controls, keyboard-friendly modal behavior, strong contrast, visible focus states, reduced-motion support, and mobile layouts with no overlap.

## Technical Notes
- Use reusable React sections and focused UI components with Tailwind v4 semantic tokens in the global stylesheet.
- Use local React state for estimate, calculator, booking, validation, confirmation, and FAQ interactions.
- Generate calendar files in the browser; use a prefilled Google Calendar URL and a clearly labeled demo Zoho meeting link.
- Do not add persistence, email sending, real appointment availability, authentication, or third-party integrations in this phase.
- Verify the primary booking and pricing flows in the running desktop and mobile views, then confirm the preview builds cleanly.
