
import React from 'react';
import { Loader2 } from 'lucide-react';

interface BottomPayBarProps {
  payable: number;
  processing: boolean;
  onPay: () => void;
  statusText?: string;
}

export const BottomPayBar: React.FC<BottomPayBarProps> = ({ payable, processing, onPay, statusText }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-100 flex items-center justify-between pb-safe max-w-md mx-auto z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div>
        <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] block mb-0.5">应付金额</span>
        <div className="text-3xl font-black text-gray-900 italic tracking-tighter">¥{payable.toFixed(2)}</div>
      </div>
      
      <button 
        onClick={onPay}
        disabled={processing}
        className={`px-12 h-16 rounded-full font-black text-sm tracking-[0.1em] transition-all active:scale-95 flex items-center gap-3 ${
          processing ? 'bg-gray-100 text-gray-300' : 'bg-black text-[#FDE047] shadow-2xl shadow-gray-400/40 hover:shadow-black/10'
        }`}
      >
        {processing && <Loader2 className="animate-spin" size={16} />}
        {statusText === 'PREPARING...' ? '订单创建中...' : statusText === 'PAYING...' ? '支付中...' : '立即下单'}
      </button>
    </div>
  );
};
