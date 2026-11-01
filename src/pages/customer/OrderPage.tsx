import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2, Home, MapPin, Package, PartyPopper, Play, Square, Truck, XCircle } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { StatusBadge } from "../../components/StatusBadge";
import { ProductImage } from "../../components/ProductArt";
import { etaText, formatDate, inr } from "../../utils";
import type { OrderStatus } from "../../types";

const STEPS: { status: OrderStatus; label: string; hint: string; icon: typeof Package }[] = [
  { status: "confirmed", label: "Order Confirmed", hint: "We’ve got your order", icon: CheckCircle2 },
  { status: "preparing", label: "Preparing Your Item", hint: "Checked and packed", icon: Package },
  { status: "out_for_delivery", label: "Out for Delivery", hint: "On its way to you", icon: Truck },
  { status: "delivered", label: "Delivered", hint: "Enjoy! Return it when done", icon: PartyPopper },
];

const stepIndex = (s: OrderStatus) =>
  s === "pending" || s === "confirmed" ? 0 : s === "preparing" ? 1 : s === "out_for_delivery" ? 2 : s === "delivered" || s === "returned" ? 3 : -1;

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export default function OrderPage() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const { getOrder, updateOrderStatus } = useStore();
  const order = id ? getOrder(id) : undefined;
  const now = useNow();
  const [simulating, setSimulating] = useState(false);

  // Demo-only: walk the order through the statuses so the tracker can be shown without the admin.
  const orderRef = useRef(order);
  orderRef.current = order;
  useEffect(() => {
    if (!simulating) return;
    const t = setInterval(() => {
      const o = orderRef.current;
      if (!o) return;
      const idx = stepIndex(o.status);
      if (idx < 0 || idx >= 3) {
        setSimulating(false);
        return;
      }
      updateOrderStatus(o.id, STEPS[idx + 1].status);
    }, 3500);
    return () => clearInterval(t);
  }, [simulating, updateOrderStatus]);

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold">Order not found</h1>
        <p className="mt-2 text-forest/70">Check the order ID, or the demo data may have been reset.</p>
        <Link to="/orders" className="btn-primary mt-6">
          Go to my orders
        </Link>
      </div>
    );
  }

  const idx = stepIndex(order.status);
  const cancelled = order.status === "cancelled";
  const done = idx === 3;
  const isNew = sp.get("new") === "1";

  const totalMs = order.deliveryMax * 60_000;
  const elapsed = Math.max(0, now - new Date(order.createdAt).getTime());
  const remaining = Math.max(0, totalMs - elapsed);
  const mm = String(Math.floor(remaining / 60_000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60_000) / 1000)).padStart(2, "0");
  const ringPct = done ? 100 : Math.min(97, Math.max((elapsed / totalMs) * 100, (idx / 3) * 100));
  const R = 70;
  const C = 2 * Math.PI * R;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Confirmation banner */}
      {cancelled ? (
        <div className="flex items-center gap-4 rounded-3xl bg-red-50 p-6 text-red-800">
          <XCircle className="h-10 w-10 shrink-0" />
          <div>
            <h1 className="text-2xl font-extrabold !text-red-800">This order was cancelled</h1>
            <p className="text-sm">Your deposit isn’t charged for cancelled orders. You can place a new order any time.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-4 rounded-3xl bg-forest p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold text-forest ${isNew ? "animate-pop" : ""}`}>
            {done ? <PartyPopper className="h-8 w-8" /> : <CheckCircle2 className="h-9 w-9" />}
          </span>
          <div>
            <h1 className="text-3xl font-extrabold !text-white sm:text-4xl">
              {done ? "Your order has arrived!" : isNew ? "Your order is confirmed!" : "Tracking your order"}
            </h1>
            <p className="mt-1 text-white/80">
              Order <span className="font-bold text-gold">{order.id}</span> · placed {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* ETA + tracker */}
        <section className="card p-6">
          {!cancelled && (
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative h-44 w-44 shrink-0" role="timer" aria-label="Delivery countdown">
                <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
                  <circle cx="80" cy="80" r={R} fill="none" stroke="#FFF2B4" strokeWidth="12" />
                  <circle
                    cx="80"
                    cy="80"
                    r={R}
                    fill="none"
                    stroke={done ? "#728E6D" : "#15370D"}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={C - (C * ringPct) / 100}
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  {done ? (
                    <>
                      <Home className="h-8 w-8 text-sage" />
                      <span className="mt-1 text-sm font-semibold">Delivered</span>
                    </>
                  ) : remaining > 0 ? (
                    <>
                      <span className="font-display text-4xl font-extrabold tabular-nums">
                        {mm}:{ss}
                      </span>
                      <span className="text-xs font-medium text-forest/60">until estimated arrival</span>
                    </>
                  ) : (
                    <span className="px-4 text-sm font-semibold">Arriving any moment now</span>
                  )}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-forest/60">Estimated delivery</p>
                <p className="font-display text-4xl font-extrabold">{etaText(order.deliveryMin, order.deliveryMax)}</p>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-forest/70 sm:justify-start">
                  <MapPin className="h-4 w-4 text-sage" /> {order.room}, {order.hostel}
                </p>
                <p className="mt-2 text-xs text-forest/50">Demo estimate, not a live prediction.</p>
              </div>
            </div>
          )}

          {/* Steps */}
          <ol className={`${cancelled ? "" : "mt-8"} space-y-0`} aria-label="Order progress">
            {STEPS.map((s, i) => {
              const reached = !cancelled && i <= idx;
              const current = !cancelled && i === idx;
              const Icon = s.icon;
              return (
                <li key={s.status} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < STEPS.length - 1 && (
                    <span className={`absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 ${reached && i < idx ? "bg-forest" : "bg-forest/15"}`} />
                  )}
                  <span
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
                      reached ? "bg-forest text-gold" : "bg-forest/10 text-forest/40"
                    } ${current && !done ? "ring-4 ring-gold" : ""}`}
                  >
                    <Icon className={`h-5 w-5 ${current && s.status === "out_for_delivery" ? "animate-ride" : ""}`} />
                  </span>
                  <div className="pt-1.5">
                    <p className={`font-bold ${reached ? "" : "text-forest/45"}`}>{s.label}</p>
                    <p className={`text-sm ${reached ? "text-forest/70" : "text-forest/35"}`}>{s.hint}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {order.status === "returned" && (
            <p className="mt-6 rounded-2xl bg-cream p-4 text-sm font-medium">
              Item returned. Your {inr(order.deposit)} deposit is being refunded after inspection.
            </p>
          )}

          {!cancelled && !done && (
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-dashed border-forest/20 pt-5">
              <button className="btn-outline btn-sm" onClick={() => setSimulating((s) => !s)}>
                {simulating ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {simulating ? "Stop simulation" : "Demo: simulate delivery progress"}
              </button>
              <p className="text-xs text-forest/55">Status also updates live when the admin changes it.</p>
            </div>
          )}
        </section>

        {/* Details */}
        <section className="card h-fit p-6">
          <h2 className="text-xl font-bold">Order details</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-cream/50">
              <ProductImage image={order.image} art={order.art} alt={order.productName} />
            </div>
            <div>
              <p className="font-display text-lg font-bold">{order.productName}</p>
              <p className="text-sm text-forest/65">
                Qty {order.quantity} · {order.durationDays} day{order.durationDays > 1 ? "s" : ""}
              </p>
              <div className="mt-1.5">
                <StatusBadge status={order.status} />
              </div>
            </div>
          </div>
          <dl className="mt-5 space-y-2.5 border-t border-forest/10 pt-4 text-sm">
            <Line label="Order ID" value={order.id} />
            <Line label="Customer" value={`${order.customerName} · ${order.phone}`} />
            <Line label="Delivery address" value={`${order.room}, ${order.hostel}`} />
            <Line label="Rental fee" value={inr(order.rentalFee)} />
            <Line label="Refundable deposit" value={inr(order.deposit)} />
            <div className="flex items-center justify-between border-t border-dashed border-forest/20 pt-3">
              <dt className="font-bold">Total amount</dt>
              <dd className="font-display text-2xl font-extrabold">{inr(order.total)}</dd>
            </div>
            {order.note && <Line label="Note from BORROW" value={order.note} />}
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to="/catalogue" className="btn-primary">
              Keep browsing
            </Link>
            <Link to="/orders" className="btn-outline">
              All my orders
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-forest/60">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  );
}
