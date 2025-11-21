
import React, { useState } from 'react';
import { ChevronLeft, Wallet, CheckCircle, Gift } from 'lucide-react';

interface MemberTopUpProps {
  onBack: () => void;
}

const TOPUP_OPTIONS = [
  { amount: 100, bonus: 0, tag: '' },
  { amount: 200, bonus: 10, tag: '热销' },
  { amount: 500, bonus: 40, tag: '推荐' },
  { amount: 1000, bonus: 100, tag: '' },
  { amount: 2000, bonus: 250, tag: '' },
  { amount: 5000, bonus: 800, tag: '超值' },
];

export const MemberTopUpView: React.FC<MemberTopUpProps> = ({ onBack }) => {
  const [selectedAmount, setSelectedAmount] = useState(200);
  const [agreed, setAgreed] = useState(true);

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      {/* Header */}
      <div className="bg-[#1F2937] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-20">
         <button onClick={onBack} className="p-1 -ml-1 rounded-full hover:bg-gray-700 transition-colors"><ChevronLeft size={24} /></button>
         <span className="font-bold text-lg">会员储值</span>
         <div className="w-8"></div>
      </div>

      {/* Balance Card */}
      <div className="bg-[#1F2937] px-4 pb-12 pt-4 relative mb-12">
         <div className="text-gray-400 text-xs mb-1">当前余额 (元)</div>
         <div className="text-4xl font-bold text-[#FDE047] font-mono">0.00</div>
         
         {/* Floating Card */}
         <div className="absolute left-4 right-4 -bottom-8 bg-white rounded-xl p-4 shadow-md flex items-center justify-between">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-[#FEF9C3] rounded-full flex items-center justify-center">
                     <Gift className="text-[#CA8A04]" size={20} />
                 </div>
                 <div>
                     <div className="font-bold text-gray-900 text-sm">开通VIP会员</div>
                     <div className="text-[10px] text-gray-500">预计每年可省 ¥365</div>
                 </div>
             </div>
             <button className="bg-gray-900 text-[#FDE047] px-3 py-1.5 rounded-full text-xs font-bold">立即开通</button>
         </div>
      </div>

      {/* Options Grid */}
      <div className="px-4 flex-1">
         <h3 className="font-bold text-gray-900 mb-4">选择充值金额</h3>
         <div className="grid grid-cols-2 gap-4 mb-6">
             {TOPUP_OPTIONS.map((opt) => (
                 <div 
                    key={opt.amount}
                    onClick={() => setSelectedAmount(opt.amount)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAmount === opt.amount ? 'border-[#FDE047] bg-[#FEFCE8]' : 'border-transparent bg-white'}`}
                 >
                     {opt.tag && (
                         <div className="absolute -top-2 -right-2 bg-[#EF4444] text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                             {opt.tag}
                         </div>
                     )}
                     <div className="flex items-baseline gap-1">
                         <span className="text-sm">¥</span>
                         <span className="text-2xl font-bold text-gray-900">{opt.amount}</span>
                     </div>
                     {opt.bonus > 0 ? (
                        <div className="text-xs text-[#CA8A04] mt-1 font-medium">送 {opt.bonus} 元</div>
                     ) : (
                        <div className="text-xs text-gray-400 mt-1">无赠送</div>
                     )}
                 </div>
             ))}
         </div>

         {/* Agreement */}
         <div className="flex items-center gap-2 mb-8" onClick={() => setAgreed(!agreed)}>
             <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${agreed ? 'bg-[#FDE047] border-[#FDE047]' : 'border-gray-300 bg-white'}`}>
                 {agreed && <CheckCircle size={12} className="text-gray-900" />}
             </div>
             <span className="text-xs text-gray-500">我已阅读并同意 <span className="text-blue-600">《储值协议》</span></span>
         </div>
      </div>

      {/* Bottom Action */}
      <div className="bg-white p-4 border-t border-gray-100 pb-safe">
          <button className="w-full bg-[#FDE047] text-gray-900 font-bold py-3 rounded-full shadow-md hover:bg-yellow-400 active:scale-[0.98] transition-all">
              立即充值 ¥{selectedAmount}
          </button>
      </div>
    </div>
  );
};