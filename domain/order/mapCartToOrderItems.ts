
import { CartItem, CreateOrderPayloadDTO, OrderItem } from '../../types';

/**
 * Maps CartItems to the format required for the CreateOrderPayloadDTO.
 * This is used during the checkout process to prepare the payload for the API.
 */
export function mapCartToOrderItems(cart: CartItem[]): CreateOrderPayloadDTO['items'] {
  return cart.map(item => ({
    productId: item.id,
    name: item.name,
    price: item.price,
    count: item.quantity,
    specSnapshot: item.selectedSpec ? JSON.stringify(item.selectedSpec) : undefined
  }));
}

/**
 * Maps OrderItems back to CartItems for the "Order Again" functionality.
 * Note: Some Product fields (like categoryId, description) may need default values 
 * if they are not present in the order item snapshot.
 */
export function mapOrderItemsToCart(items: OrderItem[]): CartItem[] {
  return items.map(item => ({
    id: item.productId,
    name: item.name,
    price: item.price,
    image: item.image,
    quantity: item.count,
    selectedSpec: item.specSnapshot ? JSON.parse(item.specSnapshot) : undefined,
    // Provide safe defaults for Product fields not in the OrderItem snapshot
    categoryId: 0,
    description: '',
    status: 1
  }));
}
