
// Added missing Store import from types.ts
import { User, Product, Category, Order, OrderStatus, Address, Banner, ApiResponse, PointRecord, Coupon, CartItem, OrderItem, Store } from '../types';

// --- Configuration ---
const API_BASE_URL = 'https://api.your-saas-backend.com/api/v1'; // Replace with actual backend URL
const USE_MOCK = true; // Toggle this to false to use real API calls

// --- Helper Types & Methods ---

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (USE_MOCK) {
    throw new Error("Mock mode enabled, skipping network request");
  }

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const res: ApiResponse<T> = await response.json();
  if (res.code !== 200) {
    throw new Error(res.msg || 'Unknown API error');
  }
  return res.data;
}

// --- Mock Data ---

let MOCK_USER: User = {
  id: 'u123',
  name: '粒',
  phone: '188****4331',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  points: 19,
  balance: 0.00,
  coupons: 2,
  memberCode: '882910',
  isVip: false,
  gender: 0,
};

const MOCK_BANNERS: Banner[] = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop', title: 'Summer Special' },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=400&fit=crop', title: 'New Arrivals' }
];

// Fixed error on line 58: Import 'Store' from types.ts
const MOCK_STORES: Store[] = [
  {
    id: 1,
    name: '棠小一 (科技园店)',
    address: '科技园南区R3-A栋',
    distance: '99.4km',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
    tags: ['营业中', '最近常去'],
    status: 'OPEN',
    businessHours: '08:00-22:00'
  }
];

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: '门店推荐', icon: '🔥', sort: 1 },
  { id: 4, name: '贝果&牛角', icon: ' bagel', sort: 4 },
  { id: 7, name: '咖啡饮品', icon: '☕', sort: 7 },
];

let MOCK_PRODUCTS: Product[] = [
  {
    id: 101,
    categoryId: 1,
    name: '半条梦龙425g超大满足',
    price: 38.9,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    tags: ['新品'],
    description: '巧克力爱好者的终极梦想，浓郁丝滑。',
    sales: 120,
    status: 1,
    isFavorite: true
  }
];

let MOCK_ORDERS: Order[] = [
  {
    id: '3662',
    storeId: 1,
    storeName: '棠小一',
    status: OrderStatus.PREPARING,
    createTime: '2025-09-04 19:31',
    totalAmount: 54.40,
    payAmount: 54.40,
    discountAmount: 0,
    items: [{ productId: 101, name: '开心果千层', count: 1, price: 54.40, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200' }],
    type: 'Pick Up',
    queueNo: 'A128',
    estimatedTime: '8分钟'
  }
];

// --- API Implementation ---

export const api = {
  getUserProfile: async (): Promise<User> => {
    await new Promise(r => setTimeout(r, 500));
    return MOCK_USER;
  },

  updateUserProfile: async (data: Partial<User>): Promise<User> => {
    MOCK_USER = { ...MOCK_USER, ...data };
    return MOCK_USER;
  },

  // Fixed error on line 122: Use imported 'Store' type
  getStores: async (): Promise<Store[]> => {
    return MOCK_STORES;
  },

  // Fixed error on line 126: Use imported 'Store' type
  getStoreInfo: async (id: number = 1): Promise<Store> => {
    return MOCK_STORES[0];
  },

  getCategories: async (): Promise<Category[]> => {
    return MOCK_CATEGORIES;
  },

  getProducts: async (categoryId?: number): Promise<Product[]> => {
    return MOCK_PRODUCTS;
  },

  getRecommendProducts: async (): Promise<Product[]> => {
    return MOCK_PRODUCTS;
  },
  
  toggleFavorite: async (productId: number): Promise<boolean> => {
      const p = MOCK_PRODUCTS.find(p => p.id === productId);
      if(p) p.isFavorite = !p.isFavorite;
      return p?.isFavorite || false;
  },

  getOrders: async (): Promise<Order[]> => {
    return MOCK_ORDERS;
  },
  
  getOrder: async (id: string): Promise<Order | null> => {
      return MOCK_ORDERS.find(o => o.id === id) || null;
  },

  createOrder: async (data: any): Promise<{success: boolean, orderId: string}> => {
    const orderId = Math.floor(Math.random() * 9000 + 1000).toString();
    const newOrder: Order = {
        id: orderId,
        storeId: data.storeId,
        storeName: '棠小一',
        status: OrderStatus.PENDING,
        createTime: new Date().toISOString(),
        totalAmount: 50,
        payAmount: 50,
        discountAmount: 0,
        type: data.type,
        items: [],
        queueNo: 'A' + Math.floor(Math.random() * 900 + 100)
    };
    MOCK_ORDERS.unshift(newOrder);
    return { success: true, orderId };
  },
  
  payOrder: async (orderId: string): Promise<boolean> => {
    const o = MOCK_ORDERS.find(o => o.id === orderId);
    if(o) o.status = OrderStatus.PAID;
    return true;
  },

  getAddresses: async (): Promise<Address[]> => { return []; },
  addAddress: async (data: any): Promise<Address> => { return {} as any; },
  getBanners: async (): Promise<Banner[]> => { return MOCK_BANNERS; },
  getPointsHistory: async (): Promise<PointRecord[]> => { return []; },
  getCoupons: async (): Promise<Coupon[]> => { return []; }
};
