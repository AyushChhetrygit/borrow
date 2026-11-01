import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PackageSearch, Search, X } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { ProductCard } from "../../components/ProductCard";
import { CATEGORIES, categoryLabel } from "../../utils";
import type { CategoryId } from "../../types";

export default function Catalogue() {
  const { products } = useStore();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const cat = (params.get("category") as CategoryId | null) ?? null;
  const validCat = cat && CATEGORIES.some((c) => c.id === cat) ? cat : null;

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => {
      if (validCat && p.category !== validCat) return false;
      if (!term) return true;
      return (
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        categoryLabel(p.category).toLowerCase().includes(term)
      );
    });
  }, [products, q, validCat]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-extrabold sm:text-5xl">Explore the catalogue</h1>
      <p className="mt-2 text-forest/70">Find what you need, rent it by the day.</p>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/50" />
          <input
            className="input rounded-full py-3 pl-11 pr-10"
            placeholder="Search calculators, umbrella, power bank…"
            value={q}
            onChange={(e) => setParam("q", e.target.value || null)}
            aria-label="Search products"
          />
          {q && (
            <button onClick={() => setParam("q", null)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-forest/5" aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-thin lg:mx-0 lg:flex-wrap lg:px-0" role="group" aria-label="Filter by category">
          <Chip active={!validCat} onClick={() => setParam("category", null)}>
            All
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={validCat === c.id} onClick={() => setParam("category", c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-forest/60" aria-live="polite">
        {results.length} item{results.length === 1 ? "" : "s"}
        {validCat && ` in ${categoryLabel(validCat)}`}
        {q && ` matching “${q}”`}
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center rounded-3xl bg-cream/50 px-6 py-16 text-center">
          <PackageSearch className="h-12 w-12 text-sage" />
          <h2 className="mt-4 text-2xl font-bold">Nothing matches that search</h2>
          <p className="mt-1 max-w-sm text-forest/70">Try a shorter keyword, or clear the filters to see everything we have.</p>
          <button className="btn-primary mt-5" onClick={() => setParams({}, { replace: true })}>
            Clear search and filters
          </button>
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-forest text-gold shadow-soft" : "border border-forest/15 bg-white hover:bg-cream"
      }`}
    >
      {children}
    </button>
  );
}
