import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy | BookkeepingHub" },
      { name: "description", content: "How BookkeepingHub handles visitor data, advertising cookies and the Meta Pixel." },
      { property: "og:title", content: "Privacy Policy | BookkeepingHub" },
      { property: "og:description", content: "How BookkeepingHub handles visitor data, advertising cookies and the Meta Pixel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 leading-7 text-muted-foreground">
      <Link to="/" className="text-sm text-primary">← Back to BookkeepingHub</Link>
      <h1 className="mt-6 text-4xl font-semibold text-foreground">Privacy Policy</h1>
      <p className="mt-6">BookkeepingHub (28 Whitwell Drive, Brampton, Ontario, Canada · info@bookkeepinghub.ca) explains here what data this website collects.</p>
      <h2 className="mt-10 text-xl font-semibold text-foreground">Booking details</h2>
      <p className="mt-3">Details you enter when booking a call (name, email, phone, business details) are used only to arrange and prepare for your consultation. They are not sent to Meta.</p>
      <h2 className="mt-10 text-xl font-semibold text-foreground">Meta Pixel (advertising)</h2>
      <p className="mt-3">We use the Meta Pixel, provided by Meta Platforms, to measure how our ads perform and to improve ad delivery. It sends Meta information such as pages viewed, when you open booking, complete a booking or click to contact us, plus your browser and device details and cookie identifiers.</p>
      <p className="mt-3">Visitors in the EU, EEA, UK and Switzerland are asked first, and the Pixel only runs if you accept. Elsewhere it runs by default; you can switch it off at any time.</p>
      <h2 className="mt-10 text-xl font-semibold text-foreground">Your choices</h2>
      <p className="mt-3">Use “Cookie settings” in the website footer to accept or withdraw consent at any time. We keep a record of your choice and when you made it on your device. You can also manage ad preferences in your Facebook settings.</p>
    </main>
  );
}
