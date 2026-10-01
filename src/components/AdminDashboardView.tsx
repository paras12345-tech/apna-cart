import React, { useState } from 'react';
import {
  Shield,
  Package,
  ShoppingBag,
  Ticket,
  Users,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Boxes,
  Image as ImageIcon,
  Upload,
  Star,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, ProductImage as ProductImageType, OrderStatus, Coupon, MainCategory, Gender } from '../types';
import { generateProductSVG, createProductImage, getPrimaryProductImage } from '../utils/productImages';
import { ProductImage } from './ProductImage';

export const AdminDashboardView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    coupons,
    addCoupon,
    toggleCouponActive,
    setCurrentView,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'coupons'>('analytics');

  // Search & filter for products table
  const [productSearch, setProductSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Product Form state
  const [newProd, setNewProd] = useState({
    name: '',
    brand: '',
    category: 'Men' as MainCategory,
    subcategory: 'T-Shirts',
    gender: 'Men' as Gender,
    price: 999,
    originalPrice: 1999,
    inventory: 50,
    sizes: 'S, M, L, XL',
    colorName: 'Classic Black',
    colorHex: '#0F172A',
    description: '',
  });

  // New Coupon Form state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(15);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(1499);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Analytics KPI calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 482500;
  const totalOrdersCount = orders.length + 384;
  const totalProductsCount = products.length;
  const lowStockCount = products.filter((p) => p.inventory < 20).length;

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.brand) {
      showToast('Validation Error', 'Product name and brand are required.', 'error');
      return;
    }

    const sizesArr = newProd.sizes.split(',').map((s) => s.trim()).filter(Boolean);
    const discount = Math.round(((newProd.originalPrice - newProd.price) / newProd.originalPrice) * 100);
    const img0 = generateProductSVG(newProd.category, newProd.subcategory, newProd.name, newProd.brand, newProd.colorHex, 0);
    const img1 = generateProductSVG(newProd.category, newProd.subcategory, newProd.name, newProd.brand, newProd.colorHex, 1);

    const newProdId = `prod-${Date.now()}`;
    addProduct({
      name: newProd.name,
      brand: newProd.brand,
      category: newProd.category,
      subcategory: newProd.subcategory,
      gender: newProd.gender,
      description: newProd.description || `Premium apparel piece by ${newProd.brand}.`,
      images: [
        createProductImage({
          productId: newProdId,
          imageUrl: img0,
          altText: `${newProd.name} by ${newProd.brand}`,
          sortOrder: 1,
          isPrimary: true,
        }),
        createProductImage({
          productId: newProdId,
          imageUrl: img1,
          altText: `${newProd.name} Detail Angle`,
          sortOrder: 2,
          isPrimary: false,
        }),
      ],
      price: Number(newProd.price),
      originalPrice: Number(newProd.originalPrice),
      discount,
      rating: 4.5,
      reviewCount: 1,
      sizes: sizesArr.length ? sizesArr : ['Standard'],
      colors: [{ name: newProd.colorName, hex: newProd.colorHex }],
      inventory: Number(newProd.inventory),
      sku: `APNA-${Date.now().toString().slice(-6)}`,
      tags: ['New', newProd.category, newProd.subcategory],
      specifications: { 'Origin': 'Made in India', 'Fit': 'Regular Fit' },
      care: 'Hand wash or dry clean',
      material: '100% Premium Fabric Blend',
      inStock: Number(newProd.inventory) > 0,
      newDrop: true,
    });

    setIsAddModalOpen(false);
    setNewProd({
      name: '',
      brand: '',
      category: 'Men',
      subcategory: 'T-Shirts',
      gender: 'Men',
      price: 999,
      originalPrice: 1999,
      inventory: 50,
      sizes: 'S, M, L, XL',
      colorName: 'Classic Black',
      colorHex: '#0F172A',
      description: '',
    });
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const c: Coupon = {
      code: newCouponCode.toUpperCase(),
      discountPercent: newCouponPercent,
      minOrderValue: newCouponMinOrder,
      description: newCouponDesc || `${newCouponPercent}% off on orders above ₹${newCouponMinOrder}`,
      expiryDate: '2026-12-31',
      active: true,
    };
    addCoupon(c);
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  const filteredCatalog = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="py-8 sm:py-12 bg-slate-900 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
              title="Return to Storefront"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-500" />
                <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight">
                  ApnaCart Merchant Control Center
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time marketplace operations, orders fulfillment, catalog management & inventory
              </p>
            </div>
          </div>

          {/* Quick tab switches */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'analytics' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'products' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Catalog ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'orders' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'coupons' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Coupons
            </button>
          </div>
        </div>

        {/* OVERVIEW / ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Gross GMV Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18.4% vs last month</span>
                </div>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Orders Placed</span>
                  <ShoppingBag className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  {totalOrdersCount}
                </div>
                <div className="text-[11px] text-slate-400">
                  {orders.length} active in current session
                </div>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Active SKUs in Catalog</span>
                  <Boxes className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  {totalProductsCount}
                </div>
                <div className="text-[11px] text-sky-400">
                  Across 6 Main Categories
                </div>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Low Inventory Alert</span>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-amber-400">
                  {lowStockCount} items
                </div>
                <div className="text-[11px] text-slate-400">
                  Inventory re-order recommended
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Recent Fulfillment Queue
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300"
                >
                  Manage All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Items</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60 text-slate-300">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-700/30">
                        <td className="py-3 px-3 font-mono font-bold text-white">{ord.id}</td>
                        <td className="py-3 px-3">{ord.address.name}</td>
                        <td className="py-3 px-3">{ord.items.length} items</td>
                        <td className="py-3 px-3 font-mono font-bold">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => {
                              setActiveTab('orders');
                            }}
                            className="text-xs font-semibold text-rose-400 hover:underline cursor-pointer"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS CATALOG MANAGEMENT TAB */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by brand, title, SKU..."
                className="px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 w-full sm:w-80"
              />

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-800 z-10">
                    <tr className="border-b border-slate-700 text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Price</th>
                      <th className="py-3 px-3">Stock</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60 text-slate-300">
                    {filteredCatalog.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-700/30">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={getPrimaryProductImage(prod).imageUrl}
                            alt={prod.name}
                            className="w-10 h-12 object-cover rounded bg-slate-900 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">
                              {prod.brand}
                            </span>
                            <span className="font-semibold text-white truncate block max-w-xs">
                              {prod.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              SKU: {prod.sku}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-slate-300">{prod.category}</span>
                          <span className="text-slate-500 block text-[10px]">{prod.subcategory}</span>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <span className="font-bold text-white">₹{prod.price}</span>
                          <span className="text-slate-500 line-through block text-[10px]">
                            ₹{prod.originalPrice}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <span
                            className={prod.inventory < 20 ? 'text-amber-400 font-bold' : 'text-slate-300'}
                          >
                            {prod.inventory} units
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() =>
                              updateProduct(prod.id, {
                                inStock: !prod.inStock,
                                inventory: prod.inStock ? 0 : 25,
                              })
                            }
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                              prod.inStock
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {prod.inStock ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                const newPrice = prompt('Enter new discounted price (₹):', String(prod.price));
                                if (newPrice && !isNaN(Number(newPrice))) {
                                  updateProduct(prod.id, { price: Number(newPrice) });
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 cursor-pointer"
                              title="Edit price"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete "${prod.name}" from catalog?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-700 cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS MANAGEMENT TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Manage Orders & Fulfillment Status
            </h3>

            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-slate-800/80 rounded-2xl border border-slate-700 p-5 space-y-4 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700">
                    <div>
                      <span className="font-mono font-bold text-white text-sm">{ord.id}</span>
                      <span className="text-slate-400 block text-[11px]">
                        Placed on {new Date(ord.placedAt).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Change status dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Fulfillment Status:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1 text-xs font-bold text-rose-400 cursor-pointer focus:outline-none"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block mb-1 font-bold uppercase text-[10px]">
                        Customer & Shipping Address
                      </span>
                      <p className="font-semibold text-slate-200">{ord.address.name}</p>
                      <p className="text-slate-400 leading-relaxed">
                        {ord.address.house}, {ord.address.street}, {ord.address.city} - {ord.address.pincode}
                      </p>
                      <p className="text-slate-500 font-mono">Contact: {ord.address.phone}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1 font-bold uppercase text-[10px]">
                        Payment & Order Total
                      </span>
                      <p className="font-semibold text-slate-200">
                        Total Amount: <span className="font-mono text-white font-bold">₹{ord.total.toLocaleString('en-IN')}</span>
                      </p>
                      <p className="text-slate-400">Payment: {ord.paymentMethod}</p>
                      <p className="text-slate-400">
                        Courier: {ord.courierName} ({ord.trackingNumber})
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="pt-2 border-t border-slate-700/60 flex items-center gap-3 overflow-x-auto">
                    {ord.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 shrink-0 bg-slate-900/60 p-1.5 rounded-lg border border-slate-700/40">
                        <img
                          src={getPrimaryProductImage(item.product, item.variantId).imageUrl}
                          alt={item.product.name}
                          className="w-8 h-10 object-cover rounded"
                        />
                        <div>
                          <span className="font-semibold text-slate-200 truncate block max-w-[120px]">
                            {item.product.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Qty: {item.quantity} · Size: {item.selectedSize}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COUPONS MANAGEMENT TAB */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            {/* Create Coupon Form */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Create New Promotional Voucher
              </h3>
              <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Code (e.g. DIWALI30)"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono uppercase"
                />
                <input
                  type="number"
                  placeholder="Discount %"
                  required
                  min={1}
                  max={90}
                  value={newCouponPercent}
                  onChange={(e) => setNewCouponPercent(Number(e.target.value))}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
                <input
                  type="number"
                  placeholder="Min Order (₹)"
                  required
                  value={newCouponMinOrder}
                  onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Create Voucher
                </button>
              </form>
            </div>

            {/* Existing Coupons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="bg-slate-800/80 rounded-xl border border-slate-700 p-4 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-rose-400">{c.code}</span>
                    <button
                      onClick={() => toggleCouponActive(c.code)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        c.active
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {c.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <p className="text-slate-300">{c.description}</p>
                  <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-700/60">
                    Min order: ₹{c.minOrderValue} · Expires: {c.expiryDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white font-serif">Add New Product to Catalog</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    placeholder="e.g. Classic Embroidered Silk Kurta"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Brand Label *</label>
                  <input
                    type="text"
                    required
                    value={newProd.brand}
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    placeholder="e.g. ApnaCart Studio"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value as MainCategory })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Subcategory</label>
                  <input
                    type="text"
                    value={newProd.subcategory}
                    onChange={(e) => setNewProd({ ...newProd, subcategory: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Gender</label>
                  <select
                    value={newProd.gender}
                    onChange={(e) => setNewProd({ ...newProd, gender: e.target.value as Gender })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Original MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProd.originalPrice}
                    onChange={(e) => setNewProd({ ...newProd, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={newProd.inventory}
                    onChange={(e) => setNewProd({ ...newProd, inventory: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={newProd.sizes}
                    onChange={(e) => setNewProd({ ...newProd, sizes: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    placeholder="S, M, L, XL"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Primary Color Name & Hex</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newProd.colorName}
                      onChange={(e) => setNewProd({ ...newProd, colorName: e.target.value })}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      placeholder="Navy Blue"
                    />
                    <input
                      type="color"
                      value={newProd.colorHex}
                      onChange={(e) => setNewProd({ ...newProd, colorHex: e.target.value })}
                      className="w-10 h-8 rounded border border-slate-700 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  placeholder="Enter details on fabric, fit, styling notes..."
                />
              </div>

              <div className="pt-3 border-t border-slate-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-600 rounded-xl text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl"
                >
                  Publish to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
