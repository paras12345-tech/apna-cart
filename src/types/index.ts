export type Gender = 'Men' | 'Women' | 'Kids' | 'Beauty' | 'Unisex';

export type MainCategory = 'Men' | 'Women' | 'Kids' | 'Beauty' | 'Footwear' | 'Accessories';

export interface ProductVariant {
  size: string;
  inStock: boolean;
  stockCount: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  variantId?: string;
  imageUrl: string;
  thumbnailUrl: string;
  mediumUrl: string;
  largeUrl: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: MainCategory;
  subcategory: string;
  gender: Gender;
  description: string;
  images: ProductImage[];
  price: number;
  originalPrice: number;
  discount: number; // percentage
  rating: number;
  reviewCount: number;
  sizes: string[];
  colors: { name: string; hex: string; variantId?: string }[];
  inventory: number;
  sku: string;
  tags: string[];
  specifications: Record<string, string | undefined>;
  care: string;
  material: string;
  inStock: boolean;
  featured?: boolean;
  bestseller?: boolean;
  newDrop?: boolean;
  badge?: string;
}

export interface CartItem {
  id: string; // unique cart line item id
  productId: string;
  variantId?: string;
  product: Product;
  selectedSize: string;
  selectedColor: { name: string; hex: string; variantId?: string };
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  house: string;
  street: string;
  locality: string;
  city: string;
  state: string;
  type: 'HOME' | 'OFFICE';
  isDefault: boolean;
}

export type OrderStatus = 'Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export interface Order {
  id: string;
  items: CartItem[];
  address: Address;
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'COD';
  subtotal: number;
  discount: number;
  couponDiscount: number;
  couponCode?: string;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  placedAt: string;
  estimatedDelivery: string;
  trackingNumber: string;
  courierName: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  expiryDate: string;
  active: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  avatar?: string;
}

export type SortOption =
  | 'recommended'
  | 'popular'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'discount';

export interface FilterState {
  category?: MainCategory | 'All';
  subcategory?: string;
  gender: Gender[];
  priceRange: [number, number];
  brands: string[];
  minDiscount: number;
  sizes: string[];
  colors: string[];
  minRating: number;
  inStockOnly: boolean;
  searchQuery: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'error';
}
