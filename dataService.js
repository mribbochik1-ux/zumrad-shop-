// Zumrad Shop Data Service
// Manages branches, categories, products, orders, staff, and settings.
// Backed by localStorage with full mock seed data and ready for Supabase integration.

const STORAGE_KEY_PRODUCTS = 'zumrad_products_v1';
const STORAGE_KEY_CATEGORIES = 'zumrad_categories_v1';
const STORAGE_KEY_ORDERS = 'zumrad_orders_v1';
const STORAGE_KEY_BRANCHES = 'zumrad_branches_v1';
const STORAGE_KEY_STAFF = 'zumrad_staff_v1';
const STORAGE_KEY_SETTINGS = 'zumrad_settings_v1';
const STORAGE_KEY_AUTH = 'zumrad_auth_session_v1';

export const INITIAL_BRANCHES = [
  {
    id: 'filial-1',
    name: '1-filial (Chilonzor)',
    slug: 'filial-1',
    telegram_username: 'zumrad_filial1',
    phone: '+998 90 123 45 67',
    address: "Toshkent sh., Chilonzor tumani, Bunyodkor shoh ko'chasi, 12-uy (Chilonzor metro bekati yaqinida)",
    working_hours: "09:00 - 21:00 (Dam olish kunlarisiz)",
    landmark: "Chilonzor Savdo Majmuasi ro'parasida",
    map_url: "https://maps.google.com/?q=41.2778,69.2045",
  },
  {
    id: 'filial-2',
    name: '2-filial (Yunusobod)',
    slug: 'filial-2',
    telegram_username: 'zumrad_filial2',
    phone: '+998 90 987 65 43',
    address: "Toshkent sh., Yunusobod tumani, Amir Temur shoh ko'chasi, 88-uy (Shahriston metro bekati yonida)",
    working_hours: "09:00 - 21:00 (Dam olish kunlarisiz)",
    landmark: "Mega Planet savdo markazidan 200m",
    map_url: "https://maps.google.com/?q=41.3650,69.2880",
  },
];

export const INITIAL_CATEGORIES = [
  {
    id: 'tuflilar',
    name: 'Tuflilar',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    description: 'Nafis poshnali va qulay klassik tuflilar',
    hasSizes: true,
  },
  {
    id: 'krossovkalar',
    name: 'Krossovkalar',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    description: 'Kundalik qulay va zamonaviy krossovkalar',
    hasSizes: true,
  },
  {
    id: 'etik-va-botinkalar',
    name: 'Etik va botinkalar',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80',
    description: 'Kuz va qish uchun issiq charm botinkalar',
    hasSizes: true,
  },
  {
    id: 'sandal-va-shippaklar',
    name: 'Sandal va shippaklar',
    image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80',
    description: 'Yozgi yengil va bejirim sandallar',
    hasSizes: true,
  },
  {
    id: 'shippak-uy-poyabzali',
    name: 'Shippak/uy poyabzali',
    image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
    description: 'Uy uchun yumshoq va qulay shippaklar',
    hasSizes: true,
  },
  {
    id: 'sumkalar',
    name: 'Sumkalar',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    description: 'Ayollar uchun nafis va sig‘imli charm sumkalar',
    hasSizes: false,
  },
  {
    id: 'hamyonlar',
    name: 'Hamyonlar',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    description: 'Ixcham va qulay charm hamyonlar',
    hasSizes: false,
  },
];

