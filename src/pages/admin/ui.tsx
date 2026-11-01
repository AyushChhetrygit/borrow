import type { ReactNode } from "react";

export function PageHeader({ title, text, actions }: { title: string; text?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl font-extrabold">{title}</h1>
        {text && <p className="mt-1 text-sm text-forest/65">{text}</p>}
      </div>
      {actions}
    </div>
  );
}

export function StatCard({ label, value, icon, tone = "cream" }: { label: string; value: number | string; icon: ReactNode; tone?: "cream" | "forest" | "gold" | "sage" }) {
  const t = {
    cream: "bg-white",
    forest: "bg-forest text-white",
    gold: "bg-gold",
    sage: "bg-sage text-white",
  }[tone];
  return (
    <div className={`rounded-3xl border border-forest/10 p-5 shadow-soft ${t}`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${tone === "forest" || tone === "sage" ? "text-white/80" : "text-forest/65"}`}>{label}</p>
        <span className="opacity-80">{icon}</span>
      </div>
      <p className="mt-2 font-display text-4xl font-extrabold tabular-nums">{value}</p>
    </div>
  );
}

export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
      </div>
    </div>
  );
}

export const th = "whitespace-nowrap bg-cream/50 px-4 py-3 text-xs font-bold text-forest/70";
export const td = "px-4 py-3 align-middle";
export const tr = "border-t border-forest/10 hover:bg-cream/30";

export function EmptyRow({ cols, text }: { cols: number; text: string }) {
  return (
    <tr>
      <td colSpan={cols} className="px-4 py-12 text-center text-forest/60">
        {text}
      </td>
    </tr>
  );
}
