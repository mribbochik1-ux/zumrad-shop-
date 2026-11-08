import React from 'react';
import { useBranch } from '../context/BranchContext';
import { MapPin, ArrowRight, Store, Clock, Phone } from 'lucide-react';
import { Logo } from './Logo';

export const BranchModal = () => {
  const { isModalOpen, selectBranch, branches, selectedBranchId, closeModal } = useBranch();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-100 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-44 h-44 bg-[#FF8A00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size="lg" />
          </div>
          <span className="inline-block px-3 py-1 bg-[#FF8A00]/10 text-[#FF8A00] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            10 yildan beri siz bilan
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-zinc-950 uppercase">
            Qaysi filialga buyurtma bermoqchisiz?
          </h2>
          <p className="text-sm text-zinc-600 mt-2 max-w-md mx-auto">
            Zumrad Shop 2 ta alohida filialga ega. Har bir filialning o‘z mahsulotlari, narxlari va ombori mavjud.
          </p>
        </div>

        {/* Branch Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {branches.map((branch) => {
            const isCurrent = selectedBranchId === branch.id;
            return (
              <button
                key={branch.id}
                onClick={() => selectBranch(branch.id)}
                className={`group relative text-left p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between ${
                  isCurrent
                    ? 'border-[#FF8A00] bg-[#FF8A00]/5 ring-4 ring-[#FF8A00]/10'
                    : 'border-zinc-200 hover:border-[#FF8A00] hover:bg-zinc-50/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-heading font-black text-lg group-hover:bg-[#FF8A00] transition-colors">
                      {branch.id === 'filial-1' ? '1' : '2'}
                    </span>
                    <span className="text-xs font-bold text-zinc-600 group-hover:text-[#FF8A00] flex items-center gap-1 transition-colors">
                      Tanlash <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-lg text-zinc-950 uppercase group-hover:text-[#FF8A00] transition-colors">
                    {branch.name}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-zinc-600">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                      <span>{branch.working_hours}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                      <span>{branch.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] font-semibold text-zinc-600">
                  <span>Telegram: @{branch.telegram_username}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-xs text-zinc-600">
          Xohlagan vaqtingiz sayt yuqorisidan filialni almashtirishingiz mumkin.
        </div>
      </div>
    </div>
  );
};