export const INITIAL_PRODUCTS = [
  // FILIAL-1 PRODUCTS
  {
    id: 'p-101',
    branch_id: 'filial-1',
    name: 'Klassik Lakli Qora Tufli',
    brand: 'Zumrad Milano',
    category: 'Tuflilar',
    price: 480000,
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['Qora', 'Qizil', 'Bej'],
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80',
    ],
    material: 'Tabiiy lakli charm',
    country: 'Turkiya',
    description: "Maxsus oqshomlar va rasmiy tadbirlar uchun o'ta nafis va qulay baland poshnali tufli. Yumshoq ichki taglik kun bo'yi qulaylik bag'ishlaydi.",
    status: 'mavjud',
    is_featured: true,
    is_new: true,
    created_at: '2026-11-01T10:00:00Z',
  },
  {
    id: 'p-102',
    branch_id: 'filial-1',
    name: 'Zamonaviy Sport Krossovka',
    brand: 'Bella Sport',
    category: 'Krossovkalar',
    price: 420000,
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: ['Oq', 'Pushti', 'Bej'],
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    ],
    material: "Nafas oluvchi eko-to'qima va havo yostig'i",
    country: 'Turkiya',
    description: "Kundalik sayr, sport va faol harakat uchun mo'ljallangan yengil va elastik ayollar krossovkasi. Ergonomik taglik harakatni osonlashtiradi.",
    status: 'mavjud',
    is_featured: true,
    is_new: true,
    created_at: '2026-11-03T11:20:00Z',
  },
  {
    id: 'p-103',
    branch_id: 'filial-1',
    name: 'Premium Charm Qo‘l Sumkasi',
    brand: 'Zumrad Exclusive',
    category: 'Sumkalar',
    price: 560000,
    sizes: [],
    colors: ['Qora', 'Zumrad Yashil', 'Bej'],
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    ],
    material: 'Tabiiy donador charm (Grained leather)',
    country: 'Italiya',
    description: "Har qanday ayol gardirobining bezagi. Metall tilla rang furnituralar, sig'imli ichki bo'limlar va yechiluvchi uzun tasma bilan jihozlangan.",
    status: 'mavjud',
    is_featured: true,
    is_new: false,
    created_at: '2026-10-25T14:15:00Z',
  },
  {
    id: 'p-104',
    branch_id: 'filial-1',
    name: 'Kuzgi Baland Etik (Qora)',
    brand: 'Eleganza',
    category: 'Etik va botinkalar',
    price: 690000,
    sizes: ['36', '37', '38', '39'],
    colors: ['Qora', 'Jigarrang'],
    images: [
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543499459-72f3da5d6b45?auto=format&fit=crop&w=800&q=80',
    ],
    material: 'Haqiqiy sigir charmi, ichi yarim jun',
    country: 'Turkiya',
    description: "Sovuq kunlar uchun nafis va qat'iy uslubdagi charm etik. Barqaror qulay poshna va sifatli metall zamok.",
    status: 'mavjud',
    is_featured: false,
    is_new: true,
    created_at: '2026-11-05T09:00:00Z',
  },
  {
    id: 'p-105',
    branch_id: 'filial-1',
    name: 'Kichik Qulay Hamyon',
    brand: 'Zumrad Classic',
    category: 'Hamyonlar',
    price: 180000,
    sizes: [],
    colors: ['Pushti', 'Qora', 'Qizil', 'Zumrad Yashil'],
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    ],
    material: 'Tabiiy matviy charm',
    country: 'Turkiya',
    description: "Karta va naqd pullar uchun ixcham, cho'ntak yoki kichik sumkachaga bemalol sig'adigan sifatli hamyon.",
    status: 'mavjud',
    is_featured: true,
    is_new: false,
    created_at: '2026-10-18T16:30:00Z',
  },
  {
    id: 'p-106',
    branch_id: 'filial-1',
    name: 'Klassik Bej Sandal',
    brand: 'Bella',
    category: 'Sandal va shippaklar',
    price: 340000,
    sizes: ['37', '38', '39'],
    colors: ['Bej', 'Oltin'],
    images: [
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80',
    ],
    material: 'Yumshoq eko-charm',
    country: 'Turkiya',
    description: 'Yozgi kunlar uchun juda yengil va jozibador sandal.',
    status: 'sotilgan',
    is_featured: false,
    is_new: false,
    created_at: '2026-09-12T10:00:00Z',
  },

  // FILIAL-2 PRODUCTS
  {
    id: 'p-201',
    branch_id: 'filial-2',
    name: 'Qulay Kundalik Zamsh Tufli',
    brand: 'Zumrad Milano',
    category: 'Tuflilar',
    price: 495000,
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['Bej', 'Moviy', 'Qora'],
    images: [
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    ],
    material: 'Tabiiy zamsh charm',
    country: 'Italiya',
    description: "Oyoqni siqmaydigan anatomik shakl, o'rta balandlikdagi barqaror poshna va nafis zamsh mato.",
    status: 'mavjud',
    is_featured: true,
    is_new: true,
    created_at: '2026-11-02T13:40:00Z',
  },
  {
    id: 'p-202',
    branch_id: 'filial-2',
    name: 'Shahar Uslubidagi Platforma Krossovka',
    brand: 'Vogue Step',
    category: 'Krossovkalar',
    price: 450000,
    sizes: ['37', '38', '39', '40'],
    colors: ['Oq', 'Kumush'],
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    ],
    material: 'Eko charm va mikrofibra',
    country: 'Turkiya',
    description: "Baland platformali zamonaviy krossovka. Bo'yni baland ko'rsatadi va qadamlarni qulay qiladi.",
    status: 'mavjud',
    is_featured: true,
    is_new: true,
    created_at: '2026-11-04T12:00:00Z',
  },
  {
    id: 'p-203',
    branch_id: 'filial-2',
    name: 'Katta Ishbilarmon Ayollar Sumkasi (Tote)',
    brand: 'Zumrad Elite',
    category: 'Sumkalar',
    price: 610000,
    sizes: [],
    colors: ['Jigarrang', 'Qora'],
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    ],
    material: 'Birinchi toifali tabiiy teri',
    country: 'Italiya',
    description: "Noutbuk, hujjatlar va kundalik kerakli barcha buyumlar uchun sig'imli premium sumka.",
    status: 'mavjud',
    is_featured: true,
    is_new: false,
    created_at: '2026-10-20T15:20:00Z',
  },
  {
    id: 'p-204',
    branch_id: 'filial-2',
    name: 'Traktor Taglikli Charm Botinka',
    brand: 'Milana Comfort',
    category: 'Etik va botinkalar',
    price: 580000,
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['Qora', 'Qaymoq rang'],
    images: [
      'https://images.unsplash.com/photo-1543499459-72f3da5d6b45?auto=format&fit=crop&w=800&q=80',
    ],
    material: 'Haqiqiy suv o‘tkazmaydigan charm',
    country: 'Turkiya',
    description: "Sirpanmaydigan qalin traktor taglik, qalin bog'ichlar va qulay yon fermuar.",
    status: 'mavjud',
    is_featured: true,
    is_new: true,
    created_at: '2026-11-06T08:30:00Z',
  },
  {
    id: 'p-205',
    branch_id: 'filial-2',
    name: 'Yumshoq Uy Shippagi (Mo‘ynali)',
    brand: 'Zumrad Home',
    category: 'Shippak/uy poyabzali',
    price: 160000,
    sizes: ['36-37', '38-39', '40-41'],
    colors: ['Pushti', 'Kulrang', 'Bej'],
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80',
    ],
    material: 'Eko mo‘yna va ortopedik taglik',
    country: 'O‘zbekiston',
    description: "Uyda o'zgacha iliqlik va shinamlik baxsh etuvchi yumshoq sun'iy mo'ynali shippak.",
    status: 'mavjud',
    is_featured: false,
    is_new: true,
    created_at: '2026-11-07T14:00:00Z',
  },
];

