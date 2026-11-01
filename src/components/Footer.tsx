import { Link } from "react-router-dom";
import { Instagram, Linkedin, Twitter } from "lucide-react";
import { Logo } from "./Logo";
import { useStore } from "../context/StoreContext";

export function Footer() {
  const { settings } = useStore();
  return (
    <footer className="mt-24 bg-forest text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">
            {settings.tagline} An affordable and convenient rental platform built for college students.
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" onClick={(e) => e.preventDefault()} aria-label="Social link (demo)" className="rounded-full bg-white/10 p-2.5 transition hover:bg-gold hover:text-forest">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <FooterCol title="Shop">
          <Link to="/catalogue">Explore Catalogue</Link>
          <Link to="/#categories">Categories</Link>
          <Link to="/#how-it-works">How It Works</Link>
          <Link to="/orders">Track an order</Link>
        </FooterCol>
        <FooterCol title="Company">
          <Link to="/info/about">About {settings.businessName}</Link>
          <Link to="/info/contact">Contact</Link>
          {/* Admin dashboard link intentionally hidden from the public site. */}
        </FooterCol>
        <FooterCol title="Help">
          <Link to="/info/faqs">FAQs</Link>
          <Link to="/info/policy">Rental Policy</Link>
        </FooterCol>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {settings.businessName}. College mini-project prototype · demo data only · no real payments or deliveries.
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-display text-base font-bold text-gold">{title}</h4>
      <div className="mt-3 flex flex-col gap-2 text-sm text-white/80 [&_a:hover]:text-gold">{children}</div>
    </div>
  );
}
