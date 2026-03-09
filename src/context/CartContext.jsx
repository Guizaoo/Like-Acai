import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { formatCents, parseCurrencyToCents } from "../utils/currency";

const CartContext = createContext(null);

// Garante compatibilidade com itens salvos em formatos antigos.
// Assim o carrinho continua funcionando mesmo após mudanças de estrutura.
function normalizeStoredItem(item) {
  const quantity = Number.isFinite(item?.quantity) ? Math.max(1, item.quantity) : 1;
  const unitPriceCents = Number.isFinite(item?.unitPriceCents)
    ? Math.max(0, Math.round(item.unitPriceCents))
    : parseCurrencyToCents(item?.price);

  return {
    ...item,
    quantity,
    unitPriceCents,
  };
}

export function CartProvider({ children }) {
  // ===== 1) Estado base com persistência em localStorage =====
  // Estado principal do carrinho.
  // É inicializado a partir do localStorage para persistir entre recarregamentos.
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("like-acai-cart");
    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalizeStoredItem);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    // Sempre que o carrinho muda, salva a versão atual no navegador.
    localStorage.setItem("like-acai-cart", JSON.stringify(items));
  }, [items]);

  // ===== 2) Ações públicas para manipular o carrinho =====
  const addItem = (item) => {
    setItems((prev) => {
      const normalizedItem = normalizeStoredItem(item);
      const existing = prev.find((cartItem) => cartItem.id === normalizedItem.id);

      if (existing) {
        // Mesmo ID = mesma personalização.
        // Nesse caso, só incrementa a quantidade.
        return prev.map((cartItem) =>
          cartItem.id === normalizedItem.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        );
      }

      // Item novo no carrinho.
      return [...prev, normalizedItem];
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

  // ===== 3) Dados derivados e API exposta pelo contexto =====
  const value = useMemo(() => {
    // Total de unidades (badge do carrinho).
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    // Total financeiro em centavos para evitar problema de arredondamento com float.
    const totalPriceCents = items.reduce((acc, item) => acc + item.unitPriceCents * item.quantity, 0);

    return {
      // Mantém preço formatado pronto para UI.
      items: items.map((item) => ({
        ...item,
        priceFormatted: formatCents(item.unitPriceCents),
      })),
      addItem,
      removeItem,
      changeQuantity,
      clearCart,
      totalItems,
      totalPriceCents,
      totalPriceFormatted: formatCents(totalPriceCents),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    // Protege contra uso fora do provider.
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }

  return context;
}
