
import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronRight, Plus, ShoppingCart, Heart, MapPin } from 'lucide-react';
import { Product, Category, CartItem, Store } from '../types';
import { api } from '../services/api';
import { ProductModal } from '../components/ProductModal';
import { useToast } from '../components/Toast';

interface MenuProps {
  cart: CartItem[];
  onAddToCart: (product: Product, quantity: number, specs?: Record<string, string>) => void;
  onRemoveFromCart: (productId: number) => void;
  onCheckout: () => void;
  initialDiningMode?: 'dine-in' | 'pickup' | 'delivery' | 'scan-order';
  tableNo?: string | null;
}

export const MenuView: React.FC<MenuProps> = ({ 
  cart, 
  onAddToCart, 
  onCheckout, 
  initialDiningMode = 'dine-in',
  tableNo
}) => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storeInfo, setStoreInfo] = useState<Store | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [diningMode, setDiningMode] = useState<'dine-in' | 'pickup' | 'delivery' | 'scan-order'>(initialDiningMode);

  useEffect(() => {
    api.getCategories().then(setCategories);
    api.getStoreInfo().then(setStoreInfo);
  }, []);

  useEffect(() => {
    api.getProducts(activeCategory).then(setProducts);
  }, [activeCategory]);

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCartWithToast = (product: Product, quantity: number, specs?: Record<string, string>) => {
      onAddToCart(product, quantity, specs);
      showToast(`已添加 ${product.name}`, 'success');
  };

  const handleDirectAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (product.specs && product.specs.length > 0) {
      handleOpenProduct(product);
    } else {
      handleAddToCartWithToast(product, 1);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, product: Product) => {
      e.stopPropagation();
      const isFav = await api.toggleFavorite(product.id);
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isFavorite: isFav } : p));
      showToast(isFav ? '已加入收藏' : '已从收藏移除');
  };

  const displayedProducts = useMemo(() => {
      if (showFavoritesOnly) return products.filter(p => p.isFavorite);
      return products;
  }, [products, showFavoritesOnly]);

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="pt-4 px-4 pb-2 bg-white z-20 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black flex items-center text-gray-900 truncate tracking-tight">
              {storeInfo?.name || '加载中...'} <ChevronRight size={18} className="mt-0.5 ml-1 flex-shrink-0" />
            </h2>
            {tableNo ? (
              <div className="flex items-center gap-1.5 mt-1 text-[#D97706] font-black">
                 <div className="w-1.5 h-1.5 bg-[#D97706] rounded-full animate-pulse"></div>
                 <span className="text-[10px] tracking-premium uppercase">正在点餐：{tableNo} 桌</span>
              </div>
            ) : (
              <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1 font-bold">
                <MapPin size={10} />
                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 tracking-tight">距离您 {storeInfo?.distance}</span>
              </p>
            )}
          </div>
          <div className="flex bg-gray-100/80 rounded-full p-1 ml-2">
            {!tableNo ? (
              <>
                {['dine-in', 'pickup', 'delivery'].map(mode => (
                    <button 
                        key={mode}
                        onClick={() => setDiningMode(mode as any)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-all ${diningMode === mode ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-400 hover:text-gray-900'}`}
                    >
                        {mode === 'dine-in' ? '堂食' : mode === 'pickup' ? '自取' : '外送'}
                    </button>
                ))}
              </>
            ) : (
              <div className="px-4 py-1.5 rounded-full text-[11px] font-black bg-gray-900 text-white tracking-widest">扫码点餐</div>
            )}
          </div>
        </div>

        <div className="flex gap-2 py-1 pb-2 items-center overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-premium border transition-all duration-300 ${
                showFavoritesOnly 
                ? 'bg-red-500 border-red-500 text-white shadow-md' 
                : 'bg-white border-gray-100 text-gray-500 hover:border-red-200 hover:text-red-500'
            }`}
          >
             <Heart size={10} className={showFavoritesOnly ? "fill-current" : ""} /> 
             我的收藏
          </button>
          <div className="w-[1px] h-3 bg-gray-200 mx-1"></div>
          <span className="text-[9px] text-[#B45309] font-black tracking-premium border border-[#FDE047] bg-[#FFFBEB] px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm">
             会员专享
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="w-[26%] bg-gray-50 h-full overflow-y-auto pb-24 no-scrollbar border-r border-gray-100">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-5 text-[11px] flex flex-col items-center justify-center text-center cursor-pointer relative transition-all ${activeCategory === cat.id ? 'bg-white font-black text-gray-900 shadow-sm' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              {activeCategory === cat.id && <div className="absolute left-0 top-3 bottom-3 w-1 bg-gray-900 rounded-r-full" />}
              <span className="text-2xl mb-2">{cat.icon}</span>
              <span className="leading-tight tracking-tight">{cat.name}</span>
            </div>
          ))}
        </div>

        <div className="flex-1 h-full overflow-y-auto bg-white pb-36 px-4 no-scrollbar">
          <div className="py-4">
             <div className="grid grid-cols-1 gap-10">
               {displayedProducts.length > 0 ? displayedProducts.map(product => (
                 <div 
                    key={product.id} 
                    className="flex gap-4 group animate-in fade-in slide-in-from-right-3 duration-500" 
                    onClick={() => handleOpenProduct(product)}
                 >
                    <div className="relative w-28 h-28 flex-shrink-0">
                      <img 
                        src={product.image} 
                        className="w-full h-full rounded-2xl object-cover bg-gray-50 shadow-md transition-transform duration-700 group-hover:scale-105" 
                        alt={product.name} 
                      />
                      <button 
                        onClick={(e) => handleToggleFavorite(e, product)} 
                        className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 backdrop-blur-md ${
                            product.isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'
                        }`}
                      >
                         <Heart size={12} className={product.isFavorite ? 'fill-current' : ''} />
                      </button>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                       <div>
                          <div className="flex items-start justify-between mb-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                {product.isVip && (
                                    <span className="bg-gray-900 text-[#FDE047] text-[8px] px-1.5 py-0.5 rounded-[4px] font-black italic transform -skew-x-12">VIP</span>
                                )}
                                <h4 className="font-brand-italic text-base text-gray-900 line-clamp-2 leading-tight tracking-tight">
                                    {product.name}
                                </h4>
                            </div>
                          </div>
                          {product.description && (
                            <p className="text-[10px] text-gray-400 font-bold line-clamp-1 leading-relaxed tracking-tight">{product.description}</p>
                          )}
                       </div>
                       
                       <div className="flex items-end justify-between mt-3">
                          <div className="flex items-baseline gap-1">
                             <span className="text-xs font-black text-gray-400">¥</span>
                             <span className="text-xl font-mono-numbers font-black text-gray-900">{product.price}</span>
                          </div>
                          <button onClick={(e) => handleDirectAdd(e, product)} className={`h-8 flex items-center justify-center transition-all active:scale-90 shadow-md ${product.specs ? 'bg-[#FDE047] px-4 rounded-xl' : 'w-8 h-8 bg-[#FDE047] rounded-xl'}`}>
                             {product.specs ? <span className="text-[10px] font-black text-gray-900 tracking-premium">选规格</span> : <Plus size={16} strokeWidth={3} className="text-gray-900" />}
                          </button>
                       </div>
                    </div>
                 </div>
               )) : (
                 <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center border border-gray-100 shadow-inner">
                        <Search size={32} className="text-gray-200" />
                    </div>
                    <div className="flex flex-col items-center">
                        <h4 className="font-brand-italic text-gray-900 text-lg mb-1 tracking-tight italic">
                            {showFavoritesOnly ? '暂无收藏' : '未找到商品'}
                        </h4>
                        <span className="text-[10px] font-black text-gray-400 tracking-premium text-center uppercase leading-loose">
                            {showFavoritesOnly ? '收藏您喜欢的商品以便快速下单' : '尝试切换其他分类看看吧'}
                        </span>
                    </div>
                 </div>
               )}
             </div>
          </div>
        </div>
        
        <div className="absolute bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-6 duration-700">
           <div className={`rounded-[2.5rem] p-2.5 pr-4 shadow-2xl flex items-center justify-between h-24 transition-all duration-500 ${cart.length > 0 ? 'bg-gray-900 translate-y-0' : 'bg-gray-800/80 backdrop-blur-md translate-y-2 opacity-50'}`}>
              <div className="flex items-center gap-4 flex-1 cursor-pointer pl-4" onClick={cart.length > 0 ? onCheckout : undefined}>
                  <div className="relative">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 shadow-xl z-10 transition-colors ${cart.length > 0 ? 'bg-gray-800 border-gray-700' : 'bg-gray-700 border-gray-600'}`}>
                         <ShoppingCart size={24} className={cart.length > 0 ? "text-[#FDE047]" : "text-gray-500"} />
                      </div>
                      {cartCount > 0 && <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-gray-900 z-20 shadow-lg">{cartCount}</div>}
                  </div>
                  <div className="flex flex-col">
                     {cart.length > 0 ? (
                        <div className="flex items-baseline gap-1 text-white">
                            <span className="text-[10px] font-black opacity-50 uppercase italic mr-0.5">Total</span>
                            <span className="text-2xl font-mono-numbers font-black tracking-tighter italic">¥{cartTotal.toFixed(2)}</span>
                        </div>
                     ) : <span className="text-xs font-black text-gray-500 tracking-[0.1em] uppercase">购物车是空的</span>}
                  </div>
              </div>
              <button 
                onClick={onCheckout} 
                disabled={cart.length === 0} 
                className={`px-10 h-16 rounded-full font-black text-base italic tracking-widest transition-all active:scale-[0.97] ${cart.length > 0 ? 'bg-[#FDE047] text-gray-900 shadow-xl shadow-yellow-500/20' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
              >
                 去结算
              </button>
           </div>
        </div>
      </div>

      <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setTimeout(() => setSelectedProduct(null), 300); }} onAddToCart={handleAddToCartWithToast} onToggleFavorite={handleToggleFavorite} />
    </div>
  );
};
