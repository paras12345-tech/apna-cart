import React, { useState } from 'react';
import {
  User as UserIcon,
  Package,
  MapPin,
  Ticket,
  Settings,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Address } from '../types';
import { getPrimaryProductImage } from '../utils/productImages';

export const UserProfileView: React.FC = () => {
  const {
    user,
    updateUser,
    orders,
    addresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    coupons,
    setSelectedOrderId,
    setCurrentView,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'coupons'>('profile');

  // Edit profile form state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [gender, setGender] = useState(user.gender);

  // New address form state
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<Address, 'id'>>({
    name: user.name,
    phone: user.phone,
    pincode: '',
    house: '',
    street: '',
    locality: '',
    city: '',
    state: '',
    type: 'HOME',
    isDefault: false,
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email, phone, gender });
  };

  const handleCreateAddr = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(newAddr);
    setShowAddAddr(false);
  };

  const handleTrackOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FBFBF9] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-6">
          My Account
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Navigation Sidebar (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            {/* User Profile Card Header */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-md">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-sm truncate">{user.name}</h3>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700">
                  ApnaCart Insider
                </span>
              </div>
            </div>

            {/* Mobile Horizontal Tabs */}
            <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <span>Orders</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white font-bold">
                  {orders.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition-colors cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                Addresses ({addresses.length})
              </button>
              <button
                onClick={() => setActiveTab('coupons')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition-colors cursor-pointer ${
                  activeTab === 'coupons'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                Coupons ({coupons.length})
              </button>
            </div>

            {/* Desktop Navigation Tabs */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden text-xs">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full p-4 flex items-center justify-between font-semibold transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-rose-50/50 text-rose-700 border-l-4 border-rose-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>Personal Details</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full p-4 flex items-center justify-between font-semibold transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-rose-50/50 text-rose-700 border-l-4 border-rose-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-slate-400" />
                  <span>Orders & Returns</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-bold">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full p-4 flex items-center justify-between font-semibold transition-colors cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-rose-50/50 text-rose-700 border-l-4 border-rose-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Saved Addresses</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-bold">
                  {addresses.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('coupons')}
                className={`w-full p-4 flex items-center justify-between font-semibold transition-colors cursor-pointer ${
                  activeTab === 'coupons'
                    ? 'bg-rose-50/50 text-rose-700 border-l-4 border-rose-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Ticket className="w-4 h-4 text-slate-400" />
                  <span>Coupons & Vouchers</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                  {coupons.length} Active
                </span>
              </button>
            </div>
          </div>

          {/* Main Tab Panels (8 cols) */}
          <div className="md:col-span-8">
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-serif">
                    Personal Profile Details
                  </h2>
                  <p className="text-xs text-slate-400">
                    Update your personal information and contact details
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary">Non-Binary / Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-serif">
                    Order History ({orders.length})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Track shipments, view invoices, and manage returns
                  </p>
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 rounded-2xl border border-slate-200 text-xs space-y-4 hover:border-slate-300 transition-colors"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div>
                            <span className="font-bold text-slate-900 text-sm">{ord.id}</span>
                            <span className="text-slate-400 block text-[11px]">
                              Placed on {new Date(ord.placedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700">
                              {ord.status}
                            </span>
                            <span className="font-bold text-sm text-slate-900 tabular-nums">
                              ₹{ord.total.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Package Items */}
                        <div className="space-y-2">
                          {ord.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <img
                                  src={getPrimaryProductImage(item.product, item.variantId).imageUrl}
                                  alt={item.product.name}
                                  className="w-10 h-12 object-cover rounded bg-slate-100"
                                />
                                <div>
                                  <p className="font-semibold text-slate-800">{item.product.name}</p>
                                  <p className="text-slate-400 text-[11px]">
                                    Size: {item.selectedSize} · Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <span className="text-slate-700 font-medium tabular-nums">
                                ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Footer Action */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-slate-500 text-[11px]">
                            Paid via {ord.paymentMethod}
                          </span>
                          <button
                            onClick={() => handleTrackOrder(ord.id)}
                            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5 text-xs shadow-xs"
                          >
                            <span>Track Shipment</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <p>No orders placed yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 font-serif">
                      Saved Delivery Addresses
                    </h2>
                    <p className="text-xs text-slate-400">
                      Manage default and secondary delivery addresses
                    </p>
                  </div>
                  {!showAddAddr && (
                    <button
                      onClick={() => setShowAddAddr(true)}
                      className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Address</span>
                    </button>
                  )}
                </div>

                {showAddAddr ? (
                  <form onSubmit={handleCreateAddr} className="p-5 border border-slate-200 rounded-xl space-y-4 text-xs">
                    <h3 className="font-bold text-slate-900">Add New Address</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Recipient Name"
                        required
                        value={newAddr.name}
                        onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Phone Number"
                        required
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        required
                        maxLength={6}
                        value={newAddr.pincode}
                        onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                        className="px-3 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        required
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Flat, House No, Apartment"
                      required
                      value={newAddr.house}
                      onChange={(e) => setNewAddr({ ...newAddr, house: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Street, Landmark"
                      value={newAddr.street}
                      onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddAddr(false)}
                        className="px-4 py-2 border rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-4 rounded-xl border text-xs space-y-2 flex flex-col justify-between ${
                          addr.isDefault ? 'border-rose-600 bg-rose-50/20' : 'border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-900">{addr.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                              {addr.type}
                            </span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">
                            {addr.house}, {addr.street}, {addr.city} - {addr.pincode}
                          </p>
                          <p className="text-slate-500 font-mono mt-1">Phone: {addr.phone}</p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          {!addr.isDefault && (
                            <button
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-rose-600 font-bold hover:underline cursor-pointer"
                            >
                              Set as Default
                            </button>
                          )}
                          {addr.isDefault && (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Default Address
                            </span>
                          )}
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Delete Address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* COUPONS TAB */}
            {activeTab === 'coupons' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-serif">
                    Coupons & Offers
                  </h2>
                  <p className="text-xs text-slate-400">
                    Apply these exclusive promo codes during checkout to save big
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coupons.map((c) => (
                    <div
                      key={c.code}
                      className="p-4 rounded-xl border border-dashed border-rose-300 bg-rose-50/20 text-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 bg-white border border-rose-200 font-mono font-bold text-rose-700 rounded shadow-xs">
                          {c.code}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(c.code);
                            showToast('Coupon Copied', `Code ${c.code} copied to clipboard!`);
                          }}
                          className="text-xs font-bold text-slate-900 hover:text-rose-600 cursor-pointer"
                        >
                          Copy Code
                        </button>
                      </div>
                      <p className="text-slate-700">{c.description}</p>
                      <div className="text-[10px] text-slate-400 border-t border-rose-100 pt-2">
                        Min spend: ₹{c.minOrderValue} · Valid until {c.expiryDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
