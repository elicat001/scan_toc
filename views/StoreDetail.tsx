
import React, { useEffect, useState } from 'react';
import { ChevronLeft, MapPin, Phone, Clock, Navigation, Star, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { Store } from '../types';

interface StoreDetailProps {
  onBack: () => void;
}

export const StoreDetailView: React.FC<StoreDetailProps> = ({ onBack }) => {
  const [store, setStore] = useState<Store | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      const data = await api.getStoreInfo();
      setStore(data);
      
      // 简单的营业时间校验逻辑 (假设格式为 08:00-22:00)
      if (data && data.businessHours) {
        const now = new Date();
        const [start, end] = data.businessHours.split('-');
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        
        const startTime = new Date();
        startTime.setHours(startH, startM, 0);
        
        const endTime = new Date();
        endTime.setHours(endH, endM, 0);
        
        setIsOpen(now >= startTime && now <= endTime);
      }
      setLoading(false);
    };
    fetchStore();
  }, []);

  if (loading || !store) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('zh-CN', { weekday: 'long' });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Image */}
      <div className="relative h-64 bg-gray-200">
          <img 
            src={store.image} 
            className="w-full h-full object-cover"
            alt="Storefront" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-black/30 text-white rounded-full backdrop-blur-md hover:bg-black/50 transition-colors z-20">
              <ChevronLeft size={24} />
          </button>
          
          <div className="absolute bottom-6 left-6 right-6 text-white z-10">
              <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest shadow-sm ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}>
                      {isOpen ? '正在营业' : '休息中'}
                  </span>
                  <div className="flex gap-1">
                    {store.tags.map(tag => (
                      <span key={tag} className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold">{tag}</span>
                    ))}
                  </div>
              </div>
              <h1 className="text-3xl font-black tracking-tighter italic">{store.name}</h1>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
          {/* Main Action Buttons */}
          <div className="flex gap-4 mb-8">
              <button className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-[#FDE047] py-4 rounded-2xl font-black text-sm shadow-xl shadow-gray-200 active:scale-95 transition-all">
                  <Navigation size={18} strokeWidth={2.5} /> 导航到店
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-900 py-4 rounded-2xl font-black text-sm active:scale-95 transition-all">
                  <Phone size={18} strokeWidth={2.5} /> 联系电话
              </button>
          </div>

          {/* Info Sections */}
          <div className="space-y-8">
              {/* Address & Dynamic Hours Section */}
              <div className="flex gap-5 items-start group">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors flex-shrink-0">
                    <MapPin size={24} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 border-b border-gray-50 pb-6">
                      <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-2">门店信息</h3>
                      <p className="text-base font-bold text-gray-800 leading-snug mb-3">{store.address}</p>
                      
                      {/* Sub-address dynamic hours area */}
                      <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100/50">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2">
                              <Clock size={14} className={isOpen ? "text-green-500" : "text-red-500"} />
                              <span className={`text-xs font-black ${isOpen ? "text-green-600" : "text-red-600"}`}>
                                {isOpen ? '正在营业' : '当前休息中'}
                              </span>
                           </div>
                           <span className="text-[10px] font-bold text-gray-400 uppercase">{today}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-gray-900 font-mono tracking-tight">{store.businessHours}</span>
                          <span className="text-[10px] font-bold text-gray-400"> (标准营业时间)</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-400 mt-4 font-bold flex items-center gap-1">
                        <Navigation size={10} /> 距离您约 {store.distance}
                      </p>
                  </div>
              </div>

              {/* Services Section */}
              <div className="flex gap-5 items-start group">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors flex-shrink-0">
                    <ShieldCheck size={24} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                      <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-3">门店服务</h3>
                      <div className="flex gap-3 flex-wrap">
                          {['免费WIFI', '可充电', '宝宝椅', '无烟区', '宠物友好'].map(tag => (
                              <span key={tag} className="text-[11px] font-black bg-gray-50 text-gray-500 px-3 py-1.5 rounded-xl border border-gray-100 hover:bg-white hover:border-gray-200 transition-all cursor-default">
                                  {tag}
                              </span>
                          ))}
                      </div>
                  </div>
              </div>
          </div>

          {/* Map Preview */}
          <div className="mt-10 rounded-3xl overflow-hidden h-44 bg-gray-50 relative group cursor-pointer border border-gray-100 shadow-inner">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/city-map.png')] grayscale group-hover:scale-110 transition-transform duration-1000"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="relative">
                      <MapPin className="text-red-500 drop-shadow-2xl animate-bounce" size={40} fill="currentColor" />
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/10 rounded-full blur-[2px]"></div>
                  </div>
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black text-gray-500 shadow-sm border border-gray-100 uppercase tracking-widest">
                View in Maps
              </div>
          </div>
      </div>
    </div>
  );
};
