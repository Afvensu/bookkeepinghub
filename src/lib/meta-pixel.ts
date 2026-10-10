// Meta Pixel with regional consent. Consent regions: EU/EEA, UK, Switzerland.
const PIXEL_ID = "1453386943348882";
const CONSENT_KEY = "bh_cookie_consent";
export const CONSENT_NOTICE_VERSION = "2026-10-10";
const CONSENT_COUNTRIES = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","IS","LI","NO","GB","CH",
]);

export type ConsentRecord = { choice: "granted" | "denied"; at: string; notice: string; history?: { choice: string; at: string; notice: string }[] };

let regionPromise: Promise<boolean> | null = null;
let loaded = false;

export function needsConsent(): Promise<boolean> {
  if (!regionPromise) {
    regionPromise = (async () => {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 2000);
        const res = await fetch("/cdn-cgi/trace", { signal: ctrl.signal });
        clearTimeout(t);
        if (!res.ok) return true;
        const loc = /loc=([A-Z0-9]+)/.exec(await res.text())?.[1];
        if (!loc || loc === "XX" || loc === "T1") return true;
        return CONSENT_COUNTRIES.has(loc);
      } catch {
        return true;
      }
    })();
  }
  return regionPromise;
}

export function readConsent(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as ConsentRecord) : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: "granted" | "denied") {
  const prev = readConsent();
  const history = prev ? [...(prev.history ?? []), { choice: prev.choice, at: prev.at, notice: prev.notice }] : [];
  const rec: ConsentRecord = { choice, at: new Date().toISOString(), notice: CONSENT_NOTICE_VERSION, history };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(rec));
  window.dispatchEvent(new Event("bh-consent-change"));
  void syncPixel();
}

async function allowed(): Promise<boolean> {
  const rec = readConsent();
  if (rec?.choice === "denied") return false;
  if (rec?.choice === "granted") return true;
  return !(await needsConsent());
}

function loadPixel() {
  if (loaded) return;
  loaded = true;
  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); });
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement; t.async = true; t.src = v;
    const s = b.getElementsByTagName(e)[0]; s?.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */
  const fbq = (window as any).fbq;
  fbq("consent", "grant");
  fbq("init", PIXEL_ID);
  fbq("track", "PageView");
}

export async function syncPixel() {
  const ok = await allowed();
  const fbq = (window as any).fbq;
  if (ok) { if (loaded) fbq?.("consent", "grant"); else loadPixel(); }
  else if (loaded) fbq?.("consent", "revoke");
}

export async function trackEvent(name: "Lead" | "Schedule" | "Contact" | "InitiateCheckout") {
  if (typeof window === "undefined" || !(await allowed())) return;
  if (!loaded) loadPixel();
  (window as any).fbq?.("track", name);
}
