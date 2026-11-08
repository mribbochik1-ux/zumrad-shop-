import React, { useRef } from 'react';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductCarousel = ({ title, subtitle, products = [] }) => {
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const cardWidth = 280;
      const scrollAmount = direction === 'left' ? -cardWidth * 2 : cardWidth * 2;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title & Arrow Buttons */}
        <div className="flex items-end justify-between mb-6">
          <div>
            {subtitle && (
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
                {subtitle}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-zinc-950 uppercase tracking-tight">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="p-2.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-colors shadow-sm focus:outline-none"
              aria-label="Oldingisi"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-colors shadow-sm focus:outline-none"
              aria-label="Keyingisi"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-64 sm:w-72 shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
