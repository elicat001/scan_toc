
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
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-3xl p-6 border-t border-gray-100 flex items-center justify-between pb-safe max-w-md mx-auto z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col">
        <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] block mb-1">应付总额</span>
        <div className="text-3xl font-black text-gray-900 italic tracking-tighter flex items-baseline gap-0.5">
            <span className="text-xs font-black not-italic">¥</span>
            {payable.toFixed(2)}
        </div>
      </div>
      
      <button 
        onClick={onPay}
        disabled={processing}
        className={`px-12 h-16 rounded-full font-black text-base italic tracking-widest transition-all active:scale-[0.97] flex items-center gap-3 shadow-2xl ${
          processing 
          ? 'bg-gray-100 text-gray-300' 
          : 'bg-[#111827] text-[#FDE047] shadow-gray-900/40'
        }`}
      >
        {processing && <Loader2 className="animate-spin" size={18} />}
        {statusText === 'PREPARING...' ? '处理中' : statusText === 'PAYING...' ? '支付中' : '立即下单'}
      </button>
    </div>
  );
};
