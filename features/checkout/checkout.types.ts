
export type DiningMode = 'dine-in' | 'pickup' | 'delivery' | 'scan-order';
export type PaymentMethod = 'wechat' | 'balance';

export type PayState =
  | { status: 'idle' }
  | { status: 'creating' }
  | { status: 'paying'; orderId: string }
  | { status: 'success'; orderId: string }
  | { status: 'failed'; message: string };
