
import React from 'react';
import type { DiningMode } from '../checkout.types';

interface DiningModeTabsProps {
  diningMode: DiningMode;
  onChange: (m: DiningMode) => void;
}

export const DiningModeTabs: React.FC<DiningModeTabsProps> = ({ diningMode, onChange }) => {
  return (
    <div className="bg-white p-1.5 rounded-full flex shadow-sm border border-gray-100">
      {(['dine-in', 'pickup', 'delivery'] as const).map(mode => (
        <button 
          key={mode}
          onClick={() => onChange(mode)}
          className={`flex-1 py-2 rounded-full font-black text-xs transition-all ${
            diningMode === mode ? 'bg-[#FDE047] text-gray-900 shadow-sm' : 'text-gray-400'
          }`}
        >
          {mode === 'dine-in' ? '堂食' : mode === 'pickup' ? '自取' : '外送'}
        </button>
      ))}
    </div>
  );
};
