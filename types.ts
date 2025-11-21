
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
}

export interface Address {
  id: string;
  contact: string;
  phone: string;
  location: string;
  detail: string;
  tag: string; // e.g., 'Home', 'Company'
  isDefault: boolean;
}

export interface Store {
  id: number;
  name: string;
  distance: string;
  address: string;
  image: string;
  tags: string[];
  status: 'OPEN' | 'CLOSED';
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
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSpec?: Record<string, string>; // e.g., { "Size": "Large", "Sugar": "Less" }
}

export enum OrderStatus {
  PAID = '已支付',
  CANCELLED = '已取消',
  PENDING = '待支付',
  COMPLETED = '已完成'
}

export interface OrderItem {
  name: string;
  image: string;
  count: number;
  price: number;
}

export interface Order {
  id: string;
  storeName: string;
  status: OrderStatus;
  date: string;
  items: OrderItem[];
  total: number;
  type: 'Dine In' | 'Pick Up' | 'Delivery';
}

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
  | 'POINTS_MALL';