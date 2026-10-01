import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Heart,
  Tag,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductImage } from './ProductImage';
import { getPrimaryProductImage } from '../utils/productImages';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotalDiscount,
    couponDiscount,
    deliveryFee,
    cartFinalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
    setCurrentView,
    toggleWishlist,
    showToast,
  } = useApp();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponModalOpen, setCouponModalOpen] = useState(false);

  const handleApplyCoupon = (code: string) => {
    const success = applyCoupon(code);
    if (success) {
      setCouponCodeInput('');
      setCouponModalOpen(false);
    }
  };

  const handleMoveToWishlist = (cartItemId: string, productId: string) => {
    toggleWishlist(productId);
    removeFromCart(cartItemId);
    showToast('Moved to Wishlist', 'Item has been shifted to your saved wishlist.');
  };

  if (cart.length === 0) {
    return (
      <div className="py-16 sm:py-24 bg-[#FBFBF9] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
            Your Shopping Bag is Empty
          </h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            Looks like you haven't added any fashion items to your bag yet.
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
          >
            Explore Styles Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#FBFBF9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-8">
          Shopping Bag ({cart.length} {cart.length === 1 ? 'Item' : 'Items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Cart Items List (7-8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free shipping progress indicator */}
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
              {cartSubtotal - cartTotalDiscount >= 999 ? (
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                  <Check className="w-4 h-4 bg-emerald-100 rounded-full p-0.5" />
                  <span>Yay! You've unlocked FREE Delivery on this order.</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
                    <span>
                      Add items worth{' '}
                      <strong className="text-rose-600">
                        ₹{999 - (cartSubtotal - cartTotalDiscount)}
                      </strong>{' '}
                      more for FREE Delivery!
                    </span>
                    <span className="font-bold">₹999</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          ((cartSubtotal - cartTotalDiscount) / 999) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* List of Cart Items */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-4"
                >
                  {/* Thumbnail & Info */}
                  <div className="flex gap-3 sm:gap-4">
                    <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden shrink-0 self-start border border-slate-200/80">
                      <ProductImage
                        productId={item.product.id}
                        image={getPrimaryProductImage(item.product, item.variantId)}
                        alt={item.product.name}
                        size="thumbnail"
                        aspectRatio="3/4"
                        objectFit="cover"
                        className="w-full h-full"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                              {item.product.brand}
                            </span>
                            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                              {item.product.name}
                            </h3>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 cursor-pointer shrink-0 min-w-[32px] min-h-[32px] flex items-center justify-center"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Selected Attributes */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1.5">
                          <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold text-[11px]">
                            Size: {item.selectedSize}
                          </span>
                          {item.selectedColor && (
                            <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              <span
                                className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              <span className="truncate">{item.selectedColor.name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Price Row */}
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden text-xs">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold min-h-[32px]"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-1 font-bold text-slate-900 tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold min-h-[32px]"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleMoveToWishlist(item.id, item.product.id)}
                            className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer p-1"
                          >
                            <Heart className="w-3.5 h-3.5 shrink-0" />
                            <span className="hidden sm:inline">Wishlist</span>
                          </button>
                        </div>

                        {/* Line Item Price */}
                        <div className="text-right shrink-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-slate-400 line-through tabular-nums">
                            ₹{(item.product.originalPrice * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Order Summary & Coupon (4-5 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Coupon Box */}
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Apply Coupon
                  </span>
                </div>
                <button
                  onClick={() => setCouponModalOpen(true)}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  View Offers
                </button>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                  <div>
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      '{appliedCoupon.code}' Applied
                    </span>
                    <p className="text-emerald-700 text-[11px] mt-0.5">
                      {appliedCoupon.description}
                    </p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon (e.g. STYLE10)"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold uppercase text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                  <button
                    onClick={() => handleApplyCoupon(couponCodeInput)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase rounded-lg cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Bill Details Summary Card */}
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
                Price Breakdown
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Total MRP</span>
                  <span className="tabular-nums">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-emerald-600 font-semibold">
                  <span>Discount on MRP</span>
                  <span className="tabular-nums">-₹{cartTotalDiscount.toLocaleString('en-IN')}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold">
                    <span>Coupon Savings</span>
                    <span className="tabular-nums">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-600">
                  <span>Convenience & Delivery</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-semibold uppercase">FREE</span>
                  ) : (
                    <span className="tabular-nums">₹{deliveryFee}</span>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-lg tabular-nums text-slate-900 font-extrabold">
                    ₹{cartFinalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => setCurrentView('checkout')}
                className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Safe and Secure 256-Bit SSL Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Modal */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setCouponModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-10 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 font-serif">
                Available Coupons
              </h3>
              <button
                onClick={() => setCouponModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-80 overflow-y-auto">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="p-3.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 font-mono font-bold text-xs rounded">
                      {c.code}
                    </span>
                    <button
                      onClick={() => handleApplyCoupon(c.code)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded cursor-pointer transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-slate-600">{c.description}</p>
                  <div className="text-[10px] text-slate-400">
                    Min order: ₹{c.minOrderValue} · Expires: {c.expiryDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
