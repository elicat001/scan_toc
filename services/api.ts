
import { User, Product, Category, Order, Store, OrderStatus, Address, Banner, ApiResponse, PointRecord } from '../types';

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

// --- Mock Data (Fallback) ---

const MOCK_USER: User = {
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

const MOCK_ADDRESSES: Address[] = [
  {
    id: '1',
    contact: '粒',
    phone: '188****4331',
    location: '科技园南区R3-A栋',
    detail: '201室',
    tag: '公司',
    isDefault: true
  },
  {
    id: '2',
    contact: '粒',
    phone: '188****4331',
    location: '阳光花园小区',
    detail: '5栋2单元1003',
    tag: '家',
    isDefault: false
  }
];

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
  },
  {
    id: 2,
    name: '棠小一 (万象天地店)',
    address: '深南大道9668号',
    distance: '102.1km',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400',
    tags: ['营业中', '人气好店'],
    status: 'OPEN',
    businessHours: '09:00-22:30'
  },
  {
    id: 3,
    name: '棠小一 (海岸城店)',
    address: '文心五路33号',
    distance: '105.3km',
    image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400',
    tags: ['休息中'],
    status: 'CLOSED',
    businessHours: '10:00-22:00'
  }
];

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: '门店推荐', icon: '🔥', sort: 1 },
  { id: 2, name: '店铺线下活动', icon: '🎉', sort: 2 },
  { id: 3, name: '进店福利', icon: '🎁', sort: 3 },
  { id: 4, name: '贝果&牛角', icon: '🥯', sort: 4 },
  { id: 5, name: '瑞士卷', icon: '🍰', sort: 5 },
  { id: 6, name: '切块蛋糕', icon: '🧁', sort: 6 },
  { id: 7, name: '咖啡饮品', icon: '☕', sort: 7 },
];

// Make mutable for favorites to persist in mock
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
  },
  {
    id: 201,
    categoryId: 2,
    name: '(到店) 甜品自助甜品周末48.9',
    description: '本店所有产品, 不限数量, 吃饱为止，提前预约',
    price: 48.9,
    vipPrice: 29.34,
    isVip: true,
    image: 'https://images.unsplash.com/photo-1551024601-56377753c43b?w=400',
    tags: ['热销'],
    specs: [
      { name: '份量', options: ['1人份'] }
    ],
    sales: 500,
    status: 1
  },
  {
    id: 301,
    categoryId: 4,
    name: '碱水贝果',
    price: 12.0,
    image: 'https://images.unsplash.com/photo-1621236378699-8597fab6a551?w=400',
    description: '经典德式风味，口感韧劲十足。',
    sales: 85,
    status: 1
  },
  {
    id: 302,
    categoryId: 4,
    name: '全麦核桃贝果',
    price: 15.0,
    image: 'https://images.unsplash.com/photo-1505253304499-671c55413c6e?w=400',
    description: '健康全麦制作，加入大颗核桃仁。',
    sales: 42,
    status: 1,
    isFavorite: true
  },
  {
    id: 501,
    categoryId: 5,
    name: '伯爵茶瑞士卷',
    price: 22.0,
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400',
    sales: 200,
    status: 1
  }
];

