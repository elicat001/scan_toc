
import type { CartItem, Coupon } from '../../types';
import type { DiningMode } from './checkout.types';

export function calcCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calcCouponDiscount(cartTotal: number, coupon: Coupon | null): number {
  if (!coupon) return 0;
  // 此处可扩展：根据 coupon.type 处理百分比折扣或固定减免
  return Math.max(0, coupon.amount);
}

export function calcDeliveryFee(mode: DiningMode, cartTotal: number): number {
  if (mode !== 'delivery') return 0;
  // 未来可在此根据 cartTotal 判定满减运费，或传入 distance 参数
  return 5; 
}

export function calcGrandTotal(params: {
  cartTotal: number;
  coupon: Coupon | null;
  diningMode: DiningMode;
}): { discount: number; deliveryFee: number; payable: number } {
  const discount = calcCouponDiscount(params.cartTotal, params.coupon);
  const deliveryFee = calcDeliveryFee(params.diningMode, params.cartTotal);
  const payable = Math.max(0, params.cartTotal - discount) + deliveryFee;
  return { discount, deliveryFee, payable };
}
