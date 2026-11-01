import type { Condition, Order, OrderStatus, Product, Settings, CategoryId } from "../types";
import { calcRentalFee, isHolding } from "../utils";

export const DEFAULT_POLICY = `1. Refundable deposit: every rental includes a security deposit equal to the item's replacement value. It is refunded in full after the item is returned and inspected.
2. Rental fee: daily price × number of days. For 7+ days the better of the daily or weekly rate is applied automatically.
3. Late returns: a fee equal to twice the item’s daily rental price is charged for every day past the agreed return date and deducted from the deposit.
4. Damaged items: the admin records an appropriate deduction from the deposit after inspection, up to the replacement value.
5. Lost or unreturned items: charged at the item’s original/replacement value (the deposit is adjusted first).
6. Pickup: collect your confirmed rental from the pickup location chosen during checkout. We’ll show when it is ready to collect.`;

export const DEFAULT_SETTINGS: Settings = {
  businessName: "BORROW",
  tagline: "Need it? Borrow it.",
  defaultDeliveryMin: 25,
  defaultDeliveryMax: 35,
  lateFeePerDay: 20,
  rentalPolicy: DEFAULT_POLICY,
};

type Seed = [
  id: string,
  name: string,
  art: string,
  category: CategoryId,
  daily: number,
  replacement: number,
  stock: number,
  condition: Condition,
  dMin: number,
  dMax: number,
  description: string,
];

const PRODUCT_SEEDS: Seed[] = [
  ["P001", "Scientific Calculator", "sci-calc", "electronics", 20, 700, 10, "Good", 15, 20,
    "Casio-style scientific calculator with 240+ functions. Exam-hall friendly and battery included."],
  ["P002", "Basic Calculator", "calc", "electronics", 5, 150, 5, "Good", 15, 20,
    "Simple 12-digit desktop calculator for quick sums, bills and splitting hostel expenses."],
  ["P003", "Stapler", "stapler", "study", 5, 70, 10, "Good", 15, 20,
    "Sturdy stapler that handles up to 20 sheets. Staples are loaded and ready."],
  ["P004", "Scissors", "scissors", "study", 5, 70, 10, "Good", 15, 20,
    "Sharp stainless-steel scissors for chart paper, crafts and project work."],
  ["P005", "Cutter", "cutter", "study", 5, 70, 10, "Good", 15, 20,
    "Retractable utility cutter with a fresh blade, ideal for model making and posters."],
  ["P006", "Paint Brushes", "brushes", "study", 7, 80, 15, "Like new", 25, 35,
    "Set of 8 round and flat brushes for watercolour and poster colours."],
  ["P007", "Charging Cable", "cable", "electronics", 5, 120, 15, "Good", 15, 20,
    "Fast-charge USB-C cable, 1.5 m. Works with most Android phones, tablets and earbuds."],
  ["P008", "Power Bank", "powerbank", "electronics", 30, 1000, 5, "Good", 25, 35,
    "10,000 mAh power bank with two USB ports. Fully charged before every pickup."],
  ["P009", "HDMI Cable", "hdmi", "electronics", 5, 90, 4, "Good", 25, 35,
    "2 m HDMI cable for presentations, movie nights and connecting laptops to TVs."],
  ["P010", "Extension Cord", "extension", "electronics", 5, 180, 5, "Good", 25, 35,
    "4-socket extension board with surge protection and a 3 m cord."],
  ["P016", "Collar Microphone", "mic", "electronics", 15, 400, 3, "Good", 25, 35,
    "Clip-on collar microphone for online classes, recordings and presentations."],
  ["P017", "Portable Speaker", "speaker", "electronics", 25, 800, 5, "Good", 25, 35,
    "Compact Bluetooth speaker for study breaks, hostel rooms and small gatherings."],
  ["P011", "Umbrella", "umbrella", "rain", 10, 250, 10, "Good", 15, 20,
    "Large windproof umbrella with automatic open. Keeps you dry between lectures."],
  ["P018", "Raincoat", "raincoat", "rain", 15, 700, 8, "Good", 15, 20,
    "Lightweight hooded raincoat for wet walks across campus."],
  ["P012", "Table Tennis Racket", "racket", "sports", 25, 800, 3, "Good", 40, 50,
    "Tournament-style racket with rubber grip. Balls available on request at the hostel desk."],
  ["P019", "Volleyball", "volleyball", "sports", 10, 300, 3, "Good", 40, 50,
    "Outdoor volleyball, inflated and ready for a quick match."],
  ["P022", "Basketball", "basketball", "sports", 15, 500, 3, "Good", 40, 50,
    "Outdoor basketball, fully inflated and ready for a court session."],
  ["P020", "Tennis Racket", "tennis", "sports", 50, 1_700, 2, "Good", 40, 50,
    "Lightweight tennis racket with a comfortable grip for casual campus games."],
  ["P021", "Cricket Kit", "cricket", "sports", 60, 2_000, 2, "Good", 40, 50,
    "Complete cricket kit with bat, ball, stumps and protective pads."],
  ["P013", "Chess Board", "chess", "games", 10, 300, 5, "Like new", 40, 50,
    "Foldable wooden chess board with a full set of weighted pieces."],
  ["P014", "Playing Cards", "cards", "games", 5, 80, 8, "Good", 15, 20,
    "Plastic-coated 52-card deck. Perfect for hostel common-room nights."],
  ["P015", "Board Games", "boardgame", "games", 35, 1_200, 4, "Good", 40, 50,
    "Classic family board game box with all pieces counted and checked before pickup."],
];

