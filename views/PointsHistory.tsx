
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { PointRecord } from '../types';
import { api } from '../services/api';

interface PointsHistoryProps {
  onBack: () => void;
}

export const PointsHistoryView: React.FC<PointsHistoryProps> = ({ onBack }) => {
  const [records, setRecords] = useState<PointRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPointsHistory().then(data => {
        setRecords(data);
        setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
         <button onClick={onBack} className="p-1 -ml-1 rounded-full hover:bg-gray-100"><ChevronLeft size={24} /></button>
         <span className="font-bold text-lg text-gray-900">积分明细</span>
         <div className="w-8"></div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
              <div className="text-center py-10 text-gray-400">加载中...</div>
          ) : records.length > 0 ? (
              records.map((record) => (
                  <div key={record.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                      <div>
                          <h3 className="font-bold text-gray-900 text-sm mb-1">{record.title}</h3>
                          <p className="text-xs text-gray-400">{record.createTime}</p>
                      </div>
                      <div className={`font-bold text-lg ${record.amount > 0 ? 'text-[#CA8A04]' : 'text-gray-900'}`}>
                          {record.amount > 0 ? `+${record.amount}` : record.amount}
                      </div>
                  </div>
              ))
          ) : (
              <div className="text-center py-10 text-gray-400">暂无积分记录</div>
          )}
      </div>
    </div>
  );
};
