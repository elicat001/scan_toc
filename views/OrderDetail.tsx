
import React, { useState, useEffect, useMemo } from 'react';
import { Phone, ChefHat, Bike, CheckCircle, Package, Timer, ChevronRight, Copy, Share2, Info, MapPin, Coffee, Search, Loader2 } from 'lucide-react';
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
  const [simulationProgress, setSimulationProgress] = useState(35); // Initial progress for demo

  // Status-based polling/simulation effect
  useEffect(() => {
    setIsLoaded(true);
    
    // Simulate queue number "finding" effect
    const queueTimer = setTimeout(() => setShowQueueNo(true), 800);

    let timer: number | undefined;
    let simulationTimer: number | undefined;

    if (order.status === OrderStatus.PENDING) {
      timer = window.setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    // Progress simulation for Preparing and Delivering
    if (order.status === OrderStatus.PREPARING || order.status === OrderStatus.DELIVERING) {
        simulationTimer = window.setInterval(() => {
            setSimulationProgress(prev => {
                if (prev >= 98) return 98; // Stay near 100 but don't finish automatically
                return prev + (Math.random() * 0.5);
            });
        }, 1000);
    }

    return () => {
      clearTimeout(queueTimer);
      if (timer) clearInterval(timer);
      if (simulationTimer) clearInterval(simulationTimer);
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

  const preparingStepText = useMemo(() => {
      if (simulationProgress < 30) return "主厨正在备餐";
      if (simulationProgress < 60) return "正在恒温制作";
      if (simulationProgress < 85) return "正在进行装盘";
      return "正在打包中";
  }, [simulationProgress]);

  const renderStatusSimulation = () => {
    if (order.status === OrderStatus.PREPARING) {
      return (
        <div className="mt-8 px-2 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
            <div className="relative w-full h-12 flex items-center justify-center mb-4 px-2">
                {/* Track */}
                <div className="absolute inset-x-0 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    {/* Animated Progress */}
                    <div 
                        className="h-full bg-white/70 rounded-full relative transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        style={{ width: `${simulationProgress}%` }}
                    >
                        <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-white animate-shimmer"></div>
                    </div>
                </div>
                {/* Moving Chef Indicator */}
                <div 
                    className="absolute -translate-y-7 transition-all duration-1000 ease-linear flex flex-col items-center"
                    style={{ left: `${Math.min(92, Math.max(8, simulationProgress))}%` }}
                >
                    <div className="bg-white p-2.5 rounded-full shadow-xl mb-1.5 animate-bounce-slow">
                        <ChefHat size={20} className="text-[#1D4ED8]" />
                    </div>
                    <div className="whitespace-nowrap flex flex-col items-center">
                        <span className="text-[11px] font-black bg-white text-[#1D4ED8] px-2 py-0.5 rounded-full shadow-sm mb-1">{preparingStepText}</span>
                        <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{Math.round(simulationProgress)}%</span>
                    </div>
                </div>
            </div>
            
            {/* Step Milestones */}
            <div className="w-full flex justify-between px-2 mt-4 text-[9px] font-black uppercase tracking-widest text-white/40">
                <span className={simulationProgress >= 10 ? 'text-white' : ''}>备餐</span>
                <span className={simulationProgress >= 50 ? 'text-white' : ''}>制作</span>
                <span className={simulationProgress >= 80 ? 'text-white' : ''}>打包</span>
            </div>
        </div>
      );
    }

    if (order.status === OrderStatus.DELIVERING) {
      return (
        <div className="mt-8 px-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 relative overflow-hidden shadow-inner">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-[#15803D]/20">
                            <Bike size={22} className="text-[#15803D] animate-wiggle" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-tighter opacity-50 mb-0.5">配送骑手</div>
                            <div className="text-sm font-black">李师傅 (138****8888)</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-tighter opacity-50 mb-0.5">预计送达</div>
                        <div className="text-sm font-black text-[#FDE047]">12:45</div>
                    </div>
                </div>

                {/* Map Simulation Path */}
                <div className="relative h-2.5 mb-2 px-1">
                    {/* Path Track */}
                    <div className="absolute inset-x-0 h-1 top-1/2 -translate-y-1/2 bg-white/10 rounded-full"></div>
                    
                    {/* Traveled Path */}
                    <div 
                        className="absolute left-0 h-1 top-1/2 -translate-y-1/2 bg-[#FDE047] rounded-full transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(253,224,71,0.6)]"
                        style={{ width: `${simulationProgress}%` }}
                    ></div>
                    
                    {/* Start Marker */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full border border-gray-300"></div>
                    
                    {/* Moving Bike Marker */}
                    <div 
                        className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear z-10"
                        style={{ left: `${simulationProgress}%` }}
                    >
                        <div className="w-6 h-6 -ml-3 bg-white rounded-full border-2 border-[#15803D] shadow-2xl flex items-center justify-center animate-pulse">
                            <div className="w-2 h-2 bg-[#15803D] rounded-full"></div>
                        </div>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#15803D] text-white text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap font-black shadow-sm">
                            距离 1.2km
                        </div>
                    </div>
                    
                    {/* End Marker */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-white/20 rounded-full border-2 border-dashed border-white/40 flex items-center justify-center">
                        <MapPin size={10} className="text-white" />
                    </div>
                </div>

                <div className="flex justify-between text-[8px] font-black opacity-30 uppercase tracking-[0.2em] mt-4">
                    <span>棠小一</span>
                    <span>正在飞奔中</span>
                    <span>您的位置</span>
                </div>
            </div>
        </div>
      );
    }

    if (order.status === OrderStatus.PAID) {
      return (
        <div className="mt-8 px-2 flex flex-col items-center">
           <div className="w-full h-1.5 bg-white/10 rounded-full relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-white rounded-full animate-progress-flow">
                <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-white/50 animate-shimmer"></div>
              </div>
           </div>
           <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-white/60 uppercase tracking-widest animate-pulse">
              <Loader2 size={12} className="animate-spin" /> 正在为您寻找最优派单路径...
           </div>
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
                  <span className="text-[10px] opacity-60 font-bold uppercase tracking-wider">订单号.</span>
                  <span className="text-[10px] font-black font-mono">{order.id}</span>
                  <Copy size={10} className="opacity-40 hover:opacity-100 cursor-pointer" />
              </div>
            </div>
            
            <div className={`transition-all duration-1000 ${showQueueNo ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
              {order.queueNo && (
                <div className="bg-white/20 backdrop-blur-xl px-5 py-2.5 rounded-[1.5rem] border border-white/20 shadow-lg text-center">
                  <div className="text-[10px] uppercase font-black tracking-[0.2em] opacity-50 mb-0.5">取餐号</div>
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
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">支付截止倒计时</span>
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
        rightElement={<button className="p-2 opacity-50 hover:opacity-100"><Share2 size={20}/></button>}
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
                           <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: statusTheme.accent }}></div>
                           <h3 className="text-xl font-black text-gray-900 tracking-tight">{order.storeName}</h3>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold ml-3.5 uppercase tracking-widest">精品烘焙与咖啡店</p>
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
                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.specSnapshot || '标准规格'}</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[8px] font-black text-gray-300 uppercase">数量</span>
                                        <span className="text-sm font-black bg-gray-100 px-2 py-0.5 rounded-lg text-gray-900">x{item.count}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Section with wavy top */}
                <div className="px-6 py-8 bg-gray-50/80 border-t border-dashed border-gray-100 relative">
                    <div className="absolute top-0 inset-x-0 h-2 -translate-y-full opacity-20">
                        <div className="w-full h-full flex gap-1 justify-center">
                            {Array.from({length: 15}).map((_, i) => <div key={i} className="w-4 h-4 bg-gray-200 rounded-full -mt-2"></div>)}
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-widest">
                            <span>小计金额</span>
                            <span>¥{order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-widest">
                            <span>优惠活动</span>
                            <span className="text-red-500">-¥{order.discountAmount.toFixed(2)}</span>
                        </div>
                        {order.type === 'Delivery' && (
                             <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-widest">
                                <span>配送费</span>
                                <span>¥0.00</span>
                             </div>
                        )}
                    </div>
                    
                    <div className="flex justify-between items-end pt-4 border-t border-gray-200">
                        <div>
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">实付合计</span>
                           <div className="flex items-baseline gap-1">
                               <span className="text-xs font-black text-gray-900">人民币</span>
                               <span className="text-3xl font-black text-gray-900 tracking-tighter italic">¥{order.payAmount.toFixed(2)}</span>
                           </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex gap-1 mb-1">
                                <div className="w-3 h-3 bg-[#FDE047] rounded-full flex items-center justify-center text-gray-900 text-[8px] font-black">章</div>
                                <span className="text-[9px] font-black text-gray-900">+{Math.ceil(order.payAmount / 10)} 积分</span>
                            </div>
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.15em]">交易已核实</span>
                        </div>
                    </div>
                </div>

                {/* Ticket Wave Bottom */}
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
                        <Coffee size={14} className="text-[#D97706]" /> 订单信息
                    </h3>
                    <div className="space-y-5">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">履行方式</span>
                            <span className="text-xs text-gray-900 font-black">{order.type === 'Pick Up' ? '门店自取' : order.type === 'Dine In' ? '店内堂食' : order.type === 'Scan Order' ? '扫码堂食' : '外卖配送'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">商家电话</span>
                            <span className="text-xs text-gray-900 font-black">400-820-8820</span>
                        </div>
                        <div className="flex justify-between items-center group">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">订单号</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-gray-900 font-black tracking-tighter">{order.id}</span>
                                <button className="text-gray-300 hover:text-gray-900 transition-colors"><Copy size={12}/></button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">下单时间</span>
                            <span className="text-xs text-gray-900 font-black">{order.createTime}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
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
        @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
        }
        .animate-wiggle {
            animation: wiggle 0.5s ease-in-out infinite;
        }
        @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
            animation: bounce-slow 2s infinite ease-in-out;
        }
        @keyframes progress-flow {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
        }
        .animate-progress-flow {
            animation: progress-flow 3s infinite linear;
        }
      `}} />
    </div>
  );
};
