
import React, { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/Home';
import { MenuView } from './views/Menu';
import { OrdersView } from './views/Orders';
import { ProfileView } from './views/Profile';
import { CheckoutPage } from './features/checkout/CheckoutPage'; 
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
import { ScanOrderView } from './views/ScanOrder';
import { ViewState, Order, PointsReward, CartItem } from './types';
import { api } from './services/api';
import { ToastProvider } from './components/Toast';
import { useCart } from './hooks/useCart';
import { mapOrderItemsToCart } from './domain/order/mapCartToOrderItems';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const { cart, addToCart, removeFromCart, clearCart, setCart: setFullCart } = useCart();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedReward, setSelectedReward] = useState<PointsReward | null>(null);
  const [initialDiningMode, setInitialDiningMode] = useState<'dine-in' | 'pickup' | 'delivery' | 'scan-order'>('dine-in');
  const [tableNo, setTableNo] = useState<string | null>(null);

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setCurrentView('ORDER_DETAIL');
  };

  const handleViewCreatedOrder = async (orderId: string) => {
      clearCart();
      setTableNo(null);
      const order = await api.getOrder(orderId);
      if (order) {
          setSelectedOrder(order);
          setCurrentView('ORDER_DETAIL');
      } else {
          setCurrentView('ORDERS');
      }
  };

  // P0-2: 标准化映射逻辑，使用 mapOrderItemsToCart 消除 any 强转
  const handleOrderAgain = (order: Order) => {
      const newCartItems = mapOrderItemsToCart(order.items);
      setFullCart(newCartItems);

      let mode: 'dine-in' | 'pickup' | 'delivery' | 'scan-order' = 'dine-in';
      if (order.type === 'PICKUP') mode = 'pickup';
      if (order.type === 'DELIVERY') mode = 'delivery';
      if (order.type === 'SCAN_ORDER') {
          mode = 'scan-order';
          setTableNo(order.tableNo || 'A-01');
      }
      setInitialDiningMode(mode);
      setCurrentView('CHECKOUT');
  };
  
  const handleNavigateFromHome = (view: ViewState) => {
      if (view !== 'SCAN_ORDER' && view !== 'MENU') {
          setTableNo(null);
      }
      setCurrentView(view);
  };

  const handleScanned = (scannedTableNo: string) => {
      setTableNo(scannedTableNo);
      setInitialDiningMode('scan-order');
      setCurrentView('MENU');
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME': return <HomeView onNavigate={handleNavigateFromHome} />;
      case 'SCAN_ORDER': return <ScanOrderView onBack={() => setCurrentView('HOME')} onScanned={handleScanned} />;
      case 'MENU': return <MenuView cart={cart} onAddToCart={addToCart} onRemoveFromCart={removeFromCart} onCheckout={() => setCurrentView('CHECKOUT')} initialDiningMode={initialDiningMode} tableNo={tableNo} />;
      case 'ORDERS': return <OrdersView onSelectOrder={handleOrderSelect} onOrderAgain={handleOrderAgain} />;
      case 'PROFILE': return <ProfileView onNavigate={setCurrentView} />;
      case 'CHECKOUT': return <CheckoutPage cart={cart} onBack={() => setCurrentView('MENU')} initialDiningMode={initialDiningMode as any} onViewOrder={handleViewCreatedOrder} tableNo={tableNo} />;
      case 'ORDER_DETAIL': return selectedOrder ? <OrderDetailView order={selectedOrder} onBack={() => setCurrentView('ORDERS')} onOrderAgain={() => handleOrderAgain(selectedOrder)} /> : <OrdersView onSelectOrder={handleOrderSelect} onOrderAgain={handleOrderAgain} />;
      case 'ADDRESS_LIST': return <AddressListView onBack={() => setCurrentView('PROFILE')} />;
      case 'STORE_LIST': return <StoreListView onBack={() => setCurrentView('HOME')} onSelect={() => setCurrentView('MENU')} />;
      case 'USER_PROFILE': return <UserProfileView onBack={() => setCurrentView('PROFILE')} />;
      case 'MEMBER_TOPUP': return <MemberTopUpView onBack={() => setCurrentView('PROFILE')} />;
      case 'POINTS_MALL': return <PointsMallView onBack={() => setCurrentView('PROFILE')} onHistory={() => setCurrentView('POINTS_HISTORY')} onSelectReward={(r) => { setSelectedReward(r); setCurrentView('POINTS_ITEM_DETAIL'); }} />;
      case 'POINTS_HISTORY': return <PointsHistoryView onBack={() => setCurrentView('POINTS_MALL')} />;
      case 'POINTS_ITEM_DETAIL': return selectedReward ? <PointsItemDetailView reward={selectedReward} onBack={() => setCurrentView('POINTS_MALL')} /> : null;
      case 'RESERVATION': return <ReservationView onBack={() => setCurrentView('HOME')} />;
      case 'STORE_DETAIL': return <StoreDetailView onBack={() => setCurrentView('HOME')} />;
      case 'MEMBER_CODE': return <MemberCodeView onBack={() => setCurrentView('HOME')} onTopUp={() => setCurrentView('MEMBER_TOPUP')} />;
      default: return <HomeView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FA] h-screen shadow-2xl relative overflow-hidden flex flex-col font-sans text-gray-900 ring-1 ring-black/5">
      <div className="flex-1 overflow-hidden relative">
        {renderView()}
      </div>
      <BottomNav currentView={currentView} onChange={setCurrentView} />
    </div>
  );
};

const App: React.FC = () => (
  <ToastProvider>
    <AppContent />
  </ToastProvider>
);

export default App;
