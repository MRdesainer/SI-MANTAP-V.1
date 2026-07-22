-- ============================================
-- FIX: Simple auth - Disable RLS + recreate profiles
-- Jalankan 1 ini dulu di SQL Editor
-- ============================================

-- 1. Hapus profiles lama (yang linked ke auth.users)
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. Buat profiles baru (standalone)
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

-- 3. DISABLE RLS di semua tabel
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;
END $$;

-- 4. GRANT permissions
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('GRANT ALL ON public.%I TO anon', r.tablename);
    EXECUTE format('GRANT ALL ON public.%I TO authenticated', r.tablename);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', r.tablename);
  END LOOP;
END $$;

-- 5. Insert admin
INSERT INTO profiles (email, password, nama_lengkap, role, is_active)
VALUES ('admin@si-mantap.go.id', 'Admin123!', 'Administrator', 'super_admin', true);
