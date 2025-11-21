
import React, { useEffect, useState } from 'react';
import { ChevronLeft, Search, MapPin, Navigation } from 'lucide-react';
import { Store } from '../types';
import { api } from '../services/api';

interface StoreListProps {
  onBack: () => void;
  onSelect: (store: Store) => void;
}

export const StoreListView: React.FC<StoreListProps> = ({ onBack, onSelect }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.getStores().then(setStores);
  }, []);

  const filteredStores = stores.filter(s => s.name.includes(searchTerm) || s.address.includes(searchTerm));

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-20 shadow-sm">
         <div className="flex items-center justify-between mb-3">
            <button onClick={onBack} className="p-1 -ml-1 rounded-full hover:bg-gray-100"><ChevronLeft size={24} /></button>
            <span className="font-bold text-lg text-gray-900">选择门店</span>
            <div className="w-8"></div>
         </div>
         {/* Search Bar */}
         <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索门店" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 rounded-full py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#FDE047]/50"
            />
         </div>
      </div>

      {/* Map Placeholder */}
      <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#999 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
         <button className="bg-white px-4 py-2 rounded-full shadow-md flex items-center gap-2 text-sm font-bold text-gray-800 z-10">
            <MapPin size={16} /> 查看地图模式
         </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
         <div className="text-xs text-gray-500 font-medium ml-1">附近门店</div>
         {filteredStores.map(store => (
            <div 
              key={store.id} 
              onClick={() => onSelect(store)}
              className={`bg-white p-4 rounded-xl shadow-sm border-2 transition-all ${store.status === 'OPEN' ? 'border-transparent hover:border-[#FDE047]' : 'border-transparent opacity-70 grayscale'}`}
            >
                <div className="flex gap-3">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                       <img src={store.image} className="w-full h-full object-cover" alt={store.name} />
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900 text-sm mb-1">{store.name}</h3>
                          <span className="text-xs text-gray-500">{store.distance}</span>
                       </div>
                       <p className="text-xs text-gray-500 mb-2 line-clamp-1">{store.address}</p>
                       <div className="flex gap-1 flex-wrap">
                          {store.tags.map(tag => (
                             <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{tag}</span>
                          ))}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${store.status === 'OPEN' ? 'text-green-600 border-green-200 bg-green-50' : 'text-gray-400 border-gray-200'}`}>
                             {store.status === 'OPEN' ? '营业中' : '休息中'}
                          </span>
                       </div>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center">
                   <div className="flex gap-4">
                      <button className="text-xs font-medium text-gray-600 flex items-center gap-1"><Navigation size={12} /> 导航</button>
                   </div>
                   <button className="bg-[#FDE047] text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full">去点单</button>
                </div>
            </div>
         ))}
      </div>
    </div>
  );
};
