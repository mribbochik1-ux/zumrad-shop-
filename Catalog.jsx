import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBranch } from '../context/BranchContext';
import { DataService } from '../services/dataService';
import { ProductCard } from '../components/ProductCard';
import {
  SlidersHorizontal,
  X,
  Search,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';

const SIZES_LIST = ['36', '37', '38', '39', '40', '41'];
const COLORS_LIST = [
  'Qora',
  'Oq',
  'Bej',
  'Jigarrang',
  'Qizil',
  'Pushti',
  'Zumrad Yashil',
  'Moviy',
];

export const Catalog = () => {
  const { selectedBranchId, activeBranch } = useBranch();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const initialCategory = searchParams.get('kategoriya') || '';
  const initialQuery = searchParams.get('q') || '';

  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1500000 });
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-asc' | 'price-desc'

  // Pagination "Yana ko'rsatish"
  const PAGE_SIZE = 6;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Mobile filters drawer
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync when query params change
  useEffect(() => {
    if (searchParams.get('kategoriya')) {
      setSelectedCategory(searchParams.get('kategoriya'));
    }
    if (searchParams.get('q')) {
      setSearchQuery(searchParams.get('q'));
    }
  }, [searchParams]);

  const allCategories = useMemo(() => DataService.getCategories(), []);
  const allProducts = useMemo(
    () => DataService.getProducts(selectedBranchId),
    [selectedBranchId]
  );

  // Extract unique brands for current branch
  const availableBrands = useMemo(() => {
    const set = new Set();
    allProducts.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set);
  }, [allProducts]);

  // Toggle size in array
  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Toggle color in array
  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrand('');
    setPriceRange({ min: 0, max: 1500000 });
    setSortBy('newest');
    setSearchParams({});
  };

  // Active filter count badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedSizes.length > 0) count += selectedSizes.length;
    if (selectedColors.length > 0) count += selectedColors.length;
    if (selectedBrand) count++;
    if (priceRange.min > 0 || priceRange.max < 1500000) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedCategory, selectedSizes, selectedColors, selectedBrand, priceRange, searchQuery]);

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((product) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchBrand = product.brand?.toLowerCase().includes(q);
          const matchCategory = product.category?.toLowerCase().includes(q);
          const matchDesc = product.description?.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchCategory && !matchDesc) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory && product.category !== selectedCategory) {
          return false;
        }

        // Brand filter
        if (selectedBrand && product.brand !== selectedBrand) {
          return false;
        }

        // Sizes filter (if product has sizes)
        if (selectedSizes.length > 0) {
          if (!product.sizes || product.sizes.length === 0) {
            // For items without sizes (like bags), only show if no size is chosen
            return false;
          }
          const hasMatchingSize = selectedSizes.some((s) =>
            product.sizes.includes(s)
          );
          if (!hasMatchingSize) return false;
        }

        // Colors filter
        if (selectedColors.length > 0) {
          if (!product.colors || product.colors.length === 0) return false;
          const hasMatchingColor = selectedColors.some((c) =>
            product.colors.includes(c)
          );
          if (!hasMatchingColor) return false;
        }

        // Price range
        if (product.price < priceRange.min || product.price > priceRange.max) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        // newest
        return new Date(b.created_at) - new Date(a.created_at);
      });
  }, [
    allProducts,
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedSizes,
    selectedColors,
    priceRange,
    sortBy,
  ]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar */}
      <div className="bg-zinc-50 border-b border-zinc-200 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
                {activeBranch?.name} Mahsulotlari
              </span>
              <h1 className="text-3xl sm:text-4xl font-heading font-black text-zinc-950 uppercase tracking-tight">
                {selectedCategory ? selectedCategory : 'Barcha Mahsulotlar'}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1">
                Jami {filteredProducts.length} ta mahsulot topildi
              </p>
            </div>

            {/* Search Input in Catalog */}
            <div className="w-full md:w-80">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  placeholder="Mahsulot nomi yoki brend..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-zinc-600 hover:text-zinc-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Controls row: Mobile Filter button + Sort Dropdown */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#FF8A00]" />
            Filtrlar {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-600 font-medium">
            <span>Ko‘rsatilmoqda:</span>
            <strong className="text-zinc-950">
              {Math.min(visibleCount, filteredProducts.length)} / {filteredProducts.length}
            </strong>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-semibold text-zinc-600">
              Saralash:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-2 pr-8 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#FF8A00]"
              >
                <option value="newest">Eng yangilari</option>
                <option value="price-asc">Narxi: Arzondan qimmatga</option>
                <option value="price-desc">Narxi: Qimmatdan arzonga</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Layout: Sidebar filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="font-heading font-black text-sm uppercase text-zinc-950 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FF8A00]" /> Filtrlar
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#FF8A00] hover:underline font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Tozalash
                </button>
              )}
            </div>

            {/* Filter: Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2.5">
                Kategoriya
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedCategory === ''
                      ? 'bg-[#FF8A00]/10 text-[#FF8A00] font-bold'
                      : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  <span>Barchasi</span>
                  <span className="text-[10px] text-zinc-600">({allProducts.length})</span>
                </button>

                {allCategories.map((c) => {
                  const count = allProducts.filter((p) => p.category === c.name).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.name)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                        selectedCategory === c.name
                          ? 'bg-[#FF8A00]/10 text-[#FF8A00] font-bold'
                          : 'text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-[10px] text-zinc-600">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter: Sizes */}
            <div className="pt-4 border-t border-zinc-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2.5">
                Poyabzal o‘lchami
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {SIZES_LIST.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        isSelected
                          ? 'border-[#FF8A00] bg-[#FF8A00] text-white shadow-sm'
                          : 'border-zinc-200 text-zinc-800 hover:border-zinc-400 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter: Colors */}
            <div className="pt-4 border-t border-zinc-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2.5">
                Ranglar
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {COLORS_LIST.map((color) => {
                  const isSelected = selectedColors.includes(color);
                  return (
                    <button
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                        isSelected
                          ? 'border-[#FF8A00] bg-[#FF8A00] text-white font-bold'
                          : 'border-zinc-200 text-zinc-700 bg-white hover:border-zinc-400'
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter: Brand */}
            {availableBrands.length > 0 && (
              <div className="pt-4 border-t border-zinc-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2.5">
                  Brend
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedBrand('')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      selectedBrand === ''
                        ? 'bg-[#FF8A00]/10 text-[#FF8A00]'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    Barcha brendlar
                  </button>
                  {availableBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        selectedBrand === brand
                          ? 'bg-[#FF8A00]/10 text-[#FF8A00]'
                          : 'text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filter: Price Range */}
            <div className="pt-4 border-t border-zinc-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2.5">
                Narx oralig‘i
              </h4>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="1500000"
                  step="50000"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))
                  }
                  className="w-full accent-[#FF8A00]"
                />
                <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
                  <span>0 so‘m</span>
                  <span>{DataService.formatPrice(priceRange.max)}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-zinc-50 rounded-3xl p-8 border border-zinc-200">
                <div className="w-16 h-16 bg-zinc-200 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-500">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-xl uppercase text-zinc-900">
                  Hech qanday mahsulot topilmadi
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-2 max-w-md mx-auto">
                  Tanlangan parametrlar bo‘yicha ushbu filialda tovarlar mavjud emas. Filtrlarni tozalang yoki boshqa so‘rov bilan qidiring.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-6 py-2.5 bg-[#FF8A00] text-zinc-950 font-heading font-black text-xs uppercase tracking-wider rounded-full shadow-md"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* "Yana ko'rsatish" (Load more) pagination */}
                {hasMore && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                      className="px-8 py-3.5 bg-zinc-950 hover:bg-[#FF8A00] text-white font-heading font-black text-xs uppercase tracking-wider rounded-full shadow-lg transition-colors"
                    >
                      Yana ko‘rsatish (+{Math.min(PAGE_SIZE, filteredProducts.length - visibleCount)})
                    </button>
                    <div className="mt-2 text-[11px] text-zinc-400">
                      Jami {filteredProducts.length} tadan {visibleCount} tasi ko‘rsatilmoqda
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="relative w-full max-w-sm ml-auto bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 animate-fade-in overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <h3 className="font-heading font-black text-base uppercase text-zinc-950 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#FF8A00]" /> Filtrlar
                </h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 rounded-full text-zinc-500 hover:text-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">
                  Kategoriya
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`p-2 rounded-xl text-xs font-semibold ${
                      selectedCategory === ''
                        ? 'bg-[#FF8A00] text-white'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    Barchasi
                  </button>
                  {allCategories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.name)}
                      className={`p-2 rounded-xl text-xs font-semibold ${
                        selectedCategory === c.name
                          ? 'bg-[#FF8A00] text-white'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mt-6 pt-4 border-t border-zinc-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">
                  O‘lcham
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {SIZES_LIST.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`py-2 text-xs font-bold rounded-xl border ${
                        selectedSizes.includes(size)
                          ? 'bg-[#FF8A00] text-white border-[#FF8A00]'
                          : 'bg-white text-zinc-800 border-zinc-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mt-6 pt-4 border-t border-zinc-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-2">
                  Ranglar
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {COLORS_LIST.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={`px-3 py-1.5 text-xs rounded-full border ${
                        selectedColors.includes(color)
                          ? 'bg-[#FF8A00] text-white border-[#FF8A00] font-bold'
                          : 'bg-white text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 space-y-2">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full py-3 bg-[#FF8A00] text-zinc-950 font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-md"
              >
                Ko‘rish ({filteredProducts.length} ta tovar)
              </button>
              <button
                onClick={resetFilters}
                className="w-full py-2.5 bg-zinc-100 text-zinc-600 font-heading font-bold text-xs uppercase tracking-wider rounded-xl"
              >
                Tozalash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
