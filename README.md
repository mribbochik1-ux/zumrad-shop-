# Zumrad Shop — Ayollar poyabzallari va sumkalar internet-do‘koni 🌸

O‘zbekistonda 10 yildan beri faoliyat yuritib kelayotgan **"Zumrad Shop"** uchun zamonaviy, tezkor va to‘liq o‘zbek tilidagi (lotin yozuvida) e-commerce platformasi.

---

## 🚀 Texnologiyalar
- **Frontend**: React 18 + Vite 6 + React Router 6
- **Styling**: Tailwind CSS 3 (maxsus yorqin to‘q sariq `#FF8A00` brend rangi va oq/qora sport-retail dizayni)
- **Tipografiya**: Archivo / Oswald (qalin, bosh harflarda sarlovhalar) + Inter (asosiy matnlar)
- **Ikonkalar**: Lucide React
- **Backend / DB**: Supabase / Lovable Cloud PostgreSQL (to‘liq RLS xavfsizlik siyosatlari bilan `schema.sql`)
- **Avtonom rejim**: Supabase bo‘lmasa ham brauzerda to‘liq ishlaydigan `localStorage` ma’lumotlar bazasi va avtomatik rasm siqish moduli.

---

## 🏢 2 Filialli Tizim (Branch System)
1. **1-filial (Chilonzor)** va **2-filial (Yunusobod)** to‘liq alohida do‘kon sifatida ishlaydi.
2. Saytga ilk kirishda filial tanlash modali chiqadi.
3. `/filial-1` va `/filial-2` to‘g‘ridan-to‘g‘ri yo‘naltiruvchi havolalar mavjud.
4. Mahsulotlar, narxlar, savat va buyurtmalar har bir filial uchun alohida.

---

## 🛍 Sahifalar
- **Bosh sahifa (`/`)**: Katta hero banner, bo‘limlar to‘plami, "Yangi kelganlar" va "Ommabop" karusellari, 10 yillik tarix va ishonch kafolatlari.
- **Katalog (`/katalog`)**: Kategoriya, o‘lcham (35-41), rang, brend va narx bo‘yicha ko‘p bosqichli filtrlar, qidiruv va *"Yana ko‘rsatish"* tugmasi.
- **Mahsulot sahifasi (`/mahsulot/:id`)**: Rasm galereyasi + zoom, o‘lcham va rang tanlash, material, ishlab chiqarilgan mamlakat, savatga qo‘shish va tezkor Telegram xarid.
- **Savat va Telegram orqali rasmiylashtirish (`/savat`)**: Filial bo‘yicha tovarlar, xaridor ismi va telefon raqami, buyurtmani saqlash hamda `https://t.me/<branch_telegram_username>?text=...` orqali to‘liq xabar bilan Telegramni ochish.
- **Biz haqimizda & Filiallar (`/biz-haqimizda`)**: Har bir filial manzili, mo‘ljal, telefon, ish vaqti va xarita.

---

## 🛡 Boshqaruv paneli (`/admin`)
Kirish uchun login va parollar:
- 👑 **Boshqaruvchi (Owner)**:
  - Email: `owner@zumrad.uz`
  - Parol: `password123`
  - *Huquqlari: Barcha filiallar, barcha tovar va buyurtmalar, xodimlarni boshqarish, kategoriyalar va filial sozlamalari (Telegram username, telefon, manzil).*
- 🏢 **1-filial xodimi (Staff)**:
  - Email: `staff1@zumrad.uz`
  - Parol: `password123`
  - *Huquqlari: Faqat 1-filial tovarlarini qo‘shish/tahrirlash, narx belgilash, "sotilgan" qilish va faqat 1-filial buyurtmalarini bajarish.*
- 🏢 **2-filial xodimi (Staff)**:
  - Email: `staff2@zumrad.uz`
  - Parol: `password123`
  - *Huquqlari: Faqat 2-filial tovarlarini va buyurtmalarini boshqarish.*

---

## 💻 Saytni ishga tushirish

```bash
# Kutubxonalarni o'rnatish
npm install

# Dasturchi rejimida ishga tushirish (Local Dev Server)
npm run dev

# Ishlab chiqarishga yig'ish (Production Build)
npm run build
```
