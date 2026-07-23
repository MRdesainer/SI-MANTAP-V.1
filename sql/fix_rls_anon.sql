-- ============================================
-- FIX: Disable RLS + Grant anon full access
-- Jalankan di Supabase SQL Editor
-- Aman dijalankan berulang kali (idempotent)
-- ============================================

-- 1. DISABLE RLS pada semua tabel
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;
END $$;

-- 2. GRANT full access ke anon + authenticated + service_role
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('GRANT ALL ON public.%I TO anon', r.tablename);
    EXECUTE format('GRANT ALL ON public.%I TO authenticated', r.tablename);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', r.tablename);
  END LOOP;
END $$;

-- 3. GRANT usage pada sequences (untuk auto-increment)
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT sequence_schema, sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public' LOOP
    EXECUTE format('GRANT USAGE ON public.%I TO anon', r.sequence_name);
    EXECUTE format('GRANT USAGE ON public.%I TO authenticated', r.sequence_name);
    EXECUTE format('GRANT USAGE ON public.%I TO service_role', r.sequence_name);
  END LOOP;
END $$;

-- 4. Pastikan tabel profiles ada dan bisa diakses
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    EXECUTE 'GRANT ALL ON public.profiles TO anon';
    EXECUTE 'ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY';
  END IF;
END $$;