/** Security deposits supplied with the current campus price list. */
const SECURITY_DEPOSITS: Record<string, number> = {
  P001: 175, P002: 40, P003: 20, P004: 20, P005: 20, P006: 20,
  P007: 30, P008: 250, P009: 22, P010: 45, P011: 60, P012: 200,
  P013: 75, P014: 20, P015: 300, P016: 100, P017: 200, P018: 175,
  P019: 75, P020: 400, P021: 500, P022: 125,
};

const CUSTOMERS = [
  { name: "Aarav Mehta", phone: "9876543210", hostel: "Tagore Hostel", room: "Room 214" },
  { name: "Ishita Rao", phone: "9823012345", hostel: "Gargi Girls Hostel", room: "Room 108" },
  { name: "Rohan Das", phone: "9934567812", hostel: "Nehru Hostel", room: "Room 305" },
  { name: "Meera Nair", phone: "9745098765", hostel: "Gargi Girls Hostel", room: "Room 221" },
  { name: "Kabir Singh", phone: "9811122334", hostel: "Library Block", room: "Study Hall 2" },
  { name: "Ananya Iyer", phone: "9900112233", hostel: "Tagore Hostel", room: "Room 117" },
  { name: "Vivaan Gupta", phone: "9654321098", hostel: "Nehru Hostel", room: "Room 412" },
];

// [productId, customerIdx, qty, days, daysAgo, hourOfDay, status]
const ORDER_SEEDS: [string, number, number, number, number, number, OrderStatus][] = [
  ["P001", 0, 1, 3, 6, 10, "returned"],
  ["P011", 1, 1, 2, 6, 15, "returned"],
  ["P008", 2, 1, 2, 5, 11, "returned"],
  ["P013", 3, 1, 3, 4, 19, "returned"],
  ["P001", 4, 1, 4, 4, 9, "returned"],
  ["P007", 5, 2, 1, 3, 16, "returned"],
  ["P011", 0, 1, 1, 3, 13, "returned"],
  ["P014", 6, 2, 2, 2, 20, "delivered"],
  ["P008", 1, 1, 3, 2, 12, "delivered"],
  ["P012", 2, 2, 2, 1, 17, "delivered"],
  ["P009", 3, 1, 1, 1, 18, "out_for_delivery"],
  ["P002", 4, 1, 2, 0, 9, "preparing"],
  ["P006", 5, 1, 5, 0, 10, "confirmed"],
  ["P001", 6, 1, 2, 0, 11, "pending"],
];

export function buildSeed(): { products: Product[]; orders: Order[]; settings: Settings } {
  const products: Product[] = PRODUCT_SEEDS.map(
    ([id, name, art, category, daily, replacement, stock, condition, dMin, dMax, description]) => ({
      id,
      name,
      description,
      category,
      image: "",
      art,
      dailyPrice: daily,
      weeklyPrice: Math.round(daily * 5),
      deposit: SECURITY_DEPOSITS[id] ?? Math.round(replacement / 4),
      replacementValue: replacement,
      totalStock: stock,
      availableStock: stock,
      condition,
      deliveryMin: dMin,
      deliveryMax: dMax,
      status: "available",
    })
  );

  const now = Date.now();
  const orders: Order[] = ORDER_SEEDS.map(([pid, ci, qty, days, daysAgo, hour, status], i) => {
    const p = products.find((x) => x.id === pid)!;
    const c = CUSTOMERS[ci];
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, 10 + i * 3, 0, 0);
    // never place seeded orders in the future
    if (d.getTime() > now) d.setTime(now - (i + 1) * 60_000 * 7);
    const { fee } = calcRentalFee(p, days);
    return {
      id: `BRW-${(1000 + i * 37).toString(36).toUpperCase().padStart(5, "K")}`,
      productId: p.id,
      productName: p.name,
      art: p.art,
      image: p.image,
      customerName: c.name,
      phone: c.phone,
      hostel: c.hostel,
      room: c.room,
      quantity: qty,
      durationDays: days,
      dailyPrice: p.dailyPrice,
      rentalFee: fee * qty,
      deposit: p.deposit * qty,
      total: (fee + p.deposit) * qty,
      deliveryMin: p.deliveryMin,
      deliveryMax: p.deliveryMax,
      createdAt: d.toISOString(),
      status,
    };
  });

  // Keep inventory consistent with the seeded orders
  for (const p of products) {
    const held = orders
      .filter((o) => o.productId === p.id && isHolding(o))
      .reduce((s, o) => s + o.quantity, 0);
    p.availableStock = Math.max(0, p.totalStock - held);
  }

  return { products, orders, settings: { ...DEFAULT_SETTINGS } };
}
