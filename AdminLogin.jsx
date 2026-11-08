import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import { Logo } from '../../components/Logo';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

export const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const session = DataService.login(email, password);
      if (onLoginSuccess) onLoginSuccess(session);
      navigate('/admin/mahsulotlar');
    } catch (err) {
      setError(err.message || 'Kirishda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    try {
      const session = DataService.login(demoEmail, 'password123');
      if (onLoginSuccess) onLoginSuccess(session);
      navigate('/admin/mahsulotlar');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size="lg" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 text-zinc-900 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF8A00]" /> Boshqaruv paneli
          </span>
          <h1 className="font-heading font-black text-2xl uppercase text-zinc-950 mt-2">
            Tizimga kirish
          </h1>
          <p className="text-xs text-zinc-600 mt-1">
            Do‘kon egasi (Owner) yoki filial xodimi (Staff) hisobiga kiring
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#FF8A00]" /> Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="masalan: owner@zumrad.uz"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#FF8A00]" /> Parol
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-sm focus:outline-none focus:border-[#FF8A00] focus:ring-2 focus:ring-[#FF8A00]/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-[#FF8A00] hover:bg-[#E57C00] text-zinc-950 font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            Kirish <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="mt-6 pt-5 border-t border-zinc-100">
          <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider text-center mb-2.5">
            Tezkor test kirish tugmalari:
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('owner@zumrad.uz')}
              className="w-full p-2.5 rounded-xl bg-zinc-950 text-white hover:bg-black text-left text-xs flex items-center justify-between font-medium transition-colors"
            >
              <div>
                <span className="font-bold text-[#FF8A00]">👑 Do‘kon Egasi (Owner)</span>
                <span className="block text-[10px] text-zinc-400">Barcha filiallar va sozlamalar</span>
              </div>
              <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded">Kirish</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('staff1@zumrad.uz')}
              className="w-full p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800 hover:bg-zinc-100 text-left text-xs flex items-center justify-between font-medium transition-colors"
            >
              <div>
                <span className="font-bold text-zinc-900">🏢 1-filial Xodimi (Staff)</span>
                <span className="block text-[10px] text-zinc-600">Faqat 1-filial tovar va buyurtmalari</span>
              </div>
              <span className="text-[10px] bg-zinc-200 px-2 py-1 rounded">Kirish</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('staff2@zumrad.uz')}
              className="w-full p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800 hover:bg-zinc-100 text-left text-xs flex items-center justify-between font-medium transition-colors"
            >
              <div>
                <span className="font-bold text-zinc-900">🏢 2-filial Xodimi (Staff)</span>
                <span className="block text-[10px] text-zinc-600">Faqat 2-filial tovar va buyurtmalari</span>
              </div>
              <span className="text-[10px] bg-zinc-200 px-2 py-1 rounded">Kirish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
