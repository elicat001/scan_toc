
import { useState, useMemo } from 'react';
import { Product, CartItem } from '../types';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const addToCart = (product: Product, quantity: number, selectedSpec?: Record<string, string>) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && 
        JSON.stringify(item.selectedSpec) === JSON.stringify(selectedSpec)
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }
      return [...prev, { ...product, quantity, selectedSpec }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  return { cart, cartTotal, cartCount, addToCart, removeFromCart, clearCart, setCart };
};
