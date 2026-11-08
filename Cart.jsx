import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBranch } from '../context/BranchContext';
import { useCart } from '../context/CartContext';
import { DataService } from '../services/dataService';
import {
  Trash2,
  Send,
  ShoppingBag,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  User,
  MessageSquare,
} from 'lucide-react';

export const Cart = () => {
  const { selectedBranchId, activeBranch } = useBranch();
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();

  // Customer form inputs
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+998 ');
  const [customerComment, setCustomerComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const formatPrice = DataService.formatPrice;

  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith('+998')) {
      val = '+998 ';
    }
    setCustomerPhone(val);
  };

  const handleCheckout = (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert("Iltimos, ismingizni kiriting.");
      return;
    }

    if (customerPhone.trim().length < 13) {
      alert("Iltimos, to'liq telefon raqamingizni kiriting (+998 XX XXX XX XX).");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save order to database / localStorage
      const orderPayload = {
        branch_id: selectedBranchId,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        comment: customerComment.trim() || null,
        items: items.map((it) => ({
          product_id: it.productId,
          name: it.name,
          brand: it.brand,
          price: it.price,
          size: it.size,
          color: it.color,
          quantity: it.quantity,
          image: it.image,
        })),
        total: totalPrice,
      };

      const savedOrder = DataService.addOrder(orderPayload);
      setPlacedOrder(savedOrder);

      // 2. Build prefilled Telegram Message
      const branchTitle =
        selectedBranchId === 'filial-1'
          ? 'Zumrad Shop - 1-filial'
          : 'Zumrad Shop - 2-filial';

      let message = `🌸 ${branchTitle} BUYURTMASI 🌸\n`;
      message += `🆔 Buyurtma raqami: #${savedOrder.id}\n`;
      message += `👤 Xaridor: ${customerName.trim()}\n`;
      message += `📞 Tel: ${customerPhone.trim()}\n`;
      if (customerComment.trim()) {
        message += `📍 Manzil/Izoh: ${customerComment.trim()}\n`;
      }
      message += `\n🛍 BUYURTMA QILINGAN TOVARLAR:\n`;

      items.forEach((item, index) => {
        message += `${index + 1}. "${item.name}"\n`;
        const details = [];
        if (item.size) details.push(`O'lcham: ${item.size}`);
        if (item.color) details.push(`Rang: ${item.color}`);
        if (details.length > 0) {
          message += `   (${details.join(', ')})\n`;
        }
        message += `   ${item.quantity} x ${formatPrice(item.price)} = ${formatPrice(
          item.price * item.quantity
        )}\n`;
      });

      message += `\n💰 JAMI SUMMA: ${formatPrice(totalPrice)}\n`;
      message += `📅 Sana: ${new Date().toLocaleString('uz-UZ')}\n\n`;
      message += `Iltimos, buyurtmani tasdiqlang va yetkazish vaqtini ma'lum qiling!`;

      // 3. Clear cart
      clearCart(selectedBranchId);

      // 4. Open Telegram link
      const telegramUsername = activeBranch?.telegram_username || 'zumrad_filial1';
      const telegramUrl = `https://t.me/${telegramUsername}?text=${encodeURIComponent(
        message
      )}`;

      // Open Telegram in a new window or current tab
      window.open(telegramUrl, '_blank');
    } catch (err) {
      console.error('Checkout error', err);
      alert("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was successfully placed
  if (placedOrder) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-zinc-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-zinc-200 shadow-xl text-center animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
            Buyurtma muvaffaqiyatli saqlandi
          </span>
          <h2 className="font-heading font-black text-2xl uppercase text-zinc-950 mt-1">
            Rahmat, {placedOrder.customer_name}!
          </h2>

          <div className="mt-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-600">Buyurtma ID:</span>
              <strong className="text-zinc-900 font-mono">#{placedOrder.id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600">Filial:</span>
              <strong className="text-zinc-900">{activeBranch?.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600">Jami summa:</span>
              <strong className="text-[#FF8A00] font-heading font-black text-sm">
                {formatPrice(placedOrder.total)}
              </strong>
            </div>
          </div>

          <p className="text-xs text-zinc-600 mt-4 leading-relaxed">
            Agar Telegram ilovangiz avtomatik ochilmagan bo‘lsa, quyidagi tugma orqali bevosita xodimimiz bilan bog‘laning:
          </p>

          <a
            href={`https://t.me/${activeBranch?.telegram_username}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 w-full py-3.5 px-4 bg-[#FF8A00] hover:bg-[#E57C00] text-zinc-950 font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" /> Telegram orqali xabarni yuborish
          </a>

          <Link
            to="/katalog"
            onClick={() => setPlacedOrder(null)}
            className="mt-3 block text-xs font-bold text-zinc-600 hover:text-zinc-900 uppercase tracking-wider py-2"
          >
            Katalogga qaytish
          </Link>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-600 mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-heading font-black text-2xl uppercase text-zinc-950">
          Savat hozircha bo‘sh
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 mt-2 max-w-sm">
          {activeBranch?.name} bo‘yicha hozircha hech qanday mahsulot tanlanmagan. Katalogimizdan o‘zingizga yoqqan tovarlarni savatga qo‘shing.
        </p>
        <Link
          to="/katalog"
          className="mt-6 px-8 py-3.5 bg-[#FF8A00] text-zinc-950 font-heading font-black text-xs uppercase tracking-wider rounded-full shadow-lg hover:shadow-orange-500/20 transition-all"
        >
          Katalogga o‘tish
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title & Branch Warning */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
            Buyurtmani rasmiylashtirish
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-zinc-950 uppercase tracking-tight">
            Xarid savatchasi
          </h1>

          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-full text-xs font-semibold text-zinc-800 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#FF8A00]" />
            <span>
              Ushbu tovarlar: <strong className="text-zinc-950 font-bold">{activeBranch?.name}</strong> orqali yuboriladi
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Cart items list (8 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h2 className="font-heading font-black text-sm uppercase text-zinc-950">
                Tanlangan tovarlar ({items.length} ta tur)
              </h2>
              <button
                onClick={() => clearCart()}
                className="text-xs text-red-500 hover:underline font-semibold"
              >
                Savatni tozalash
              </button>
            </div>

            <div className="divide-y divide-zinc-100">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="py-4 flex gap-4 items-center justify-between"
                >
                  {/* Image */}
                  <Link
                    to={`/mahsulot/${item.productId}`}
                    className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-2">
                    <Link
                      to={`/mahsulot/${item.productId}`}
                      className="font-heading font-extrabold text-sm text-zinc-950 uppercase hover:text-[#FF8A00] transition-colors truncate block"
                    >
                      {item.name}
                    </Link>

                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-600">
                      {item.size && (
                        <span className="px-2 py-0.5 bg-zinc-100 rounded text-[11px] font-semibold text-zinc-800">
                          O‘lcham: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="px-2 py-0.5 bg-zinc-100 rounded text-[11px] font-semibold text-zinc-800">
                          Rang: {item.color}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 font-heading font-black text-sm text-zinc-900">
                      {formatPrice(item.price)}
                    </div>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 p-0.5">
                      <button
                        onClick={() => updateQuantity(item.key, -1)}
                        className="w-7 h-7 flex items-center justify-center font-bold text-zinc-700 hover:text-black rounded-lg hover:bg-white"
                      >
                        -
                      </button>
                      <span className="w-7 text-center font-heading font-bold text-xs text-zinc-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.key, 1)}
                        className="w-7 h-7 flex items-center justify-center font-bold text-zinc-700 hover:text-black rounded-lg hover:bg-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="p-2 text-zinc-600 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Customer Form & Telegram Checkout (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
                2-qadam
              </span>
              <h2 className="font-heading font-black text-xl uppercase text-zinc-950">
                Xaridor ma’lumotlari
              </h2>
              <p className="text-xs text-zinc-600 mt-1">
                Buyurtmangiz to‘g‘ridan-to‘g‘ri filialimizning Telegram profiliga yuboriladi.
              </p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FF8A00]" /> Ism va Familiyangiz *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Dilnoza Karimova"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#FF8A00]" /> Telefon raqamingiz *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={handlePhoneChange}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 text-sm font-mono focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#FF8A00]" /> Yetkazish manzili yoki izoh
                </label>
                <textarea
                  rows="2"
                  placeholder="Manzil, mo‘ljal yoki qo‘shimcha istaklaringiz..."
                  value={customerComment}
                  onChange={(e) => setCustomerComment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20 resize-none"
                />
              </div>

              {/* Order Calculation Breakdown */}
              <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Mahsulotlar summasi:</span>
                  <span className="font-semibold text-zinc-900">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Filialdan olib ketish:</span>
                  <span className="font-semibold text-emerald-600">Bepul</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Yetkazib berish (Toshkent / Viloyat):</span>
                  <span className="text-zinc-600">Telegram orqali hisoblanadi</span>
                </div>
                <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline">
                  <span className="font-heading font-black text-sm uppercase text-zinc-950">
                    Jami to‘lov:
                  </span>
                  <span className="font-heading font-black text-2xl text-[#FF8A00]">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Telegram Checkout Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-4 px-6 bg-[#FF8A00] hover:bg-[#E57C00] text-zinc-950 font-heading font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-orange-500/25 transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-98"
              >
                <Send className="w-5 h-5" />
                Telegram orqali buyurtma berish
              </button>
            </form>

            <div className="pt-2 text-[11px] text-zinc-600 text-center leading-normal">
              Tugmani bosganingizda buyurtmangiz do‘kon tizimida qayd etiladi va Telegram ochilib tayyor xabar bilan xodimimizga yuboriladi.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
