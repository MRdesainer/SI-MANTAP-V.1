// ============================================
// MADRASAHOPS - AUTHENTICATION MODULE
// Simple login via profiles table (no Supabase Auth)
// ============================================

const Auth = {
  currentUser: null,

  isOnline() {
    try {
      return typeof SUPABASE_URL !== 'undefined' && supabase && SUPABASE_URL && !SUPABASE_URL.includes('YOUR_');
    } catch(e) { return false; }
  },

  async login(email, password) {
    if (!this.isOnline()) {
      return { success: false, error: 'Supabase belum dikonfigurasi' };
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('[Auth] Query error:', JSON.stringify(error));
        if (error.message && error.message.includes('relation "profiles" does not exist')) {
          return { success: false, error: 'Tabel profiles belum ada! Jalankan FIX_NOW.sql di Supabase SQL Editor.' };
        }
        if (error.message && error.message.includes('permission denied')) {
          return { success: false, error: 'Permission denied! Jalankan FIX_NOW.sql di Supabase SQL Editor.' };
        }
        return { success: false, error: 'DB error: ' + (error.message || '') + (error.hint ? ' | ' + error.hint : '') };
      }
      if (!data) {
        console.warn('[Auth] Login failed for:', email);
        const { data: checkAll, error: checkErr } = await supabase.from('profiles').select('id, email, is_active, role');
        console.warn('[Auth] All profiles:', JSON.stringify(checkAll), 'checkErr:', JSON.stringify(checkErr));
        const { data: checkEmail, error: emailErr } = await supabase.from('profiles').select('email, role, is_active').eq('email', email).maybeSingle();
        console.warn('[Auth] Email check:', JSON.stringify(checkEmail), 'err:', JSON.stringify(emailErr));
        if (emailErr) {
          return { success: false, error: 'Gagal cek email: ' + emailErr.message };
        }
        if (!checkEmail) {
          const count = checkAll ? checkAll.length : 0;
          return { success: false, error: 'Email "' + email + '" tidak ditemukan. Total profiles di DB: ' + count + '. Jalankan FIX_NOW.sql, lalu jalankan lagi SELECT pgrst.reload();' };
        }
        if (!checkEmail.is_active) {
          return { success: false, error: 'Akun belum aktif. Hubungi admin untuk mengaktifkan.' };
        }
        return { success: false, error: 'Password salah.' };
      }

      await supabase.from('profiles').update({ last_login: new Date().toISOString() }).eq('id', data.id);

      this.currentUser = data;
      localStorage.setItem('mops_current_user', JSON.stringify(this.currentUser));
      try { await DB.logAudit(this.currentUser.id, 'LOGIN', 'profiles', this.currentUser.id, null, { email }); } catch(e) {}
      return { success: true, user: this.currentUser };
    } catch (err) {
      console.error('[Auth] Login exception:', err);
      return { success: false, error: 'Terjadi kesalahan: ' + (err.message || err.toString()) };
    }
  },

  async register(email, password, namaLengkap, role = 'guru', madrasahId = null) {
    if (!this.isOnline()) {
      return { success: false, error: 'Supabase belum dikonfigurasi' };
    }
    try {
      const { data: existing } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle();
      if (existing) return { success: false, error: 'Email sudah terdaftar' };

      const { data, error } = await supabase.from('profiles').insert({
        email,
        password,
        nama_lengkap: namaLengkap,
        role,
        madrasah_id: madrasahId || null,
        is_active: false
      }).select().single();

      if (error) {
        console.error('[Auth] Register error:', error);
        return { success: false, error: 'Gagal mendaftar: ' + (error.message || '') };
      }

      return { success: true, message: 'Pendaftaran berhasil! Akun Anda akan aktif setelah diverifikasi admin. Silakan login.' };
    } catch (err) {
      console.error('[Auth] Register exception:', err);
      return { success: false, error: 'Terjadi kesalahan: ' + (err.message || err.toString()) };
    }
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem('mops_current_user');
    window.location.href = 'register.html';
  },

  checkSession() {
    const stored = localStorage.getItem('mops_current_user');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        return true;
      } catch(e) { return false; }
    }
    return false;
  },

  hasPermission(permission) {
    if (!this.currentUser) return false;
    const role = this.currentUser.role;
    const perms = {
      super_admin: ['*'],
      guru: ['read', 'dashboard', 'absensi_write', 'absensi_read', 'kalender'],
      ortu: ['read', 'dashboard', 'absensi_read', 'nilai_read'],
    };
    const rolePerms = perms[role] || [];
    return rolePerms.includes('*') || rolePerms.includes(permission);
  },

  isSuperAdmin() { return this.currentUser && this.currentUser.role === 'super_admin'; },
  isAdmin() {
    if (!this.currentUser) return false;
    return ['super_admin', 'admin_kanwil', 'admin_kabupaten', 'kepala_madrasah', 'operator'].includes(this.currentUser.role);
  },
  isGuru() { return this.currentUser && this.currentUser.role === 'guru'; },
  isOrtu() { return this.currentUser && this.currentUser.role === 'ortu'; },

  hasPageAccess(page) {
    if (!this.currentUser) return false;
    const allowed = ROLE_ACCESS[this.currentUser.role] || [];
    return allowed.includes('*') || allowed.includes(page);
  },

  getAllowedPages() {
    if (!this.currentUser) return [];
    const allowed = ROLE_ACCESS[this.currentUser.role] || [];
    if (allowed.includes('*')) return ['*'];
    return allowed;
  },
};
