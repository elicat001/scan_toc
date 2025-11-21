
import React, { useEffect, useState } from 'react';
import { Order, OrderStatus } from '../types';
import { ChevronRight, Search, X } from 'lucide-react';
import { api } from '../services/api';

interface OrdersProps {
  onSelectOrder: (order: Order) => void;
  onOrderAgain?: (order: Order) => void;
}

export const OrdersView: React.FC<OrdersProps> = ({ onSelectOrder, onOrderAgain }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  useEffect(() => {
    api.getOrders().then(setOrders);
  }, []);

  const handleOrderAgainClick = async (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    if (onOrderAgain) {
        setReorderingId(order.id);
        // Simulate brief loading state
        await new Promise(r => setTimeout(r, 500));
        onOrderAgain(order);
        setReorderingId(null);
    }
  };

  // Filter orders based on Search Query
  // Note: Tab filtering is visual-only in this demo as mock data types don't perfectly map 1:1 to tabs yet, 
  // but search applies to all.
  const filteredOrders = orders.filter(order => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = order.id.toLowerCase().includes(query) || 
                            order.storeName.toLowerCase().includes(query);
      
      // Optional: Implement tab filtering if needed, currently sticking to search as requested
      // const matchesTab = activeTab === 'ALL' || ... 
      
      return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-24 flex flex-col">
      {/* Sticky Header Section (Title + Search + Tabs) */}
      <div className="bg-white sticky top-0 z-30 shadow-sm">
        {/* Title & Search */}
        <div className="px-4 pt-4 pb-2">
            <div className="text-center font-bold text-lg mb-4">我的订单</div>
            
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="搜索订单号 / 门店名称"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-100 text-sm py-2 pl-9 pr-8 rounded-full outline-none focus:ring-2 focus:ring-[#FDE047]/50 transition-all placeholder:text-gray-400"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-around text-sm text-gray-500 pt-2 border-t border-gray-50 mt-2">
            {['全部', '堂食', '配送', '快递'].map((tab) => {
            const isActive = (activeTab === 'ALL' && tab === '全部') || activeTab === tab;
            return (
                <div 
                key={tab}
                onClick={() => setActiveTab(tab === '全部' ? 'ALL' : tab)}
                className={`pb-3 px-4 relative cursor-pointer transition-colors ${isActive ? 'text-gray-900 font-bold' : 'text-gray-500'}`}
                >
                {tab}
                {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#FDE047] rounded-full"></div>}
                </div>
            );
            })}
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        {filteredOrders.length > 0 ? filteredOrders.map((order) => (
          <div 
            key={order.id} 
            onClick={() => onSelectOrder(order)}
            className="bg-white rounded-xl p-4 shadow-sm active:scale-[0.99] transition-transform duration-100 cursor-pointer"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                 <span className="bg-[#FEF3C7] text-[#B45309] text-[10px] px-1.5 py-0.5 rounded font-medium border border-[#FDE68A]">
                   {order.type === 'Dine In' ? '堂食' : order.type === 'Pick Up' ? '自取' : '配送'}
                 </span>
                 <span className="font-bold text-gray-800 text-sm flex items-center">
                   {order.storeName} <ChevronRight size={14} className="text-gray-400 ml-0.5" />
                 </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                 <span className="text-xs text-gray-500">{order.status}</span>
                 {order.status === OrderStatus.PAID && <ChevronRight size={14} />}
              </div>
            </div>
            
            <div className="flex justify-between items-baseline mb-3">
               <span className="text-2xl font-bold text-gray-900/10 font-mono tracking-tighter">{order.id}</span>
               <span className="text-[10px] text-gray-400">{order.createTime}</span>
            </div>

            {/* Items Scroll */}
            <div className="flex gap-3 mb-4 overflow-x-auto no-scrollbar pb-1">
               {order.items.map((item, idx) => (
                 <div key={idx} className="relative flex-shrink-0">
                    <img src={item.image} className="w-14 h-14 rounded-lg object-cover bg-gray-100 border border-gray-100" />
                    {item.count > 1 && (
                        <div className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[9px] px-1.5 rounded-full border border-white">
                            x{item.count}
                        </div>
                    )}
                 </div>
               ))}
            </div>

            <div className="flex justify-between items-center border-t border-gray-50 pt-3">
               <div className="text-xs text-gray-400">
                  共 {order.items.reduce((a, b) => a + b.count, 0)} 件商品
               </div>
               <div className="flex items-baseline gap-1">
                  <span className="text-xs text-gray-900 font-medium">实付</span>
                  <span className="font-bold text-lg text-gray-900">¥{order.totalAmount.toFixed(2)}</span>
               </div>
            </div>
            
            {/* Action Buttons for Completed Orders */}
            <div className="mt-3 pt-2 flex justify-end gap-2">
                <button onClick={(e) => e.stopPropagation()} className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600">开发票</button>
                <button 
                  onClick={(e) => handleOrderAgainClick(e, order)} 
                  className="px-3 py-1.5 rounded-full border border-[#FDE047] bg-[#fffbe6] text-xs font-bold text-gray-800 flex items-center gap-1 min-w-[80px] justify-center"
                  disabled={reorderingId === order.id}
                >
                  {reorderingId === order.id ? (
                      <div className="w-3 h-3 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                      "再来一单"
                  )}
                </button>
            </div>
          </div>
        )) : (
           <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-sm">
                  {searchQuery ? '未找到相关订单' : '暂无订单'}
              </p>
           </div>
        )}
      </div>
    </div>
  );
};
