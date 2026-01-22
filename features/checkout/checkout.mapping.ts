
import type { DiningMode } from './checkout.types';
import type { Order } from '../../types';

export function mapDiningModeToOrderType(mode: DiningMode, tableNo?: string | null): Order['type'] {
  if (tableNo) return 'SCAN_ORDER';
  switch (mode) {
    case 'dine-in': return 'DINE_IN';
    case 'pickup': return 'PICKUP';
    case 'delivery': return 'DELIVERY';
    default: return 'PICKUP';
  }
}
