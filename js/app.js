// ============================================
// SI-MANTAP - REALTIME ENGINE
// ============================================
const Realtime = {
  _channel: null,
  _handlers: {},

  init() {
    try {
      this._channel = new BroadcastChannel('si_mantap_sync');
      this._channel.onmessage = (e) => this._onMessage(e.data);
    } catch(err) {}
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('mops_')) {
        const table = e.key.replace('mops_', '');
        this._notify(table, e.newValue);
      }
    });
  },

  broadcast(type, data) {
    const msg = { type, data, ts: Date.now() };
    try { if (this._channel) this._channel.postMessage(msg); } catch(err) {}
    this._notify(type, data);
  },

  on(type, fn) {
    if (!this._handlers[type]) this._handlers[type] = [];
    this._handlers[type].push(fn);
  },

  _onMessage(msg) {
    this._notify(msg.type, msg.data);
  },

  _notify(type, data) {
    const handlers = this._handlers[type] || [];
    handlers.forEach(fn => fn(data));
    const allHandlers = this._handlers['*'] || [];
    allHandlers.forEach(fn => fn(type, data));
  }
};

// ============================================
// SI-MANTAP - MAIN APPLICATION
// ============================================

const App = {
  currentPage: 'dashboard',
  sidebarCollapsed: false,
  darkMode: false,

  init() {
    if (!Auth.checkSession()) { window.location.href = 'index.html'; return; }
    Realtime.init();
    this.setupRealtimeListeners();
    this.updateUserInfo();
    this.filterSidebar();
    this.setupDarkMode();
    this.initRunningText();
    this.navigateTo('dashboard');
    this.setupResponsive();
  },

  setupRealtimeListeners() {
    Realtime.on('settings_changed', () => {
      this.applySettings();
      if (this.currentPage === 'pengaturan') this.navigateTo('pengaturan');
      showToast('info', 'Pengaturan diperbarui oleh admin');
    });
    Realtime.on('feedback_changed', () => {
      if (this.currentPage === 'kritik_saran') {
        this.navigateTo('kritik_saran');
      }
    });
    Realtime.on('data_changed', (table) => {
      const pageMap = {
        guru: 'guru', murid: 'murid', kelas: 'kelas',
        absensi: 'absensi', penilaian: 'penilaian',
        kalender: 'kalender', jadwal: 'jadwal',
        absensi_guru: 'absensi_guru',
        bel_jadwal: 'bell_admin',
      };
      if (pageMap[table] && this.currentPage === pageMap[table]) {
        this.navigateTo(this.currentPage);
      }
    });
  },

  filterSidebar() {
    const allowed = Auth.getAllowedPages();
    if (allowed.includes('*')) return;
    document.querySelectorAll('.sidebar-nav-item').forEach(el => {
      const page = el.getAttribute('data-page');
      if (page && !allowed.includes(page)) {
        el.style.display = 'none';
      }
    });
    document.querySelectorAll('.sidebar-section').forEach(section => {
      const next = section.nextElementSibling;
      if (!next) return;
      let hasVisible = false;
      let sib = section;
      while (sib && !sib.classList.contains('sidebar-section')) {
        if (sib.classList.contains('sidebar-nav-item') && sib.style.display !== 'none') {
          hasVisible = true;
        }
        sib = sib.nextElementSibling;
      }
      if (!hasVisible) section.style.display = 'none';
    });
  },

  updateUserInfo() {
    const user = Auth.currentUser;
    if (!user) return;
    document.getElementById('sidebarUserName').textContent = user.nama_lengkap;
    document.getElementById('sidebarUserRole').textContent = ROLES[user.role]?.label || user.role;
    document.getElementById('sidebarAvatar').textContent = Utils.getInitials(user.nama_lengkap);
    document.getElementById('topbarAvatar').querySelector('span').textContent = Utils.getInitials(user.nama_lengkap);
    this.applySettings();
  },

  applySettings() {
    const settings = JSON.parse(localStorage.getItem('mops_settings') || '{}');
    const logoText = settings.logoText || 'MO';
    const logoColor = settings.logoColor || '#059669';
    if (settings.appName) document.title = settings.appName + ' - ' + (settings.appTagline || '');
    const logoEl = document.querySelector('.sidebar-logo .logo-icon');
    if (logoEl) {
      if (settings.appLogo) {
        logoEl.innerHTML = `<img src="${settings.appLogo}" style="width:100%;height:100%;object-fit:contain">`;
        logoEl.style.background = 'transparent';
      } else {
        logoEl.textContent = logoText;
        logoEl.style.background = logoColor;
      }
    }
    if (settings.appName) {
      const nameEl = document.querySelector('.sidebar-app-name');
      if (nameEl) nameEl.textContent = settings.appName;
    }
    if (settings.appTagline) {
      const tagEl = document.querySelector('.sidebar-tagline');
      if (tagEl) tagEl.textContent = settings.appTagline;
    }
  },

  initRunningText() {
    const el = document.getElementById('runningTextInner');
    if (!el) return;
    const text = '🕌 Selamat Datang di SI-MANTAP (Sistem Informasi Madrasah yang Amanah & Terpusat) — Sistem Digital Resmi MIS Bustanul Ulum Curahkalong. Mari bersama membangun tata kelola madrasah yang amanah, profesional, transparan, akuntabel, efektif, dan berbasis teknologi demi meningkatkan mutu pelayanan pendidikan Islam. ✨ Madrasah Hebat, Madrasah Bermartabat. 🤲 Semoga setiap data yang dikelola, setiap pelayanan yang diberikan, dan setiap ikhtiar yang dilakukan menjadi amal jariyah serta membawa keberkahan bagi seluruh keluarga besar MIS Bustanul Ulum Curahkalong. Aamiin Ya Rabbal \'Alamin. 🌿';
    el.textContent = text;
  },

  setupDarkMode() {
    if (localStorage.getItem('mops_dark_mode') === 'true') {
      this.darkMode = true;
      document.body.classList.add('dark');
      document.getElementById('darkModeToggle')?.classList.add('active');
    }
  },

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
    document.getElementById('darkModeToggle')?.classList.toggle('active', this.darkMode);
    localStorage.setItem('mops_dark_mode', this.darkMode);
  },

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('mainContent');
    const overlay = document.getElementById('mobileSidebarOverlay');
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('mobile-open');
      overlay?.classList.toggle('active');
    } else {
      sidebar.classList.toggle('collapsed');
      main.classList.toggle('expanded');
    }
  },

  setupResponsive() {
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        document.getElementById('sidebar')?.classList.remove('mobile-open');
        document.getElementById('mobileSidebarOverlay')?.classList.remove('active');
      }
    });
  },

  navigateTo(page) {
    if (!Auth.hasPageAccess(page)) {
      page = 'dashboard';
    }
    this.currentPage = page;
    document.querySelectorAll('.sidebar-nav-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`.sidebar-nav-item[data-page="${page}"]`)?.classList.add('active');
    document.getElementById('sidebar')?.classList.remove('mobile-open');
    document.getElementById('mobileSidebarOverlay')?.classList.remove('active');

    const titles = {
      dashboard: ['Dashboard', 'Ringkasan data madrasah secara real-time'],
      guru: ['Data Guru & PTK', 'Manajemen data pendidik dan tenaga kependidikan'],
      murid: ['Data Siswa', 'Manajemen data peserta didik'],
      kelas: ['Data Kelas', 'Manajemen kelas dan rombongan belajar'],
      mapel: ['Mata Pelajaran', 'Manajemen mata pelajaran'],
      jadwal: ['Jadwal Pelajaran', 'Penyusunan dan manajemen jadwal'],
      absensi: ['Absensi Siswa', 'Pencatatan kehadiran siswa harian'],
      absensi_guru: ['Absensi Guru', 'Pencatatan kehadiran guru dan staff'],
      kalender: ['Kalender Pendidikan', 'Jadwal kegiatan dan libur madrasah'],
      penilaian: ['Penilaian & Rapor', 'Input dan manajemen nilai siswa'],
      kurikulum: ['Kurikulum KMA 183', 'Manajemen perangkat pembelajaran'],
      kepegawaian: ['Kepegawaian', 'Verifikasi PTK dan tunjangan'],
      keuangan: ['Keuangan BOS', 'Pencatatan transaksi keuangan'],
      rapbm: ['RAPBM', 'Rencana Anggaran Pendapatan dan Belanja'],
      sarana: ['Sarana & Prasarana', 'Inventarisasi aset'],
      ppdb: ['PPDB Online', 'Pendaftaran peserta didik baru'],
      laporan: ['Laporan & Export', 'Generating laporan Kemenag'],
      pengaturan: ['Pengaturan', 'Konfigurasi sistem'],
      sync: ['Sinkronisasi', 'Integrasi EMIS/Dapodik/SIMPATIKA'],
      kritik_saran: ['Kritik & Saran', 'Sampaikan masukan, kritik, atau saran'],
      import_emis: ['Import EMIS 4.0', 'Import data dari sistem EMIS Kemenag'],
      bell_admin: ['Bel Otomatis', 'Manajemen jadwal dan pengaturan bel otomatis'],
      pengumuman: ['Pengumuman & Running Text', 'Kelola pengumuman sekolah dan teks berjalan untuk layar signage'],
      absensi_guru: ['Absensi Guru', 'Absensi dengan selfie dan lokasi GPS'],
      manajemen_user: ['Manajemen User', 'Kelola akun guru, orang tua, dan password'],
    };

    const [title, subtitle] = titles[page] || [page, ''];
    document.getElementById('pageTitle').textContent = title;
    document.getElementById('pageSubtitle').textContent = subtitle;
    document.getElementById('pageContent').innerHTML = '<div class="page-content" id="activePage"></div>';

    const renderers = {
      dashboard: () => Pages.renderDashboard(),
      guru: () => Pages.renderGuru(),
      murid: () => Pages.renderMurid(),
      kelas: () => Pages.renderKelas(),
      mapel: () => Pages.renderMapel(),
      jadwal: () => Pages.renderJadwal(),
      absensi: () => Pages.renderAbsensi(),
      absensi_guru: () => Pages.renderAbsensiGuru(),
      kalender: () => Pages.renderKalender(),
      penilaian: () => Pages.renderPenilaian(),
      kurikulum: () => Pages.renderKurikulum(),
      kepegawaian: () => Pages.renderKepegawaian(),
      keuangan: () => Pages.renderKeuangan(),
      rapbm: () => Pages.renderRAPBM(),
      sarana: () => Pages.renderSarana(),
      ppdb: () => Pages.renderPPDB(),
      laporan: () => Pages.renderLaporan(),
      pengaturan: () => Pages.renderPengaturan(),
      sync: () => Pages.renderSync(),
      kritik_saran: () => Pages.renderKritikSaran(),
      bell_admin: () => Pages.renderBellAdmin(),
      pengumuman: () => Pages.renderPengumuman(),
      manajemen_user: () => Pages.renderManajemenUser(),
      import_emis: () => EmisImport.render(),
    };

    const renderer = renderers[page];
    if (renderer) renderer();
    if (page !== 'dashboard' && Pages._dshInterval) { clearInterval(Pages._dshInterval); Pages._dshInterval = null; }
  },
};
