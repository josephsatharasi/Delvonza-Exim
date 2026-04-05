import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { adminAuthApi } from '../api/client';
import RequiredMark from '../components/RequiredMark';

const AdminForgotPassword = () => {
  const { isAuthenticated } = useAdminAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const em = String(email || '').trim();
    if (!em) {
      setError('Email is required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await adminAuthApi.forgotPassword({ email: em });
      setMessage(res.message || 'Check your inbox for the code.');
      setStep(2);
    } catch (err) {
      setError(err.message || 'Request failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const em = String(email || '').trim();
    if (!em || !otp.trim() || !newPassword || !confirmPassword) {
      setError('Email, code, new password, and confirm password are all required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/^\d{4}$/.test(otp.trim())) {
      setError('Enter the 4-digit code from your email.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await adminAuthApi.resetPassword({
        email: em,
        otp: otp.trim(),
        newPassword,
        confirmPassword
      });
      setMessage(res.message || 'Password updated.');
      setStep(3);
    } catch (err) {
      setError(err.message || 'Reset failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Forgot password</h1>
        <p className="text-sm text-gray-600 mb-6">
          {step === 1 && 'We will email a 4-digit code to your registered address if an account exists.'}
          {step === 2 && 'Enter the code from your email and choose a new password. All fields are required.'}
          {step === 3 && 'You can sign in with your new password.'}
        </p>
        {error && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg text-sm">{error}</p>}
        {message && step !== 3 && (
          <p className="mb-4 text-green-800 bg-green-50 p-3 rounded-lg text-sm">{message}</p>
        )}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account email
                <RequiredMark />
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white rounded-lg py-3 font-semibold"
            >
              {submitting ? 'Sending…' : 'Send code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
                <RequiredMark />
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                4-digit code (email)
                <RequiredMark />
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                pattern="\d{4}"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 tracking-widest text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0000"
                required
                autoComplete="one-time-code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New password
                <RequiredMark />
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-4 pr-11 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 rounded-md"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm new password
                <RequiredMark />
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white rounded-lg py-3 font-semibold"
            >
              {submitting ? 'Updating…' : 'Update password'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp('');
                setError('');
                setMessage('');
              }}
              className="w-full text-sm text-gray-600 hover:text-primary-600"
            >
              ← Use a different email
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-green-800 bg-green-50 p-3 rounded-lg text-sm">{message}</p>
            <Link
              to="/login"
              className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white rounded-lg py-3 font-semibold"
            >
              Go to sign in
            </Link>
          </div>
        )}

        {step !== 3 && (
          <p className="mt-6 text-sm text-center text-gray-600">
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Back to sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminForgotPassword;
