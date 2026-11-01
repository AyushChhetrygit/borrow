import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";

/** Two arrows passing an item back and forth: borrow → return. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="13" fill="#15370D" />
      <path d="M13 19h20l-5.5-5.5M35 29H15l5.5 5.5" fill="none" stroke="#E5CD82" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="2.6" fill="#FFF2B4" />
    </svg>
  );
}

export function Logo({ to = "/", light = false }: { to?: string; light?: boolean }) {
  const { settings } = useStore();
  return (
    <Link to={to} className="group inline-flex items-center gap-2.5" aria-label={`${settings.businessName} home`}>
      <span className="transition group-hover:rotate-6">
        <LogoMark />
      </span>
      <span
        className={`font-display text-2xl font-extrabold tracking-tight ${light ? "text-white" : "text-forest"}`}
      >
        {settings.businessName}
      </span>
    </Link>
  );
}
