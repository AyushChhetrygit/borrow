import { useMemo, useState } from "react";
import { Minus, Plus, Search } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Modal } from "../../components/Modal";
import { categoryLabel, rentedQty } from "../../utils";
import type { Product, ProductStatus } from "../../types";
import { EmptyRow, PageHeader, TableWrap, td, th, tr } from "./ui";

function inventoryStatus(p: Product): { label: string; cls: string } {
  if (p.status === "maintenance") return { label: "Under maintenance", cls: "bg-gold/50" };
  if (p.status === "unavailable") return { label: "Unavailable", cls: "bg-forest/10" };
  if (p.availableStock <= 0) return { label: "Out of stock", cls: "bg-red-50 text-red-700" };
  if (p.availableStock <= 2) return { label: "Low stock", cls: "bg-gold/40" };
  return { label: "In stock", cls: "bg-sage/20" };
}

export default function Inventory() {
  const { products, orders, adjustStock, updateProduct, setProductStatus } = useStore();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [value, setValue] = useState("");
  const [err, setErr] = useState("");

  const list = useMemo(() => products.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase())), [products, q]);

  const openUpdate = (p: Product) => {
    setEditing(p);
    setValue(String(p.totalStock));
    setErr("");
  };

  const saveTotal = () => {
    if (!editing) return;
    const n = Number(value);
    const held = rentedQty(orders, editing.id);
    if (!Number.isInteger(n) || n < held) {
      setErr(`Enter a whole number of at least ${held} (units currently rented).`);
      return;
    }
    updateProduct(editing.id, { totalStock: n });
    setEditing(null);
  };

  return (
    <>
      <PageHeader title="Inventory" text="Stock changes here update what customers can rent right away." />
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/50" />
        <input className="input pl-10" placeholder="Search inventory" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search inventory" />
      </div>

      <TableWrap>
        <thead>
          <tr>
            {["Product", "Category", "Total", "Available", "Rented", "Status", "Stock actions", "Set state"].map((h) => (
              <th key={h} className={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.length === 0 && <EmptyRow cols={8} text="No products found." />}
          {list.map((p) => {
            const st = inventoryStatus(p);
            const rented = rentedQty(orders, p.id);
            return (
              <tr key={p.id} className={tr}>
                <td className={`${td} font-semibold`}>{p.name}</td>
                <td className={`${td} whitespace-nowrap`}>{categoryLabel(p.category)}</td>
                <td className={td}>{p.totalStock}</td>
                <td className={`${td} font-semibold`}>{p.availableStock}</td>
                <td className={td}>{rented}</td>
                <td className={td}>
                  <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${st.cls}`}>{st.label}</span>
                </td>
                <td className={td}>
                  <div className="flex items-center gap-1.5">
                    <button
                      className="rounded-full border border-forest/15 p-1.5 hover:bg-cream disabled:opacity-40"
                      onClick={() => adjustStock(p.id, -1)}
                      disabled={p.totalStock <= rented}
                      aria-label={`Remove one ${p.name} from stock`}
                      title="Remove stock"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <button className="rounded-full border border-forest/15 p-1.5 hover:bg-cream" onClick={() => adjustStock(p.id, 1)} aria-label={`Add one ${p.name} to stock`} title="Add stock">
                      <Plus className="h-4 w-4" />
                    </button>
                    <button className="btn-outline btn-sm" onClick={() => openUpdate(p)}>Update</button>
                  </div>
                </td>
                <td className={td}>
                  <select
                    className="input !w-auto !py-1.5 text-xs"
                    value={p.status}
                    onChange={(e) => setProductStatus(p.id, e.target.value as ProductStatus)}
                    aria-label={`Set state for ${p.name}`}
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="maintenance">Under maintenance</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </TableWrap>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing ? `Update stock · ${editing.name}` : "Update stock"}>
        {editing && (
          <div>
            <label className="label" htmlFor="newtotal">Total stock</label>
            <input
              id="newtotal"
              type="number"
              min="0"
              className="input"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setErr("");
              }}
              autoFocus
            />
            <p className="mt-1 text-xs text-forest/60">
              {rentedQty(orders, editing.id)} unit(s) are currently rented. Available stock = total − rented.
            </p>
            {err && <p role="alert" className="mt-2 text-sm font-medium text-red-600">{err}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button className="btn-outline" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-primary" onClick={saveTotal}>Save stock</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
