import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import API_URL from '../config/api';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // Fetch cart data from the server
  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token || user?.token;

      if (!token) return;

      const response = await fetch(`${API_URL}/api/cart`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setCart(data.cart || { items: [] });
      } else {
        console.error('Failed to fetch cart:', data.message);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1, color = '', size = '') => {
    if (!user) return { success: false, message: 'Please login to add to cart' };

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token || user?.token;

      const response = await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity, color, size })
      });
      const data = await response.json();
      
      if (data.success) {
        setCart(data.cart);
        return { success: true, message: 'Added to cart' };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: 'Error adding to cart' };
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (!user) return { success: false, message: 'Not authenticated' };

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token || user?.token;

      const response = await fetch(`${API_URL}/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });
      const data = await response.json();
      
      if (data.success) {
        setCart(data.cart);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { success: false, message: 'Error updating quantity' };
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    if (!user) return { success: false, message: 'Not authenticated' };

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token || user?.token;

      const response = await fetch(`${API_URL}/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setCart(data.cart);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Error removing item:', error);
      return { success: false, message: 'Error removing item' };
    }
  };

  // Clear cart entirely
  const clearCart = async () => {
    if (!user) return { success: false, message: 'Not authenticated' };

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = storedUser?.token || user?.token;

      const response = await fetch(`${API_URL}/api/cart`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setCart(data.cart);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, message: 'Error clearing cart' };
    }
  };

  // Count total items
  const getCartCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate cart total price
  const getCartTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      if (item.product && item.product.priceINR) {
        return total + (item.product.priceINR * item.quantity);
      }
      return total;
    }, 0);
  };

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
