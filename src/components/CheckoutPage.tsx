import React, { useState } from 'react';
import {
  MapPin,
  Truck,
  CreditCard,
  ShieldCheck,
  Check,
  Plus,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Smartphone,
  Building,
  Banknote,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Address } from '../types';
import { getPrimaryProductImage } from '../utils/productImages';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    addresses,
    addAddress,
    cartFinalTotal,
    cartSubtotal,
    cartTotalDiscount,
    couponDiscount,
    deliveryFee,
    createOrder,
    setCurrentView,
    showToast,
  } = useApp();

  // Multi-step: 1 = Address, 2 = Delivery, 3 = Payment
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Address selection
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ''
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<Address, 'id'>>({
    name: '',
    phone: '',
    pincode: '',
    house: '',
    street: '',
    locality: '',
    city: '',
    state: '',
    type: 'HOME',
    isDefault: false,
  });

  // Delivery options
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('aarav@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8829');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('841');
  const [cardName, setCardName] = useState('Aarav Sharma');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.phone || !newAddr.pincode || !newAddr.house || !newAddr.city) {
      showToast('Incomplete Address', 'Please fill all required address fields.', 'error');
      return;
    }
    addAddress(newAddr);
    setIsAddingNewAddress(false);
  };

  const handleCompleteOrder = () => {
    if (!selectedAddress) {
      showToast('Select Address', 'Please specify a delivery address.', 'error');
      setStep(1);
      return;
    }

    setIsProcessingPayment(true);

    // Simulate realistic bank / gateway settlement
    setTimeout(() => {
      setIsProcessingPayment(false);
      createOrder(selectedAddress, deliveryMethod, paymentMethod);
      setCurrentView('order-success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1800);
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-600">Your bag is empty.</p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#FBFBF9] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Progression Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <button
                onClick={() => setStep(1)}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                  step >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                1
              </button>
              <span className="text-[11px] font-bold text-slate-800 mt-1.5 uppercase tracking-wider">
                Address
              </span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <button
                onClick={() => selectedAddress && setStep(2)}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                  step >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                2
              </button>
              <span className="text-[11px] font-bold text-slate-800 mt-1.5 uppercase tracking-wider">
                Delivery
              </span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  step === 3 ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'bg-slate-200 text-slate-500'
                }`}
              >
                3
              </div>
              <span className="text-[11px] font-bold text-slate-800 mt-1.5 uppercase tracking-wider">
                Payment
              </span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: ADDRESS */}
            {step === 1 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-rose-600" />
                    <h2 className="text-lg font-bold text-slate-900 font-serif">
                      Select Delivery Address
                    </h2>
                  </div>
                  {!isAddingNewAddress && (
                    <button
                      onClick={() => setIsAddingNewAddress(true)}
                      className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Address</span>
                    </button>
                  )}
                </div>

                {/* Add Address Form */}
                {isAddingNewAddress ? (
                  <form onSubmit={handleSaveAddress} className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddr.name}
                          onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          placeholder="e.g. Aarav Sharma"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={newAddr.phone}
                          onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          placeholder="10-digit mobile number"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={newAddr.pincode}
                          onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          placeholder="6 digits"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddr.city}
                          onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          placeholder="e.g. New Delhi"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Flat / House No. / Building *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddr.house}
                        onChange={(e) => setNewAddr({ ...newAddr, house: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                        placeholder="Flat 402, Royal Palms Residency"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Street / Locality
                        </label>
                        <input
                          type="text"
                          value={newAddr.street}
                          onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          placeholder="Barakhamba Road"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddr.state}
                          onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          placeholder="e.g. Delhi"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="addrType"
                          checked={newAddr.type === 'HOME'}
                          onChange={() => setNewAddr({ ...newAddr, type: 'HOME' })}
                          className="accent-rose-600"
                        />
                        <span>Home</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="addrType"
                          checked={newAddr.type === 'OFFICE'}
                          onChange={() => setNewAddr({ ...newAddr, type: 'OFFICE' })}
                          className="accent-rose-600"
                        />
                        <span>Office</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-3 pt-3">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase rounded-xl cursor-pointer"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(false)}
                        className="px-4 py-2.5 border border-slate-300 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Saved Addresses List */
                  <div className="space-y-3">
                    {addresses.map((addr) => {
                      const selected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start justify-between ${
                            selected
                              ? 'border-rose-600 bg-rose-50/20'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">{addr.name}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                                {addr.type}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] text-rose-600 font-bold">Default</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {addr.house}, {addr.street}, {addr.locality}, {addr.city}, {addr.state} -{' '}
                              <strong className="text-slate-800">{addr.pincode}</strong>
                            </p>
                            <p className="text-xs text-slate-500 font-mono">Mobile: {addr.phone}</p>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                              selected ? 'border-rose-600 bg-rose-600' : 'border-slate-300'
                            }`}
                          >
                            {selected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      );
                    })}

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={() => setStep(2)}
                        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <span>Continue to Delivery</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: DELIVERY SPEED */}
            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-rose-600" />
                    <h2 className="text-lg font-bold text-slate-900 font-serif">
                      Choose Delivery Option
                    </h2>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Address</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <label
                    onClick={() => setDeliveryMethod('standard')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      deliveryMethod === 'standard'
                        ? 'border-rose-600 bg-rose-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          Standard Delivery (BlueDart Express)
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          FREE
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Estimated arrival: 2 to 4 business days
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        deliveryMethod === 'standard'
                          ? 'border-rose-600 bg-rose-600'
                          : 'border-slate-300'
                      }`}
                    >
                      {deliveryMethod === 'standard' && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod('express')}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      deliveryMethod === 'express'
                        ? 'border-rose-600 bg-rose-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          Priority Air Express (Next Day)
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                          ₹99
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Guaranteed arrival within 24–36 hours
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        deliveryMethod === 'express'
                          ? 'border-rose-600 bg-rose-600'
                          : 'border-slate-300'
                      }`}
                    >
                      {deliveryMethod === 'express' && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Back to Address
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-rose-600" />
                    <h2 className="text-lg font-bold text-slate-900 font-serif">
                      Choose Payment Method
                    </h2>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>256-Bit SSL Encrypted</span>
                  </div>
                </div>

                {/* Payment Selection Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                    { id: 'Card', label: 'Cards', icon: CreditCard },
                    { id: 'Net Banking', label: 'NetBanking', icon: Building },
                    { id: 'COD', label: 'Cash on Delivery', icon: Banknote },
                  ].map((m) => {
                    const active = paymentMethod === m.id;
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          active
                            ? 'border-rose-600 bg-rose-50/30 text-rose-700 font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-panels for selected payment */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  {paymentMethod === 'UPI' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                          <QrCode className="w-7 h-7 text-slate-800" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            Instant UPI Payment
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Google Pay, PhonePe, Paytm, CRED or any UPI App
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Enter UPI ID
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. yourname@okhdfcbank"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-medium focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Card' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Net Banking' && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-700 block">
                        Select Popular Bank
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank'].map(
                          (bank) => (
                            <button
                              key={bank}
                              onClick={() => setSelectedBank(bank)}
                              className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-colors cursor-pointer ${
                                selectedBank === bank
                                  ? 'border-slate-900 bg-white shadow-xs'
                                  : 'border-slate-200 text-slate-600 bg-white/60'
                              }`}
                            >
                              {bank}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'COD' && (
                    <div className="text-xs text-slate-700 space-y-2">
                      <p className="font-semibold text-slate-900">
                        Cash on Delivery is available for your address!
                      </p>
                      <p className="text-slate-500">
                        You can pay with Cash, UPI, or Card directly to the delivery partner at your doorstep.
                      </p>
                    </div>
                  )}
                </div>

                {/* Final Order Action */}
                <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-2.5 text-center min-h-[40px]"
                  >
                    Back to Delivery
                  </button>

                  <button
                    onClick={handleCompleteOrder}
                    disabled={isProcessingPayment}
                    className="px-6 sm:px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[48px]"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                        <span>Securing Transaction...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 shrink-0" />
                        <span className="truncate">Pay ₹{cartFinalTotal.toLocaleString('en-IN')} & Place Order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
                Order Summary ({cart.length} items)
              </h3>

              {/* Items preview list */}
              <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <img
                      src={getPrimaryProductImage(item.product, item.variantId).imageUrl}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover rounded-lg bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Size: {item.selectedSize} · Qty: {item.quantity}
                      </p>
                      <p className="font-bold text-slate-900 tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financials */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Item Total</span>
                  <span className="tabular-nums">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span className="tabular-nums">-₹{cartTotalDiscount.toLocaleString('en-IN')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Savings</span>
                    <span className="tabular-nums">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span className="tabular-nums font-extrabold">
                    ₹{cartFinalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2 text-[11px] text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Protected by ApnaCart 7-Day Hassle-Free Return Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
