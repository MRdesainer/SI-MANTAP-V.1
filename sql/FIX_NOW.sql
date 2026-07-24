-- ============================================
-- SI-MANTAP: ONE-SHOT SETUP (Copy paste ini saja)
-- ============================================
-- Buka: Supabase Dashboard → SQL Editor → New Query
-- Paste SEMUA isi ini → klik "Run" (atau Ctrl+Enter)
-- ============================================

-- 1. Hapus apapun yang menghalangi
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. Buat tabel profiles
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nama_lengkap TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'guru',
  madrasah_id UUID,
  avatar TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Disable RLS semua tabel
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;
END $$;

-- 4. Grant akses ke anon
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('GRANT ALL ON public.%I TO anon', r.tablename);
    EXECUTE format('GRANT ALL ON public.%I TO authenticated', r.tablename);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', r.tablename);
  END LOOP;
END $$;

-- 5. Grant sequence usage
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public' LOOP
    EXECUTE format('GRANT USAGE ON public.%I TO anon', r.sequence_name);
    EXECUTE format('GRANT USAGE ON public.%I TO authenticated', r.sequence_name);
    EXECUTE format('GRANT USAGE ON public.%I TO service_role', r.sequence_name);
  END LOOP;
END $$;

-- 6. Grant schema
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 7. Insert admin
INSERT INTO profiles (email, password, nama_lengkap, role, is_active)
VALUES ('admin@si-mantap.go.id', 'Admin123!', 'Administrator', 'super_admin', true)
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  is_active = true;

-- 8. Drop semua RLS policy
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- 9. Trigger PostgREST schema reload
NOTIFY pgrst, 'reload schema';

-- 10. VERIFIKASI
SELECT id, email, nama_lengkap, role, is_active FROM profiles WHERE email = 'admin@si-mantap.go.id';
