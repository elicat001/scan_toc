
// Standard API Response Wrapper
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  points: number;
  balance: number;
  coupons: number;
  memberCode: string;
  isVip: boolean;
  birthday?: string;
  gender?: number; // 0: unknown, 1: male, 2: female
}

export interface Address {
  id: string;
  contact: string;
  phone: string;
  province?: string;
  city?: string;
  district?: string;
  location: string; // Address line 1
  detail: string;   // Address line 2
  tag: string;      // e.g., 'Home', 'Company'
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

export interface Store {
  id: number;
  name: string;
  distance: string; // Formatted string from backend or calculated on client
  address: string;
  image: string;
  tags: string[];
  status: 'OPEN' | 'CLOSED';
  latitude?: number;
  longitude?: number;
  phone?: string;
  businessHours?: string;
}

export interface ProductSpec {
  name: string;
  options: string[];
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  price: number;
  image: string;
  originalPrice?: number;
  tags?: string[];
  isVip?: boolean;
  vipPrice?: number;
  specs?: ProductSpec[];
  sales?: number;
  stock?: number;
  status?: number; // 1: on_sale, 0: off_shelf
  isFavorite?: boolean;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
  sort?: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSpec?: Record<string, string>; 
}

export enum OrderStatus {
  PENDING = '待支付',
  PAID = '已支付',
  PREPARING = '制作中',
  DELIVERING = '配送中',
  COMPLETED = '已完成',
  CANCELLED = '已取消'
}

export interface OrderItem {
  productId: number;
  name: string;
  image: string;
  count: number;
  price: number;
  specSnapshot?: string;
}

export type OrderType = 'Dine In' | 'Pick Up' | 'Delivery' | 'Scan Order';

export interface Order {
  id: string;
  storeId: number;
  storeName: string;
  status: OrderStatus;
  createTime: string;
  items: OrderItem[];
  totalAmount: number;
  payAmount: number;
  discountAmount: number;
  type: OrderType;
  tableNo?: string;
  remark?: string;
  queueNo?: string;
  estimatedTime?: string;
}

// DTO for Order Creation
export interface CreateOrderPayloadDTO {
  storeId: number;
  type: OrderType;
  items: Array<{
    productId: number;
    name: string;
    price: number;
    count: number;
    specSnapshot?: string;
  }>;
  tableNo?: string;
  couponId?: number;
}

export interface Banner {
  id: number;
  imageUrl: string;
  linkUrl?: string;
  title?: string;
}

export interface Coupon {
  id: number;
  name: string;
  amount: number;
  minSpend: number;
  type: 'DISCOUNT' | 'CASH';
  expireDate: string;
}

export interface PointRecord {
  id: number;
  title: string;
  amount: number; // Positive for earn, negative for spend
  createTime: string;
  type: 'EARN' | 'SPEND';
}

export interface PointsReward {
    id: number;
    name: string;
    points: number;
    image: string;
    type: 'COUPON' | 'DRINK' | 'GIFT';
    description?: string;
    rules?: string[];
}

// View States for Routing
export type ViewState = 
  | 'HOME' 
  | 'MENU' 
  | 'ORDERS' 
  | 'PROFILE' 
  | 'CHECKOUT' 
  | 'ADDRESS_LIST' 
  | 'STORE_LIST' 
  | 'ORDER_DETAIL'
  | 'USER_PROFILE'
  | 'MEMBER_TOPUP'
  | 'POINTS_MALL'
  | 'POINTS_HISTORY'
  | 'POINTS_ITEM_DETAIL'
  | 'RESERVATION'
  | 'STORE_DETAIL'
  | 'MEMBER_CODE'
  | 'SCAN_ORDER';
