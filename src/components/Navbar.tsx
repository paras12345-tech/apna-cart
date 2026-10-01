import React, { useState } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  Package,
  MapPin,
  Ticket,
  Shield,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MainCategory } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    navigateToCategory,
    cartCount,
    wishlist,
    setSearchModalOpen,
    user,
    setAuthModalOpen,
    isLoggedIn,
    setIsLoggedIn,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const categories: { label: string; cat: MainCategory | 'All'; badge?: string }[] = [
    { label: 'Men', cat: 'Men' },
    { label: 'Women', cat: 'Women', badge: 'Trending' },
    { label: 'Kids', cat: 'Kids' },
    { label: 'Beauty', cat: 'Beauty' },
    { label: 'Footwear', cat: 'Footwear' },
    { label: 'Accessories', cat: 'Accessories' },
  ];

  const handleNavClick = (cat: MainCategory | 'All') => {
    navigateToCategory(cat);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
          {/* Mobile hamburger menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-1 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Brand Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-rose-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 font-sans">
                    Apna<span className="text-rose-600">Cart</span>
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-slate-500 -mt-1 hidden md:block">
                  Your Style. Your Way.
                </span>
              </div>
            </button>
          </div>

          {/* Category Navigation (Visible on lg: 1024px+) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
            {categories.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.cat)}
                className={`px-2.5 xl:px-3 py-2 text-xs xl:text-sm font-semibold tracking-wide uppercase transition-all duration-200 relative group cursor-pointer ${
                  currentView === 'catalog'
                    ? 'text-slate-800 hover:text-rose-600'
                    : 'text-slate-700 hover:text-rose-600'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-rose-600" />
                )}
                <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
              </button>
            ))}
            <button
              onClick={() => handleNavClick('All')}
              className="px-2.5 xl:px-3 py-2 text-xs xl:text-sm font-semibold tracking-wide uppercase text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Festive Drop</span>
              <span className="xl:hidden">Festive</span>
            </button>
          </nav>

          {/* Search Bar: Adapts to available width on tablet and desktop */}
          <div className="flex-1 max-w-xs xl:max-w-sm hidden md:block min-w-0">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg text-slate-500 text-xs transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-600 transition-colors shrink-0" />
                <span className="truncate text-left">Search fashion, brands...</span>
              </div>
              <span className="text-[10px] bg-white border border-slate-300 text-slate-500 px-1.5 py-0.5 rounded shadow-xs font-mono font-medium shrink-0 ml-1">
                ⌘K
              </span>
            </button>
          </div>

          {/* Header Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Search icon button for mobile and small tablet */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Switch */}
            <button
              onClick={() => setCurrentView('admin')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors cursor-pointer min-h-[36px]"
              title="Open Admin Management Panel"
            >
              <Shield className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="hidden md:inline">Admin</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1 p-1.5 sm:p-2 text-slate-700 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer min-w-[40px] min-h-[40px] justify-center"
                aria-label="User Account Menu"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs border border-slate-300 shrink-0">
                  {user.name.charAt(0)}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden xl:block" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
                      <p className="text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCurrentView('profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer text-left"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView('orders');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer text-left"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        <span>My Orders</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView('profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer text-left"
                      >
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>Saved Addresses</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView('profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer text-left"
                      >
                        <Ticket className="w-4 h-4 text-slate-400" />
                        <span>Coupons & Rewards</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentView('admin');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-rose-600 hover:bg-rose-50 font-medium cursor-pointer text-left border-t border-slate-100"
                      >
                        <Shield className="w-4 h-4 text-rose-600" />
                        <span>Admin Dashboard</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      {isLoggedIn ? (
                        <button
                          onClick={() => {
                            setIsLoggedIn(false);
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 cursor-pointer text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setAuthModalOpen(true);
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-rose-600 font-semibold hover:bg-rose-50 cursor-pointer text-left"
                        >
                          <UserIcon className="w-4 h-4" />
                          <span>Login / Sign Up</span>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={() => setCurrentView('wishlist')}
              className="relative p-2 text-slate-700 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart / Bag Icon */}
            <button
              onClick={() => setCurrentView('cart')}
              className="relative flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer shadow-sm group"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {categories.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.cat)}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 text-slate-900 font-semibold text-sm hover:bg-slate-100"
              >
                <span>{item.label}</span>
                {item.badge && <span className="text-[10px] text-rose-600 font-bold">{item.badge}</span>}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                setCurrentView('admin');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              <Shield className="w-4 h-4 text-rose-600" />
              <span>Admin Management Dashboard</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('orders');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              <Package className="w-4 h-4 text-slate-500" />
              <span>Track Orders</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
