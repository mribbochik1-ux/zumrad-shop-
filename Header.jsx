import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useBranch } from '../context/BranchContext';
import { useCart } from '../context/CartContext';
import { DataService } from '../services/dataService';
import { Logo } from './Logo';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Check,
  Phone,
  ShieldCheck,
  Send,
} from 'lucide-react';

export const Header = () => {
  const { branches, selectedBranchId, activeBranch, selectBranch, openModal } = useBranch();
  const { totalCount } = useCart();
  const categories = DataService.getCategories();
  const navigate = useNavigate();
  const location = useLocation();

  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const branchDropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(e.target)) {
        setIsBranchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track scroll for sticky shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/katalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top micro-bar: Branch announcement & direct contact */}
      <div className="bg-zinc-950 text-white text-[11px] font-medium py-1.5 px-4 tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse" />
            <span>
              Tanlangan: <strong className="text-[#FF8A00] font-bold">{activeBranch?.name}</strong>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-zinc-300">
            <span>📞 {activeBranch?.phone}</span>
            <span>🕒 {activeBranch?.working_hours}</span>
            <a
              href={`https://t.me/${activeBranch?.telegram_username}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#FF8A00] hover:underline flex items-center gap-1"
            >
              <Send className="w-3 h-3" /> @{activeBranch?.telegram_username}
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-shadow duration-200 border-b ${
          isScrolled ? 'shadow-md border-zinc-200' : 'border-zinc-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-zinc-800 hover:text-[#FF8A00] transition-colors focus:outline-none"
              aria-label="Menyu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center">
              <Logo size="md" />
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#FF8A00] ${
                location.pathname === '/' ? 'text-[#FF8A00]' : 'text-zinc-800'
              }`}
            >
              Bosh sahifa
            </Link>

            <Link
              to="/katalog"
              className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#FF8A00] ${
                location.pathname.startsWith('/katalog') ? 'text-[#FF8A00]' : 'text-zinc-800'
              }`}
            >
              Katalog
            </Link>

            {/* Quick Category Links */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-zinc-800 hover:text-[#FF8A00] py-2 transition-colors">
                Kategoriyalar <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </button>
              {/* Mega-menu dropdown */}
              <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-xl border border-zinc-100 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider px-3 py-1">
                  Barcha bo‘limlar
                </div>
                <div className="grid grid-cols-1 gap-1 mt-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/katalog?kategoriya=${encodeURIComponent(cat.name)}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-800 hover:bg-[#FF8A00]/10 hover:text-[#FF8A00] transition-colors"
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/biz-haqimizda"
              className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#FF8A00] ${
                location.pathname === '/biz-haqimizda' ? 'text-[#FF8A00]' : 'text-zinc-800'
              }`}
            >
              Biz haqimizda
            </Link>
          </nav>

          {/* Right Actions: Search, Branch Switcher, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Icon button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-zinc-700 hover:text-[#FF8A00] transition-colors rounded-full hover:bg-zinc-100 focus:outline-none"
              aria-label="Qidiruv"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Branch Switcher Pill with Dropdown */}
            <div className="relative" ref={branchDropdownRef}>
              <button
                onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200/80 rounded-full text-xs font-bold text-zinc-900 border border-zinc-200 transition-all focus:outline-none"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span className="hidden sm:inline font-heading uppercase tracking-tight">
                  {activeBranch?.name}
                </span>
                <span className="sm:hidden font-heading uppercase">
                  {selectedBranchId === 'filial-1' ? '1-filial' : '2-filial'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${
                    isBranchDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isBranchDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-zinc-100 p-2 z-50 animate-fade-in">
                  <div className="text-[11px] font-bold text-zinc-600 uppercase px-3 py-1">
                    Filialni almashtirish
                  </div>
                  <div className="space-y-1 mt-1">
                    {branches.map((b) => {
                      const isSelected = selectedBranchId === b.id;
                      return (
                        <button
                          key={b.id}
                          onClick={() => {
                            selectBranch(b.id);
                            setIsBranchDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-[#FF8A00]/10 text-[#FF8A00] font-bold'
                              : 'text-zinc-800 hover:bg-zinc-50'
                          }`}
                        >
                          <div>
                            <div className="font-heading uppercase text-xs">
                              {b.name}
                            </div>
                            <div className="text-[11px] text-zinc-600 font-normal line-clamp-1">
                              {b.address}
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#FF8A00] shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon button */}
            <Link
              to="/savat"
              className="relative p-2.5 bg-zinc-950 hover:bg-[#FF8A00] text-white rounded-full transition-colors flex items-center justify-center focus:outline-none group"
              aria-label="Savat"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF8A00] group-hover:bg-zinc-950 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-colors">
                  {totalCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Modal Bar (Toggles when clicked) */}
        {isSearchOpen && (
          <div className="border-t border-zinc-100 bg-zinc-50/90 p-3 animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  placeholder="Krossovka, tufli, charm sumka yoki brend qidiring..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-white pl-10 pr-24 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-3 py-1 bg-[#FF8A00] hover:bg-[#E57C00] text-white text-xs font-bold rounded-lg uppercase tracking-wider"
                >
                  Qidirish
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Slide-in Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 animate-fade-in overflow-y-auto">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <Logo size="sm" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 bg-zinc-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Branch Switcher in Mobile Drawer */}
              <div className="mt-4 p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-2">
                  Faol filial:
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => selectBranch(b.id)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
                        selectedBranchId === b.id
                          ? 'bg-[#FF8A00] text-white shadow-sm'
                          : 'bg-white text-zinc-700 border border-zinc-200'
                      }`}
                    >
                      {b.id === 'filial-1' ? '1-filial' : '2-filial'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation links */}
              <div className="mt-6 space-y-1">
                <Link
                  to="/"
                  className="block px-3 py-2.5 rounded-xl font-heading font-bold text-sm uppercase text-zinc-900 hover:bg-zinc-100"
                >
                  Bosh sahifa
                </Link>
                <Link
                  to="/katalog"
                  className="block px-3 py-2.5 rounded-xl font-heading font-bold text-sm uppercase text-zinc-900 hover:bg-zinc-100"
                >
                  Barcha Katalog
                </Link>
                <Link
                  to="/biz-haqimizda"
                  className="block px-3 py-2.5 rounded-xl font-heading font-bold text-sm uppercase text-zinc-900 hover:bg-zinc-100"
                >
                  Biz haqimizda & Filiallar
                </Link>
              </div>

              {/* Categories list */}
              <div className="mt-6 pt-4 border-t border-zinc-100">
                <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider px-3 mb-2">
                  Kategoriyalar
                </div>
                <div className="space-y-1">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      to={`/katalog?kategoriya=${encodeURIComponent(c.name)}`}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]" />
                      <span>{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom staff link and contacts */}
            <div className="mt-8 pt-4 border-t border-zinc-100 space-y-3">
              <a
                href={`https://t.me/${activeBranch?.telegram_username}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-[#FF8A00] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Telegram kanal
              </a>
              <Link
                to="/admin"
                className="w-full py-2 px-3 bg-zinc-100 text-zinc-600 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-zinc-200"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Xodimlar kirishi
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
