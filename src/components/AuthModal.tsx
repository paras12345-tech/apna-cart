import React, { useState } from 'react';
import { X, Lock, Phone, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, setIsLoggedIn, updateUser, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'otp'>('login');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);

  if (!authModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      showToast('Invalid Phone', 'Please enter a valid 10-digit mobile number.', 'error');
      return;
    }
    setMode('otp');
    showToast('OTP Sent', `Verification code sent to +91 ${phone} (Demo code: 1234)`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    if (name) {
      updateUser({ name, phone: `+91 ${phone}`, email: email || 'user@apnacart.com' });
    }
    setAuthModalOpen(false);
    showToast('Welcome to ApnaCart!', 'You have successfully logged in.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        onClick={() => setAuthModalOpen(false)}
      />
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-8 z-10 animate-in fade-in-50 zoom-in-95 duration-150">
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-widest block mb-1">
            ApnaCart Account
          </span>
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            {mode === 'otp'
              ? 'Verify with OTP'
              : mode === 'signup'
              ? 'Join ApnaCart'
              : 'Login or Sign Up'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'otp'
              ? `Enter the 4-digit code sent to +91 ${phone}`
              : 'Access your wishlist, order tracking & exclusive member discounts'}
          </p>
        </div>

        {mode !== 'otp' ? (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-600 font-mono">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit number"
                  className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl font-mono text-xs focus:outline-none"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav@example.com"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Continue with OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              {mode === 'login' ? (
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-xs text-slate-500 hover:text-rose-600 font-semibold"
                >
                  New to ApnaCart? <strong className="text-rose-600">Create an account</strong>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-500 hover:text-rose-600 font-semibold"
                >
                  Already have an account? <strong className="text-rose-600">Log In</strong>
                </button>
              )}
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-xs">
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={otp[idx]}
                  onChange={(e) => {
                    const val = e.target.value;
                    const newOtp = [...otp];
                    newOtp[idx] = val;
                    setOtp(newOtp);
                    if (val && e.target.nextElementSibling) {
                      (e.target.nextElementSibling as HTMLInputElement).focus();
                    }
                  }}
                  className="w-12 h-12 text-center text-lg font-bold font-mono border-2 border-slate-200 rounded-xl focus:border-rose-600 focus:outline-none"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
            >
              Verify & Log In
            </button>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="hover:text-slate-900"
              >
                Change Number
              </button>
              <button
                type="button"
                onClick={() => showToast('OTP Resent', 'Code: 1234')}
                className="text-rose-600 font-bold hover:underline"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>By signing in, you agree to ApnaCart's Terms & Privacy Policy</span>
        </div>
      </div>
    </div>
  );
};
