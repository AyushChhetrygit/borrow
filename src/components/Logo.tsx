import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return <img src="/brand/borrow-logo-cropped.jpg" alt="" className={`${className} rounded-lg object-cover object-left`} />;
}

export function Logo({ to = "/", light = false }: { to?: string; light?: boolean }) {
  const { settings } = useStore();
  return (
    <Link to={to} className="group inline-flex items-center" aria-label={`${settings.businessName} home`}>
      <img
        src="/brand/borrow-logo-cropped.jpg"
        alt="BORROW"
        className={`h-11 w-auto rounded-lg object-contain transition group-hover:scale-[1.03] ${light ? "ring-1 ring-white/15" : "shadow-soft"}`}
      />
    </Link>
  );
}
