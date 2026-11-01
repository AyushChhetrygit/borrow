import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PackageOpen, Search } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { StatusBadge } from "../../components/StatusBadge";
import { ProductImage } from "../../components/ProductArt";
import { formatDate, inr } from "../../utils";

export default function MyOrders() {
  const { orders, myOrderIds, getOrder } = useStore();
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const mine = myOrderIds.map((id) => orders.find((o) => o.id === id)).filter(Boolean) as typeof orders;

  const lookup = (e: React.FormEvent) => {
    e.preventDefault();
    const id = code.trim().toUpperCase();
    if (!id) return;
    if (getOrder(id)) nav(`/order/${id}`);
    else setError("No order found with that ID. Check it and try again.");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-extrabold">My orders</h1>
      <p className="mt-2 text-forest/70">Track deliveries placed from this browser, or look up any order by its ID.</p>

      <form onSubmit={lookup} className="mt-6 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/50" />
          <input
            className="input rounded-full py-3 pl-11"
            placeholder="Enter order ID, e.g. BRW-7K2QX"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            aria-label="Order ID"
          />
        </div>
        <button className="btn-primary" type="submit">
          Track order
        </button>
      </form>
      {error && <p role="alert" className="mt-2 text-sm font-medium text-red-600">{error}</p>}

      {mine.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-3xl bg-cream/50 px-6 py-16 text-center">
          <PackageOpen className="h-12 w-12 text-sage" />
          <h2 className="mt-4 text-2xl font-bold">No orders yet</h2>
          <p className="mt-1 max-w-sm text-forest/70">Rent something from the catalogue and you’ll be able to follow it here.</p>
          <Link to="/catalogue" className="btn-primary mt-5">
            Explore catalogue
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {mine.map((o) => (
            <li key={o.id}>
              <Link to={`/order/${o.id}`} className="card flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-lift">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-cream/50">
                  <ProductImage image={o.image} art={o.art} alt={o.productName} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-bold">{o.productName}</p>
                  <p className="text-sm text-forest/60">
                    {o.id} · {formatDate(o.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-extrabold">{inr(o.total)}</p>
                  <StatusBadge status={o.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
