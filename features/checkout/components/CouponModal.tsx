
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import type { Coupon } from '../../../types';

interface CouponModalProps {
  open: boolean;
  onClose: () => void;
  validCoupons: Coupon[];
  invalidCoupons: Coupon[];
  selectedCoupon: Coupon | null;
  onSelectCoupon: (c: Coupon | null) => void;
  cartTotalCent: number;
}

const PAGE_SIZE = 8;

export const CouponModal: React.FC<CouponModalProps> = ({ 
  open, onClose, validCoupons, invalidCoupons, selectedCoupon, onSelectCoupon, cartTotalCent 
}) => {
  const [displayLimit, setDisplayLimit] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const totalCouponsCount = validCoupons.length + invalidCoupons.length;
  const hasMore = displayLimit < totalCouponsCount;

  const visibleValidCoupons = useMemo(() => {
    return validCoupons.slice(0, displayLimit);
  }, [validCoupons, displayLimit]);

  const visibleInvalidCoupons = useMemo(() => {
    const remainingLimit = Math.max(0, displayLimit - validCoupons.length);
    return invalidCoupons.slice(0, remainingLimit);
  }, [invalidCoupons, validCoupons.length, displayLimit]);

  useEffect(() => {
    if (open) {
      setDisplayLimit(PAGE_SIZE);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [open, hasMore, isLoadingMore, displayLimit]);

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayLimit(prev => prev + PAGE_SIZE);
      setIsLoadingMore(false);
    }, 400);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-[#F8F9FA] w-full max-w-md rounded-t-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-full duration-500 relative z-10 flex flex-col max-h-[80vh]">
        <div className="bg-white p-5 text-center border-b border-gray-100 flex justify-between items-center flex-shrink-0">
          <div className="w-8"></div>
          <h3 className="font-black text-gray-900 tracking-tight italic">选择优惠券</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-5 no-scrollbar">
          <div 
            onClick={() => { onSelectCoupon(null); onClose(); }}
            className={`p-4 rounded-2xl border-2 transition-all flex justify-between items-center ${selectedCoupon === null ? 'border-gray-900 bg-gray-900 text-white' : 'bg-white border-transparent text-gray-400'}`}
          >
            <span className="text-sm font-black italic">不使用优惠券</span>
            {selectedCoupon === null && <Check size={18} />}
          </div>

          {visibleValidCoupons.length > 0 && (
            <div className="space-y-3">
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest pl-1">
                可用优惠券 ({validCoupons.length})
              </div>
              {visibleValidCoupons.map(coupon => (
                <div 
                  key={coupon.id}
                  onClick={() => { onSelectCoupon(coupon); onClose(); }}
                  className={`bg-white rounded-2xl overflow-hidden flex border-2 transition-all active:scale-[0.98] ${selectedCoupon?.id === coupon.id ? 'border-yellow-400 shadow-lg' : 'border-transparent shadow-sm'}`}
                >
                  <div className="w-24 bg-yellow-400/10 flex flex-col items-center justify-center border-r border-dashed border-gray-200 flex-shrink-0">
                    <div className="text-yellow-700 font-black flex items-baseline">
                      <span className="text-xs">¥</span><span className="text-2xl">{coupon.amountCent / 100}</span>
                    </div>
                  </div>
                  <div className="flex-1 p-4 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 truncate">{coupon.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-1">满 {coupon.minSpendCent / 100} 可用</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {visibleInvalidCoupons.length > 0 && (
            <div className="space-y-3">
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest pl-1">
                不可用 ({invalidCoupons.length})
              </div>
              <div className="space-y-3 opacity-50 grayscale">
                {visibleInvalidCoupons.map(coupon => (
                  <div key={coupon.id} className="bg-white rounded-2xl overflow-hidden flex shadow-sm">
                    <div className="w-24 bg-gray-100 flex flex-col items-center justify-center flex-shrink-0">
                      <div className="text-gray-400 font-black flex items-baseline">
                        <span className="text-xs">¥</span><span className="text-2xl">{coupon.amountCent / 100}</span>
                      </div>
                    </div>
                    <div className="flex-1 p-4 min-w-0">
                      <h4 className="font-bold text-sm text-gray-400 truncate">{coupon.name}</h4>
                      <p className="text-[9px] text-red-400 mt-1">还差 ¥{((coupon.minSpendCent - cartTotalCent) / 100).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div ref={sentinelRef} className="h-10 flex items-center justify-center">
            {isLoadingMore && (
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                <Loader2 size={14} className="animate-spin" />
                <span>正在加载更多...</span>
              </div>
            )}
            {!hasMore && totalCouponsCount > PAGE_SIZE && (
              <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">已加载全部优惠券</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
