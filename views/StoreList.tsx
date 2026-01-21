
import React, { useEffect, useState } from 'react';
import { ChevronLeft, Search, MapPin, Navigation, X, ShoppingBag, Clock } from 'lucide-react';
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

  // 不区分大小写的名称和地址过滤
  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Header Area */}
      <div className="bg-white px-5 pt-4 pb-4 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
         <div className="flex items-center justify-between mb-4">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-50 text-gray-900 transition-colors">
                <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <span className="font-black text-lg text-gray-900 tracking-tight italic">选择门店</span>
            <div className="w-10"></div>
         </div>
         
         {/* Refined Search Bar */}
         <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
            <input 
              type="text" 
              placeholder="搜索门店名称、地址..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 rounded-2xl py-3 pl-11 pr-10 text-xs font-bold outline-none ring-2 ring-transparent focus:ring-yellow-400/20 focus:bg-white transition-all placeholder:text-gray-400"
            />
            {searchTerm && (
                <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-gray-200 rounded-full text-gray-500 hover:bg-gray-300 transition-colors"
                >
                    <X size={10} strokeWidth={3} />
                </button>
            )}
         </div>
      </div>

      {/* Map Preview Placeholder - More Aesthetic */}
      <div className="h-44 bg-gray-200 relative overflow-hidden flex items-center justify-center">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/city-map.png')] opacity-10 grayscale"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
         <button className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-[11px] font-black text-gray-900 z-10 hover:scale-105 transition-all active:scale-95 border border-white/50 uppercase tracking-widest">
            <MapPin size={14} className="text-red-500" fill="currentColor" /> 地图找店
         </button>
      </div>

      {/* Store List */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
         <div className="flex items-center justify-between px-1">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                {searchTerm ? 'Search Results' : 'Nearby Stores'}
            </span>
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                Count: {filteredStores.length}
            </span>
         </div>
         
         {filteredStores.length > 0 ? filteredStores.map((store, idx) => (
            <div 
              key={store.id} 
              onClick={() => store.status === 'OPEN' && onSelect(store)}
              className={`bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-4 duration-500`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
                <div className="flex gap-5">
                    {/* Small Refined Image Preview */}
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-inner ring-1 ring-black/5">
                       <img src={store.image} className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-110 transition-transform duration-700" alt={store.name} />
                       {store.status === 'CLOSED' && (
                           <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-[1px]">
                               Closed
                           </div>
                       )}
                    </div>
                    
                    {/* Store Info */}
                    <div className="flex-1 flex flex-col min-w-0">
                       <div className="flex justify-between items-start mb-1">
                          <h3 className="font-black text-gray-900 text-lg leading-tight truncate tracking-tight italic">{store.name}</h3>
                          <div className="flex items-center gap-1 flex-shrink-0 ml-3 text-[10px] font-black text-gray-400">
                             <Navigation size={10} />
                             {store.distance}
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-1.5 mb-3 text-gray-400">
                          <MapPin size={10} className="flex-shrink-0" />
                          <p className="text-[11px] font-bold truncate tracking-tight">{store.address}</p>
                       </div>

                       <div className="flex gap-2 flex-wrap">
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${store.status === 'OPEN' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-400'}`}>
                             {store.status === 'OPEN' ? (
                                <>
                                  <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                                  营业中
                                </>
                             ) : '休息中'}
                          </div>
                          {store.tags.map(tag => (
                             <span key={tag} className="text-[9px] font-black uppercase tracking-widest bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full border border-gray-100">
                                {tag}
                             </span>
                          ))}
                       </div>
                    </div>
                </div>

                {/* Prominent CTA Actions */}
                <div className="mt-6 flex items-center gap-4 border-t border-gray-50 pt-5">
                   <button 
                     onClick={(e) => { e.stopPropagation(); /* 导航逻辑 */ }}
                     className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gray-50 text-[11px] font-black text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
                   >
                       <Navigation size={14} strokeWidth={2.5} /> 导航到店
                   </button>
                   <button 
                     disabled={store.status !== 'OPEN'}
                     className={`flex-[1.8] flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[11px] font-black shadow-lg transition-all ${
                         store.status === 'OPEN' 
                         ? 'bg-gray-900 text-[#FDE047] shadow-gray-200 hover:bg-black active:scale-[0.98]' 
                         : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                     }`}
                   >
                       <ShoppingBag size={14} strokeWidth={3} /> 
                       {store.status === 'OPEN' ? '立即点单' : '休息中'}
                   </button>
                </div>
            </div>
         )) : (
             <div className="flex flex-col items-center justify-center py-24 text-gray-300 animate-in fade-in duration-700">
                 <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-6 shadow-sm border border-gray-50">
                    <Search size={32} className="text-gray-100" />
                 </div>
                 <h4 className="font-black text-gray-900 text-sm mb-1 uppercase tracking-widest italic">No Stores Found</h4>
                 <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest leading-loose">
                    Try searching for a different location <br/> or adjust your search terms.
                 </p>
             </div>
         )}

         {/* Bottom Space */}
         <div className="h-10"></div>
      </div>
    </div>
  );
};
