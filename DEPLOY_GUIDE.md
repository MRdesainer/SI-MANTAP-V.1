# Panduan Deploy SI-MANTAP ke Supabase + GitHub Pages

## Yang Diperlukan
- Akun Supabase (gratis) → https://supabase.com
- Akun GitHub → https://github.com

---

## LANGKAH 1: Buat Project Supabase

1. Buka https://supabase.com → Login
2. Klik **"New Project"**
3. Isi:
   - **Name**: `si-mantap` (atau bebas)
   - **Database Password**: catat password ini!
   - **Region**: Singapore
4. Klik **"Create new project"**

---

## LANGKAH 2: Jalankan SQL Schema

1. Di Supabase Dashboard → klik **"SQL Editor"** (sidebar kiri)
2. Klik **"New query"**
3. **Pertama**: Buka file `sql/schema.sql` → copy paste → klik **Run**
4. **Kedua**: Buka file `sql/auth_security.sql` → copy paste → klik **Run**

> `schema.sql` = membuat semua tabel, trigger, seed data
> `auth_security.sql` = membuat profiles (standalone + password), RLS policies, admin seed
>
> **PENTING**: Jalankan `schema.sql` dulu, baru `auth_security.sql`. Jangan jalankan `fix_simple_auth.sql` kecuali ada masalah dengan `auth_security.sql`.

---

## LANGKAH 3: Ambil API Credentials

1. Di Supabase → **Project Settings** (gear icon) → **API**
2. Catat:
   - **Project URL** → `https://xxxxxxxx.supabase.co`
   - **anon public** key → string panjang

---

## LANGKAH 4: Update config.js

Buka `js/config.js` → ganti:

```javascript
const SUPABASE_URL = 'https://xxxxxxxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGci...paste_disini...';
```

---

## LANGKAH 5: Push ke GitHub

```bash
cd "E:\AI Studio\madrasah-ops"
git init
git add .
git commit -m "Deploy SI-MANTAP v2.0 - Secure Online"
git branch -M main
git remote add origin https://github.com/USERNAME/si-mantap.git
git push -u origin main
```

## LANGKAH 6: Aktifkan GitHub Pages

1. Buka repo → **Settings** → **Pages**
2. Source: **Deploy from a branch** → branch `main` → `/ (root)` → **Save**
3. Buka: `https://USERNAME.github.io/si-mantap/`

---

## Login

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@si-mantap.go.id` | `Admin123!` |

> Admin pertama otomatis dibuat oleh SQL seed.
> Guru & Orang Tua **daftar sendiri** melalui tombol "Daftar".

---

## Keamanan

- **Dual Auth**: Mendukung Supabase Auth (bcrypt) DAN simple auth (plain password)
- **RLS Policies**: Admin = full access, Guru = baca + tulis terbatas, Ortu = baca data anak saja
- **Auto-profile**: Trigger otomatis buat profil saat user signup
- **Email Confirmation**: Aktifkan di Supabase Auth Settings untuk keamanan tambahan

### Aktifkan Email Confirmation (Recommended)
1. Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. Aktifkan **"Confirm email"**
3. User harus klik link verifikasi sebelum bisa login

---

## Troubleshooting

### "Email atau password salah"
- Pastikan `schema.sql` sudah dijalankan dulu, baru `auth_security.sql`
- Cek apakah tabel `profiles` sudah ada di Supabase (Table Editor)
- Password admin: `Admin123!`
- Email: `admin@si-mantap.go.id`

### Login tidak bisa sama sekali
- Jalankan `fix_simple_auth.sql` sebagai alternatif (DISABLE RLS di semua tabel)
- Cek browser console (F12) untuk error detail
- Pastikan `SUPABASE_URL` dan `SUPABASE_ANON_KEY` benar di `js/config.js`

### Data tidak muncul
- Buka browser console (F12) → cek error
- Pastikan `SUPABASE_URL` dan `SUPABASE_ANON_KEY` benar

### RLS Blocking (error 403)
- Jalankan `fix_simple_auth.sql` untuk disable RLS, atau
- Pastikan helper functions (`is_admin()`, `get_user_role()`) sudah dibuat
- Jalankan ulang `auth_security.sql`

### Reset admin password
```sql
-- Ganti password admin di Supabase SQL Editor
UPDATE profiles
SET password = 'PasswordBaru123!'
WHERE email = 'admin@si-mantap.go.id';
```
