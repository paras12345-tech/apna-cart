import React, { useState, useEffect } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Share2,
  Sparkles,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { ProductImage } from './ProductImage';
import { getProductImages, getPrimaryProductImage } from '../utils/productImages';

export const ProductDetail: React.FC = () => {
  const {
    selectedProduct,
    setCurrentView,
    addToCart,
    isInWishlist,
    toggleWishlist,
    setSizeGuideOpen,
    showToast,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<{ checked: boolean; valid: boolean; message: string } | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Section 9 & 10: Complete routing and gallery state reset when product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedSize('');
    setSelectedColorIndex(0);
    setSizeError(false);
    setQuantity(1);
    setIsZoomed(false);
  }, [selectedProduct?.id]);

  // Reset active image when color variant changes
  useEffect(() => {
    setActiveImageIndex(0);
    setIsZoomed(false);
  }, [selectedColorIndex]);

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    specs: true,
    material: false,
    delivery: true,
    reviews: true,
  });

  if (!selectedProduct) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-600">No product selected.</p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const p = selectedProduct;
  const inWish = isInWishlist(p.id);

  // Derive isolated images belonging exclusively to this product and selected variant
  const selectedColor = p.colors[selectedColorIndex] || p.colors[0];
  const activeVariantId = selectedColor?.variantId;
  const currentImages = getProductImages(p, activeVariantId);
  const currentImage = currentImages[activeImageIndex] || currentImages[0] || getPrimaryProductImage(p);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : currentImages.length - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev < currentImages.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePrevImage();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(Number(pincode))) {
      setPincodeStatus({
        checked: true,
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code.',
      });
      return;
    }

    // Realistic delivery calculation
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3);
    const dateStr = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });

    setPincodeStatus({
      checked: true,
      valid: true,
      message: `Delivery available! Expected by ${dateStr}. Cash on delivery is available for PIN ${pincode}.`,
    });
  };

  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizeError(true);
      showToast('Select Size', 'Please choose a size before adding to bag.', 'error');
      return;
    }
    setSizeError(false);
    addToCart(p, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      showToast('Select Size', 'Please choose a size before proceeding.', 'error');
      return;
    }
    setSizeError(false);
    addToCart(p, selectedSize, selectedColor, quantity);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${p.brand} - ${p.name}`,
        text: `Check out ${p.name} on ApnaCart!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Link Copied', 'Product link copied to your clipboard.');
    }
  };

  return (
    <div className="py-6 sm:py-10 bg-[#FBFBF9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Bar */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('catalog')}
              className="flex items-center gap-1 text-slate-700 hover:text-rose-600 font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to {p.category}</span>
            </button>
            <span>/</span>
            <span>{p.brand}</span>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate max-w-xs">{p.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
            title="Share this product"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Main Grid: Gallery Left + Purchase Module Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image with Zoom & Swipe */}
            <div
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs group"
            >
              <div
                style={
                  isZoomed
                    ? {
                        transform: 'scale(2.2)',
                        transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                        transition: 'transform 0.1s ease-out',
                      }
                    : undefined
                }
                className="w-full h-full cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <ProductImage
                  productId={p.id}
                  image={currentImage}
                  alt={p.name}
                  size="large"
                  aspectRatio="3/4"
                  objectFit="cover"
                  className="w-full h-full"
                  priority={true}
                />
              </div>

              {p.badge && (
                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                  <span className="px-3 py-1 bg-slate-900 text-white text-xs font-extrabold uppercase tracking-wider rounded-md shadow-sm">
                    {p.badge}
                  </span>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(p.id)}
                className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer ${
                  inWish
                    ? 'bg-rose-50 text-rose-600 scale-105'
                    : 'bg-white/90 text-slate-700 hover:text-rose-600'
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWish ? 'fill-rose-600' : ''}`} />
              </button>

              {/* Zoom Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                className="absolute bottom-4 left-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md cursor-pointer transition-colors"
                title={isZoomed ? 'Zoom Out' : 'Zoom In'}
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </button>

              {/* Previous / Next Arrows */}
              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-95"
                    aria-label="Previous view"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-95"
                    aria-label="Next view"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation with image.id keys */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 no-scrollbar">
              {currentImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setIsZoomed(false);
                  }}
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-rose-600 ring-2 ring-rose-600/20'
                      : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <ProductImage
                    productId={p.id}
                    image={img}
                    alt={`${p.name} - view ${idx + 1}`}
                    size="thumbnail"
                    aspectRatio="3/4"
                    objectFit="cover"
                    className="w-full h-full"
                  />
                  <span className="absolute bottom-1 right-1 text-[8px] sm:text-[9px] font-bold bg-slate-900/80 text-white px-1 rounded z-10">
                    0{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Contiguous Purchase Module (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            {/* Title & Brand */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-600 block mb-1">
                {p.brand}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-slate-900 leading-tight">
                {p.name}
              </h1>
              <div className="text-xs text-slate-400 font-mono mt-1">
                SKU: {p.sku}
              </div>

              {/* Rating Strip */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2.5">
                <div className="flex items-center gap-1.5 px-2 py-0.5 sm:py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-900">
                  <span className="tabular-nums">{p.rating}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-xs text-slate-500">
                  {p.reviewCount} Verified Buyer Ratings & Reviews
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                  ₹{p.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm sm:text-base text-slate-400 line-through tabular-nums">
                  ₹{p.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {p.discount}% OFF
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                Inclusive of all taxes · Free delivery on this order
              </p>
            </div>

            {/* Color Selector */}
            {p.colors && p.colors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Color: <span className="font-semibold text-slate-600">{p.colors[selectedColorIndex].name}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {p.colors.map((c, idx) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`w-9 h-9 rounded-full border-2 transition-all p-0.5 flex items-center justify-center cursor-pointer min-w-[36px] min-h-[36px] ${
                        selectedColorIndex === idx
                          ? 'border-slate-900 ring-2 ring-slate-900/20 scale-105'
                          : 'border-transparent hover:scale-105'
                      }`}
                      title={c.name}
                    >
                      <span
                        className="w-full h-full rounded-full shadow-inner block"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Select Size
                </span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer p-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedSize(s);
                        setSizeError(false);
                      }}
                      className={`min-w-11 sm:min-w-12 h-11 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 min-h-[44px] ${
                        isSelected
                          ? 'border-rose-600 bg-rose-600 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400'
                      }`}
                    >
                      <span>{s}</span>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </button>
                  );
                })}
              </div>

              {sizeError && (
                <p className="text-xs font-semibold text-rose-600 mt-2 animate-bounce">
                  Please select a size to proceed
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Quantity:
              </span>
              <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-xs min-h-[36px]"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-slate-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-xs min-h-[36px]"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">
                In Stock ({p.inventory} available)
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <button
                  onClick={handleAddToBag}
                  className="py-3.5 px-3 sm:px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer active:scale-98 min-h-[46px]"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span className="truncate">Add to Bag</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-3 sm:px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer active:scale-98 min-h-[46px]"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span className="truncate">Buy Now</span>
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(p.id)}
                className={`w-full py-2.5 px-4 border rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[40px] ${
                  inWish
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-slate-200 bg-white hover:border-slate-400 text-slate-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-600' : ''}`} />
                <span>{inWish ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
              </button>
            </div>

            {/* Pincode Checker */}
            <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Delivery & Services
                </span>
              </div>
              <form onSubmit={handlePincodeCheck} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900 min-h-[40px]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-lg cursor-pointer transition-colors min-h-[40px]"
                >
                  Check
                </button>
              </form>

              {pincodeStatus && (
                <div
                  className={`text-xs p-2.5 rounded-lg ${
                    pincodeStatus.valid
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {pincodeStatus.message}
                </div>
              )}

              <div className="space-y-2 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Free shipping on all prepaid & COD orders above ₹999</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>7-day easy exchange and return policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>100% Original product guaranteed</span>
                </div>
              </div>
            </div>

            {/* Accordion Product Specs */}
            <div className="border border-slate-200 rounded-xl bg-white divide-y divide-slate-100 overflow-hidden text-xs">
              {/* Product Details & Specifications */}
              <div>
                <button
                  onClick={() => toggleSection('specs')}
                  className="w-full px-4 py-3 flex items-center justify-between font-bold text-slate-900 cursor-pointer hover:bg-slate-50"
                >
                  <span>Product Specifications</span>
                  {openSections.specs ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openSections.specs && (
                  <div className="p-4 pt-1 space-y-3 text-slate-600">
                    <p className="leading-relaxed">{p.description}</p>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      {Object.entries(p.specifications || {}).map(([key, val]) => (
                        <div key={key} className="py-1">
                          <span className="text-slate-400 block text-[11px]">{key}</span>
                          <span className="font-semibold text-slate-800">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Material & Care */}
              <div>
                <button
                  onClick={() => toggleSection('material')}
                  className="w-full px-4 py-3 flex items-center justify-between font-bold text-slate-900 cursor-pointer hover:bg-slate-50"
                >
                  <span>Materials & Wash Care</span>
                  {openSections.material ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openSections.material && (
                  <div className="p-4 pt-1 space-y-2 text-slate-600">
                    <div>
                      <span className="font-semibold text-slate-800 block">Composition:</span>
                      <p>{p.material}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 block">Care Instructions:</span>
                      <p>{p.care}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Reviews */}
              <div>
                <button
                  onClick={() => toggleSection('reviews')}
                  className="w-full px-4 py-3 flex items-center justify-between font-bold text-slate-900 cursor-pointer hover:bg-slate-50"
                >
                  <span>Verified Customer Reviews ({p.reviewCount})</span>
                  {openSections.reviews ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openSections.reviews && (
                  <div className="p-4 pt-1 space-y-4">
                    {/* Review Snippets */}
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 font-bold text-slate-800">
                            <span>Aditya Verma</span>
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded">Verified</span>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          "Exceeded my expectations! The fabric has a premium weight to it, stitching is immaculate and the color is exactly as pictured."
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 font-bold text-slate-800">
                            <span>Pooja Mehra</span>
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded">Verified</span>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          "Great fit and super comfortable. Received so many compliments when I wore it. Definitely buying from ApnaCart again!"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Sticky Mobile Action Bar for PDP */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] z-40 shadow-xl">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <button
            onClick={() => toggleWishlist(p.id)}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-colors ${
              inWish
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-5 h-5 ${inWish ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>

          <button
            onClick={handleAddToBag}
            className="flex-1 h-12 bg-slate-900 active:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-98"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="truncate">Add to Bag</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 h-12 bg-rose-600 active:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-600/25 transition-all active:scale-98"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="truncate">Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
