export interface ProductDetails {
  _id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  slug?: string;
  price: number;
  finalPrice: number;
  stock?: number;
  stockStatus?: "in-stock" | "out-of-stock" | "preorder";
  backorder?: boolean;
  sizes: { size: string; stock: number }[];
  images: File[];
  video?: string;
  category: { _id: string; name: string };
  tags?: string[];
  brand: { _id: string; name: string };
  collections?: Collections;
  ratings?: number;
  reviews?: Reviews;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  material?: string;
  colors?: {
    _id: string;
    name: string;
    hexCode?: string;
  };
  careInstructions?: string;
  gender?: "Men" | "Women" | "Unisex" | "Boys" | "Girls";
  season?: string;

  seller?: UserData;
  createdAt: string;
}
export interface UserData {
  name: string;
  email: string;
  profilrePicture: string;
  phoneNumber: string;
  address: Address[];
}
export interface Brand {
  name: string;
}
export interface Category {
  _id: string;
  name: string;
}
export interface Reviews {
  name: string;
}
export interface Collections {
  name: string;
}

export interface Address {
  _id: string;
  addressLine1: string;
  addressLine2?: string;
  phoneNumber: string;
  city: string;
  state: string;
  pin: string;
}

export interface Product {
  _id: string;
  images: string[];
  name: string;
  price: number;
  finalPrice: number;
  shippingCharges: string;
}
export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}
export interface OrderItem {
  _id: string;
  product: ProductDetails;
  quantity: number;
}
export interface PaymentDetails {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
export interface Order {
  user: UserData;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: Address;
  paymentStatus: string;
  paymentMethod: string;
  paymentDetails: PaymentDetails; // ✅ fix here
  status: string;
  createdAt: Date;
}

export interface Color {
  _id: string;
  name: string;
  hexCode?: string;
}

export interface ColorsResponse {
  success: boolean;
  data: Color[];
}

// types.ts
export interface Brand {
  _id: string; // make sure this exists
  name: string;
}

export interface BrandsResponse {
  success: boolean;
  data: Brand[];
}

export interface PaymentDetails {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
