import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Boxes,
  CheckCheck,
  Clock3,
  PackageCheck,
  Package,
  Truck,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStore } from "../../context/StoreContext";
import { StatusBadge } from "../../components/StatusBadge";
import { ACTIVE_STATUSES, CATEGORIES, formatDate, inr, PENDING_STATUSES } from "../../utils";
import { EmptyRow, PageHeader, StatCard, TableWrap, td, th, tr } from "./ui";

const PIE_COLORS = ["#15370D", "#728E6D", "#E5CD82", "#3d5c36", "#A9BCA5", "#C9B060"];

export default function Overview() {
  const { products, orders } = useStore();

  const stats = useMemo(() => {
    const totalInventory = products.reduce((s, p) => s + p.totalStock, 0);
    const available = products.reduce((s, p) => s + (p.status === "available" ? p.availableStock : 0), 0);
    return {
      totalProducts: products.length,
      totalInventory,
      available,
      active: orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length,
      pending: orders.filter((o) => PENDING_STATUSES.includes(o.status)).length,
      delivered: orders.filter((o) => o.status === "delivered" || o.status === "returned").length,
      outOfStock: products.filter((p) => p.availableStock <= 0 || p.status !== "available").length,
    };
  }, [products, orders]);

  const mostRented = useMemo(() => {
    const m = new Map<string, number>();
    orders
      .filter((o) => o.status !== "cancelled")
      .forEach((o) => m.set(o.productName, (m.get(o.productName) ?? 0) + o.quantity));
    return [...m.entries()]
      .map(([name, rentals]) => ({ name, rentals }))
      .sort((a, b) => b.rentals - a.rentals)
      .slice(0, 6);
  }, [orders]);

  const byCategory = useMemo(
    () =>
      CATEGORIES.map((c) => ({ name: c.label, value: products.filter((p) => p.category === c.id).length })).filter(
        (d) => d.value > 0
      ),
    [products]
  );

  const trend = useMemo(() => {
    const days: { key: string; label: string; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push({
        key: d.toDateString(),
        label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
        orders: 0,
      });
    }
    orders.forEach((o) => {
      const k = new Date(o.createdAt).toDateString();
      const slot = days.find((d) => d.key === k);
      if (slot) slot.orders += 1;
    });
    return days;
  }, [orders]);

  const recent = [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 6);

  return (
    <>
      <PageHeader title="Overview" text="Live numbers from your products, inventory and orders." />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Total products" value={stats.totalProducts} icon={<Package className="h-5 w-5" />} tone="forest" />
        <StatCard label="Total inventory" value={stats.totalInventory} icon={<Boxes className="h-5 w-5" />} />
        <StatCard label="Available items" value={stats.available} icon={<PackageCheck className="h-5 w-5" />} tone="sage" />
        <StatCard label="Active orders" value={stats.active} icon={<Truck className="h-5 w-5" />} tone="gold" />
        <StatCard label="Pending orders" value={stats.pending} icon={<Clock3 className="h-5 w-5" />} />
        <StatCard label="Delivered orders" value={stats.delivered} icon={<CheckCheck className="h-5 w-5" />} />
        <StatCard label="Out-of-stock products" value={stats.outOfStock} icon={<AlertTriangle className="h-5 w-5" />} />
      </div>
      <p className="mt-2 text-xs text-forest/55">
        Pending = not yet out for delivery. Delivered includes returned. Out-of-stock includes unavailable and under-maintenance items.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Most rented products" note="Units rented, cancelled orders excluded">
          {mostRented.length === 0 ? (
            <p className="py-16 text-center text-sm text-forest/60">No orders yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mostRented} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#15370D22" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#15370D" }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12, fill: "#15370D" }} />
                <Tooltip cursor={{ fill: "#FFF2B488" }} />
                <Bar dataKey="rentals" name="Units rented" fill="#15370D" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Products by category" note="Number of products in each category">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2} stroke="#fff">
                {byCategory.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="lg:col-span-2">
          <ChartCard title="Order trends" note="Orders placed per day, last 7 days">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trend} margin={{ left: -16, right: 16, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#15370D22" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#15370D" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#15370D" }} />
                <Tooltip />
                <Line type="monotone" dataKey="orders" name="Orders" stroke="#15370D" strokeWidth={3} dot={{ r: 5, fill: "#E5CD82", stroke: "#15370D", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent orders</h2>
          <Link to="/admin/orders" className="btn-outline btn-sm">
            Manage orders
          </Link>
        </div>
        <TableWrap>
          <thead>
            <tr>
              {["Order ID", "Customer", "Product", "Placed", "Total", "Status"].map((h) => (
                <th key={h} className={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 && <EmptyRow cols={6} text="No orders yet. Place one from the customer site." />}
            {recent.map((o) => (
              <tr key={o.id} className={tr}>
                <td className={`${td} font-semibold`}>{o.id}</td>
                <td className={td}>{o.customerName}</td>
                <td className={td}>{o.productName} × {o.quantity}</td>
                <td className={`${td} whitespace-nowrap`}>{formatDate(o.createdAt)}</td>
                <td className={`${td} font-semibold`}>{inr(o.total)}</td>
                <td className={td}><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>
    </>
  );
}

function ChartCard({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mb-3 text-xs text-forest/55">{note}</p>
      {children}
    </div>
  );
}
