
import React, { useEffect, useState } from 'react';
import { User, QrCode, ChevronRight, CreditCard, Gift, MapPin, Headphones, ShoppingBag, FileText, UserCircle, Phone, Clock, X } from 'lucide-react';
import { api } from '../services/api';
import { User as UserType, ViewState } from '../types';

interface ProfileProps {
  onNavigate: (view: ViewState) => void;
}

export const ProfileView: React.FC<ProfileProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    api.getUserProfile().then(setUser);
  }, []);

  const menuItems = [
     { icon: FileText, label: '订单中心', action: () => onNavigate('ORDERS') },
     { icon: UserCircle, label: '个人信息', action: () => onNavigate('USER_PROFILE') },
     { icon: Headphones, label: '客服中心', action: () => setShowHelpModal(true) },
     { icon: MapPin, label: '我的地址', action: () => onNavigate('ADDRESS_LIST') }
  ];

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
            <div className="bg-white/40 backdrop-blur-sm p-2 rounded-lg cursor-pointer hover:bg-white/60 transition-colors" onClick={() => onNavigate('MEMBER_CODE')}>
               <QrCode size={24} className="text-gray-900" />
            </div>
         </div>

         {/* Stats Card */}
         <div className="bg-white rounded-2xl p-6 shadow-sm grid grid-cols-3 gap-4 text-center relative z-10">
            <div className="flex flex-col gap-1 items-center cursor-pointer active:opacity-60" onClick={() => onNavigate('POINTS_MALL')}>
               <span className="text-gray-500 font-medium text-xs mb-1">积分</span>
               <span className="text-xl font-bold text-gray-900">{user?.points || 0}</span>
            </div>
            <div className="flex flex-col gap-1 items-center border-l border-gray-100 cursor-pointer active:opacity-60" onClick={() => onNavigate('MEMBER_TOPUP')}>
               <span className="text-gray-500 font-medium text-xs mb-1">余额</span>
               <span className="text-xl font-bold text-gray-900">{( (user?.balanceCent || 0) / 100).toFixed(2)}</span>
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
            {menuItems.map((item) => (
               <div 
                 key={item.label} 
                 onClick={item.action}
                 className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer relative group"
               >
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
               { icon: CreditCard, label: '会员储值', action: () => onNavigate('MEMBER_TOPUP') },
               { icon: ShoppingBag, label: '积分商城', action: () => onNavigate('POINTS_MALL') }
            ].map((item) => (
               <div 
                 key={item.label} 
                 onClick={item.action}
                 className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer relative group"
               >
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

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 animate-in zoom-in duration-200 relative shadow-xl">
                <button 
                    onClick={() => setShowHelpModal(false)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
                >
                    <X size={20} />
                </button>
                
                <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">联系客服</h3>
                
                <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="bg-white p-2 rounded-full shadow-sm text-gray-900 border border-gray-100">
                            <Phone size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900">客服电话</div>
                            <div className="text-lg font-bold text-[#D97706] mt-1">400-888-9999</div>
                            <div className="text-xs text-gray-400 mt-1">点击即可拨打</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="bg-white p-2 rounded-full shadow-sm text-gray-900 border border-gray-100">
                            <Clock size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900">服务时间</div>
                            <div className="text-sm text-gray-600 mt-1">周一至周日 09:00 - 22:00</div>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={() => setShowHelpModal(false)}
                    className="w-full bg-[#FDE047] text-gray-900 font-bold py-3 rounded-xl shadow-sm hover:bg-yellow-400 mt-6 transition-colors"
                >
                    关闭
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
