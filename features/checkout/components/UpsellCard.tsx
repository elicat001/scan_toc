
import React from 'react';
import { Crown, ChevronRight } from 'lucide-react';

export const UpsellCard: React.FC = () => {
  return (
    <div className="bg-gray-900 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDE047]/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FDE047] rounded-xl flex items-center justify-center text-gray-900 shadow-lg">
            <Crown size={18} fill="currentColor" />
          </div>
          <h4 className="font-black text-[#FDE047] text-sm italic tracking-tight">充值更划算</h4>
        </div>
        <button className="text-[10px] text-[#FDE047] font-black uppercase tracking-widest flex items-center gap-1">
          Details <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 active:scale-95 transition-transform cursor-pointer">
          <div className="text-[10px] font-black text-[#FDE047] opacity-60 uppercase mb-1">Pop Offer</div>
          <div className="text-xl font-black text-white italic">¥200.00</div>
          <div className="text-[9px] text-white/50 font-bold mt-1">送 15.00 元</div>
        </div>
        <div className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 opacity-60 active:scale-95 transition-transform cursor-pointer">
          <div className="text-[10px] font-black text-white/40 uppercase mb-1">Standard</div>
          <div className="text-xl font-black text-white italic">¥100.00</div>
          <div className="text-[9px] text-white/30 font-bold mt-1">无赠送</div>
        </div>
      </div>
    </div>
  );
};
