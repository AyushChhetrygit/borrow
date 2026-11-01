import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CloudRain,
  Gamepad2,
  Handshake,
  Plug,
  Trophy,
  MapPin,
  Wallet,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import { ProductCard } from "../../components/ProductCard";
import { ProductArt } from "../../components/ProductArt";
import { CATEGORIES } from "../../utils";
import type { CategoryId } from "../../types";

const CAT_ICON: Record<CategoryId, typeof BookOpen> = {
  study: BookOpen,
  electronics: Plug,
  rain: CloudRain,
  sports: Trophy,
  games: Gamepad2,
  tools: BookOpen,
};

const BENEFITS = [
  { icon: Wallet, title: "Affordable rentals", text: "Pay a few rupees a day instead of buying something you will use twice." },
  { icon: MapPin, title: "Convenient pickup", text: "Collect your reserved item from the campus location you choose." },
  { icon: Handshake, title: "Convenient borrowing", text: "Pick an item, choose the days, order. The deposit comes back when you return it." },
];

const STEPS = [
  ["Explore essentials", "Browse the catalogue or jump into a category."],
  ["Select what you need", "Check price, deposit and availability on the product page."],
  ["Choose duration and order", "Pick the number of days and select your pickup location."],
  ["Pick it up", "We’ll let you know when your item is ready to collect."],
  ["Return it after use", "Hand it back and your deposit is refunded after inspection."],
];

const NEW_ARRIVAL_IDS = ["P016", "P017", "P018", "P022", "P019", "P020", "P021"];

export default function Home() {
  const { products, orders } = useStore();

  const popular = useMemo(() => {
    const counts = new Map<string, number>();
    orders.forEach((o) => counts.set(o.productId, (counts.get(o.productId) ?? 0) + o.quantity));
    return [...products]
      .sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0))
      .slice(0, 8);
  }, [products, orders]);
  const newArrivals = useMemo(
    () => NEW_ARRIVAL_IDS.map((id) => products.find((product) => product.id === id)).filter((product): product is NonNullable<typeof product> => !!product),
    [products]
  );

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-cream/60">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-forest px-3.5 py-1.5 text-sm font-semibold text-gold">
              <MapPin className="h-4 w-4" /> Choose a pickup point that works for you
            </p>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
              Need It Now? Just Borrow It.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-forest/80">
              Your everyday campus essentials, ready to pick up when you need them. No unnecessary purchases. Just convenient,
              affordable borrowing.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalogue" className="btn-primary px-8 py-4 text-lg shadow-lift">
                Start Borrowing <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/#categories" className="btn-outline px-6 py-3 text-base">
                Browse Categories
              </Link>
            </div>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {[
                ["15+", "everyday essentials"],
                ["₹5", "rentals from per day"],
                ["100%", "refundable deposit"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl font-extrabold">{v}</dt>
                  <dd className="text-sm text-forest/70">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Collage */}
          <div className="relative mx-auto aspect-square w-full max-w-[520px]">
            <div className="absolute inset-[6%] rounded-full bg-gold" />
            <div className="absolute inset-[18%] rounded-full bg-cream" />
            {[
              { art: "sci-calc", cls: "left-[4%] top-[8%] h-[40%] w-[40%] -rotate-6" },
              { art: "umbrella", cls: "right-[2%] top-[2%] h-[44%] w-[44%] rotate-6" },
              { art: "powerbank", cls: "left-[28%] top-[44%] h-[40%] w-[40%] rotate-2" },
              { art: "cards", cls: "right-[4%] top-[50%] h-[34%] w-[34%] -rotate-3" },
            ].map((t) => (
              <div key={t.art} className={`absolute rounded-3xl bg-white p-2 shadow-lift ${t.cls}`}>
                <ProductArt art={t.art} className="h-full w-full" />
              </div>
            ))}
            <div className="absolute -bottom-2 left-0 right-0 mx-auto w-[88%] rounded-2xl border border-forest/10 bg-white p-4 shadow-lift">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Scientific Calculator · 3 days</span>
                <span className="rounded-full bg-forest px-2.5 py-0.5 text-xs font-bold text-gold">₹330</span>
              </div>
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-cream">
                <div className="h-full w-2/3 rounded-full bg-sage" />
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-forest/70">
                <MapPin className="h-3.5 w-3.5" /> Ready for campus pickup
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="bg-forest">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
          <p className="font-display text-xl font-bold text-gold sm:text-2xl">Your campus essentials, just a few clicks away.</p>
          <Link to="/catalogue" className="btn-gold px-8 py-4 text-lg shadow-lift">
            Start borrowing <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <SectionHead title="Shop by category" text="Pick a shelf and see everything on it." />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {CATEGORIES.map((c) => {
            const Icon = CAT_ICON[c.id];
            const count = products.filter((p) => p.category === c.id).length;
            return (
              <Link
                key={c.id}
                to={`/catalogue?category=${c.id}`}
                className="group flex flex-col justify-between rounded-3xl border border-forest/10 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-sage hover:bg-cream/50 hover:shadow-lift sm:p-6"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage text-white transition group-hover:bg-forest group-hover:text-gold">
                  <Icon className="h-6 w-6" />
                </span>
                <div className="mt-8">
                  <h3 className="font-display text-lg font-bold leading-tight sm:text-xl">{c.label}</h3>
                  <p className="mt-1 hidden text-sm text-forest/65 sm:block">{c.blurb}</p>
                  <p className="mt-2 text-sm font-semibold text-sage">
                    {count} item{count === 1 ? "" : "s"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* POPULAR */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHead title="Popular right now" text="What other students are borrowing this week." />
          <Link to="/catalogue" className="btn-outline btn-sm">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHead title="New on BORROW" text="Fresh campus essentials, sports gear and rainy-day picks." />
          <Link to="/catalogue" className="btn-outline btn-sm">
            Explore all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} imageMotion />
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <SectionHead title="Why BORROW?" text="Everything you need, nothing you have to keep." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-cream/60 p-6">
              <Icon className="h-8 w-8 text-sage" />
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-forest/75">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <SectionHead title="How it works" text="From “I need it” to “I have it” in five steps." />
        <ol className="mt-8 grid gap-4 md:grid-cols-5">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="relative rounded-3xl border border-forest/10 bg-white p-5 shadow-soft">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest font-display text-base font-extrabold text-gold">
                {i + 1}
              </span>
              <h3 className="mt-4 text-base font-bold">{t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-forest/70">{d}</p>
            </li>
          ))}
        </ol>
      </section>

    </>
  );
}

function SectionHead({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h2 className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
      <p className="mt-2 text-forest/70">{text}</p>
    </div>
  );
}
