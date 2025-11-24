
import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, ChefHat, Bike, CheckCircle, Package, Timer } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { Header } from '../components/Header';

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
  onOrderAgain?: () => void;
}

export const OrderDetailView: React.FC<OrderDetailProps> = ({ order, onBack, onOrderAgain }) => {
  const [countdown, setCountdown] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    if (order.status === OrderStatus.PENDING) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [order.status]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderStatusHeader = () => {
    // 1. Pending Payment State
    if (order.status === OrderStatus.PENDING) {
      return (
        <div className="bg-white p-6 mb-3">
          <div className="flex flex-col items-center text-center">
            <div className="text-[#D97706] mb-2">
              <Timer size={48} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">等待支付</h1>
            <p className="text-sm text-[#D97706] font-bold mb-4 flex items-center gap-1 bg-[#FEF3C7] px-3 py-1 rounded-full">
               支付剩余时间 {formatTime(countdown)}
            </p>
            <div className="w-full flex gap-3 mt-2">
               <button className="flex-1 bg-white border border-gray-200 py-3 rounded-xl font-bold text-sm text-gray-700">取消订单</button>
               <button className="flex-1 bg-[#FDE047] py-3 rounded-xl font-bold text-sm text-gray-900 shadow-sm hover:bg-yellow-400">立即支付</button>
            </div>
          </div>
        </div>
      );
    }

    // 2. Active States (Preparing / Delivering / Completed)
    const steps = [
        { status: OrderStatus.PAID, label: '已支付', icon: CheckCircle },
        { status: OrderStatus.PREPARING, label: '制作中', icon: ChefHat },
        { status: order.type === 'Delivery' ? OrderStatus.DELIVERING : '待取餐', label: order.type === 'Delivery' ? '配送中' : '待取餐', icon: order.type === 'Delivery' ? Bike : Package },
        { status: OrderStatus.COMPLETED, label: '已完成', icon: CheckCircle },
    ];

    // Helper to determine active step index
    let activeIndex = 0;
    if (order.status === OrderStatus.PAID) activeIndex = 0;
    if (order.status === OrderStatus.PREPARING) activeIndex = 1;
    if (order.status === OrderStatus.DELIVERING) activeIndex = 2;
    if (order.status === OrderStatus.COMPLETED) activeIndex = 3;

    // If cancelled, show simple cancelled state
    if (order.status === OrderStatus.CANCELLED) {
        return (
            <div className="bg-white p-6 mb-3">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">已取消</h1>
                <p className="text-sm text-gray-500">订单已取消，期待您的再次光临</p>
                <div className="mt-6">
                    <button onClick={onOrderAgain} className="w-full bg-[#FDE047] py-3 rounded-xl font-bold text-sm text-gray-900 shadow-sm">再来一单</button>
                </div>
            </div>
        );
    }

    return (
      <div className="bg-white p-6 mb-3 pb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{order.status}</h1>
        <p className="text-sm text-gray-500 mb-8">
            {order.status === OrderStatus.COMPLETED ? '感谢您的光临，期待再次相遇' : '美味正在制作中，请耐心等待'}
        </p>

        {/* Progress Stepper */}
        <div className="relative flex justify-between items-start px-2">
            {/* Connecting Line */}
            <div className="absolute top-4 left-4 right-4 h-[2px] bg-gray-100 -z-0">
                <div 
                    className="h-full bg-[#FDE047] transition-all duration-500" 
                    style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                ></div>
            </div>

            {steps.map((step, idx) => {
                const isActive = idx <= activeIndex;
                const isCurrent = idx === activeIndex;
                const Icon = step.icon;
                
                return (
                    <div key={idx} className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? 'bg-[#FDE047] border-[#FDE047] text-gray-900' : 'bg-white border-gray-200 text-gray-300'}`}>
                            <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] mt-2 font-medium ${isCurrent ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>

        {/* Map Simulation for Delivering State */}
        {order.status === OrderStatus.DELIVERING && order.type === 'Delivery' && (
            <div className="mt-8 rounded-xl overflow-hidden border border-gray-100 relative h-40 bg-gray-50 shadow-inner">
                 <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/city-map.png')] grayscale"></div>
                 {/* Route Line Simulation */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none">
                     <path d="M 50 120 Q 150 80 300 50" stroke="#FDE047" strokeWidth="4" fill="none" strokeDasharray="8 4" className="animate-pulse" />
                 </svg>
                 
                 {/* Rider Icon */}
                 <div className="absolute top-[40px] left-[200px] bg-gray-900 text-white p-2 rounded-full shadow-lg z-10 animate-bounce">
                     <Bike size={20} />
                 </div>
                 <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm flex justify-between items-center">
                     <div>
                         <div className="text-xs font-bold text-gray-900">骑手正在配送中</div>
                         <div className="text-[10px] text-gray-500">预计 12:45 送达</div>
                     </div>
                     <div className="flex gap-2">
                        <button className="p-1.5 bg-gray-100 rounded-full text-gray-700"><Phone size={14} /></button>
                     </div>
                 </div>
            </div>
        )}
        
        {/* Simple Progress Bar for Preparing State */}
        {order.status === OrderStatus.PREPARING && (
            <div className="mt-6 bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    <ChefHat size={20} />
                 </div>
                 <div className="flex-1">
                     <div className="flex justify-between text-xs mb-1">
                         <span className="font-bold text-gray-700">正在精心制作中</span>
                         <span className="text-blue-500">预计 8分钟</span>
                     </div>
                     <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 w-[60%] rounded-full animate-pulse"></div>
                     </div>
                 </div>
            </div>
        )}

        <div className="mt-6 flex gap-3">
            <button className="flex-1 bg-white border border-gray-200 py-2 rounded-lg font-bold text-sm text-gray-700 shadow-sm">联系门店</button>
            <button onClick={onOrderAgain} className="flex-1 bg-[#FDE047] py-2 rounded-lg font-bold text-sm text-gray-900 shadow-sm">再来一单</button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      <Header title="订单详情" onBack={onBack} />
      <div className="flex-1 overflow-y-auto">
        {renderStatusHeader()}
        
        {/* Order Items List */}
        <div className="bg-white p-4 mb-3">
            <h3 className="font-bold text-sm text-gray-900 mb-3">商品信息</h3>
            <div className="space-y-4">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                        <img src={item.image} className="w-16 h-16 rounded-lg object-cover bg-gray-100" alt={item.name} />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                                <span className="font-bold text-sm">¥{item.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-end mt-1">
                                <span className="text-xs text-gray-500">{item.specSnapshot || '默认规格'}</span>
                                <span className="text-sm text-gray-900">x{item.count}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="border-t border-gray-50 mt-4 pt-3 flex justify-between items-center">
                <span className="text-sm text-gray-500">合计</span>
                <span className="font-bold text-lg text-gray-900">¥{order.totalAmount.toFixed(2)}</span>
            </div>
        </div>

        {/* Order Info */}
        <div className="bg-white p-4 mb-safe">
            <h3 className="font-bold text-sm text-gray-900 mb-3">订单信息</h3>
            <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                    <span className="text-gray-500">订单编号</span>
                    <span className="text-gray-900">{order.id}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">下单时间</span>
                    <span className="text-gray-900">{order.createTime}</span>
                </div>
                    <div className="flex justify-between">
                    <span className="text-gray-500">支付方式</span>
                    <span className="text-gray-900">微信支付</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
