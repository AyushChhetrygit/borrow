import { Link, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import type { Product } from "../types";
import { availabilityOf, canRent, categoryLabel, inr } from "../utils";
import { ProductImage } from "./ProductArt";

const TONE = {
  ok: "bg-sage/15 text-forest",
  low: "bg-gold/50 text-forest",
  out: "bg-red-50 text-red-700",
};

export function ProductCard({ product: p, imageMotion = false }: { product: Product; imageMotion?: boolean }) {
  const nav = useNavigate();
  const a = availabilityOf(p);
  const rentable = canRent(p);
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-forest/10 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
      <Link to={`/product/${p.id}`} className="relative block aspect-[4/3] overflow-hidden bg-cream/50" aria-label={`View ${p.name}`}>
        <div className={`h-full w-full transition duration-500 group-hover:scale-105 ${rentable ? "" : "opacity-60 grayscale-[40%]"}`}>
          <div className={imageMotion ? "product-art-float h-full w-full" : "h-full w-full"}>
            <ProductImage image={p.image} art={p.art} alt={p.name} />
          </div>
        </div>
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-forest px-2.5 py-1 text-xs font-semibold text-gold">
          <MapPin className="h-3 w-3" /> Pickup
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-sage">{categoryLabel(p.category)}</p>
        <Link to={`/product/${p.id}`} className="mt-0.5 font-display text-lg font-bold leading-tight hover:underline">
          {p.name}
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="font-display text-xl font-extrabold">
            {inr(p.dailyPrice)}
            <span className="text-sm font-medium text-forest/60">/day</span>
          </p>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${TONE[a.tone]}`}>{a.label}</span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-forest/60"><MapPin className="h-3.5 w-3.5" /> Collect from a campus pickup point</p>
        <div className="mt-4 flex gap-2">
          <button
            className="btn-primary flex-1"
            disabled={!rentable}
            onClick={() => nav(`/checkout/${p.id}`)}
          >
            {rentable ? "Rent now" : "Unavailable"}
          </button>
          <Link to={`/product/${p.id}`} className="btn-outline">
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
