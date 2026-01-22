
import { CartItem, CreateOrderPayloadDTO, OrderItem } from '../../types';

export function mapCartToOrderItems(cart: CartItem[]): CreateOrderPayloadDTO['items'] {
  return cart.map(item => ({
    productId: item.id,
    name: item.name,
    priceCent: item.priceCent,
    count: item.quantity,
    specSnapshot: item.selectedSpec ? JSON.stringify(item.selectedSpec) : undefined
  }));
}

export function mapOrderItemsToCart(items: OrderItem[]): CartItem[] {
  return items.map(item => {
    // Helper to generate cartLineId if not provided in snapshot
    const specObj = item.specSnapshot ? JSON.parse(item.specSnapshot) : undefined;
    const cartLineId = `${item.productId}::${item.specSnapshot || 'default'}`;
    
    return {
      id: item.productId,
      cartLineId,
      name: item.name,
      priceCent: item.priceCent,
      image: item.image,
      quantity: item.count,
      selectedSpec: specObj,
      categoryId: 0,
      description: '',
      status: 1,
      isVip: false
    };
  });
}
