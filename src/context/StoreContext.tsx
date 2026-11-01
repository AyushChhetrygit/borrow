import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  NewOrderInput,
  Order,
  OrderStatus,
  Product,
  ProductStatus,
  Settings,
} from "../types";
import { buildSeed, DEFAULT_SETTINGS } from "../data/seed";
import {
  calcRentalFee,
  canRent,
  generateOrderId,
  isHolding,
  rentedQty,
} from "../utils";

const KEYS = {
  products: "borrow.products.v1",
  orders: "borrow.orders.v1",
  settings: "borrow.settings.v1",
  mine: "borrow.myOrders.v1",
} as const;

const CATALOGUE_RELEASE_KEY = "borrow.catalogue.release";
const CATALOGUE_RELEASE = 3;

/* ---------- safe localStorage helpers ---------- */

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    const next = JSON.stringify(value);
    if (localStorage.getItem(key) !== next) localStorage.setItem(key, next);
  } catch {
    /* storage full or blocked – the app keeps working in memory */
  }
}

const num = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

function cleanProduct(p: any): Product | null {
  if (!p || typeof p !== "object" || typeof p.id !== "string" || typeof p.name !== "string")
    return null;
  const total = Math.max(0, Math.floor(num(p.totalStock)));
  return {
    id: p.id,
    name: p.name,
    description: String(p.description ?? ""),
    category: p.category ?? "tools",
    image: String(p.image ?? ""),
    art: String(p.art ?? "generic"),
    dailyPrice: num(p.dailyPrice),
    weeklyPrice: num(p.weeklyPrice),
    deposit: num(p.deposit),
    replacementValue: num(p.replacementValue),
    totalStock: total,
    availableStock: Math.min(total, Math.max(0, Math.floor(num(p.availableStock, total)))),
    condition: p.condition ?? "Good",
    deliveryMin: num(p.deliveryMin, 25),
    deliveryMax: num(p.deliveryMax, 35),
    status: p.status === "unavailable" || p.status === "maintenance" ? p.status : "available",
  };
}

function cleanOrder(o: any): Order | null {
  if (!o || typeof o !== "object" || typeof o.id !== "string" || typeof o.productId !== "string")
    return null;
  return {
    id: o.id,
    productId: o.productId,
    productName: String(o.productName ?? "Item"),
    art: String(o.art ?? "generic"),
    image: String(o.image ?? ""),
    customerName: String(o.customerName ?? ""),
    phone: String(o.phone ?? ""),
    hostel: String(o.hostel ?? ""),
    room: String(o.room ?? ""),
    quantity: Math.max(1, Math.floor(num(o.quantity, 1))),
    durationDays: Math.max(1, Math.floor(num(o.durationDays, 1))),
    dailyPrice: num(o.dailyPrice),
    rentalFee: num(o.rentalFee),
    deposit: num(o.deposit),
    total: num(o.total),
    deliveryMin: num(o.deliveryMin, 25),
    deliveryMax: num(o.deliveryMax, 35),
    createdAt: String(o.createdAt ?? new Date().toISOString()),
    status: o.status ?? "confirmed",
    note: o.note ? String(o.note) : undefined,
  };
}

function loadProducts(fallback: Product[]): Product[] {
  const raw = readJSON<unknown[]>(KEYS.products);
  const saved = Array.isArray(raw) ? raw.map(cleanProduct).filter((p): p is Product => !!p) : [];
  const release = num(readJSON<number>(CATALOGUE_RELEASE_KEY));
  const products = release < CATALOGUE_RELEASE
    ? [
        ...saved.map((product) =>
          product.id === "P001" || product.id === "P002" ? { ...product, category: "electronics" as const } : product
        ),
        ...fallback.filter((seed) => !saved.some((product) => product.id === seed.id)),
      ]
    : (saved.length ? saved : fallback);
  try {
    localStorage.setItem(CATALOGUE_RELEASE_KEY, String(CATALOGUE_RELEASE));
  } catch {
    /* storage can be unavailable; seed data remains usable in memory */
  }
  return products;
}
function loadOrders(fallback: Order[]): Order[] {
  const raw = readJSON<unknown[]>(KEYS.orders);
  if (!Array.isArray(raw)) return fallback;
  return raw.map(cleanOrder).filter((o): o is Order => !!o);
}
function loadSettings(): Settings {
  const raw = readJSON<Partial<Settings>>(KEYS.settings);
  if (!raw || typeof raw !== "object") return { ...DEFAULT_SETTINGS };
  return { ...DEFAULT_SETTINGS, ...raw };
}
function loadMine(): string[] {
  const raw = readJSON<unknown[]>(KEYS.mine);
  return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : [];
}

/* ---------- context ---------- */

type ProductInput = Omit<Product, "id" | "availableStock">;

