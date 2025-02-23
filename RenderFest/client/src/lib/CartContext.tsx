import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";
import type { Event } from "@shared/schema";

interface CartItem {
  event: Event;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (event: Event) => void;
  removeFromCart: (eventId: number) => void;
  clearCart: () => void;
  total: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const queryClient = useQueryClient();
  const { data: cartData, isLoading } = useQuery({
    queryKey: ["/api/cart"],
  });

  useEffect(() => {
    if (cartData) {
      setItems(cartData.items);
    }
  }, [cartData]);

  const addToCart = async (event: Event) => {
    try {
      await apiRequest("POST", "/api/cart/items", {
        eventId: event.id,
        quantity: 1,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const removeFromCart = async (eventId: number) => {
    try {
      await apiRequest("DELETE", `/api/cart/items/${eventId}`);
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      await apiRequest("DELETE", "/api/cart");
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.event.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        total,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
