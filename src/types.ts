export type CategoryId =
  | "study"
  | "electronics"
  | "rain"
  | "sports"
  | "games"
  | "tools";

export type ProductStatus = "available" | "unavailable" | "maintenance";
export type Condition = "New" | "Like new" | "Good" | "Fair";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  /** Optional image URL. When empty, the built-in BORROW illustration is used. */
  image: string;
  /** Key of the built-in illustration (see ProductArt) */
  art: string;
  dailyPrice: number;
  weeklyPrice: number;
  deposit: number;
  replacementValue: number;
  totalStock: number;
  availableStock: number;
  condition: Condition;
  deliveryMin: number;
  deliveryMax: number;
  status: ProductStatus;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "returned"
  | "cancelled";

export interface Order {
  id: string;
  productId: string;
  productName: string;
  art: string;
  image: string;
  customerName: string;
  phone: string;
  hostel: string;
  room: string;
  quantity: number;
  durationDays: number;
  dailyPrice: number;
  rentalFee: number;
  deposit: number;
  total: number;
  deliveryMin: number;
  deliveryMax: number;
  createdAt: string; // ISO
  status: OrderStatus;
  /** Admin notes e.g. damage deduction */
  note?: string;
}

export interface Settings {
  businessName: string;
  tagline: string;
  defaultDeliveryMin: number;
  defaultDeliveryMax: number;
  lateFeePerDay: number;
  rentalPolicy: string;
}

export interface NewOrderInput {
  product: Product;
  customerName: string;
  phone: string;
  hostel: string;
  room: string;
  quantity: number;
  durationDays: number;
}
