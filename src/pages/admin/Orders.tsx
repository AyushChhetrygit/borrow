import { useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Modal } from "../../components/Modal";
import { StatusBadge } from "../../components/StatusBadge";
import { formatDate, inr, STATUS_LABEL } from "../../utils";
import type { Order, OrderStatus } from "../../types";
import { EmptyRow, PageHeader, TableWrap, td, th, tr } from "./ui";

const ACTIONS: { status: OrderStatus; label: string }[] = [
  { status: "confirmed", label: "Confirm order" },
  { status: "preparing", label: "Mark as Preparing" },
  { status: "out_for_delivery", label: "Mark as Ready for Pickup" },
  { status: "delivered", label: "Mark as Picked Up" },
  { status: "returned", label: "Mark as Returned" },
  { status: "cancelled", label: "Cancel order" },
];

export default function Orders() {
  const { orders, updateOrderStatus, setOrderNote, settings } = useStore();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [viewId, setViewId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const sorted = useMemo(() => [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)), [orders]);
  const list = sorted.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    const t = q.trim().toLowerCase();
    return !t || o.id.toLowerCase().includes(t) || o.customerName.toLowerCase().includes(t) || o.productName.toLowerCase().includes(t);
  });
  const viewing = viewId ? orders.find((o) => o.id === viewId) : undefined;

  const apply = (o: Order, status: OrderStatus) => {
    if (status === o.status) return;
    if (status === "cancelled") setCancelId(o.id);
    else updateOrderStatus(o.id, status);
  };

  const open = (o: Order) => {
    setViewId(o.id);
    setNote(o.note ?? "");
  };

  return (
    <>
      <PageHeader title="Orders" text="Status changes appear instantly on the customer’s tracking screen." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/50" />
          <input className="input pl-10" placeholder="Search by order ID, customer or product" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search orders" />
        </div>
        <select className="input sm:!w-52" value={filter} onChange={(e) => setFilter(e.target.value as "all" | OrderStatus)} aria-label="Filter by status">
          <option value="all">All statuses</option>
          {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
      </div>

      <TableWrap>
        <thead>
          <tr>
            {["Order ID", "Customer", "Phone", "Product", "Qty", "Date", "Pickup location", "Days", "Rental fee", "Deposit", "Status", "Actions"].map((h) => (
              <th key={h} className={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.length === 0 && <EmptyRow cols={12} text="No orders match these filters." />}
          {list.map((o) => (
            <tr key={o.id} className={tr}>
              <td className={`${td} whitespace-nowrap font-semibold`}>{o.id}</td>
              <td className={`${td} whitespace-nowrap`}>{o.customerName}</td>
              <td className={td}>{o.phone}</td>
              <td className={`${td} whitespace-nowrap`}>{o.productName}</td>
              <td className={td}>{o.quantity}</td>
              <td className={`${td} whitespace-nowrap`}>{formatDate(o.createdAt)}</td>
              <td className={`${td} whitespace-nowrap`}>{o.hostel}</td>
              <td className={td}>{o.durationDays}</td>
              <td className={td}>{inr(o.rentalFee)}</td>
              <td className={td}>{inr(o.deposit)}</td>
              <td className={td}><StatusBadge status={o.status} /></td>
              <td className={td}>
                <div className="flex items-center gap-1.5">
                  <button className="rounded-full p-2 hover:bg-cream" onClick={() => open(o)} aria-label={`View ${o.id}`} title="View details">
                    <Eye className="h-4 w-4" />
                  </button>
                  <select
                    className="input !w-auto !py-1.5 text-xs"
                    value=""
                    onChange={(e) => apply(o, e.target.value as OrderStatus)}
                    aria-label={`Change status of ${o.id}`}
                  >
                    <option value="" disabled>Update…</option>
                    {ACTIONS.filter((a) => a.status !== o.status).map((a) => (
                      <option key={a.status} value={a.status}>{a.label}</option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      {/* Details */}
      <Modal open={!!viewing} onClose={() => setViewId(null)} title={viewing ? `Order ${viewing.id}` : "Order"} wide>
        {viewing && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <StatusBadge status={viewing.status} />
              <p className="text-sm text-forest/60">Placed {formatDate(viewing.createdAt)}</p>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {[
                ["Customer", viewing.customerName],
                ["Phone", viewing.phone],
                ["Product", `${viewing.productName} × ${viewing.quantity}`],
                ["Rental duration", `${viewing.durationDays} day(s)`],
                ["Pickup location", viewing.hostel],
                ["Rental fee", inr(viewing.rentalFee)],
                ["Refundable deposit", inr(viewing.deposit)],
                ["Total", inr(viewing.total)],
              ].map(([l, v]) => (
                <div key={l} className="rounded-2xl bg-cream/50 p-3">
                  <dt className="text-xs text-forest/60">{l}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="label mt-5">Update status</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {ACTIONS.map((a) => (
                <button
                  key={a.status}
                  className={a.status === "cancelled" ? "btn-outline btn-sm !border-red-300 !text-red-700 hover:!bg-red-50" : viewing.status === a.status ? "btn-gold btn-sm" : "btn-outline btn-sm"}
                  disabled={viewing.status === a.status}
                  onClick={() => apply(viewing, a.status)}
                >
                  {a.label}
                </button>
              ))}
            </div>

            <label className="label mt-5" htmlFor="note">Inspection note / damage deduction</label>
            <textarea
              id="note"
              rows={3}
              className="input"
              placeholder={`e.g. Screen scratched, ₹100 deducted from deposit. Late fee is ${inr(settings.lateFeePerDay)}/day.`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <p className="mt-1 text-xs text-forest/55">Shown to the customer on their order page.</p>
            <div className="mt-3 flex justify-end">
              <button className="btn-primary btn-sm" onClick={() => setOrderNote(viewing.id, note.trim())}>
                Save note
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!cancelId} onClose={() => setCancelId(null)} title="Cancel this order?">
        <p className="text-sm leading-relaxed">The item goes back into available stock and the customer will see the order as cancelled.</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-outline" onClick={() => setCancelId(null)}>Keep order</button>
          <button
            className="btn-danger"
            onClick={() => {
              if (cancelId) updateOrderStatus(cancelId, "cancelled");
              setCancelId(null);
            }}
          >
            Cancel order
          </button>
        </div>
      </Modal>
    </>
  );
}
