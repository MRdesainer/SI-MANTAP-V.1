-- ============================================
-- SI-MANTAP: AUTH SECURITY LAYER
-- ** Jalankan TERLEBIH DAHULU (sebelum schema.sql) **
-- ============================================

-- 1. PROFILS TABLE (linked ke auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  nama_lengkap TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'guru' CHECK (role IN (
    'super_admin', 'admin_kanwil', 'admin_kabupaten',
    'kepala_madrasah', 'operator', 'guru', 'ortu'
  )),
  madrasah_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AUTO-CREATE PROFILE saat user signup via Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, nama_lengkap, role, madrasah_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nama_lengkap', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'guru'),
    CASE WHEN NEW.raw_user_meta_data->>'madrasah_id' IS NOT NULL
         THEN (NEW.raw_user_meta_data->>'madrasah_id')::UUID
         ELSE NULL END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 3. HELPER FUNCTIONS untuk RLS
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid()
    AND role IN ('super_admin', 'admin_kanwil', 'admin_kabupaten', 'kepala_madrasah', 'operator')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_madrasah_id()
RETURNS UUID AS $$
  SELECT madrasah_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 4. ENABLE RLS PADA PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: user can read own, admin can read all
CREATE POLICY "profiles_select_own_or_admin" ON profiles
  FOR SELECT USING (
    id = auth.uid() OR is_admin()
  );

-- Profiles: only admin can update
CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE USING (is_admin());

-- Profiles: only admin can delete
CREATE POLICY "profiles_delete_admin" ON profiles
  FOR DELETE USING (is_admin());

-- Profiles: insert handled by trigger (no direct insert)
CREATE POLICY "profiles_insert_trigger_only" ON profiles
  FOR INSERT WITH CHECK (false);

-- 5. SEED ADMIN via Supabase Auth
-- Password: Admin123! (ganti setelah login pertama)
-- Catatan: Jalankan di SQL Editor, bukan dari app
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@si-mantap.go.id') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_user_meta_data, raw_app_meta_data,
      created_at, updated_at, confirmation_token, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@si-mantap.go.id',
      crypt('Admin123!', gen_salt('bf')),
      NOW(),
      '{"nama_lengkap": "Administrator", "role": "super_admin"}'::jsonb,
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      NOW(), NOW(), '', ''
    );
  END IF;
END $$;

-- 6. REVOKE public access ke auth.users (keamanan)
REVOKE ALL ON auth.users FROM public;
REVOKE ALL ON profiles FROM public;
