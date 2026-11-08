import React, { useState } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import { Plus, Edit2, Trash2, Layers, X, Check } from 'lucide-react';

export const AdminCategories = () => {
  const { isOwner } = useOutletContext();
  if (!isOwner) {
    return <Navigate to="/admin/mahsulotlar" replace />;
  }

  const [categories, setCategories] = useState(() => DataService.getCategories());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const initialForm = {
    name: '',
    image: '',
    description: '',
    hasSizes: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const refreshCategories = () => {
    setCategories(DataService.getCategories());
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      image: cat.image,
      description: cat.description || '',
      hasSizes: cat.hasSizes !== false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Ushbu kategoriyani o'chirmoqchimisiz?")) {
      DataService.deleteCategory(id);
      refreshCategories();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      DataService.updateCategory(editingCategory.id, formData);
    } else {
      DataService.addCategory(formData);
    }

    setIsModalOpen(false);
    refreshCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
            Katalog tuzilishi
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl uppercase text-zinc-950">
            Kategoriyalarni boshqarish
          </h1>
          <p className="text-xs text-zinc-600 mt-0.5">
            Do‘kondagi tovar turlarini qo‘shish, o‘zgartirish va rasmlarini yangilash
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-3 px-5 bg-[#FF8A00] hover:bg-[#E57C00] text-zinc-950 font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Yangi kategoriya
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[4/3] w-full bg-zinc-100 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-heading font-black text-base text-zinc-950 uppercase">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                )}
                <div className="mt-2 text-[10px] font-bold text-zinc-600">
                  {cat.hasSizes ? '✓ Poyabzal o‘lchamlari mavjud' : '✗ O‘lchamsiz (Sumkalar/Hamyonlar)'}
                </div>
              </div>
            </div>

            <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="p-2 text-zinc-600 hover:text-amber-600 rounded-lg hover:bg-white"
                title="Tahrirlash"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-2 text-zinc-600 hover:text-red-600 rounded-lg hover:bg-white"
                title="O‘chirish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-heading font-black text-lg uppercase text-zinc-950">
                {editingCategory ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-zinc-600 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                  Kategoriya nomi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Qishki Etiklar"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:border-[#FF8A00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                  Rasm havolasi (URL) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:border-[#FF8A00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                  Qisqacha tavsif
                </label>
                <textarea
                  rows="2"
                  placeholder="Bo‘lim haqida ma'lumot..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-zinc-300 text-xs resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasSizesCheck"
                  checked={formData.hasSizes}
                  onChange={(e) =>
                    setFormData({ ...formData, hasSizes: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#FF8A00]"
                />
                <label
                  htmlFor="hasSizesCheck"
                  className="text-xs font-semibold text-zinc-800"
                >
                  Poyabzal o‘lchamlari talab qilinadi
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#FF8A00] text-zinc-950 font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-md"
                >
                  Saqlash
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
