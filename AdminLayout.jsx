import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import { Logo } from '../../components/Logo';
import {
  Package,
  ShoppingBag,
  Layers,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
  Building2,
  ExternalLink,
  Lock,
} from 'lucide-react';

export const AdminLayout = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const isOwner = user?.role === 'owner';
  const branchName =
    user?.branch_id === 'filial-1'
      ? '1-filial (Chilonzor)'
      : user?.branch_id === 'filial-2'
      ? '2-filial (Yunusobod)'
      : 'Barcha filiallar';

  const handleLogout = () => {
    DataService.logout();
    if (onLogout) onLogout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-zinc-950 text-white border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin/mahsulotlar" className="flex items-center gap-2">
              <Logo size="sm" textColor="text-white" />
              <span className="hidden sm:inline-block px-2 py-0.5 bg-[#FF8A00] text-zinc-950 text-[10px] font-black uppercase rounded">
                Boshqaruv
              </span>
            </Link>
          </div>

          {/* User profile & Branch Lock Badge */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold text-white flex items-center gap-1.5 justify-end">
                {user?.name}
                {isOwner ? (
                  <span className="px-2 py-0.5 bg-[#FF8A00] text-zinc-950 text-[10px] font-black uppercase rounded-full">
                    👑 Do‘kon Egasi
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> {branchName}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-zinc-400">
                {user?.email}
              </div>
            </div>

            {/* View live store link */}
            <Link
              to="/"
              target="_blank"
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-colors"
              title="Do‘konni ochish"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Saytga o‘tish</span>
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition-colors"
              title="Chiqish"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-zinc-900 border-t border-zinc-800 px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-2">
            <NavLink
              to="/admin/mahsulotlar"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-xs font-heading font-extrabold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#FF8A00] text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`
              }
            >
              <Package className="w-4 h-4" /> Mahsulotlar
            </NavLink>

            <NavLink
              to="/admin/buyurtmalar"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-xs font-heading font-extrabold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#FF8A00] text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`
              }
            >
              <ShoppingBag className="w-4 h-4" /> Buyurtmalar
            </NavLink>

            {/* Owner-only Tabs */}
            {isOwner && (
              <>
                <NavLink
                  to="/admin/kategoriyalar"
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-lg text-xs font-heading font-extrabold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#FF8A00] text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`
                  }
                >
                  <Layers className="w-4 h-4" /> Kategoriyalar
                </NavLink>

                <NavLink
                  to="/admin/xodimlar"
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-lg text-xs font-heading font-extrabold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#FF8A00] text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`
                  }
                >
                  <Users className="w-4 h-4" /> Xodimlar
                </NavLink>

                <NavLink
                  to="/admin/sozlamalar"
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-lg text-xs font-heading font-extrabold uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#FF8A00] text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`
                  }
                >
                  <Settings className="w-4 h-4" /> Filial & Telegram sozlamalari
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet context={{ user, isOwner }} />
      </main>
    </div>
  );
};
