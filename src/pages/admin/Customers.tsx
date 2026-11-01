import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { isHolding } from "../../utils";
import { EmptyRow, PageHeader, TableWrap, td, th, tr } from "./ui";

export default function Customers() {
  const { orders } = useStore();
  const [q, setQ] = useState("");

  const customers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; orders: number; active: number }>();
    orders.forEach((o) => {
      const key = o.phone || o.customerName;
      const c = map.get(key) ?? { name: o.customerName, phone: o.phone, orders: 0, active: 0 };
      c.orders += 1;
      if (isHolding(o)) c.active += 1;
      map.set(key, c);
    });
    return [...map.values()].sort((a, b) => b.orders - a.orders);
  }, [orders]);

  const t = q.trim().toLowerCase();
  const list = customers.filter((c) => !t || c.name.toLowerCase().includes(t) || c.phone.includes(t));

  return (
    <>
      <PageHeader title="Customers" text="Everyone who has placed an order, built from your order history." />
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/50" />
        <input className="input pl-10" placeholder="Search by name or phone" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search customers" />
      </div>
      <TableWrap>
        <thead>
          <tr>
            {["Customer name", "Phone number", "Orders", "Active rentals", "Status"].map((h) => (
              <th key={h} className={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.length === 0 && <EmptyRow cols={5} text={customers.length ? "No customers match that search." : "No customers yet. They appear after the first order."} />}
          {list.map((c) => (
            <tr key={c.phone + c.name} className={tr}>
              <td className={`${td} font-semibold`}>{c.name}</td>
              <td className={td}>{c.phone}</td>
              <td className={td}>{c.orders}</td>
              <td className={td}>{c.active}</td>
              <td className={td}>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c.active > 0 ? "bg-sage text-white" : "bg-forest/10"}`}>
                  {c.active > 0 ? "Active renter" : "No active rentals"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </>
  );
}
