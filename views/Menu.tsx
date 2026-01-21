
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
      showToast(isFav ? '已加入收藏' : '已取消收藏');
  };

  const displayedProducts = useMemo(() => {
      if (showFavoritesOnly) return products.filter(p => p.isFavorite);
      return products;
  }, [products, showFavoritesOnly]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="pt-4 px-4 pb-2 bg-white z-20 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold flex items-center text-gray-900 truncate">
              {storeInfo?.name || 'Loading...'} <ChevronRight size={18} className="mt-0.5 ml-1 flex-shrink-0" />
            </h2>
            {tableNo ? (
              <div className="flex items-center gap-1.5 mt-1 text-[#D97706] font-bold">
                 <div className="w-1.5 h-1.5 bg-[#D97706] rounded-full animate-pulse"></div>
                 <span className="text-xs">正在 {tableNo} 桌点餐</span>
              </div>
            ) : (
              <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                <MapPin size={10} />
                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">距离您{storeInfo?.distance}</span>
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
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${diningMode === mode ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        {mode === 'dine-in' ? '堂食' : mode === 'pickup' ? '自取' : '外送'}
                    </button>
                ))}
              </>
            ) : (
              <div className="px-4 py-1.5 rounded-full text-[11px] font-bold bg-gray-900 text-white">扫码点餐</div>
            )}
          </div>
        </div>
        <div className="flex gap-2 py-1 pb-2 items-center overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border whitespace-nowrap transition-colors ${showFavoritesOnly ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
          >
             <Heart size={10} className={showFavoritesOnly ? "fill-current" : ""} /> {showFavoritesOnly ? '已筛选收藏' : '我的收藏'}
          </button>
          <div className="w-[1px] h-3 bg-gray-200 mx-1"></div>
          <span className="text-[10px] text-[#B45309] font-medium border border-[#FDE68A] bg-[#FFFBEB] px-2 py-0.5 rounded-md whitespace-nowrap">会员商品6折起</span>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-[26%] bg-gray-50 h-full overflow-y-auto pb-24 no-scrollbar">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-4 text-xs flex flex-col items-center justify-center text-center cursor-pointer relative transition-colors ${activeCategory === cat.id ? 'bg-white font-bold text-gray-900' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {activeCategory === cat.id && <div className="absolute left-0 top-4 bottom-4 w-1 bg-gray-900 rounded-r-full" />}
              <span className="text-xl mb-1.5">{cat.icon}</span>
              <span className="leading-tight">{cat.name}</span>
            </div>
          ))}
        </div>

        <div className="flex-1 h-full overflow-y-auto bg-white pb-36 px-4">
          <div className="py-4">
             <div className="grid grid-cols-1 gap-8">
               {displayedProducts.length > 0 ? displayedProducts.map(product => (
                 <div key={product.id} className="flex gap-3 group animate-in fade-in slide-in-from-right-2 duration-300" onClick={() => handleOpenProduct(product)}>
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img src={product.image} className="w-full h-full rounded-lg object-cover bg-gray-100 shadow-sm" alt={product.name} loading="lazy" />
                      <button onClick={(e) => handleToggleFavorite(e, product)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                         <Heart size={12} className={product.isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
                      </button>
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                       <div>
                          <div className="flex items-start gap-1.5 mb-1">
                            {product.isVip && <span className="bg-[#1F2937] text-[#FDE047] text-[8px] px-1 py-0.5 rounded-[4px] font-black italic mt-0.5 transform -skew-x-12">VIP</span>}
                            <h4 className="font-bold text-gray-900 text-sm line-clamp-2">{product.name}</h4>
                          </div>
                          {product.description && <p className="text-[10px] text-gray-400 line-clamp-1 leading-relaxed">{product.description}</p>}
                       </div>
                       <div className="flex items-end justify-between mt-2">
                          <div>
                             {product.isVip ? (
                                <div className="flex flex-col items-start">
                                    <div className="bg-[#1F2937] text-[#FDE047] text-[9px] px-1.5 py-0.5 rounded-[4px] font-bold">¥{product.vipPrice}</div>
                                    <span className="text-[10px] text-gray-400 mt-0.5 line-through decoration-gray-300">¥{product.price}</span>
                                </div>
                             ) : (
                                <span className="text-base font-bold text-gray-900">¥{product.price}</span>
                             )}
                          </div>
                          <button onClick={(e) => handleDirectAdd(e, product)} className={`h-6 flex items-center justify-center transition-all active:scale-90 ${product.specs ? 'bg-[#FDE047] px-2.5 rounded-full' : 'w-6 h-6 bg-[#FDE047] rounded-full'}`}>
                             {product.specs ? <span className="text-[10px] font-bold text-gray-900">选规格</span> : <Plus size={14} className="text-gray-900" />}
                          </button>
                       </div>
                    </div>
                 </div>
               )) : (
                 <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"><Search size={24} className="text-gray-300" /></div>
                    <span className="text-xs">暂无商品</span>
                 </div>
               )}
             </div>
          </div>
        </div>
        
        <div className="absolute bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
           <div className={`rounded-full p-2 pr-2 shadow-2xl flex items-center justify-between h-14 transition-colors ${cart.length > 0 ? 'bg-gray-900 text-white' : 'bg-black/80 text-gray-400'}`}>
              <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={cart.length > 0 ? onCheckout : undefined}>
                  <div className="relative -ml-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-md z-10 ${cart.length > 0 ? 'bg-[#333] border-[#F3F4F6]' : 'bg-[#222] border-[#444]'}`}>
                         <ShoppingCart size={20} className={cart.length > 0 ? "text-white" : "text-gray-500"} />
                      </div>
                      {cartCount > 0 && <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#333] z-20">{cartCount}</div>}
                  </div>
                  <div className="flex flex-col">
                     {cart.length > 0 ? (
                        <>
                            <span className="text-lg font-bold">¥{cartTotal.toFixed(2)}</span>
                            <span className="text-[10px] text-gray-400 line-through">预估 ¥{(cartTotal * 1.2).toFixed(2)}</span>
                        </>
                     ) : <span className="text-sm font-bold">未选购商品</span>}
                  </div>
              </div>
              <button onClick={onCheckout} disabled={cart.length === 0} className={`px-8 h-10 rounded-full font-bold text-sm transition-colors ${cart.length > 0 ? 'bg-[#FDE047] text-gray-900 hover:bg-yellow-300' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
                 {cart.length > 0 ? '去结算' : '¥0起送'}
              </button>
           </div>
        </div>
      </div>

      <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setTimeout(() => setSelectedProduct(null), 300); }} onAddToCart={handleAddToCartWithToast} onToggleFavorite={handleToggleFavorite} />
    </div>
  );
};
