
import React, { useState } from 'react';
import { ChevronLeft, Ticket, Coffee, ShoppingBag, ChevronRight } from 'lucide-react';

interface PointsMallProps {
  onBack: () => void;
  onHistory: () => void;
}

const MOCK_ITEMS = [
    { id: 1, name: '5元无门槛优惠券', points: 500, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200', type: 'COUPON' },
    { id: 2, name: '免费拿铁兑换券', points: 800, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=200', type: 'DRINK' },
    { id: 3, name: '棠小一限定帆布袋', points: 2000, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200', type: 'GIFT' },
    { id: 4, name: '全场8.8折券', points: 300, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200', type: 'COUPON' },
    { id: 5, name: '不锈钢随行杯', points: 2500, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200', type: 'GIFT' },
    { id: 6, name: '甜品买一送一券', points: 600, image: 'https://images.unsplash.com/photo-1563729768640-d0910022eb09?w=200', type: 'COUPON' },
];

export const PointsMallView: React.FC<PointsMallProps> = ({ onBack, onHistory }) => {
  const [activeTab, setActiveTab] = useState('ALL');

  const filteredItems = activeTab === 'ALL' ? MOCK_ITEMS : MOCK_ITEMS.filter(i => {
      if (activeTab === 'COUPON') return i.type === 'COUPON';
      if (activeTab === 'GIFT') return i.type === 'GIFT' || i.type === 'DRINK';
      return true;
  });

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      {/* Header */}
      <div className="bg-[#FDE047] px-4 pt-4 pb-16 relative">
         <div className="flex items-center justify-between mb-6">
            <button onClick={onBack} className="p-1 -ml-1 rounded-full hover:bg-black/10"><ChevronLeft size={24} className="text-gray-900" /></button>
            <span className="font-bold text-lg text-gray-900">积分商城</span>
            <button onClick={onHistory} className="text-sm font-medium text-gray-800 flex items-center">
                兑换记录
            </button>
         </div>
         
         <div className="flex items-center justify-between px-2 cursor-pointer active:opacity-70 transition-opacity" onClick={onHistory}>
             <div className="flex flex-col">
                 <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-gray-700 mb-1">我的积分</span>
                    <ChevronRight size={14} className="text-gray-700 mb-1" />
                 </div>
                 <span className="text-4xl font-bold text-gray-900">19</span>
             </div>
             <button className="bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 border border-white/20" onClick={(e) => {e.stopPropagation()}}>如何获取积分?</button>
         </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 bg-[#F3F4F6] relative -top-8 rounded-t-3xl overflow-hidden flex flex-col px-4 pt-6">
          
          {/* Categories */}
          <div className="flex gap-4 mb-6 overflow-x-auto no-scrollbar">
              {['ALL', 'COUPON', 'GIFT'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-colors ${activeTab === tab ? 'bg-gray-900 text-[#FDE047]' : 'bg-white text-gray-500 shadow-sm'}`}
                  >
                      {tab === 'ALL' ? '全部商品' : tab === 'COUPON' ? '优惠券' : '好礼兑换'}
                  </button>
              ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-4 pb-10">
              {filteredItems.map(item => (
                  <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col">
                      <div className="h-32 bg-gray-100 relative">
                          <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                          <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded">
                              {item.type === 'COUPON' ? '虚拟券' : '实物'}
                          </div>
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                          <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-auto">{item.name}</h4>
                          <div className="mt-3 flex items-end justify-between">
                              <span className="text-[#D97706] font-bold text-sm">{item.points} <span className="text-[10px] text-gray-400 font-normal">积分</span></span>
                              <button className="bg-[#FDE047] text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full hover:bg-yellow-400 transition-colors">
                                  兑换
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
