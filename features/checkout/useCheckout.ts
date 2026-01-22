
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CartItem, Coupon, User, CreateOrderPayloadDTO, MoneyCent } from '../../types';
import { api } from '../../services/api';
import { mapDiningModeToOrderType } from './checkout.mapping';
import { mapCartToOrderItems } from '../../domain/order/mapCartToOrderItems';
import type { DiningMode, PayState, PaymentMethod, PayFailReason } from './checkout.types';

export function useCheckout(params: {
  cart: CartItem[];
  initialDiningMode: DiningMode;
  tableNo?: string | null;
}) {
  const { cart, initialDiningMode, tableNo } = params;

  const cartTotalCent = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.priceCent * item.quantity, 0);
  }, [cart]);

  const [diningMode, setDiningMode] = useState<DiningMode>(initialDiningMode);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wechat');
  const [user, setUser] = useState<User | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [payState, setPayState] = useState<PayState>({ status: 'idle' });
  
  const userTouchedCoupon = useRef(false);
  const reqSeq = useRef(0);

  // Load user profile and coupons with race condition protection
  useEffect(() => {
    let alive = true;
    const seq = ++reqSeq.current;

    (async () => {
      try {
        const [u, cs] = await Promise.all([api.getUserProfile(), api.getCoupons()]);
        if (!alive || seq !== reqSeq.current) return;

        setUser(u);
        setCoupons(cs);

        // Auto-recommend coupon: only if user hasn't manually touched it
        if (!userTouchedCoupon.current) {
            const valid = cs.filter(c => c.minSpendCent <= cartTotalCent);
            if (valid.length > 0) {
              setSelectedCoupon(valid.sort((a, b) => b.amountCent - a.amountCent)[0]);
            } else {
              setSelectedCoupon(null);
            }
        }
      } catch (err) {
        console.error("Failed to load checkout data", err);
      }
    })();

    return () => { alive = false; };
  }, [cartTotalCent]);

  const pricing = useMemo(() => {
    const discountCent = selectedCoupon ? selectedCoupon.amountCent : 0;
    const deliveryFeeCent = diningMode === 'delivery' ? 500 : 0; // 5.00 CNY
    const payableCent = Math.max(0, cartTotalCent - discountCent) + deliveryFeeCent;
    
    return { 
        discountCent, 
        deliveryFeeCent, 
        payableCent 
    };
  }, [cartTotalCent, selectedCoupon, diningMode]);

  const validCoupons = useMemo(() => coupons.filter(c => c.minSpendCent <= cartTotalCent), [coupons, cartTotalCent]);
  const invalidCoupons = useMemo(() => coupons.filter(c => c.minSpendCent > cartTotalCent), [coupons, cartTotalCent]);

  const handleSelectCoupon = (coupon: Coupon | null) => {
    userTouchedCoupon.current = true;
    setSelectedCoupon(coupon);
  };

  async function pay() {
    // 1. Anti-duplicate protection
    if (payState.status === 'creating' || payState.status === 'paying') return;

    try {
      setPayState({ status: 'creating' });
      
      // 2. Business Validation (Client Side)
      if (paymentMethod === 'balance' && user && user.balanceCent < pricing.payableCent) {
          throw { reason: 'INSUFFICIENT_BALANCE', message: '会员余额不足，请先充值' };
      }

      const orderType = mapDiningModeToOrderType(diningMode, tableNo);

      const payload: CreateOrderPayloadDTO = {
        storeId: 1,
        type: orderType as any, // Cast to OrderType enum
        tableNo: tableNo || undefined,
        couponId: selectedCoupon?.id,
        items: mapCartToOrderItems(cart)
      };

      const { success, orderId } = await api.createOrder(payload);
      if (!success) throw { reason: 'UNKNOWN', message: '订单创建失败' };

      setPayState({ status: 'paying', orderId });
      const paySuccess = await api.payOrder(orderId);

      if (!paySuccess) throw { reason: 'USER_CANCELLED', message: '支付已被取消' };

      setPayState({ status: 'success', orderId });
    } catch (e: any) {
      setPayState({ 
        status: 'failed', 
        reason: e.reason || 'UNKNOWN', 
        message: e.message || '系统异常' 
      });
    }
  }

  return {
    user,
    coupons,
    validCoupons,
    invalidCoupons,
    selectedCoupon,
    setSelectedCoupon: handleSelectCoupon,
    diningMode,
    setDiningMode,
    paymentMethod,
    setPaymentMethod,
    cartTotalCent,
    pricing,
    payState,
    pay,
    reset: () => setPayState({ status: 'idle' })
  };
}
