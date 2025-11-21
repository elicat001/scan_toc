
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Camera, LogOut } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

interface UserProfileProps {
  onBack: () => void;
}

export const UserProfileView: React.FC<UserProfileProps> = ({ onBack }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.getUserProfile().then(setUser);
  }, []);

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
         <button onClick={onBack} className="p-1 -ml-1 rounded-full hover:bg-gray-100"><ChevronLeft size={24} /></button>
         <span className="font-bold text-lg text-gray-900">个人信息</span>
         <div className="w-8"></div>
      </div>

      <div className="p-4 space-y-4">
          {/* Avatar */}
          <div className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm cursor-pointer active:bg-gray-50">
              <span className="text-gray-900 font-medium">头像</span>
              <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-100 relative group">
                      <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
                      <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center">
                          <Camera size={16} className="text-white" />
                      </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
              </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 flex justify-between items-center border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                  <span className="text-gray-900 font-medium">昵称</span>
                  <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">{user.name}</span>
                      <ChevronRight size={16} className="text-gray-300" />
                  </div>
              </div>
              <div className="p-4 flex justify-between items-center border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                  <span className="text-gray-900 font-medium">手机号</span>
                  <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">{user.phone}</span>
                      <ChevronRight size={16} className="text-gray-300" />
                  </div>
              </div>
              <div className="p-4 flex justify-between items-center border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                  <span className="text-gray-900 font-medium">性别</span>
                  <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">保密</span>
                      <ChevronRight size={16} className="text-gray-300" />
                  </div>
              </div>
               <div className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                  <span className="text-gray-900 font-medium">生日</span>
                  <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">完善生日信息得积分</span>
                      <ChevronRight size={16} className="text-gray-300" />
                  </div>
              </div>
          </div>

          {/* Logout */}
          <button className="w-full bg-white text-red-500 font-medium py-3.5 rounded-xl shadow-sm mt-8 flex items-center justify-center gap-2 active:bg-red-50">
             <LogOut size={18} />
             退出登录
          </button>
      </div>
    </div>
  );
};