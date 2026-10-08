import { createFileRoute } from "@tanstack/react-router";
import { BookkeepingHubPage } from "@/components/bookkeeping/BookkeepingHubPage";

export const Route = createFileRoute("/")({
  component: BookkeepingHubPage,
  head: () => ({
    meta: [
      { title: "BookkeepingHub | Accounts Receivable & Virtual Bookkeeping" },
      { name: "description", content: "Accounts receivable management and virtual bookkeeping from Brampton, Ontario. Invoice tracking, payment follow-up and clear reports for growing Canadian businesses." },
      { property: "og:title", content: "BookkeepingHub | Accounts Receivable & Virtual Bookkeeping" },
      { property: "og:description", content: "You did the work. We make sure you get paid for it. Accounts receivable support, reconciled books and clear financial reporting. Book a free 30-minute call." },
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
