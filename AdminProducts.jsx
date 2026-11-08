import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import {
  Plus,
  Search,
  Copy,
  Edit2,
  Trash2,
  Upload,
  X,
  Check,
  Building2,
  Lock,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';

const COMMON_SIZES = ['35', '36', '37', '38', '39', '40', '41'];
const COMMON_COLORS = ['Qora', 'Oq', 'Bej', 'Jigarrang', 'Qizil', 'Pushti', 'Zumrad Yashil', 'Moviy'];

export const AdminProducts = () => {
  const { user, isOwner } = useOutletContext();
  const branches = useMemo(() => DataService.getBranches(), []);
  const categories = useMemo(() => DataService.getCategories(), []);

  // Filter state
  const [selectedBranchFilter, setSelectedBranchFilter] = useState(
    isOwner ? 'all' : user?.branch_id
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Products state
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const initialFormState = {
    branch_id: isOwner ? 'filial-1' : user?.branch_id,
    name: '',
    brand: '',
    category: categories[0]?.name || 'Tuflilar',
    price: '',
    sizes: ['36', '37', '38', '39'],
    colors: ['Qora'],
    images: [],
    material: '',
    country: 'Turkiya',
    description: '',
    status: 'mavjud',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [customColor, setCustomColor] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  // Load products (Staff is strictly restricted to their branch)
  const refreshProducts = () => {
    if (isOwner) {
      if (selectedBranchFilter === 'all') {
        setProducts(DataService.getProducts());
      } else {
        setProducts(DataService.getProducts(selectedBranchFilter));
      }
    } else {
      // Staff ONLY sees their branch!
      setProducts(DataService.getProducts(user?.branch_id));
    }
  };

  useEffect(() => {
    refreshProducts();
  }, [selectedBranchFilter, user?.branch_id, isOwner]);

  // Open Add modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...initialFormState,
      branch_id: isOwner ? (selectedBranchFilter === 'all' ? 'filial-1' : selectedBranchFilter) : user?.branch_id,
    });
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      branch_id: product.branch_id,
      name: product.name,
      brand: product.brand || '',
      category: product.category,
      price: product.price,
      sizes: product.sizes || [],
      colors: product.colors || [],
      images: product.images || [],
      material: product.material || '',
      country: product.country || '',
      description: product.description || '',
      status: product.status || 'mavjud',
    });
    setIsModalOpen(true);
  };

  // Duplicate Product
  const handleDuplicate = (id) => {
    const duplicated = DataService.duplicateProduct(id);
    if (duplicated) {
      refreshProducts();
    }
  };

  // Delete Product
  const handleDelete = (id) => {
    if (window.confirm("Rostdan ham ushbu mahsulotni o'chirmoqchimisiz?")) {
      DataService.deleteProduct(id);
      refreshProducts();
    }
  };

  // Toggle quick status (mavjud <-> sotilgan)
  const handleToggleStatus = (product) => {
    const nextStatus = product.status === 'mavjud' ? 'sotilgan' : 'mavjud';
    DataService.updateProduct(product.id, { status: nextStatus });
    refreshProducts();
  };

  // Automatic image compression & resizing
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsCompressing(true);

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          // Resize and compress via canvas
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.8 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);

          setFormData((prev) => {
            if (prev.images.length >= 5) {
              alert("Maksimal 5 ta rasm yuklash mumkin");
              return prev;
            }
            return {
              ...prev,
              images: [...prev.images, compressedDataUrl],
            };
          });
        };
      };
      reader.readAsDataURL(file);
    });

    setIsCompressing(false);
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Add custom color
  const handleAddCustomColor = (e) => {
    e.preventDefault();
    if (customColor.trim() && !formData.colors.includes(customColor.trim())) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, customColor.trim()],
      }));
      setCustomColor('');
    }
  };

  // Save product
  const handleSaveProduct = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Iltimos, mahsulot nomini kiriting");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      alert("Iltimos, to'g'ri narx kiriting");
      return;
    }

    // Strict staff verification
    const branchToSave = isOwner ? formData.branch_id : user?.branch_id;

    const payload = {
      ...formData,
      branch_id: branchToSave,
      price: Number(formData.price),
      images:
        formData.images.length > 0
          ? formData.images
          : ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'],
    };

    if (editingProduct) {
      DataService.updateProduct(editingProduct.id, payload);
    } else {
      DataService.addProduct(payload);
    }

    setIsModalOpen(false);
    refreshProducts();
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand?.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchCat) return false;
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [products, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top action bar: Title, Branch Switcher (if owner), Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
            Ombor & Narxlar
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl uppercase text-zinc-950">
            Mahsulotlar boshqaruvi
          </h1>
          <p className="text-xs text-zinc-600 mt-0.5">
            {isOwner
              ? "Barcha filiallar bo'yicha mahsulotlar to'liq nazorati"
              : `Siz faqat o'z filialingiz (${user?.branch_id === 'filial-1' ? '1-filial' : '2-filial'}) mahsulotlarini ko'rasiz va boshqarasiz`}
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="py-3 px-5 bg-[#FF8A00] hover:bg-[#E57C00] text-zinc-950 font-heading font-black text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-2 transition-transform transform active:scale-95"
        >
          <Plus className="w-4 h-4" /> Yangi mahsulot qo‘shish
        </button>
      </div>

      {/* Filters row: Search, Branch selector (Owner only), Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-zinc-200">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
          <input
            type="text"
            placeholder="Nomi, brend yoki kategoriya..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:border-[#FF8A00]"
          />
        </div>

        {/* Branch filter (Owner can toggle, Staff is locked) */}
        {isOwner ? (
          <div>
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs font-semibold focus:outline-none focus:border-[#FF8A00] bg-zinc-50"
            >
              <option value="all">Barcha filiallar ({products.length})</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-100 rounded-xl text-xs font-bold text-zinc-700">
            <Lock className="w-3.5 h-3.5 text-[#FF8A00]" />
            <span>
              Filial: {user?.branch_id === 'filial-1' ? '1-filial' : '2-filial'}
            </span>
          </div>
        )}

        {/* Status filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs font-semibold focus:outline-none focus:border-[#FF8A00] bg-zinc-50"
          >
            <option value="all">Barcha holatlar</option>
            <option value="mavjud">Faqat Mavjudlar</option>
            <option value="sotilgan">Faqat Sotilganlar</option>
          </select>
        </div>
      </div>

      {/* Product List Table / Mobile Cards */}
      <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Rasm & Nomi</th>
                <th className="py-3.5 px-4">Filial</th>
                <th className="py-3.5 px-4">Narxi</th>
                <th className="py-3.5 px-4">Holati</th>
                <th className="py-3.5 px-4">O‘lcham / Rang</th>
                <th className="py-3.5 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-zinc-600">
                    Mahsulotlar topilmadi
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isSold = p.status === 'sotilgan';
                  const branchInfo = branches.find((b) => b.id === p.branch_id);

                  return (
                    <tr key={p.id} className="hover:bg-zinc-50/80 transition-colors">
                      {/* Image & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || 'https://via.placeholder.com/80'}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-zinc-200"
                          />
                          <div>
                            <div className="font-heading font-black text-sm text-zinc-950 uppercase line-clamp-1">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-zinc-600">
                              {p.brand} • {p.category}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Branch */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 bg-zinc-100 rounded-md text-[11px] font-bold text-zinc-800 uppercase">
                          {branchInfo?.name || p.branch_id}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-heading font-black text-sm text-zinc-900">
                        {DataService.formatPrice(p.price)}
                      </td>

                      {/* Status toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(p)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors ${
                            isSold
                              ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                          title="Holatni almashtirish"
                        >
                          {isSold ? 'Sotilgan' : 'Mavjud'}
                        </button>
                      </td>

                      {/* Sizes / Colors */}
                      <td className="py-3 px-4 text-zinc-600">
                        {p.sizes && p.sizes.length > 0 ? (
                          <div className="text-[11px]">
                            {p.sizes.join(', ')}
                          </div>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      {/* Actions: Duplicate, Edit, Delete */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Fast Duplicate Button */}
                          <button
                            onClick={() => handleDuplicate(p.id)}
                            className="p-1.5 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
                            title="Nusxa ko‘chirish (Tezkor nusxa)"
                          >
                            <Copy className="w-4 h-4 text-blue-600" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
                            title="Tahrirlash"
                          >
                            <Edit2 className="w-4 h-4 text-amber-600" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 text-zinc-600 hover:text-red-600 rounded-lg hover:bg-zinc-100 transition-colors"
                            title="O‘chirish"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAST PRODUCT MODAL (Optimized for phone / desktop) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF8A00]">
                  Tezkor forma
                </span>
                <h3 className="font-heading font-black text-xl uppercase text-zinc-950">
                  {editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo‘shish'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-600 hover:text-zinc-900 rounded-full hover:bg-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 mt-4">
              {/* Branch Selector (Locked if Staff) */}
              {isOwner ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                    Filialni tanlang *
                  </label>
                  <select
                    value={formData.branch_id}
                    onChange={(e) =>
                      setFormData({ ...formData, branch_id: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-bold uppercase"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#FF8A00]" />
                  <span>
                    Mahsulot <strong>{user?.branch_id === 'filial-1' ? '1-filial' : '2-filial'}</strong>ga biriktiriladi.
                  </span>
                </div>
              )}

              {/* Multi-Image Upload with automatic compression */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                    Rasmlar (1 - 5 ta) *
                  </label>
                  <span className="text-[10px] text-zinc-600">
                    Avtomatik siqiladi va optimallashadi
                  </span>
                </div>

                {/* Previews */}
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {formData.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 group"
                    >
                      <img
                        src={img}
                        alt={`Preview ${i}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {formData.images.length < 5 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-zinc-300 hover:border-[#FF8A00] flex flex-col items-center justify-center cursor-pointer transition-colors text-zinc-600 hover:text-[#FF8A00] p-2 text-center">
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-[9px] font-bold uppercase">Yuklash</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Name & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                    Mahsulot nomi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Klassik Charm Tufli"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                    Brend
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: Zumrad Milano"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                    Kategoriya *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                    Narxi (so‘mda) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="450000"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-mono font-bold focus:outline-none focus:border-[#FF8A00]"
                  />
                </div>
              </div>

              {/* Sizes (Not mandatory for bags) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1.5">
                  O‘lchamlar (Poyabzallar uchun):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SIZES.map((size) => {
                    const isChecked = formData.sizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            sizes: isChecked
                              ? prev.sizes.filter((s) => s !== size)
                              : [...prev.sizes, size],
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          isChecked
                            ? 'bg-[#FF8A00] text-white border-[#FF8A00]'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1.5">
                  Ranglar:
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {COMMON_COLORS.map((color) => {
                    const isChecked = formData.colors.includes(color);
                    return (
                      <button
                        type="button"
                        key={color}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            colors: isChecked
                              ? prev.colors.filter((c) => c !== color)
                              : [...prev.colors, color],
                          }));
                        }}
                        className={`px-3 py-1 text-xs rounded-full border transition-all ${
                          isChecked
                            ? 'bg-zinc-950 text-white border-zinc-950 font-bold'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Material & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                    Materiali
                  </label>
                  <input
                    type="text"
                    placeholder="Tabiiy charm, zamsh..."
                    value={formData.material}
                    onChange={(e) =>
                      setFormData({ ...formData, material: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                    Ishlab chiqarilgan mamlakat
                  </label>
                  <input
                    type="text"
                    placeholder="Turkiya, Italiya..."
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                  Qisqacha tavsif
                </label>
                <textarea
                  rows="2"
                  placeholder="Mahsulot haqida ma'lumot..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-zinc-300 text-xs resize-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1">
                  Holati
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-bold uppercase"
                >
                  <option value="mavjud">Omborda mavjud</option>
                  <option value="sotilgan">Sotilgan (Tugagan)</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-zinc-100 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-[#FF8A00] hover:bg-[#E57C00] text-zinc-950 font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-lg"
                >
                  {editingProduct ? 'Saqlash' : 'Mahsulotni qo‘shish'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 px-4 bg-zinc-100 text-zinc-700 font-heading font-bold text-xs uppercase tracking-wider rounded-xl"
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
