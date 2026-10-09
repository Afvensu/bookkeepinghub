import { ArrowRight, BriefcaseBusiness, Clock3, House, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const painPoints = [
  ["Sent, then forgotten", "You send the invoice and move on to the next job. Nobody is watching the due date, and nobody notices when it passes."],
  ["Chasing payment is awkward", "You don’t want to strain a good customer relationship, so follow-ups slide. Thirty days turns into sixty, and sixty turns into a write-off."],
  ["No clear view of who owes what", "Progress billing, deposits, holdbacks and partial payments scattered across emails and spreadsheets. Payroll is due Friday and you’re guessing."],
];

const workflow = [
  ["Track", "Every invoice you send is logged with its amount, terms and due date, so nothing goes unwatched."],
  ["Remind", "Friendly reminders before and after each due date, in a tone that protects your customer relationships."],
  ["Follow up", "Persistent follow-up and collections tracking on overdue balances, escalated to you only when it needs your call."],
  ["Apply payments", "Every payment received is matched to its invoice in QuickBooks Online, including partial payments and holdback releases."],
  ["Report", "A monthly AR aging report showing who owes what, how late it is and what’s coming in next."],
];

const industries = [
  { icon: House, title: "Construction & general contractors", copy: "Progress draws, change orders and holdbacks tracked line by line, so nothing owed slips through." },
  { icon: Wrench, title: "Subcontractors & trades", copy: "Electrical, plumbing, HVAC, framing and more. You stay on the tools while we stay on the GC’s payables team." },
  { icon: BriefcaseBusiness, title: "Growing service businesses", copy: "Agencies, wholesalers and B2B sellers on net terms who need someone owning the follow-up." },
];

export function AccountsReceivableSections({ onBook }: { onBook: () => void }) {
  return (
    <>
      <section id="top" className="ar-opening relative mx-auto flex max-w-5xl flex-col items-center justify-center px-5 py-14 text-center lg:px-8 lg:py-20">
        <div className="relative z-10 flex flex-col items-center">
          <p className="eyebrow max-w-lg leading-6">Accounts receivable management · Brampton, ON · Serving Canada virtually</p>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] sm:text-6xl lg:text-7xl">You did the work.<br /><span className="text-highlight">We make sure you get paid for it.</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">You send the invoice. We take it from there: tracking every due date, following up on every overdue balance and logging every payment, so your cash flow stops depending on how much time you have to chase customers.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Button size="lg" onClick={onBook} className="h-auto min-h-14 whitespace-normal rounded-full px-6 py-3 text-sm">Book your free 30-min cash flow call <ArrowRight className="shrink-0" /></Button>
            <Button size="lg" variant="outline" asChild className="min-h-14 rounded-full bg-card/50 px-6"><a href="#services">See AR pricing</a></Button>
          </div>
          <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-muted-foreground"><Clock3 className="mt-1 size-4 shrink-0 text-primary" />Monday to Friday, 9:00 AM to 4:00 PM EST</p>
        </div>
      </section>

      <section className="border-y border-border bg-surface-band/55">
        <div className="section-shell">
          <p className="eyebrow">Sound familiar?</p>
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">Profitable on paper. Short on cash in the bank.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {painPoints.map(([title, copy], index) => <article key={title} className="service-card"><p className="text-sm font-semibold text-gold">0{index + 1}</p><h3 className="mt-6 text-xl font-semibold leading-7">{title}</h3><p className="mt-4 text-base leading-7 text-muted-foreground">{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section-shell" id="receivables-process">
        <div className="section-heading"><div><p className="eyebrow">Accounts receivable management</p><h2>You send the invoice. We handle everything after.</h2></div><p>Keep billing the way you already do. The moment an invoice leaves your hands, we own it until the money lands.</p></div>
        <ol className="mt-12 grid gap-8 border-t border-primary/40 pt-8 md:grid-cols-2 lg:grid-cols-5">
          {workflow.map(([title, copy], index) => <li key={title}><p className="text-xs font-semibold uppercase text-gold">Step {index + 1}</p><h3 className="mt-6 text-xl font-semibold">{title}</h3><p className="mt-4 text-sm leading-7 text-muted-foreground">{copy}</p></li>)}
        </ol>
      </section>

      <section className="border-y border-border bg-surface-band/55">
        <div className="section-shell">
          <p className="eyebrow">Who we help</p>
          <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">Built for businesses that bill after the work is done.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {industries.map(({ icon: Icon, title, copy }) => <article key={title} className="service-card"><Icon className="size-8 text-gold" /><h3 className="mt-7 text-xl font-semibold leading-8">{title}</h3><p className="mt-4 text-base leading-7 text-muted-foreground">{copy}</p></article>)}
          </div>
        </div>
      </section>
    </>
  );
}