-- ============================================
-- FIX_RLS_PROFILES.sql — Fix RLS untuk Register/Login
-- Jalankan di Supabase SQL Editor
-- ============================================

-- 1. Disable RLS di profiles
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Drop semua policies di profiles
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', r.policyname);
  END LOOP;
END $$;

-- 3. Disable RLS di SEMUA tabel (prevents future issues)
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;
END $$;

-- 4. Drop semua policies di SEMUA tabel
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- 5. Grant permissions ke anon
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('GRANT ALL ON public.%I TO anon', r.tablename);
    EXECUTE format('GRANT ALL ON public.%I TO authenticated', r.tablename);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', r.tablename);
  END LOOP;
END $$;

-- 6. Reload schema
DO $$ BEGIN NOTIFY pgrst, 'reload schema'; EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- 7. Verifikasi
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles';
