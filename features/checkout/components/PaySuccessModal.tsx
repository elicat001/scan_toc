
import React from 'react';
import { Check } from 'lucide-react';

interface PaySuccessModalProps {
  open: boolean;
  orderId: string;
  onFinish: () => void;
}

export const PaySuccessModal: React.FC<PaySuccessModalProps> = ({ open, orderId, onFinish }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 text-center animate-in zoom-in duration-300 shadow-2xl">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Check size={40} className="text-white" strokeWidth={4} />
        </div>
        <h3 className="text-2xl font-black text-gray-900 tracking-tight italic mb-2">下单成功!</h3>
        <p className="text-sm text-gray-500 mb-8">商家已收到您的订单，开始为您制作美味。</p>
        
        <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left border border-gray-100">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-gray-400 uppercase">Order ID</span>
            <span className="text-gray-900">{orderId}</span>
          </div>
          <div className="flex justify-between text-xs font-bold">
            <span className="text-gray-400 uppercase">Verified</span>
            <span className="text-gray-900">Payment Completed</span>
          </div>
        </div>

        <button 
          onClick={onFinish}
          className="w-full bg-black text-[#FDE047] py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-transform"
        >
          查看订单详情
        </button>
      </div>
    </div>
  );
};
