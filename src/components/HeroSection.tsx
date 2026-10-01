import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BANNER_IMAGES } from '../data/mockProducts';

export const HeroSection: React.FC = () => {
  const { navigateToCategory, setCurrentView } = useApp();

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Background Campaign Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={BANNER_IMAGES.heroCampaign}
          alt="ApnaCart New Season Fashion Campaign"
          className="w-full h-full object-cover object-center opacity-75 scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-24 lg:py-32 xl:py-36">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          {/* Eyebrow Label */}
          <div className="flex items-center gap-2 text-rose-400 text-xs sm:text-sm font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 shrink-0" />
            <span>Autumn / Winter Festive 2026</span>
          </div>

          {/* Main Headline with fluid clamp typography */}
          <h1 className="text-3xl min-[380px]:text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white leading-[1.1] text-balance">
            THE NEW <br className="hidden min-[380px]:block" />
            <span className="italic font-normal text-rose-400">SEASON</span> IS HERE.
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-xs sm:text-base sm:leading-relaxed max-w-lg font-light leading-normal">
            Step into handcrafted festive silks, tailored French linens, and modern urban streetwear. Curated for the discerning Indian wardrobe.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col min-[480px]:flex-row flex-wrap items-stretch min-[480px]:items-center gap-2.5 sm:gap-3 pt-2">
            <button
              onClick={() => navigateToCategory('Men')}
              className="px-5 sm:px-6 py-3 sm:py-3.5 bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold tracking-wider uppercase rounded-xl transition-all duration-200 shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 group cursor-pointer min-h-[44px]"
            >
              <span>Shop Men</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigateToCategory('Women')}
              className="px-5 sm:px-6 py-3 sm:py-3.5 bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold tracking-wider uppercase rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2 group cursor-pointer min-h-[44px]"
            >
              <span>Shop Women</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigateToCategory('All')}
              className="px-4 sm:px-5 py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl transition-all duration-200 cursor-pointer min-h-[44px] flex items-center justify-center"
            >
              View All Styles
            </button>
          </div>
        </div>
      </div>

      {/* Value Trust Proposition Strip */}
      <div className="relative z-10 border-t border-white/10 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <span className="font-semibold text-white block">100% Genuine Brands</span>
                <span className="text-[11px] text-slate-400">Direct from verified labels</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <span className="font-semibold text-white block">Free Express Shipping</span>
                <span className="text-[11px] text-slate-400">On all orders above ₹999</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <span className="font-semibold text-white block">7-Day Easy Returns</span>
                <span className="text-[11px] text-slate-400">Doorstep pickup & exchange</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <span className="font-semibold text-white block">Cash on Delivery</span>
                <span className="text-[11px] text-slate-400">Available across all pin codes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
