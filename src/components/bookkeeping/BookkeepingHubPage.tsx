import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  FileCheck2,
  Landmark,
  Mail,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  WalletCards,
  X,
} from "lucide-react";
import { z } from "zod";
import { trackEvent } from "@/lib/meta-pixel";
import { ConsentBanner, openCookieSettings } from "./ConsentBanner";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { PremiumCursor } from "./PremiumCursor";
import { AccountsReceivableSections } from "./AccountsReceivableSections";

type ServiceKey = "bookkeeping" | "ap" | "ar";

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const baseHeroSeries = [42, 55, 46, 68, 61, 78, 88, 81, 96, 92, 108, 118];
const basePlSeries = [38, 52, 48, 64, 58, 76, 71, 87, 80, 98, 92, 112];
const activityFeed = [
  "Auto-matched 14 transactions via QuickBooks Online",
  "TD business chequing reconciled to $0.00 variance",
  "Vendor bill scheduled for Friday payment run",
  "Customer invoice marked paid · AR aging updated",
];

const services = [
  {
    key: "bookkeeping" as const,
    icon: ReceiptText,
    label: "Monthly Bookkeeping",
    price: 300,
    description: "Clean books, closed every month, with every account reconciled.",
    features: ["1 checking + 1 credit card account", "Unlimited transactions", "Monthly financial reports", "Zero transaction caps"],
  },
  {
    key: "ar" as const,
    icon: Banknote,
    label: "Accounts Receivable",
    price: 700,
    description: "Professional invoicing and follow-up that protects cash flow.",
    features: ["Customer invoicing", "Payment follow-up", "Collections tracking", "AR aging visibility"],
  },
];

const intakeSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid business email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  businessName: z.string().trim().min(2, "Enter your business name").max(120),
  industry: z.string().trim().min(2, "Enter your industry").max(80),
  software: z.enum(["QuickBooks Online", "Xero", "FreshBooks", "None"]),
  volume: z.string().trim().min(1, "Select a monthly transaction range"),
});

type Intake = z.infer<typeof intakeSchema>;
type IntakeErrors = Partial<Record<keyof Intake, string>>;

const defaultIntake: Intake = {
  fullName: "",
  email: "",
  phone: "",
  businessName: "",
  industry: "",
  software: "QuickBooks Online",
  volume: "",
};

const serviceLinks = [
  ["Accounts Receivable", "#top"],
  ["Monthly Bookkeeping", "#bookkeeping"],
];

const navLinks = [
  ["Process", "#process"],
  ["Team", "#team"],
  ["FAQ", "#faq"],
];

const trustItems = [
  [BadgeCheck, "QuickBooks Online Certified"],
  [Users, "30+ Active Client Accounts"],
  [Clock3, "Same-Day Custom Scoping"],
  [ShieldCheck, "100% Audit-Ready Reconciliation"],
] as const;

function nextBusinessDays(count: number) {
  const result: string[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 1);
  while (result.length < count) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) result.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
}

