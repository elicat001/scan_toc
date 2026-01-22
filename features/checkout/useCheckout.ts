
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CartItem, Coupon, User } from '../../types';
import { api } from '../../services/api';
import { calcCartTotal, calcGrandTotal } from './checkout.calculation';
import { mapDiningModeToOrderType } from './checkout.mapping';
import type { DiningMode, PayState, PaymentMethod } from './checkout.types';

export function useCheckout(params: {
  cart: CartItem[];
  initialDiningMode: DiningMode;
  tableNo?: string | null;
}) {
  const { cart, initialDiningMode, tableNo } = params;

  const cartTotal = useMemo(() => calcCartTotal(cart), [cart]);

  const [diningMode, setDiningMode] = useState<DiningMode>(initialDiningMode);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wechat');

  const [user, setUser] = useState<User | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [payState, setPayState] = useState<PayState>({ status: 'idle' });

  // 用于防止竞态
  const reqSeq = useRef(0);

  useEffect(() => {
    let alive = true;
    const seq = ++reqSeq.current;

    (async () => {
      try {
        const [u, cs] = await Promise.all([api.getUserProfile(), api.getCoupons()]);
        if (!alive || seq !== reqSeq.current) return;

        setUser(u);
        setCoupons(cs);

        // 自动选择最优券：仅在用户未手动操作过时执行（初次加载）
        const valid = cs.filter(c => c.minSpend <= cartTotal);
        if (valid.length > 0) {
          setSelectedCoupon(valid.sort((a, b) => b.amount - a.amount)[0]);
        }
      } catch (err) {
        console.error("Failed to load checkout data", err);
      }
    })();

    return () => { alive = false; };
  }, [cartTotal]);

  const pricing = useMemo(() => {
    return calcGrandTotal({ cartTotal, coupon: selectedCoupon, diningMode });
  }, [cartTotal, selectedCoupon, diningMode]);

  const validCoupons = useMemo(() => coupons.filter(c => c.minSpend <= cartTotal), [coupons, cartTotal]);
  const invalidCoupons = useMemo(() => coupons.filter(c => c.minSpend > cartTotal), [coupons, cartTotal]);

  async function pay() {
    if (payState.status === 'creating' || payState.status === 'paying') return;

    try {
      setPayState({ status: 'creating' });
      const orderType = mapDiningModeToOrderType(diningMode, tableNo);

      const { success, orderId } = await api.createOrder({
        storeId: 1,
        items: cart,
        type: orderType,
        tableNo: tableNo || undefined,
        couponId: selectedCoupon?.id
      });

      if (!success) throw new Error('订单创建失败，请重试');

      setPayState({ status: 'paying', orderId });
      const paySuccess = await api.payOrder(orderId);

      if (!paySuccess) throw new Error('支付超时或被取消');

      setPayState({ status: 'success', orderId });
    } catch (e: any) {
      setPayState({ status: 'failed', message: e.message || '系统异常' });
    }
  }

  return {
    user,
    coupons,
    validCoupons,
    invalidCoupons,
    selectedCoupon,
    setSelectedCoupon,
    diningMode,
    setDiningMode,
    paymentMethod,
    setPaymentMethod,
    cartTotal,
    pricing,
    payState,
    pay,
    reset: () => setPayState({ status: 'idle' })
  };
}
