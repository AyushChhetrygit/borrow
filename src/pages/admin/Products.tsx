import { useMemo, useState } from "react";
import { ImageOff, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { Modal } from "../../components/Modal";
import { ProductArt, ProductImage } from "../../components/ProductArt";
import { CATEGORIES, categoryLabel, DELIVERY_PRESETS, inr, rentedQty } from "../../utils";
import type { CategoryId, Condition, Product, ProductStatus } from "../../types";
import { EmptyRow, PageHeader, TableWrap, td, th, tr } from "./ui";

interface FormState {
  name: string;
  description: string;
  category: CategoryId;
  image: string;
  art: string;
  dailyPrice: string;
  weeklyPrice: string;
  replacementValue: string;
  deposit: string;
  totalStock: string;
  condition: Condition;
  deliveryMin: number;
  deliveryMax: number;
  status: ProductStatus;
}

const CONDITIONS: Condition[] = ["New", "Like new", "Good", "Fair"];

const ART_BY_CATEGORY: Record<CategoryId, string> = {
  study: "calc",
  electronics: "cable",
  rain: "umbrella",
  sports: "racket",
  games: "cards",
  tools: "generic",
};

export default function Products() {
  const { products, orders, settings, addProduct, updateProduct, deleteProduct, setProductStatus } = useStore();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const list = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase())),
    [products, q]
  );

  return (
    <>
      <PageHeader
        title="Products"
        text="Anything you add or change here shows up on the customer catalogue immediately."
        actions={
          <button className="btn-primary" onClick={() => setEditing("new")}>
            <Plus className="h-4 w-4" /> Add product
          </button>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/50" />
        <input className="input pl-10" placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
      </div>

      <TableWrap>
        <thead>
          <tr>
            {["Product", "Category", "Daily", "Weekly", "Deposit", "Stock", "Delivery", "Available", "Actions"].map((h) => (
              <th key={h} className={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.length === 0 && <EmptyRow cols={9} text="No products match. Add one to get started." />}
          {list.map((p) => (
            <tr key={p.id} className={tr}>
              <td className={td}>
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-cream/60">
                    <ProductImage image={p.image} art={p.art} alt="" />
                  </div>
                  <div className="min-w-0">
                    <p className="max-w-[180px] truncate font-semibold">{p.name}</p>
                    <p className="text-xs text-forest/50">{p.id}</p>
                  </div>
                </div>
              </td>
              <td className={`${td} whitespace-nowrap`}>{categoryLabel(p.category)}</td>
              <td className={td}>{inr(p.dailyPrice)}</td>
              <td className={td}>{inr(p.weeklyPrice)}</td>
              <td className={td}>{inr(p.deposit)}</td>
              <td className={`${td} whitespace-nowrap`}>{p.availableStock}/{p.totalStock}</td>
              <td className={`${td} whitespace-nowrap`}>{p.deliveryMin}–{p.deliveryMax} min</td>
              <td className={td}>
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={p.status === "available"}
                    onChange={(e) => setProductStatus(p.id, e.target.checked ? "available" : "unavailable")}
                    aria-label={`${p.name} available`}
                  />
                  <span className="relative h-6 w-11 rounded-full bg-forest/20 transition peer-checked:bg-sage peer-focus-visible:ring-2 peer-focus-visible:ring-gold after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
                  {p.status === "maintenance" && <span className="text-xs font-semibold text-forest/60">Maintenance</span>}
                </label>
              </td>
              <td className={td}>
                <div className="flex gap-1">
                  <button className="rounded-full p-2 hover:bg-cream" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button className="rounded-full p-2 text-red-600 hover:bg-red-50" onClick={() => setDeleting(p)} aria-label={`Delete ${p.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      {editing && (
        <ProductForm
          key={editing === "new" ? "new" : editing.id}
          product={editing === "new" ? null : editing}
          heldQty={editing === "new" ? 0 : rentedQty(orders, editing.id)}
          defaults={{ min: settings.defaultDeliveryMin, max: settings.defaultDeliveryMax }}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            if (editing === "new") addProduct(data);
            else updateProduct(editing.id, data);
            setEditing(null);
          }}
        />
      )}

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete product?">
        {deleting && (
          <div>
            <p className="text-sm leading-relaxed">
              <b>{deleting.name}</b> will be removed from the customer catalogue. Existing orders keep their details.
              {rentedQty(orders, deleting.id) > 0 && (
                <span className="mt-2 block rounded-xl bg-gold/40 p-3 font-medium">
                  {rentedQty(orders, deleting.id)} unit(s) are currently out with customers.
                </span>
              )}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button className="btn-outline" onClick={() => setDeleting(null)}>Keep product</button>
              <button
                className="btn-danger"
                onClick={() => {
                  deleteProduct(deleting.id);
                  setDeleting(null);
                }}
              >
                Delete product
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function ProductForm({
  product,
  heldQty,
  defaults,
  onClose,
  onSave,
}: {
  product: Product | null;
  heldQty: number;
  defaults: { min: number; max: number };
  onClose: () => void;
  onSave: (data: Omit<Product, "id" | "availableStock">) => void;
}) {
  const [f, setF] = useState<FormState>(() =>
    product
      ? {
          name: product.name,
          description: product.description,
          category: product.category,
          image: product.image,
          art: product.art,
          dailyPrice: String(product.dailyPrice),
          weeklyPrice: String(product.weeklyPrice),
          replacementValue: String(product.replacementValue),
          deposit: String(product.deposit),
          totalStock: String(product.totalStock),
          condition: product.condition,
          deliveryMin: product.deliveryMin,
          deliveryMax: product.deliveryMax,
          status: product.status,
        }
      : {
          name: "",
          description: "",
          category: "study",
          image: "",
          art: "generic",
          dailyPrice: "",
          weeklyPrice: "",
          replacementValue: "",
          deposit: "",
          totalStock: "1",
          condition: "Good",
          deliveryMin: defaults.min,
          deliveryMax: defaults.max,
          status: "available",
        }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [depositTouched, setDepositTouched] = useState(!!product);
  const [imgBroken, setImgBroken] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((s) => ({ ...s, [k]: v }));

  const presetValue = `${f.deliveryMin}-${f.deliveryMax}`;
  const isPreset = DELIVERY_PRESETS.some((d) => `${d.min}-${d.max}` === presetValue);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    const n = (s: string) => Number(s);
    if (f.name.trim().length < 2) err.name = "Enter a product name.";
    if (!(n(f.dailyPrice) > 0)) err.dailyPrice = "Enter a price above ₹0.";
    if (!(n(f.weeklyPrice) > 0)) err.weeklyPrice = "Enter a price above ₹0.";
    if (!(n(f.replacementValue) > 0)) err.replacementValue = "Enter the replacement value.";
    if (!(n(f.deposit) >= 0) || f.deposit === "") err.deposit = "Enter a deposit (0 or more).";
    if (!Number.isInteger(n(f.totalStock)) || n(f.totalStock) < heldQty)
      err.totalStock = heldQty > 0 ? `Whole number, at least ${heldQty} (currently rented).` : "Enter a whole number, 0 or more.";
    if (f.deliveryMax < f.deliveryMin) err.delivery = "Max time must be at least the min time.";
    setErrors(err);
    if (Object.keys(err).length) return;
    onSave({
      name: f.name.trim(),
      description: f.description.trim(),
      category: f.category,
      image: f.image.trim(),
      art: product?.art && product.art !== "generic" ? product.art : ART_BY_CATEGORY[f.category],
      dailyPrice: n(f.dailyPrice),
      weeklyPrice: n(f.weeklyPrice),
      replacementValue: n(f.replacementValue),
      deposit: n(f.deposit),
      totalStock: n(f.totalStock),
      condition: f.condition,
      deliveryMin: f.deliveryMin,
      deliveryMax: f.deliveryMax,
      status: f.status,
    });
  };

  const Err = ({ k }: { k: string }) => (errors[k] ? <p className="mt-1 text-xs font-medium text-red-600">{errors[k]}</p> : null);

  return (
    <Modal open onClose={onClose} title={product ? `Edit ${product.name}` : "Add product"} wide>
      <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="pname">Product name</label>
          <input id="pname" className="input" value={f.name} onChange={(e) => set("name", e.target.value)} />
          <Err k="name" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="pdesc">Description</label>
          <textarea id="pdesc" rows={3} className="input" value={f.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="pcat">Category</label>
          <select id="pcat" className="input" value={f.category} onChange={(e) => set("category", e.target.value as CategoryId)}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="pcond">Product condition</label>
          <select id="pcond" className="input" value={f.condition} onChange={(e) => set("condition", e.target.value as Condition)}>
            {CONDITIONS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="label" htmlFor="pimg">Image URL</label>
          <div className="flex gap-3">
            <input
              id="pimg"
              className="input"
              placeholder="https://… (leave empty to use the BORROW illustration)"
              value={f.image}
              onChange={(e) => {
                set("image", e.target.value);
                setImgBroken(false);
              }}
            />
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-forest/15 bg-cream/60" aria-label="Image preview">
              {f.image.trim() && !imgBroken ? (
                <img src={f.image} alt="Preview" className="h-full w-full object-cover" onError={() => setImgBroken(true)} />
              ) : imgBroken ? (
                <ImageOff className="h-5 w-5 text-red-500" />
              ) : (
                <ProductArt art={product?.art ?? ART_BY_CATEGORY[f.category]} className="h-full w-full" />
              )}
            </div>
          </div>
          {imgBroken && <p className="mt-1 text-xs font-medium text-red-600">That image couldn’t be loaded. Check the link, or clear it to use the illustration.</p>}
        </div>

        <div>
          <label className="label" htmlFor="pdaily">Daily rental price (₹)</label>
          <input id="pdaily" type="number" min="0" className="input" value={f.dailyPrice} onChange={(e) => set("dailyPrice", e.target.value)} />
          <Err k="dailyPrice" />
        </div>
        <div>
          <label className="label" htmlFor="pweekly">Weekly rental price (₹)</label>
          <input id="pweekly" type="number" min="0" className="input" value={f.weeklyPrice} onChange={(e) => set("weeklyPrice", e.target.value)} />
          <Err k="weeklyPrice" />
        </div>
        <div>
          <label className="label" htmlFor="prep">Replacement value (₹)</label>
          <input
            id="prep"
            type="number"
            min="0"
            className="input"
            value={f.replacementValue}
            onChange={(e) => {
              set("replacementValue", e.target.value);
              if (!depositTouched) set("deposit", e.target.value);
            }}
          />
          <Err k="replacementValue" />
        </div>
        <div>
          <label className="label" htmlFor="pdep">Refundable security deposit (₹)</label>
          <input
            id="pdep"
            type="number"
            min="0"
            className="input"
            value={f.deposit}
            onChange={(e) => {
              setDepositTouched(true);
              set("deposit", e.target.value);
            }}
          />
          <p className="mt-1 text-xs text-forest/55">Defaults to the replacement value.</p>
          <Err k="deposit" />
        </div>
        <div>
          <label className="label" htmlFor="pstock">Total quantity</label>
          <input id="pstock" type="number" min="0" className="input" value={f.totalStock} onChange={(e) => set("totalStock", e.target.value)} />
          <Err k="totalStock" />
        </div>
        <div>
          <label className="label" htmlFor="pstatus">Availability</label>
          <select id="pstatus" className="input" value={f.status} onChange={(e) => set("status", e.target.value as ProductStatus)}>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="maintenance">Under maintenance</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="pdel">Estimated delivery time</label>
          <select
            id="pdel"
            className="input"
            value={isPreset ? presetValue : "custom"}
            onChange={(e) => {
              if (e.target.value === "custom") return;
              const [min, max] = e.target.value.split("-").map(Number);
              setF((s) => ({ ...s, deliveryMin: min, deliveryMax: max }));
            }}
          >
            {DELIVERY_PRESETS.map((d) => (
              <option key={d.label} value={`${d.min}-${d.max}`}>{d.label}</option>
            ))}
            <option value="custom">Custom ({f.deliveryMin}–{f.deliveryMax} min)</option>
          </select>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <input type="number" min="5" className="input !w-24" aria-label="Minimum minutes" value={f.deliveryMin} onChange={(e) => set("deliveryMin", Number(e.target.value))} />
            <span>to</span>
            <input type="number" min="5" className="input !w-24" aria-label="Maximum minutes" value={f.deliveryMax} onChange={(e) => set("deliveryMax", Number(e.target.value))} />
            <span>minutes</span>
          </div>
          <Err k="delivery" />
        </div>

        <div className="mt-2 flex justify-end gap-2 sm:col-span-2">
          <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{product ? "Save changes" : "Add product"}</button>
        </div>
      </form>
    </Modal>
  );
}