function formatDate(date: string, style: "short" | "long" = "long") {
  return new Intl.DateTimeFormat("en-CA", {
    weekday: style === "short" ? "short" : "long",
    month: style === "short" ? "short" : "long",
    day: "numeric",
    year: style === "long" ? "numeric" : undefined,
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

function displayPrice(cad: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(cad);
}

function drift(base: number, spread: number) {
  return Math.max(12, Math.round(base + (Math.random() - 0.5) * spread * 2));
}

function addThirtyMinutes(time: string) {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  const total = hours * 60 + minutes + 30;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function humanTime(time: string) {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return `${hours > 12 ? hours - 12 : hours}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
}

export function BookkeepingHubPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<ServiceKey[]>(["bookkeeping"]);
  const [extraAccounts, setExtraAccounts] = useState(0);
  const [catchUp, setCatchUp] = useState(false);
  const [hours, setHours] = useState(12);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [dates, setDates] = useState<string[]>([]);
  const [activeWeek, setActiveWeek] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [intake, setIntake] = useState<Intake>(defaultIntake);
  const [errors, setErrors] = useState<IntakeErrors>({});
  const [scrolled, setScrolled] = useState(false);
  const [heroSeries, setHeroSeries] = useState(baseHeroSeries);
  const [plSeries, setPlSeries] = useState(basePlSeries);
  const [activeBar, setActiveBar] = useState(11);
  const [activityIndex, setActivityIndex] = useState(0);
  const [netIncome, setNetIncome] = useState(18420);
  const [cashOnHand, setCashOnHand] = useState(42680);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setDates(nextBusinessDays(20)), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveBar((current) => (current + 1) % 12);
      setActivityIndex((current) => (current + 1) % activityFeed.length);
      setHeroSeries((current) => current.map((value, index) => drift(baseHeroSeries[index] ?? value, 5)));
      setPlSeries((current) => current.map((value, index) => drift(basePlSeries[index] ?? value, 5)));
      setNetIncome(() => 18420 + Math.round((Math.random() - 0.5) * 120));
      setCashOnHand(() => 42680 + Math.round((Math.random() - 0.5) * 260));
    }, 2600);
    return () => window.clearInterval(timer);
  }, []);

  const weeks = useMemo(() => {
    const grouped: string[][] = [];
    for (let index = 0; index < dates.length; index += 5) grouped.push(dates.slice(index, index + 5));
    return grouped;
  }, [dates]);




  const estimate = useMemo(
    () => selectedServices.reduce((total, key) => total + (services.find((service) => service.key === key)?.price ?? 0), 0) + extraAccounts * 50,
    [selectedServices, extraAccounts],
  );

  const slots = useMemo(
    () => Array.from({ length: 14 }, (_, index) => {
      const total = 9 * 60 + index * 30;
      return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
    }),
    [],
  );

  const openBooking = () => { setBookingOpen(true); void trackEvent("InitiateCheckout"); };

  const toggleService = (key: ServiceKey) => {
    setSelectedServices((current) =>
      current.includes(key) ? (current.length === 1 ? current : current.filter((item) => item !== key)) : [...current, key],
    );
  };

  const updateIntake = (field: keyof Intake, value: string) => {
    setIntake((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submitIntake = () => {
    const result = intakeSchema.safeParse(intake);
    if (!result.success) {
      const nextErrors: IntakeErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof Intake;
        if (!nextErrors[field]) nextErrors[field] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }
    setBookingStep(3);
    void trackEvent("Schedule");
    void trackEvent("Lead");
  };

  const resetBooking = () => {
    setBookingStep(1);
    setSelectedDate("");
    setSelectedTime("");
    setIntake(defaultIntake);
    setErrors({});
  };

  const calendarDetails = useMemo(() => {
    if (!selectedDate || !selectedTime) return null;
    const endTime = addThirtyMinutes(selectedTime);
    const compactDate = selectedDate.replaceAll("-", "");
    const start = `${compactDate}T${selectedTime.replace(":", "")}00`;
    const end = `${compactDate}T${endTime.replace(":", "")}00`;
    const title = "BookkeepingHub Discovery Call";
    const details = "30-minute financial discovery call with Chinevu Amadi, MBA, Lead Bookkeeper.";
    const location = "Zoho Meeting — access link included in confirmation";
    return { start, end, title, details, location };
  }, [selectedDate, selectedTime]);

  const downloadIcs = () => {
    if (!calendarDetails) return;
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//BookkeepingHub//Discovery Call//EN",
      "BEGIN:VEVENT",
      `DTSTART;TZID=America/Toronto:${calendarDetails.start}`,
      `DTEND;TZID=America/Toronto:${calendarDetails.end}`,
      `SUMMARY:${calendarDetails.title}`,
      `DESCRIPTION:${calendarDetails.details}`,
      `LOCATION:${calendarDetails.location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "bookkeepinghub-discovery-call.ics";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const googleCalendarUrl = calendarDetails
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarDetails.title)}&dates=${calendarDetails.start}/${calendarDetails.end}&details=${encodeURIComponent(calendarDetails.details)}&location=${encodeURIComponent(calendarDetails.location)}&ctz=America%2FToronto`
    : "#";

  return (
      <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <PremiumCursor />
      <div className="ambient-bg" aria-hidden="true" />
            <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled
            ? "border-b border-border/80 bg-background/70 backdrop-blur-xl shadow-lg shadow-black/20"
            : "border-b border-transparent bg-transparent backdrop-blur-none"
        )}
      >

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#top" className="flex items-center" aria-label="BookkeepingHub home">
            <img src="/logo.png" alt="BookkeepingHub" className="h-11 w-auto max-w-[190px] rounded-sm bg-logo-surface object-contain px-2" />
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            <div className="group relative">
              <button type="button" className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group-focus-within:text-foreground">Services <ChevronRight className="size-3.5 rotate-90" /></button>
              <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="glass-panel flex flex-col p-2">
                  {serviceLinks.map(([label, href]) => <a key={href} href={href} className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">{label}</a>)}
                </div>
              </div>
            </div>
            {navLinks.map(([label, href]) => (
              <a key={href} href={href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{label}</a>
            ))}
          </nav>
          <div className="hidden lg:block">
            <Button onClick={openBooking} className="h-11 rounded-full px-5">Book a free call <ArrowRight /></Button>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle navigation">
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {mobileOpen && (
          <nav className="border-t border-border bg-background px-5 py-5 lg:hidden" aria-label="Mobile navigation">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <p className="px-3 pt-2 text-xs font-semibold uppercase text-muted-foreground">Services</p>
              {serviceLinks.map(([label, href]) => <a key={href} href={href} onClick={() => setMobileOpen(false)} className="rounded-md px-6 py-2.5 text-sm hover:bg-accent">{label}</a>)}
              {navLinks.map(([label, href]) => (
                <a key={href} href={href} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-3 text-sm font-medium hover:bg-accent">{label}</a>
              ))}
              <Button onClick={() => { setMobileOpen(false); openBooking(); }} className="mt-3">Book a free call</Button>
            </div>
          </nav>
        )}
      </header>

      <AccountsReceivableSections onBook={openBooking} />

      <section id="bookkeeping" className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-14 sm:min-h-[760px] lg:grid-cols-[1.12fr_0.88fr] lg:px-8 lg:py-20">
        <div className="relative z-10">
          <div className="eyebrow mb-6"><Sparkles /> Virtual bookkeeping for growing businesses</div>
          <h2 className="max-w-4xl text-4xl font-semibold leading-[1.06] tracking-normal sm:text-6xl lg:text-7xl">Clear financials.<br /><span className="text-highlight">Reconciled accounts.</span><br />Zero guesswork.</h2>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">We keep your accounts reconciled down to the penny, your reports on time, and your finances crystal clear—so you can run the business instead of chasing the numbers.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={openBooking} className="h-14 rounded-full px-7 text-base">Book Free 30-Min Discovery Call <ArrowRight /></Button>
            <Button size="lg" variant="outline" asChild className="h-14 rounded-full border-border bg-card/50 px-7 text-base backdrop-blur-xl">
              <a href="#services">View Services & Pricing</a>
            </Button>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="size-4 text-primary" /> Monday–Friday, 9:00 AM–4:00 PM EST</p>
        </div>
        <div className="relative mx-auto hidden w-full max-w-xl sm:block">
          <div className="glass-panel relative overflow-hidden p-5 sm:p-7">
            <div className="mb-8 flex items-center justify-between">
              <div><p className="text-xs font-semibold uppercase text-muted-foreground">Month-end close</p><p className="mt-1 text-2xl font-semibold">Financial clarity</p></div>
              <div className="status-pill"><span className="live-dot" /> Reconciled</div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="metric-panel sm:col-span-2">
                <div className="flex items-start justify-between"><div><p className="text-sm text-muted-foreground">Cash flow status</p><p className="mt-2 text-3xl font-semibold">Healthy</p></div><TrendingUp className="size-7 text-primary" /></div>
                <div className="mt-8 flex h-28 items-end gap-2" aria-label="Cash flow chart preview">
                  {heroSeries.map((height, index) => <span key={index} title={`${monthLabels[index]} · $${(height * 220).toLocaleString("en-CA")}`} className={cn("chart-bar flex-1", activeBar === index && "chart-bar-active")} style={{ height, animationDelay: `${index * 140}ms` }} />)}
                </div>
                <p key={activeBar} className="ticker-line mt-4 text-xs text-muted-foreground">{monthLabels[activeBar]} reconciled · ${(((heroSeries[activeBar] ?? 0) * 220)).toLocaleString("en-CA")} net movement</p>
              </div>
              <div className="metric-panel"><p className="text-sm text-muted-foreground">Accounts matched</p><p className="mt-3 text-3xl font-semibold">100%</p><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full w-full bg-primary" /></div></div>
              <div className="metric-panel"><p className="text-sm text-muted-foreground">Books closed</p><p className="mt-3 text-3xl font-semibold">On time</p><p className="mt-5 text-xs text-primary">Ready for review</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-surface-band/55">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-5 py-8 lg:grid-cols-4 lg:px-8">
          {trustItems.map(([Icon, text]) => <div key={text} className="flex items-center gap-3 px-2 py-4 sm:px-5"><Icon className="size-5 shrink-0 text-gold" /><span className="text-xs font-semibold leading-5 sm:text-sm">{text}</span></div>)}
        </div>
      </section>

      <section id="services" className="section-shell">
        <div className="section-heading"><div><p className="eyebrow">Built around your workflow</p><h2>Expert support where your books need it most.</h2></div><p>Choose one focused service or combine both for complete, worry-free finances.</p></div>
        <div className="mt-12 grid gap-5 mx-auto max-w-4xl md:grid-cols-2">
          {services.map(({ key, icon: Icon, label, price, description, features }) => (
            <article key={key} className={"service-card"}>
              <div className="flex items-start justify-between"><div className="icon-box"><Icon /></div><span className="text-xs font-semibold uppercase text-muted-foreground">From {displayPrice(price)}/mo CAD</span></div>
              <h3 className="mt-8 text-2xl font-semibold">{label}</h3><p className="mt-3 min-h-14 text-sm leading-6 text-muted-foreground">{description}</p>
              <ul className="mt-7 space-y-3">{features.map((feature) => <li key={feature} className="flex gap-3 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{feature}</li>)}</ul>
              <Button onClick={openBooking} className="mt-8 w-full rounded-full">Book discovery call <ArrowRight /></Button>
            </article>
          ))}
        </div>
      </section>

      <section id="process" className="border-y border-border bg-surface-band/55">
        <div className="section-shell"><div className="section-heading"><div><p className="eyebrow">A clear path forward</p><h2>From first call to clean books in four steps.</h2></div><p>No opaque process. You always know what comes next and what we need from you.</p></div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["01", "Book a Consultation Call", "Choose a 30-minute time slot directly."],
              ["02", "Business Discovery & Financial Health Check", "We understand your operations, pain points, and priorities."],
              ["03", "Share Financial Access", "Connect QuickBooks Online and your latest 3 months of bank statements."],
              ["04", "Get Your Custom Quote Same-Day", "Receive a clear scope built around your exact workflow."],
            ].map(([number, title, copy], index) => <article key={number} className="step-card"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-gold">{number}</span>{index < 3 && <ChevronRight className="hidden size-5 text-muted-foreground xl:block" />}</div><h3 className="mt-9 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section-shell mx-auto max-w-3xl">
        <div className="glass-panel p-7 sm:p-10"><p className="eyebrow">Time-saved calculator</p><h2 className="mt-5 text-3xl font-semibold">Get your month back.</h2><p className="mt-4 leading-7 text-muted-foreground">How many hours do you spend on manual bookkeeping each month?</p><div className="mt-10 flex items-end justify-between"><span className="text-6xl font-semibold">{hours}</span><span className="pb-2 text-sm text-muted-foreground">hours / month</span></div><Slider className="mt-7" value={[hours]} onValueChange={([value]) => setHours(value ?? 1)} min={1} max={40} step={1} aria-label="Monthly bookkeeping hours" /><div className="mt-9 border-t border-border pt-7"><p className="text-sm text-muted-foreground">Estimated annual time reclaimed</p><p className="mt-2 text-4xl font-semibold text-highlight">{hours * 12} hours</p><p className="mt-3 text-sm leading-6 text-muted-foreground">That’s approximately {Math.round((hours * 12) / 8)} full workdays redirected to your business.</p></div></div>
      </section>

      <section id="team" className="border-y border-border bg-surface-band/55"><div className="section-shell"><div className="mx-auto max-w-3xl text-center"><p className="eyebrow justify-center">Leadership</p><h2 className="mt-5 text-4xl font-semibold sm:text-5xl">Built by entrepreneurs, for entrepreneurs.</h2><p className="mt-5 leading-7 text-muted-foreground">Practical business empathy meets technical accounting depth.</p></div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <TeamCard image="/chidimma.jpg" name="Chidimma Amadi" role="Founder & Strategic Lead" imagePosition="object-[center_32%] scale-[1.22]" badges={["Founder", "Diploma in Accounting & Payroll", "Active Business Owner"]}>Chidimma runs her own successful hair business alongside leading BookkeepingHub. Having built and managed operations from the ground up, she brings firsthand entrepreneurial empathy to financial management—knowing exactly what it takes to manage working capital, track overhead, and stay audit-ready while scaling.</TeamCard>
          <TeamCard image="/chinevu.jpg" name="Chinevu Amadi" role="Lead Bookkeeper & Technical Strategist" imagePosition="object-[center_20%]" badges={["Expert Bookkeeper", "MBA", "8+ Years / 30+ Accounts"]} action="Lead Consultation Host — Direct Call Scheduler" onAction={openBooking}>Master of accounting systems with over 8 years of dedicated experience managing 30+ active client accounts. Specializes in QuickBooks Online optimization, penny-exact bank reconciliations, and streamlined AP/AR workflows.</TeamCard>
        </div></div>
      </section>

      <section id="faq" className="section-shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr]"><div><p className="eyebrow">Straight answers</p><h2 className="mt-5 text-4xl font-semibold">Questions before we talk?</h2><p className="mt-5 leading-7 text-muted-foreground">Here are the details clients ask us about most often.</p></div><Accordion type="single" collapsible className="border-t border-border">{[
        ["Can you migrate us to QuickBooks Online?", "Yes. We can help organize and migrate your existing records into QuickBooks Online, then configure a clean chart of accounts and reconciliation workflow. The exact migration scope is confirmed during discovery."],
        ["Do you charge transaction overage fees?", "No. Monthly Bookkeeping includes unlimited transactions with zero caps. Your price is based on service complexity and account count—not surprise transaction overages."],
        ["What if our books are several months behind?", "Catch-up bookkeeping is scoped separately during the discovery call. We review the period, volume, and condition of the records, then provide a clear one-time quote before work begins."],
        ["Can we combine bookkeeping with AP and AR support?", "Absolutely. Select any combination in the estimator. We will validate the workflow and responsibilities with you before confirming the final monthly scope."],
      ].map(([question, answer], index) => <AccordionItem key={question} value={`item-${index}`}><AccordionTrigger className="py-6 text-base sm:text-lg">{question}</AccordionTrigger><AccordionContent className="max-w-2xl pb-6 leading-7 text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}</Accordion></section>

      <section className="section-shell pt-0"><div className="cta-band"><div><p className="eyebrow">Your books can feel lighter</p><h2 className="mt-5 max-w-2xl text-4xl font-semibold sm:text-5xl">One clear conversation starts the process.</h2><p className="mt-5 max-w-2xl leading-7 text-muted-foreground">Bring your questions. We’ll bring clarity, a practical next step, and a same-day custom scope.</p></div><Button size="lg" onClick={openBooking} className="h-14 shrink-0 rounded-full px-7">Book your free call <ArrowRight /></Button></div></section>

      <footer className="border-t border-border bg-surface-band/70"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8"><div><img src="/logo.png" alt="BookkeepingHub" className="h-14 w-auto max-w-[230px] rounded-sm bg-logo-surface object-contain px-2" /><p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">Virtual bookkeeping and accounting operations for owners who want dependable numbers and a clearer view of their business.</p></div><div><p className="text-sm font-semibold">Contact</p><div className="mt-5 space-y-4 text-sm text-muted-foreground"><a className="flex gap-3 hover:text-foreground" href="tel:+12899012092" onClick={() => void trackEvent("Contact")}><Phone className="size-4 text-primary" />+1 289 901 2092</a><a className="flex gap-3 hover:text-foreground" href="mailto:info@bookkeepinghub.ca" onClick={() => void trackEvent("Contact")}><Mail className="size-4 text-primary" />info@bookkeepinghub.ca</a><p className="flex gap-3"><MapPin className="size-4 shrink-0 text-primary" />28 Whitwell Drive, Brampton, Ontario, Canada</p></div></div><div><p className="text-sm font-semibold">Business hours</p><p className="mt-5 text-sm leading-6 text-muted-foreground">Monday–Friday<br />9:00 AM–4:00 PM EST<br /><span className="text-foreground">Closed Saturday & Sunday</span></p></div></div><div className="border-t border-border"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between lg:px-8"><span>© {new Date().getFullYear()} BookkeepingHub. All rights reserved.</span><span className="flex gap-4"><a href="/privacy" className="hover:text-foreground">Privacy policy</a><button type="button" onClick={openCookieSettings} className="hover:text-foreground">Cookie settings</button><span>Brampton, Ontario</span></span></div></div></footer>
      <ConsentBanner />

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto border-border bg-background/95 p-0 backdrop-blur-xl sm:rounded-lg">
          <div className="border-b border-border px-5 py-5 sm:px-8"><DialogHeader><div className="mb-4 flex items-center gap-2 pr-8">{[1,2,3].map((step) => <div key={step} className="flex flex-1 items-center gap-2"><span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold", bookingStep >= step ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground")}>{bookingStep > step ? <Check className="size-3.5" /> : step}</span>{step < 3 && <span className={cn("h-px flex-1", bookingStep > step ? "bg-primary" : "bg-border")} />}</div>)}</div><DialogTitle className="text-2xl">{bookingStep === 1 ? "Choose your discovery call" : bookingStep === 2 ? "Tell us about your business" : "You’re booked"}</DialogTitle><DialogDescription>{bookingStep === 1 ? "Select a weekday and an available 30-minute slot." : bookingStep === 2 ? "A few details help Chinevu make your call more useful." : "Your consultation details are ready to add to your calendar."}</DialogDescription></DialogHeader></div>
          <div className="p-5 sm:p-8">
            {bookingStep === 1 && <div><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-medium">Choose a weekday · next four weeks</p><div className="flex flex-wrap gap-2">{weeks.map((_, index) => <Button key={index} size="sm" variant={activeWeek === index ? "default" : "outline"} onClick={() => setActiveWeek(index)} className="rounded-full px-4 text-xs">Week {index + 1}</Button>)}</div></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{(weeks[activeWeek] ?? []).map((date) => <Button key={date} variant={selectedDate === date ? "default" : "outline"} onClick={() => {setSelectedDate(date); setSelectedTime("");}} className="h-auto min-h-16 flex-col gap-1 py-2"><span className="text-xs opacity-70">{formatDate(date,"short").split(",")[0]}</span><span>{formatDate(date,"short").split(",").slice(1).join(",")}</span></Button>)}</div>{selectedDate && <div className="mt-8"><p className="mb-4 text-sm font-medium">Available times · EST</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{slots.map((time,index) => <Button key={time} variant={selectedTime === time ? "default" : "outline"} disabled={[3,8,11].includes(index)} onClick={() => setSelectedTime(time)}>{humanTime(time)}</Button>)}</div><p className="mt-3 text-xs text-muted-foreground">Unavailable times are already reserved.</p></div>}<Button size="lg" className="mt-8 w-full" disabled={!selectedDate || !selectedTime} onClick={() => setBookingStep(2)}>Continue to intake <ArrowRight /></Button></div>}
            {bookingStep === 2 && <div><div className="mb-6 flex flex-wrap items-center gap-2 rounded-md border border-border bg-card/40 p-3 text-sm"><CalendarDays className="size-4 text-primary" /><span>{formatDate(selectedDate)} at {humanTime(selectedTime)} EST</span><span className="text-muted-foreground">· 30 minutes</span></div><div className="grid gap-5 sm:grid-cols-2"><Field label="Full name" error={errors.fullName}><Input value={intake.fullName} onChange={(event) => updateIntake("fullName", event.target.value)} maxLength={100} autoComplete="name" /></Field><Field label="Business email" error={errors.email}><Input type="email" value={intake.email} onChange={(event) => updateIntake("email", event.target.value)} maxLength={255} autoComplete="email" /></Field><Field label="Phone number" error={errors.phone}><Input type="tel" value={intake.phone} onChange={(event) => updateIntake("phone", event.target.value)} maxLength={30} autoComplete="tel" /></Field><Field label="Business name" error={errors.businessName}><Input value={intake.businessName} onChange={(event) => updateIntake("businessName", event.target.value)} maxLength={120} autoComplete="organization" /></Field><Field label="Industry" error={errors.industry}><Input value={intake.industry} onChange={(event) => updateIntake("industry", event.target.value)} maxLength={80} placeholder="e.g. Construction" /></Field><Field label="Monthly transaction volume" error={errors.volume}><select value={intake.volume} onChange={(event) => updateIntake("volume", event.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">Select range</option><option>Under 100</option><option>100–300</option><option>301–600</option><option>600+</option></select></Field></div><div className="mt-5"><p className="mb-3 text-sm font-medium">Accounting software</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{(["QuickBooks Online","Xero","FreshBooks","None"] as Intake["software"][]).map((software) => <Button key={software} variant={intake.software === software ? "default" : "outline"} onClick={() => updateIntake("software", software)} className="h-auto min-h-12 whitespace-normal px-2 py-2 text-xs">{software}</Button>)}</div></div><div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row"><Button variant="outline" onClick={() => setBookingStep(1)} className="sm:w-1/3">Back</Button><Button onClick={submitIntake} className="sm:w-2/3">Confirm free consultation <CheckCircle2 /></Button></div></div>}
            {bookingStep === 3 && <div className="text-center"><div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary"><CheckCircle2 className="size-8" /></div><p className="mt-6 text-sm font-semibold uppercase text-primary">Instant confirmation</p><h3 className="mt-2 text-3xl font-semibold">See you soon, {intake.fullName.split(" ")[0]}.</h3><p className="mx-auto mt-3 max-w-md leading-7 text-muted-foreground">Your 30-minute discovery call is set for {formatDate(selectedDate)} at {humanTime(selectedTime)} EST.</p><div className="mx-auto mt-7 flex max-w-md items-center gap-4 rounded-md border border-border bg-card/45 p-4 text-left"><img src="/chinevu.jpg" alt="Chinevu Amadi" className="size-16 rounded-full object-cover object-top" /><div><p className="font-semibold">Chinevu Amadi, MBA</p><p className="text-sm text-muted-foreground">Lead Bookkeeper · Your consultation host</p></div></div><div className="mt-7 grid gap-3 sm:grid-cols-3"><Button asChild><a href={googleCalendarUrl} target="_blank" rel="noreferrer"><CalendarDays /> Google Calendar</a></Button><Button variant="outline" onClick={downloadIcs}><Download /> Apple / .ics</Button><Button variant="outline" asChild><a href="https://meeting.zoho.com/" target="_blank" rel="noreferrer"><Video /> Meeting access</a></Button></div><Button variant="ghost" className="mt-5" onClick={resetBooking}>Book another time</Button></div>}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error: string | undefined; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium">{label}</span>{children}{error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}</label>;
}

function TeamCard({ image, name, role, badges, action, onAction, imagePosition = "object-top", children }: { image: string; name: string; role: string; badges: string[]; action?: string; onAction?: () => void; imagePosition?: string; children: React.ReactNode }) {
  return <article className="team-card"><div className="relative shrink-0 overflow-hidden rounded-md"><div className="avatar-halo" /><img src={image} alt={`${name}, ${role}`} className={`relative h-64 w-full object-cover sm:h-72 lg:w-56 ${imagePosition}`} /></div><div className="flex flex-1 flex-col"><p className="text-xs font-semibold uppercase text-gold">{role}</p><h3 className="mt-2 text-3xl font-semibold">{name}</h3><div className="mt-4 flex flex-wrap gap-2">{badges.map((badge) => <span key={badge} className="badge-chip">{badge}</span>)}</div><p className="mt-6 flex-1 text-sm leading-7 text-muted-foreground">{children}</p>{action && <Button variant="outline" onClick={onAction} className="mt-6 h-auto justify-start whitespace-normal py-3 text-left"><CalendarDays className="shrink-0" />{action}</Button>}</div></article>;
}
