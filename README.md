# Glass Financial Flow

ok. let's focus on UI functionalities and flows for now. We'd tidy up actual backend logic and integrations later bt for now i just want the UI to have internal state memory that could neatly flow from start to end. 
Build a modern, minimalist, ultra-premium landing page and single-page web app for "BookkeepingHub" (a Brampton, Ontario-based virtual accounting firm) that natively replaces both their website and their Picktime booking link into one cohesive platform.
### 1. DESIGN SYSTEM & GLASSMORPHISM UI STYLE
- Visual Theme: Premium Polished Glassmorphism (Frosted UI containers, backdrop-filter: blur(16px), subtle 1px translucent border rgba(255,255,255,0.12), ambient mesh background gradients with deep midnight navy, dark slate, glowing emerald accents, and metallic white).
- Typography & Motion: High-contrast sans-serif (Plus Jakarta Sans or Inter), smooth entry reveals, hover elevations, and a sticky glass blur navigation bar.
### 2. HERO SECTION
- Headline: "Clear Financials. Reconciled Accounts. Zero Guesswork."
- Subheadline: "We keep your accounts reconciled down to the penny, your reports on time, and your finances crystal clear—so you can run the business instead of chasing the numbers."
- Primary CTA: "Book Free 30-Min Discovery Call" (Opens native booking modal)
- Secondary CTA: "Calculate Your Pricing" (Smooth scrolls to interactive estimator)
- Trust Badges: "QuickBooks Online Certified", "30+ Active Client Accounts", "Same-Day Custom Scoping", "100% Audit-Ready Reconciliation".
### 3. SERVICES & PRICING ARCHITECTURE (With Dynamic Add-On Estimator)
Interactive Glassmorphic Pricing Card Widget:
- Base Tiers:
  1. Monthly Bookkeeping (Starting at $500/mo — Includes 1 checking, 1 credit card account, unlimited transactions, zero caps).
  2. Accounts Payable Management (Starting at $700/mo — Bill entry, vendor tracking, payment scheduling).
  3. Accounts Receivable Management (Starting at $700/mo — Invoicing, customer follow-up, collections tracking).
- Dynamic Toggles & Add-Ons:
  - Additional Bank / Credit Card Accounts (+ $50/month per account slider/stepper)
  - Historical Catch-Up Bookkeeping Needed? (Toggle -> "Scoped & quoted during discovery call")
  - Multi-Currency Billing Toggle: CAD ($), USD ($), or Local Fixed Rate NGN (₦1,000 / $1 USD flat billing rate option).
- Real-time Estimated Monthly Investment Counter with a direct "Lock In Estimate & Book Call" CTA.
### 4. NATIVE INTERNAL BOOKING & INTAKE SYSTEM (Replaces Picktime)
Build a seamless UI booking modal/section with internal state management (no external redirects):
- Working Hours Config: Mon–Fri: 9:00 AM – 4:00 PM EST.
- Booking Steps (Interactive Flow):
  Step 1: Select Date & Available 30-Min Time Slot.
  Step 2: Pre-Consultation Intake Form:
    • Full Name & Business Email
    • Phone Number
    • Business Name & Industry
    • Accounting Software Used (QuickBooks Online, Xero, FreshBooks, None)
    • Estimated Monthly Transaction Volume
  Step 3: Direct Instant Confirmation screen with:
    • Lead Consultant Assignee: Chinevu Amadi (MBA, Lead Bookkeeper)
    • Single-click "Add to Google Calendar / Apple Calendar (.ics)" download trigger
    • Access link for Zoho Meeting / Video Call.
### 5. 4-STEP CLIENT ONBOARDING FUNNEL (Glass Step Cards)
1. Book a Consultation Call (Select time slot directly)
2. Business Discovery & Financial Health Check
3. Share Access to QuickBooks Online & 3 Months Bank Statements
4. Get Your Custom Quote Same-Day
### 6. LEADERSHIP & TEAM SECTION ("Built by Entrepreneurs, for Entrepreneurs")
Two-column frosted glass profile cards with ambient avatar glow halo:
- Card 1 (Founder & Strategic Lead): Chidimma Amadi
  - Badges: "Founder" | "Diploma in Accounting & Payroll" | "Active Business Owner"
  - Bio: "Chidimma runs her own successful hair business alongside leading BookkeepingHub. Having built and managed operations from the ground up, she brings firsthand entrepreneurial empathy to financial management—knowing exactly what it takes to manage working capital, track overhead, and stay audit-ready while scaling."
- Card 2 (Lead Bookkeeper & Technical Strategist): Chinevu Amadi
  - Badges: "Expert Bookkeeper" | "MBA" | "8+ Years / 30+ Accounts"
  - Bio: "Master of accounting systems with over 8 years of dedicated experience managing 30+ active client accounts. Specializes in QuickBooks Online optimization, penny-exact bank reconciliations, and streamlined AP/AR workflows."
  - Action Badge: "Lead Consultation Host — Direct Call Scheduler"
### 7. BONUS VALUE-ADD FEATURES
- Interactive ROI / Time Saved Calculator: "Hours spent on manual bookkeeping per month" slider -> calculates estimated annual hours saved by outsourcing.
- Client Portal Preview Widget: Glass UI dashboard mockup showcasing financial graphs (P&L snapshot, cash flow status, reconciliation progress).
- FAQ Accordion: Covering QuickBooks migration, overage policies (no hidden fees), and catch-up bookkeeping.
### 8. FOOTER & BUSINESS PROFILE
- Location: 28 Whitwell Drive, Brampton, Ontario, Canada
- Direct Phone: +1 289 901 2092 | Direct Email: info@bookkeepinghub.ca
- Hours: Monday – Friday: 9:00 AM – 4:00 PM EST (Closed Sat/Sun).

Here are relevant images for the project... use/adapt the logo as needed and also set the favicon, and work on SEO/AI crawler meta optimisation as needed. Attached: favicon.png, team photos for Chinevu and Chidimma, and the Bookkeeping Hub banner logo.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bookkeepinghub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6fbf67f4-5601-4b55-a4cf-8efececac658).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
