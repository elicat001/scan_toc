
// Money in cent (integer) is standard for fintech/e-commerce to avoid float precision issues.
export type MoneyCent = number;

export interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  points: number;
  balanceCent: MoneyCent; // Renamed for clarity
  coupons: number;
  memberCode: string;
  isVip: boolean;
  // Added missing fields for UserProfile view
  gender?: number; 
  birthday?: string;
}

// Added missing ProductSpec interface
export interface ProductSpec {
  name: string;
  options: string[];
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  priceCent: MoneyCent; // Use cents
  image: string;
  specs?: ProductSpec[];
  isVip?: boolean;
  vipPriceCent?: MoneyCent;
  isFavorite?: boolean;
}

export interface CartItem extends Product {
  cartLineId: string; // Unique ID for this line (productId + specs)
  quantity: number;
  selectedSpec?: Record<string, string>; 
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PREPARING = 'PREPARING',
  DELIVERING = 'DELIVERING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  productId: number;
  name: string;
  image: string;
  count: number;
  priceCent: MoneyCent;
  specSnapshot?: string;
}

export type OrderType = 'DINE_IN' | 'PICKUP' | 'DELIVERY' | 'SCAN_ORDER';

export interface Order {
  id: string;
  storeId: number;
  storeName: string;
  status: OrderStatus;
  createTime: string;
  items: OrderItem[];
  totalAmountCent: MoneyCent;
  payAmountCent: MoneyCent;
  discountAmountCent: MoneyCent;
  type: OrderType;
  tableNo?: string;
  queueNo?: string;
}

export interface CreateOrderPayloadDTO {
  storeId: number;
  type: OrderType;
  items: Array<{
    productId: number;
    name: string;
    priceCent: MoneyCent;
    count: number;
    specSnapshot?: string;
  }>;
  tableNo?: string;
  couponId?: number;
}

export interface Coupon {
  id: number;
  name: string;
  amountCent: MoneyCent;
  minSpendCent: MoneyCent;
  expireDate: string;
}

// Added missing Category interface
export interface Category {
  id: number;
  name: string;
  icon: string;
}

// Added missing Store interface
export interface Store {
  id: number;
  name: string;
  address: string;
  distance: string;
  image: string;
  tags: string[];
  status: 'OPEN' | 'CLOSED';
  businessHours: string;
}

// Added missing Banner interface
export interface Banner {
  id: number;
  imageUrl: string;
  title: string;
}

// Added missing Address interface
export interface Address {
  id: string;
  location: string;
  detail: string;
  contact: string;
  phone: string;
  tag?: string;
  isDefault?: boolean;
}

// Added missing PointRecord interface
export interface PointRecord {
  id: string;
  title: string;
  amount: number;
  createTime: string;
}

// Added missing PointsReward interface
export interface PointsReward {
  id: number;
  name: string;
  points: number;
  image: string;
  type: 'COUPON' | 'DRINK' | 'GIFT';
  description?: string;
  rules?: string[];
}

// Added missing ApiResponse interface
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

// Updated ViewState to include all possible views
export type ViewState = 
  | 'HOME' | 'MENU' | 'ORDERS' | 'PROFILE' | 'CHECKOUT' 
  | 'ORDER_DETAIL' | 'MEMBER_TOPUP' | 'POINTS_MALL' | 'SCAN_ORDER' | 'RESERVATION'
  | 'ADDRESS_LIST' | 'STORE_LIST' | 'USER_PROFILE' | 'POINTS_HISTORY' | 'POINTS_ITEM_DETAIL' | 'STORE_DETAIL' | 'MEMBER_CODE';
