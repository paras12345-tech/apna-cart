import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Address,
  Order,
  OrderStatus,
  Coupon,
  User,
  FilterState,
  ToastMessage,
  MainCategory,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_ADDRESSES } from '../data/mockProducts';

interface AppContextType {
  // Navigation & View
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (orderId: string | null) => void;
  navigateToProduct: (product: Product) => void;
  navigateToCategory: (category: MainCategory | 'All', subcategory?: string) => void;

  // Catalog & Products
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Filters & Search
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, color?: { name: string; hex: string }, qty?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartTotalDiscount: number;
  couponDiscount: number;
  deliveryFee: number;
  cartFinalTotal: number;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCartFromWishlist: (productId: string, size?: string) => void;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCouponActive: (code: string) => void;

  // Addresses
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, updated: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Orders & Checkout
  orders: Order[];
  createOrder: (
    address: Address,
    deliveryMethod: 'standard' | 'express',
    paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'COD'
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // User Profile & Auth
  user: User;
  updateUser: (updated: Partial<User>) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;

  // Recently Viewed
  recentlyViewed: string[];
  addToRecentlyViewed: (productId: string) => void;

  // Modals & Drawers
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  sizeGuideOpen: boolean;
  setSizeGuideOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;

  // Toast Notifications
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const defaultFilters: FilterState = {
  category: 'All',
  subcategory: '',
  gender: [],
  priceRange: [0, 10000],
  brands: [],
  minDiscount: 0,
  sizes: [],
  colors: [],
  minRating: 0,
  inStockOnly: false,
  searchQuery: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Products with strict storage migration & image integrity check
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('apnacart_products_v4_img_fix');
    if (saved) {
      try {
        const parsed: Product[] = JSON.parse(saved);
        const isValid = parsed.every(
          (p) =>
            p.id &&
            Array.isArray(p.images) &&
            p.images.length > 0 &&
            p.images.every((img) => img.productId === p.id)
        );
        if (isValid) return parsed;
      } catch (e) {
        console.error('Error validating stored products:', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('apnacart_products_v4_img_fix', JSON.stringify(products));
  }, [products]);

  // Filters & Search
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('apnacart_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('apnacart_cart', JSON.stringify(cart));
  }, [cart]);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('apnacart_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return ['men-1', 'women-3', 'footwear-1'];
  });

  useEffect(() => {
    localStorage.setItem('apnacart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('apnacart_coupons');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_COUPONS;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('apnacart_addresses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ADDRESSES;
  });

  useEffect(() => {
    localStorage.setItem('apnacart_addresses', JSON.stringify(addresses));
  }, [addresses]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('apnacart_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Initial sample placed order
    const sampleProduct = INITIAL_PRODUCTS[0];
    return [
      {
        id: 'APNA-2026-9182',
        items: [
          {
            id: 'sample-cart-item-1',
            product: sampleProduct,
            selectedSize: 'L',
            selectedColor: sampleProduct.colors[0],
            quantity: 1,
          },
        ],
        address: INITIAL_ADDRESSES[0],
        deliveryMethod: 'standard',
        paymentMethod: 'UPI',
        subtotal: 1799,
        discount: 900,
        couponDiscount: 0,
        deliveryFee: 0,
        total: 899,
        status: 'Shipped',
        placedAt: '2026-09-28T14:30:00.000Z',
        estimatedDelivery: 'Oct 03, 2026',
        trackingNumber: 'DEL-BD-881920',
        courierName: 'Blue Dart Express',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('apnacart_orders', JSON.stringify(orders));
  }, [orders]);

  // User
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('apnacart_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      id: 'usr-001',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      phone: '+91 98765 43210',
      gender: 'Male',
    };
  });

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem('apnacart_recent');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return ['men-1', 'women-1', 'footwear-1', 'beauty-1'];
  });

