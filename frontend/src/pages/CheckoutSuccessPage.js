import { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import { useStore } from '../context/StoreContext';
import { apiClient } from '../api/client';

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { currentUser, authLoading, hydrateUserState } = useStore();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function confirm() {
      if (!sessionId) {
        setStatus('error');
        setMessage('Missing payment session. Return to your cart and try again.');
        return;
      }
      try {
        await apiClient.verifyStripeSession({ sessionId });
        if (!cancelled) {
          await hydrateUserState();
          setStatus('ok');
          setMessage('Payment successful. Your order is confirmed.');
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setMessage(err.message || 'Could not confirm payment.');
        }
      }
    }
    if (!authLoading && currentUser) {
      confirm();
    }
    return () => {
      cancelled = true;
    };
  }, [sessionId, authLoading, currentUser, hydrateUserState]);

  if (authLoading) {
    return (
      <div>
        <Header />
        <div className="pt-32 pb-20 text-center text-gray-700">Confirming payment...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: '/checkout/success' }} />;
  }

  return (
    <div>
      <Header />
      <section className="pt-32 pb-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 max-w-lg text-center">
          {status === 'loading' && (
            <p className="text-gray-700 text-lg">Confirming your payment with Stripe...</p>
          )}
          {status === 'ok' && (
            <>
              <h1 className="text-2xl font-bold text-emerald-800 mb-4">Thank you</h1>
              <p className="text-gray-700 mb-6">{message}</p>
              <Link
                to="/orders"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-6 py-3 font-semibold"
              >
                View my orders
              </Link>
            </>
          )}
          {status === 'error' && (
            <>
              <h1 className="text-2xl font-bold text-red-800 mb-4">Payment confirmation issue</h1>
              <p className="text-gray-700 mb-6">{message}</p>
              <Link to="/cart" className="text-primary-600 font-semibold">
                Back to cart
              </Link>
            </>
          )}
        </div>
      </section>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default CheckoutSuccessPage;
