
import React, { useEffect, useState, useMemo } from 'react';
import { Order, OrderStatus } from '../types';
import { ChevronRight, Search, Filter, Clock, Package, X, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface OrdersProps {
  onSelectOrder: (order: Order) => void;
  onOrderAgain?: (order: Order) => void;
}

export const OrdersView: React.FC<OrdersProps> = ({ onSelectOrder, onOrderAgain }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 顶层 Tab 状态
  const [mainTab, setMainTab] = useState('ORDER'); // ORDER, MEMBER, GROUP
  
  // 筛选矩阵状态
  const [statusFilter, setStatusFilter] = useState('全部');
  const [timeFilter, setTimeFilter] = useState('全部');
  const [typeFilter, setTypeFilter] = useState('全部');
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.getOrders().then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const handleOrderAgainClick = async (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    if (onOrderAgain) {
        setReorderingId(order.id);
        await new Promise(r => setTimeout(r, 600));
        onOrderAgain(order);
        setReorderingId(null);
    }
  };

  // 根据多维条件过滤订单
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 搜索过滤
      const matchesSearch = !searchQuery || 
        order.id.includes(searchQuery) || 
        order.storeName.includes(searchQuery);
      
      // 类型过滤映射
      const matchesType = typeFilter === '全部' || 
        (typeFilter === '堂食' && (order.type === 'Dine In' || order.type === 'Scan Order')) ||
        (typeFilter === '自取' && order.type === 'Pick Up') ||
        (typeFilter === '配送' && order.type === 'Delivery');

      // 状态过滤映射
      const matchesStatus = statusFilter === '全部' ||
        (statusFilter === '已支付' && order.status === OrderStatus.PAID) ||
        (statusFilter === '已取消' && order.status === OrderStatus.CANCELLED);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [orders, searchQuery, typeFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 flex flex-col">
      {/* Header Section */}
      <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-50">
        {/* Title Bar */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
            <div className="w-10"></div>
            <h1 className="text-lg font-black text-gray-900 tracking-tight">我的订单</h1>
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
            >
                <Search size={20} />
            </button>
        </div>

        {/* Top Level Navigation Tabs */}
        <div className="flex justify-center gap-12 mt-4 px-4">
            {[
                { id: 'ORDER', label: '点单' },
                { id: 'MEMBER', label: '会员' },
                { id: 'GROUP', label: '拼团' }
            ].map((tab) => {
                const isActive = mainTab === tab.id;
                return (
                    <button 
                        key={tab.id}
                        onClick={() => setMainTab(tab.id)}
                        className={`pb-3 relative flex flex-col items-center transition-all ${isActive ? 'text-gray-900' : 'text-gray-300'}`}
                    >
                        <span className={`text-base font-black tracking-tight ${isActive ? 'scale-110' : 'scale-100'}`}>
                            {tab.label}
                        </span>
                        {isActive && (
                            <div className="absolute -bottom-0.5 w-6 h-1 bg-gray-900 rounded-full animate-in fade-in zoom-in duration-300"></div>
                        )}
                    </button>
                );
            })}
        </div>

        {/* Dynamic Search Bar */}
        {showSearch && (
            <div className="px-5 py-3 animate-in slide-in-from-top-2 duration-300">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                        type="text" 
                        placeholder="搜索订单号或门店名称"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-100 rounded-full py-2.5 pl-9 pr-10 text-xs font-bold outline-none ring-2 ring-transparent focus:ring-yellow-400/30 transition-all"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>
        )}

        {/* Multidimensional Filter Matrix */}
        <div className="px-5 py-5 space-y-4 border-t border-gray-50">
            {/* Row 1: Status */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 w-14 flex-shrink-0 text-gray-300">
                    <Filter size={14} />
                    <span className="text-[11px] font-black uppercase tracking-widest">状态</span>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {['全部', '已支付', '已取消'].map(s => (
                        <button 
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-black transition-all active:scale-95 ${statusFilter === s ? 'bg-black text-white shadow-lg shadow-black/20' : 'bg-gray-50 text-gray-400'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Row 2: Time */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 w-14 flex-shrink-0 text-gray-300">
                    <Clock size={14} />
                    <span className="text-[11px] font-black uppercase tracking-widest">时间</span>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {['全部', '今日', '近一周', '近一月'].map(t => (
                        <button 
                            key={t}
                            onClick={() => setTimeFilter(t)}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-black transition-all active:scale-95 ${timeFilter === t ? 'bg-[#FDE047] text-gray-900 shadow-lg shadow-yellow-200' : 'bg-gray-50 text-gray-400'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Row 3: Type */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 w-14 flex-shrink-0 text-gray-300">
                    <Package size={14} />
                    <span className="text-[11px] font-black uppercase tracking-widest">类型</span>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {['全部', '堂食', '自取', '配送', '快递'].map(t => (
                        <button 
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-black transition-all active:scale-95 ${typeFilter === t ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]' : 'bg-gray-50 text-gray-400'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Orders List Area */}
      <div className="p-5 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="animate-spin text-gray-300 mb-2" size={32} />
                <span className="text-xs font-bold text-gray-400">正在获取订单...</span>
            </div>
        ) : filteredOrders.length > 0 ? filteredOrders.map((order, idx) => (
          <div 
            key={order.id} 
            onClick={() => onSelectOrder(order)}
            className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 active:scale-[0.98] transition-all duration-200 cursor-pointer animate-in fade-in slide-in-from-bottom-3"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                 <div>
                    <h3 className="font-black text-gray-900 text-sm italic tracking-tight flex items-center">
                        {order.storeName} <ChevronRight size={14} className="text-gray-300 ml-1" />
                    </h3>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.createTime}</span>
                 </div>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${order.status === OrderStatus.PAID ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {order.status}
              </span>
            </div>
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar mb-4 pb-1">
               {order.items.map((item, i) => (
                 <div key={i} className="relative flex-shrink-0">
                    <img src={item.image} className="w-16 h-16 rounded-2xl object-cover bg-gray-50 border border-gray-50 shadow-inner" alt={item.name} />
                    {item.count > 1 && (
                        <div className="absolute -top-1 -right-1 bg-gray-900 text-[#FDE047] text-[8px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                            {item.count}
                        </div>
                    )}
                 </div>
               ))}
            </div>

            <div className="flex justify-between items-end border-t border-gray-50 pt-4">
               <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Order Total</span>
                  <div className="flex items-baseline gap-1">
                      <span className="text-xs font-black text-gray-900">¥</span>
                      <span className="text-xl font-black text-gray-900 tracking-tighter">{order.totalAmount.toFixed(2)}</span>
                  </div>
               </div>
               
               <div className="flex gap-2">
                    <button onClick={(e) => e.stopPropagation()} className="px-4 py-2 rounded-xl border border-gray-100 text-[11px] font-black text-gray-500 hover:bg-gray-50 transition-colors">
                        详情
                    </button>
                    <button 
                        onClick={(e) => handleOrderAgainClick(e, order)} 
                        disabled={reorderingId === order.id}
                        className="px-4 py-2 rounded-xl bg-gray-900 text-[#FDE047] text-[11px] font-black shadow-lg shadow-gray-200 active:scale-95 transition-all flex items-center justify-center min-w-[80px]"
                    >
                        {reorderingId === order.id ? <Loader2 className="animate-spin" size={12} /> : "再来一单"}
                    </button>
               </div>
            </div>
          </div>
        )) : (
           <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-sm mb-6 border border-gray-50">
                  <Search size={32} className="text-gray-200" />
              </div>
              <h4 className="font-black text-gray-900 text-sm mb-1 uppercase tracking-widest italic">No Records Found</h4>
              <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest leading-loose">
                  Try adjusting your filters <br/> or searching for another term.
              </p>
              {(statusFilter !== '全部' || typeFilter !== '全部' || timeFilter !== '全部' || searchQuery) && (
                  <button 
                    onClick={() => { setStatusFilter('全部'); setTypeFilter('全部'); setTimeFilter('全部'); setSearchQuery(''); }}
                    className="mt-6 text-[10px] font-black text-yellow-600 bg-yellow-50 px-5 py-2 rounded-full border border-yellow-100 hover:bg-yellow-100 transition-colors uppercase tracking-widest"
                  >
                      Reset Filters
                  </button>
              )}
           </div>
        )}
      </div>
    </div>
  );
};
