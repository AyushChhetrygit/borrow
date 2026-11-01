import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Logo } from "./Logo";
import { useStore } from "../context/StoreContext";
import { ACTIVE_STATUSES } from "../utils";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/catalogue", label: "Explore Catalogue" },
  { to: "/#categories", label: "Categories", hash: true },
  { to: "/#how-it-works", label: "How It Works", hash: true },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const { orders, myOrderIds } = useStore();
  const activeMine = orders.filter((o) => myOrderIds.includes(o.id) && ACTIVE_STATUSES.includes(o.status)).length;

  useEffect(() => setOpen(false), [loc.pathname, loc.hash]);

  const linkCls = (active: boolean) =>
    `rounded-full px-3.5 py-2 text-sm font-semibold transition ${
      active ? "bg-forest text-white" : "text-forest hover:bg-cream"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {LINKS.map((l) =>
            l.hash ? (
              <Link key={l.label} to={l.to} className={linkCls(false)}>
                {l.label}
              </Link>
            ) : (
              <NavLink key={l.label} to={l.to} end={l.end} className={({ isActive }) => linkCls(isActive && !loc.hash)}>
                {l.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/orders" className="relative rounded-full p-2.5 text-forest hover:bg-cream" aria-label="My orders and tracking" title="My orders">
            <ShoppingBag className="h-5 w-5" />
            {activeMine > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-forest">
                {activeMine}
              </span>
            )}
          </Link>
          {/* Admin dashboard link intentionally hidden from the public site. */}
          <button className="rounded-full p-2.5 hover:bg-cream lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-forest/10 bg-white px-4 pb-4 pt-2 lg:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link key={l.label} to={l.to} className="rounded-xl px-3 py-3 text-base font-semibold hover:bg-cream">
                {l.label}
              </Link>
            ))}
            <Link to="/orders" className="rounded-xl px-3 py-3 text-base font-semibold hover:bg-cream">
              My orders {activeMine > 0 && `(${activeMine} active)`}
            </Link>
            {/* Admin dashboard link intentionally hidden from the public site. */}
          </div>
        </nav>
      )}
    </header>
  );
}
