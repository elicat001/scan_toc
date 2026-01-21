
import React, { useEffect, useState } from 'react';
import { MapPin, ChevronRight, Store, ShoppingBag, Truck, Calendar, Navigation, Phone, QrCode } from 'lucide-react';
import { ViewState, User, Store as StoreType, Banner, Product } from '../types';
import { api } from '../services/api';

interface HomeProps {
  onNavigate: (view: ViewState) => void;
}

export const HomeView: React.FC<HomeProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<StoreType | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [recommendProducts, setRecommendProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.getUserProfile().then(setUser);
    api.getStoreInfo().then(setStore);
    api.getBanners().then(setBanners);
    api.getRecommendProducts().then(setRecommendProducts);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20 bg-[#F3F4F6]">
      {/* Header Area */}
      <div className="bg-white p-4 pb-6 rounded-b-[2rem] shadow-sm">
        {/* Top Bar */}
        <div className="flex justify-between items-start mb-6 pt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{user ? user.name : '加载中...'}</h1>
            <p className="text-xs text-gray-400">暂未开通此VIP特权</p>
          </div>
          <div 
            onClick={() => onNavigate('MEMBER_CODE')}
            className="flex items-center gap-1 bg-yellow-100/80 px-3 py-1.5 rounded-full border border-yellow-200 cursor-pointer active:scale-95 transition-transform"
          >
            <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
               <div className="bg-yellow-600 rounded-[1px]"></div>
               <div className="bg-yellow-600/50 rounded-[1px]"></div>
               <div className="bg-yellow-600/50 rounded-[1px]"></div>
               <div className="bg-yellow-600 rounded-[1px]"></div>
            </div>
            <span className="text-[10px] text-yellow-700 font-bold ml-1">会员码</span>
          </div>
        </div>

        {/* Banner Carousel (Simplified) */}
        {banners.length > 0 && (
          <div className="mb-6 rounded-xl overflow-hidden shadow-sm relative h-32">
             <img src={banners[0].imageUrl} className="w-full h-full object-cover" alt={banners[0].title} />
             <div className="absolute bottom-2 right-2 bg-black/30 text-white text-[9px] px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                1/{banners.length}
             </div>
          </div>
        )}

        {/* Main Actions Grid */}
        <div className="grid grid-cols-2 gap-4 px-2 mb-2">
          <button 
             onClick={() => onNavigate('SCAN_ORDER')} 
             className="bg-[#FEFCE8] hover:bg-[#FEF9C3] transition-colors p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-[#FEF08A] col-span-2 py-5"
          >
            <div className="bg-[#FDE047] p-3 rounded-full text-gray-900">
                <QrCode size={28} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <span className="block font-bold text-xl text-gray-900">扫码点餐</span>
              <span className="block text-[11px] text-yellow-700 font-medium">Scan QR to Order at Table</span>
            </div>
          </button>

          <button 
             onClick={() => onNavigate('MENU')} 
             className="bg-white hover:bg-gray-50 transition-colors p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100"
          >
             <div className="bg-gray-100 p-2.5 rounded-full text-gray-900">
                 <ShoppingBag size={24} strokeWidth={2.5} />
             </div>
            <div className="text-left">
              <span className="block font-bold text-lg text-gray-900">自取</span>
              <span className="block text-[10px] text-gray-400 font-medium">Pick Up</span>
            </div>
          </button>

          <button 
             onClick={() => onNavigate('MENU')}
             className="bg-white hover:bg-gray-50 transition-colors p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100"
          >
             <div className="bg-gray-100 p-2.5 rounded-full text-gray-900">
                 <Truck size={24} strokeWidth={2.5} />
             </div>
            <div className="text-left">
              <span className="block font-bold text-lg text-gray-900">外送</span>
              <span className="block text-[10px] text-gray-400 font-medium">Delivery</span>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('RESERVATION')}
            className="bg-white hover:bg-gray-50 transition-colors p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100"
          >
             <div className="bg-gray-100 p-2.5 rounded-full text-gray-900">
                 <Calendar size={24} strokeWidth={2.5} />
             </div>
            <div className="text-left">
              <span className="block font-bold text-lg text-gray-900">自助预约</span>
              <span className="block text-[10px] text-gray-400 font-medium">Reservation</span>
            </div>
          </button>
          
          <button 
             onClick={() => onNavigate('MENU')} 
             className="bg-white hover:bg-gray-50 transition-colors p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-gray-100"
          >
            <div className="bg-gray-100 p-2.5 rounded-full text-gray-900">
                <Store size={24} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <span className="block font-bold text-lg text-gray-900">堂食</span>
              <span className="block text-[10px] text-gray-400 font-medium">Dine In</span>
            </div>
          </button>
        </div>
      </div>

      {/* Store Card */}
      {store && (
        <div className="mx-4 mt-5 bg-white rounded-2xl overflow-hidden shadow-sm relative group cursor-pointer border border-gray-100" onClick={() => onNavigate('STORE_DETAIL')}>
          {/* Map Background Placeholder */}
          <div className="h-24 bg-gray-100 relative overflow-hidden">
             <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/city-map.png')] grayscale"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <MapPin className="text-gray-800 drop-shadow-md" size={28} fill="#FDE047" />
                <div className="w-2 h-1 bg-black/20 rounded-full blur-[1px]"></div>
             </div>
             
             {/* Status Badge */}
             <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-green-600 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-green-100 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                {store.status === 'OPEN' ? '营业中' : '休息中'}
             </div>
          </div>

          <div className="p-4">
             <div className="flex justify-between items-start mb-3">
               <div>
                 <h3 className="font-bold text-lg text-gray-900">{store.name}</h3>
                 <div className="flex items-center gap-2 mt-1">
                     <span className="text-xs text-gray-500 flex items-center gap-0.5">
                        <MapPin size={12} /> {store.distance}
                     </span>
                     <div className="w-[1px] h-2.5 bg-gray-200"></div>
                     <span className="text-xs text-gray-500">{store.address}</span>
                 </div>
               </div>
             </div>
             
             <div className="flex gap-2 border-t border-gray-50 pt-3">
                <button 
                   onClick={(e) => { e.stopPropagation(); /* Call Logic */ }}
                   className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-50 text-xs font-bold text-gray-700 hover:bg-gray-100"
                >
                   <Phone size={14} /> 联系门店
                </button>
                <button 
                   onClick={(e) => { e.stopPropagation(); /* Nav Logic */ }}
                   className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-50 text-xs font-bold text-gray-700 hover:bg-gray-100"
                >
                   <Navigation size={14} /> 导航前往
                </button>
                <button 
                   onClick={(e) => { e.stopPropagation(); onNavigate('MENU'); }} 
                   className="flex-[1.5] bg-[#FDE047] text-gray-900 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-yellow-400 transition-colors flex items-center justify-center gap-1"
                >
                   去点单 <ChevronRight size={14} />
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Recommendation Feed */}
      <div className="mt-6 px-4">
         <div className="flex items-center justify-between mb-3">
             <h3 className="font-bold text-lg text-gray-900">今日推荐</h3>
             <span className="text-xs text-gray-400">查看更多</span>
         </div>
         
         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
             {recommendProducts.map(product => (
                 <div key={product.id} className="min-w-[140px] w-[140px] bg-white rounded-xl p-2 shadow-sm flex flex-col" onClick={() => onNavigate('MENU')}>
                     <div className="w-full aspect-square rounded-lg bg-gray-100 mb-2 overflow-hidden">
                         <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                     </div>
                     <div className="font-bold text-gray-900 text-xs line-clamp-1 mb-1">{product.name}</div>
                     <div className="flex justify-between items-center mt-auto">
                         <span className="text-sm font-bold text-gray-900">¥{product.price}</span>
                         <button className="w-5 h-5 bg-[#FDE047] rounded-full flex items-center justify-center text-gray-900">
                             <ShoppingBag size={10} />
                         </button>
                     </div>
                 </div>
             ))}
         </div>
      </div>
      
      <div className="h-8"></div>
    </div>
  );
};
