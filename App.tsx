
import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/Home';
import { MenuView } from './views/Menu';
import { OrdersView } from './views/Orders';
import { ProfileView } from './views/Profile';
import { CheckoutView } from './views/Checkout';
import { AddressListView } from './views/AddressList';
import { StoreListView } from './views/StoreList';
import { OrderDetailView } from './views/OrderDetail';
import { UserProfileView } from './views/UserProfile';
import { MemberTopUpView } from './views/MemberTopUp';
import { PointsMallView } from './views/PointsMall';
import { PointsHistoryView } from './views/PointsHistory';
import { ViewState, CartItem, Product, Order } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setCurrentView('ORDER_DETAIL');
  };

  // Re-order logic: Convert OrderItems to CartItems and go to checkout
  const handleOrderAgain = (order: Order) => {
      const newCartItems: CartItem[] = order.items.map(item => {
          // Note: In a real app, we might need to fetch the latest product details 
          // to ensure price/availability. Here we map roughly.
          // We also might parse the 'specSnapshot' string back into an object if needed.
          return {
              id: item.productId,
              categoryId: 0, // Unknown from OrderItem, but not critical for cart display usually
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.count,
              selectedSpec: undefined // Spec handling would go here
          };
      });
      setCart(newCartItems);
      setCurrentView('CHECKOUT');
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
        return <OrdersView onSelectOrder={handleOrderSelect} onOrderAgain={handleOrderAgain} />;
      case 'PROFILE':
        return <ProfileView onNavigate={setCurrentView} />;
      case 'CHECKOUT':
        return <CheckoutView cart={cart} onBack={() => setCurrentView('MENU')} />;
      case 'ADDRESS_LIST':
        return <AddressListView onBack={() => setCurrentView('PROFILE')} />;
      case 'STORE_LIST':
        return <StoreListView onBack={() => setCurrentView('HOME')} onSelect={(store) => setCurrentView('MENU')} />;
      case 'ORDER_DETAIL':
        if (!selectedOrder) return <OrdersView onSelectOrder={handleOrderSelect} onOrderAgain={handleOrderAgain} />;
        return <OrderDetailView order={selectedOrder} onBack={() => setCurrentView('ORDERS')} onOrderAgain={() => handleOrderAgain(selectedOrder)} />;
      case 'USER_PROFILE':
        return <UserProfileView onBack={() => setCurrentView('PROFILE')} />;
      case 'MEMBER_TOPUP':
        return <MemberTopUpView onBack={() => setCurrentView('PROFILE')} />;
      case 'POINTS_MALL':
        return <PointsMallView onBack={() => setCurrentView('PROFILE')} onHistory={() => setCurrentView('POINTS_HISTORY')} />;
      case 'POINTS_HISTORY':
        return <PointsHistoryView onBack={() => setCurrentView('POINTS_MALL')} />;
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
