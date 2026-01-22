
export type DiningMode = 'dine-in' | 'pickup' | 'delivery' | 'scan-order';
export type PaymentMethod = 'wechat' | 'balance';

export type PayFailReason = 
  | 'INSUFFICIENT_BALANCE' 
  | 'COUPON_INVALID' 
  | 'OUT_OF_STOCK' 
  | 'NETWORK_ERROR' 
  | 'USER_CANCELLED'
  | 'UNKNOWN';

export type PayState =
  | { status: 'idle' }
  | { status: 'creating' }
  | { status: 'paying'; orderId: string }
  | { status: 'success'; orderId: string }
  | { status: 'failed'; reason: PayFailReason; message: string };
