-- =========================================================
-- Zumrad Shop - Supabase / Lovable Cloud PostgreSQL Schema
-- Database tables and strict Row Level Security (RLS) Policies
-- =========================================================

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. BRANCHES TABLE
CREATE TABLE IF NOT EXISTS public.branches (
    id TEXT PRIMARY KEY, -- 'filial-1', 'filial-2'
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    telegram_username TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    working_hours TEXT NOT NULL DEFAULT '09:00 - 21:00',
    landmark TEXT,
    map_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USER PROFILES WITH ROLES
CREATE TYPE public.app_role AS ENUM ('owner', 'staff');

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role public.app_role NOT NULL DEFAULT 'staff',
    branch_id TEXT REFERENCES public.branches(id) ON DELETE SET NULL, -- NULL for 'owner'
    phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    has_sizes BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('p-' || floor(random() * 900000 + 100000)::text),
    branch_id TEXT NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    sizes TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    images TEXT[] NOT NULL DEFAULT '{}',
    material TEXT,
    country TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'mavjud' CHECK (status IN ('mavjud', 'sotilgan')),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_new BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT ('ORD-' || floor(random() * 9000 + 1000)::text),
    branch_id TEXT NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    comment TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    status TEXT NOT NULL DEFAULT 'yangi' CHECK (status IN ('yangi', 'bajarildi')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

-- Enable RLS on all tables
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Helper functions to check role and branch
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS public.app_role
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() AND is_active = TRUE;
$$;

CREATE OR REPLACE FUNCTION public.get_auth_branch()
RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT branch_id FROM public.profiles WHERE id = auth.uid() AND is_active = TRUE;
$$;

-- ---------------------------------------------------------
-- BRANCHES POLICIES
-- Public can read branches. Only owner can update.
-- ---------------------------------------------------------
CREATE POLICY "Public branches read access"
ON public.branches FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Owner can update branches"
ON public.branches FOR ALL
TO authenticated
USING (public.get_auth_role() = 'owner')
WITH CHECK (public.get_auth_role() = 'owner');

-- ---------------------------------------------------------
-- PROFILES POLICIES
-- Owner can manage all staff profiles.
-- Staff can only view their own profile.
-- ---------------------------------------------------------
CREATE POLICY "Owner can manage all profiles"
ON public.profiles FOR ALL
TO authenticated
USING (public.get_auth_role() = 'owner')
WITH CHECK (public.get_auth_role() = 'owner');

CREATE POLICY "Staff can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- ---------------------------------------------------------
-- CATEGORIES POLICIES
-- Public can view categories. Only owner can insert/update/delete.
-- ---------------------------------------------------------
CREATE POLICY "Public categories read access"
ON public.categories FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Owner can manage categories"
ON public.categories FOR ALL
TO authenticated
USING (public.get_auth_role() = 'owner')
WITH CHECK (public.get_auth_role() = 'owner');

-- ---------------------------------------------------------
-- PRODUCTS POLICIES
-- 1. Public can read all products (front-end filters by active branch).
-- 2. Staff can ONLY select/insert/update/delete products belonging to THEIR branch.
-- 3. Owner can select/insert/update/delete products for ALL branches.
-- ---------------------------------------------------------
CREATE POLICY "Public products read access"
ON public.products FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Owner can manage all products"
ON public.products FOR ALL
TO authenticated
USING (public.get_auth_role() = 'owner')
WITH CHECK (public.get_auth_role() = 'owner');

CREATE POLICY "Staff can insert products to their branch"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (
    public.get_auth_role() = 'staff'
    AND branch_id = public.get_auth_branch()
);

CREATE POLICY "Staff can update products of their branch"
ON public.products FOR UPDATE
TO authenticated
USING (
    public.get_auth_role() = 'staff'
    AND branch_id = public.get_auth_branch()
)
WITH CHECK (
    public.get_auth_role() = 'staff'
    AND branch_id = public.get_auth_branch()
);

CREATE POLICY "Staff can delete products of their branch"
ON public.products FOR DELETE
TO authenticated
USING (
    public.get_auth_role() = 'staff'
    AND branch_id = public.get_auth_branch()
);

-- ---------------------------------------------------------
-- ORDERS POLICIES
-- 1. Anyone (even anon customer during checkout) can insert orders.
-- 2. Staff can ONLY see and update orders for THEIR branch.
-- 3. Owner can view and update orders for ALL branches.
-- ---------------------------------------------------------
CREATE POLICY "Anyone can create order"
ON public.orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Owner can manage all orders"
ON public.orders FOR ALL
TO authenticated
USING (public.get_auth_role() = 'owner')
WITH CHECK (public.get_auth_role() = 'owner');

CREATE POLICY "Staff can view orders of their branch"
ON public.orders FOR SELECT
TO authenticated
USING (
    public.get_auth_role() = 'staff'
    AND branch_id = public.get_auth_branch()
);

CREATE POLICY "Staff can update orders of their branch"
ON public.orders FOR UPDATE
TO authenticated
USING (
    public.get_auth_role() = 'staff'
    AND branch_id = public.get_auth_branch()
)
WITH CHECK (
    public.get_auth_role() = 'staff'
    AND branch_id = public.get_auth_branch()
);

-- =========================================================
-- SEED INITIAL DATA
-- =========================================================
INSERT INTO public.branches (id, name, slug, telegram_username, phone, address, working_hours, landmark)
VALUES
('filial-1', '1-filial (Chilonzor)', 'filial-1', 'zumrad_filial1', '+998 90 123 45 67', 'Toshkent sh., Chilonzor tumani, Bunyodkor shoh ko''chasi, 12-uy', '09:00 - 21:00', 'Chilonzor metro bekati yaqinida')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.branches (id, name, slug, telegram_username, phone, address, working_hours, landmark)
VALUES
('filial-2', '2-filial (Yunusobod)', 'filial-2', 'zumrad_filial2', '+998 90 987 65 43', 'Toshkent sh., Yunusobod tumani, Amir Temur shoh ko''chasi, 88-uy', '09:00 - 21:00', 'Shahriston metro bekati yonida')
ON CONFLICT (id) DO NOTHING;

-- Storage Bucket Setup for Lovable Cloud / Supabase
-- Storage bucket "product-images"
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product images" 
ON storage.objects FOR SELECT 
TO anon, authenticated 
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product-images');
