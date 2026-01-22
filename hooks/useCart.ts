
import { useState, useMemo } from 'react';
import { Product, CartItem } from '../types';

/**
 * Generates a stable unique key for a product + specs combination.
 * Sorting keys ensures that different order of selection doesn't result in duplicate items.
 */
function generateCartLineId(productId: number, specs?: Record<string, string>): string {
  if (!specs) return `${productId}::default`;
  const sortedSpecs = Object.entries(specs)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
  return `${productId}::${sortedSpecs}`;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const cartTotalCent = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.priceCent * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const addToCart = (product: Product, quantity: number, selectedSpec?: Record<string, string>) => {
    const cartLineId = generateCartLineId(product.id, selectedSpec);
    
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.cartLineId === cartLineId);

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }
      
      const newItem: CartItem = { 
        ...product, 
        cartLineId, 
        quantity, 
        selectedSpec 
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartLineId: string) => {
    setCart(prev => prev.filter(item => item.cartLineId !== cartLineId));
  };

  const clearCart = () => setCart([]);

  return { cart, cartTotalCent, cartCount, addToCart, removeFromCart, clearCart, setCart };
};
