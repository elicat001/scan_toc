
import React, { useState } from 'react';
import { Wallet, CheckCircle, Gift, Crown, Coffee, Percent, ShieldCheck, ChevronLeft, Loader2, Check } from 'lucide-react';
import { Header } from '../components/Header';
import { useToast } from '../components/Toast';

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

const VIP_BENEFITS = [
    { icon: Crown, title: '身份标识', desc: '尊贵VIP图标' },
    { icon: Percent, title: '会员折扣', desc: '全场8.8折' },
    { icon: Gift, title: '生日好礼', desc: '专属生日蛋糕' },
    { icon: Coffee, title: '免费升杯', desc: '每月4张升杯券' },
];

export const MemberTopUpView: React.FC<MemberTopUpProps> = ({ onBack }) => {
  const { showToast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [agreed, setAgreed] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleTopUp = async () => {
    if (!selectedAmount || !agreed || isProcessing) return;

    setIsProcessing(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      setIsSuccess(true);
      showToast('充值成功', 'success');
    } catch (err) {
      showToast('支付连接超时，请重试', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <div className="bg-[#16181b] px-4 pt-4 pb-2 flex items-center justify-between text-white shrink-0">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
              <ChevronLeft size={24} />
          </button>
          <h2 className="font-black text-base italic tracking-tight uppercase tracking-widest">会员储值</h2>
          <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="bg-[#16181b] px-6 pt-4 pb-20 relative">
             <div className="flex justify-between items-start">
                 <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                    <div className="text-gray-500 text-[10px] mb-2 font-black flex items-center gap-1.5 uppercase tracking-widest">
                      <Wallet size={12}/> 当前余额 (元)
                    </div>
                    <div className="text-7xl font-black text-[#fcd34d] font-mono-numbers tracking-tighter italic">0.00</div>
                 </div>
                 <div className="bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full text-[9px] text-gray-400 border border-white/10 font-black flex items-center gap-1.5 shadow-2xl">
                     <ShieldCheck size={12} className="text-blue-500" />
                     资金安全保障中
                 </div>
             </div>
          </div>

          <div className="mx-4 -mt-12 relative z-10 bg-[#1c1e22] rounded-[2.5rem] p-7 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/5">
             <div className="flex justify-between items-center mb-8">
                 <div className="flex items-center gap-2.5">
                   <div className="w-10 h-10 bg-gradient-to-br from-[#fcd34d] to-[#fbbf24] rounded-full flex items-center justify-center text-gray-900 shadow-[0_0_20px_rgba(252,211,77,0.4)]">
                     <Crown size={22} fill="currentColor" />
                   </div>
                   <h3 className="font-black text-[#fcd34d] text-xl italic tracking-tight">VIP会员权益</h3>
                 </div>
                 <div className="bg-[#fcd34d] text-gray-900 px-4 py-1.5 rounded-xl font-black italic text-[10px] shadow-lg">
                   已解锁 0 项
                 </div>
             </div>
             
             <div className="grid grid-cols-4 gap-4">
                 {VIP_BENEFITS.map((b, i) => (
                     <div key={i} className="flex flex-col items-center group active:scale-95 transition-transform">
                         <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-3 border border-white/5 shadow-inner">
                             <b.icon size={22} className="text-[#fcd34d]/80" />
                         </div>
                         <div className="text-[11px] font-black text-white mb-1 whitespace-nowrap">{b.title}</div>
                         <div className="text-[9px] text-gray-500 font-bold whitespace-nowrap">{b.desc}</div>
                     </div>
                 ))}
             </div>
          </div>

          <div className="px-6 mt-12 mb-6">
             <h3 className="font-black text-gray-900 text-2xl italic tracking-tight">充值金额</h3>
          </div>

          <div className="px-5 grid grid-cols-2 gap-5 mb-10">
              {TOPUP_OPTIONS.map((opt) => (
                  <div 
                    key={opt.amount}
                    onClick={() => setSelectedAmount(opt.amount)}
                    className={`relative p-8 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] active:scale-95 ${
                      selectedAmount === opt.amount 
                      ? 'border-[#fcd34d] bg-white shadow-[0_20px_40px_-15px_rgba(252,211,77,0.15)]' 
                      : 'border-transparent bg-gray-50'
                    }`}
                  >
                      {opt.tag && (
                          <div className="absolute -top-2 -right-1 bg-[#ef4444] text-white text-[9px] px-3 py-1 rounded-xl font-black italic shadow-lg z-10 animate-bounce">
                              {opt.tag}
                          </div>
                      )}
                      <div className="flex items-baseline gap-0.5">
                          <span className="text-sm font-black text-gray-900">¥</span>
                          <span className="text-4xl font-black text-gray-900 font-mono-numbers">{opt.amount}</span>
                      </div>
                      <div className={`text-[11px] mt-3 font-black tracking-tight ${opt.bonus > 0 ? 'text-[#d97706]' : 'text-gray-300'}`}>
                        {opt.bonus > 0 ? `送 ${opt.bonus} 元` : '无赠送'}
                      </div>
                  </div>
              ))}
          </div>

          <div className="flex items-start gap-3 mt-4 px-10 pb-44" onClick={() => setAgreed(!agreed)}>
              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${agreed ? 'bg-[#fcd34d] border-[#fcd34d]' : 'border-gray-200 bg-white'}`}>
                  {agreed && <CheckCircle size={12} className="text-gray-900" strokeWidth={4} />}
              </div>
              <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                  我已阅读并同意 <span className="text-blue-500 font-black">《会员储值协议》</span> 与 <span className="text-blue-500 font-black">《隐私政策》</span>。充值后金额将存入会员余额。
              </p>
          </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/60 backdrop-blur-3xl p-6 border-t border-gray-100 pb-safe max-w-md mx-auto z-50">
          <button 
            disabled={!selectedAmount || !agreed || isProcessing}
            onClick={handleTopUp}
            className={`w-full h-16 rounded-full font-black text-base tracking-widest transition-all flex items-center justify-between px-8 shadow-2xl active:scale-[0.98] ${
              agreed && !isProcessing ? 'bg-[#111827] text-[#fcd34d] shadow-gray-900/30' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
              <div className="flex items-center gap-3">
                  {isProcessing ? (
                      <Loader2 size={20} className="animate-spin text-[#fcd34d]" />
                  ) : (
                      <span className="italic ml-2">{isProcessing ? '正在处理' : '立即充值'}</span>
                  )}
              </div>
              {selectedAmount && (
                <div className={`px-6 py-2.5 rounded-full text-base font-mono-numbers flex items-center gap-1 transition-colors ${agreed && !isProcessing ? 'bg-white/10 text-[#fcd34d]' : 'bg-gray-200 text-gray-400'}`}>
                   {isProcessing ? 'WAITING' : `¥${selectedAmount.toFixed(2)}`}
                </div>
              )}
          </button>
      </div>

      {isSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111827]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
              <div className="bg-[#1c1e22] w-full max-w-sm rounded-[3rem] p-10 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#fcd34d] to-[#fbbf24] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(252,211,77,0.4)]">
                      <Check size={48} className="text-gray-900" strokeWidth={5} />
                  </div>
                  <h3 className="text-3xl font-black text-[#fcd34d] tracking-tight italic mb-3">充值成功</h3>
                  <p className="text-gray-400 text-sm font-medium mb-10">您的会员余额已更新，请尽情享用美味。</p>
                  <div className="bg-white/5 rounded-[2rem] p-6 mb-10 text-left border border-white/5 backdrop-blur-xl">
                      <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">充值金额</span>
                          <span className="text-xl font-black text-white font-mono-numbers">¥{selectedAmount?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">当前余额</span>
                          <span className="text-xl font-black text-[#fcd34d] font-mono-numbers">¥{selectedAmount?.toFixed(2)}</span>
                      </div>
                  </div>
                  <button 
                    onClick={onBack}
                    className="w-full bg-[#fcd34d] text-gray-900 h-16 rounded-full font-black text-base italic shadow-xl shadow-yellow-400/20 active:scale-95 transition-all"
                  >
                    返回个人中心
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
