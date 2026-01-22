
import React, { useState } from 'react';
import { Calendar, Clock, Users, Phone } from 'lucide-react';
import { Header } from '../components/Header';

interface ReservationProps {
  onBack: () => void;
}

export const ReservationView: React.FC<ReservationProps> = ({ onBack }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState(2);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
        setShowSuccess(false);
        onBack();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      <Header title="自助预约" onBack={onBack} />

      <div className="p-4 flex-1 overflow-y-auto">
         <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
             <h2 className="font-bold text-lg text-gray-900 mb-6">填写预约信息</h2>
             
             <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Calendar size={16} /> 用餐日期
                    </label>
                    <input 
                      type="date" 
                      required
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#FDE047] outline-none"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Clock size={16} /> 用餐时间
                    </label>
                    <input 
                      type="time" 
                      required
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#FDE047] outline-none"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Users size={16} /> 用餐人数
                    </label>
                    <div className="flex gap-3">
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <button
                               type="button"
                               key={num}
                               onClick={() => setPeople(num)}
                               className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${people === num ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Phone size={16} /> 联系电话
                    </label>
                    <input 
                      type="tel" 
                      placeholder="请输入手机号"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#FDE047] outline-none"
                    />
                 </div>

                 <button 
                    type="submit"
                    className="w-full h-15 bg-[#FDE047] text-gray-900 font-black rounded-2xl shadow-xl shadow-yellow-200/50 hover:bg-yellow-400 transition-all active:scale-95 mt-4 flex items-center justify-center text-base italic"
                 >
                    立即预约
                 </button>
             </form>
         </div>

         <div className="text-center text-xs text-gray-400 leading-relaxed px-4">
             温馨提示：预约成功后，请留意短信通知。<br/>
             如需取消，请提前1小时联系门店。
         </div>
      </div>
      
      {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div className="bg-black/80 text-white px-8 py-4 rounded-full shadow-2xl font-black italic animate-in fade-in zoom-in duration-200">
                  预约提交成功
              </div>
          </div>
      )}
    </div>
  );
};
