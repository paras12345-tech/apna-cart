import React, { useState, useEffect } from 'react';
import { Truck, RotateCcw, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnnouncementBar: React.FC = () => {
  const { setCurrentView } = useApp();
  const announcements = [
    { text: 'Free shipping on orders above ₹999 across India', icon: Truck, cta: 'Shop Now' },
    { text: 'Hassle-free 7-day doorstep returns & exchanges', icon: RotateCcw, cta: 'Know More' },
    { text: 'Special Offer: Use code STYLE10 for flat 10% off', icon: Sparkles, cta: 'Use Code' },
    { text: '100% Genuine Handcrafted & Designer Fashion Brands', icon: ShieldCheck, cta: 'Explore' },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const current = announcements[index];
  const Icon = current.icon;

  return (
    <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-2 text-center overflow-hidden">
          <Icon className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
          <span className="font-medium tracking-wide truncate">{current.text}</span>
          <button
            onClick={() => setCurrentView('catalog')}
            className="hidden sm:inline-flex items-center gap-0.5 text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-2 ml-1 cursor-pointer transition-colors"
          >
            {current.cta}
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-400">
          <span>Track Order</span>
          <span>·</span>
          <span>Contact Us</span>
        </div>
      </div>
    </div>
  );
};
