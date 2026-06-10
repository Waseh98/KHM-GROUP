import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'ktex_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addToCart = useCallback((product, { size = 'M', color = null, colorIndex = 0, quantity = 1 } = {}) => {
    setItems(prev => {
      const key = `${product.id}_${size}_${colorIndex}`;
      const existing = prev.find(i => i._key === key);
      if (existing) {
        return prev.map(i => i._key === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        _key: key,
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.image,
        size,
        color,
        colorIndex,
        quantity,
      }];
    });
    setDrawerOpen(true);
  }, []);

  const removeFromCart = useCallback((key) => {
    setItems(prev => prev.filter(i => i._key !== key));
  }, []);

  const updateQuantity = useCallback((key, qty) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i._key === key ? { ...i, quantity: qty } : i));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      drawerOpen,
      setDrawerOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
