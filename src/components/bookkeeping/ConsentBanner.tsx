import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { needsConsent, readConsent, saveConsent, syncPixel } from "@/lib/meta-pixel";

export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    void syncPixel();
    if (!readConsent()) needsConsent().then((n) => n && setOpen(true));
    const reopen = () => setOpen(true);
    const onStorage = (e: StorageEvent) => { if (e.key === "bh_cookie_consent") void syncPixel(); };
    window.addEventListener("bh-open-cookie-settings", reopen);
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener("bh-open-cookie-settings", reopen); window.removeEventListener("storage", onStorage); };
  }, []);

  if (!open) return null;
  const choose = (c: "granted" | "denied") => { saveConsent(c); setOpen(false); };

  return (
    <div role="dialog" aria-label="Cookie settings" className="glass-panel fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl p-5 text-sm sm:inset-x-auto sm:right-6">
      <p className="font-semibold">Advertising cookies</p>
      <p className="mt-2 leading-6 text-muted-foreground">
        With your permission, we use the Meta (Facebook) Pixel to measure visits and bookings from our ads and improve ad delivery. It shares page visits and booking actions with Meta. You can change this any time via “Cookie settings”. <Link to="/privacy" className="underline">Privacy policy</Link>
      </p>
      <div className="mt-4 flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => choose("denied")}>Reject</Button>
        <Button className="flex-1" onClick={() => choose("granted")}>Accept</Button>
      </div>
    </div>
  );
}

export const openCookieSettings = () => window.dispatchEvent(new Event("bh-open-cookie-settings"));
