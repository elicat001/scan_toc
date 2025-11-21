
import React from 'react';
import { Home, Coffee, FileText, User } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChange }) => {
  // Don't show bottom nav on checkout or sub-pages
  const hiddenViews: ViewState[] = [
    'CHECKOUT', 
    'ADDRESS_LIST', 
    'STORE_LIST', 
    'ORDER_DETAIL',
    'USER_PROFILE',
    'MEMBER_TOPUP',
    'POINTS_MALL'
  ];
  
  if (hiddenViews.includes(currentView)) return null;

  const navItems = [
    { id: 'HOME', label: '首页', icon: Home },
    { id: 'MENU', label: '点单', icon: Coffee },
    { id: 'ORDERS', label: '订单', icon: FileText },
    { id: 'PROFILE', label: '我的', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-40 max-w-md mx-auto pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        const colorClass = isActive ? 'text-gray-900' : 'text-gray-400';
        
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id as ViewState)}
            className="flex flex-col items-center justify-center space-y-1 w-16 active:scale-95 transition-transform"
          >
            <Icon size={24} className={colorClass} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] ${isActive ? 'font-bold text-gray-900' : 'text-gray-400'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};