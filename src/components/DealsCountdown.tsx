import React, { useState, useEffect } from 'react';
import { Timer, ArrowRight, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';

export const DealsCountdown: React.FC = () => {
  const { products, navigateToCategory } = useApp();

  // 12-hour countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 11, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Featured Deals with authentic studio apparel photography
  const dealProducts = [
    products.find((p) => p.id === 'men-1'),
    products.find((p) => p.id === 'men-5'),
    products.find((p) => p.id === 'women-1'),
    products.find((p) => p.id === 'women-3'),
  ].filter(Boolean) as typeof products;

  return (
    <section className="py-12 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-widest mb-1">
              <Zap className="w-4 h-4 fill-rose-600" />
              <span>Limited Time Drop</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Deals of the Day
            </h2>
          </div>

          {/* Countdown Clock Box */}
          <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-sm self-start md:self-auto">
            <Timer className="w-4 h-4 text-rose-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-xs font-medium text-slate-300">Ends in:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-sm">
              <span className="bg-slate-800 px-2 py-0.5 rounded text-rose-400">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-slate-500">:</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-rose-400">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-slate-500">:</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-rose-400">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Deals Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigateToCategory('All')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-300 hover:border-slate-900 bg-white text-xs font-bold uppercase tracking-wider text-slate-900 transition-colors cursor-pointer"
          >
            <span>Explore All 50%+ Off Deals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
