import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ProductImage } from './ProductImage';
import { getPrimaryProductImage, getSecondaryProductImage } from '../utils/productImages';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    isInWishlist,
    toggleWishlist,
    navigateToProduct,
    addToCart,
    setQuickViewProduct,
  } = useApp();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedQuickSize, setSelectedQuickSize] = useState<string | null>(null);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const inWish = isInWishlist(product.id);

  // Strictly isolated images belonging only to this product
  const primaryImage = getPrimaryProductImage(product);
  const secondaryImage = getSecondaryProductImage(product);
  const currentImage = isHovered ? secondaryImage : primaryImage;

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    addToCart(product, size);
    setSelectedQuickSize(size);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigateToProduct(product)}
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200/80 hover:border-slate-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] w-full bg-slate-100 overflow-hidden">
        {/* Isolated Product Image with skeleton shimmer and zero cross-product pollution */}
        <ProductImage
          productId={product.id}
          image={currentImage}
          alt={product.name}
          size="medium"
          aspectRatio="3/4"
          objectFit="cover"
          className="w-full h-full transition-all duration-500 ease-out group-hover:scale-105"
        />

        {/* Minimal Badge */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-white shadow-xs">
              {product.badge}
            </span>
          </div>
        )}

        {/* Floating Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer z-10 ${
            inWish
              ? 'bg-rose-50 text-rose-600 scale-105'
              : 'bg-white/95 text-slate-700 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              inWish ? 'fill-rose-600 scale-110' : 'hover:scale-110'
            }`}
          />
        </button>

        {/* Floating Quick View Button */}
        <button
          onClick={handleQuickViewClick}
          className="absolute bottom-12 right-2 sm:right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-sm cursor-pointer hidden sm:flex"
          aria-label="Quick preview"
          title="Quick preview"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Quick Size Overlay on Desktop Hover */}
        <div className="absolute inset-x-0 bottom-0 p-2 bg-white/95 backdrop-blur-xs border-t border-slate-100 transition-all duration-200 transform translate-y-full group-hover:translate-y-0 hidden sm:block">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 text-center truncate">
            {addedAnimation ? 'Item Added to Bag!' : 'Select Size for Quick Add'}
          </div>
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {product.sizes.slice(0, 5).map((size) => (
              <button
                key={size}
                onClick={(e) => handleQuickAdd(e, size)}
                className={`px-2 py-1 text-[11px] font-semibold rounded border transition-colors cursor-pointer min-h-[28px] ${
                  selectedQuickSize === size && addedAnimation
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-900 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {selectedQuickSize === size && addedAnimation ? (
                  <Check className="w-3 h-3 inline" />
                ) : (
                  size
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Quick Add Button */}
        <button
          onClick={(e) => handleQuickAdd(e, product.sizes[0] || 'One Size')}
          className="sm:hidden absolute bottom-2 right-2 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md active:scale-95 cursor-pointer z-10"
          aria-label="Quick Add to Bag"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Rating Bar */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
              {product.brand}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
              <span className="tabular-nums">{product.rating}</span>
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-rose-600 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price & Discount */}
        <div className="flex items-baseline flex-wrap gap-1 sm:gap-2 mt-2 pt-1">
          <span className="text-xs sm:text-base font-bold text-slate-900 tabular-nums">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400 line-through tabular-nums">
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-emerald-600 shrink-0">
            {product.discount}% OFF
          </span>
        </div>
      </div>
    </div>
  );
};
