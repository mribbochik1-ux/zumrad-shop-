import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { BranchProvider } from './context/BranchContext';
import { CartProvider } from './context/CartContext';
import { DataService } from './services/dataService';

// Layout & Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BranchModal } from './components/BranchModal';

// Pages
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { About } from './pages/About';

// Admin Pages
import { AdminLogin } from './pages/Admin/AdminLogin';
import { AdminLayout } from './pages/Admin/AdminLayout';
import { AdminProducts } from './pages/Admin/AdminProducts';
import { AdminOrders } from './pages/Admin/AdminOrders';
import { AdminCategories } from './pages/Admin/AdminCategories';
import { AdminStaff } from './pages/Admin/AdminStaff';
import { AdminSettings } from './pages/Admin/AdminSettings';

// Public layout wrapper that conditionally renders customer header/footer
const PublicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BranchModal />
    </div>
  );
};

// Admin protected route
const ProtectedAdmin = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => DataService.getCurrentUser());

  const handleLoginSuccess = (session) => {
    setCurrentUser(session);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <BranchProvider>
        <CartProvider>
          <Routes>
            {/* PUBLIC STORE ROUTES */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              }
            />

            {/* Direct branch routes: /filial-1 and /filial-2 */}
            <Route
              path="/filial-1"
              element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              }
            />
            <Route
              path="/filial-2"
              element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              }
            />

            <Route
              path="/katalog"
              element={
                <PublicLayout>
                  <Catalog />
                </PublicLayout>
              }
            />

            <Route
              path="/mahsulot/:id"
              element={
                <PublicLayout>
                  <ProductDetail />
                </PublicLayout>
              }
            />

            <Route
              path="/savat"
              element={
                <PublicLayout>
                  <Cart />
                </PublicLayout>
              }
            />

            <Route
              path="/biz-haqimizda"
              element={
                <PublicLayout>
                  <About />
                </PublicLayout>
              }
            />

            {/* ADMIN ROUTES */}
            <Route
              path="/admin/login"
              element={<AdminLogin onLoginSuccess={handleLoginSuccess} />}
            />

            <Route
              path="/admin"
              element={
                <ProtectedAdmin user={currentUser}>
                  <AdminLayout user={currentUser} onLogout={handleLogout} />
                </ProtectedAdmin>
              }
            >
              <Route index element={<Navigate to="mahsulotlar" replace />} />
              <Route path="mahsulotlar" element={<AdminProducts />} />
              <Route path="buyurtmalar" element={<AdminOrders />} />
              <Route path="kategoriyalar" element={<AdminCategories />} />
              <Route path="xodimlar" element={<AdminStaff />} />
              <Route path="sozlamalar" element={<AdminSettings />} />
            </Route>

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <PublicLayout>
                  <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                    <h1 className="font-heading font-black text-6xl text-zinc-950">404</h1>
                    <p className="text-zinc-600 mt-2">Kechirasiz, sahifa topilmadi.</p>
                    <a
                      href="/"
                      className="mt-6 px-6 py-3 bg-[#FF8A00] text-zinc-950 font-heading font-black text-xs uppercase tracking-wider rounded-full shadow-md"
                    >
                      Bosh sahifaga qaytish
                    </a>
                  </div>
                </PublicLayout>
              }
            />
          </Routes>
        </CartProvider>
      </BranchProvider>
    </Router>
  );
}
