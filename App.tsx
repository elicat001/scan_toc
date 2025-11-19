
import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/Home';
import { MenuView } from './views/Menu';
import { OrdersView } from './views/Orders';
import { ProfileView } from './views/Profile';
import { CheckoutView } from './views/Checkout';
import { ViewState, CartItem, Product } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddToCart = (product: Product, quantity: number, selectedSpec?: Record<string, string>) => {
    setCart(prev => {
      // Check if same product AND same specs exists
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && 
        JSON.stringify(item.selectedSpec) === JSON.stringify(selectedSpec)
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }
      return [...prev, { ...product, quantity, selectedSpec }];
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return <HomeView onNavigate={setCurrentView} />;
      case 'MENU':
        return (
          <MenuView 
            cart={cart} 
            onAddToCart={handleAddToCart} 
            onRemoveFromCart={handleRemoveFromCart}
            onCheckout={() => setCurrentView('CHECKOUT')}
          />
        );
      case 'ORDERS':
        return <OrdersView />;
      case 'PROFILE':
        return <ProfileView />;
      case 'CHECKOUT':
        return <CheckoutView cart={cart} onBack={() => setCurrentView('MENU')} />;
      default:
        return <HomeView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white h-screen shadow-2xl relative overflow-hidden flex flex-col font-sans text-gray-900">
      <div className="flex-1 overflow-hidden relative">
        {renderView()}
      </div>
      <BottomNav currentView={currentView} onChange={setCurrentView} />
    </div>
  );
};

export default App;
