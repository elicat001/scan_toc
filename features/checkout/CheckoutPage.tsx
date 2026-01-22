
import React, { useState } from 'react';
import { AlertCircle, X, ShoppingBag } from 'lucide-react';
import type { CartItem } from '../../types';
import { Header } from '../../components/Header';
import { useCheckout } from './useCheckout';
import { CouponModal } from './components/CouponModal';
import { PaySuccessModal } from './components/PaySuccessModal';
import { DiningModeTabs } from './components/DiningModeTabs';
import { CheckoutHeaderCard } from './components/CheckoutHeaderCard';
import { OrderItemsCard } from './components/OrderItemsCard';
import { UpsellCard } from './components/UpsellCard';
import { PaymentMethodsCard } from './components/PaymentMethodsCard';
import { BottomPayBar } from './components/BottomPayBar';
import type { DiningMode } from './checkout.types';

interface CheckoutPageProps {
  cart: CartItem[];
  onBack: () => void;
  initialDiningMode?: DiningMode;
  onViewOrder?: (orderId: string) => void;
  tableNo?: string | null;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = (props) => {
  const { cart, onBack, initialDiningMode = 'dine-in', onViewOrder, tableNo } = props;
  const [showCouponModal, setShowCouponModal] = useState(false);
  
  const vm = useCheckout({ cart, initialDiningMode, tableNo });

  const isProcessing = vm.payState.status === 'creating' || vm.payState.status === 'paying';
  const statusText = vm.payState.status === 'creating' 
    ? 'PREPARING...' 
    : vm.payState.status === 'paying' 
    ? 'PAYING...' 
    : 'CONFIRM PAY';

  const handleFinish = () => {
    if (onViewOrder && vm.payState.status === 'success') {
      onViewOrder(vm.payState.orderId);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      <Header title="确认订单" onBack={onBack} />

      <div className="flex-1 overflow-y-auto pb-36 px-4 pt-4 space-y-5">
        {!tableNo && (
          <DiningModeTabs 
            diningMode={vm.diningMode} 
            onChange={vm.setDiningMode} 
          />
        )}

        <CheckoutHeaderCard 
          diningMode={vm.diningMode} 
          tableNo={tableNo} 
          user={vm.user} 
        />

        <OrderItemsCard 
          cart={cart}
          diningMode={vm.diningMode}
          selectedCoupon={vm.selectedCoupon}
          validCouponCount={vm.validCoupons.length}
          deliveryFeeCent={vm.pricing.deliveryFeeCent}
          discountAmountCent={vm.pricing.discountCent}
          payableCent={vm.pricing.payableCent}
          onClickCoupon={() => setShowCouponModal(true)}
        />

        <UpsellCard />

        <PaymentMethodsCard 
          user={vm.user}
          paymentMethod={vm.paymentMethod}
          onChange={vm.setPaymentMethod}
        />
      </div>

      <BottomPayBar 
        payableCent={vm.pricing.payableCent}
        processing={isProcessing}
        onPay={vm.pay}
        statusText={statusText}
      />

      {/* Error Logic with Specific Guidance */}
      {vm.payState.status === 'failed' && (
        <div className="fixed top-20 left-4 right-4 z-[60] bg-red-900 text-white p-5 rounded-[2rem] shadow-2xl animate-in slide-in-from-top-4 flex justify-between items-start border border-red-800">
           <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-red-300" />
              </div>
              <div className="flex-1">
                 <h4 className="text-[10px] font-black italic tracking-widest uppercase mb-1">支付失败</h4>
                 <p className="text-sm font-bold leading-snug">{vm.payState.message}</p>
                 
                 {vm.payState.reason === 'INSUFFICIENT_BALANCE' && (
                     <button className="mt-3 bg-white text-red-900 px-5 py-2 rounded-full text-[10px] font-black italic uppercase tracking-widest">
                         去充值赚积分
                     </button>
                 )}
              </div>
           </div>
           <button onClick={vm.reset} className="p-2 hover:bg-white/10 rounded-full transition-colors">
             <X size={16}/>
           </button>
        </div>
      )}

      <CouponModal 
        open={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        validCoupons={vm.validCoupons}
        invalidCoupons={vm.invalidCoupons}
        selectedCoupon={vm.selectedCoupon}
        onSelectCoupon={vm.setSelectedCoupon}
        cartTotalCent={vm.cartTotalCent}
      />

      <PaySuccessModal 
        open={vm.payState.status === 'success'}
        orderId={vm.payState.status === 'success' ? vm.payState.orderId : ''}
        onFinish={handleFinish}
      />
    </div>
  );
};