  // Modals & Quick View
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    addToRecentlyViewed(product.id);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (category: MainCategory | 'All', subcategory?: string) => {
    setFilters((prev) => ({
      ...prev,
      category,
      subcategory: subcategory || '',
      searchQuery: '',
    }));
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const updated = [productId, ...prev.filter((id) => id !== productId)].slice(0, 10);
      localStorage.setItem('apnacart_recent', JSON.stringify(updated));
      return updated;
    });
  };

  // Cart handlers
  const addToCart = (
    product: Product,
    size: string,
    color = product.colors[0],
    qty = 1
  ) => {
    const variantId = color?.variantId || 'primary';
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size && item.variantId === variantId
      );

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += qty;
        return copy;
      }

      const newItem: CartItem = {
        id: `${product.id}-${size}-${variantId}-${Date.now()}`,
        productId: product.id,
        variantId,
        product,
        selectedSize: size,
        selectedColor: color,
        quantity: qty,
      };
      return [...prev, newItem];
    });

    showToast('Added to Bag', `${product.name} (Size: ${size}) added to your shopping bag.`);
  };

  const removeFromCart = (cartItemId: string) => {
    const item = cart.find((i) => i.id === cartItemId);
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    if (item) {
      showToast('Removed from Bag', `${item.product.name} removed from your bag.`, 'info');
    }
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist handlers
  const toggleWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    const prodName = product ? product.name : 'Product';

    if (wishlist.includes(productId)) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from Wishlist', `${prodName} removed from wishlist.`, 'info');
    } else {
      setWishlist((prev) => [...prev, productId]);
      showToast('Added to Wishlist', `${prodName} saved to your wishlist.`);
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const moveToCartFromWishlist = (productId: string, size?: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const chosenSize = size || product.sizes[0] || 'Standard';
    addToCart(product, chosenSize);
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  // Coupon handlers
  const applyCoupon = (code: string): boolean => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);
    if (!found) {
      showToast('Invalid Coupon', 'The entered promo code is invalid or expired.', 'error');
      return false;
    }

    if (cartSubtotal < found.minOrderValue) {
      showToast(
        'Minimum Order Not Met',
        `Add items worth ₹${found.minOrderValue - cartSubtotal} more to use ${found.code}.`,
        'error'
      );
      return false;
    }

    setAppliedCoupon(found);
    showToast('Coupon Applied!', `You saved with ${found.code}!`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon Removed', 'Coupon discount has been removed.', 'info');
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    showToast('Coupon Created', `Coupon ${coupon.code} created successfully.`);
  };

  const toggleCouponActive = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
  };

  // Addresses
  const addAddress = (newAddr: Omit<Address, 'id'>) => {
    const id = 'addr-' + Date.now();
    const created: Address = { ...newAddr, id };
    if (created.isDefault) {
      setAddresses((prev) => [created, ...prev.map((a) => ({ ...a, isDefault: false }))]);
    } else {
      setAddresses((prev) => [created, ...prev]);
    }
    showToast('Address Saved', 'New delivery address has been saved.');
  };

  const updateAddress = (id: string, updated: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...updated };
        }
        if (updated.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      })
    );
    showToast('Address Updated', 'Delivery address updated successfully.');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Address Deleted', 'Delivery address removed.', 'info');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  // Orders
  const createOrder = (
    address: Address,
    deliveryMethod: 'standard' | 'express',
    paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'COD'
  ): Order => {
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: `APNA-2026-${orderNum}`,
      items: [...cart],
      address,
      deliveryMethod,
      paymentMethod,
      subtotal: cartSubtotal,
      discount: cartTotalDiscount,
      couponDiscount,
      couponCode: appliedCoupon?.code,
      deliveryFee,
      total: cartFinalTotal,
      status: 'Placed',
      placedAt: new Date().toISOString(),
      estimatedDelivery: 'within 2-4 business days',
      trackingNumber: `APNA-${Math.floor(100000 + Math.random() * 900000)}`,
      courierName: 'Delhivery Express Logistics',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    setSelectedOrderId(newOrder.id);
    showToast('Order Placed Successfully!', `Order #${newOrder.id} has been recorded.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast('Order Status Updated', `Order ${orderId} is now ${status}.`);
  };

  // Products CRUD for Admin with strict image relationship enforcement
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `custom-${Date.now()}`;
    const verifiedImages = (newProd.images || []).map((img, idx) => ({
      ...img,
      id: `${id}-img-${idx + 1}`,
      productId: id,
    }));
    const product: Product = { ...newProd, id, images: verifiedImages };
    setProducts((prev) => [product, ...prev]);
    showToast('Product Added', `${product.name} added to catalog.`);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const verified = { ...p, ...updated };
        if (updated.images) {
          verified.images = updated.images.map((img, idx) => ({
            ...img,
            id: img.id || `${id}-img-${idx + 1}`,
            productId: id,
          }));
        }
        return verified;
      })
    );
    showToast('Product Updated', 'Product changes saved successfully.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product Deleted', 'Product removed from catalog.', 'info');
  };

  // User
  const updateUser = (updated: Partial<User>) => {
    setUser((prev) => {
      const u = { ...prev, ...updated };
      localStorage.setItem('apnacart_user', JSON.stringify(u));
      return u;
    });
    showToast('Profile Updated', 'Your profile details have been saved.');
  };

  // Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );

  const discountedProductTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartTotalDiscount = cartSubtotal - discountedProductTotal;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      const calculated = Math.round((discountedProductTotal * appliedCoupon.discountPercent) / 100);
      couponDiscount = appliedCoupon.maxDiscount
        ? Math.min(calculated, appliedCoupon.maxDiscount)
        : calculated;
    } else if (appliedCoupon.discountAmount) {
      couponDiscount = appliedCoupon.discountAmount;
    }
  }

  const deliveryFee = discountedProductTotal >= 999 || cart.length === 0 ? 0 : 99;
  const cartFinalTotal = Math.max(0, discountedProductTotal - couponDiscount + deliveryFee);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProduct,
        setSelectedProduct,
        selectedOrderId,
        setSelectedOrderId,
        navigateToProduct,
        navigateToCategory,

        products,
        setProducts,
        addProduct,
        updateProduct,
        deleteProduct,

        filters,
        setFilters,
        resetFilters,
        searchModalOpen,
        setSearchModalOpen,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTotalDiscount,
        couponDiscount,
        deliveryFee,
        cartFinalTotal,

        wishlist,
        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,

        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        toggleCouponActive,

        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,

        orders,
        createOrder,
        updateOrderStatus,

        user,
        updateUser,
        isLoggedIn,
        setIsLoggedIn,

        recentlyViewed,
        addToRecentlyViewed,

        quickViewProduct,
        setQuickViewProduct,
        sizeGuideOpen,
        setSizeGuideOpen,
        authModalOpen,
        setAuthModalOpen,

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
