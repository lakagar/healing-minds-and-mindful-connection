import { createContext, ReactNode, useContext } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { useAuth } from "./use-auth";
import { CartItem, Medicine } from "@shared/schema";

type CartItemWithDetails = CartItem & { medicine: Medicine };

type CartContextType = {
  cartItems: CartItemWithDetails[];
  isLoading: boolean;
  addToCart: (medicineId: number, quantity: number) => void;
  updateQuantity: (cartItemId: number, quantity: number) => void;
  removeFromCart: (cartItemId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isAddingToCart: boolean;
  isUpdatingCart: boolean;
  isRemovingFromCart: boolean;
  isClearingCart: boolean;
};

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Get cart items with product details
  const { data: cartItems = [], isLoading, refetch } = useQuery<CartItemWithDetails[]>({
    queryKey: ["/api/cart"],
    enabled: !!user,
  });
  
  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ medicineId, quantity }: { medicineId: number, quantity: number }) => {
      const res = await apiRequest("POST", "/api/cart", { medicineId, quantity });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add item",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update cart item mutation
  const updateCartItemMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number, quantity: number }) => {
      const res = await apiRequest("PUT", `/api/cart/${id}`, { quantity });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Cart updated",
        description: "Cart has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove item",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to clear cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const addToCart = (medicineId: number, quantity: number) => {
    addToCartMutation.mutate({ medicineId, quantity });
  };
  
  const updateQuantity = (cartItemId: number, quantity: number) => {
    updateCartItemMutation.mutate({ id: cartItemId, quantity });
  };
  
  const removeFromCart = (cartItemId: number) => {
    removeFromCartMutation.mutate(cartItemId);
  };
  
  const clearCart = () => {
    clearCartMutation.mutate();
  };
  
  const getTotalItems = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  const getTotalPrice = (): number => {
    return cartItems.reduce((total, item) => total + (item.medicine.price * item.quantity), 0);
  };
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isAddingToCart: addToCartMutation.isPending,
        isUpdatingCart: updateCartItemMutation.isPending,
        isRemovingFromCart: removeFromCartMutation.isPending,
        isClearingCart: clearCartMutation.isPending,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
