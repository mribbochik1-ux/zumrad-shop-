import React, { useMemo } from 'react';
import { useBranch } from '../context/BranchContext';
import { DataService } from '../services/dataService';
import { HeroBanner } from '../components/HeroBanner';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCarousel } from '../components/ProductCarousel';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Store,
  Award,
  ArrowRight,
} from 'lucide-react';

export const Home = () => {
  const { selectedBranchId, activeBranch } = useBranch();

  // Branch-specific products
  const products = useMemo(() => {
    return DataService.getProducts(selectedBranchId);
  }, [selectedBranchId]);

  const categories = useMemo(() => {
    return DataService.getCategories();
  }, []);

  // "Yangi kelganlar" (latest products sorted by date)
  const newArrivals = useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 8);
  }, [products]);

  // "Ommabop" (popular / featured products)
  const popularProducts = useMemo(() => {
    return products.filter((p) => p.is_featured || p.status === 'mavjud').slice(0, 8);
  }, [products]);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Category Cards Grid under Hero */}
      <section className="py-12 sm:py-16 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
                Bo‘limlar
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-zinc-950 uppercase tracking-tight">
                Kategoriyalar bo‘yicha tanlang
              </h2>
            </div>
            <Link
              to="/katalog"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-[#FF8A00] transition-colors"
            >
              Barcha tovarlar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. "Yangi kelganlar" Carousel */}
      <ProductCarousel
        title="Yangi kelganlar"
        subtitle={`${activeBranch?.name} yangiliklari`}
        products={newArrivals}
      />

      {/* 4. Value Propositions / Trust Badges */}
      <section className="py-8 bg-zinc-950 text-white my-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF8A00]/20 text-[#FF8A00] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-black text-sm uppercase">10 Yillik Tajriba</h4>
                <p className="text-xs text-zinc-400 mt-0.5">2016-yildan beri ayollar ishonchi</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF8A00]/20 text-[#FF8A00] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-black text-sm uppercase">100% Sifat</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Turkiya va Italiya materiallari</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF8A00]/20 text-[#FF8A00] flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-black text-sm uppercase">2 Ta Filial</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Toshkent markazida qulay joylashuv</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF8A00]/20 text-[#FF8A00] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-black text-sm uppercase">Tezkor Yetkazish</h4>
                <p className="text-xs text-zinc-400 mt-0.5">O‘zbekiston bo‘ylab pochta va Yandex</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. "Ommabop" Carousel */}
      <ProductCarousel
        title="Ommabop mahsulotlar"
        subtitle="Eng ko‘p tanlanayotgan modellar"
        products={popularProducts}
      />

      {/* 6. About Section ("10 yildan beri siz bilan") */}
      <section className="py-16 sm:py-20 bg-zinc-50 border-t border-zinc-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Story text */}
            <div>
              <span className="inline-block px-3 py-1 bg-[#FF8A00]/10 text-[#FF8A00] rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                Bizning tariximiz
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading font-black text-zinc-950 uppercase tracking-tight leading-tight">
                10 yildan beri siz bilan — <br />
                <span className="text-[#FF8A00]">Zumrad Shop</span>
              </h2>
              <p className="mt-4 text-zinc-600 text-sm sm:text-base leading-relaxed">
                2016-yilda Toshkent shahrida o‘z faoliyatini boshlagan "Zumrad Shop" bugungi kunga qadar minglab ayollarning eng sevimli do‘koniga aylandi. Biz faqatgina poyabzal yoki sumka sotmaymiz — biz har bir mijozimizga o‘ziga bo‘lgan yuksak ishonch, nafislik va kun bo‘yi qulaylik ulashamiz.
              </p>
              <p className="mt-3 text-zinc-600 text-sm sm:text-base leading-relaxed">
                Bugun biz 2 ta yirik filialimiz bilan xizmatingizdamiz. Mahsulotlarimiz bevosita Turkiya va Italiyaning yetakchi fabrikalaridan keltiriladi hamda yuqori sifat standartlariga javob beradi.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/biz-haqimizda"
                  className="px-6 py-3.5 bg-zinc-950 hover:bg-[#FF8A00] text-white font-heading font-black text-xs uppercase tracking-wider rounded-full transition-colors flex items-center gap-2"
                >
                  Filiallarimiz bilan tanishish
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://t.me/${activeBranch?.telegram_username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 border-2 border-zinc-200 hover:border-[#FF8A00] text-zinc-900 font-heading font-extrabold text-xs uppercase tracking-wider rounded-full transition-colors"
                >
                  Telegram orqali savol berish
                </a>
              </div>
            </div>

            {/* Collage Image with 10-year badge */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
                  alt="Zumrad Shop do'koni"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating 10 year jubilee badge */}
              <div className="absolute -bottom-6 -left-6 bg-zinc-950 text-white p-5 rounded-2xl shadow-xl border-2 border-[#FF8A00] flex items-center gap-4">
                <div className="font-heading font-black text-4xl text-[#FF8A00]">
                  10
                </div>
                <div className="text-xs font-bold uppercase tracking-wider">
                  Yillik mustahkam <br />
                  <span className="text-zinc-400 font-normal">Sifat va Ishonch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
