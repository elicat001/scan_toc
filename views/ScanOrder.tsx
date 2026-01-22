
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Zap, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Header } from '../components/Header';

interface ScanOrderProps {
  onBack: () => void;
  onScanned: (tableNo: string) => void;
}

export const ScanOrderView: React.FC<ScanOrderProps> = ({ onBack, onScanned }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [flash, setFlash] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Simulate a successful scan after 2.5 seconds
    const timer = setTimeout(() => {
      setSuccess(true);
      setIsScanning(false);
      
      // Navigate after success check animation
      setTimeout(() => {
        onScanned('A-08');
      }, 1500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onScanned]);

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <Header 
        title="扫码点餐" 
        onBack={onBack} 
        theme="dark" 
        className="bg-transparent shadow-none"
      />

      {/* Simulated Camera Feed */}
      <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-[#111] flex items-center justify-center">
               <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>
      </div>

      {/* Scanning Interface */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-6">
          
          <div className="relative w-64 h-64">
              {/* Scan Corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FDE047] rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FDE047] rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#FDE047] rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#FDE047] rounded-br-lg"></div>

              {/* Laser Line */}
              {isScanning && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#FDE047] shadow-[0_0_15px_#FDE047] animate-scan-line"></div>
              )}

              {/* Success Feedback */}
              {success && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FDE047]/10 animate-in zoom-in duration-300">
                    <div className="bg-[#FDE047] p-4 rounded-full shadow-2xl">
                        <CheckCircle2 size={48} className="text-black" />
                    </div>
                    <span className="mt-4 text-[#FDE047] font-bold text-lg">识别成功: A-08 桌</span>
                </div>
              )}
          </div>

          <p className="mt-12 text-gray-400 text-sm font-medium animate-pulse">
            {success ? '正在为您跳转菜单...' : '请将餐桌二维码放入框内'}
          </p>

          {/* Controls */}
          <div className="absolute bottom-12 flex gap-12">
              <button 
                onClick={() => setFlash(!flash)}
                className={`flex flex-col items-center gap-2 group ${flash ? 'text-[#FDE047]' : 'text-white'}`}
              >
                  <div className={`p-4 rounded-full border transition-all ${flash ? 'bg-[#FDE047]/20 border-[#FDE047]' : 'bg-white/10 border-white/20'}`}>
                    <Zap size={24} fill={flash ? "currentColor" : "none"} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">手电筒</span>
              </button>

              <button className="flex flex-col items-center gap-2 group text-white">
                  <div className="p-4 rounded-full border border-white/20 bg-white/10 transition-all hover:bg-white/20">
                    <ImageIcon size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">相册导入</span>
              </button>
          </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-line {
            0% { top: 0%; opacity: 0.2; }
            50% { top: 100%; opacity: 1; }
            100% { top: 0%; opacity: 0.2; }
        }
        .animate-scan-line {
            animation: scan-line 2s infinite linear;
        }
      `}} />
    </div>
  );
};
