import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingButtons from '../components/common/FloatingButtons';
import { useStore } from '../context/StoreContext';
import { apiClient } from '../api/client';

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const { currentUser, authLoading, hydrateUserState } = useStore();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [redirectIn, setRedirectIn] = useState(5);

  const shortSessionId = useMemo(() => {
    if (!sessionId) return '';
    const s = String(sessionId);
    if (s.length <= 16) return s;
    return `${s.slice(0, 8)}…${s.slice(-6)}`;
  }, [sessionId]);

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

  useEffect(() => {
    if (status !== 'ok') return undefined;
    setRedirectIn(5);
    const interval = setInterval(() => {
      setRedirectIn((s) => {
        if (s <= 1) return 0;
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status !== 'ok') return;
    if (redirectIn !== 0) return;
    navigate('/orders', { replace: true });
  }, [status, redirectIn, navigate]);

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
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 sm:p-10">
              {status === 'loading' && (
                <div className="text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center">
                    <Loader2 className="w-7 h-7 text-primary-700 animate-spin" />
                  </div>
                  <h1 className="mt-5 text-2xl sm:text-3xl font-bold text-gray-900">
                    Confirming your payment
                  </h1>
                  <p className="mt-3 text-gray-600">
                    Please wait while we confirm your Stripe payment and finalize your order.
                  </p>
                  {shortSessionId && (
                    <p className="mt-4 text-xs text-gray-500">
                      Session: <span className="font-mono">{shortSessionId}</span>
                    </p>
                  )}
                </div>
              )}

              {status === 'ok' && (
                <div className="text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-emerald-700" />
                  </div>
                  <h1 className="mt-5 text-2xl sm:text-3xl font-bold text-gray-900">
                    Payment successful
                  </h1>
                  <p className="mt-3 text-gray-600">{message}</p>

                  <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => navigate('/orders')}
                      className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-6 py-3 font-semibold"
                    >
                      Go to Orders
                    </button>
                    <Link
                      to="/products"
                      className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-lg px-6 py-3 font-semibold"
                    >
                      Continue shopping
                    </Link>
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    Redirecting to Orders in <span className="font-semibold text-gray-700">{redirectIn}</span>s…
                  </p>
                </div>
              )}

              {status === 'error' && (
                <div className="text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-amber-700" />
                  </div>
                  <h1 className="mt-5 text-2xl sm:text-3xl font-bold text-gray-900">
                    Payment confirmation issue
                  </h1>
                  <p className="mt-3 text-gray-600">
                    We couldn’t confirm your payment automatically.
                  </p>
                  <p className="mt-3 text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                    {message}
                  </p>

                  <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      to="/orders"
                      className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-6 py-3 font-semibold"
                    >
                      Check Orders
                    </Link>
                    <Link
                      to="/cart"
                      className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-lg px-6 py-3 font-semibold"
                    >
                      Back to cart
                    </Link>
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    If you were charged, your order may still appear under <span className="font-semibold">My Orders</span>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default CheckoutSuccessPage;
