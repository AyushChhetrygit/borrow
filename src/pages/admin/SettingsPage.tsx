import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { DEFAULT_SETTINGS } from "../../data/seed";
import { Modal } from "../../components/Modal";
import { PageHeader } from "./ui";
import type { Settings } from "../../types";

export default function SettingsPage() {
  const { settings, updateSettings, resetDemo } = useStore();
  const [f, setF] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => {
    setF((s) => ({ ...s, [k]: v }));
    setSaved(false);
    setError("");
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.businessName.trim()) return setError("Business name can’t be empty.");
    if (f.defaultDeliveryMax < f.defaultDeliveryMin) return setError("Maximum delivery time must be at least the minimum.");
    if (f.lateFeePerDay < 0) return setError("Late fee can’t be negative.");
    updateSettings({ ...f, businessName: f.businessName.trim(), tagline: f.tagline.trim() });
    setSaved(true);
  };

  return (
    <>
      <PageHeader title="Settings" text="Saved in your browser’s localStorage." />
      <form onSubmit={save} className="card grid max-w-3xl gap-4 p-6 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="bn">Business name</label>
          <input id="bn" className="input" value={f.businessName} onChange={(e) => set("businessName", e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="tg">Brand tagline</label>
          <input id="tg" className="input" value={f.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <p className="label">Default delivery estimate (used for new products)</p>
          <div className="flex items-center gap-2 text-sm">
            <input type="number" min="5" className="input !w-24" aria-label="Minimum minutes" value={f.defaultDeliveryMin} onChange={(e) => set("defaultDeliveryMin", Number(e.target.value))} />
            <span>to</span>
            <input type="number" min="5" className="input !w-24" aria-label="Maximum minutes" value={f.defaultDeliveryMax} onChange={(e) => set("defaultDeliveryMax", Number(e.target.value))} />
            <span>minutes</span>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="lf">Default late return penalty (₹ per day)</label>
          <input id="lf" type="number" min="0" className="input" value={f.lateFeePerDay} onChange={(e) => set("lateFeePerDay", Number(e.target.value))} />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="rp">Rental policy</label>
          <textarea id="rp" rows={9} className="input" value={f.rentalPolicy} onChange={(e) => set("rentalPolicy", e.target.value)} />
          <p className="mt-1 text-xs text-forest/55">Shown on the customer’s Rental Policy page.</p>
        </div>
        {error && <p role="alert" className="text-sm font-medium text-red-600 sm:col-span-2">{error}</p>}
        <div className="flex items-center gap-3 sm:col-span-2">
          <button type="submit" className="btn-primary">Save settings</button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-sage" role="status">
              <Check className="h-4 w-4" /> Settings saved
            </span>
          )}
        </div>
      </form>

      <div className="card mt-6 max-w-3xl p-6">
        <h2 className="text-lg font-bold">Reset demo data</h2>
        <p className="mt-1 text-sm text-forest/70">
          Restores the 15 starter products, sample orders and default settings, and clears the order history stored in this browser.
        </p>
        <button className="btn-outline mt-4 !border-red-300 !text-red-700 hover:!bg-red-50" onClick={() => setConfirmReset(true)}>
          <RotateCcw className="h-4 w-4" /> Reset demo data
        </button>
      </div>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="Reset all demo data?">
        <p className="text-sm leading-relaxed">Your products, orders and settings will go back to the starting demo. This can’t be undone.</p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-outline" onClick={() => setConfirmReset(false)}>Keep my data</button>
          <button
            className="btn-danger"
            onClick={() => {
              resetDemo();
              setF({ ...DEFAULT_SETTINGS });
              setConfirmReset(false);
              setSaved(false);
            }}
          >
            Reset everything
          </button>
        </div>
      </Modal>
    </>
  );
}
