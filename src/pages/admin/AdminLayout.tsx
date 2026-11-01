import { useEffect, useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Menu,
  PackageSearch,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Store,
  Users,
  X,
} from "lucide-react";
import { LogoMark } from "../../components/Logo";
import { useStore } from "../../context/StoreContext";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: PackageSearch },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();
  const { settings } = useStore();
  useEffect(() => setMobileOpen(false), [loc.pathname]);
  useEffect(() => window.scrollTo(0, 0), [loc.pathname]);

  const sidebar = (compact: boolean) => (
    <div className="flex h-full flex-col bg-forest text-white">
      <div className={`flex h-16 items-center ${compact ? "justify-center" : "gap-2.5 px-5"}`}>
        <LogoMark className="h-9 w-9 shrink-0" />
        {!compact && (
          <div className="leading-tight">
            <p className="font-display text-lg font-extrabold">{settings.businessName}</p>
            <p className="text-xs text-gold">Admin dashboard</p>
          </div>
        )}
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={label}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${compact ? "justify-center" : ""} ${
                isActive ? "bg-gold text-forest" : "text-white/80 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!compact && label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          to="/"
          title="View customer site"
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white ${compact ? "justify-center" : ""}`}
        >
          <Store className="h-5 w-5 shrink-0" />
          {!compact && "View customer site"}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f6ee]">
      {/* Desktop sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 hidden transition-[width] duration-200 lg:block ${collapsed ? "w-[76px]" : "w-64"}`}>
        {sidebar(collapsed)}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-forest/60" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 animate-slideUp shadow-lift">{sidebar(false)}</div>
        </div>
      )}

      <div className={`transition-[padding] duration-200 ${collapsed ? "lg:pl-[76px]" : "lg:pl-64"}`}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-forest/10 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button className="rounded-full p-2 hover:bg-cream lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <button
            className="hidden rounded-full p-2 hover:bg-cream lg:block"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>
          <p className="font-display text-lg font-bold">{NAV.find((n) => (n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to)))?.label ?? "Admin"}</p>
          <Link to="/" className="btn-outline btn-sm ml-auto">
            <Store className="h-4 w-4" /> <span className="hidden sm:inline">Customer site</span>
          </Link>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
