import React from 'react';
import { X, Heart, Minus, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, specs?: Record<string, string>) => void;
  onToggleFavorite: (e: React.MouseEvent, product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  onToggleFavorite
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [selectedSpecs, setSelectedSpecs] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      // Initialize default specs
      const defaults: Record<string, string> = {};
      if (product.specs) {
        product.specs.forEach(s => {
          defaults[s.name] = s.options[0];
        });
      }
      setSelectedSpecs(defaults);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleSpecSelect = (specName: string, option: string) => {
    setSelectedSpecs(prev => ({
      ...prev,
      [specName]: option
    }));
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSpecs);
    onClose();
  };

  const currentPrice = product.isVip ? (product.vipPrice || product.price) : product.price;
  const totalPrice = (currentPrice * quantity).toFixed(2);
  const originalTotal = (product.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity" onClick={onClose}></div>
      <div className="bg-white w-full max-w-md rounded-t-[1.5rem] overflow-hidden animate-in slide-in-from-bottom-full duration-300 relative z-10 flex flex-col max-h-[85vh]">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-black/30 p-1.5 rounded-full text-white backdrop-blur-sm hover:bg-black/50 transition-colors">
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Image */}
        <div className="relative w-full aspect-video bg-gray-100 flex-shrink-0">
          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-xl text-gray-900">{product.name}</h3>
            <button onClick={(e) => onToggleFavorite(e, product)} className="p-1">
              <Heart size={20} className={`transition-colors ${product.isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">{product.description || '暂无描述'}</p>
          
          {/* Specs Section */}
          <div className="mt-6 space-y-4">
            {product.specs ? product.specs.map((spec) => (
              <div key={spec.name}>
                <p className="text-xs text-gray-500 mb-2 font-medium">{spec.name}</p>
                <div className="flex gap-2 flex-wrap">
                  {spec.options.map((opt) => (
                    <button 
                      key={opt} 
                      onClick={() => handleSpecSelect(spec.name, opt)}
                      className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${selectedSpecs[spec.name] === opt ? 'bg-[#FDE047]/20 text-gray-900 border border-[#FDE047]' : 'bg-gray-100 text-gray-600 border border-transparent'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )) : (
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">份量 (必选)</p>
                <button className="bg-[#FDE047]/20 text-gray-900 border border-[#FDE047] px-6 py-1.5 rounded-md text-sm font-bold">
                  1人份
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm flex justify-between items-center pb-8">
          <div className="flex flex-col">
            {product.isVip ? (
              <>
                <div className="flex items-center gap-1">
                  <div className="bg-[#1F2937] text-[#FDE047] text-xs px-1.5 py-0.5 rounded-[4px] font-bold flex items-center">
                    <span className="mr-1 opacity-80 text-[10px]">VIP</span>
                    <span>¥{totalPrice}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 line-through mt-0.5">¥{originalTotal}</span>
              </>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">¥{totalPrice}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${quantity > 1 ? 'bg-white shadow-sm text-gray-900' : 'text-gray-300'}`}
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="font-bold text-base w-4 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-full bg-[#FDE047] flex items-center justify-center text-gray-900 shadow-sm hover:bg-yellow-400"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
            <button onClick={handleAddToCart} className="bg-[#FDE047] px-8 py-3 rounded-full font-bold text-gray-900 shadow-sm hover:bg-yellow-400 transition-colors">
              加入购物车
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
