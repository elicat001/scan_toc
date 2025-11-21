
import React, { useState } from 'react';
import { ChevronLeft, Clock, AlertCircle, Check } from 'lucide-react';
import { PointsReward } from '../types';
import { api } from '../services/api';

interface PointsItemDetailProps {
  reward: PointsReward;
  onBack: () => void;
}

export const PointsItemDetailView: React.FC<PointsItemDetailProps> = ({ reward, onBack }) => {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRedeem = async () => {
    setIsRedeeming(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRedeeming(false);
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Image Header */}
      <div className="relative h-64 bg-gray-100">
         <img src={reward.image} className="w-full h-full object-cover" alt={reward.name} />
         <button 
            onClick={onBack} 
            className="absolute top-4 left-4 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
         >
            <ChevronLeft size={24} />
         </button>
      </div>

      <div className="flex-1 p-4 pb-24 overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
              <h1 className="text-xl font-bold text-gray-900 flex-1 mr-4">{reward.name}</h1>
              <div className="text-right">
                 <span className="text-[#D97706] font-bold text-2xl font-mono">{reward.points}</span>
                 <span className="text-xs text-gray-500 block">积分</span>
              </div>
          </div>

          {/* Tags/Info */}
          <div className="flex gap-3 mb-6">
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                 <Clock size={12} />
                 <span>兑换后30天有效</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                 <Check size={12} />
                 <span>免运费</span>
              </div>
          </div>

          <hr className="border-gray-100 mb-6" />

          {/* Description */}
          <div className="mb-6">
              <h3 className="font-bold text-sm text-gray-900 mb-3">商品详情</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                 {reward.description || '暂无详细描述。此商品为会员积分兑换专属礼品，数量有限，兑完即止。'}
              </p>
          </div>

          {/* Rules */}
          <div className="mb-6">
              <h3 className="font-bold text-sm text-gray-900 mb-3">兑换规则</h3>
              <div className="space-y-2">
                 {reward.rules ? reward.rules.map((rule, idx) => (
                     <div key={idx} className="flex gap-2 text-xs text-gray-500">
                        <div className="w-1 h-1 bg-gray-300 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>{rule}</span>
                     </div>
                 )) : (
                     <>
                        <div className="flex gap-2 text-xs text-gray-500">
                           <div className="w-1 h-1 bg-gray-300 rounded-full mt-1.5 flex-shrink-0"></div>
                           <span>兑换成功后积分不予退还</span>
                        </div>
                        <div className="flex gap-2 text-xs text-gray-500">
                           <div className="w-1 h-1 bg-gray-300 rounded-full mt-1.5 flex-shrink-0"></div>
                           <span>请在有效期内使用，过期作废</span>
                        </div>
                     </>
                 )}
              </div>
          </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 pb-safe max-w-md mx-auto">
         <button 
            onClick={handleRedeem}
            disabled={isRedeeming}
            className="w-full bg-[#FDE047] text-gray-900 font-bold py-3 rounded-full shadow-sm hover:bg-yellow-400 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
         >
            {isRedeeming ? '处理中...' : `立即兑换 (${reward.points}积分)`}
         </button>
      </div>

      {/* Success Modal */}
      {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
             <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col items-center animate-in zoom-in duration-200">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-500">
                    <Check size={32} strokeWidth={3} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">兑换成功</h3>
                 <p className="text-sm text-gray-500 text-center mb-6">
                    您已成功兑换 {reward.name}，请在"我的-优惠券"中查看或使用。
                 </p>
                 <button 
                    onClick={onBack}
                    className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl"
                 >
                    知道了
                 </button>
             </div>
          </div>
      )}
    </div>
  );
};
