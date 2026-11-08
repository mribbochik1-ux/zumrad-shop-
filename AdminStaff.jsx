import React, { useState } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import { Plus, UserPlus, Lock, ShieldCheck, UserX, UserCheck, X } from 'lucide-react';

export const AdminStaff = () => {
  const { isOwner } = useOutletContext();
  if (!isOwner) {
    return <Navigate to="/admin/mahsulotlar" replace />;
  }

  const [staffList, setStaffList] = useState(() => DataService.getStaffList());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialForm = {
    name: '',
    email: '',
    password: '',
    phone: '',
    branch_id: 'filial-1',
  };
  const [formData, setFormData] = useState(initialForm);

  const refreshStaff = () => {
    setStaffList(DataService.getStaffList());
  };

  const handleToggleStatus = (member) => {
    if (member.role === 'owner') return;
    const nextStatus = member.status === 'active' ? 'disabled' : 'active';
    DataService.updateStaff(member.id, { status: nextStatus });
    refreshStaff();
  };

  const handleBranchChange = (memberId, branch_id) => {
    DataService.updateStaff(memberId, { branch_id });
    refreshStaff();
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      alert("Email va parol majburiy!");
      return;
    }

    DataService.addStaff(formData);
    setIsModalOpen(false);
    setFormData(initialForm);
    refreshStaff();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
            Xavfsizlik & Ruxsatlar
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl uppercase text-zinc-950">
            Xodimlar hisoblari (Staff Accounts)
          </h1>
          <p className="text-xs text-zinc-600 mt-0.5">
            Xodimlarni filialga biriktirish va ularning huquqlarini boshqarish
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-3 px-5 bg-[#FF8A00] hover:bg-[#E57C00] text-zinc-950 font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Yangi xodim qo‘shish
        </button>
      </div>

      {/* Staff List Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Xodim</th>
              <th className="py-3.5 px-4">Roli</th>
              <th className="py-3.5 px-4">Biriktirilgan Filial</th>
              <th className="py-3.5 px-4">Holati</th>
              <th className="py-3.5 px-4 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {staffList.map((member) => {
              const isMemberOwner = member.role === 'owner';
              const isDisabled = member.status === 'disabled';

              return (
                <tr key={member.id} className="hover:bg-zinc-50/80">
                  <td className="py-3 px-4">
                    <div className="font-bold text-zinc-950">{member.name}</div>
                    <div className="text-[11px] text-zinc-600 font-mono">
                      {member.email} • {member.phone || "Tel yo'q"}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {isMemberOwner ? (
                      <span className="px-2.5 py-1 bg-[#FF8A00] text-zinc-950 rounded-full font-black text-[10px] uppercase">
                        👑 Owner
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-zinc-100 text-zinc-800 rounded-full font-bold text-[10px] uppercase">
                        Staff
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {isMemberOwner ? (
                      <span className="text-zinc-600 font-semibold">
                        Barcha filiallar
                      </span>
                    ) : (
                      <select
                        value={member.branch_id || 'filial-1'}
                        onChange={(e) =>
                          handleBranchChange(member.id, e.target.value)
                        }
                        className="px-2.5 py-1 rounded-lg border border-zinc-300 text-xs font-bold uppercase bg-zinc-50 focus:outline-none focus:border-[#FF8A00]"
                      >
                        <option value="filial-1">1-filial (Chilonzor)</option>
                        <option value="filial-2">2-filial (Yunusobod)</option>
                      </select>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        isDisabled
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isDisabled ? 'Faolsiz' : 'Faol'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {!isMemberOwner && (
                      <button
                        onClick={() => handleToggleStatus(member)}
                        className={`px-3 py-1.5 rounded-xl font-heading font-bold text-[10px] uppercase tracking-wider transition-colors ${
                          isDisabled
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-red-50 hover:text-red-600'
                        }`}
                      >
                        {isDisabled ? 'Faollashtirish' : 'Faolsizlantirish'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-heading font-black text-lg uppercase text-zinc-950">
                Yangi xodim hisobini yaratish
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-zinc-600 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                  Xodim ismi va familiyasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Malika Sobirova"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:border-[#FF8A00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                  Kirish emaili *
                </label>
                <input
                  type="email"
                  required
                  placeholder="staff@zumrad.uz"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:border-[#FF8A00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                  Parol *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Kamida 6 belgi"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:border-[#FF8A00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                  Telefon raqami
                </label>
                <input
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                  Biriktiriladigan Filial *
                </label>
                <select
                  value={formData.branch_id}
                  onChange={(e) =>
                    setFormData({ ...formData, branch_id: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-bold uppercase"
                >
                  <option value="filial-1">1-filial (Chilonzor)</option>
                  <option value="filial-2">2-filial (Yunusobod)</option>
                </select>
                <span className="block text-[10px] text-zinc-600 mt-1">
                  Xodim faqat shu filialning mahsulot va buyurtmalarini ko‘radi va boshqara oladi.
                </span>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#FF8A00] text-zinc-950 font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-md"
                >
                  Xodimni yaratish
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 px-4 bg-zinc-100 text-zinc-700 font-heading font-bold text-xs uppercase rounded-xl"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
