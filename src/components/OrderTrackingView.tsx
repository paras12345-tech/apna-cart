import React from 'react';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Home,
  ArrowLeft,
  Download,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import { getPrimaryProductImage } from '../utils/productImages';

export const OrderTrackingView: React.FC = () => {
  const { orders, selectedOrderId, updateOrderStatus, setCurrentView } = useApp();

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!currentOrder) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-600">No order selected for tracking.</p>
        <button
          onClick={() => setCurrentView('orders')}
          className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase"
        >
          View All Orders
        </button>
      </div>
    );
  }

  const stages: { label: OrderStatus; desc: string; icon: any }[] = [
    { label: 'Placed', desc: 'Order received by ApnaCart systems', icon: Clock },
    { label: 'Confirmed', desc: 'Seller verified & reserved inventory', icon: CheckCircle2 },
    { label: 'Packed', desc: 'Packaged in tamper-proof seal at hub', icon: Package },
    { label: 'Shipped', desc: 'Handed over to BlueDart Air Express', icon: Truck },
    { label: 'Out for Delivery', desc: 'Arrived at local hub and out with courier', icon: Truck },
    { label: 'Delivered', desc: 'Delivered to your doorstep', icon: Home },
  ];

  const currentStageIndex = stages.findIndex((s) => s.label === currentOrder.status);

  const advanceStage = () => {
    if (currentStageIndex < stages.length - 1) {
      const nextStatus = stages[currentStageIndex + 1].label;
      updateOrderStatus(currentOrder.id, nextStatus);
    }
  };

  const resetStage = () => {
    updateOrderStatus(currentOrder.id, 'Placed');
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FBFBF9] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setCurrentView('orders')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-400 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Invoice</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-8">
          {/* Order Details Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-widest block mb-1">
                Shipment Tracking
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                Order #{currentOrder.id}
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                AWB Tracking: {currentOrder.trackingNumber} · Courier: {currentOrder.courierName}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Estimated Arrival</span>
              <span className="text-base font-bold text-slate-900">
                {currentOrder.estimatedDelivery}
              </span>
            </div>
          </div>

          {/* Interactive Simulation Strip for evaluation testing */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-600">
              Current Shipment Status:{' '}
              <strong className="text-rose-600 font-bold uppercase">{currentOrder.status}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={advanceStage}
                disabled={currentStageIndex === stages.length - 1}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Simulate Next Stage</span>
              </button>
              <button
                onClick={resetStage}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200"
                title="Reset simulation to Placed"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visual 6-Stage Timeline */}
          <div className="py-4">
            <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-6 relative">
              {/* Desktop Connecting Line */}
              <div className="hidden sm:block absolute top-6 left-6 right-6 h-1 bg-slate-200 -z-0">
                <div
                  className="bg-rose-600 h-full transition-all duration-500"
                  style={{
                    width: `${(currentStageIndex / (stages.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {stages.map((stg, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const Icon = stg.icon;

                return (
                  <div
                    key={stg.label}
                    className="relative z-10 flex sm:flex-col items-start sm:items-center gap-4 sm:gap-2 group text-left sm:text-center"
                  >
                    {/* Mobile vertical connecting line */}
                    {idx < stages.length - 1 && (
                      <div
                        className={`sm:hidden absolute left-6 top-12 bottom-0 w-0.5 -mb-6 -translate-x-1/2 z-0 ${
                          idx < currentStageIndex ? 'bg-rose-600' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    {/* Circle Node */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm shrink-0 relative z-10 ${
                        isCurrent
                          ? 'bg-rose-600 text-white ring-4 ring-rose-100 scale-110'
                          : isPassed
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Stage Label & Details */}
                    <div>
                      <p
                        className={`text-xs font-bold leading-tight ${
                          isPassed ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {stg.label}
                      </p>
                      <p className="text-[10px] text-slate-500 leading-tight mt-1 hidden sm:block max-w-[120px]">
                        {stg.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipment Details Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 text-xs">
            {/* Delivery Destination */}
            <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider block">
                Destination Address
              </span>
              <p className="font-semibold text-slate-800">{currentOrder.address.name}</p>
              <p className="text-slate-600 leading-relaxed">
                {currentOrder.address.house}, {currentOrder.address.street},{' '}
                {currentOrder.address.locality}, {currentOrder.address.city}, {currentOrder.address.state} -{' '}
                <strong>{currentOrder.address.pincode}</strong>
              </p>
              <p className="text-slate-500">Phone: {currentOrder.address.phone}</p>
            </div>

            {/* Courier & Logistic Info */}
            <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
              <span className="font-bold text-slate-900 uppercase tracking-wider block">
                Logistics Partner
              </span>
              <p className="font-semibold text-slate-800">{currentOrder.courierName}</p>
              <p className="text-slate-600">
                Air Freight tracking code: <strong className="font-mono">{currentOrder.trackingNumber}</strong>
              </p>
              <p className="text-slate-500">
                Doorstep verification: OTP required upon delivery
              </p>
            </div>
          </div>

          {/* Package Contents List */}
          <div className="pt-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Items in this Shipment ({currentOrder.items.length})
            </h3>
            <div className="space-y-3">
              {currentOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getPrimaryProductImage(item.product, item.variantId).imageUrl}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover rounded-lg bg-slate-100"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {item.product.brand}
                      </span>
                      <p className="font-semibold text-slate-900">{item.product.name}</p>
                      <p className="text-slate-500">
                        Size: {item.selectedSize} · Quantity: {item.quantity}
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
        </div>
      </div>
    </div>
  );
};
