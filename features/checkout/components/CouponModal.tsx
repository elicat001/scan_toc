
import React from 'react';
import { X, Check, Ticket } from 'lucide-react';
import type { Coupon } from '../../../types';

interface CouponModalProps {
  open: boolean;
  onClose: () => void;
  validCoupons: Coupon[];
  invalidCoupons: Coupon[];
  selectedCoupon: Coupon | null;
  onSelectCoupon: (c: Coupon | null) => void;
  cartTotal: number;
}

export const CouponModal: React.FC<CouponModalProps> = ({ 
  open, onClose, validCoupons, invalidCoupons, selectedCoupon, onSelectCoupon, cartTotal 
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-[#F8F9FA] w-full max-w-md rounded-t-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-full duration-500 relative z-10 flex flex-col max-h-[80vh]">
        <div className="bg-white p-5 text-center border-b border-gray-100 flex justify-between items-center">
          <div className="w-8"></div>
          <h3 className="font-black text-gray-900 tracking-tight italic">选择优惠券</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          <div 
            onClick={() => { onSelectCoupon(null); onClose(); }}
            className={`p-4 rounded-2xl border-2 transition-all flex justify-between items-center ${selectedCoupon === null ? 'border-gray-900 bg-gray-900 text-white' : 'bg-white border-transparent text-gray-400'}`}
          >
            <span className="text-sm font-black italic">不使用优惠券</span>
            {selectedCoupon === null && <Check size={18} />}
          </div>

          {validCoupons.length > 0 && (
            <div className="space-y-3">
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest pl-1">Available Coupons</div>
              {validCoupons.map(coupon => (
                <div 
                  key={coupon.id}
                  onClick={() => { onSelectCoupon(coupon); onClose(); }}
                  className={`bg-white rounded-2xl overflow-hidden flex border-2 transition-all ${selectedCoupon?.id === coupon.id ? 'border-yellow-400 shadow-lg' : 'border-transparent shadow-sm'}`}
                >
                  <div className="w-24 bg-yellow-400/10 flex flex-col items-center justify-center border-r border-dashed border-gray-200">
                    <div className="text-yellow-700 font-black flex items-baseline">
                      <span className="text-xs">¥</span><span className="text-2xl">{coupon.amount}</span>
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <h4 className="font-bold text-sm text-gray-900">{coupon.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-1">满 {coupon.minSpend} 可用</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {invalidCoupons.length > 0 && (
            <div className="space-y-3 opacity-50 grayscale">
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest pl-1">Unavailable</div>
              {invalidCoupons.map(coupon => (
                <div key={coupon.id} className="bg-white rounded-2xl overflow-hidden flex shadow-sm">
                  <div className="w-24 bg-gray-100 flex flex-col items-center justify-center">
                    <div className="text-gray-400 font-black flex items-baseline">
                      <span className="text-xs">¥</span><span className="text-2xl">{coupon.amount}</span>
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <h4 className="font-bold text-sm text-gray-400">{coupon.name}</h4>
                    <p className="text-[9px] text-red-400 mt-1">还差 ¥{(coupon.minSpend - cartTotal).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
