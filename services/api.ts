
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
    balance: 288.50,
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
  getRecommendProducts: async () => [],
  
  createOrder: async (data) => {
    await new Promise(r => setTimeout(r, 1000));
    if (Math.random() < 0.1) throw new Error('服务器开小差了，订单创建失败');
    return { success: true, orderId: `OD${Date.now().toString().slice(-8)}` };
  },

  payOrder: async (orderId) => {
    await new Promise(r => setTimeout(r, 1500));
    return true;
  },

  getOrders: async () => [],
  getOrder: async () => null,
  getCoupons: async () => [
    { id: 1, name: '新人专享满减券', amount: 5, minSpend: 20, type: 'CASH', expireDate: '2025-12-31' },
    { id: 2, name: '午餐特惠减免卷', amount: 10, minSpend: 50, type: 'CASH', expireDate: '2025-12-31' }
  ],

  getBanners: async () => [
    { id: 1, imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800', title: '春季限定：抹茶拿铁系列' }
  ],

  getAddresses: async () => [
    { id: '1', contact: '粒粒', phone: '188****4331', location: '腾讯滨海大厦', detail: 'A座 24楼', tag: '公司', isDefault: true }
  ],

  getPointsHistory: async () => [
    { id: 1, title: '购物消费', amount: 25, createTime: '2024-03-20 14:30', type: 'EARN' },
    { id: 2, title: '每日签到', amount: 5, createTime: '2024-03-19 09:00', type: 'EARN' }
  ],

  getAiRecommendation: async (query, products) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = products.map(p => `- ${p.name}: ${p.description}`).join('\n');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `今日菜单：\n${context}\n问题：${query}`,
      });
      return response.text || "推荐我们的招牌千层蛋糕。";
    } catch (error) {
      console.error("AI Error:", error);
      return "为您推荐店内人气王：开心果千层蛋糕。";
    }
  },
  toggleFavorite: async () => true,
};

export const api: ApiService = mockApi;
