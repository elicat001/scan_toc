
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, MoreHorizontal, Check, Wallet, X, Info, Ticket, Loader2, AlertCircle } from 'lucide-react';
import { CartItem, Coupon, User } from '../types';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { useToast } from '../components/Toast';

interface CheckoutProps {
  cart: CartItem[];
  onBack: () => void;
  initialDiningMode?: 'dine-in' | 'pickup' | 'delivery' | 'scan-order';
  onViewOrder?: (orderId: string) => void;
  tableNo?: string | null;
}

// 支付状态枚举
type CheckoutStatus = 'IDLE' | 'CREATING' | 'PAYING' | 'SUCCESS' | 'FAILED';

export const CheckoutView: React.FC<CheckoutProps> = ({ 
  cart, 
  onBack, 
  initialDiningMode = 'dine-in', 
  onViewOrder,
  tableNo
}) => {
  const { showToast } = useToast();
  
  // --- 状态管理 ---
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [diningMode, setDiningMode] = useState(initialDiningMode);
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'balance'>('wechat');
  const [createdOrderId, setCreatedOrderId] = useState<string>('');
  
  const [user, setUser] = useState<User | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);

  // --- 数据初始化 ---
  useEffect(() => {
    const init = async () => {
      try {
        const [userData, couponData] = await Promise.all([
          api.getUserProfile(),
          api.getCoupons()
        ]);
        setUser(userData);
        setCoupons(couponData);
        
        // 自动选择最优券逻辑
        const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
        const valid = couponData.filter(c => c.minSpend <= cartTotal);
        if (valid.length > 0) {
          setSelectedCoupon(valid.sort((a, b) => b.amount - a.amount)[0]);
        }
      } catch (err) {
        showToast('获取用户信息失败', 'error');
      }
    };
    init();
  }, [cart, showToast]);

  // --- 价格计算逻辑 ---
  const prices = useMemo(() => {
    const rawTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = selectedCoupon ? selectedCoupon.amount : 0;
    const delivery = diningMode === 'delivery' ? 5 : 0;
    const final = Math.max(0, rawTotal - discount + delivery);
    return { rawTotal, discount, delivery, final };
  }, [cart, selectedCoupon, diningMode]);

  // --- 核心支付流程 ---
  const handlePay = async () => {
    if (checkoutStatus !== 'IDLE' && checkoutStatus !== 'FAILED') return;
    
    setCheckoutStatus('CREATING');
    setErrorMessage(null);
    
    try {
      // 阶段 1: 创建订单
      const { success, orderId } = await api.createOrder({ 
        storeId: 1, 
        items: cart, 
        type: diningMode,
        tableNo: tableNo || undefined,
        couponId: selectedCoupon?.id
      });
      
      if (!success) throw new Error('订单创建失败');
      setCreatedOrderId(orderId);
      
      // 阶段 2: 执行支付
      setCheckoutStatus('PAYING');
      const paySuccess = await api.payOrder(orderId);
      
      if (!paySuccess) throw new Error('支付过程被中断');
      
      // 阶段 3: 成功
      setCheckoutStatus('SUCCESS');
    } catch (err: any) {
      console.error("[Payment Flow Error]:", err);
      setCheckoutStatus('FAILED');
      setErrorMessage(err.message || '系统繁忙，请稍后再试');
      showToast(err.message || '操作失败', 'error');
    }
  };

  const handleFinish = () => {
    if (onViewOrder && createdOrderId) {
      onViewOrder(createdOrderId);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header title="确认订单" onBack={onBack} />

      <div className="flex-1 overflow-y-auto pb-32 px-4 pt-4 space-y-4">
        {/* 订单配送模式切换 */}
        {!tableNo && (
          <div className="bg-white p-1.5 rounded-full flex shadow-sm">
            {(['dine-in', 'pickup', 'delivery'] as const).map(mode => (
              <button 
                key={mode}
                onClick={() => setDiningMode(mode)}
                className={`flex-1 py-2 rounded-full font-bold text-sm transition-all ${diningMode === mode ? 'bg-[#FDE047] text-gray-900 shadow-sm' : 'text-gray-400'}`}
              >
                {mode === 'dine-in' ? '堂食' : mode === 'pickup' ? '自取' : '外送'}
              </button>
            ))}
          </div>
        )}

        {/* 门店/桌号信息 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-gray-900">棠小一 (科技园店)</h3>
              {tableNo && <span className="bg-black text-[#FDE047] px-3 py-1 rounded-lg text-xs font-black italic">{tableNo} 桌</span>}
           </div>
           <p className="text-xs text-gray-400">深圳市南山区科技园南区 R3-A 栋</p>
        </div>

        {/* 商品清单 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
           <div className="space-y-6">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                    <img src={item.image} className="w-14 h-14 rounded-xl object-cover bg-gray-50" />
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                            <h4 className="font-bold text-sm text-gray-900 truncate">{item.name}</h4>
                            <span className="font-bold text-sm">¥{item.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-[10px] text-gray-400">默认规格</span>
                            <span className="text-xs text-gray-900 font-medium">x{item.quantity}</span>
                        </div>
                    </div>
                </div>
              ))}
           </div>

           <div className="mt-6 pt-4 border-t border-gray-50 space-y-3">
              <div className="flex justify-between text-sm" onClick={() => setShowCouponModal(true)}>
                  <span className="text-gray-500 flex items-center gap-1"><Ticket size={14} /> 优惠券</span>
                  <span className="text-[#D97706] font-bold">
                    {selectedCoupon ? `-¥${selectedCoupon.amount}` : (coupons.length > 0 ? `${coupons.length}张可用` : '无可用')}
                    <ChevronRight size={14} className="inline ml-1" />
                  </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-50">
                  <span className="text-gray-900">合计支付</span>
                  <span className="text-[#D97706]">¥{prices.final.toFixed(2)}</span>
              </div>
           </div>
        </div>

        {/* 支付方式选择 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
           <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">支付方式</h4>
           <div className="space-y-1">
              {[
                { id: 'wechat', label: '微信支付', icon: '🟢' },
                { id: 'balance', label: '余额支付', icon: '💰', sub: `余额: ¥${user?.balance.toFixed(2) || 0}` }
              ].map(m => (
                <div 
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  className="flex items-center justify-between py-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{m.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{m.label}</div>
                      {m.sub && <div className="text-[10px] text-gray-400">{m.sub}</div>}
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${paymentMethod === m.id ? 'bg-black border-black' : 'border-gray-200'}`}>
                    {paymentMethod === m.id && <Check size={12} className="text-[#FDE047]" strokeWidth={4} />}
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* 底部支付操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 flex items-center justify-between pb-safe max-w-md mx-auto z-50">
          <div>
              <span className="text-[10px] text-gray-400 font-black uppercase">Final Total</span>
              <div className="text-2xl font-black text-[#D97706] italic">¥{prices.final.toFixed(2)}</div>
          </div>
          
          <button 
             onClick={handlePay}
             disabled={checkoutStatus !== 'IDLE' && checkoutStatus !== 'FAILED'}
             className={`px-12 py-4 rounded-full font-black text-sm tracking-widest transition-all active:scale-95 flex items-center gap-3 ${
                checkoutStatus === 'CREATING' || checkoutStatus === 'PAYING' 
                ? 'bg-gray-200 text-gray-400 cursor-wait' 
                : 'bg-black text-[#FDE047] shadow-xl shadow-gray-200'
             }`}
          >
             {checkoutStatus === 'CREATING' && <Loader2 className="animate-spin" size={18} />}
             {checkoutStatus === 'PAYING' && <Loader2 className="animate-spin" size={18} />}
             {checkoutStatus === 'CREATING' ? '创建订单...' : checkoutStatus === 'PAYING' ? '支付中...' : '确认支付'}
          </button>
      </div>

      {/* 错误与重试反馈 */}
      {checkoutStatus === 'FAILED' && (
        <div className="fixed top-20 left-4 right-4 z-[60] bg-red-50 border border-red-100 p-4 rounded-2xl shadow-xl animate-in slide-in-from-top-4">
           <div className="flex gap-3">
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <div className="flex-1">
                 <h4 className="text-sm font-bold text-red-900">支付失败</h4>
                 <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
                 <button 
                    onClick={handlePay}
                    className="mt-3 bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                 >
                    重新支付
                 </button>
              </div>
              <button onClick={() => setCheckoutStatus('IDLE')} className="text-red-300"><X size={18} /></button>
           </div>
        </div>
      )}

      {/* 成功模态框 */}
      {checkoutStatus === 'SUCCESS' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center animate-in zoom-in duration-300 shadow-2xl">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                      <Check size={40} className="text-white" strokeWidth={4} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight italic mb-2">下单成功!</h3>
                  <p className="text-sm text-gray-500 font-medium mb-8">商家已收到您的订单，开始为您制作美味。</p>
                  
                  <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left border border-gray-100">
                      <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-gray-400">订单号</span>
                          <span className="text-gray-900">{createdOrderId}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold">
                          <span className="text-gray-400">支付时间</span>
                          <span className="text-gray-900">{new Date().toLocaleTimeString()}</span>
                      </div>
                  </div>

                  <button 
                    onClick={handleFinish}
                    className="w-full bg-black text-[#FDE047] py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-transform"
                  >
                    查看订单详情
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
