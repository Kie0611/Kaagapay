import { Link, NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import kaagapayLogo from "@/assets/kaagapay-logo.png";

export function FlagStripe() {
  return <div className="flag-stripe" />;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  const NAV = [
    { to: "/",          label: t("nav.home"),      end: true  },
    { to: "/resources", label: t("nav.resources"), end: false },
    { to: "/about",     label: t("nav.about"),     end: false },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <FlagStripe />
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={kaagapayLogo}
              alt="Kaagapay"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-navy${isActive ? " bg-secondary !text-navy" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link
              to="/submit"
              className="rounded-lg bg-navy px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-card transition-opacity hover:opacity-90 sm:text-sm"
            >
              {t("nav.submit")}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-auto bg-navy">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-bold text-gold">Kaagapay</p>
            <p className="mt-1 text-sm text-white/70">{t("footer.tagline")}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-gold">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
          Silang, Cavite · Region 4A · Made for the community
        </div>
      </footer>
    </div>
  );
}

export function LanguageToggle() {
  const { i18n } = useTranslation();

  function toggle() {
    const next = i18n.language === "tl" ? "en" : "tl";
    i18n.changeLanguage(next);
    localStorage.setItem("kaagapay-lang", next);
  }

  return (
    <button
      onClick={toggle}
      className="rounded-lg border border-border px-3 py-2 text-xs font-semibold
                 text-muted-foreground transition-colors hover:bg-secondary hover:text-navy"
    >
      {i18n.language === "tl" ? "🇵🇭 TL" : "🇺🇸 EN"}
    </button>
  );
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

export function SunWatermark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className}>
      <circle cx="100" cy="100" r="34" fill="#F7A800" />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 24;
        const inner = 42;
        const outer = i % 3 === 0 ? 92 : 70;
        return (
          <line
            key={i}
            x1={round(100 + Math.cos(angle) * inner)}
            y1={round(100 + Math.sin(angle) * inner)}
            x2={round(100 + Math.cos(angle) * outer)}
            y2={round(100 + Math.sin(angle) * outer)}
            stroke="#F7A800"
            strokeWidth={i % 3 === 0 ? 7 : 4}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}