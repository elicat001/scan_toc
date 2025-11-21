
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Camera, LogOut, X, Check } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

interface UserProfileProps {
  onBack: () => void;
}

export const UserProfileView: React.FC<UserProfileProps> = ({ onBack }) => {
  const [user, setUser] = useState<User | null>(null);
  const [editingField, setEditingField] = useState<'name' | 'gender' | 'birthday' | null>(null);
  const [tempValue, setTempValue] = useState<string | number>('');

  useEffect(() => {
    api.getUserProfile().then(setUser);
  }, []);

  const handleSave = async () => {
    if (!user || !editingField) return;

    let updateData: Partial<User> = {};
    if (editingField === 'name') updateData = { name: tempValue as string };
    if (editingField === 'gender') updateData = { gender: tempValue as number };
    if (editingField === 'birthday') updateData = { birthday: tempValue as string };

    const updatedUser = await api.updateUserProfile(updateData);
    setUser(updatedUser);
    setEditingField(null);
  };

  const openEdit = (field: 'name' | 'gender' | 'birthday', currentValue: any) => {
    setEditingField(field);
    setTempValue(currentValue || '');
  };

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col relative">
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
              <div onClick={() => openEdit('name', user.name)} className="p-4 flex justify-between items-center border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                  <span className="text-gray-900 font-medium">昵称</span>
                  <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">{user.name}</span>
                      <ChevronRight size={16} className="text-gray-300" />
                  </div>
              </div>
              <div className="p-4 flex justify-between items-center border-b border-gray-50 opacity-60">
                  <span className="text-gray-900 font-medium">手机号</span>
                  <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">{user.phone}</span>
                      {/* Phone usually not editable easily without OTP */}
                  </div>
              </div>
              <div onClick={() => openEdit('gender', user.gender ?? 0)} className="p-4 flex justify-between items-center border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                  <span className="text-gray-900 font-medium">性别</span>
                  <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">
                        {user.gender === 1 ? '男' : user.gender === 2 ? '女' : '保密'}
                      </span>
                      <ChevronRight size={16} className="text-gray-300" />
                  </div>
              </div>
               <div onClick={() => openEdit('birthday', user.birthday)} className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                  <span className="text-gray-900 font-medium">生日</span>
                  <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">{user.birthday || '完善生日信息得积分'}</span>
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

      {/* Edit Modal Overlay */}
      {editingField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl animate-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-900">
                        {editingField === 'name' ? '修改昵称' : editingField === 'gender' ? '选择性别' : '设置生日'}
                    </h3>
                    <button onClick={() => setEditingField(null)} className="p-1 rounded-full hover:bg-gray-100">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="mb-6">
                    {editingField === 'name' && (
                        <input 
                           type="text" 
                           value={tempValue as string} 
                           onChange={(e) => setTempValue(e.target.value)}
                           className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#FDE047]"
                           autoFocus
                        />
                    )}

                    {editingField === 'gender' && (
                        <div className="flex flex-col gap-2">
                            {[
                                { val: 1, label: '男' }, 
                                { val: 2, label: '女' }, 
                                { val: 0, label: '保密' }
                            ].map(opt => (
                                <button 
                                   key={opt.val}
                                   onClick={() => setTempValue(opt.val)}
                                   className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${tempValue === opt.val ? 'border-[#FDE047] bg-[#FEFCE8] text-gray-900' : 'border-gray-100 text-gray-600'}`}
                                >
                                    <span>{opt.label}</span>
                                    {tempValue === opt.val && <Check size={16} className="text-[#CA8A04]" />}
                                </button>
                            ))}
                        </div>
                    )}

                    {editingField === 'birthday' && (
                        <input 
                           type="date" 
                           value={tempValue as string} 
                           onChange={(e) => setTempValue(e.target.value)}
                           className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#FDE047]"
                        />
                    )}
                </div>

                <button 
                   onClick={handleSave}
                   className="w-full bg-[#FDE047] text-gray-900 font-bold py-3 rounded-xl shadow-sm hover:bg-yellow-400"
                >
                   保存
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
