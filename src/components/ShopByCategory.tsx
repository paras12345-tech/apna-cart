import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BANNER_IMAGES } from '../data/mockProducts';
import { MainCategory } from '../types';

export const ShopByCategory: React.FC = () => {
  const { navigateToCategory } = useApp();

  const categoryCards = [
    {
      title: 'Men\'s Studio',
      subtitle: 'Crisp Linens, Polos & Selvedge Denim',
      category: 'Men' as MainCategory,
      image: BANNER_IMAGES.categoryMen,
      colSpan: 'md:col-span-1',
      offer: 'Up to 50% Off',
    },
    {
      title: 'Women\'s Festive & Fusion',
      subtitle: 'Banarasi Sarees, Anarkalis & Chic Dresses',
      category: 'Women' as MainCategory,
      image: BANNER_IMAGES.categoryWomen,
      colSpan: 'md:col-span-1',
      offer: 'Min 40% Off',
    },
    {
      title: 'Footwear & Designer Bags',
      subtitle: 'Air Max Sneakers, Juttis & Leather Slings',
      category: 'Footwear' as MainCategory,
      image: BANNER_IMAGES.categoryFootwearAccessories,
      colSpan: 'md:col-span-1',
      offer: 'Starting ₹1,199',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#FBFBF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600 block mb-1">
              Curated Wardrobe
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => navigateToCategory('All')}
            className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-rose-600 flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>Explore All Collections</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Featured Visual Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {categoryCards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigateToCategory(card.category)}
              className="group relative h-[320px] min-[400px]:h-[360px] sm:h-[400px] lg:h-[440px] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/60"
            >
              {/* Image with subtle zoom on hover */}
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                referrerPolicy="no-referrer"
              />
              
              {/* Measured Scrim Gradient for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

              {/* Offer Pill */}
              <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4">
                <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider rounded-md shadow-xs">
                  {card.offer}
                </span>
              </div>

              {/* Card Meta */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-white space-y-1.5 sm:space-y-2">
                <span className="text-[10px] sm:text-[11px] text-rose-300 uppercase tracking-widest font-bold">
                  {card.category} Collection
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-white group-hover:text-rose-200 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-300 font-light line-clamp-1">
                  {card.subtitle}
                </p>
                <div className="pt-1.5 sm:pt-2 flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-rose-300 transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Category Quick Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mt-4 sm:mt-6">
          {[
            { name: 'Kids Wear', cat: 'Kids' as MainCategory, desc: 'Boys, Girls & Infants' },
            { name: 'Luxury Skincare', cat: 'Beauty' as MainCategory, desc: 'Ayurvedic & Serums' },
            { name: 'Fine Fragrances', cat: 'Beauty' as MainCategory, desc: 'Eaux de Parfum' },
            { name: 'Accessories & Belts', cat: 'Accessories' as MainCategory, desc: 'Watches & Eyewear' },
          ].map((item) => (
            <div
              key={item.name}
              onClick={() => navigateToCategory(item.cat)}
              className="p-3 sm:p-4 rounded-xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                {item.name}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
