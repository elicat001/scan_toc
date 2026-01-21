
import React, { useState, useEffect, useMemo } from 'react';
import { Phone, ChefHat, Bike, CheckCircle, Package, Timer, ChevronRight, Copy, Share2, Info, MapPin, Coffee, Search } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { Header } from '../components/Header';

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
  onOrderAgain?: () => void;
}

export const OrderDetailView: React.FC<OrderDetailProps> = ({ order: initialOrder, onBack, onOrderAgain }) => {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [countdown, setCountdown] = useState(900);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showQueueNo, setShowQueueNo] = useState(false);

  // Status-based polling/simulation effect
  useEffect(() => {
    setIsLoaded(true);
    
    // Simulate queue number "finding" effect
    const queueTimer = setTimeout(() => setShowQueueNo(true), 800);

    let timer: number | undefined;
    if (order.status === OrderStatus.PENDING) {
      timer = window.setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    return () => {
      clearTimeout(queueTimer);
      if (timer) clearInterval(timer);
    };
  }, [order.status]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const statusTheme = useMemo(() => {
    switch(order.status) {
      case OrderStatus.PAID: return { bg: 'bg-[#FEFCE8]', text: 'text-[#D97706]', iconColor: 'text-[#D97706]', accent: '#FDE047' };
      case OrderStatus.PREPARING: return { bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]', iconColor: 'text-[#1D4ED8]', accent: '#3B82F6' };
      case OrderStatus.DELIVERING: return { bg: 'bg-[#F0FDF4]', text: 'text-[#15803D]', iconColor: 'text-[#15803D]', accent: '#22C55E' };
      case OrderStatus.COMPLETED: return { bg: 'bg-gray-900', text: 'text-white', iconColor: 'text-[#FDE047]', accent: '#FDE047' };
      case OrderStatus.CANCELLED: return { bg: 'bg-gray-100', text: 'text-gray-500', iconColor: 'text-gray-400', accent: '#9CA3AF' };
      default: return { bg: 'bg-white', text: 'text-gray-900', iconColor: 'text-gray-400', accent: '#F3F4F6' };
    }
  }, [order.status]);

  const renderStatusSimulation = () => {
    if (order.status === OrderStatus.PREPARING) {
      return (
        <div className="mt-8 px-2 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
            <div className="relative w-full h-12 flex items-center justify-center mb-4">
                <div className="absolute inset-x-0 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white/60 w-3/4 rounded-full relative">
                        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white animate-shimmer"></div>
                    </div>
                </div>
                <div className="absolute left-[70%] -translate-y-6 transition-all duration-1000 flex flex-col items-center">
                    <div className="bg-white p-2 rounded-full shadow-lg mb-1 animate-bounce">
                        <ChefHat size={18} className="text-[#1D4ED8]" />
                    </div>
                    <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded text-white backdrop-blur-sm">正在精心制作中</span>
                </div>
            </div>
        </div>
      );
    }

    if (order.status === OrderStatus.DELIVERING) {
      return (
        <div className="mt-8 px-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                            <Bike size={18} className="text-[#15803D]" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase opacity-60">配送骑手</div>
                            <div className="text-xs font-bold">李师傅 (138****8888)</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-black uppercase opacity-60">预计送达</div>
                        <div className="text-xs font-bold">12:45</div>
                    </div>
                </div>
                {/* Map Simulation */}
                <div className="h-1 bg-white/10 rounded-full relative mb-1">
                    <div className="absolute left-0 top-0 bottom-0 bg-[#FDE047] w-1/2 rounded-full"></div>
                    <div className="absolute left-1/2 -top-1.5 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-[#15803D] shadow-sm flex items-center justify-center animate-pulse">
                        <div className="w-1.5 h-1.5 bg-[#15803D] rounded-full"></div>
                    </div>
                    <div className="absolute right-0 -top-1.5 w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                        <MapPin size={10} className="text-white" />
                    </div>
                </div>
                <div className="flex justify-between text-[8px] font-bold opacity-40 uppercase tracking-widest">
                    <span>店面</span>
                    <span>配送中</span>
                    <span>目的地</span>
                </div>
            </div>
        </div>
      );
    }

    if (order.status === OrderStatus.PAID) {
      return (
        <div className="mt-8 px-2 flex flex-col items-center">
           <div className="w-full h-1 bg-white/20 rounded-full relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1/4 bg-white rounded-full">
                <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/50 animate-shimmer"></div>
              </div>
           </div>
           <p className="text-[10px] font-black mt-3 opacity-60 uppercase tracking-widest flex items-center gap-2">
              <Search size={10} /> 正在为您寻找最优派单路径...
           </p>
        </div>
      );
    }

    return null;
  };

  const renderStatusHeader = () => {
    return (
      <div className={`transition-all duration-700 ${statusTheme.bg} ${statusTheme.text} px-6 pt-6 pb-12 rounded-b-[2.5rem] relative overflow-hidden`}>
        {/* Immersive Background Particles */}
        <div className="absolute top-[-20%] left-[-10%] w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-56 h-56 bg-white/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="animate-in slide-in-from-left-4 duration-500">
              <h1 className={`text-4xl font-black italic tracking-tighter transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                {order.status === OrderStatus.PENDING ? '待付款' : order.status}
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] opacity-60 font-bold uppercase tracking-wider">Order No.</span>
                  <span className="text-[10px] font-black font-mono">{order.id}</span>
                  <Copy size={10} className="opacity-40" />
              </div>
            </div>
            
            <div className={`transition-all duration-1000 ${showQueueNo ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
              {order.queueNo && (
                <div className="bg-white/20 backdrop-blur-xl px-5 py-2.5 rounded-[1.5rem] border border-white/20 shadow-lg text-center">
                  <div className="text-[10px] uppercase font-black tracking-[0.2em] opacity-50 mb-0.5">Queue</div>
                  <div className="text-3xl font-black font-mono tracking-tighter">{order.queueNo}</div>
                </div>
              )}
            </div>
          </div>

          {renderStatusSimulation()}

          {order.status === OrderStatus.PENDING && (
            <div className="mt-8 flex items-center gap-3 bg-black/10 w-fit px-5 py-2.5 rounded-full border border-white/10 animate-pulse">
               <Timer size={18} />
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Payment Deadline</span>
                  <span className="text-sm font-black font-mono tracking-wide">{formatTime(countdown)}</span>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans">
      <Header 
        title="订单详情" 
        onBack={onBack} 
        className={`${statusTheme.bg} border-none shadow-none transition-colors duration-500`}
        theme={order.status === OrderStatus.COMPLETED ? 'dark' : 'light'}
        rightElement={<button className="p-2 opacity-50"><Share2 size={20}/></button>}
      />
      
      <div className="flex-1 overflow-y-auto pb-safe no-scrollbar">
        {renderStatusHeader()}
        
        <div className="px-4 -mt-6 relative z-20 pb-10">
            {/* Electronic Receipt Container */}
            <div className="bg-white rounded-t-[2.5rem] shadow-2xl overflow-hidden transition-all duration-700 animate-in slide-in-from-bottom-8">
                
                {/* Store Header with Dynamic Accent */}
                <div className="p-6 border-b border-dashed border-gray-100 flex justify-between items-center bg-gradient-to-r from-transparent to-gray-50/50">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                           <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusTheme.accent }}></div>
                           <h3 className="text-xl font-black text-gray-900 tracking-tight">{order.storeName}</h3>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold ml-3.5 uppercase tracking-widest">High-End Bakery & Coffee</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 shadow-sm border border-gray-100 active:scale-90 transition-transform">
                            <Phone size={16} />
                        </button>
                        <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 shadow-sm border border-gray-100 active:scale-90 transition-transform">
                            <Info size={16} />
                        </button>
                    </div>
                </div>

                {/* Items Section */}
                <div className="p-6 space-y-6">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 group">
                            <div className="w-16 h-16 rounded-[1.25rem] overflow-hidden bg-gray-100 flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-gray-50">
                                <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-sm text-gray-900 truncate pr-2 tracking-tight">{item.name}</h4>
                                    <span className="font-bold text-sm text-gray-900">¥{item.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.specSnapshot || 'Signature Blend'}</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[8px] font-black text-gray-300 uppercase">Qty</span>
                                        <span className="text-sm font-black bg-gray-100 px-2 py-0.5 rounded-lg text-gray-900">x{item.count}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Section with wavy top */}
                <div className="px-6 py-8 bg-gray-50/80 border-t border-dashed border-gray-100 relative">
                    {/* Wavy decoration for internal section */}
                    <div className="absolute top-0 inset-x-0 h-2 -translate-y-full opacity-20">
                        <div className="w-full h-full flex gap-1 justify-center">
                            {Array.from({length: 15}).map((_, i) => <div key={i} className="w-4 h-4 bg-gray-200 rounded-full -mt-2"></div>)}
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span>¥{order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-widest">
                            <span>Promotions</span>
                            <span className="text-red-500">-¥{order.discountAmount.toFixed(2)}</span>
                        </div>
                        {order.type === 'Delivery' && (
                             <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-widest">
                                <span>Delivery Fee</span>
                                <span>¥0.00</span>
                             </div>
                        )}
                    </div>
                    
                    <div className="flex justify-between items-end pt-4 border-t border-gray-200">
                        <div>
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Total Paid</span>
                           <div className="flex items-baseline gap-1">
                               <span className="text-xs font-black text-gray-900">CNY</span>
                               <span className="text-3xl font-black text-gray-900 tracking-tighter italic">¥{order.payAmount.toFixed(2)}</span>
                           </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex gap-1 mb-1">
                                <div className="w-3 h-3 bg-[#FDE047] rounded-full flex items-center justify-center text-gray-900 text-[8px] font-black">章</div>
                                <span className="text-[9px] font-black text-gray-900">+3 Points Earned</span>
                            </div>
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.15em]">Transaction Verified</span>
                        </div>
                    </div>
                </div>

                {/* Ticket Wave Bottom - Real SVG wave for better aesthetic */}
                <div className="h-6 bg-gray-50/80 relative">
                    <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="absolute bottom-0 w-full h-4 fill-[#F3F4F6]">
                        <path d="M0,10 C5,0 10,0 15,10 C20,0 25,0 30,10 C35,0 40,0 45,10 C50,0 55,0 60,10 C65,0 70,0 75,10 C80,0 85,0 90,10 C95,0 100,0 100,10 L100,10 L0,10 Z"></path>
                    </svg>
                </div>
            </div>

            {/* Logistic/Detail Cards */}
            <div className="grid grid-cols-1 gap-4 mt-6">
                <div className="bg-white rounded-3xl p-6 shadow-xl animate-in slide-in-from-bottom-10 duration-500 delay-200">
                    <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
                        <Coffee size={14} className="text-[#D97706]" /> Order Protocol
                    </h3>
                    <div className="space-y-5">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Fulfillment</span>
                            <span className="text-xs text-gray-900 font-black">{order.type === 'Pick Up' ? '门店自取' : order.type === 'Dine In' ? '店内堂食' : order.type === 'Scan Order' ? '扫码堂食' : '外卖配送'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Merchant Phone</span>
                            <span className="text-xs text-gray-900 font-black">400-820-8820</span>
                        </div>
                        <div className="flex justify-between items-center group">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Order Hash</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-gray-900 font-black tracking-tighter">{order.id}</span>
                                <button className="text-gray-300 hover:text-gray-900 transition-colors"><Copy size={12}/></button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Timestamp</span>
                            <span className="text-xs text-gray-900 font-black">{order.createTime}</span>
                        </div>
                    </div>
                </div>

                {/* Dynamic Remark Card if present */}
                {order.remark && (
                    <div className="bg-[#FEFCE8] border border-[#FDE68A] rounded-3xl p-5 shadow-sm animate-in zoom-in duration-500 delay-300">
                        <div className="text-[10px] font-black text-[#D97706] uppercase tracking-widest mb-2">Customer Remark</div>
                        <p className="text-sm font-bold text-gray-900 italic">“{order.remark}”</p>
                    </div>
                )}
            </div>

            {/* Sticky Action Footer Simulation */}
            <div className="flex gap-4 mt-8 pb-10">
                <button 
                  onClick={onOrderAgain} 
                  className="flex-1 bg-white text-gray-900 font-black py-4 rounded-[1.5rem] shadow-xl border border-gray-100 text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    再来一单
                </button>
                <button className="flex-[1.2] bg-gray-900 text-[#FDE047] font-black py-4 rounded-[1.5rem] shadow-2xl text-sm active:scale-95 transition-all flex items-center justify-center gap-2">
                    <Share2 size={16} /> 分享美味
                </button>
            </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .animate-shimmer {
            animation: shimmer 1.5s infinite;
        }
        .animate-spin-slow {
            animation: spin 3s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};
