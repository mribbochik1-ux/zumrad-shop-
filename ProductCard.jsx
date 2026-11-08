import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Eye, Check } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addToCart } = useCart();

  const isSoldOut = product.status === 'sotilgan';
  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;

    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : null;

    addToCart(product, defaultSize, defaultColor, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:border-zinc-300 transition-all duration-300 hover:shadow-xl">
      {/* Image container with aspect ratio and skeleton */}
      <Link
        to={`/mahsulot/${product.id}`}
        className="relative block aspect-square w-full overflow-hidden bg-zinc-100"
      >
        {/* Skeleton while loading */}
        {!isLoaded && <div className="absolute inset-0 skeleton" />}

        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {isSoldOut ? (
            <span className="px-2.5 py-1 bg-zinc-900/90 text-white rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
              Sotilgan
            </span>
          ) : product.is_new ? (
            <span className="px-2.5 py-1 bg-[#FF8A00] text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
              Yangi
            </span>
          ) : null}

          {product.brand && (
            <span className="px-2 py-0.5 bg-white/90 text-zinc-800 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
              {product.brand}
            </span>
          )}
        </div>

        {/* Hover Quick Action Buttons */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {!isSoldOut && (
            <button
              onClick={handleQuickAdd}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-all ${
                justAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-950 hover:bg-[#FF8A00] text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Qo‘shildi
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Savatga
                </>
              )}
            </button>
          )}

          <div className="p-2 bg-white text-zinc-900 rounded-xl shadow-lg hover:text-[#FF8A00] transition-colors">
            <Eye className="w-4 h-4" />
          </div>
        </div>
      </Link>

      {/* Info content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">
            {product.category}
          </div>
          <Link
            to={`/mahsulot/${product.id}`}
            className="font-heading font-extrabold text-sm sm:text-base text-zinc-950 uppercase line-clamp-1 hover:text-[#FF8A00] transition-colors"
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <span className="font-heading font-black text-base sm:text-lg text-zinc-950">
              {DataService.formatPrice(product.price)}
            </span>
          </div>

          {/* Sizes or colors preview indicator */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="text-[10px] font-bold text-zinc-600">
              {product.sizes.length} ta o‘lcham
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
