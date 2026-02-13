import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

function normalizePrice(price) {
  if (!price) return 0;

  const numeric = String(price).replace(/[^\d,]/g, "").replace(".", "").replace(",", ".");
  const parsed = Number.parseFloat(numeric);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("like-acai-cart");
    if (!saved) return [];

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("like-acai-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);

      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const changeQuantity = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => setItems([]);

  const value = useMemo(() => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = items.reduce((acc, item) => acc + normalizePrice(item.price) * item.quantity, 0);

    return {
      items,
      addItem,
      removeItem,
      changeQuantity,
      clearCart,
      totalItems,
      totalPrice,
      totalPriceFormatted: formatCurrency(totalPrice),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}


export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }

  return context;
}
