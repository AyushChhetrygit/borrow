import { Link, useParams } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { inr } from "../../utils";

const FAQS = [
  ["How does renting work?", "Pick an item, choose how many days you need it, enter your hostel details and place the order. We deliver it, and you return it when you’re done."],
  ["What is the security deposit?", "A refundable amount equal to the item’s replacement value. It is returned after the item is back and inspected."],
  ["How fast is delivery?", "Each product shows its own estimate, usually 15–20, 25–35 or 40–50 minutes. These are demo estimates, not guarantees."],
  ["What if I return something late?", "A daily late fee applies for each day after the agreed return date and is deducted from your deposit."],
  ["What if I damage or lose an item?", "Damage is assessed at inspection and deducted from the deposit. Lost or unreturned items can be charged up to 2× the replacement value."],
  ["Is this a real service?", "No. BORROW is a student prototype. Orders, payments and deliveries are simulated and stored only in your browser."],
];

export default function Info() {
  const { topic } = useParams();
  const { settings } = useStore();

  let title = "Page not found";
  let body: React.ReactNode = (
    <p>
      That page doesn’t exist. <Link to="/" className="font-semibold underline">Go home</Link>.
    </p>
  );

  if (topic === "about") {
    title = `About ${settings.businessName}`;
    body = (
      <div className="space-y-4 leading-relaxed">
        <p>
          {settings.businessName} is a rental platform for college students. Instead of buying a calculator for one exam or a
          power bank for one trip, you borrow it for a few days, delivered to your hostel.
        </p>
        <p>
          We combine a simple rental marketplace with the speed of quick-commerce: affordable, convenient and sustainable.
          {" "}<b>{settings.tagline}</b>
        </p>
        <p className="text-sm text-forest/60">This is a frontend-only college mini-project prototype built with React, TypeScript and Tailwind CSS.</p>
      </div>
    );
  } else if (topic === "contact") {
    title = "Contact";
    body = (
      <div className="space-y-4">
        <p>Questions about an order or a return? Reach out (demo contact details).</p>
        <ul className="space-y-3">
          <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-sage" /> hello@borrow.example</li>
          <li className="flex items-center gap-3"><Phone className="h-5 w-5 text-sage" /> +91 90000 00000</li>
          <li className="flex items-center gap-3"><MapPin className="h-5 w-5 text-sage" /> Campus help desk, Block A</li>
        </ul>
      </div>
    );
  } else if (topic === "faqs") {
    title = "Frequently asked questions";
    body = (
      <div className="space-y-3">
        {FAQS.map(([q, a]) => (
          <details key={q} className="group rounded-2xl border border-forest/10 bg-white p-4 shadow-soft open:bg-cream/50">
            <summary className="cursor-pointer list-none font-bold">{q}</summary>
            <p className="mt-2 text-sm leading-relaxed text-forest/75">{a}</p>
          </details>
        ))}
      </div>
    );
  } else if (topic === "policy") {
    title = "Rental policy";
    body = (
      <div className="space-y-4">
        <p className="whitespace-pre-line leading-relaxed">{settings.rentalPolicy}</p>
        <p className="rounded-2xl bg-cream p-4 text-sm font-medium">
          Current late return fee: <b>{inr(settings.lateFeePerDay)} per day</b>. Lost or unreturned items: up to 2× replacement value.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-extrabold sm:text-5xl">{title}</h1>
      <div className="mt-8">{body}</div>
    </div>
  );
}
