
import React from 'react';
import { Info, MapPin, ChevronRight } from 'lucide-react';
import type { User } from '../../../types';
import type { DiningMode } from '../checkout.types';

interface CheckoutHeaderCardProps {
  diningMode: DiningMode;
  tableNo?: string | null;
  user: User | null;
}

export const CheckoutHeaderCard: React.FC<CheckoutHeaderCardProps> = ({ diningMode, tableNo, user }) => {
  if (tableNo) {
    return (
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 border-l-8 border-l-gray-900">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-black text-gray-900 italic">扫码点餐</h3>
          <span className="bg-gray-900 text-[#FDE047] px-3 py-1 rounded-lg text-[10px] font-black italic">{tableNo} 桌</span>
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">科技园店 · 您的专属美味</p>
        <div className="bg-yellow-50 text-[#D97706] p-3 rounded-2xl flex items-center gap-2 text-[10px] font-bold">
          <Info size={14} />
          请在座位稍等，美味将由店员为您送达
        </div>
      </div>
    );
  }

  if (diningMode === 'delivery') {
    return (
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-[#FDE047] shadow-lg">
              <MapPin size={24} />
            </div>
            <div>
              <div className="font-black text-gray-900 text-sm italic">选择收货地址</div>
              <div className="text-[10px] text-gray-400 font-bold mt-1">请完善您的配送信息</div>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-black text-gray-900 italic">棠小一 (科技园店)</h3>
        <span className="text-[10px] text-gray-400 font-black tracking-widest">距离您 0.8km</span>
      </div>
      <div className="space-y-3 pt-4 border-t border-gray-50">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">联系电话</span>
          <span className="text-xs font-black text-gray-900 font-mono">{user?.phone || '188****4331'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">预取时间</span>
          <span className="text-xs font-black text-gray-900">预计 10-15 分钟后可取</span>
        </div>
      </div>
    </div>
  );
};
