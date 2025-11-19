
import React, { useState } from 'react';
import { ChevronLeft, MoreHorizontal, ChevronRight } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  onBack: () => void;
}

export const CheckoutView: React.FC<CheckoutProps> = ({ cart, onBack }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [diningMode, setDiningMode] = useState<'dine-in' | 'pickup' | 'delivery'>('dine-in');

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
         <button onClick={onBack} className="p-1 -ml-1 rounded-full hover:bg-gray-100"><ChevronLeft size={24} /></button>
         <span className="font-bold text-lg text-gray-900">确认订单</span>
         <div className="flex gap-2">
            <button className="p-1 rounded-full hover:bg-gray-100"><MoreHorizontal size={24} /></button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
          {/* Dining Mode Toggle */}
          <div className="px-4 pt-4">
            <div className="bg-white p-1.5 rounded-full flex mb-4 shadow-sm">
                <button onClick={() => setDiningMode('dine-in')} className={`flex-1 py-2 rounded-full font-bold text-sm transition-all ${diningMode === 'dine-in' ? 'bg-[#FDE047] text-gray-900 shadow-sm' : 'text-gray-500'}`}>堂食</button>
                <button onClick={() => setDiningMode('pickup')} className={`flex-1 py-2 rounded-full font-bold text-sm transition-all ${diningMode === 'pickup' ? 'bg-[#FDE047] text-gray-900 shadow-sm' : 'text-gray-500'}`}>配送</button>
                <button onClick={() => setDiningMode('delivery')} className={`flex-1 py-2 rounded-full font-bold text-sm transition-all ${diningMode === 'delivery' ? 'bg-[#FDE047] text-gray-900 shadow-sm' : 'text-gray-500'}`}>快递</button>
            </div>

            {/* Store Info */}
            <div className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                <h3 className="font-bold text-lg text-gray-900">棠小一</h3>
                <div className="text-xs text-gray-400 mt-1">订单完成后可获积分</div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                  <h4 className="font-bold text-gray-800 text-sm">共 {cart.reduce((a,b) => a + b.quantity, 0)} 份商品</h4>
                </div>
                
                <div className="space-y-6">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <img src={item.image} className="w-full h-full rounded-lg object-cover bg-gray-100" />
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

                <div className="flex justify-between items-center py-3 border-t border-dashed border-gray-100">
                  <span className="text-sm text-gray-600">使用券</span>
                  <div className="flex items-center text-gray-400 text-sm hover:text-gray-600 cursor-pointer">
                      无可用券 <ChevronRight size={14} />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-50 items-baseline gap-2">
                  <span className="text-xs text-gray-500">已优惠 ¥0.00</span>
                  <span className="text-sm text-gray-900 font-medium">小计</span>
                  <span className="font-bold text-xl text-gray-900">¥{total.toFixed(2)}</span>
                </div>
            </div>

            {/* Upsell Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-sm text-gray-900">充值更划算</h4>
                </div>
                <div className="border border-[#FDE047] bg-[#FEFCE8] rounded-lg p-4 w-32 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 bg-[#FDE047] text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg">免单</div>
                    <div className="font-bold text-lg text-gray-900 mt-1">7335元</div>
                    <div className="text-[10px] text-gray-500">充值3倍</div>
                </div>
            </div>
          </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 flex items-center justify-between z-30 max-w-md mx-auto shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-baseline">
             <span className="text-sm mr-1 text-gray-600">共计</span>
             <span className="text-2xl font-bold text-[#D97706] font-mono">¥{total.toFixed(2)}</span>
          </div>
          <button className="bg-[#FDE047] text-gray-900 px-10 py-3 rounded-full font-bold text-sm shadow-md hover:bg-yellow-400 transition-colors active:scale-95">
             确认下单
          </button>
      </div>
    </div>
  );
};
