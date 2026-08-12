import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/",         label: "Home"      },
  { to: "/resources",label: "Resources" },
  { to: "/about",    label: "About"     },
  { to: "/contact",  label: "Contact"   },
] as const;

export function FlagStripe() {
  return <div className="flag-stripe" />;
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <FlagStripe />
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl gradient-navy text-lg">
              <span className="text-gold">☀</span>
            </span>
            <span className="text-lg font-bold tracking-tight text-navy">Kaagapay</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-navy"
                activeProps={{ className: "!text-navy bg-secondary" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link
            to="/submit"
            className="rounded-lg bg-navy px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-card transition-opacity hover:opacity-90 sm:text-sm"
          >
            Submit a Resource
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-auto bg-navy">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-bold text-gold">Kaagapay</p>
            <p className="mt-1 text-sm text-white/70">Kasama, Konektado, Para sa Lahat</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-gold">
                {item.label}
              </Link>
            ))}
            <Link to="/admin" className="hover:text-gold">
              Admin
            </Link>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
          Silang, Cavite · Region 4A · Made for the community
        </div>
      </footer>
    </div>
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