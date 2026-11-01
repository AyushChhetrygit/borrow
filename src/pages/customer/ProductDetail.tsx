import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, Clock, Minus, Plus, ShieldCheck, Zap } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { ProductImage } from "../../components/ProductArt";
import { availabilityOf, calcRentalFee, canRent, categoryLabel, etaText, inr } from "../../utils";

export const DURATIONS = [1, 2, 3, 5, 7, 14];

export default function ProductDetail() {
  const { id } = useParams();
  const { getProduct } = useStore();
  const nav = useNavigate();
  const p = id ? getProduct(id) : undefined;
  const [days, setDays] = useState(3);
  const [qty, setQty] = useState(1);

  if (!p) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold">We couldn’t find that product</h1>
        <p className="mt-2 text-forest/70">It may have been removed from the catalogue.</p>
        <Link to="/catalogue" className="btn-primary mt-6">
          Back to catalogue
        </Link>
      </div>
    );
  }

  const a = availabilityOf(p);
  const rentable = canRent(p);
  const { fee, saved } = calcRentalFee(p, days);
  const maxQty = Math.max(1, Math.min(p.availableStock, 5));
  const q = Math.min(qty, maxQty);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to="/catalogue" className="inline-flex items-center gap-1.5 text-sm font-semibold text-sage hover:text-forest">
        <ArrowLeft className="h-4 w-4" /> Back to catalogue
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-forest/10 bg-cream/50 shadow-soft">
          <ProductImage image={p.image} art={p.art} alt={p.name} />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-1.5 text-sm font-semibold text-gold">
            <Zap className="h-4 w-4" /> {etaText(p.deliveryMin, p.deliveryMax)}
          </span>
        </div>

        <div>
          <p className="text-sm font-semibold text-sage">{categoryLabel(p.category)}</p>
          <h1 className="mt-1 text-4xl font-extrabold sm:text-5xl">{p.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span
              className={`rounded-full px-3 py-1 font-semibold ${
                a.tone === "ok" ? "bg-sage/15" : a.tone === "low" ? "bg-gold/50" : "bg-red-50 text-red-700"
              }`}
            >
              {a.label}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 font-semibold">
              <BadgeCheck className="h-4 w-4 text-sage" /> Condition: {p.condition}
            </span>
          </div>
          <p className="mt-5 max-w-xl leading-relaxed text-forest/80">{p.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Fact label="Daily rental" value={inr(p.dailyPrice)} />
            <Fact label="Weekly rental" value={inr(p.weeklyPrice)} />
            <Fact label="Refundable deposit" value={inr(p.deposit)} />
            <Fact label="Replacement value" value={inr(p.replacementValue)} />
            <Fact label="Available" value={`${p.availableStock} of ${p.totalStock}`} />
            <Fact label="Delivery" value={etaText(p.deliveryMin, p.deliveryMax)} icon />
          </dl>

          {/* Rental selector */}
          <div className="mt-8 rounded-3xl border border-forest/10 bg-white p-5 shadow-soft">
            <p className="label">Rental duration</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Rental duration">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  aria-pressed={days === d}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    days === d ? "bg-gold text-forest ring-2 ring-forest" : "border border-forest/15 hover:bg-cream"
                  }`}
                >
                  {d} day{d > 1 ? "s" : ""}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="label !mb-1">Quantity</p>
                <div className="inline-flex items-center rounded-full border border-forest/15">
                  <button className="p-2.5 disabled:opacity-40" onClick={() => setQty(Math.max(1, q - 1))} disabled={q <= 1} aria-label="Decrease quantity">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold" aria-live="polite">{q}</span>
                  <button className="p-2.5 disabled:opacity-40" onClick={() => setQty(Math.min(maxQty, q + 1))} disabled={q >= maxQty} aria-label="Increase quantity">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-forest/60">Rental fee</p>
                <p className="font-display text-3xl font-extrabold">{inr(fee * q)}</p>
                {saved > 0 && <p className="text-xs font-semibold text-sage">Weekly rate applied · you save {inr(saved * q)}</p>}
              </div>
            </div>

            <p className="mt-4 flex items-start gap-2 rounded-2xl bg-cream/60 p-3 text-sm">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              <span>
                Plus a refundable deposit of <b>{inr(p.deposit * q)}</b>, returned after the item is back and inspected.
              </span>
            </p>

            <button
              className="btn-primary mt-5 w-full py-3.5 text-base"
              disabled={!rentable}
              onClick={() => nav(`/checkout/${p.id}?days=${days}&qty=${q}`)}
            >
              {rentable ? `Rent now · ${inr((fee + p.deposit) * q)} payable` : a.label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value, icon }: { label: string; value: string; icon?: boolean }) {
  return (
    <div className="rounded-2xl bg-cream/50 p-3.5">
      <dt className="text-xs font-medium text-forest/60">{label}</dt>
      <dd className="mt-0.5 flex items-center gap-1.5 font-display text-lg font-bold">
        {icon && <Clock className="h-4 w-4 text-sage" />}
        {value}
      </dd>
    </div>
  );
}
