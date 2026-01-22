
import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
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
  
  // 业务模型入口
  const vm = useCheckout({ cart, initialDiningMode, tableNo });

  // 派生 UI 状态
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
        {/* 1. 就餐模式切换 (非扫码模式展示) */}
        {!tableNo && (
          <DiningModeTabs 
            diningMode={vm.diningMode} 
            onChange={vm.setDiningMode} 
          />
        )}

        {/* 2. 头部地址/门店卡片 */}
        <CheckoutHeaderCard 
          diningMode={vm.diningMode} 
          tableNo={tableNo} 
          user={vm.user} 
        />

        {/* 3. 商品详情清单 (含集章、券入口) */}
        <OrderItemsCard 
          cart={cart}
          diningMode={vm.diningMode}
          selectedCoupon={vm.selectedCoupon}
          validCouponCount={vm.validCoupons.length}
          deliveryFee={vm.pricing.deliveryFee}
          discountAmount={vm.pricing.discount}
          payable={vm.pricing.payable}
          onClickCoupon={() => setShowCouponModal(true)}
        />

        {/* 4. 会员增值建议 */}
        <UpsellCard />

        {/* 5. 支付方式选择 */}
        <PaymentMethodsCard 
          user={vm.user}
          paymentMethod={vm.paymentMethod}
          onChange={vm.setPaymentMethod}
        />
      </div>

      {/* 6. 底部固定结算条 */}
      <BottomPayBar 
        payable={vm.pricing.payable}
        processing={isProcessing}
        onPay={vm.pay}
        statusText={statusText}
      />

      {/* 7. 错误提示浮层 */}
      {vm.payState.status === 'failed' && (
        <div className="fixed top-20 left-4 right-4 z-[60] bg-red-900 text-white p-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-4 flex justify-between items-center border border-red-800">
           <div className="flex gap-3 items-center">
              <AlertCircle size={20} className="text-red-300" />
              <div className="flex-1">
                 <h4 className="text-[10px] font-black italic tracking-tight uppercase">Payment Failed</h4>
                 <p className="text-[10px] font-bold text-red-100 opacity-80">{vm.payState.message}</p>
              </div>
           </div>
           <button onClick={vm.reset} className="p-2 hover:bg-white/10 rounded-full transition-colors">
             <X size={16}/>
           </button>
        </div>
      )}

      {/* 8. 模态框 */}
      <CouponModal 
        open={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        validCoupons={vm.validCoupons}
        invalidCoupons={vm.invalidCoupons}
        selectedCoupon={vm.selectedCoupon}
        onSelectCoupon={vm.setSelectedCoupon}
        cartTotal={vm.cartTotal}
      />

      <PaySuccessModal 
        open={vm.payState.status === 'success'}
        orderId={vm.payState.status === 'success' ? vm.payState.orderId : ''}
        onFinish={handleFinish}
      />
    </div>
  );
};
