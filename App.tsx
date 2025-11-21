
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
import { PointsItemDetailView } from './views/PointsItemDetail';
import { ReservationView } from './views/Reservation';
import { StoreDetailView } from './views/StoreDetail';
import { MemberCodeView } from './views/MemberCode';
import { ViewState, CartItem, Product, Order, PointsReward } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedReward, setSelectedReward] = useState<PointsReward | null>(null);
  const [initialDiningMode, setInitialDiningMode] = useState<'dine-in' | 'pickup' | 'delivery'>('dine-in');

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
          return {
              id: item.productId,
              categoryId: 0, 
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.count,
              selectedSpec: undefined 
          };
      });
      setCart(newCartItems);

      // Set dining mode based on order type
      let mode: 'dine-in' | 'pickup' | 'delivery' = 'dine-in';
      if (order.type === 'Pick Up') mode = 'pickup';
      if (order.type === 'Delivery') mode = 'delivery';
      setInitialDiningMode(mode);

      setCurrentView('CHECKOUT');
  };
  
  const handleNavigateFromHome = (view: ViewState) => {
      // Default to dine-in if coming from generic entry, typically Menu handles its own defaults
      // but if we clicked specific buttons in Home, we might want to pass state. 
      // For now simple nav.
      setInitialDiningMode('dine-in');
      setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return <HomeView onNavigate={handleNavigateFromHome} />;
      case 'MENU':
        return (
          <MenuView 
            cart={cart} 
            onAddToCart={handleAddToCart} 
            onRemoveFromCart={handleRemoveFromCart}
            onCheckout={() => setCurrentView('CHECKOUT')}
            initialDiningMode={initialDiningMode}
          />
        );
      case 'ORDERS':
        return <OrdersView onSelectOrder={handleOrderSelect} onOrderAgain={handleOrderAgain} />;
      case 'PROFILE':
        return <ProfileView onNavigate={setCurrentView} />;
      case 'CHECKOUT':
        return <CheckoutView cart={cart} onBack={() => setCurrentView('MENU')} initialDiningMode={initialDiningMode} />;
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
        return <PointsMallView onBack={() => setCurrentView('PROFILE')} onHistory={() => setCurrentView('POINTS_HISTORY')} onSelectReward={(r) => { setSelectedReward(r); setCurrentView('POINTS_ITEM_DETAIL'); }} />;
      case 'POINTS_HISTORY':
        return <PointsHistoryView onBack={() => setCurrentView('POINTS_MALL')} />;
      case 'POINTS_ITEM_DETAIL':
        if (!selectedReward) return <PointsMallView onBack={() => setCurrentView('PROFILE')} onHistory={() => setCurrentView('POINTS_HISTORY')} onSelectReward={() => {}} />;
        return <PointsItemDetailView reward={selectedReward} onBack={() => setCurrentView('POINTS_MALL')} />;
      case 'RESERVATION':
        return <ReservationView onBack={() => setCurrentView('HOME')} />;
      case 'STORE_DETAIL':
        return <StoreDetailView onBack={() => setCurrentView('HOME')} />;
      case 'MEMBER_CODE':
        return <MemberCodeView onBack={() => setCurrentView('HOME')} onTopUp={() => setCurrentView('MEMBER_TOPUP')} />;
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
