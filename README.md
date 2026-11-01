# BORROW – Need it? Borrow it.

A frontend-only prototype of a student rental platform with a quick-commerce ordering experience.
Customers browse and rent everyday campus essentials (calculators, umbrellas, chargers, board games…)
and see a delivery estimate and live tracking. One **admin dashboard** manages products, inventory,
orders, customers and settings.

**Stack:** React · Vite · TypeScript · Tailwind CSS · React Router DOM · localStorage · Lucide React · Recharts.
No backend, database, real auth or payments. All data lives in React Context and the browser's `localStorage`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into /dist
npm run preview    # serve the production build locally
```

## Pages

| Area | Routes |
| --- | --- |
| Customer | `/` home · `/catalogue` (search + category filter) · `/product/:id` · `/checkout/:id` · `/order/:id` (confirmation + tracking) · `/orders` · `/info/{about,contact,faqs,policy}` |
| Admin (single dashboard) | `/admin` overview · `/admin/products` · `/admin/inventory` · `/admin/orders` · `/admin/customers` · `/admin/settings` |

There is no login. Use **Admin Dashboard** in the top bar (and **Customer site** in the admin) to switch for demos.


## How the rules work

- **Rental fee** = daily price × days. For 7+ days the cheaper of the daily or weekly rate is applied automatically
  (so the weekly price is actually used). **Total payable** = rental fee + refundable deposit, per unit × quantity.
- **Inventory:** `available = total stock − units held by live orders`. Orders hold stock until they are marked
  *Returned* or *Cancelled*. Maintenance/unavailable products can't be ordered.
- **Order statuses:** Pending → Confirmed → Preparing → Out for delivery → Delivered → Returned (or Cancelled).
  New customer orders start as *Confirmed* (quick-commerce style). Seed data includes one *Pending* order so the
  admin **Confirm order** action can be shown.
- **Dashboard stats:** *Active* = pending/confirmed/preparing/out for delivery. *Pending* = not yet out for delivery.
  *Delivered* includes returned.
- **Delivery estimates** come from each product (nearby 15–20, regular 25–35, longer 40–50 min). They are demo values.
- **Penalties:** late fee is configurable in Settings; damage deductions are recorded as a note on the order;
  lost items up to 2× replacement value (policy text, editable in Settings).

## Notes and limits

- Product visuals are built-in illustrations in the brand colours so the app works offline. To use real photos,
  paste an image URL in the admin product form (a live preview is shown).
- The bag icon in the customer navbar opens **My orders** (with a badge for active orders) rather than a multi-item cart,
  because each rental is a single quick checkout.
- Data is per browser. Changes sync between open tabs via the `storage` event. **Reset demo data** restores the seed.

## Project structure

```
src/
  context/StoreContext.tsx   shared state + localStorage persistence (products, orders, settings)
  data/seed.ts               catalogue products, sample orders, default settings
  utils.ts                   pricing, inventory and formatting helpers
  components/                navbar, footer, product card, illustrations, modal, badges
  pages/customer/            home, catalogue, product, checkout, order tracking and info
  pages/admin/               layout + overview, products, inventory, orders, customers, settings
```

Brand colours: `#15370D` forest · `#728E6D` sage · `#E5CD82` gold · `#FFF2B4` cream (see `tailwind.config.js`).
