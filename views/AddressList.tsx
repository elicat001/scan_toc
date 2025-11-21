
import React, { useEffect, useState } from 'react';
import { ChevronLeft, Plus, Edit3, Trash2 } from 'lucide-react';
import { Address } from '../types';
import { api } from '../services/api';

interface AddressListProps {
  onBack: () => void;
}

export const AddressListView: React.FC<AddressListProps> = ({ onBack }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    api.getAddresses().then(setAddresses);
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
         <button onClick={onBack} className="p-1 -ml-1 rounded-full hover:bg-gray-100"><ChevronLeft size={24} /></button>
         <span className="font-bold text-lg text-gray-900">我的地址</span>
         <div className="w-8"></div> {/* Spacer */}
      </div>

      {/* List */}
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
         {addresses.map(addr => (
            <div key={addr.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-base">{addr.location} {addr.detail}</span>
                      {addr.tag && <span className="text-[10px] bg-[#E0F2FE] text-[#0284C7] px-1.5 py-0.5 rounded">{addr.tag}</span>}
                      {addr.isDefault && <span className="text-[10px] bg-[#FDE047] text-gray-900 px-1.5 py-0.5 rounded">默认</span>}
                   </div>
                   <div className="text-sm text-gray-500">
                      {addr.contact} {addr.phone}
                   </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 border-l border-gray-100 pl-3 ml-2">
                   <Edit3 size={18} />
                </button>
            </div>
         ))}
      </div>

      {/* Bottom Button */}
      <div className="p-4 bg-white border-t border-gray-100 pb-safe">
         <button className="w-full bg-[#FDE047] text-gray-900 font-bold py-3 rounded-full flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform">
            <Plus size={20} />
            新增收货地址
         </button>
      </div>
    </div>
  );
};
