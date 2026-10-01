import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Flame,
  ChevronLeft,
  ChevronRight,
  Award,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeroSection } from './HeroSection';
import { ShopByCategory } from './ShopByCategory';
import { DealsCountdown } from './DealsCountdown';
import { ProductCard } from './ProductCard';
import { DEDICATED_STUDIO_PHOTOS } from '../data/mockProducts';
import { Product } from '../types';

export const HomeView: React.FC = () => {
  const { products, recentlyViewed, navigateToCategory } = useApp();
  const [activeTab, setActiveTab] = useState<'trending' | 'newDrop' | 'bestsellers'>('trending');

  // Prioritize products with real studio photos for genuine premier showcase
  const sortByRealPhotoFirst = (a: Product, b: Product) => {
    const aHasPhoto = !!DEDICATED_STUDIO_PHOTOS[a.id];
    const bHasPhoto = !!DEDICATED_STUDIO_PHOTOS[b.id];
    if (aHasPhoto && !bHasPhoto) return -1;
    if (!aHasPhoto && bHasPhoto) return 1;
    return b.rating - a.rating;
  };

  const trendingProducts = [...products]
    .filter((p) => p.featured || p.rating >= 4.5)
    .sort(sortByRealPhotoFirst)
    .slice(0, 8);

  const newDropProducts = [...products]
    .filter((p) => p.newDrop)
    .sort(sortByRealPhotoFirst)
    .slice(0, 8);

  const bestsellers = [...products]
    .filter((p) => p.bestseller)
    .sort(sortByRealPhotoFirst)
    .slice(0, 8);

  const activeProducts =
    activeTab === 'trending'
      ? trendingProducts
      : activeTab === 'newDrop'
      ? newDropProducts
      : bestsellers;

  // Recently viewed products
  const recentProductsList = products.filter((p) => recentlyViewed.includes(p.id));

  // Top Brands
  const topBrands = [
    { name: 'WROGN', tagline: 'Stay Mad, Stay Ahead' },
    { name: 'Rare Rabbit', tagline: 'House of Rare Luxury' },
    { name: 'Biba', tagline: 'Real Indian Fashion' },
    { name: 'FabIndia', tagline: 'Celebrate India Handcrafted' },
    { name: 'Levi\'s', tagline: 'Live in Levi\'s Denim' },
    { name: 'Nike', tagline: 'Engineered for Performance' },
    { name: 'Forest Essentials', tagline: 'Luxurious Ayurveda' },
    { name: 'Mango', tagline: 'Modern European Aesthetics' },
  ];

  return (
    <div className="space-y-4">
      {/* Cinematic Hero */}
      <HeroSection />

      {/* Visual Shop by Category */}
      <ShopByCategory />

      {/* Deals of the day with live ticking countdown */}
      <DealsCountdown />

      {/* Tabbed Showcase: Trending / New Arrivals / Bestsellers */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-600 block mb-1">
                Handpicked Drops
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Curated Fashion Edits
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('trending')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'trending'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Trending Now
              </button>
              <button
                onClick={() => setActiveTab('newDrop')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'newDrop'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                New Arrivals
              </button>
              <button
                onClick={() => setActiveTab('bestsellers')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'bestsellers'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bestsellers
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {activeProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => navigateToCategory('All')}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
            >
              <span>Explore All {activeProducts.length * 4}+ Styles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Top Brands Showcase */}
      <section className="py-12 bg-[#FBFBF9] border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600 block mb-1">
              Guaranteed Authentic
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              India's Most Loved Brands
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Direct official brand stores offering seamless warranty and assured purity
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {topBrands.map((b) => (
              <div
                key={b.name}
                onClick={() => navigateToCategory('All')}
                className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group text-center"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5 text-rose-600" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 font-sans tracking-wide">
                  {b.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  {b.tagline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Fashion Inspiration Strip */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                Editorial Spotlight
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
                The Festive Weaves & Linen Revolution
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                Crafted at the intersection of generational Indian textile heritage and contemporary tailoring. From Varanasi's pure zari weaves to Normandy's breathable flax linen, elevate your wardrobe with conscious silhouettes built to last.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigateToCategory('Women')}
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Explore The Festive Collection
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-2">
                <span className="text-2xl font-bold font-serif text-rose-400">01.</span>
                <h4 className="font-bold text-sm text-white">Pure Breathable Linens</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Tailored resort-collar shirts and relaxed trousers designed for all-day comfort in tropical climates.
                </p>
              </div>

              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-2">
                <span className="text-2xl font-bold font-serif text-rose-400">02.</span>
                <h4 className="font-bold text-sm text-white">Banarasi Zari Sarees</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Timeless gold metallic brocades woven by master weavers for memorable family celebrations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Shelf (if any) */}
      {recentProductsList.length > 0 && (
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recently Viewed by You
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentProductsList.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