const MOCK_ORDERS: Order[] = [
  {
    id: '3662',
    storeId: 1,
    storeName: '棠小一',
    status: OrderStatus.PAID,
    createTime: '2025-09-04 19:31',
    totalAmount: 54.40,
    payAmount: 54.40,
    discountAmount: 0,
    items: [{ productId: 1001, name: '开心果千层', count: 8, price: 54.40, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200' }],
    type: 'Dine In'
  },
  {
    id: '6062',
    storeId: 1,
    storeName: '棠小一',
    status: OrderStatus.PAID,
    createTime: '2025-08-21 15:16',
    totalAmount: 19.45,
    payAmount: 19.45,
    discountAmount: 0,
    items: [{ productId: 501, name: '巧克力卷', count: 1, price: 19.45, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200' }],
    type: 'Dine In'
  },
  {
    id: '1639',
    storeId: 1,
    storeName: '棠小一',
    status: OrderStatus.PAID,
    createTime: '2025-08-04 14:22',
    totalAmount: 10.90,
    payAmount: 10.90,
    discountAmount: 0,
    items: [{ productId: 901, name: '可丽露', count: 1, price: 10.90, image: 'https://images.unsplash.com/photo-1605170426232-4127c4302f60?w=200' }],
    type: 'Dine In'
  }
];

const MOCK_POINT_RECORDS: PointRecord[] = [
    { id: 1, title: '消费奖励 - 订单3662', amount: 54, createTime: '2025-09-04 19:31', type: 'EARN' },
    { id: 2, title: '消费奖励 - 订单6062', amount: 19, createTime: '2025-08-21 15:16', type: 'EARN' },
    { id: 3, title: '兑换优惠券', amount: -500, createTime: '2025-08-20 10:00', type: 'SPEND' },
    { id: 4, title: '消费奖励 - 订单1639', amount: 10, createTime: '2025-08-04 14:22', type: 'EARN' },
    { id: 5, title: '完善生日信息奖励', amount: 100, createTime: '2025-07-01 12:00', type: 'EARN' },
];

// --- API Service Implementation ---

export const api = {
  
  // Auth & User
  getUserProfile: async (): Promise<User> => {
    try {
      return await request<User>('/user/profile');
    } catch (e) {
      await new Promise(r => setTimeout(r, 500));
      return MOCK_USER;
    }
  },

  updateUserProfile: async (data: Partial<User>): Promise<User> => {
    try {
      return await request<User>('/user/profile', { method: 'PUT', body: JSON.stringify(data) });
    } catch (e) {
      await new Promise(r => setTimeout(r, 500));
      return { ...MOCK_USER, ...data };
    }
  },

  // Store
  getStores: async (latitude?: number, longitude?: number): Promise<Store[]> => {
    try {
      const query = latitude ? `?lat=${latitude}&lng=${longitude}` : '';
      return await request<Store[]>(`/shop/list${query}`);
    } catch (e) {
      await new Promise(r => setTimeout(r, 400));
      return MOCK_STORES;
    }
  },

  getStoreInfo: async (id: number = 1): Promise<Store> => {
    try {
      return await request<Store>(`/shop/${id}`);
    } catch (e) {
      await new Promise(r => setTimeout(r, 300));
      return MOCK_STORES.find(s => s.id === id) || MOCK_STORES[0];
    }
  },

  // Product & Category
  getCategories: async (storeId?: number): Promise<Category[]> => {
    try {
      return await request<Category[]>(`/category/list?storeId=${storeId || ''}`);
    } catch (e) {
      await new Promise(r => setTimeout(r, 300));
      return MOCK_CATEGORIES;
    }
  },

  getProducts: async (categoryId?: number, storeId?: number): Promise<Product[]> => {
    try {
      const params = new URLSearchParams();
      if (categoryId) params.append('categoryId', categoryId.toString());
      if (storeId) params.append('storeId', storeId.toString());
      return await request<Product[]>(`/product/list?${params.toString()}`);
    } catch (e) {
      await new Promise(r => setTimeout(r, 400));
      if (categoryId) {
        if (categoryId === 1) return MOCK_PRODUCTS;
        return MOCK_PRODUCTS.filter(p => p.categoryId === categoryId || categoryId === 1);
      }
      return MOCK_PRODUCTS;
    }
  },

  getRecommendProducts: async (): Promise<Product[]> => {
    try {
      return await request<Product[]>('/product/recommend');
    } catch (e) {
      await new Promise(r => setTimeout(r, 300));
      return MOCK_PRODUCTS.slice(0, 3);
    }
  },
  
  toggleFavorite: async (productId: number): Promise<boolean> => {
      try {
          // Simulate API call
          await new Promise(r => setTimeout(r, 200));
          // Update mock data persistence
          const prodIndex = MOCK_PRODUCTS.findIndex(p => p.id === productId);
          if (prodIndex >= 0) {
             MOCK_PRODUCTS[prodIndex].isFavorite = !MOCK_PRODUCTS[prodIndex].isFavorite;
             return MOCK_PRODUCTS[prodIndex].isFavorite || false;
          }
          return false;
      } catch (e) {
          return false;
      }
  },

  // Order
  getOrders: async (status?: string): Promise<Order[]> => {
    try {
      return await request<Order[]>(`/order/list${status ? `?status=${status}` : ''}`);
    } catch (e) {
      await new Promise(r => setTimeout(r, 600));
      return MOCK_ORDERS;
    }
  },

  createOrder: async (data: { storeId: number, items: any[], type: string }): Promise<{success: boolean, orderId: string}> => {
    try {
      const res = await request<{orderId: string}>('/order/create', { method: 'POST', body: JSON.stringify(data) });
      return { success: true, orderId: res.orderId };
    } catch (e) {
      await new Promise(r => setTimeout(r, 1000));
      return { success: true, orderId: Math.random().toString().slice(2, 8) };
    }
  },
  
  payOrder: async (orderId: string): Promise<boolean> => {
     try {
        await request(`/order/${orderId}/pay`, { method: 'POST' });
        return true;
     } catch (e) {
        await new Promise(r => setTimeout(r, 1500));
        return true;
     }
  },

  // Address
  getAddresses: async (): Promise<Address[]> => {
    try {
      return await request<Address[]>('/address/list');
    } catch (e) {
      await new Promise(r => setTimeout(r, 400));
      return MOCK_ADDRESSES;
    }
  },

  addAddress: async (data: Partial<Address>): Promise<Address> => {
    try {
      return await request<Address>('/address/add', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {
      await new Promise(r => setTimeout(r, 500));
      return { ...MOCK_ADDRESSES[0], ...data, id: Math.random().toString() } as Address;
    }
  },

  // Marketing
  getBanners: async (): Promise<Banner[]> => {
    try {
      return await request<Banner[]>('/marketing/banners');
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
      return MOCK_BANNERS;
    }
  },
  
  // Points
  getPointsHistory: async (): Promise<PointRecord[]> => {
      try {
          return await request<PointRecord[]>('/user/points/history');
      } catch (e) {
          await new Promise(r => setTimeout(r, 300));
          return MOCK_POINT_RECORDS;
      }
  }
};
