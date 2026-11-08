import React from 'react';
import { Link } from 'react-router-dom';
import { useBranch } from '../context/BranchContext';
import { ArrowRight, Sparkles, MapPin, Award } from 'lucide-react';

export const HeroBanner = () => {
  const { activeBranch } = useBranch();

  return (
    <div className="relative w-full bg-zinc-950 text-white overflow-hidden py-16 sm:py-24 lg:py-28">
      {/* Background Graphic elements */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=2000&q=80"
          alt="Zumrad Shop Hero"
          className="w-full h-full object-cover object-center filter grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
      </div>

      {/* Subtle orange accent glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FF8A00]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl animate-slide-up">
          {/* Branch badge & Jubilee badge */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF8A00] text-zinc-950 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
              <Award className="w-3.5 h-3.5" /> 10 Yillik Tajriba
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
              <MapPin className="w-3 h-3 text-[#FF8A00]" /> {activeBranch?.name}
            </span>
          </div>

          {/* Big Bold Headline */}
          <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tighter leading-[0.95] text-white">
            NAFOSAT VA <br />
            <span className="text-[#FF8A00]">QULAYLIK</span> <br />
            BIRLASHGAN JOY
          </h1>

          {/* Subtext */}
          <p className="mt-5 text-sm sm:text-base lg:text-lg text-zinc-300 font-normal leading-relaxed max-w-lg">
            Zamonaviy ayollar poyabzallari va Italiya hamda Turkiya sifatidagi charm sumkalar to‘plami. Har bir qadamingizda betakror uslub.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/katalog"
              className="px-8 py-4 bg-[#FF8A00] hover:bg-[#E57C00] text-zinc-950 hover:text-black font-heading font-black text-sm uppercase tracking-wider rounded-full shadow-lg hover:shadow-orange-500/20 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              Katalogni ko‘rish
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/biz-haqimizda"
              className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-heading font-extrabold text-sm uppercase tracking-wider rounded-full backdrop-blur-md transition-colors border border-white/20"
            >
              Filial lokatsiyasi
            </Link>
          </div>

          {/* Micro stats */}
          <div className="mt-12 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-md">
            <div>
              <div className="font-heading font-black text-xl sm:text-2xl text-white">
                10+ <span className="text-[#FF8A00]">YIL</span>
              </div>
              <div className="text-[11px] text-zinc-400 font-medium uppercase">
                Bozorda faol
              </div>
            </div>
            <div>
              <div className="font-heading font-black text-xl sm:text-2xl text-white">
                2 TA
              </div>
              <div className="text-[11px] text-zinc-400 font-medium uppercase">
                Markaziy Filial
              </div>
            </div>
            <div>
              <div className="font-heading font-black text-xl sm:text-2xl text-white">
                100%
              </div>
              <div className="text-[11px] text-zinc-400 font-medium uppercase">
                Sifat kafolati
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
