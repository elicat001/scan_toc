
import type { DiningMode } from './checkout.types';
import type { Order } from '../../types';

export function mapDiningModeToOrderType(mode: DiningMode, tableNo?: string | null): Order['type'] {
  if (tableNo) return 'Scan Order';
  switch (mode) {
    case 'dine-in': return 'Dine In';
    case 'pickup': return 'Pick Up';
    case 'delivery': return 'Delivery';
    default: return 'Pick Up';
  }
}
