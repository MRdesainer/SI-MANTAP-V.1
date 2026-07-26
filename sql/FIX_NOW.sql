-- ============================================
-- FIX_NOW.sql — Perbaikan Total Login & Auth
-- Jalankan di Supabase SQL Editor
-- ============================================

-- ==========================================
-- 1. BUAT/REBUILD TABEL profiles
-- ==========================================
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nama_lengkap TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'guru' CHECK (role IN (
    'super_admin', 'admin_kanwil', 'admin_kabupaten',
    'kepala_madrasah', 'operator', 'guru', 'ortu'
  )),
  madrasah_id UUID,
  avatar TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. DISABLE RLS di SEMUA tabel + drop semua policies
-- ==========================================
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;
  FOR r IN SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- ==========================================
-- 3. GRANT akses penuh ke anon + authenticated + service_role
-- ==========================================
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('GRANT ALL ON public.%I TO anon', r.tablename);
    EXECUTE format('GRANT ALL ON public.%I TO authenticated', r.tablename);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', r.tablename);
  END LOOP;
END $$;

-- ==========================================
-- 4. Seed semua user
-- ==========================================
INSERT INTO profiles (email, password, nama_lengkap, role, is_active) VALUES
  ('admin@si-mantap.go.id', 'Admin123!', 'Administrator', 'super_admin', true),
  ('admin@kemenag.go.id', 'admin123', 'Admin Kemenag', 'super_admin', true),
  ('pendosainsyaf2@gmail.com', 'pendosainsyaf2', 'Pendosainsyaf', 'guru', true),
  ('guru@mi.sch.id', 'guru123', 'Guru Demo', 'guru', true),
  ('ortu@mi.sch.id', 'ortu123', 'Orang Tua Demo', 'ortu', true)
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  nama_lengkap = EXCLUDED.nama_lengkap,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- ==========================================
-- 5. Reload PostgREST schema cache
-- ==========================================
DO $$ BEGIN
  NOTIFY pgrst, 'reload schema';
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- ==========================================
-- 6. VERIFIKASI
-- ==========================================
SELECT id, email, nama_lengkap, role, is_active, created_at
FROM profiles ORDER BY created_at DESC;
