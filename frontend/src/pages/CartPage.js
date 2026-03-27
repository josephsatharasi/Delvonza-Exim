import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/productPricing';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    authLoading,
    cartItems,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    checkoutWithPayment,
    placeOrder
  } = useStore();
  const [payMessage, setPayMessage] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  if (authLoading) {
    return (
      <div>
        <Header />
        <div className="pt-32 pb-20 text-center text-gray-700">Loading cart...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const detailedItems = cartItems;

  const handleOrder = async () => {
    setPayMessage('');
    setPlacingOrder(true);
    const response = await checkoutWithPayment();
    setPlacingOrder(false);
    if (response.redirecting) {
      return;
    }
    if (!response.success) {
      setPayMessage(response.message || 'Payment could not be completed.');
      return;
    }
    navigate('/orders');
  };

  const handleCashOnDelivery = async () => {
    setPayMessage('');
    setPlacingOrder(true);
    const response = await placeOrder('cod');
    setPlacingOrder(false);
    if (!response.success) {
      setPayMessage(response.message || 'Could not place COD order.');
      return;
    }
    navigate('/orders');
  };

  return (
    <div>
      <Header />
      <section className="pt-32 pb-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 max-w-5xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Cart</h1>
          {!detailedItems.length ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4">Your cart is empty.</p>
              <Link className="text-primary-600 font-semibold" to="/products">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {detailedItems.map((item) => (
                  <div key={item.productId} className="bg-white p-4 rounded-lg shadow flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h2 className="font-bold text-gray-800">{item.name}</h2>
                      <p className="text-gray-500">{formatCurrency(item.price)} per unit</p>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          className="px-3 py-1 border rounded"
                          onClick={() => updateCartQuantity(item.productId, Math.max(item.quantity - 1, 0))}
                        >
                          -
                        </button>
                        <span className="min-w-8 text-center">{item.quantity}</span>
                        <button
                          className="px-3 py-1 border rounded"
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        >
                          +
                        </button>
                        <button
                          className="ml-3 text-red-600"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-800">{formatCurrency(item.subtotal)}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-lg shadow h-fit">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2">
                  <span>Items</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Total</span>
                  <span className="font-bold">{formatCurrency(cartTotal)}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Choose your payment method to place the order.</p>
                {payMessage && <p className="text-sm text-red-600 mb-3">{payMessage}</p>}
                <div className="space-y-2">
                  <button
                    onClick={handleOrder}
                    disabled={placingOrder}
                    className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white rounded-lg px-4 py-3 font-semibold"
                  >
                    Pay online (Stripe)
                  </button>
                  <button
                    onClick={handleCashOnDelivery}
                    disabled={placingOrder}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white rounded-lg px-4 py-3 font-semibold"
                  >
                    Cash on Delivery
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default CartPage;
