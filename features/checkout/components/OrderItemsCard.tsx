
import React from 'react';
import type { CartItem, Coupon } from '../../../types';
import type { DiningMode } from '../checkout.types';
import { CouponRow } from './CouponRow';

interface OrderItemsCardProps {
  cart: CartItem[];
  diningMode: DiningMode;
  selectedCoupon: Coupon | null;
  validCouponCount: number;
  deliveryFee: number;
  discountAmount: number;
  payable: number;
  onClickCoupon: () => void;
}

export const OrderItemsCard: React.FC<OrderItemsCardProps> = ({
  cart,
  diningMode,
  selectedCoupon,
  validCouponCount,
  deliveryFee,
  discountAmount,
  payable,
  onClickCoupon
}) => {
  const itemCount = cart.reduce((a, b) => a + b.quantity, 0);

  return (
    <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-black text-gray-900 text-sm italic">商品详情</h4>
        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">共 {itemCount} 件</span>
      </div>

      <div className="space-y-6">
        {cart.map((item, idx) => (
          <div key={idx} className="flex gap-4">
            <img src={item.image} className="w-14 h-14 rounded-2xl object-cover bg-gray-50 border border-gray-100" alt={item.name} />
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex justify-between">
                <h4 className="font-bold text-sm text-gray-900 truncate tracking-tight">{item.name}</h4>
                <span className="font-black text-sm">¥{item.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[9px] text-gray-400 font-black uppercase">标准规格</span>
                <span className="text-xs text-gray-900 font-black">x{item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-1">
        <div className="flex justify-between items-center py-4 border-t border-dashed border-gray-100">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1.5">
             预估积分
          </span>
          <span className="text-[10px] font-black text-gray-900">
            预计获得 <span className="text-[#D97706] italic font-black">{itemCount} 个集章</span>
          </span>
        </div>

        <CouponRow 
          selectedCoupon={selectedCoupon}
          validCount={validCouponCount}
          onClick={onClickCoupon}
        />

        {diningMode === 'delivery' && (
          <div className="flex justify-between items-center py-4 border-t border-dashed border-gray-100">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">配送费</span>
            <span className="text-xs font-black text-gray-900">¥{deliveryFee.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between items-end pt-6 border-t border-gray-50">
          <div>
            {discountAmount > 0 && (
              <span className="text-[9px] font-black text-[#D97706] bg-yellow-400/10 px-2 py-0.5 rounded-lg mb-1 inline-block">
                已优惠 ¥{discountAmount.toFixed(2)}
              </span>
            )}
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] block">费用合计</span>
          </div>
          <span className="text-2xl font-black italic text-gray-900 tracking-tighter">¥{payable.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
