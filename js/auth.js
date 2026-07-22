// ============================================
// MADRASAHOPS - AUTHENTICATION MODULE
// Supabase Auth + Custom Profiles
// ============================================

const Auth = {
  currentUser: null,

  isSupabaseReady() {
    try {
      return typeof SUPABASE_URL !== 'undefined' && supabase && SUPABASE_URL && !SUPABASE_URL.includes('YOUR_');
    } catch(e) { return false; }
  },

  async login(email, password) {
    if (!this.isSupabaseReady()) {
      return { success: false, error: 'Supabase belum dikonfigurasi' };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes('Invalid login')) return { success: false, error: 'Email atau password salah' };
        return { success: false, error: error.message };
      }
      if (!data.user) return { success: false, error: 'Gagal login' };

      // Fetch profile dari profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) return { success: false, error: 'Profil tidak ditemukan. Hubungi admin.' };
      if (!profile.is_active) return { success: false, error: 'Akun tidak aktif. Hubungi admin.' };

      // Update last_login
      await supabase.from('profiles').update({ updated_at: new Date().toISOString() }).eq('id', profile.id);

      this.currentUser = profile;
      localStorage.setItem('mops_current_user', JSON.stringify(this.currentUser));
      try { await DB.logAudit(this.currentUser.id, 'LOGIN', 'users', this.currentUser.id, null, { email }); } catch(e) {}
      return { success: true, user: this.currentUser };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async register(email, password, namaLengkap, role = 'guru', madrasahId = null) {
    if (!this.isSupabaseReady()) {
      return { success: false, error: 'Supabase belum dikonfigurasi' };
    }
    try {
      // Check apakah email sudah ada di profiles
      const { data: existing } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle();
      if (existing) return { success: false, error: 'Email sudah terdaftar' };

      // Signup via Supabase Auth — trigger akan auto-create profile
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nama_lengkap: namaLengkap,
            role: role,
            madrasah_id: madrasahId || null
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) return { success: false, error: 'Email sudah terdaftar' };
        return { success: false, error: error.message };
      }

      // Jika Supabase Email Confirmation aktif, user perlu verifikasi email
      if (data.user && !data.session) {
        return { success: true, message: 'Pendaftaran berhasil! Silakan cek email untuk verifikasi, lalu login.' };
      }

      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem('mops_current_user');
    if (this.isSupabaseReady()) {
      supabase.auth.signOut();
    }
    window.location.href = 'index.html';
  },

  checkSession() {
    const stored = localStorage.getItem('mops_current_user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return true;
    }
    return false;
  },

  async restoreSession() {
    if (!this.isSupabaseReady()) return false;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const { data: profile } = await supabase
          .from('profiles').select('*').eq('id', session.user.id).single();
        if (profile) {
          this.currentUser = profile;
          localStorage.setItem('mops_current_user', JSON.stringify(this.currentUser));
          return true;
        }
      }
    } catch(e) {}
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
