import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { FilterSidebar } from './FilterSidebar';
import { SortOption } from '../types';

export const CatalogPage: React.FC = () => {
  const { products, filters, setFilters, resetFilters } = useApp();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('recommended');

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category
      if (filters.category && filters.category !== 'All' && p.category !== filters.category) {
        return false;
      }
      // Subcategory
      if (filters.subcategory && p.subcategory !== filters.subcategory) {
        return false;
      }
      // Gender
      if (filters.gender.length > 0 && !filters.gender.includes(p.gender)) {
        return false;
      }
      // Price
      if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) {
        return false;
      }
      // Brands
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) {
        return false;
      }
      // Discount
      if (filters.minDiscount > 0 && p.discount < filters.minDiscount) {
        return false;
      }
      // Sizes
      if (filters.sizes.length > 0 && !filters.sizes.some((s) => p.sizes.includes(s))) {
        return false;
      }
      // Rating
      if (filters.minRating > 0 && p.rating < filters.minRating) {
        return false;
      }
      // In stock
      if (filters.inStockOnly && !p.inStock) {
        return false;
      }
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesSubcategory = p.subcategory.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesSubcategory && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [products, filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case 'price_asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return list.sort((a, b) => b.discount - a.discount);
      case 'newest':
        return list.sort((a, b) => (b.newDrop ? 1 : 0) - (a.newDrop ? 1 : 0));
      case 'popular':
        return list.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'recommended':
      default:
        return list.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }
  }, [filteredProducts, sortOption]);

  const activeFiltersCount =
    (filters.category !== 'All' ? 1 : 0) +
    filters.gender.length +
    filters.brands.length +
    filters.sizes.length +
    (filters.minDiscount > 0 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="py-8 bg-[#FBFBF9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">
              {filters.category === 'All' ? 'All Collections' : filters.category}
            </span>
            {filters.searchQuery && (
              <>
                <span>/</span>
                <span className="text-rose-600 font-semibold">Search: "{filters.searchQuery}"</span>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                {filters.category === 'All'
                  ? 'All Fashion & Apparel'
                  : `${filters.category}'s Collection`}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {sortedProducts.length} styles crafted with precision
              </p>
            </div>

            {/* Mobile Filter Toggle & Sort Dropdown */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-xs cursor-pointer min-h-[38px]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2 bg-white border border-slate-200 rounded-xl px-2.5 sm:px-3 py-1.5 shadow-xs min-h-[38px]">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
                >
                  <option value="recommended">Recommended</option>
                  <option value="popular">Popularity</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="discount">Highest Discount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mt-4 pt-3 border-t border-slate-200">
              <span className="text-xs text-slate-400 font-medium">Applied:</span>

              {filters.category !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700">
                  Category: {filters.category}
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, category: 'All' }))}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.brands.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
                >
                  {b}
                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        brands: prev.brands.filter((item) => item !== b),
                      }))
                    }
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {filters.gender.map((g) => (
                <span
                  key={g}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
                >
                  {g}
                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        gender: prev.gender.filter((item) => item !== g),
                      }))
                    }
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {filters.searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                  Search: "{filters.searchQuery}"
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                    className="hover:text-rose-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 font-bold hover:underline cursor-pointer ml-1"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Content Layout: Sidebar + Product Grid */}
        <div className="flex gap-6 lg:gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          {/* Product Cards Grid: Adapts cleanly from 320px to 1920px */}
          <div className="flex-1 min-w-0">
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 min-[640px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
                {sortedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-md mx-auto my-12">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Sparkles className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 font-serif">
                  No styles matched your criteria
                </h3>
                <p className="text-xs text-slate-500 mt-2 mb-6">
                  Try broadening your filters, removing price limits, or searching with different keywords.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="absolute right-0 inset-y-0 w-full max-w-[320px] sm:max-w-xs bg-white shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            <FilterSidebar
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
