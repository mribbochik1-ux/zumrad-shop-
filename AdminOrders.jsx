import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  Filter,
  Check,
  RotateCcw,
  Send,
  Lock,
} from 'lucide-react';

export const AdminOrders = () => {
  const { user, isOwner } = useOutletContext();
  const branches = useMemo(() => DataService.getBranches(), []);

  const [selectedBranchFilter, setSelectedBranchFilter] = useState(
    isOwner ? 'all' : user?.branch_id
  );
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState([]);

  const refreshOrders = () => {
    if (isOwner) {
      if (selectedBranchFilter === 'all') {
        setOrders(DataService.getOrders());
      } else {
        setOrders(DataService.getOrders(selectedBranchFilter));
      }
    } else {
      // Staff ONLY gets orders of their branch!
      setOrders(DataService.getOrders(user?.branch_id));
    }
  };

  useEffect(() => {
    refreshOrders();
  }, [selectedBranchFilter, user?.branch_id, isOwner]);

  const handleToggleStatus = (order) => {
    const nextStatus = order.status === 'yangi' ? 'bajarildi' : 'yangi';
    DataService.updateOrderStatus(order.id, nextStatus);
    refreshOrders();
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        if (statusFilter !== 'all' && o.status !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [orders, statusFilter]);

  const formatPrice = DataService.formatPrice;

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">
            Mijozlar buyurtmalari
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl uppercase text-zinc-950">
            Buyurtmalar ro‘yxati
          </h1>
          <p className="text-xs text-zinc-600 mt-0.5">
            {isOwner
              ? "Barcha filiallar bo'yicha Telegram orqali tushgan buyurtmalar"
              : `Faqat ${user?.branch_id === 'filial-1' ? '1-filial' : '2-filial'} buyurtmalari`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Branch filter (Owner only) */}
          {isOwner ? (
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-zinc-300 text-xs font-semibold focus:outline-none focus:border-[#FF8A00] bg-zinc-50"
            >
              <option value="all">Barcha filiallar</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-100 rounded-xl text-xs font-bold text-zinc-700">
              <Lock className="w-3.5 h-3.5 text-[#FF8A00]" />
              <span>{user?.branch_id === 'filial-1' ? '1-filial' : '2-filial'}</span>
            </div>
          )}

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-300 text-xs font-semibold focus:outline-none focus:border-[#FF8A00] bg-zinc-50"
          >
            <option value="all">Barcha holatlar</option>
            <option value="yangi">Yangi buyurtmalar</option>
            <option value="bajarildi">Bajarilganlar</option>
          </select>
        </div>
      </div>

      {/* Orders Grid / Cards */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl p-8 border border-zinc-200">
          <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="font-heading font-black text-lg uppercase text-zinc-950">
            Buyurtmalar mavjud emas
          </h3>
          <p className="text-xs text-zinc-600 mt-1">
            Ushbu bo‘limda hozircha hech qanday buyurtma qayd etilmagan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((order) => {
            const isCompleted = order.status === 'bajarildi';
            const branch = branches.find((b) => b.id === order.branch_id);

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'border-zinc-200 opacity-90'
                    : 'border-[#FF8A00] ring-4 ring-[#FF8A00]/5 shadow-md'
                }`}
              >
                <div>
                  {/* Order Top Bar: ID, Date, Branch Badge & Status */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-zinc-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-zinc-950">
                          #{order.id}
                        </span>
                        <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded text-[10px] font-bold uppercase">
                          {branch?.name || order.branch_id}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-600 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(order.created_at).toLocaleString('uz-UZ')}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(order)}
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-colors ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-[#FF8A00] text-zinc-950 hover:bg-[#E57C00]'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Bajarildi
                        </>
                      ) : (
                        'Yangi'
                      )}
                    </button>
                  </div>

                  {/* Customer Details */}
                  <div className="mt-3 p-3 bg-zinc-50 rounded-2xl text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#FF8A00]" />
                      <strong className="text-zinc-900">{order.customer_name}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#FF8A00]" />
                      <a
                        href={`tel:${order.customer_phone}`}
                        className="text-zinc-700 hover:underline font-mono"
                      >
                        {order.customer_phone}
                      </a>
                    </div>
                    {order.comment && (
                      <div className="flex items-start gap-2 pt-1 border-t border-zinc-100 text-zinc-600">
                        <MapPin className="w-3.5 h-3.5 text-[#FF8A00] shrink-0 mt-0.5" />
                        <span>{order.comment}</span>
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="mt-3 space-y-2">
                    <div className="text-[11px] font-bold uppercase text-zinc-600">
                      Tovarlar ro‘yxati:
                    </div>
                    <div className="divide-y divide-zinc-100 max-h-48 overflow-y-auto">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="py-1.5 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 rounded-lg object-cover shrink-0 border"
                              />
                            )}
                            <div className="truncate">
                              <span className="font-bold text-zinc-900">
                                {item.name}
                              </span>
                              <div className="text-[10px] text-zinc-600">
                                {item.size ? `O'lcham: ${item.size} • ` : ''}
                                {item.color ? `Rang: ${item.color} • ` : ''}
                                Soni: {item.quantity} dona
                              </div>
                            </div>
                          </div>
                          <span className="font-heading font-black text-xs text-zinc-900 shrink-0">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Total & Bottom Action */}
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-600 uppercase font-semibold block">
                      Jami summa:
                    </span>
                    <span className="font-heading font-black text-lg text-[#FF8A00]">
                      {formatPrice(order.total)}
                    </span>
                  </div>

                  <a
                    href={`tel:${order.customer_phone}`}
                    className="py-2 px-3 bg-zinc-950 hover:bg-[#FF8A00] text-white hover:text-black rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" /> Qo‘ng‘iroq qilish
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
