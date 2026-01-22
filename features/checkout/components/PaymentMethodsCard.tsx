
import React from 'react';
import { Check, Wallet } from 'lucide-react';
import type { User } from '../../../types';
import type { PaymentMethod } from '../checkout.types';

interface PaymentMethodsCardProps {
  user: User | null;
  paymentMethod: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
}

export const PaymentMethodsCard: React.FC<PaymentMethodsCardProps> = ({ user, paymentMethod, onChange }) => {
  const methods = [
    { id: 'wechat', label: '微信支付', icon: '🟢', color: 'bg-green-500' },
    { id: 'balance', label: '余额支付', icon: '💰', sub: `¥${user?.balance.toFixed(2) || 0}`, color: 'bg-gray-200' }
  ];

  return (
    <div className="bg-white rounded-[2rem] p-7 shadow-sm border border-gray-100">
      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-5">Payment Method</h4>
      <div className="space-y-3">
        {methods.map(m => (
          <div 
            key={m.id}
            onClick={() => onChange(m.id as any)}
            className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border ${
              paymentMethod === m.id ? 'bg-gray-900 border-gray-900 text-white shadow-lg' : 'bg-gray-50 border-transparent text-gray-900'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 ${m.color} rounded-xl flex items-center justify-center text-sm shadow-inner`}>
                {m.id === 'balance' ? <Wallet size={16} className={paymentMethod === m.id ? 'text-gray-900' : 'text-gray-400'} /> : m.icon}
              </div>
              <div>
                <div className="text-xs font-black italic">{m.label}</div>
                {m.sub && <div className={`text-[9px] font-bold ${paymentMethod === m.id ? 'opacity-50' : 'text-gray-400'}`}>{m.sub}</div>}
              </div>
            </div>
            {paymentMethod === m.id && <Check size={16} className="text-[#FDE047]" strokeWidth={4} />}
          </div>
        ))}
      </div>
    </div>
  );
};
