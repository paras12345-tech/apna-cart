import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductImage } from './ProductImage';
import { getPrimaryProductImage } from '../utils/productImages';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    isInWishlist,
    toggleWishlist,
    navigateToProduct,
  } = useApp();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  if (!quickViewProduct) return null;

  const p = quickViewProduct;
  const inWish = isInWishlist(p.id);

  const selectedColor = p.colors[selectedColorIdx] || p.colors[0];
  const activeImage = getPrimaryProductImage(p, selectedColor?.variantId);

  const handleAdd = () => {
    const size = selectedSize || p.sizes[0] || 'Standard';
    addToCart(p, size, selectedColor);
    setQuickViewProduct(null);
  };

  const handleFullView = () => {
    navigateToProduct(p);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        onClick={() => setQuickViewProduct(null)}
      />
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 z-10 animate-in fade-in-50 zoom-in-95 duration-150">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 text-slate-500 hover:text-slate-900 flex items-center justify-center shadow-xs cursor-pointer min-w-[32px] min-h-[32px]"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="aspect-[4/3] md:aspect-[3/4] max-h-60 sm:max-h-72 md:max-h-none bg-slate-100 relative overflow-hidden">
            <ProductImage
              productId={p.id}
              image={activeImage}
              alt={p.name}
              size="medium"
              aspectRatio="3/4"
              objectFit="cover"
              className="w-full h-full"
            />
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-rose-600 block mb-1">
                {p.brand}
              </span>
              <h3 className="text-xl font-bold font-serif text-slate-900 leading-tight">
                {p.name}
              </h3>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  <span>{p.rating}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-xs text-slate-400">({p.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mt-3">
                <span className="text-2xl font-bold text-slate-900 tabular-nums">
                  ₹{p.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-400 line-through tabular-nums">
                  ₹{p.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {p.discount}% OFF
                </span>
              </div>

              {/* Size Select */}
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-1.5">
                  Select Size:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {p.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        (selectedSize || p.sizes[0]) === s
                          ? 'border-rose-600 bg-rose-600 text-white'
                          : 'border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleAdd}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    inWish ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-rose-600' : ''}`} />
                  <span>{inWish ? 'Saved' : 'Wishlist'}</span>
                </button>
                <button
                  onClick={handleFullView}
                  className="flex-1 py-2 rounded-xl border border-slate-200 hover:border-slate-400 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Full Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
