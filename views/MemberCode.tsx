
import React, { useState, useEffect } from 'react';
import { RefreshCw, Wallet, CreditCard, HelpCircle } from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';
import { Header } from '../components/Header';

interface MemberCodeProps {
  onBack: () => void;
  onTopUp: () => void;
}

export const MemberCodeView: React.FC<MemberCodeProps> = ({ onBack, onTopUp }) => {
  const [user, setUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    api.getUserProfile().then(setUser);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
            setRefreshKey(k => k + 1);
            return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
      setRefreshKey(k => k + 1);
      setCountdown(60);
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">加载中...</div>;

  return (
    <div className="min-h-screen bg-[#1F2937] flex flex-col text-white">
      <Header 
        title="会员码" 
        onBack={onBack} 
        theme="dark"
        rightElement={
          <button className="text-xs text-gray-300 hover:text-white transition-colors">使用帮助</button>
        }
      />

      <div className="flex-1 px-4 pt-4 flex flex-col items-center">
          {/* Card */}
          <div className="w-full bg-white rounded-2xl p-6 text-gray-900 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FDE047] to-[#D97706]"></div>
              
              {/* User Info */}
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <img src={user.avatar} className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200" alt="avatar" />
                    <div>
                        <div className="font-bold text-lg leading-none">{user.name}</div>
                        <div className="text-xs text-gray-400 mt-1">普通会员</div>
                    </div>
                 </div>
                 <div className="text-right">
                     <div className="text-[10px] text-gray-400">当前余额</div>
                     <div className="font-bold text-xl font-mono leading-none">¥{(user.balanceCent / 100).toFixed(2)}</div>
                 </div>
              </div>

              {/* Codes */}
              <div className="flex flex-col items-center gap-6 py-2">
                  {/* Barcode Simulation */}
                  <div className="w-full flex flex-col items-center gap-2">
                      <div className="h-16 w-[90%] bg-gray-900 flex items-center justify-center overflow-hidden rounded px-2">
                           {/* Simple stripe pattern to simulate barcode */}
                           <div className="w-full h-full flex justify-between" style={{opacity: 0.9}}>
                               {Array.from({length: 40}).map((_, i) => (
                                   <div key={i} style={{
                                       width: Math.random() > 0.5 ? '4px' : '2px', 
                                       height: '100%', 
                                       backgroundColor: 'white',
                                       marginLeft: Math.random() * 4 + 'px'
                                   }}></div>
                               ))}
                           </div>
                      </div>
                      <div className="font-mono text-sm text-gray-500 tracking-widest">{user.memberCode}</div>
                  </div>

                  {/* QR Code */}
                  <div className="relative group cursor-pointer">
                      <div className="p-2 border-2 border-[#FDE047] rounded-xl">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${user.memberCode}-${refreshKey}`} 
                            className="w-40 h-40 mix-blend-multiply opacity-90" 
                            alt="QR Code"
                          />
                      </div>
                      {/* Logo Overlay */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full p-1 shadow-sm">
                          <div className="w-full h-full bg-[#FDE047] rounded-full flex items-center justify-center font-bold text-[8px]">
                              棠
                          </div>
                      </div>
                  </div>
              </div>

              {/* Refresh Info */}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 cursor-pointer" onClick={handleManualRefresh}>
                  <RefreshCw size={12} className={countdown < 60 ? "animate-spin-slow" : ""} />
                  <span>每60秒自动刷新 ({countdown}s)</span>
              </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 w-full grid grid-cols-2 gap-4">
             <button 
                onClick={onTopUp}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-white/20 transition-colors"
             >
                 <Wallet className="text-[#FDE047]" size={24} />
                 <span className="font-medium text-sm">立即充值</span>
             </button>
             <button className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-white/20 transition-colors">
                 <CreditCard className="text-[#FDE047]" size={24} />
                 <span className="font-medium text-sm">积分查询</span>
             </button>
          </div>
          
          <div className="mt-auto mb-8 flex items-center gap-2 text-gray-500 text-xs">
             <HelpCircle size={12} />
             <span>支付遇到问题?</span>
          </div>
      </div>
    </div>
  );
};
