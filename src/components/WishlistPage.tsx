import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductImage } from './ProductImage';
import { getPrimaryProductImage } from '../utils/productImages';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    products,
    removeFromCart,
    toggleWishlist,
    moveToCartFromWishlist,
    setCurrentView,
    navigateToProduct,
  } = useApp();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="py-8 sm:py-12 bg-[#FBFBF9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              My Wishlist
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {wishlistProducts.length} items saved for later
            </p>
          </div>
          {wishlistProducts.length > 0 && (
            <button
              onClick={() => setCurrentView('catalog')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col group relative"
              >
                {/* Image Stage */}
                <div
                  onClick={() => navigateToProduct(p)}
                  className="aspect-[3/4] relative bg-slate-100 cursor-pointer overflow-hidden"
                >
                  <ProductImage
                    productId={p.id}
                    image={getPrimaryProductImage(p)}
                    alt={p.name}
                    size="medium"
                    aspectRatio="3/4"
                    objectFit="cover"
                    className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-rose-600 flex items-center justify-center shadow-xs cursor-pointer hover:bg-white"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3.5 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      {p.brand}
                    </span>
                    <h3
                      onClick={() => navigateToProduct(p)}
                      className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-1 cursor-pointer hover:text-rose-600 transition-colors"
                    >
                      {p.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        ₹{p.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        {p.discount}% OFF
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-3">
                    <button
                      onClick={() => moveToCartFromWishlist(p.id, p.sizes[0])}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4 text-rose-500">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <h2 className="text-xl font-bold font-serif text-slate-900">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-slate-500 mt-2 mb-6">
              Explore our new seasonal drops and save your favorite pieces to your wishlist.
            </p>
            <button
              onClick={() => setCurrentView('catalog')}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Start Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
