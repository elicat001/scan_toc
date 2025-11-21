
import React from 'react';
import { ChevronLeft, MapPin, Phone, Clock, Navigation, Star } from 'lucide-react';

interface StoreDetailProps {
  onBack: () => void;
}

export const StoreDetailView: React.FC<StoreDetailProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Image */}
      <div className="relative h-56 bg-gray-200">
          <img 
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop" 
            className="w-full h-full object-cover"
            alt="Storefront" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <button onClick={onBack} className="absolute top-4 left-4 p-1.5 bg-black/30 text-white rounded-full backdrop-blur-sm hover:bg-black/50">
              <ChevronLeft size={24} />
          </button>
          <div className="absolute bottom-4 left-4 right-4 text-white">
              <h1 className="text-2xl font-bold mb-1">棠小一 (科技园店)</h1>
              <div className="flex items-center gap-2 text-sm opacity-90">
                  <span className="bg-[#FDE047] text-gray-900 px-1.5 rounded text-xs font-bold">营业中</span>
                  <span>烘焙 • 甜点 • 咖啡</span>
              </div>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
          {/* Actions */}
          <div className="flex gap-3 mb-6">
              <button className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-bold shadow-sm">
                  <Navigation size={18} /> 导航到店
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-900 py-3 rounded-xl font-bold">
                  <Phone size={18} /> 联系电话
              </button>
          </div>

          {/* Info List */}
          <div className="space-y-6">
              <div className="flex gap-4 items-start">
                  <MapPin className="text-gray-400 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                      <h3 className="font-bold text-gray-900 mb-1">门店地址</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">深圳市南山区科技园南区R3-A栋 201室</p>
                      <p className="text-xs text-gray-400 mt-1">距离您 99.4km</p>
                  </div>
              </div>

              <div className="flex gap-4 items-start">
                  <Clock className="text-gray-400 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                      <h3 className="font-bold text-gray-900 mb-1">营业时间</h3>
                      <p className="text-sm text-gray-600">周一至周日 08:00 - 22:00</p>
                  </div>
              </div>

              <div className="flex gap-4 items-start">
                  <Star className="text-gray-400 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                      <h3 className="font-bold text-gray-900 mb-1">门店服务</h3>
                      <div className="flex gap-2 flex-wrap mt-2">
                          {['免费WIFI', '可充电', '宝宝椅', '无烟区'].map(tag => (
                              <span key={tag} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100">
                                  {tag}
                              </span>
                          ))}
                      </div>
                  </div>
              </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-8 rounded-xl overflow-hidden h-40 bg-gray-100 relative">
              <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/city-map.png')] grayscale"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <MapPin className="text-red-500 drop-shadow-lg" size={32} fill="currentColor" />
              </div>
          </div>
      </div>
    </div>
  );
};
