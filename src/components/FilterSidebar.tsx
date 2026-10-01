import React from 'react';
import { X, RotateCcw, Check, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MainCategory, Gender } from '../types';

interface FilterSidebarProps {
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const { filters, setFilters, resetFilters, products } = useApp();

  // Extract unique brands with product counts
  const brandCounts = products.reduce((acc, p) => {
    acc[p.brand] = (acc[p.brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const allBrands = Object.keys(brandCounts).sort();

  const handleGenderToggle = (g: Gender) => {
    setFilters((prev) => {
      const exists = prev.gender.includes(g);
      return {
        ...prev,
        gender: exists ? prev.gender.filter((item) => item !== g) : [...prev.gender, g],
      };
    });
  };

  const handleBrandToggle = (b: string) => {
    setFilters((prev) => {
      const exists = prev.brands.includes(b);
      return {
        ...prev,
        brands: exists ? prev.brands.filter((item) => item !== b) : [...prev.brands, b],
      };
    });
  };

  const handleSizeToggle = (s: string) => {
    setFilters((prev) => {
      const exists = prev.sizes.includes(s);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((item) => item !== s) : [...prev.sizes, s],
      };
    });
  };

  const pricePresets = [
    { label: 'All Prices', min: 0, max: 10000 },
    { label: 'Under ₹999', min: 0, max: 999 },
    { label: '₹1,000 – ₹1,999', min: 1000, max: 1999 },
    { label: '₹2,000 – ₹3,999', min: 2000, max: 3999 },
    { label: '₹4,000 & Above', min: 4000, max: 10000 },
  ];

  const discountPresets = [
    { label: '10% and above', val: 10 },
    { label: '30% and above', val: 30 },
    { label: '50% and above', val: 50 },
  ];

  const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const categoriesList: (MainCategory | 'All')[] = [
    'All',
    'Men',
    'Women',
    'Kids',
    'Beauty',
    'Footwear',
    'Accessories',
  ];

  return (
    <aside
      className={`bg-white ${
        isMobileDrawer
          ? 'h-full flex flex-col p-5 overflow-y-auto'
          : 'w-64 shrink-0 rounded-2xl border border-slate-200/80 p-5 space-y-6 h-fit sticky top-24'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-sm tracking-wide uppercase">
            Filters
          </h3>
          <span className="text-[11px] text-slate-400">Refine your selection</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          {isMobileDrawer && (
            <button
              onClick={onCloseMobileDrawer}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6 text-xs">
        {/* Category Filter */}
        <div>
          <span className="font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
            Category
          </span>
          <div className="space-y-1.5">
            {categoriesList.map((cat) => (
              <label
                key={cat}
                className="flex items-center justify-between text-slate-600 hover:text-slate-900 cursor-pointer py-0.5"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === cat}
                    onChange={() => setFilters((prev) => ({ ...prev, category: cat }))}
                    className="accent-rose-600 w-3.5 h-3.5"
                  />
                  <span>{cat === 'All' ? 'All Collections' : cat}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Gender Filter */}
        <div className="pt-4 border-t border-slate-100">
          <span className="font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
            Gender
          </span>
          <div className="grid grid-cols-2 gap-2">
            {(['Men', 'Women', 'Kids', 'Unisex'] as Gender[]).map((g) => {
              const checked = filters.gender.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGenderToggle(g)}
                  className={`px-3 py-1.5 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                    checked
                      ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{g}</span>
                  {checked && <Check className="w-3 h-3 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Presets & Slider */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-900 uppercase tracking-wider">
              Price Range
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
            </span>
          </div>
          <div className="space-y-1.5 mb-3">
            {pricePresets.map((preset) => {
              const active =
                filters.priceRange[0] === preset.min && filters.priceRange[1] === preset.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, priceRange: [preset.min, preset.max] }))
                  }
                  className={`w-full text-left py-1 px-2 rounded transition-colors cursor-pointer flex items-center justify-between ${
                    active
                      ? 'bg-rose-50 text-rose-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
          {/* Custom Range Slider */}
          <input
            type="range"
            min="0"
            max="10000"
            step="250"
            value={filters.priceRange[1]}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                priceRange: [prev.priceRange[0], parseInt(e.target.value)],
              }))
            }
            className="w-full accent-rose-600 cursor-pointer"
          />
        </div>

        {/* Brands Multi-Select */}
        <div className="pt-4 border-t border-slate-100">
          <span className="font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
            Brands ({allBrands.length})
          </span>
          <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
            {allBrands.map((b) => {
              const checked = filters.brands.includes(b);
              return (
                <label
                  key={b}
                  className="flex items-center justify-between text-slate-700 hover:text-slate-900 cursor-pointer py-0.5 group"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleBrandToggle(b)}
                      className="accent-rose-600 rounded w-3.5 h-3.5"
                    />
                    <span className="truncate group-hover:text-slate-900">{b}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">({brandCounts[b]})</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Sizes Multi-Select */}
        <div className="pt-4 border-t border-slate-100">
          <span className="font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
            Size
          </span>
          <div className="flex flex-wrap gap-1.5">
            {standardSizes.map((s) => {
              const checked = filters.sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSizeToggle(s)}
                  className={`w-9 h-8 rounded border text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                    checked
                      ? 'bg-rose-600 border-rose-600 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Discount Threshold */}
        <div className="pt-4 border-t border-slate-100">
          <span className="font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
            Discount
          </span>
          <div className="space-y-1.5">
            {discountPresets.map((d) => (
              <label
                key={d.val}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <input
                  type="radio"
                  name="discount"
                  checked={filters.minDiscount === d.val}
                  onChange={() => setFilters((prev) => ({ ...prev, minDiscount: d.val }))}
                  className="accent-rose-600 w-3.5 h-3.5"
                />
                <span>{d.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Minimum Rating */}
        <div className="pt-4 border-t border-slate-100">
          <span className="font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
            Customer Rating
          </span>
          <div className="space-y-1.5">
            {[4, 3].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, minRating: prev.minRating === r ? 0 : r }))
                }
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded border transition-colors cursor-pointer ${
                  filters.minRating === r
                    ? 'border-amber-400 bg-amber-50/50 text-slate-900 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{r}★ & above</span>
                </div>
                {filters.minRating === r && <Check className="w-3.5 h-3.5 text-amber-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* In Stock Only */}
        <div className="pt-4 border-t border-slate-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
              }
              className="accent-rose-600 rounded w-4 h-4"
            />
            <span className="font-medium text-slate-800">Show In Stock Only</span>
          </label>
        </div>
      </div>

      {isMobileDrawer && (
        <div className="pt-6 mt-auto">
          <button
            onClick={onCloseMobileDrawer}
            className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-center shadow-md uppercase tracking-wider text-xs"
          >
            Apply Filters
          </button>
        </div>
      )}
    </aside>
  );
};
