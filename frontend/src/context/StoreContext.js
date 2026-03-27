import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiClient, tokenStore } from '../api/client';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  const hydrateUserState = useCallback(async () => {
    try {
      if (!tokenStore.getAccessToken()) {
        setCurrentUser(null);
        setCartItems([]);
        setUserOrders([]);
        setAuthLoading(false);
        return;
      }

      const [{ user }, { cart }, { orders }] = await Promise.all([
        apiClient.me(),
        apiClient.getCart(),
        apiClient.getOrders()
      ]);

      setCurrentUser(user);
      setCartItems(cart.items || []);
      setUserOrders(orders || []);
    } catch (error) {
      tokenStore.clear();
      setCurrentUser(null);
      setCartItems([]);
      setUserOrders([]);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrateUserState();
  }, []);

  const register = async ({ name, email, password, phone = '', address = '' }) => {
    try {
      await apiClient.register({ name, email, password, phone, address });
      tokenStore.clear();
      setCurrentUser(null);
      setCartItems([]);
      setUserOrders([]);
      setAuthLoading(false);
      return { success: true, message: 'Account created successfully. Please login.' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const login = async ({ email, password }) => {
    try {
      const response = await apiClient.login({ email, password });
      tokenStore.setTokens(response);
      setCurrentUser(response.user);
      await hydrateUserState();
      setAuthLoading(false);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout({ refreshToken: tokenStore.getRefreshToken() });
    } catch (error) {
      // Ignore logout failure and clear local auth state.
    } finally {
      tokenStore.clear();
      setCurrentUser(null);
      setCartItems([]);
      setUserOrders([]);
    }
  };

  const updateProfile = async ({ name, phone, address }) => {
    if (!currentUser) {
      return { success: false, message: 'Please login to update profile.' };
    }
    try {
      const response = await apiClient.updateProfile({ name, phone, address });
      setCurrentUser(response.user);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!currentUser) {
      return { success: false, message: 'Please login to add products to cart.' };
    }
    try {
      const response = await apiClient.addToCart({ productId, quantity });
      setCartItems(response.cart.items || []);
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (!currentUser) {
      return;
    }
    try {
      const response = await apiClient.updateCartItem({ productId, quantity });
      setCartItems(response.cart.items || []);
    } catch (error) {
      // Keep old state on error.
    }
  };

  const removeFromCart = async (productId) => {
    if (!currentUser) {
      return;
    }
    try {
      const response = await apiClient.removeCartItem(productId);
      setCartItems(response.cart.items || []);
    } catch (error) {
      // Keep old state on error.
    }
  };

  const placeOrder = async (paymentMethod = 'online') => {
    if (!currentUser) {
      return { success: false, message: 'Please login to place order.' };
    }
    if (!cartItems.length) {
      return { success: false, message: 'Your cart is empty.' };
    }
    try {
      const response = await apiClient.placeOrder({
        shippingAddress: currentUser.address || '',
        paymentMethod
      });
      await hydrateUserState();
      return { success: true, message: response.message, orderId: response.order?._id };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const redirectToStripeCheckout = (payment) => {
    if (!payment?.url) {
      return { success: false, message: 'Payment link missing from server.' };
    }
    window.location.assign(payment.url);
    return { success: true, redirecting: true };
  };

  const openStripeCheckoutForOrder = async (mongoOrderId) => {
    try {
      const session = await apiClient.createStripeSession(mongoOrderId);
      return redirectToStripeCheckout(session);
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const checkoutWithPayment = async () => {
    if (!currentUser) {
      return { success: false, message: 'Please login.' };
    }
    if (!cartItems.length) {
      return { success: false, message: 'Your cart is empty.' };
    }
    try {
      const response = await apiClient.createCheckoutSession({
        shippingAddress: currentUser.address || ''
      });
      if (!response.payment?.url) {
        return { success: false, message: response.message || 'Payment could not be started.' };
      }
      await hydrateUserState();
      return redirectToStripeCheckout(response.payment);
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const contextValue = {
    currentUser,
    authLoading,
    users: [],
    cartItems,
    cartCount,
    cartTotal,
    userOrders,
    register,
    login,
    logout,
    updateProfile,
    hydrateUserState,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    placeOrder,
    checkoutWithPayment,
    openStripeCheckoutForOrder
  };

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