export const INITIAL_STAFF = [
  {
    id: 'user-owner',
    email: 'owner@zumrad.uz',
    password: 'password123',
    name: 'Zumrad Mahmudova',
    role: 'owner',
    branch_id: null, // owner has access to all branches
    phone: '+998 90 000 00 01',
    status: 'active',
  },
  {
    id: 'user-staff1',
    email: 'staff1@zumrad.uz',
    password: 'password123',
    name: 'Malika Sobirova',
    role: 'staff',
    branch_id: 'filial-1',
    phone: '+998 90 123 45 67',
    status: 'active',
  },
  {
    id: 'user-staff2',
    email: 'staff2@zumrad.uz',
    password: 'password123',
    name: 'Nozima Karimova',
    role: 'staff',
    branch_id: 'filial-2',
    phone: '+998 90 987 65 43',
    status: 'active',
  },
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-1001',
    branch_id: 'filial-1',
    customer_name: 'Dildora Alimova',
    customer_phone: '+998 93 111 22 33',
    comment: "Chilonzor metrosida kutib olaman, iloji bo'lsa soat 17:00 da",
    items: [
      {
        product_id: 'p-101',
        name: 'Klassik Lakli Qora Tufli',
        price: 480000,
        size: '38',
        color: 'Qora',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      },
    ],
    total: 480000,
    status: 'yangi',
    created_at: '2026-11-08T09:15:00Z',
  },
  {
    id: 'ORD-2001',
    branch_id: 'filial-2',
    customer_name: 'Shahlo Qosimova',
    customer_phone: '+998 97 777 88 99',
    comment: "Ertaga Yunusobod filialidan o'zim olib ketaman",
    items: [
      {
        product_id: 'p-203',
        name: 'Katta Ishbilarmon Ayollar Sumkasi (Tote)',
        price: 610000,
        size: null,
        color: 'Jigarrang',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      },
    ],
    total: 610000,
    status: 'bajarildi',
    created_at: '2026-11-07T16:45:00Z',
  },
];

