
import React from 'react';
import { ChevronRight, Ticket } from 'lucide-react';
import type { Coupon } from '../../../types';

interface CouponRowProps {
  selectedCoupon: Coupon | null;
  validCount: number;
  onClick: () => void;
}

export const CouponRow: React.FC<CouponRowProps> = ({ selectedCoupon, validCount, onClick }) => {
  return (
    <div
      className="flex justify-between items-center py-4 border-t border-dashed border-gray-100 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Ticket size={16} className={selectedCoupon ? 'text-[#D97706]' : 'text-gray-400'} />
        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">优惠券</span>
      </div>

      <div className="flex items-center text-xs font-black">
        {selectedCoupon ? (
          <div className="flex items-center gap-2 bg-[#D97706]/10 px-3 py-1 rounded-full text-[#D97706]">
            <span>-¥{selectedCoupon.amount}</span>
            <span className="text-[8px] bg-[#D97706] text-white px-1 rounded italic uppercase">{selectedCoupon.name}</span>
          </div>
        ) : (
          <span className={`${validCount > 0 ? 'text-[#D97706]' : 'text-gray-400'}`}>
            {validCount > 0 ? `${validCount} 张可用` : '无可用'}
          </span>
        )}
        <ChevronRight size={14} className="text-gray-300 ml-1 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};
