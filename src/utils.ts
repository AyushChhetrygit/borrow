import type { CategoryId, Order, OrderStatus, Product } from "./types";

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export const CATEGORIES: { id: CategoryId; label: string; blurb: string }[] = [
  { id: "electronics", label: "Tech & Electronics", blurb: "Calculators, cables, power banks & more" },
  { id: "study", label: "Stationery & Art", blurb: "Brushes, scissors, cutters & staplers" },
  { id: "sports", label: "Sports", blurb: "Rackets, balls and cricket gear" },
  { id: "games", label: "Games & Leisure", blurb: "Chess, cards and board games" },
  { id: "rain", label: "Rain & Daily Needs", blurb: "Umbrellas and raincoats for campus" },
];

export const categoryLabel = (id: CategoryId) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;

/** Delivery presets used in the product form */
export const DELIVERY_PRESETS = [
  { label: "Nearby · 15–20 min", min: 15, max: 20 },
  { label: "Regular · 25–35 min", min: 25, max: 35 },
  { label: "Longer distance · 40–50 min", min: 40, max: 50 },
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Order confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  returned: "Returned",
  cancelled: "Cancelled",
};

/** Statuses where the item is still out of the shelf (stock is held) */
export const HOLDING_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

/** Orders that count as "active" on the dashboard */
export const ACTIVE_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
];

/** Orders that have not been handed over yet */
export const PENDING_STATUSES: OrderStatus[] = ["pending", "confirmed", "preparing"];

export const isHolding = (o: Order) => HOLDING_STATUSES.includes(o.status);

export const rentedQty = (orders: Order[], productId: string) =>
  orders
    .filter((o) => o.productId === productId && isHolding(o))
    .reduce((sum, o) => sum + o.quantity, 0);

export function calcRentalFee(p: { dailyPrice: number; weeklyPrice: number }, days: number) {
  const standard = p.dailyPrice * days;
  const weeks = Math.floor(days / 7);
  const rem = days % 7;
  const weeklyMix = weeks * p.weeklyPrice + rem * p.dailyPrice;
  const fee = weeks > 0 ? Math.min(standard, weeklyMix) : standard;
  return { fee, standard, saved: standard - fee };
}

export function generateOrderId(existing: string[]) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let tries = 0; tries < 50; tries++) {
    let s = "";
    for (let i = 0; i < 5; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
    const id = `BRW-${s}`;
    if (!existing.includes(id)) return id;
  }
  return `BRW-${Date.now().toString(36).toUpperCase()}`;
}

export const etaText = (min: number, max: number) => `${min}–${max} min`;

export function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function availabilityOf(p: Product): { label: string; tone: "ok" | "low" | "out" } {
  if (p.status === "maintenance") return { label: "Under maintenance", tone: "out" };
  if (p.status === "unavailable") return { label: "Unavailable", tone: "out" };
  if (p.availableStock <= 0) return { label: "Out of stock", tone: "out" };
  if (p.availableStock <= 2) return { label: `Only ${p.availableStock} left`, tone: "low" };
  return { label: `${p.availableStock} available`, tone: "ok" };
}

export const canRent = (p: Product) => p.status === "available" && p.availableStock > 0;