// Helper to get / save in localStorage
function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Storage read error', key, err);
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage write error', key, err);
  }
}

// Data service API
export const DataService = {
  // BRANCHES
  getBranches: () => {
    return getStored(STORAGE_KEY_BRANCHES, INITIAL_BRANCHES);
  },
  getBranchById: (id) => {
    const branches = DataService.getBranches();
    return branches.find((b) => b.id === id || b.slug === id) || branches[0];
  },
  updateBranch: (id, updates) => {
    const branches = DataService.getBranches();
    const idx = branches.findIndex((b) => b.id === id);
    if (idx !== -1) {
      branches[idx] = { ...branches[idx], ...updates };
      setStored(STORAGE_KEY_BRANCHES, branches);
      return branches[idx];
    }
    return null;
  },

  // CATEGORIES
  getCategories: () => {
    return getStored(STORAGE_KEY_CATEGORIES, INITIAL_CATEGORIES);
  },
  addCategory: (cat) => {
    const categories = DataService.getCategories();
    const newCat = {
      ...cat,
      id: cat.id || cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    };
    categories.push(newCat);
    setStored(STORAGE_KEY_CATEGORIES, categories);
    return newCat;
  },
  updateCategory: (id, updates) => {
    const categories = DataService.getCategories();
    const idx = categories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      categories[idx] = { ...categories[idx], ...updates };
      setStored(STORAGE_KEY_CATEGORIES, categories);
      return categories[idx];
    }
    return null;
  },
  deleteCategory: (id) => {
    const categories = DataService.getCategories().filter((c) => c.id !== id);
    setStored(STORAGE_KEY_CATEGORIES, categories);
    return true;
  },

  // PRODUCTS
  getProducts: (branchId = null) => {
    const products = getStored(STORAGE_KEY_PRODUCTS, INITIAL_PRODUCTS);
    if (!branchId) return products;
    return products.filter((p) => p.branch_id === branchId);
  },
  getProductById: (id, branchId = null) => {
    const products = DataService.getProducts(branchId);
    return products.find((p) => p.id === id) || null;
  },
  addProduct: (product) => {
    const products = getStored(STORAGE_KEY_PRODUCTS, INITIAL_PRODUCTS);
    const newProduct = {
      ...product,
      id: product.id || 'p-' + Date.now().toString().slice(-6),
      created_at: new Date().toISOString(),
      status: product.status || 'mavjud',
    };
    products.unshift(newProduct);
    setStored(STORAGE_KEY_PRODUCTS, products);
    return newProduct;
  },
  updateProduct: (id, updates) => {
    const products = getStored(STORAGE_KEY_PRODUCTS, INITIAL_PRODUCTS);
    const idx = products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updates };
      setStored(STORAGE_KEY_PRODUCTS, products);
      return products[idx];
    }
    return null;
  },
  deleteProduct: (id) => {
    const products = getStored(STORAGE_KEY_PRODUCTS, INITIAL_PRODUCTS).filter(
      (p) => p.id !== id
    );
    setStored(STORAGE_KEY_PRODUCTS, products);
    return true;
  },
  duplicateProduct: (id) => {
    const product = DataService.getProductById(id);
    if (!product) return null;
    const duplicated = {
      ...product,
      id: 'p-' + Date.now().toString().slice(-6),
      name: `${product.name} (Nusxa)`,
      created_at: new Date().toISOString(),
    };
    return DataService.addProduct(duplicated);
  },

  // ORDERS
  getOrders: (branchId = null) => {
    const orders = getStored(STORAGE_KEY_ORDERS, INITIAL_ORDERS);
    if (!branchId) return orders;
    return orders.filter((o) => o.branch_id === branchId);
  },
  addOrder: (order) => {
    const orders = getStored(STORAGE_KEY_ORDERS, INITIAL_ORDERS);
    const newOrder = {
      ...order,
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      created_at: new Date().toISOString(),
      status: 'yangi',
    };
    orders.unshift(newOrder);
    setStored(STORAGE_KEY_ORDERS, orders);
    return newOrder;
  },
  updateOrderStatus: (id, status) => {
    const orders = getStored(STORAGE_KEY_ORDERS, INITIAL_ORDERS);
    const idx = orders.findIndex((o) => o.id === id);
    if (idx !== -1) {
      orders[idx].status = status;
      setStored(STORAGE_KEY_ORDERS, orders);
      return orders[idx];
    }
    return null;
  },

  // STAFF
  getStaffList: () => {
    return getStored(STORAGE_KEY_STAFF, INITIAL_STAFF);
  },
  addStaff: (staffData) => {
    const list = DataService.getStaffList();
    const newStaff = {
      ...staffData,
      id: 'user-' + Date.now().toString().slice(-4),
      role: 'staff',
      status: 'active',
    };
    list.push(newStaff);
    setStored(STORAGE_KEY_STAFF, list);
    return newStaff;
  },
  updateStaff: (id, updates) => {
    const list = DataService.getStaffList();
    const idx = list.findIndex((s) => s.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      setStored(STORAGE_KEY_STAFF, list);
      return list[idx];
    }
    return null;
  },

  // AUTH SESSION (Mock Supabase Auth)
  login: (email, password) => {
    const staffList = DataService.getStaffList();
    const user = staffList.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );
    if (!user) {
      throw new Error("Email yoki parol noto'g'ri kiritildi");
    }
    if (user.status === 'disabled') {
      throw new Error("Ushbu hisob faolsizlantirilgan. Rahbariyatga murojaat qiling.");
    }
    const session = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role, // 'owner' | 'staff'
      branch_id: user.branch_id,
      token: 'mock-jwt-' + Math.random().toString(36).substring(2),
    };
    setStored(STORAGE_KEY_AUTH, session);
    return session;
  },
  getCurrentUser: () => {
    return getStored(STORAGE_KEY_AUTH, null);
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEY_AUTH);
  },

  // FORMATTER UTILITY
  formatPrice: (amount) => {
    return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
  },
};
