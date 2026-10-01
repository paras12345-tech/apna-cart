import React, { useState } from 'react';
import {
  ShoppingBag,
  ShieldCheck,
  RotateCcw,
  Truck,
  Mail,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MainCategory } from '../types';

export const Footer: React.FC = () => {
  const { navigateToCategory, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Enter Valid Email', 'Please enter a valid email address.', 'error');
      return;
    }
    showToast('Subscribed!', 'Welcome to the ApnaCart Fashion Insider club! Check your inbox for your 15% code.');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Original Guarantee</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Directly sourced from verified Indian designers, heritage textile hubs, and global athletic labels.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">7-Day Free Doorstep Returns</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Try at home with confidence. Seamless one-click return or size exchange pickup from your doorstep.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Express Pan-India Delivery</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Free priority shipping on all orders above ₹999 with real-time live SMS & courier tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          {/* Brand & Mission */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-900 via-rose-600 to-rose-500 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                Apna<span className="text-rose-500">Cart</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              ApnaCart is India's modern fashion marketplace, celebrating contemporary silhouettes, rich heritage textiles, and effortless everyday style. Your Style. Your Way.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="font-bold text-white block mb-2">
                Join the Fashion Insider Club
              </span>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Column 1: Online Shopping */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Online Shopping
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => navigateToCategory('Men')} className="hover:text-white cursor-pointer">
                  Men's Fashion
                </button>
              </li>
              <li>
                <button onClick={() => navigateToCategory('Women')} className="hover:text-white cursor-pointer">
                  Women's Ethnic & Western
                </button>
              </li>
              <li>
                <button onClick={() => navigateToCategory('Kids')} className="hover:text-white cursor-pointer">
                  Kids & Infants
                </button>
              </li>
              <li>
                <button onClick={() => navigateToCategory('Footwear')} className="hover:text-white cursor-pointer">
                  Footwear & Sneakers
                </button>
              </li>
              <li>
                <button onClick={() => navigateToCategory('Beauty')} className="hover:text-white cursor-pointer">
                  Ayurvedic Beauty & Perfume
                </button>
              </li>
              <li>
                <button onClick={() => navigateToCategory('Accessories')} className="hover:text-white cursor-pointer">
                  Watches & Leather Bags
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Policies */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Customer Policies
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer">Contact Support</li>
              <li className="hover:text-white cursor-pointer">Frequently Asked Questions</li>
              <li className="hover:text-white cursor-pointer">Track Consignment</li>
              <li className="hover:text-white cursor-pointer">Shipping & Dispatch Terms</li>
              <li className="hover:text-white cursor-pointer">Cancellation & Refunds</li>
              <li className="hover:text-white cursor-pointer">Privacy & Cookie Policy</li>
            </ul>
          </div>

          {/* Column 3: About ApnaCart */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">
              About ApnaCart
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer">Our Story</li>
              <li className="hover:text-white cursor-pointer">Artisan & Weaver Partnerships</li>
              <li className="hover:text-white cursor-pointer">Careers at ApnaCart</li>
              <li className="hover:text-white cursor-pointer">Sell on ApnaCart</li>
              <li className="hover:text-white cursor-pointer">Sustainability Commitments</li>
              <li className="hover:text-white cursor-pointer">Corporate Governance</li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 ApnaCart. All rights reserved. Built for modern fashion discovery across India.</p>

          <div className="flex items-center gap-4 text-slate-400">
            <Instagram className="w-4 h-4 hover:text-white cursor-pointer" />
            <Facebook className="w-4 h-4 hover:text-white cursor-pointer" />
            <Twitter className="w-4 h-4 hover:text-white cursor-pointer" />
            <Youtube className="w-4 h-4 hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};
