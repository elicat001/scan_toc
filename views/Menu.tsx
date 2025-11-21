
import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronRight, Plus, Minus, ShoppingCart, X, Heart } from 'lucide-react';
import { Product, Category, CartItem, Store, ProductSpec } from '../types';
import { api } from '../services/api';

interface MenuProps {
  cart: CartItem[];
  onAddToCart: (product: Product, quantity: number, specs?: Record<string, string>) => void;
  onRemoveFromCart: (productId: number) => void;
  onCheckout: () => void;
  initialDiningMode?: 'dine-in' | 'pickup' | 'delivery';
}

export const MenuView: React.FC<MenuProps> = ({ cart, onAddToCart, onRemoveFromCart, onCheckout, initialDiningMode = 'dine-in' }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [storeInfo, setStoreInfo] = useState<Store | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [diningMode, setDiningMode] = useState<'dine-in' | 'pickup' | 'delivery'>(initialDiningMode);

  useEffect(() => {
    api.getCategories().then(setCategories);
    api.getStoreInfo().then(setStoreInfo);
  }, []);

  useEffect(() => {
    api.getProducts(activeCategory).then(setProducts);
  }, [activeCategory]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const handleAddFromModal = () => {
    if (selectedProduct) {
      // For simplicity, we select the first option of each spec by default if not implemented
      const defaultSpecs: Record<string, string> = {};
      if (selectedProduct.specs) {
        selectedProduct.specs.forEach(s => {
          defaultSpecs[s.name] = s.options[0];
        });
      }
      
      onAddToCart(selectedProduct, modalQuantity, defaultSpecs);
      handleCloseModal();
    }
  };

  const handleDirectAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (product.specs && product.specs.length > 0) {
      handleOpenProduct(product);
    } else {
      onAddToCart(product, 1);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, product: Product) => {
      e.stopPropagation();
      // Optimistic update
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isFavorite: !p.isFavorite } : p));
      
      // Call API
      await api.toggleFavorite(product.id);
  };

  const displayedProducts = useMemo(() => {
      if (showFavoritesOnly) {
          return products.filter(p => p.isFavorite);
      }
      return products;
  }, [products, showFavoritesOnly]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="pt-4 px-4 pb-2 bg-white z-20 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold flex items-center text-gray-900">
              {storeInfo?.name || 'Loading...'} <ChevronRight size={20} className="mt-0.5" />
            </h2>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">距离您{storeInfo?.distance}</span>
            </p>
          </div>
          <div className="flex bg-gray-100/80 rounded-full p-1">
            <button 
              onClick={() => setDiningMode('dine-in')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${diningMode === 'dine-in' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              堂食
            </button>
            <button 
              onClick={() => setDiningMode('pickup')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${diningMode === 'pickup' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              自取
            </button>
            <button 
              onClick={() => setDiningMode('delivery')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${diningMode === 'delivery' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              外送
            </button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 pb-2 items-center">
          <button 
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border whitespace-nowrap transition-colors ${
                showFavoritesOnly 
                ? 'bg-red-50 border-red-200 text-red-500' 
                : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}
          >
             <Heart size={10} className={showFavoritesOnly ? "fill-current" : ""} /> 
             {showFavoritesOnly ? '已筛选收藏' : '我的收藏'}
          </button>
          <div className="w-[1px] h-3 bg-gray-200 mx-1"></div>
          <span className="text-[10px] text-[#B45309] font-medium border border-[#FDE68A] bg-[#FFFBEB] px-2 py-0.5 rounded-md whitespace-nowrap">会员商品6折起</span>
          <span className="text-[10px] text-[#B45309] font-medium border border-[#FDE68A] bg-[#FFFBEB] px-2 py-0.5 rounded-md whitespace-nowrap">订单≥0.01元, 充值3倍享免单</span>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div className="w-[26%] bg-gray-50 h-full overflow-y-auto pb-24 scrollbar-hide">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-4 text-xs flex flex-col items-center justify-center text-center cursor-pointer relative transition-colors ${
                activeCategory === cat.id ? 'bg-white font-bold text-gray-900' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {activeCategory === cat.id && (
                <div className="absolute left-0 top-4 bottom-4 w-1 bg-gray-900 rounded-r-full" />
              )}
              <span className="text-xl mb-1.5 filter grayscale-[0.2]">{cat.icon}</span>
              <span className="leading-tight">{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Product List */}
        <div className="flex-1 h-full overflow-y-auto bg-white pb-36 px-4 w-[74%]">
          <div className="py-4">
             <h3 className="font-bold text-sm mb-4 text-gray-800 sticky top-0 bg-white py-2 z-10 flex justify-between items-center">
                 {categories.find(c => c.id === activeCategory)?.name}
                 {showFavoritesOnly && <span className="text-[10px] text-red-500 font-normal bg-red-50 px-2 py-0.5 rounded-full">只看收藏</span>}
             </h3>
             <div className="grid grid-cols-1 gap-8">
               {displayedProducts.length > 0 ? displayedProducts.map(product => (
                 <div key={product.id} className="flex gap-3 group" onClick={() => handleOpenProduct(product)}>
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img 
                        src={product.image} 
                        className="w-full h-full rounded-lg object-cover bg-gray-100 shadow-sm"
                        alt={product.name}
                      />
                      {/* Favorite Icon */}
                      <button 
                        onClick={(e) => handleToggleFavorite(e, product)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                      >
                         <Heart 
                            size={12} 
                            className={`transition-colors ${product.isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                         />
                      </button>
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                       <div>
                          <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">{product.name}</h4>
                          {product.description && (
                            <p className="text-[10px] text-gray-400 line-clamp-1 leading-relaxed">{product.description}</p>
                          )}
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {product.tags?.map(t => (
                               <span key={t} className="text-[9px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded-sm border border-red-100">{t}</span>
                            ))}
                          </div>
                       </div>
                       <div className="flex items-end justify-between mt-2">
                          <div>
                             <div className="flex items-baseline gap-1">
                                <span className="text-base font-bold text-gray-900">¥{product.price}</span>
                                {product.originalPrice && <span className="text-[10px] text-gray-300 line-through">¥{product.originalPrice}</span>}
                             </div>
                             {product.isVip && (
                               <div className="flex items-center gap-1 mt-0.5">
                                 <span className="bg-gray-900 text-[#FDE047] text-[9px] px-1 rounded-sm font-bold tracking-tighter">VIP</span>
                                 <span className="text-xs text-[#FDE047] font-bold drop-shadow-[0_1px_0_rgba(0,0,0,0.2)]" style={{ textShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>¥{product.vipPrice}</span>
                               </div>
                             )}
                          </div>
                          <button 
                            onClick={(e) => handleDirectAdd(e, product)}
                            className={`h-6 flex items-center justify-center transition-all active:scale-95 ${
                                product.specs ? 'bg-[#FDE047] px-2.5 rounded-full' : 'w-6 h-6 bg-[#FDE047] rounded-full'
                            }`}
                          >
                             {product.specs ? <span className="text-[10px] font-bold text-gray-900">选规格</span> : <Plus size={14} className="text-gray-900" />}
                          </button>
                       </div>
                    </div>
                 </div>
               )) : (
                 <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search size={24} className="text-gray-300" />
                    </div>
                    <span className="text-xs">{showFavoritesOnly ? '暂无收藏商品' : '该分类下暂无商品'}</span>
                 </div>
               )}
             </div>
          </div>
        </div>
        
        {/* Cart Floating Bar */}
        {cart.length > 0 && (
            <div className="absolute bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
               <div className="bg-gray-900 text-white rounded-full p-2 pr-2 shadow-2xl flex items-center justify-between h-14">
                  <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={onCheckout}>
                      <div className="relative -ml-1">
                          <div className="w-12 h-12 bg-[#333] rounded-full flex items-center justify-center border-4 border-[#F3F4F6] shadow-md relative z-10">
                             <ShoppingCart size={20} className="text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#333] z-20">
                             {cartCount}
                          </div>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-lg font-bold leading-none">¥{cartTotal.toFixed(2)}</span>
                         <span className="text-[10px] text-gray-400 line-through mt-0.5">预估 ¥{(cartTotal * 1.2).toFixed(2)}</span>
                      </div>
                  </div>
                  <button onClick={onCheckout} className="bg-[#FDE047] text-gray-900 px-8 h-10 rounded-full font-bold text-sm hover:bg-yellow-300 transition-colors shadow-sm">
                     去结算
                  </button>
               </div>
            </div>
        )}
      </div>

      {/* Product Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ zIndex: 9999 }}>
           <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity" onClick={handleCloseModal}></div>
           <div className="bg-white w-full max-w-md rounded-t-[1.5rem] overflow-hidden animate-in slide-in-from-bottom-full duration-300 relative z-10 flex flex-col max-h-[85vh]">
               {/* Close Button */}
               <button onClick={handleCloseModal} className="absolute top-4 right-4 z-20 bg-black/30 p-1.5 rounded-full text-white backdrop-blur-sm hover:bg-black/50 transition-colors">
                  <X size={20} strokeWidth={2.5} />
               </button>

               {/* Image */}
               <div className="relative w-full aspect-video bg-gray-100 flex-shrink-0">
                  <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
               </div>

               {/* Content */}
               <div className="p-5 overflow-y-auto flex-1">
                   <div className="flex justify-between items-start">
                       <h3 className="font-bold text-xl text-gray-900">{selectedProduct.name}</h3>
                       <button onClick={(e) => handleToggleFavorite(e, selectedProduct)} className="p-1">
                           <Heart size={20} className={`transition-colors ${selectedProduct.isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                       </button>
                   </div>
                   <p className="text-xs text-gray-500 mt-2 leading-relaxed">{selectedProduct.description || '暂无描述'}</p>
                   
                   {/* Specs Section */}
                   <div className="mt-6 space-y-4">
                      {selectedProduct.specs ? selectedProduct.specs.map((spec) => (
                        <div key={spec.name}>
                          <p className="text-xs text-gray-500 mb-2 font-medium">{spec.name}</p>
                          <div className="flex gap-2 flex-wrap">
                              {spec.options.map((opt, idx) => (
                                <button key={opt} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${idx === 0 ? 'bg-[#FDE047]/20 text-gray-900 border border-[#FDE047]' : 'bg-gray-100 text-gray-600 border border-transparent'}`}>
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
                      <div className="flex items-baseline gap-1">
                         <span className="text-2xl font-bold text-gray-900">¥{(selectedProduct.price * modalQuantity).toFixed(2)}</span>
                      </div>
                      {selectedProduct.isVip && <span className="text-[10px] text-[#B45309] font-bold">VIP ¥{(selectedProduct.vipPrice! * modalQuantity).toFixed(2)}</span>}
                   </div>
                   
                   <div className="flex items-center gap-6">
                       <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                           <button 
                             onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                             className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${modalQuantity > 1 ? 'bg-white shadow-sm text-gray-900' : 'text-gray-300'}`}
                           >
                              <Minus size={14} strokeWidth={3} />
                           </button>
                           <span className="font-bold text-base w-4 text-center">{modalQuantity}</span>
                           <button 
                             onClick={() => setModalQuantity(modalQuantity + 1)}
                             className="w-7 h-7 rounded-full bg-[#FDE047] flex items-center justify-center text-gray-900 shadow-sm hover:bg-yellow-400"
                           >
                              <Plus size={14} strokeWidth={3} />
                           </button>
                       </div>
                       <button onClick={handleAddFromModal} className="bg-[#FDE047] px-8 py-3 rounded-full font-bold text-gray-900 shadow-sm hover:bg-yellow-400 transition-colors">
                          加入购物车
                       </button>
                   </div>
               </div>
           </div>
        </div>
      )}
    </div>
  );
};
    