// ============================================
// MADRASAHOPS - AUTHENTICATION MODULE
// Supports: Offline (localStorage) + Online (Supabase)
// ============================================

const Auth = {
  currentUser: null,

  isOnline() {
    try {
      return typeof SUPABASE_URL !== 'undefined' && supabase && SUPABASE_URL && !SUPABASE_URL.includes('YOUR_');
    } catch(e) { return false; }
  },

  async login(email, password) {
    // === OFFLINE MODE ===
    if (!this.isOnline()) {
      return this._loginOffline(email, password);
    }

    // === ONLINE MODE (dengan fallback offline) ===
    try {
      const onlineResult = await this._loginOnline(email, password);
      if (onlineResult.success) return onlineResult;

      console.warn('[Auth] Online login gagal, coba offline fallback...');
      const offlineResult = this._loginOffline(email, password);
      if (offlineResult.success) {
        offlineResult.offline = true;
        console.warn('[Auth] Berhasil login via offline mode (data lokal)');
      }
      return offlineResult;
    } catch(e) {
      console.warn('[Auth] Online login error, coba offline fallback:', e.message);
      const offlineResult = this._loginOffline(email, password);
      if (offlineResult.success) {
        offlineResult.offline = true;
      }
      return offlineResult;
    }
  },

  // -----------------------------------------
  // OFFLINE LOGIN (localStorage)
  // -----------------------------------------
  _loginOffline(email, password) {
    try {
      let users = JSON.parse(localStorage.getItem('mops_users') || '[]');

      if (users.length === 0) {
        console.warn('[Auth] No offline users found, auto-seeding default accounts...');
        users = [
          { id: 'user_admin1', email: 'admin@si-mantap.go.id', password: 'Admin123!', nama_lengkap: 'Administrator', role: 'super_admin', is_active: true, created_at: new Date().toISOString() },
          { id: 'user_admin2', email: 'admin@kemenag.go.id', password: 'admin123', nama_lengkap: 'Admin Kemenag', role: 'super_admin', is_active: true, created_at: new Date().toISOString() },
          { id: 'user_pendosainsyaf', email: 'pendosainsyaf2@gmail.com', password: 'pendosainsyaf2', nama_lengkap: 'Pendosainsyaf', role: 'guru', is_active: true, created_at: new Date().toISOString() },
          { id: 'user_guru1', email: 'guru@mi.sch.id', password: 'guru123', nama_lengkap: 'Guru Demo', role: 'guru', is_active: true, created_at: new Date().toISOString() },
          { id: 'user_ortu1', email: 'ortu@mi.sch.id', password: 'ortu123', nama_lengkap: 'Orang Tua Demo', role: 'ortu', is_active: true, created_at: new Date().toISOString() },
        ];
        localStorage.setItem('mops_users', JSON.stringify(users));
      }

      const user = users.find(u =>
        u.email === email &&
        u.password === password &&
        u.is_active === true
      );

      if (!user) {
        const emailExists = users.find(u => u.email === email);
        if (!emailExists) {
          return { success: false, error: 'Email "' + email + '" tidak terdaftar. Silakan daftar terlebih dahulu.' };
        }
        if (!emailExists.is_active) {
          return { success: false, error: 'Akun belum aktif. Hubungi admin untuk aktivasi.' };
        }
        return { success: false, error: 'Password salah' };
      }

      this.currentUser = { ...user };
      delete this.currentUser.password;
      localStorage.setItem('mops_current_user', JSON.stringify(this.currentUser));
      return { success: true, user: this.currentUser };
    } catch(e) {
      console.error('[Auth] Offline login error:', e);
      return { success: false, error: 'Gagal login offline: ' + e.message };
    }
  },

  // -----------------------------------------
  // ONLINE LOGIN (Supabase)
  // -----------------------------------------
  async _loginOnline(email, password) {
    try {
      const preCheck = await this._preCheck();
      if (preCheck.error) {
        console.warn('[Auth] Pre-check failed, trying offline fallback:', preCheck.error);
        return this._loginOffline(email, password);
      }

      // Method 1: Try Supabase Auth
      if (supabase && supabase.auth) {
        try {
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (!authError && authData && authData.user) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', authData.user.id)
              .maybeSingle();

            if (!profileError && profile && profile.is_active !== false) {
              await this._onLoginSuccess(profile, email);
              return { success: true, user: this.currentUser };
            }
          }
        } catch (authErr) {
          // Supabase Auth not configured, fall through
        }
      }

      // Method 2: Simple profiles table login
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
        const { data: emailCheck } = await supabase
          .from('profiles')
          .select('id, is_active')
          .eq('email', email)
          .maybeSingle();

        if (!emailCheck) {
          console.warn('[Auth] Email not found in Supabase, trying offline fallback');
          return this._loginOffline(email, password);
        } else if (!emailCheck.is_active) {
          return { success: false, error: 'Akun belum aktif. Hubungi admin untuk aktivasi.' };
        } else {
          return { success: false, error: 'Password salah' };
        }
      }

      await this._onLoginSuccess(data, email);
      return { success: true, user: this.currentUser };
    } catch (err) {
      console.error('[Auth] Login exception:', err);
      return { success: false, error: 'Terjadi kesalahan: ' + (err.message || err.toString()) };
    }
  },

  async _preCheck() {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      if (error) {
        return { error: 'Tabel profiles belum ada atau RLS aktif. Buka Supabase SQL Editor → jalankan sql/FIX_NOW.sql' };
      }
      if (count === 0) {
        return { error: 'Tabel profiles kosong (0 user). Buka Supabase SQL Editor → jalankan sql/FIX_NOW.sql lalu refresh halaman ini.' };
      }
      return { ok: true };
    } catch (e) {
      return { error: 'Gagal mengakses database: ' + e.message };
    }
  },

  async _onLoginSuccess(profile, email) {
    try {
      await supabase.from('profiles').update({ last_login: new Date().toISOString() }).eq('id', profile.id);
    } catch(e) {}
    this.currentUser = profile;
    localStorage.setItem('mops_current_user', JSON.stringify(this.currentUser));
    try { await DB.logAudit(this.currentUser.id, 'LOGIN', 'profiles', this.currentUser.id, null, { email }); } catch(e) {}
  },

  // -----------------------------------------
  // REGISTER
  // -----------------------------------------
  async register(email, password, namaLengkap, role = 'guru', madrasahId = null) {
    if (!this.isOnline()) {
      try {
        const users = JSON.parse(localStorage.getItem('mops_users') || '[]');
        if (users.find(u => u.email === email)) {
          return { success: false, error: 'Email sudah terdaftar' };
        }
        const newUser = {
          id: 'user_' + Date.now(),
          email,
          password,
          nama_lengkap: namaLengkap,
          role,
          madrasah_id: madrasahId || null,
          is_active: false,
          created_at: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('mops_users', JSON.stringify(users));
        return { success: true, message: 'Pendaftaran berhasil! Akun akan aktif setelah diverifikasi admin.' };
      } catch(e) {
        return { success: false, error: 'Gagal mendaftar: ' + e.message };
      }
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

      return { success: true, message: 'Pendaftaran berhasil! Akun akan aktif setelah diverifikasi admin. Silakan login.' };
    } catch (err) {
      console.error('[Auth] Register exception:', err);
      return { success: false, error: 'Terjadi kesalahan: ' + (err.message || err.toString()) };
    }
  },

  // -----------------------------------------
  // LOGOUT
  // -----------------------------------------
  logout() {
    this.currentUser = null;
    localStorage.removeItem('mops_current_user');
    if (this.isOnline() && supabase && supabase.auth) {
      supabase.auth.signOut().catch(() => {});
    }
    window.location.href = 'index.html';
  },

  // -----------------------------------------
  // SESSION
  // -----------------------------------------
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

  async restoreSession() {
    if (this.checkSession()) return true;
    if (!this.isOnline() || !supabase || !supabase.auth) return false;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        if (profile) {
          this.currentUser = profile;
          localStorage.setItem('mops_current_user', JSON.stringify(this.currentUser));
          return true;
        }
      }
    } catch(e) {}
    return false;
  },

  // -----------------------------------------
  // PERMISSIONS
  // -----------------------------------------
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
