import React, { useState } from 'react';
import { DataService } from '../services/dataService';
import { useBranch } from '../context/BranchContext';
import {
  MapPin,
  Phone,
  Clock,
  Send,
  Award,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export const About = () => {
  const branches = DataService.getBranches();
  const { selectedBranchId, selectBranch } = useBranch();
  const [activeTab, setActiveTab] = useState(selectedBranchId || 'filial-1');

  const currentBranch = branches.find((b) => b.id === activeTab) || branches[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-zinc-950 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-[#FF8A00]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block px-3 py-1 bg-[#FF8A00] text-zinc-950 rounded-full text-xs font-black uppercase tracking-wider mb-4">
            10 Yillik Yubiley (2016 - 2026)
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-6xl uppercase tracking-tight">
            Biz haqimizda & Filiallarimiz
          </h1>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            "Zumrad Shop" 10 yildan buyon O‘zbekiston ayollariga eng sara, nafis va qulay poyabzallar hamda zamonaviy sumkalar to‘plamini taqdim etib kelmoqda.
          </p>
        </div>
      </div>

      {/* 10-Year Story Section */}
      <section className="py-16 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
                Bizning missiyamiz
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-zinc-950 uppercase tracking-tight">
                Har bir qadamingizda nafosat va ishonch
              </h2>
              <p className="text-zinc-600 text-sm leading-relaxed">
                2016-yilda ilk marta o‘z eshiklarini ochgan "Zumrad Shop" o‘tgan 10 yil davomida ayollar poyabzallari bozorida mustahkam o‘rin egalladi. Bizning asosiy ustuvorligimiz — har bir ayol o‘zini betakror, nafis va eng muhimi, butun kun davomida mutlaqo qulay his qilishidir.
              </p>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Biz Turkiyadagi va Italiyadagi nufuzli fabrikalar bilan to‘g‘ridan-to‘g‘ri hamkorlik qilamiz. Mahsulotlarimiz haqiqiy charm, zamsh va yuqori texnologiyali materiallardan ishlab chiqariladi.
              </p>

              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-zinc-200">
                  <div className="font-heading font-black text-2xl text-[#FF8A00]">
                    100 000+
                  </div>
                  <div className="text-xs text-zinc-600 font-medium uppercase mt-0.5">
                    Mamnun mijozlar
                  </div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-zinc-200">
                  <div className="font-heading font-black text-2xl text-[#FF8A00]">
                    10 Yil
                  </div>
                  <div className="text-xs text-zinc-600 font-medium uppercase mt-0.5">
                    Uzluksiz faoliyat
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80"
                alt="Do'kon ichki ko'rinishi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Branches & Maps Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
              Tashrif buyuring
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-zinc-950 uppercase tracking-tight">
              Bizning Filiallarimiz
            </h2>
            <p className="text-zinc-600 text-xs sm:text-sm mt-2">
              O‘zingizga eng yaqin filialni tanlang va qulay vaqtda do‘konimizga kiring
            </p>

            {/* Branch Selector Switcher */}
            <div className="inline-flex p-1.5 bg-zinc-100 rounded-2xl mt-6 border border-zinc-200">
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setActiveTab(b.id);
                    selectBranch(b.id);
                  }}
                  className={`px-6 py-2.5 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider transition-all ${
                    activeTab === b.id
                      ? 'bg-[#FF8A00] text-zinc-950 shadow-md'
                      : 'text-zinc-700 hover:text-black'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active Branch Detailed Card & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Info details */}
            <div className="lg:col-span-5 bg-zinc-50 rounded-3xl p-6 sm:p-8 border border-zinc-200 flex flex-col justify-between space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase tracking-wider mb-3">
                  Tanlangan filial
                </span>
                <h3 className="font-heading font-black text-2xl uppercase text-zinc-950">
                  {currentBranch.name}
                </h3>
                <p className="text-xs text-zinc-600 mt-1">
                  Ushbu filialda ayollar poyabzallari va sumkalarining keng assortimenti doimiy sotuvda mavjud.
                </p>

                <div className="mt-6 space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FF8A00]/20 text-[#FF8A00] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-zinc-900 block">Manzil:</span>
                      <span className="text-zinc-600">{currentBranch.address}</span>
                      {currentBranch.landmark && (
                        <span className="block text-[11px] text-[#FF8A00] font-semibold mt-0.5">
                          Mo‘ljal: {currentBranch.landmark}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FF8A00]/20 text-[#FF8A00] flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-zinc-900 block">Ish vaqti:</span>
                      <span className="text-zinc-600">{currentBranch.working_hours}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FF8A00]/20 text-[#FF8A00] flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-zinc-900 block">Bog‘lanish:</span>
                      <a
                        href={`tel:${currentBranch.phone}`}
                        className="text-zinc-600 hover:underline font-mono"
                      >
                        {currentBranch.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://t.me/${currentBranch.telegram_username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 bg-[#FF8A00] hover:bg-[#E57C00] text-zinc-950 font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> @{currentBranch.telegram_username}
                </a>

                <a
                  href={currentBranch.map_url}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" /> Xaritada ochish
                </a>
              </div>
            </div>

            {/* Map Placeholder / Interactive visual */}
            <div className="lg:col-span-7 bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200 min-h-[350px] relative flex flex-col items-center justify-center text-center p-8">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="relative z-10 max-w-sm">
                <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center mx-auto mb-4 border-2 border-[#FF8A00]">
                  <MapPin className="w-8 h-8 text-[#FF8A00]" />
                </div>
                <h4 className="font-heading font-black text-lg uppercase text-zinc-950">
                  {currentBranch.name} lokatsiyasi
                </h4>
                <p className="text-xs text-zinc-600 mt-1 mb-4">
                  {currentBranch.address}
                </p>
                <a
                  href={currentBranch.map_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF8A00] text-zinc-950 font-heading font-black text-xs uppercase tracking-wider rounded-full shadow-lg"
                >
                  Google Maps / Yandex orqali yo‘nalish olish
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
