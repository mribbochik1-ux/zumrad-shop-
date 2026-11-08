import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { DataService } from '../services/dataService';
import { MapPin, Phone, Clock, Send, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  const branches = DataService.getBranches();
  const categories = DataService.getCategories();

  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-800">
      {/* 10-year jubilee celebration banner */}
      <div className="bg-[#FF8A00] text-zinc-950 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-black text-white rounded text-[11px] font-black">
              10 YIL
            </span>
            <span>2016 - 2026: Zumrad Shop 10 yildan buyon nafosat ulashmoqda!</span>
          </div>
          <span className="text-[12px] font-bold text-zinc-900">
            100 000+ dan ziyod mamnun xaridorlar
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1 & 2: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" textColor="text-white" />
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              "Zumrad Shop" — O‘zbekiston ayollari uchun eng zamonaviy, sifatli va qulay poyabzallar hamda bejirim sumkalar do‘koni. Har bir qadamingizda ishonch va go‘zallik!
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs font-semibold text-zinc-400">Biz bilan bog‘lanish:</span>
              <a
                href={`https://t.me/${branches[0]?.telegram_username}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-[#FF8A00] hover:text-zinc-950 transition-colors flex items-center justify-center text-white"
                title="Telegram 1-filial"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={`https://t.me/${branches[1]?.telegram_username}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-[#FF8A00] hover:text-zinc-950 transition-colors flex items-center justify-center text-white"
                title="Telegram 2-filial"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Filial 1 info */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-sm uppercase tracking-wider text-[#FF8A00]">
              {branches[0]?.name}
            </h4>
            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF8A00] shrink-0 mt-0.5" />
                <span className="leading-tight">{branches[0]?.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#FF8A00] shrink-0" />
                <span>{branches[0]?.working_hours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF8A00] shrink-0" />
                <a href={`tel:${branches[0]?.phone}`} className="hover:underline">
                  {branches[0]?.phone}
                </a>
              </div>
              <div className="pt-1">
                <a
                  href={`https://t.me/${branches[0]?.telegram_username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#FF8A00] hover:underline font-semibold"
                >
                  <Send className="w-3 h-3" /> @{branches[0]?.telegram_username}
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Filial 2 info */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-sm uppercase tracking-wider text-[#FF8A00]">
              {branches[1]?.name}
            </h4>
            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF8A00] shrink-0 mt-0.5" />
                <span className="leading-tight">{branches[1]?.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#FF8A00] shrink-0" />
                <span>{branches[1]?.working_hours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF8A00] shrink-0" />
                <a href={`tel:${branches[1]?.phone}`} className="hover:underline">
                  {branches[1]?.phone}
                </a>
              </div>
              <div className="pt-1">
                <a
                  href={`https://t.me/${branches[1]?.telegram_username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#FF8A00] hover:underline font-semibold"
                >
                  <Send className="w-3 h-3" /> @{branches[1]?.telegram_username}
                </a>
              </div>
            </div>
          </div>

          {/* Col 5: Quick links */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-sm uppercase tracking-wider text-white">
              Havolalar
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link to="/katalog" className="hover:text-[#FF8A00] transition-colors">
                  Barcha Katalog
                </Link>
              </li>
              <li>
                <Link to="/biz-haqimizda" className="hover:text-[#FF8A00] transition-colors">
                  Biz haqimizda & Filiallar
                </Link>
              </li>
              <li>
                <Link to="/savat" className="hover:text-[#FF8A00] transition-colors">
                  Savatcha
                </Link>
              </li>
              <li>
                <Link to="/filial-1" className="hover:text-[#FF8A00] transition-colors">
                  1-filial do‘koni
                </Link>
              </li>
              <li>
                <Link to="/filial-2" className="hover:text-[#FF8A00] transition-colors">
                  2-filial do‘koni
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF8A00]" />
                  <span>Xodimlar & Admin</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-3">
          <p>© {new Date().getFullYear()} Zumrad Shop. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-1">
            <span>O‘zbekistonda mehr bilan yaratilgan</span>
            <Heart className="w-3.5 h-3.5 text-[#FF8A00] fill-[#FF8A00]" />
          </div>
        </div>
      </div>
    </footer>
  );
};
