import React, { useState } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import { Settings, Save, Check, Send, MapPin, Phone, Clock } from 'lucide-react';

export const AdminSettings = () => {
  const { isOwner } = useOutletContext();
  if (!isOwner) {
    return <Navigate to="/admin/mahsulotlar" replace />;
  }

  const [branches, setBranches] = useState(() => DataService.getBranches());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleBranchUpdate = (branchId, field, value) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === branchId ? { ...b, [field]: value } : b))
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    branches.forEach((b) => {
      DataService.updateBranch(b.id, b);
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
            Filiallar & Aloqa
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl uppercase text-zinc-950">
            Filial va Telegram sozlamalari
          </h1>
          <p className="text-xs text-zinc-600 mt-0.5">
            Har bir filialning Telegram username, manzili va telefon raqamlarini o‘zgartirish
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fade-in">
            <Check className="w-4 h-4" /> Barcha sozlamalar saqlandi!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {branches.map((branch, index) => (
            <div
              key={branch.id}
              className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-zinc-950 text-white font-heading font-black text-sm flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h3 className="font-heading font-black text-lg uppercase text-zinc-950">
                    {branch.name}
                  </h3>
                </div>
                <span className="text-xs font-mono text-zinc-600 font-bold">
                  ID: {branch.id}
                </span>
              </div>

              {/* Branch Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                  Filial to‘liq nomi *
                </label>
                <input
                  type="text"
                  required
                  value={branch.name}
                  onChange={(e) =>
                    handleBranchUpdate(branch.id, 'name', e.target.value)
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-bold"
                />
              </div>

              {/* Telegram Username */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-[#FF8A00]" /> Telegram Username (Buyurtmalar keladigan profil/bot) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-zinc-600 font-bold text-xs">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="zumrad_filial1"
                    value={branch.telegram_username}
                    onChange={(e) =>
                      handleBranchUpdate(
                        branch.id,
                        'telegram_username',
                        e.target.value.replace(/^@/, '')
                      )
                    }
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-mono font-bold focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>
                <span className="block text-[11px] text-zinc-600 mt-1">
                  Xaridor buyurtma berganida https://t.me/{branch.telegram_username} havolasi orqali ochiladi.
                </span>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#FF8A00]" /> Telefon raqami *
                </label>
                <input
                  type="text"
                  required
                  value={branch.phone}
                  onChange={(e) =>
                    handleBranchUpdate(branch.id, 'phone', e.target.value)
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-mono"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF8A00]" /> To‘liq manzil *
                </label>
                <textarea
                  rows="2"
                  required
                  value={branch.address}
                  onChange={(e) =>
                    handleBranchUpdate(branch.id, 'address', e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-xl border border-zinc-300 text-xs resize-none"
                />
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                  Mo‘ljal (Landmark)
                </label>
                <input
                  type="text"
                  value={branch.landmark || ''}
                  onChange={(e) =>
                    handleBranchUpdate(branch.id, 'landmark', e.target.value)
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs"
                />
              </div>

              {/* Working Hours */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FF8A00]" /> Ish vaqti
                </label>
                <input
                  type="text"
                  value={branch.working_hours}
                  onChange={(e) =>
                    handleBranchUpdate(branch.id, 'working_hours', e.target.value)
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs"
                />
              </div>

              {/* Map Link */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                  Google / Yandex Maps xarita havolasi
                </label>
                <input
                  type="url"
                  value={branch.map_url || ''}
                  onChange={(e) =>
                    handleBranchUpdate(branch.id, 'map_url', e.target.value)
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="py-4 px-8 bg-[#FF8A00] hover:bg-[#E57C00] text-zinc-950 font-heading font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Barcha o‘zgarishlarni saqlash
          </button>
        </div>
      </form>
    </div>
  );
};
