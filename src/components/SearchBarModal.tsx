import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, History, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductImage } from './ProductImage';
import { getPrimaryProductImage } from '../utils/productImages';

export const SearchBarModal: React.FC = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    products,
    navigateToProduct,
    setFilters,
    setCurrentView,
  } = useApp();

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('apnacart_recent_searches');
    return saved ? JSON.parse(saved) : ['Linen Shirts', 'Banarasi Saree', 'Oversized T-Shirts', 'Air Max'];
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape' && searchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, setSearchModalOpen]);

  const trendingQueries = [
    'Oversized T-Shirts',
    'Banarasi Silk Saree',
    'Pure Linen Resort Shirts',
    'Running Shoes',
    'Anarkali Kurta Sets',
    'Ayurvedic Saffron Serum',
  ];

  const popularBrands = ['Rare Rabbit', 'Biba', 'WROGN', 'FabIndia', 'Nike', 'Levi\'s', 'Forest Essentials'];

  const handleExecuteSearch = (searchStr: string) => {
    const trimmed = searchStr.trim();
    if (!trimmed) return;

    // Save recent search
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('apnacart_recent_searches', JSON.stringify(updated));

    setFilters((prev) => ({
      ...prev,
      category: 'All',
      searchQuery: trimmed,
    }));
    setSearchModalOpen(false);
    setCurrentView('catalog');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('apnacart_recent_searches');
  };

  if (!searchModalOpen) return null;

  // Filter matching products
  const matchingProducts = query.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.brand.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.subcategory.toLowerCase().includes(query.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 6)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:pt-16 lg:pt-20 sm:px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity hidden sm:block"
        onClick={() => setSearchModalOpen(false)}
      />

      {/* Modal Dialog: Full-screen mobile sheet or desktop modal */}
      <div className="relative w-full h-full sm:h-auto sm:max-h-[85vh] max-w-2xl bg-white sm:rounded-2xl shadow-2xl border-0 sm:border sm:border-slate-200 overflow-hidden z-10 flex flex-col animate-in fade-in-50 sm:zoom-in-95 duration-150">
        {/* Search Input Box */}
        <div className="flex items-center px-3 sm:px-4 py-3 sm:py-3.5 border-b border-slate-100 bg-white shrink-0">
          {/* Mobile Back Button */}
          <button
            onClick={() => setSearchModalOpen(false)}
            className="sm:hidden p-1.5 -ml-1 text-slate-700 hover:text-slate-900 rounded-lg shrink-0 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center mr-1.5"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>

          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 mr-2.5 hidden sm:block" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleExecuteSearch(query);
              }
            }}
            placeholder="Search products, brands, ethnic wear, styles..."
            className="w-full bg-transparent text-slate-900 text-sm font-medium focus:outline-none placeholder:text-slate-400"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer mr-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            onClick={() => setSearchModalOpen(false)}
            className="hidden sm:inline-block text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded bg-slate-100 cursor-pointer ml-1"
          >
            ESC
          </button>
        </div>

        {/* Search Body Content */}
        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-5">
          {query.trim() ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Products ({matchingProducts.length})
                </span>
                {matchingProducts.length > 0 && (
                  <button
                    onClick={() => handleExecuteSearch(query)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                  >
                    View all matching results
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {matchingProducts.length > 0 ? (
                <div className="space-y-2">
                  {matchingProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        navigateToProduct(prod);
                        setSearchModalOpen(false);
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer group transition-colors border border-transparent hover:border-slate-200"
                    >
                      <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                        <ProductImage
                          productId={prod.id}
                          image={getPrimaryProductImage(prod)}
                          alt={prod.name}
                          size="thumbnail"
                          aspectRatio="3/4"
                          objectFit="cover"
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                          {prod.brand}
                        </div>
                        <div className="text-xs font-semibold text-slate-900 truncate group-hover:text-rose-600 transition-colors">
                          {prod.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-slate-900 tabular-nums">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-slate-400 line-through tabular-nums">
                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-600">
                            {prod.discount}% off
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 transition-colors shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-4">
                  <p className="text-slate-700 font-semibold text-sm">
                    No fashion items found for "{query}"
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Try searching for "Linen", "Kurta", "Sneakers", or browse our popular categories below.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5" />
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[11px] text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleExecuteSearch(item)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                  Trending Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {trendingQueries.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleExecuteSearch(item)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-rose-500" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Brands */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">
                  Top Fashion Brands
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularBrands.map((b) => (
                    <button
                      key={b}
                      onClick={() => handleExecuteSearch(b)}
                      className="px-3 py-1 bg-white border border-slate-200 hover:border-slate-400 rounded-lg text-xs text-slate-700 font-semibold cursor-pointer transition-colors"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
