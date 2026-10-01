import React from 'react';
import { CheckCircle2, Package, MapPin, CreditCard, ArrowRight, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductImage } from './ProductImage';
import { getPrimaryProductImage } from '../utils/productImages';

export const OrderSuccessView: React.FC = () => {
  const { orders, selectedOrderId, setCurrentView, setSelectedOrderId } = useApp();

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!currentOrder) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-600">No recent order found.</p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  const handleTrack = () => {
    setSelectedOrderId(currentOrder.id);
    setCurrentView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-12 sm:py-20 bg-[#FBFBF9] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-lg text-center space-y-6">
          {/* Success Check Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Payment Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Order Placed Successfully!
            </h1>
            <p className="text-xs text-slate-500 font-mono pt-1">
              Order Reference: <strong className="text-slate-800">{currentOrder.id}</strong>
            </p>
          </div>

          {/* Highlights Box */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left text-xs space-y-3.5">
            <div className="flex items-start gap-3">
              <Package className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">
                  Delivery by {currentOrder.estimatedDelivery}
                </span>
                <span className="text-slate-500">
                  Via {currentOrder.courierName} ({currentOrder.trackingNumber})
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Delivering to:</span>
                <span className="text-slate-600">
                  {currentOrder.address.name} · {currentOrder.address.house}, {currentOrder.address.street},{' '}
                  {currentOrder.address.city} - {currentOrder.address.pincode}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Payment Summary:</span>
                <span className="text-slate-600">
                  Total Paid: <strong>₹{currentOrder.total.toLocaleString('en-IN')}</strong> via {currentOrder.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Items Purchased Preview */}
          <div className="text-left pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Package Items ({currentOrder.items.length})
            </span>
            <div className="divide-y divide-slate-100">
              {currentOrder.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-12 rounded overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
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
                    <div>
                      <p className="font-semibold text-slate-900">{item.product.name}</p>
                      <p className="text-[11px] text-slate-400">
                        Size: {item.selectedSize} · Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <button
              onClick={handleTrack}
              className="py-3 px-5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Track Live Shipment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('catalog')}
              className="py-3 px-5 border border-slate-300 hover:border-slate-800 bg-white text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
