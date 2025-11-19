
import React, { useEffect, useState } from 'react';
import { User, QrCode, ChevronRight, CreditCard, Gift, MapPin, Headphones, ShoppingBag, FileText, UserCircle } from 'lucide-react';
import { api } from '../services/api';
import { User as UserType } from '../types';

export const ProfileView: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    api.getUserProfile().then(setUser);
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-24">
      {/* Header Gradient Area */}
      <div className="bg-gradient-to-b from-[#FDE047] to-[#F3F4F6] pt-14 pb-6 px-5">
         <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-md overflow-hidden border-2 border-white">
                  {user?.avatar ? (
                      <img src={user.avatar} className="w-full h-full object-cover" />
                  ) : (
                      <User size={40} />
                  )}
               </div>
               <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name || '登录/注册'}</h2>
                  <p className="text-sm text-gray-700 font-mono">{user?.phone}</p>
               </div>
            </div>
            <div className="bg-white/40 backdrop-blur-sm p-2 rounded-lg cursor-pointer hover:bg-white/60 transition-colors">
               <QrCode size={24} className="text-gray-900" />
            </div>
         </div>

         {/* Stats Card */}
         <div className="bg-white rounded-2xl p-6 shadow-sm grid grid-cols-3 gap-4 text-center relative z-10">
            <div className="flex flex-col gap-1 items-center cursor-pointer active:opacity-60">
               <span className="text-gray-500 font-medium text-xs mb-1">积分</span>
               <span className="text-xl font-bold text-gray-900">{user?.points || 0}</span>
            </div>
            <div className="flex flex-col gap-1 items-center border-l border-gray-100 cursor-pointer active:opacity-60">
               <span className="text-gray-500 font-medium text-xs mb-1">余额</span>
               <span className="text-xl font-bold text-gray-900">{user?.balance.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-1 items-center border-l border-gray-100 cursor-pointer active:opacity-60">
               <span className="text-gray-500 font-medium text-xs mb-1">优惠券</span>
               <span className="text-xl font-bold text-gray-900">{user?.coupons || 0}</span>
            </div>
         </div>
      </div>

      {/* Menu List */}
      <div className="px-4 mt-2 space-y-4">
         <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {[
               { icon: FileText, label: '订单中心' },
               { icon: UserCircle, label: '个人信息' },
               { icon: Headphones, label: '客服中心' },
               { icon: MapPin, label: '我的地址' }
            ].map((item) => (
               <div key={item.label} className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer relative group">
                   {/* Divider */}
                  <div className="absolute bottom-0 left-12 right-0 h-[1px] bg-gray-50 group-last:hidden"></div>
                  
                  <div className="flex items-center gap-3">
                      <item.icon size={20} className="text-gray-700" strokeWidth={1.5} />
                      <span className="text-gray-900 text-sm font-medium">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
               </div>
            ))}
         </div>

         <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {[
               { icon: CreditCard, label: '会员储值' },
               { icon: ShoppingBag, label: '积分商城' }
            ].map((item) => (
               <div key={item.label} className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer relative group">
                   {/* Divider */}
                  <div className="absolute bottom-0 left-12 right-0 h-[1px] bg-gray-50 group-last:hidden"></div>
                  
                  <div className="flex items-center gap-3">
                      <item.icon size={20} className="text-gray-700" strokeWidth={1.5} />
                      <span className="text-gray-900 text-sm font-medium">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
               </div>
            ))}
         </div>
      </div>
      
      <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-300">v1.0.0</p>
      </div>
    </div>
  );
};
