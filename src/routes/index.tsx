import { createFileRoute } from "@tanstack/react-router";
import { BookkeepingHubPage } from "@/components/bookkeeping/BookkeepingHubPage";

export const Route = createFileRoute("/")({
  component: BookkeepingHubPage,
  head: () => ({
    meta: [
      { title: "BookkeepingHub | Virtual Bookkeeping in Brampton, Ontario" },
      { name: "description", content: "Clear, audit-ready bookkeeping, accounts payable, and accounts receivable support for growing businesses. Book a free 30-minute discovery call." },
      { property: "og:title", content: "BookkeepingHub | Clear Financials. Zero Guesswork." },
      { property: "og:description", content: "Virtual bookkeeping and accounting operations from Brampton, Ontario. Reconciled accounts, timely reports, and a same-day custom scope." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AccountingService",
        name: "BookkeepingHub",
        description: "Virtual bookkeeping, accounts payable, and accounts receivable services for growing businesses.",
        telephone: "+1-289-901-2092",
        email: "info@bookkeepinghub.ca",
        address: { "@type": "PostalAddress", streetAddress: "28 Whitwell Drive", addressLocality: "Brampton", addressRegion: "ON", addressCountry: "CA" },
        openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "16:00" }],
        areaServed: "Canada",
        priceRange: "$$",
      }),
    }],
  }),
});
