
import { User, Product, Category, Order, Store, OrderStatus } from '../types';

// --- Mock Data ---

const MOCK_USER: User = {
  id: 'u123',
  name: '粒',
  phone: '188****4331',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  points: 19,
  balance: 0.00,
  coupons: 0,
  memberCode: '882910',
  isVip: false,
};

const MOCK_STORE: Store = {
  id: 1,
  name: '棠小一',
  address: '科技园南区R3-A栋',
  distance: '99.4km',
  image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop',
  tags: ['营业中', '最近常去'],
  status: 'OPEN'
};

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: '门店推荐', icon: '🔥' },
  { id: 2, name: '店铺线下活动', icon: '🎉' },
  { id: 3, name: '进店福利', icon: '🎁' },
  { id: 4, name: '贝果&牛角', icon: '🥯' },
  { id: 5, name: '瑞士卷', icon: '🍰' },
  { id: 6, name: '切块蛋糕', icon: '🧁' },
  { id: 7, name: '咖啡饮品', icon: '☕' },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: 101,
    categoryId: 1,
    name: '半条梦龙425g超大满足',
    price: 38.9,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    tags: ['新品'],
    description: '巧克力爱好者的终极梦想，浓郁丝滑。',
    sales: 120
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
    ]
  },
  {
    id: 301,
    categoryId: 4,
    name: '碱水贝果',
    price: 12.0,
    image: 'https://images.unsplash.com/photo-1621236378699-8597fab6a551?w=400',
    description: '经典德式风味，口感韧劲十足。'
  },
  {
    id: 302,
    categoryId: 4,
    name: '全麦核桃贝果',
    price: 15.0,
    image: 'https://images.unsplash.com/photo-1505253304499-671c55413c6e?w=400',
    description: '健康全麦制作，加入大颗核桃仁。'
  },
  {
    id: 501,
    categoryId: 5,
    name: '伯爵茶瑞士卷',
    price: 22.0,
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400',
  }
];

const MOCK_ORDERS: Order[] = [
  {
    id: '3662',
    storeName: '棠小一',
    status: OrderStatus.PAID,
    date: '2025-09-04 19:31',
    total: 54.40,
    items: [{ name: '开心果千层', count: 8, price: 54.40, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200' }],
    type: 'Dine In'
  },
  {
    id: '6062',
    storeName: '棠小一',
    status: OrderStatus.PAID,
    date: '2025-08-21 15:16',
    total: 19.45,
    items: [{ name: '巧克力卷', count: 1, price: 19.45, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200' }],
    type: 'Dine In'
  },
  {
    id: '1639',
    storeName: '棠小一',
    status: OrderStatus.PAID,
    date: '2025-08-04 14:22',
    total: 10.90,
    items: [{ name: '可丽露', count: 1, price: 10.90, image: 'https://images.unsplash.com/photo-1605170426232-4127c4302f60?w=200' }],
    type: 'Dine In'
  }
];

// --- API Interface ---

export const api = {
  getUserProfile: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return MOCK_USER;
  },

  getStoreInfo: async (): Promise<Store> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_STORE;
  },

  getCategories: async (): Promise<Category[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_CATEGORIES;
  },

  getProducts: async (categoryId?: number): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    if (categoryId) {
      // In a real app, we might fetch only for that category
      // Here we filter our mock list, but to make it look full we return all for "Recommended" (id 1)
      if (categoryId === 1) return MOCK_PRODUCTS;
      return MOCK_PRODUCTS.filter(p => p.categoryId === categoryId || categoryId === 1);
    }
    return MOCK_PRODUCTS;
  },

  getOrders: async (): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return MOCK_ORDERS;
  },
  
  createOrder: async (cart: any): Promise<{success: boolean, orderId: string}> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, orderId: Math.random().toString().slice(2, 8) };
  }
};
