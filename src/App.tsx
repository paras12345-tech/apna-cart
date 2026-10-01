/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { CatalogPage } from './components/CatalogPage';
import { ProductDetail } from './components/ProductDetail';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { WishlistPage } from './components/WishlistPage';
import { OrderSuccessView } from './components/OrderSuccessView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { UserProfileView } from './components/UserProfileView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { SearchBarModal } from './components/SearchBarModal';
import { QuickViewModal } from './components/QuickViewModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-slate-900 selection:bg-rose-500 selection:text-white pb-20 sm:pb-24 md:pb-0">
      {/* Top Banner (except admin view) */}
      {currentView !== 'admin' && <AnnouncementBar />}

      {/* Main Navbar (except admin view) */}
      {currentView !== 'admin' && <Navbar />}

      {/* Dynamic View Router */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'catalog' && <CatalogPage />}
        {currentView === 'product-detail' && <ProductDetail />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'wishlist' && <WishlistPage />}
        {currentView === 'order-success' && <OrderSuccessView />}
        {currentView === 'tracking' && <OrderTrackingView />}
        {(currentView === 'profile' || currentView === 'orders') && <UserProfileView />}
        {currentView === 'admin' && <AdminDashboardView />}
      </main>

      {/* Footer (except admin view) */}
      {currentView !== 'admin' && <Footer />}

      {/* Fixed Mobile Bottom Navigation */}
      {currentView !== 'admin' && currentView !== 'checkout' && currentView !== 'product-detail' && <MobileBottomNav />}

      {/* Interactive Global Modals */}
      <SearchBarModal />
      <QuickViewModal />
      <SizeGuideModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
