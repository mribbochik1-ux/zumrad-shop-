import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBranch } from '../context/BranchContext';
import { useCart } from '../context/CartContext';
import { DataService } from '../services/dataService';
import { ProductCarousel } from '../components/ProductCarousel';
import {
  ShoppingBag,
  Send,
  Check,
  ChevronRight,
  Maximize2,
  X,
  Truck,
  ShieldCheck,
  RotateCcw,
  Store,
  Share2,
} from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedBranchId, activeBranch } = useBranch();
  const { addToCart } = useCart();

  // Load product
  const product = useMemo(() => {
    return DataService.getProductById(id, selectedBranchId);
  }, [id, selectedBranchId]);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Selections
  const hasSizes = product?.sizes && product.sizes.length > 0;
  const hasColors = product?.colors && product.colors.length > 0;

  const [selectedSize, setSelectedSize] = useState(
    hasSizes ? product.sizes[0] : null
  );
  const [selectedColor, setSelectedColor] = useState(
    hasColors ? product.colors[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Active images list (fallback if empty)
  const images =
    product?.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'];

  // Related products in this branch
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return DataService.getProducts(selectedBranchId)
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 8);
  }, [product, selectedBranchId]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-heading font-black text-2xl uppercase text-zinc-950">
          Mahsulot topilmadi
        </h2>
        <p className="text-sm text-zinc-600 mt-2 max-w-sm">
          Ushbu mahsulot {activeBranch?.name}da mavjud emas yoki o‘chirilgan bo‘lishi mumkin.
        </p>
        <Link
          to="/katalog"
          className="mt-6 px-6 py-3 bg-[#FF8A00] text-zinc-950 font-heading font-black text-xs uppercase tracking-wider rounded-full shadow-md"
        >
          Katalogga qaytish
        </Link>
      </div>
    );
  }

  const isSoldOut = product.status === 'sotilgan';

  const handleAddToCart = () => {
    if (isSoldOut) return;
    if (hasSizes && !selectedSize) {
      alert("Iltimos, o'lchamni tanlang");
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleDirectTelegramOrder = () => {
    if (isSoldOut) return;
    const branchName = activeBranch?.name || 'Zumrad Shop';
    const text =
      `🌸 ${branchName} bo'yicha tezkor buyurtma 🌸\n\n` +
      `🛍 Mahsulot: ${product.name}\n` +
      `🏢 Brend: ${product.brand || "Ko'rsatilmagan"}\n` +
      (selectedSize ? `📏 O'lcham: ${selectedSize}\n` : '') +
      (selectedColor ? `🎨 Rang: ${selectedColor}\n` : '') +
      `🔢 Soni: ${quantity} dona\n` +
      `💰 Narxi: ${DataService.formatPrice(product.price * quantity)}\n\n` +
      `Menga ushbu mahsulotni buyurtma qilishda yordam bering!`;

    const encoded = encodeURIComponent(text);
    const tgUsername = activeBranch?.telegram_username || 'zumrad_filial1';
    window.open(`https://t.me/${tgUsername}?text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Bar */}
      <div className="bg-zinc-50 border-b border-zinc-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-zinc-600">
            <Link to="/" className="hover:text-zinc-900">
              Bosh sahifa
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <Link to="/katalog" className="hover:text-zinc-900">
              Katalog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <Link
              to={`/katalog?kategoriya=${encodeURIComponent(product.category)}`}
              className="hover:text-zinc-900"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-zinc-900 font-medium truncate max-w-[150px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Stage Image with Zoom Button */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200 group">
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover object-center cursor-pointer transition-transform duration-500 group-hover:scale-105"
                onClick={() => setIsZoomOpen(true)}
              />

              {/* Status Badge */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isSoldOut ? (
                  <span className="px-3 py-1 bg-zinc-950 text-white rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                    Sotilgan
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-[#FF8A00] text-white rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                    Mavjud
                  </span>
                )}
              </div>

              {/* Zoom Trigger Button */}
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute bottom-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-zinc-900 hover:text-[#FF8A00] shadow-md transition-colors"
                title="Kattalashtirish"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === index
                        ? 'border-[#FF8A00] ring-2 ring-[#FF8A00]/20'
                        : 'border-zinc-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Controls */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-700 rounded-md text-xs font-bold uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="text-xs text-zinc-600 font-medium">
                  {product.category}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs font-semibold text-[#FF8A00]">
                  {activeBranch?.name}
                </span>
              </div>

              <h1 className="font-heading font-black text-2xl sm:text-4xl text-zinc-950 uppercase tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
                  {DataService.formatPrice(product.price)}
                </span>
              </div>
            </div>

            {/* Color Selector */}
            {hasColors && (
              <div className="pt-4 border-t border-zinc-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">
                  Rang: <span className="text-[#FF8A00] font-black">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        selectedColor === color
                          ? 'border-[#FF8A00] bg-[#FF8A00] text-white shadow-sm'
                          : 'border-zinc-200 text-zinc-800 hover:border-zinc-400 bg-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {hasSizes && (
              <div className="pt-4 border-t border-zinc-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    O‘lcham:{' '}
                    <span className="text-[#FF8A00] font-black">{selectedSize || 'Tanlanmagan'}</span>
                  </label>
                  <span className="text-[11px] text-zinc-600">
                    O‘lchamlar standarti: Yevropa (EU)
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={isSoldOut}
                      className={`py-3 text-sm font-black rounded-xl border transition-all ${
                        selectedSize === size
                          ? 'border-[#FF8A00] bg-[#FF8A00] text-white shadow-sm'
                          : 'border-zinc-200 text-zinc-800 hover:border-zinc-400 bg-white'
                      } ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-6 border-t border-zinc-100 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-zinc-200 rounded-2xl bg-zinc-50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isSoldOut}
                    className="w-9 h-9 flex items-center justify-center font-bold text-base text-zinc-700 hover:text-black rounded-xl hover:bg-white transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-heading font-black text-sm text-zinc-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={isSoldOut}
                    className="w-9 h-9 flex items-center justify-center font-bold text-base text-zinc-700 hover:text-black rounded-xl hover:bg-white transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isSoldOut}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isSoldOut
                      ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
                      : isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-950 hover:bg-[#FF8A00] text-white'
                  }`}
                >
                  {isSoldOut ? (
                    'Hozirda sotuvda mavjud emas'
                  ) : isAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Savatga qo‘shildi!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Savatga qo‘shish
                    </>
                  )}
                </button>
              </div>

              {/* Direct Telegram Order Button */}
              {!isSoldOut && (
                <button
                  onClick={handleDirectTelegramOrder}
                  className="w-full py-3.5 px-6 bg-[#FF8A00] hover:bg-[#E57C00] text-zinc-950 font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Hozir Telegram orqali xarid qilish
                </button>
              )}
            </div>

            {/* "Mahsulot haqida" Section */}
            <div className="pt-6 border-t border-zinc-100">
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-950 mb-4">
                Mahsulot haqida ma’lumot
              </h3>

              <div className="space-y-3 text-xs">
                {product.material && (
                  <div className="flex items-start justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-600">Materiali:</span>
                    <span className="font-semibold text-zinc-900 text-right">
                      {product.material}
                    </span>
                  </div>
                )}

                {product.country && (
                  <div className="flex items-start justify-between py-2 border-b border-zinc-100">
                    <span className="text-zinc-600">Ishlab chiqarilgan mamlakat:</span>
                    <span className="font-semibold text-zinc-900 text-right">
                      {product.country}
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-600">Mavjudlik holati:</span>
                  <span
                    className={`font-bold ${
                      isSoldOut ? 'text-red-500' : 'text-emerald-600'
                    }`}
                  >
                    {isSoldOut ? 'Sotilgan' : 'Omborda mavjud'}
                  </span>
                </div>

                <div className="flex items-start justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-600">Filial:</span>
                  <span className="font-semibold text-zinc-900">
                    {activeBranch?.name}
                  </span>
                </div>

                {product.description && (
                  <div className="pt-3">
                    <span className="block text-zinc-600 mb-1">Tavsif:</span>
                    <p className="text-zinc-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Assurances */}
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 grid grid-cols-2 gap-3 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#FF8A00] shrink-0" />
                <span>Filialdan bepul olib ketish</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#FF8A00] shrink-0" />
                <span>O‘zbekiston bo‘ylab yetkazish</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF8A00] shrink-0" />
                <span>100% sifat va original tovar</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#FF8A00] shrink-0" />
                <span>O‘lcham to‘g‘ri kelmasa almashtirish</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-zinc-200">
            <ProductCarousel
              title="O‘xshash mahsulotlar"
              subtitle={`${activeBranch?.name} kolleksiyasi`}
              products={relatedProducts}
            />
          </div>
        )}
      </div>

      {/* Lightbox / Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 p-2 text-white bg-zinc-800/80 rounded-full hover:bg-zinc-700"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={images[activeImageIndex]}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
