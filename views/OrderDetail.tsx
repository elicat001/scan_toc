
import React from 'react';
import { ChevronLeft, Phone, MessageSquare, ChevronRight } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
  onOrderAgain?: () => void;
}

export const OrderDetailView: React.FC<OrderDetailProps> = ({ order, onBack, onOrderAgain }) => {
  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
         <button onClick={onBack} className="p-1 -ml-1 rounded-full hover:bg-gray-100"><ChevronLeft size={24} /></button>
         <span className="font-bold text-lg text-gray-900">订单详情</span>
         <div className="w-8"></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-safe">
         {/* Status Area */}
         <div className="bg-white p-6 mb-3">
             <h1 className="text-2xl font-bold text-gray-900 mb-1">{order.status}</h1>
             <p className="text-sm text-gray-500">感谢您对棠小一的信任，期待再次光临</p>
             
             <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-white border border-gray-200 py-2 rounded-lg font-bold text-sm text-gray-700 shadow-sm">联系门店</button>
                <button onClick={onOrderAgain} className="flex-1 bg-[#FDE047] py-2 rounded-lg font-bold text-sm text-gray-900 shadow-sm">再来一单</button>
             </div>
         </div>

         {/* Order Items Card */}
         <div className="mx-3 bg-white rounded-xl overflow-hidden shadow-sm mb-3">
             <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                 <span className="font-bold text-gray-900 text-sm">{order.storeName}</span>
                 <div className="flex gap-3 text-gray-400">
                    <Phone size={18} />
                    <div className="w-[1px] h-4 bg-gray-200"></div>
                    <MessageSquare size={18} />
                 </div>
             </div>
             
             <div className="p-4 space-y-4">
                {order.items.map((item, idx) => (
                   <div key={idx} className="flex justify-between">
                      <div className="flex gap-3">
                         <img src={item.image} className="w-12 h-12 rounded bg-gray-100 object-cover" />
                         <div>
                            <div className="text-sm font-bold text-gray-900 mb-1">{item.name}</div>
                            <div className="text-xs text-gray-400">x{item.count}</div>
                         </div>
                      </div>
                      <div className="text-sm font-bold text-gray-900">¥{item.price.toFixed(2)}</div>
                   </div>
                ))}
             </div>

             <div className="p-4 border-t border-dashed border-gray-100 space-y-2">
                <div className="flex justify-between text-xs">
                   <span className="text-gray-500">商品总价</span>
                   <span className="text-gray-900">¥{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-gray-500">优惠金额</span>
                   <span className="text-gray-900">-¥{order.discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                   <span className="text-gray-500 text-sm">实付</span>
                   <span className="text-xl font-bold text-gray-900">¥{order.payAmount.toFixed(2)}</span>
                </div>
             </div>
         </div>

         {/* Info Card */}
         <div className="mx-3 bg-white rounded-xl p-4 shadow-sm mb-6">
             <h3 className="font-bold text-sm text-gray-900 mb-3 border-l-4 border-[#FDE047] pl-2">订单信息</h3>
             <div className="space-y-3">
                <div className="flex justify-between text-xs">
                   <span className="text-gray-500">订单号码</span>
                   <div className="flex items-center gap-1 text-gray-900">
                      {order.id} <button className="text-[10px] border border-gray-200 px-1 rounded">复制</button>
                   </div>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-gray-500">下单时间</span>
                   <span className="text-gray-900">{order.createTime}</span>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-gray-500">支付方式</span>
                   <span className="text-gray-900">微信支付</span>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
};
