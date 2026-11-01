import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2, MapPin, Package, PartyPopper, Play, Square, XCircle } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { StatusBadge } from "../../components/StatusBadge";
import { ProductImage } from "../../components/ProductArt";
import { formatDate, inr } from "../../utils";
import type { OrderStatus } from "../../types";

const STEPS: { status: OrderStatus; label: string; hint: string; icon: typeof Package }[] = [
  { status: "confirmed", label: "Order Confirmed", hint: "We’ve reserved your item", icon: CheckCircle2 },
  { status: "preparing", label: "Preparing Your Item", hint: "It is being checked and packed", icon: Package },
  { status: "out_for_delivery", label: "Ready for Pickup", hint: "Collect it from your selected location", icon: MapPin },
  { status: "delivered", label: "Picked Up", hint: "You have collected your rental", icon: PartyPopper },
];

const stepIndex = (status: OrderStatus) =>
  status === "pending" || status === "confirmed" ? 0 : status === "preparing" ? 1 : status === "out_for_delivery" ? 2 : status === "delivered" || status === "returned" ? 3 : -1;

export default function OrderPage() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const { getOrder, updateOrderStatus } = useStore();
  const order = id ? getOrder(id) : undefined;
  const [simulating, setSimulating] = useState(false);
  const orderRef = useRef(order);
  orderRef.current = order;

  useEffect(() => {
    if (!simulating) return;
    const timer = setInterval(() => {
      const current = orderRef.current;
      if (!current) return;
      const index = stepIndex(current.status);
      if (index < 0 || index >= STEPS.length - 1) return setSimulating(false);
      updateOrderStatus(current.id, STEPS[index + 1].status);
    }, 3500);
    return () => clearInterval(timer);
  }, [simulating, updateOrderStatus]);

  if (!order) {
    return <div className="mx-auto max-w-xl px-4 py-24 text-center"><h1 className="text-3xl font-extrabold">Order not found</h1><p className="mt-2 text-forest/70">Check the order ID, or the demo data may have been reset.</p><Link to="/orders" className="btn-primary mt-6">Go to my orders</Link></div>;
  }

  const index = stepIndex(order.status);
  const cancelled = order.status === "cancelled";
  const pickedUp = order.status === "delivered" || order.status === "returned";
  const isNew = sp.get("new") === "1";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {cancelled ? (
        <div className="flex items-center gap-4 rounded-3xl bg-red-50 p-6 text-red-800"><XCircle className="h-10 w-10 shrink-0" /><div><h1 className="text-2xl font-extrabold !text-red-800">This order was cancelled</h1><p className="text-sm">Your deposit isn’t charged for cancelled orders. You can place a new order any time.</p></div></div>
      ) : (
        <div className="flex flex-col items-start gap-4 rounded-3xl bg-forest p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold text-forest ${isNew ? "animate-pop" : ""}`}>{pickedUp ? <PartyPopper className="h-8 w-8" /> : <CheckCircle2 className="h-9 w-9" />}</span>
          <div><h1 className="text-3xl font-extrabold !text-white sm:text-4xl">{pickedUp ? "Order has been picked up!" : isNew ? "Your order is confirmed!" : "Tracking your pickup order"}</h1><p className="mt-1 text-white/80">Order <span className="font-bold text-gold">{order.id}</span> · placed {formatDate(order.createdAt)}</p></div>
        </div>
      )}

      {!cancelled && order.status === "out_for_delivery" && <div className="mt-6 flex items-start gap-3 rounded-3xl border border-sage/30 bg-sage/15 p-5"><MapPin className="mt-0.5 h-6 w-6 shrink-0 text-forest" /><div><h2 className="font-display text-xl font-bold">Your order is ready to be picked up</h2><p className="mt-1 text-sm text-forest/75">Please collect <b>{order.productName}</b> from <b>{order.hostel}</b>.</p></div></div>}
      {!cancelled && order.status === "delivered" && <div className="mt-6 flex items-start gap-3 rounded-3xl border border-sage/30 bg-sage/15 p-5"><CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-forest" /><div><h2 className="font-display text-xl font-bold">Order has been picked up</h2><p className="mt-1 text-sm text-forest/75">Enjoy your rental. Return it to the pickup point after use.</p></div></div>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="card p-6">
          <ol className="space-y-0" aria-label="Order progress">
            {STEPS.map((step, i) => {
              const reached = !cancelled && i <= index;
              const current = !cancelled && i === index;
              const Icon = step.icon;
              return <li key={step.status} className="relative flex gap-4 pb-6 last:pb-0">{i < STEPS.length - 1 && <span className={`absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 ${reached && i < index ? "bg-forest" : "bg-forest/15"}`} />}<span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${reached ? "bg-forest text-gold" : "bg-forest/10 text-forest/40"} ${current && !pickedUp ? "ring-4 ring-gold" : ""}`}><Icon className="h-5 w-5" /></span><div className="pt-1.5"><p className={`font-bold ${reached ? "" : "text-forest/45"}`}>{step.label}</p><p className={`text-sm ${reached ? "text-forest/70" : "text-forest/35"}`}>{step.hint}</p></div></li>;
            })}
          </ol>
          {order.status === "returned" && <p className="mt-6 rounded-2xl bg-cream p-4 text-sm font-medium">Item returned. Your {inr(order.deposit)} deposit is being refunded after inspection.</p>}
          {!cancelled && !pickedUp && <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-dashed border-forest/20 pt-5"><button className="btn-outline btn-sm" onClick={() => setSimulating((value) => !value)}>{simulating ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}{simulating ? "Stop simulation" : "Demo: simulate pickup progress"}</button><p className="text-xs text-forest/55">Status also updates when the admin changes it.</p></div>}
        </section>

        <section className="card h-fit p-6"><h2 className="text-xl font-bold">Order details</h2><div className="mt-4 flex items-center gap-4"><div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-cream/50"><ProductImage image={order.image} art={order.art} alt={order.productName} /></div><div><p className="font-display text-lg font-bold">{order.productName}</p><p className="text-sm text-forest/65">Qty {order.quantity} · {order.durationDays} day{order.durationDays > 1 ? "s" : ""}</p><div className="mt-1.5"><StatusBadge status={order.status} /></div></div></div><dl className="mt-5 space-y-2.5 border-t border-forest/10 pt-4 text-sm"><Line label="Order ID" value={order.id} /><Line label="Customer" value={`${order.customerName} · ${order.phone}`} /><Line label="Pickup location" value={order.hostel} /><Line label="Rental fee" value={inr(order.rentalFee)} /><Line label="Refundable deposit" value={inr(order.deposit)} /><div className="flex items-center justify-between border-t border-dashed border-forest/20 pt-3"><dt className="font-bold">Total amount</dt><dd className="font-display text-2xl font-extrabold">{inr(order.total)}</dd></div>{order.note && <Line label="Note from BORROW" value={order.note} />}</dl><div className="mt-6 flex flex-wrap gap-2"><Link to="/catalogue" className="btn-primary">Keep browsing</Link><Link to="/orders" className="btn-outline">All my orders</Link></div></section>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4"><dt className="text-forest/60">{label}</dt><dd className="text-right font-semibold">{value}</dd></div>;
}
