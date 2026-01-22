
import { ApiResponse } from '../types';

const API_BASE_URL = 'https://api.tangxiaoyi.com/v1'; // 示例地址

export class HttpClient {
  private static instance: HttpClient;
  
  private constructor() {}

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  /**
   * 统一请求封装
   */
  public async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      // 统一错误码拦截
      if (response.status === 401) {
        // 处理登录过期
        throw new Error('AUTH_EXPIRED');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || `HTTP_ERROR_${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();
      
      if (result.code !== 200) {
        throw new Error(result.msg || 'BUSINESS_ERROR');
      }

      return result.data;
    } catch (error) {
      console.error(`[HTTP Client Error] ${endpoint}:`, error);
      throw error;
    }
  }
}

export const httpClient = HttpClient.getInstance();
