
import React, { useEffect, useState } from 'react';
import { MapPin, ChevronRight, Store, ShoppingBag, Truck, Calendar } from 'lucide-react';
import { ViewState, User, Store as StoreType } from '../types';
import { api } from '../services/api';

interface HomeProps {
  onNavigate: (view: ViewState) => void;
}

export const HomeView: React.FC<HomeProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<StoreType | null>(null);

  useEffect(() => {
    api.getUserProfile().then(setUser);
    api.getStoreInfo().then(setStore);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20 bg-[#F3F4F6]">
      {/* Header Area */}
      <div className="bg-white p-4 pb-6 rounded-b-[2rem] shadow-sm">
        {/* Top Bar */}
        <div className="flex justify-between items-start mb-8 pt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{user ? user.name : '加载中...'}</h1>
            <p className="text-xs text-gray-400">暂未开通此VIP特权</p>
          </div>
          <div className="flex items-center gap-1 bg-yellow-100/80 px-3 py-1.5 rounded-full border border-yellow-200 cursor-pointer">
            <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
               <div className="bg-yellow-600 rounded-[1px]"></div>
               <div className="bg-yellow-600/50 rounded-[1px]"></div>
               <div className="bg-yellow-600/50 rounded-[1px]"></div>
               <div className="bg-yellow-600 rounded-[1px]"></div>
            </div>
            <span className="text-[10px] text-yellow-700 font-bold ml-1">会员码</span>
          </div>
        </div>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-2 gap-y-8 gap-x-12 px-6 mb-4">
          <button onClick={() => onNavigate('MENU')} className="flex flex-col items-center justify-center gap-2 group">
            <div className="relative">
                <Store size={40} className="text-gray-800 stroke-1" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full hidden"></div>
            </div>
            <div className="text-center">
              <span className="block font-bold text-lg text-gray-900 tracking-wide">堂食</span>
              <span className="block text-[10px] text-gray-400 uppercase font-medium">Dine In</span>
            </div>
          </button>

          <button onClick={() => onNavigate('MENU')} className="flex flex-col items-center justify-center gap-2 border-l border-dashed border-gray-200 pl-6">
             <UserIcon size={40} />
            <div className="text-center">
              <span className="block font-bold text-lg text-gray-900 tracking-wide">自取</span>
              <span className="block text-[10px] text-gray-400 uppercase font-medium">Pick Up</span>
            </div>
          </button>

          <button className="flex flex-col items-center justify-center gap-2">
             <div className="relative">
                 <Truck size={40} className="text-gray-800 stroke-1" />
             </div>
            <div className="text-center">
              <span className="block font-bold text-lg text-gray-900 tracking-wide">外送</span>
              <span className="block text-[10px] text-gray-400 uppercase font-medium">Delivery</span>
            </div>
          </button>

          <button className="flex flex-col items-center justify-center gap-2 border-l border-dashed border-gray-200 pl-6">
             <Calendar size={40} className="text-gray-800 stroke-1" />
            <div className="text-center">
              <span className="block font-bold text-lg text-gray-900 tracking-wide">自助预约</span>
              <span className="block text-[10px] text-gray-400 uppercase font-medium">Reservation</span>
            </div>
          </button>
        </div>
      </div>

      {/* Grey Bar - Unmet Conditions */}
      <div className="mx-4 mt-5 bg-gray-200/80 rounded-full py-3 text-center text-gray-500 font-bold text-sm shadow-inner">
        未满足开通条件
      </div>

      {/* Store Card */}
      {store && (
        <div className="mx-4 mt-5 bg-[#FDE047] rounded-2xl overflow-hidden shadow-sm relative group cursor-pointer" onClick={() => onNavigate('MENU')}>
          <div className="p-4 flex justify-between items-start z-10 relative">
            <div className="flex items-center gap-1.5 text-gray-900">
              <MapPin size={18} className="stroke-2" />
              <span className="font-bold text-base">附近门店</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onNavigate('STORE_LIST'); }} 
              className="text-xs text-gray-800 font-medium flex items-center hover:opacity-70"
            >
              查看所有门店 <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="h-32 w-full flex items-center justify-center relative overflow-hidden">
              {/* Sketchy Illustration Overlay */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/sketch-header.png')]"></div>
               <img 
                  src="https://ouch-cdn2.icons8.com/f1W0-N1X5-0.png" 
                  alt="Shop Illustration" 
                  className="h-full object-contain opacity-80 mix-blend-multiply scale-110 translate-y-2"
               />
          </div>

          <div className="bg-white p-5 flex justify-between items-center">
             <div>
               <h3 className="font-bold text-xl text-gray-900 mb-1">{store.name}</h3>
               <p className="text-xs text-gray-500">授权地理位置即可选择门店</p>
             </div>
             <button onClick={(e) => { e.stopPropagation(); onNavigate('MENU'); }} className="bg-[#FDE047] text-gray-900 px-5 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-yellow-400 transition-colors">
               查看详情
             </button>
          </div>
        </div>
      )}
      
      <div className="h-8"></div>
    </div>
  );
};

// Helper Icon
const UserIcon = ({ size }: { size: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="text-gray-800"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
