
import { User, Product, Category, Order, OrderStatus, Address, Banner, Coupon, PointRecord, Store, CreateOrderPayloadDTO } from '../types';
import { httpClient } from './httpClient';
import { GoogleGenAI } from "@google/genai";

export interface ApiService {
  getUserProfile(): Promise<User>;
  updateUserProfile(data: Partial<User>): Promise<User>;
  getStoreInfo(id?: number): Promise<Store>;
  getStores(): Promise<Store[]>;
  getCategories(): Promise<Category[]>;
  getProducts(categoryId?: number): Promise<Product[]>;
  getRecommendProducts(): Promise<Product[]>;
  createOrder(data: CreateOrderPayloadDTO): Promise<{ success: boolean; orderId: string }>;
  payOrder(orderId: string): Promise<boolean>;
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | null>;
  getCoupons(): Promise<Coupon[]>;
  getBanners(): Promise<Banner[]>;
  getAddresses(): Promise<Address[]>;
  getPointsHistory(): Promise<PointRecord[]>;
  getAiRecommendation(query: string, products: Product[]): Promise<string>;
  toggleFavorite(productId: number): Promise<boolean>;
}

const mockApi: ApiService = {
  getUserProfile: async () => ({
    id: 'u123',
    name: '粒粒',
    phone: '188****4331',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    points: 1250,
    balanceCent: 28850, // 288.50 CNY
    coupons: 3,
    memberCode: '882910',
    isVip: true,
  }),
  
  updateUserProfile: async (data) => ({} as User),
  getStoreInfo: async () => ({
    id: 1,
    name: '棠小一 (科技园旗舰店)',
    address: '科技园南区 R3-A 栋 102',
    distance: '0.8km',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400',
    tags: ['营业中', '最近去过'],
    status: 'OPEN',
    businessHours: '08:00-22:00'
  }),
  getStores: async () => [],
  getCategories: async () => [
    { id: 1, name: '人气推荐', icon: '🔥' },
    { id: 4, name: '贝果&牛角', icon: '🥯' },
    { id: 7, name: '醇香咖啡', icon: '☕' }
  ],
  getProducts: async () => [],
  getRecommendProducts: async () => [
    { id: 1, categoryId: 1, name: '开心果千层', priceCent: 3200, image: 'https://images.unsplash.com/photo-1535141192574-5d4897c826a0?w=400' },
    { id: 2, categoryId: 1, name: '桂花酒酿拿铁', priceCent: 2800, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400' }
  ],
  
  createOrder: async (data) => {
    await new Promise(r => setTimeout(r, 800));
    // Simulate stock error
    if (Math.random() < 0.05) {
        throw { reason: 'OUT_OF_STOCK', message: '抱歉，部分商品已售罄' };
    }
    return { success: true, orderId: `OD${Date.now().toString().slice(-8)}` };
  },

  payOrder: async (orderId) => {
    await new Promise(r => setTimeout(r, 1200));
    return true;
  },

  getOrders: async () => [],
  getOrder: async () => null,
  getCoupons: async () => [
    { id: 1, name: '新人专享满减券', amountCent: 500, minSpendCent: 2000, expireDate: '2025-12-31' },
    { id: 2, name: '午餐特惠减免卷', amountCent: 1000, minSpendCent: 5000, expireDate: '2025-12-31' }
  ],

  getBanners: async () => [
    { id: 1, imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800', title: '春季限定：抹茶拿铁系列' }
  ],

  getAddresses: async () => [],
  getPointsHistory: async () => [],

  getAiRecommendation: async (query, products) => {
    return "为您推荐店内人气王：开心果千层蛋糕。";
  },
  toggleFavorite: async () => true,
};

export const api: ApiService = mockApi;
