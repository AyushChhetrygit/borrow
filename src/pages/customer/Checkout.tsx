import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, MapPin, Minus, Plus, ShieldCheck } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { ProductImage } from "../../components/ProductArt";
import { calcRentalFee, canRent, inr, PICKUP_LOCATIONS } from "../../utils";
import { DURATIONS } from "./ProductDetail";

const LAST_KEY = "borrow.lastCustomer.v1";

function loadLast() {
  try {
    return JSON.parse(localStorage.getItem(LAST_KEY) || "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

export default function Checkout() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const { getProduct, placeOrder } = useStore();
  const p = id ? getProduct(id) : undefined;

  const last = loadLast();
  const [name, setName] = useState(last.name ?? "");
  const [phone, setPhone] = useState(last.phone ?? "");
  const [pickupLocation, setPickupLocation] = useState(last.pickupLocation ?? last.hostel ?? "");
  const [days, setDays] = useState(Math.max(1, Number(sp.get("days")) || 3));
  const [qty, setQty] = useState(Math.max(1, Number(sp.get("qty")) || 1));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  if (!p) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold">That product isn’t available</h1>
        <Link to="/catalogue" className="btn-primary mt-6">
          Back to catalogue
        </Link>
      </div>
    );
  }

  if (!canRent(p)) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold">{p.name} can’t be rented right now</h1>
        <p className="mt-2 text-forest/70">It’s out of stock or unavailable. Check back soon or pick something similar.</p>
        <Link to="/catalogue" className="btn-primary mt-6">
          Browse other items
        </Link>
      </div>
    );
  }

  const maxQty = Math.max(1, p.availableStock);
  const q = Math.min(qty, maxQty);
  const { fee, standard, saved } = calcRentalFee(p, days);
  const rentalFee = fee * q;
  const deposit = p.deposit * q;
  const total = rentalFee + deposit;
  const durationOptions = DURATIONS.includes(days) ? DURATIONS : [...DURATIONS, days].sort((a, b) => a - b);

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Enter your full name.";
    if (!/^\d{10}$/.test(phone.replace(/[\s-]/g, ""))) e.phone = "Enter a 10-digit mobile number.";
    if (!PICKUP_LOCATIONS.includes(pickupLocation as (typeof PICKUP_LOCATIONS)[number])) e.pickupLocation = "Choose a pickup location.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    const res = placeOrder({
      product: p,
      customerName: name,
      phone: phone.replace(/[\s-]/g, ""),
      hostel: pickupLocation,
      room: "",
      quantity: q,
      durationDays: days,
    });
    if (!res.ok) {
      setSubmitError(res.error);
      return;
    }
    try {
      localStorage.setItem(LAST_KEY, JSON.stringify({ name, phone, pickupLocation }));
    } catch {
      /* ignore */
    }
    nav(`/order/${res.order.id}?new=1`, { replace: true });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link to={`/product/${p.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-sage hover:text-forest">
        <ArrowLeft className="h-4 w-4" /> Back to product
      </Link>
      <h1 className="mt-4 text-4xl font-extrabold">Checkout</h1>
      <p className="mt-1 flex items-center gap-2 text-forest/70">
        <MapPin className="h-4 w-4 text-sage" /> Reserve now, then collect it from your selected pickup location.
      </p>

      <form onSubmit={submit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          {/* Item */}
          <section className="card flex items-center gap-4 p-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-cream/50">
              <ProductImage image={p.image} art={p.art} alt={p.name} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-bold">{p.name}</h2>
              <p className="text-sm text-forest/65">
                {inr(p.dailyPrice)}/day · {p.availableStock} available
              </p>
            </div>
            <div className="inline-flex items-center rounded-full border border-forest/15">
              <button type="button" className="p-2.5 disabled:opacity-40" onClick={() => setQty(Math.max(1, q - 1))} disabled={q <= 1} aria-label="Decrease quantity">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-7 text-center font-semibold">{q}</span>
              <button type="button" className="p-2.5 disabled:opacity-40" onClick={() => setQty(Math.min(maxQty, q + 1))} disabled={q >= maxQty} aria-label="Increase quantity">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </section>

          {/* Duration */}
          <section className="card p-5">
            <label className="label" htmlFor="duration">Rental duration</label>
            <select id="duration" className="input" value={days} onChange={(e) => setDays(Number(e.target.value))}>
              {durationOptions.map((d) => (
                <option key={d} value={d}>
                  {d} day{d > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </section>

          {/* Details */}
          <section className="card space-y-4 p-5">
            <h2 className="text-lg font-bold">Student and pickup details</h2>
            <Field label="Customer name" id="name" error={errors.name}>
              <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="e.g. Aarav Mehta" />
            </Field>
            <Field label="Phone number" id="phone" error={errors.phone}>
              <input id="phone" className="input" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="10-digit mobile number" />
            </Field>
            <Field label="Pickup location" id="pickup-location" error={errors.pickupLocation}>
              <select id="pickup-location" className="input" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}>
                <option value="">Choose where you will collect your order</option>
                {PICKUP_LOCATIONS.map((location) => <option key={location} value={location}>{location}</option>)}
              </select>
            </Field>
            <div className="flex items-center gap-3 rounded-2xl border-2 border-forest bg-cream/50 p-4">
              <MapPin className="h-5 w-5 text-forest" />
              <span className="font-semibold">Collect from your selected location</span>
              <span className="ml-auto text-sm font-semibold text-sage">Free</span>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <h2 className="text-lg font-bold">Price breakdown</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label={`${inr(p.dailyPrice)} × ${days} day${days > 1 ? "s" : ""}${q > 1 ? ` × ${q}` : ""}`} value={inr(standard * q)} />
              {saved > 0 && <Row label="Weekly rate saving" value={`− ${inr(saved * q)}`} accent />}
              <Row label="Rental fee" value={inr(rentalFee)} bold />
              <Row label="Refundable security deposit" value={inr(deposit)} />
              <div className="border-t border-dashed border-forest/20 pt-3">
                <Row label="Total payable" value={inr(total)} big />
              </div>
            </dl>
            <p className="mt-4 flex items-start gap-2 rounded-2xl bg-cream/60 p-3 text-sm leading-relaxed">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              <span>
                The {inr(deposit)} deposit is <b>refundable</b> after the item is returned and inspected. Late returns and
                damage may be deducted per the <Link to="/info/policy" className="font-semibold underline">rental policy</Link>.
              </span>
            </p>
            <div className="mt-4 rounded-2xl bg-forest p-4 text-white">
              <p className="flex items-center gap-2 text-sm text-gold"><MapPin className="h-4 w-4" /> Pickup location</p>
              <p className="mt-1 font-display text-xl font-extrabold">{pickupLocation || "Choose a location"}</p>
              <p className="mt-1 text-xs text-white/75">We’ll notify you when your order is ready to collect.</p>
            </div>
            {submitError && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
                {submitError}
              </p>
            )}
            {Object.keys(errors).length > 0 && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
                Please fix the highlighted fields to place your order.
              </p>
            )}
            <button type="submit" className="btn-primary mt-5 w-full py-3.5 text-base">
              Place order · {inr(total)}
            </button>
            <p className="mt-3 text-center text-xs text-forest/55">Demo checkout — no real payment is taken.</p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className={error ? "[&_.input]:border-red-500" : ""}>{children}</div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

function Row({ label, value, bold, big, accent }: { label: string; value: string; bold?: boolean; big?: boolean; accent?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 ${bold ? "font-semibold" : ""} ${accent ? "text-sage" : ""}`}>
      <dt className={big ? "text-base font-bold" : ""}>{label}</dt>
      <dd className={big ? "font-display text-2xl font-extrabold" : ""}>{value}</dd>
    </div>
  );
}