interface Store {
  products: Product[];
  orders: Order[];
  settings: Settings;
  myOrderIds: string[];
  getProduct: (id: string) => Product | undefined;
  getOrder: (id: string) => Order | undefined;
  addProduct: (input: ProductInput) => Product;
  updateProduct: (id: string, patch: Partial<ProductInput>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;
  setProductStatus: (id: string, status: ProductStatus) => void;
  placeOrder: (input: NewOrderInput) => { ok: true; order: Order } | { ok: false; error: string };
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  setOrderNote: (id: string, note: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetDemo: () => void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const seedRef = useRef<ReturnType<typeof buildSeed>>();
  if (!seedRef.current) seedRef.current = buildSeed();
  const seed = seedRef.current;

  const [rawProducts, setRawProducts] = useState<Product[]>(() => loadProducts(seed.products));
  const [orders, setOrders] = useState<Order[]>(() => loadOrders(seed.orders));
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [myOrderIds, setMyOrderIds] = useState<string[]>(() => loadMine());

  // Available stock is always derived from total stock minus items held by live orders.
  const products = useMemo(
    () =>
      rawProducts.map((p) => ({
        ...p,
        availableStock: Math.max(0, p.totalStock - rentedQty(orders, p.id)),
      })),
    [rawProducts, orders]
  );

  /* persist */
  useEffect(() => writeJSON(KEYS.products, products), [products]);
  useEffect(() => writeJSON(KEYS.orders, orders), [orders]);
  useEffect(() => writeJSON(KEYS.settings, settings), [settings]);
  useEffect(() => writeJSON(KEYS.mine, myOrderIds), [myOrderIds]);

  /* live-sync between tabs (e.g. admin in one tab, customer tracking in another) */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEYS.products) setRawProducts(loadProducts(seed.products));
      else if (e.key === KEYS.orders) setOrders(loadOrders(seed.orders));
      else if (e.key === KEYS.settings) setSettings(loadSettings());
      else if (e.key === KEYS.mine) setMyOrderIds(loadMine());
      else if (e.key === null) {
        // storage cleared in another tab
        setRawProducts(seed.products);
        setOrders(seed.orders);
        setSettings({ ...DEFAULT_SETTINGS });
        setMyOrderIds([]);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [seed]);

  const getProduct = useCallback((id: string) => products.find((p) => p.id === id), [products]);
  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  const addProduct: Store["addProduct"] = useCallback((input) => {
    const id = `P${Date.now().toString(36).toUpperCase().slice(-5)}${Math.floor(Math.random() * 90 + 10)}`;
    const product: Product = {
      ...input,
      id,
      availableStock: input.totalStock,
    };
    setRawProducts((prev) => [product, ...prev]);
    return product;
  }, []);

  const updateProduct: Store["updateProduct"] = useCallback((id, patch) => {
    setRawProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const deleteProduct: Store["deleteProduct"] = useCallback((id) => {
    setRawProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const adjustStock: Store["adjustStock"] = useCallback(
    (id, delta) => {
      setRawProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          const held = rentedQty(orders, id);
          // total can never drop below what is currently out with customers
          const total = Math.max(held, p.totalStock + delta);
          return { ...p, totalStock: total };
        })
      );
    },
    [orders]
  );

  const setProductStatus: Store["setProductStatus"] = useCallback((id, status) => {
    setRawProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }, []);

  const placeOrder: Store["placeOrder"] = useCallback(
    (input) => {
      const live = products.find((p) => p.id === input.product.id);
      if (!live) return { ok: false, error: "This product is no longer listed." };
      if (!canRent(live)) return { ok: false, error: "Sorry, this item just became unavailable." };
      if (input.quantity < 1 || input.quantity > live.availableStock)
        return { ok: false, error: `Only ${live.availableStock} available right now.` };
      if (input.durationDays < 1) return { ok: false, error: "Choose a rental duration." };

      const { fee } = calcRentalFee(live, input.durationDays);
      const rentalFee = fee * input.quantity;
      const deposit = live.deposit * input.quantity;
      const order: Order = {
        id: generateOrderId(orders.map((o) => o.id)),
        productId: live.id,
        productName: live.name,
        art: live.art,
        image: live.image,
        customerName: input.customerName.trim(),
        phone: input.phone.trim(),
        hostel: input.hostel.trim(),
        room: input.room.trim(),
        quantity: input.quantity,
        durationDays: input.durationDays,
        dailyPrice: live.dailyPrice,
        rentalFee,
        deposit,
        total: rentalFee + deposit,
        deliveryMin: live.deliveryMin,
        deliveryMax: live.deliveryMax,
        createdAt: new Date().toISOString(),
        status: "confirmed",
      };
      setOrders((prev) => [order, ...prev]);
      setMyOrderIds((prev) => [order.id, ...prev]);
      return { ok: true, order };
    },
    [products, orders]
  );

  const updateOrderStatus: Store["updateOrderStatus"] = useCallback((id, status) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        // block re-activating a cancelled/returned order if it would oversell is handled by derived stock
        return { ...o, status };
      })
    );
  }, []);

  const setOrderNote: Store["setOrderNote"] = useCallback((id, note) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, note: note || undefined } : o)));
  }, []);

  const updateSettings: Store["updateSettings"] = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDemo: Store["resetDemo"] = useCallback(() => {
    const fresh = buildSeed();
    setRawProducts(fresh.products);
    setOrders(fresh.orders);
    setSettings(fresh.settings);
    setMyOrderIds([]);
  }, []);

  const value: Store = {
    products,
    orders,
    settings,
    myOrderIds,
    getProduct,
    getOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    setProductStatus,
    placeOrder,
    updateOrderStatus,
    setOrderNote,
    updateSettings,
    resetDemo,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
