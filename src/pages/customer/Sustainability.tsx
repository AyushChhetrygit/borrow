import { Link } from "react-router-dom";
import { BatteryWarning, Coins, Cpu, Recycle, ShoppingBag, ArrowRight } from "lucide-react";
import { useStore } from "../../context/StoreContext";

// Illustrative baseline so the page reads well on a fresh demo (clearly labelled below).
const BASE_RENTALS = 320;
const BASE_UNITS = 410;
const AVOIDED_RATIO = 0.35;

const POINTS = [
  { icon: ShoppingBag, title: "Fewer unnecessary purchases", text: "A calculator for one exam or an HDMI cable for one presentation doesn’t need to be bought." },
  { icon: Recycle, title: "Everyday products get reused", text: "One item serves many students across a semester instead of sitting in a drawer." },
  { icon: Cpu, title: "Less electronic waste", text: "Chargers, cables and power banks last longer when they’re shared and maintained." },
  { icon: BatteryWarning, title: "Less battery waste", text: "Fewer single-use power banks and spare batteries are bought, used briefly and discarded." },
  { icon: Coins, title: "Affordable access", text: "Students get what they need for a few rupees a day, with the deposit returned." },
];

export default function Sustainability() {
  const { orders } = useStore();
  const completed = orders.filter((o) => o.status === "returned" || o.status === "delivered");
  const units = completed.reduce((s, o) => s + o.quantity, 0);
  const rentals = BASE_RENTALS + completed.length;
  const reused = BASE_UNITS + units;
  const avoided = Math.round(reused * AVOIDED_RATIO);

  return (
    <div>
      <section className="bg-cream/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.02] sm:text-7xl">Borrow More. Waste Less.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-forest/80">
            Most of the things students need on campus are used for a few days and then forgotten. Sharing them keeps good
            products in circulation and out of the bin.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [rentals, "Total rentals completed"],
            [reused, "Products reused"],
            [avoided, "Estimated purchases avoided"],
          ].map(([v, l]) => (
            <div key={l as string} className="rounded-3xl bg-forest p-7 text-white">
              <p className="font-display text-5xl font-extrabold text-gold tabular-nums">{(v as number).toLocaleString("en-IN")}</p>
              <p className="mt-2 font-semibold">{l}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-forest/60">
          Illustrative figures for this prototype: a sample baseline of {BASE_RENTALS} rentals and {BASE_UNITS} items plus your
          demo orders. “Purchases avoided” assumes roughly {Math.round(AVOIDED_RATIO * 100)}% of rentals replace a new purchase.
          These are estimates, not measured results.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <h2 className="text-3xl font-extrabold sm:text-4xl">How sharing helps</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POINTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-forest/70">{text}</p>
            </div>
          ))}
          <div className="flex flex-col justify-between rounded-3xl bg-gold p-6">
            <p className="font-display text-2xl font-extrabold">Ready to borrow instead of buy?</p>
            <Link to="/catalogue" className="btn-primary mt-6 self-start">
              Explore catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
