
import React, { useState, useEffect } from 'react';
import { ChevronRight, MoreHorizontal, Check, Wallet, X, Info } from 'lucide-react';
import { CartItem, Coupon, User } from '../types';
import { api } from '../services/api';
import { Header } from '../components/Header';

interface CheckoutProps {
  cart: CartItem[];
  onBack: () => void;
  initialDiningMode?: 'dine-in' | 'pickup' | 'delivery' | 'scan-order';
  onViewOrder?: (orderId: string) => void;
  tableNo?: string | null;
}

export const CheckoutView: React.FC<CheckoutProps> = ({ 
  cart, 
  onBack, 
  initialDiningMode = 'dine-in', 
  onViewOrder,
  tableNo
}) => {
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [diningMode, setDiningMode] = useState<'dine-in' | 'pickup' | 'delivery' | 'scan-order'>(initialDiningMode);
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'balance'>('wechat');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  
  // Coupon state
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);

  useEffect(() => {
    api.getUserProfile().then(setUser);
    api.getCoupons().then(setCoupons);
  }, []);

  // Calculate discount
  const discountAmount = selectedCoupon ? selectedCoupon.amount : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount);
  // Delivery fee logic (simplified for demo)
  const deliveryFee = diningMode === 'delivery' ? 0 : 0;
  const grandTotal = finalTotal + deliveryFee;

  const handlePay = async () => {
      setIsPaymentProcessing(true);
      // Simulate network request to create and pay order
      const { orderId } = await api.createOrder({ 
          storeId: 1, 
          items: cart, 
          type: tableNo ? 'Scan Order' : (diningMode === 'dine-in' ? 'Dine In' : diningMode === 'pickup' ? 'Pick Up' : 'Delivery'),
          tableNo: tableNo || undefined
      });
      await api.payOrder(orderId);
      
      setCreatedOrderId(orderId);
      setIsPaymentProcessing(false);
      setShowSuccessModal(true);
  };

  const handleFinish = () => {
      if (onViewOrder && createdOrderId) {
          onViewOrder(createdOrderId);
      } else {
          // Fallback
          onBack(); 
      }
  };

  // Valid coupons for current cart
  const validCoupons = coupons.filter(c => c.minSpend <= cartTotal);
  const invalidCoupons = coupons.filter(c => c.minSpend > cartTotal);

  // Mode specific render content
  const renderHeaderContent = () => {
      if (tableNo) {
          return (
              <div className="bg-white rounded-xl p-5 mb-3 shadow-sm border-l-4 border-[#FDE047]">
                 <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">扫码点餐</h3>
                        <p className="text-xs text-gray-500 mt-1">棠小一 (科技园店)</p>
                    </div>
                    <div className="bg-gray-900 text-[#FDE047] px-3 py-1 rounded-lg text-sm font-bold">
                        {tableNo} 桌
                    </div>
                 </div>
                 <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-2 text-[10px] text-[#CA8A04] bg-yellow-50/50 p-2 rounded">
                    <Info size={14} />
                    下单后请在座位稍候，美味将由店员为您送达
                 </div>
              </div>
          );
      }

      if (diningMode === 'dine-in') {
          return (
              <div className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                 <h3 className="font-bold text-lg text-gray-900">棠小一 (科技园店)</h3>
                 <div className="flex items-center justify-between mt-4 border-t border-gray-50 pt-3">
                     <span className="text-sm font-bold text-gray-700">联系电话</span>
                     <div className="w-32">
                         <input type="tel" placeholder="请输入手机号" className="w-full text-right bg-gray-50 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-yellow-400" />
                     </div>
                 </div>
                 <div className="flex items-center justify-between mt-3">
                     <span className="text-sm font-bold text-gray-700">就餐方式</span>
                     <div className="flex bg-gray-100 rounded p-0.5">
                         <button className="px-3 py-1 bg-white rounded shadow-sm text-xs font-bold">堂食</button>
                         <button className="px-3 py-1 text-gray-500 text-xs">打包</button>
                     </div>
                 </div>
              </div>
          );
      } else if (diningMode === 'delivery') {
          return (
            <>
               <div className="bg-white rounded-xl p-4 mb-3 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50">
                   <div className="flex items-center gap-3">
                       <div className="bg-[#FDE047] p-2 rounded-full text-gray-900">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                       </div>
                       <div>
                           <div className="font-bold text-gray-900">选择收货地址</div>
                           <div className="text-xs text-gray-400 mt-0.5">请完善收货人信息</div>
                       </div>
                   </div>
                   <ChevronRight size={16} className="text-gray-300" />
               </div>
               
               <div className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                  <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900 text-sm">送达时间</span>
                      <span className="text-[#0284C7] text-sm font-bold">立即送出 (约30分钟)</span>
                  </div>
               </div>
            </>
          );
      } else { // Pickup
           return (
              <div className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                 <h3 className="font-bold text-lg text-gray-900">棠小一 (科技园店)</h3>
                 <p className="text-xs text-gray-500 mt-1">距离您 99.4km</p>
                 <div className="mt-4 border-t border-gray-50 pt-3">
                     <div className="flex justify-between items-center mb-3">
                         <span className="text-sm font-bold text-gray-700">预留电话</span>
                         <span className="text-sm text-gray-900 font-mono">{user?.phone || '188****4331'}</span>
                     </div>
                     <div className="flex justify-between items-center">
                         <span className="text-sm font-bold text-gray-700">取餐时间</span>
                         <span className="text-sm text-gray-900">约10分钟后可取</span>
                     </div>
                 </div>
              </div>
           );
      }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans">
      <Header 
        title="确认订单" 
        onBack={onBack} 
        rightElement={
          <button className="p-1 rounded-full hover:bg-gray-100"><MoreHorizontal size={24} /></button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-32">
          {/* Dining Mode Toggle */}
          <div className="px-4 pt-4">
            {!tableNo && (
              <div className="bg-white p-1.5 rounded-full flex mb-4 shadow-sm">
                  <button onClick={() => setDiningMode('dine-in')} className={`flex-1 py-2 rounded-full font-bold text-sm transition-all ${diningMode === 'dine-in' ? 'bg-[#FDE047] text-gray-900 shadow-sm' : 'text-gray-500'}`}>堂食</button>
                  <button onClick={() => setDiningMode('pickup')} className={`flex-1 py-2 rounded-full font-bold text-sm transition-all ${diningMode === 'pickup' ? 'bg-[#FDE047] text-gray-900 shadow-sm' : 'text-gray-500'}`}>自取</button>
                  <button onClick={() => setDiningMode('delivery')} className={`flex-1 py-2 rounded-full font-bold text-sm transition-all ${diningMode === 'delivery' ? 'bg-[#FDE047] text-gray-900 shadow-sm' : 'text-gray-500'}`}>快递</button>
              </div>
            )}

            {renderHeaderContent()}

            {/* Order Items */}
            <div className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                  <h4 className="font-bold text-gray-800 text-sm">共 {cart.reduce((a,b) => a + b.quantity, 0)} 份商品</h4>
                </div>
                
                <div className="space-y-6">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <img src={item.image} className="w-full h-full rounded-lg object-cover bg-gray-100" alt={item.name} />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div className="flex justify-between items-start">
                              <h5 className="font-bold text-sm text-gray-900 leading-tight">{item.name}</h5>
                              <span className="font-bold text-sm">¥{item.price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-end mt-1">
                              <div className="flex flex-col">
                                <span className="text-xs text-gray-400">默认规格</span>
                                {/* Collection Tag */}
                                <div className="mt-1">
                                    <span className="bg-[#F97316] text-white text-[9px] px-1 py-0.5 rounded-[2px]">集</span>
                                </div>
                              </div>
                              <span className="text-sm text-gray-900 font-medium">x{item.quantity}</span>
                          </div>
                        </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center py-3 border-t border-dashed border-gray-100 mt-4">
                  <span className="text-sm text-gray-600">集章</span>
                  <span className="text-sm text-gray-900">本单将获得 <span className="text-[#F97316] font-bold">{cart.reduce((a,b) => a + b.quantity, 0)}</span> 个集章</span>
                </div>

                {/* Coupon Selector Trigger */}
                <div 
                    className="flex justify-between items-center py-3 border-t border-dashed border-gray-100 cursor-pointer active:opacity-60"
                    onClick={() => setShowCouponModal(true)}
                >
                  <span className="text-sm text-gray-600">使用券</span>
                  <div className="flex items-center text-sm cursor-pointer">
                      {selectedCoupon ? (
                          <span className="text-[#D97706] font-bold mr-1">-¥{selectedCoupon.amount}</span>
                      ) : (
                          <span className="text-gray-400 mr-1">{validCoupons.length > 0 ? `${validCoupons.length}张可用` : '无可用券'}</span>
                      )}
                      <ChevronRight size={14} className="text-gray-400" />
                  </div>
                </div>

                {/* Fee breakdown based on mode */}
                {diningMode === 'delivery' && (
                   <div className="flex justify-between items-center py-3 border-t border-dashed border-gray-100">
                      <span className="text-sm text-gray-600">配送费</span>
                      <span className="text-sm text-gray-900 font-bold">¥{deliveryFee.toFixed(2)}</span>
                   </div>
                )}

                <div className="flex justify-end pt-4 border-t border-gray-50 items-baseline gap-2">
                  <span className="text-xs text-gray-500">已优惠 ¥{discountAmount.toFixed(2)}</span>
                  <span className="text-sm text-gray-900 font-medium">小计</span>
                  <span className="font-bold text-xl text-gray-900">¥{grandTotal.toFixed(2)}</span>
                </div>
            </div>

            {/* Upsell Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-3">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-sm text-gray-900">充值更划算</h4>
                </div>
                <div className="border border-[#FDE047] bg-[#FEFCE8] rounded-lg p-4 w-32 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 bg-[#FDE047] text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg">免单</div>
                    <div className="font-bold text-lg text-gray-900 mt-1">7335元</div>
                    <div className="text-[10px] text-gray-500">充值3倍</div>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                <h4 className="font-bold text-sm text-gray-900 mb-3">支付方式</h4>
                
                {/* WeChat Pay */}
                <div 
                  className="flex items-center justify-between py-3 border-b border-gray-50 cursor-pointer group"
                  onClick={() => setPaymentMethod('wechat')}
                >
                   <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-[#07C160] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.60859 15.8607C8.27854 15.8607 8.15908 15.6776 7.5047 15.3187C7.06041 16.3553 6.0486 17.085 4.87027 17.085C3.14777 17.085 1.75 15.6879 1.75 13.9647C1.75 12.2415 3.14777 10.8444 4.87027 10.8444C5.17567 10.8444 5.46996 10.889 5.74854 10.9724C5.68086 10.686 5.64453 10.3876 5.64453 10.0811C5.64453 6.96407 8.6047 4.4375 12.2567 4.4375C15.9087 4.4375 18.8689 6.96407 18.8689 10.0811C18.8689 13.1981 15.9087 15.7247 12.2567 15.7247C11.8377 15.7247 11.4312 15.6849 11.0405 15.6093C10.1296 16.1013 9.13117 16.3601 8.60859 15.8607Z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900">微信支付</span>
                   </div>
                   <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${paymentMethod === 'wechat' ? 'bg-[#07C160] border-[#07C160]' : 'border-gray-300 bg-white'}`}>
                      {paymentMethod === 'wechat' && <Check size={12} className="text-white" strokeWidth={3} />}
                   </div>
                </div>

                {/* Balance Pay */}
                <div 
                   className="flex items-center justify-between py-3 cursor-pointer group"
                   onClick={() => setPaymentMethod('balance')}
                >
                   <div className="flex items-center gap-3">
                       <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-white flex-shrink-0">
                          <Wallet size={10} fill="currentColor" strokeWidth={0} />
                       </div>
                       <span className="text-sm font-medium text-gray-900">余额支付</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">余额: ¥{user?.balance.toFixed(2) || '0.00'}</span>
                       <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${paymentMethod === 'balance' ? 'bg-[#07C160] border-[#07C160]' : 'border-gray-300 bg-white'}`}>
                          {paymentMethod === 'balance' && <Check size={12} className="text-white" strokeWidth={3} />}
                       </div>
                   </div>
                </div>
            </div>
          </div>
      </div>

      {/* Coupon Selection Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ zIndex: 9999 }}>
           <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity" onClick={() => setShowCouponModal(false)}></div>
           <div className="bg-[#F3F4F6] w-full max-w-md rounded-t-[1.5rem] overflow-hidden animate-in slide-in-from-bottom-full duration-300 relative z-10 flex flex-col max-h-[80vh]">
              <div className="bg-white p-4 text-center relative border-b border-gray-100">
                 <h3 className="font-bold text-lg text-gray-900">选择优惠券</h3>
                 <button 
                    onClick={() => setShowCouponModal(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                 >
                    <X size={20} className="text-gray-500" />
                 </button>
              </div>
              
              <div className="p-4 overflow-y-auto flex-1 space-y-3">
                  <div 
                     onClick={() => { setSelectedCoupon(null); setShowCouponModal(false); }}
                     className={`p-4 rounded-xl border-2 cursor-pointer bg-white flex justify-between items-center ${selectedCoupon === null ? 'border-[#FDE047]' : 'border-transparent'}`}
                  >
                      <span className="text-sm font-bold text-gray-900">不使用优惠券</span>
                      {selectedCoupon === null && <Check size={16} className="text-[#CA8A04]" />}
                  </div>

                  {/* Valid Coupons */}
                  {validCoupons.map(coupon => (
                      <div 
                         key={coupon.id}
                         onClick={() => { setSelectedCoupon(coupon); setShowCouponModal(false); }}
                         className={`relative bg-white rounded-xl overflow-hidden flex cursor-pointer border-2 transition-colors ${selectedCoupon?.id === coupon.id ? 'border-[#FDE047]' : 'border-transparent'}`}
                      >
                          <div className="w-24 bg-[#FFFBEB] flex flex-col items-center justify-center p-2 border-r border-dashed border-gray-200">
                              <div className="flex items-baseline text-[#D97706]">
                                  <span className="text-xs">¥</span>
                                  <span className="text-2xl font-bold">{coupon.amount}</span>
                              </div>
                              <div className="text-[10px] text-[#D97706]">满{coupon.minSpend}可用</div>
                          </div>
                          <div className="flex-1 p-3 flex flex-col justify-center">
                              <h4 className="font-bold text-gray-900 text-sm mb-1">{coupon.name}</h4>
                              <p className="text-[10px] text-gray-400">{coupon.expireDate} 到期</p>
                          </div>
                          {selectedCoupon?.id === coupon.id && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#CA8A04]">
                                  <Check size={20} />
                              </div>
                          )}
                      </div>
                  ))}

                  {/* Invalid Coupons */}
                  {invalidCoupons.length > 0 && (
                      <div className="pt-4">
                          <div className="text-xs text-gray-400 mb-3 text-center">不可用优惠券</div>
                          <div className="space-y-3 opacity-60 grayscale">
                              {invalidCoupons.map(coupon => (
                                  <div key={coupon.id} className="bg-white rounded-xl overflow-hidden flex">
                                      <div className="w-24 bg-gray-100 flex flex-col items-center justify-center p-2 border-r border-dashed border-gray-200">
                                          <div className="flex items-baseline text-gray-500">
                                              <span className="text-xs">¥</span>
                                              <span className="text-2xl font-bold">{coupon.amount}</span>
                                          </div>
                                          <div className="text-[10px] text-gray-500">满{coupon.minSpend}可用</div>
                                      </div>
                                      <div className="flex-1 p-3 flex flex-col justify-center">
                                          <h4 className="font-bold text-gray-900 text-sm mb-1">{coupon.name}</h4>
                                          <p className="text-[10px] text-gray-400">差 ¥{(coupon.minSpend - cartTotal).toFixed(2)} 可用</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
           </div>
        </div>
      )}

      {/* Success Payment Modal */}
      {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200 flex flex-col">
                  <div className="bg-green-50 p-6 flex flex-col items-center justify-center border-b border-green-100">
                      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3 text-[#059669]">
                          <Check size={28} strokeWidth={4} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">支付成功</h3>
                      <p className="text-green-700 text-xs mt-1">商家已接单，正在制作中</p>
                  </div>
                  
                  <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                          <span className="text-sm text-gray-500">支付金额</span>
                          <span className="text-xl font-bold text-gray-900">¥{grandTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                          <span className="text-xs text-gray-500">下单门店</span>
                          <span className="text-xs text-gray-700 font-medium">棠小一 (科技园店)</span>
                      </div>
                      {tableNo && (
                        <div className="flex justify-between items-center py-1">
                            <span className="text-xs text-gray-500">用餐桌号</span>
                            <span className="text-xs text-gray-700 font-bold">{tableNo}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-1">
                          <span className="text-xs text-gray-500">商品详情</span>
                          <span className="text-xs text-gray-700">共 {cart.reduce((a,b) => a + b.quantity, 0)} 件商品</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                          <span className="text-xs text-gray-500">订单编号</span>
                          <span className="text-xs font-mono text-gray-700">{createdOrderId || 'OD28371029'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                          <span className="text-xs text-gray-500">支付方式</span>
                          <span className="text-xs text-gray-700">{paymentMethod === 'wechat' ? '微信支付' : '余额支付'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                          <span className="text-xs text-gray-500">下单时间</span>
                          <span className="text-xs text-gray-700">{new Date().toLocaleString('zh-CN', {hour12:false})}</span>
                      </div>
                  </div>

                  <div className="p-6 pt-0">
                      <div className="flex gap-3">
                        <button 
                            onClick={handleFinish}
                            className="flex-1 bg-gray-100 text-gray-900 font-bold py-3.5 rounded-xl transition-colors shadow-sm"
                        >
                            返回
                        </button>
                        <button 
                            onClick={handleFinish}
                            className="flex-[2] bg-[#FDE047] text-gray-900 font-bold py-3.5 rounded-xl hover:bg-yellow-400 transition-colors shadow-sm"
                        >
                            查看订单
                        </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Footer Payment Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 flex items-center justify-between pb-safe max-w-md mx-auto z-40">
          <div className="flex flex-col">
              <span className="text-xs text-gray-400">应付合计</span>
              <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-[#D97706]">¥</span>
                  <span className="text-2xl font-bold text-[#D97706]">{grandTotal.toFixed(2)}</span>
              </div>
          </div>
          <button 
             onClick={handlePay}
             disabled={isPaymentProcessing}
             className="bg-gray-900 text-white px-10 py-3.5 rounded-full font-bold shadow-lg hover:bg-black active:scale-[0.98] transition-all flex items-center gap-2"
          >
             {isPaymentProcessing ? (
               <>
                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 支付中...
               </>
             ) : (
               '立即结算'
             )}
          </button>
      </div>
    </div>
  );
};
