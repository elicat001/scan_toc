
import React, { useEffect, useState } from 'react';
import { MapPin, ChevronRight, ShoppingBag, Truck, Calendar, Phone, QrCode, Bell, Plus, Gift } from 'lucide-react';
import { ViewState, User, Store as StoreType, Banner, Product } from '../types';
import { api } from '../services/api';
import { HomeSkeleton } from '../components/Skeleton';

interface HomeProps {
  onNavigate: (view: ViewState) => void;
}

export const HomeView: React.FC<HomeProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<StoreType | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [recommendProducts, setRecommendProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, storeData, bannerData, productsData] = await Promise.all([
          api.getUserProfile(),
          api.getStoreInfo(),
          api.getBanners(),
          api.getRecommendProducts()
        ]);
        setUser(userData);
        setStore(storeData);
        setBanners(bannerData);
        setRecommendProducts(productsData);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchData();
  }, []);

  if (loading) return <HomeSkeleton />;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 bg-[#F8F9FA]">
      <div className="relative bg-white pt-2 pb-6 px-5 rounded-b-[2.5rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] z-10">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-100/40 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex justify-between items-center mb-6">
           <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-100">
                  <img src={user?.avatar} className="w-full h-full object-cover" alt="avatar" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[9px] text-gray-400 font-extrabold tracking-premium leading-none mb-1">美好的一天</span>
                 <h1 className="text-lg font-black text-gray-900 leading-none">{user?.name}</h1>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button 
                onClick={() => onNavigate('MEMBER_CODE')}
                className="flex items-center gap-2 bg-gray-900 text-[#FDE047] px-4 py-2 rounded-full shadow-lg shadow-gray-200 active:scale-95 transition-all"
              >
                <QrCode size={18} strokeWidth={2.5} />
                <span className="text-xs font-black tracking-tight">会员码</span>
              </button>
           </div>
        </div>

        {banners.length > 0 && (
          <div className="mb-6 group relative h-40 rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5">
             <img src={banners[0].imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={banners[0].title} />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
             <div className="absolute bottom-4 left-5">
                <span className="bg-yellow-400 text-gray-900 text-[8px] font-black px-2 py-0.5 rounded tracking-premium mb-1 inline-block">今日特惠</span>
                <h2 className="text-white font-brand-italic text-2xl tracking-tighter">{banners[0].title}</h2>
             </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-4 px-1">
          <button 
             onClick={() => onNavigate('SCAN_ORDER')} 
             className="col-span-4 bg-gradient-to-br from-[#FEFCE8] to-[#FDE68A] p-5 rounded-3xl flex items-center justify-between shadow-md border border-white/50 active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white p-3.5 rounded-2xl shadow-sm text-gray-900 group-hover:rotate-12 transition-transform">
                  <QrCode size={32} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <span className="block font-brand-italic text-3xl text-gray-900 tracking-tighter">扫码点餐</span>
                <span className="block text-[9px] text-yellow-800 font-extrabold tracking-premium opacity-60">即刻开席</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center">
                <ChevronRight size={20} className="text-yellow-900" />
            </div>
          </button>

          {[
            { id: 'MENU', label: '自取', icon: ShoppingBag, color: 'bg-blue-50', iconColor: 'text-blue-500' },
            { id: 'MENU', label: '外送', icon: Truck, color: 'bg-green-50', iconColor: 'text-green-500' },
            { id: 'RESERVATION', label: '预约', icon: Calendar, color: 'bg-purple-50', iconColor: 'text-purple-500' },
            { id: 'POINTS_MALL', label: '商城', icon: Gift, color: 'bg-orange-50', iconColor: 'text-orange-500' }
          ].map((item, idx) => (
            <button 
               key={idx}
               onClick={() => onNavigate(item.id as ViewState)} 
               className="flex flex-col items-center gap-2 group"
            >
               <div className={`${item.color} ${item.iconColor} p-4 rounded-2xl shadow-sm border border-white group-active:scale-90 transition-all`}>
                   <item.icon size={24} strokeWidth={2.5} />
               </div>
               <span className="text-[11px] font-black text-gray-800 tracking-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {store && (
        <div className="mx-5 mt-8 bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] border border-gray-100 group" onClick={() => onNavigate('STORE_DETAIL')}>
          <div className="h-28 relative overflow-hidden">
             <img src={store.image} className="w-full h-full object-cover blur-[1px] opacity-40 grayscale" alt="store banner" />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                <div className="bg-white p-2 rounded-full shadow-lg border-2 border-yellow-400">
                    <MapPin className="text-gray-900" size={24} fill="#FDE047" />
                </div>
             </div>
             <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black text-green-600 shadow-sm border border-green-100 tracking-premium">
                营业中
             </div>
          </div>

          <div className="px-6 pb-6 text-center">
             <h3 className="font-brand-italic text-2xl text-gray-900 tracking-tighter mb-1">{store.name}</h3>
             <p className="text-[9px] text-gray-400 font-extrabold tracking-premium mb-5">匠心烘焙与精品咖啡</p>
             
             <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-50 text-xs font-black text-gray-700 hover:bg-gray-100 active:scale-95 transition-all">
                   <Phone size={14} /> 联系门店
                </button>
                <button 
                   onClick={(e) => { e.stopPropagation(); onNavigate('MENU'); }} 
                   className="flex-[2] bg-gray-900 text-[#FDE047] py-3 rounded-2xl text-xs font-black shadow-lg shadow-gray-200 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                   立即点单 <ChevronRight size={14} strokeWidth={3} />
                </button>
             </div>
          </div>
        </div>
      )}

      <div className="mt-10 px-6">
         <div className="flex items-center justify-between mb-5">
             <div>
                <h3 className="font-brand-italic text-2xl text-gray-900 tracking-tighter leading-none mb-1">今日推荐</h3>
                <span className="text-[9px] text-gray-400 font-extrabold tracking-premium">为您精选</span>
             </div>
             <button className="text-[10px] font-extrabold text-gray-400 hover:text-gray-900 flex items-center gap-1 transition-colors tracking-premium">
                查看全部 <ChevronRight size={12} strokeWidth={3} />
             </button>
         </div>
         
         <div className="flex gap-5 overflow-x-auto no-scrollbar pb-8">
             {recommendProducts.map(product => (
                 <div key={product.id} className="min-w-[160px] bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex flex-col active:scale-95 transition-all" onClick={() => onNavigate('MENU')}>
                     <div className="w-full aspect-square rounded-2xl bg-gray-50 mb-3 overflow-hidden shadow-inner">
                         <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                     </div>
                     <div className="px-1">
                        <div className="font-brand-italic text-gray-900 text-sm line-clamp-1 mb-1 tracking-tight">{product.name}</div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-xl font-mono-numbers font-black text-gray-900">¥{product.price}</span>
                            <button className="w-8 h-8 bg-[#FDE047] rounded-xl flex items-center justify-center text-gray-900 shadow-sm shadow-yellow-200 active:scale-90 transition-all">
                                <Plus size={16} strokeWidth={3} />
                            </button>
                        </div>
                     </div>
                 </div>
             ))}
         </div>
      </div>
    </div>
  );
};
