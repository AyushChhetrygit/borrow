import type { OrderStatus } from "../types";
import { STATUS_LABEL } from "../utils";

const TONE: Record<OrderStatus, string> = {
  pending: "bg-gold/40 text-forest ring-gold",
  confirmed: "bg-cream text-forest ring-gold",
  preparing: "bg-sage/20 text-forest ring-sage/40",
  out_for_delivery: "bg-forest text-gold ring-forest",
  delivered: "bg-sage text-white ring-sage",
  returned: "bg-white text-forest/70 ring-forest/20",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${TONE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
