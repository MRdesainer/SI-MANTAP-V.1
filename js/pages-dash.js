// ============================================
// MADRASAHOPS - DASHBOARD & MASTER DATA PAGES
// ============================================

const Pages = {
  // ========== DASHBOARD ==========
  renderDashboard() {
    const page = document.getElementById('activePage');
    const user = Auth.currentUser;
    const role = user?.role;
    const isAdmin = role === 'super_admin' || role === 'admin_kanwil' || role === 'admin_kabupaten';
    const isOrtu = role === 'ortu';

    const guru = JSON.parse(localStorage.getItem('mops_guru') || '[]');
    const murid = JSON.parse(localStorage.getItem('mops_murid') || '[]');
    const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]');
    const jadwal = JSON.parse(localStorage.getItem('mops_jadwal') || '[]');
    const pengumuman = JSON.parse(localStorage.getItem('mops_pengumuman') || '[]');

    const guruAktif = guru.filter(g => g.status_guru === 'Aktif').length;
    const totalMurid = murid.filter(m => m.status_aktif).length;
    const today = new Date().toISOString().split('T')[0];
    const hariIndo = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const namaHari = hariIndo[new Date().getDay()];
    const jadwalHariIni = jadwal.filter(j => j.hari === namaHari);
    const pengumumanAktif = pengumuman.filter(p => p.aktif !== false).slice(0, 3);

    page.innerHTML = `
      <div class="mb-6 p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl text-white shadow-lg">
        <h2 class="text-2xl font-bold">Assalamu'alaikum, ${user?.nama_lengkap || 'Admin'}</h2>
        <p class="text-white/80 text-sm mt-1">Selamat datang di Dashboard SI-MANTAP</p>
        <div class="flex flex-wrap gap-3 mt-3 text-xs">
          <span class="bg-white/20 px-3 py-1 rounded-full">${namaHari}, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span class="bg-white/20 px-3 py-1 rounded-full">${totalMurid} Siswa Aktif</span>
          <span class="bg-white/20 px-3 py-1 rounded-full">${guruAktif} Guru Aktif</span>
          <span class="bg-white/20 px-3 py-1 rounded-full">${jadwalHariIni.length} Jadwal Hari Ini</span>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <div class="stat-card green">
          <div class="flex items-center gap-3">
            <div class="stat-icon bg-green-100 text-green-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div><div class="stat-value text-green-600 text-xl">${Utils.formatNumber(totalMurid)}</div><div class="stat-label">Siswa Aktif</div></div>
          </div>
        </div>
        <div class="stat-card blue">
          <div class="flex items-center gap-3">
            <div class="stat-icon bg-blue-100 text-blue-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            </div>
            <div><div class="stat-value text-blue-600 text-xl">${guruAktif}</div><div class="stat-label">Guru Aktif</div></div>
          </div>
        </div>
        <div class="stat-card purple">
          <div class="flex items-center gap-3">
            <div class="stat-icon bg-purple-100 text-purple-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <div><div class="stat-value text-purple-600 text-xl">${jadwalHariIni.length}</div><div class="stat-label">Jadwal Hari Ini</div></div>
          </div>
        </div>
        <div class="stat-card yellow">
          <div class="flex items-center gap-3">
            <div class="stat-icon bg-yellow-100 text-yellow-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <div><div class="stat-value text-yellow-600 text-xl">${kelas.length}</div><div class="stat-label">Total Kelas</div></div>
          </div>
        </div>
      </div>

      ${pengumumanAktif.length > 0 ? `
      <div class="card mb-6">
        <div class="card-header bg-gradient-to-r from-amber-50 to-orange-50">
          <h3 class="font-bold text-amber-800 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
            Pengumuman Terbaru
          </h3>
        </div>
        <div class="card-body space-y-2">
          ${pengumumanAktif.map(p => `
            <div class="p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div class="font-medium text-sm text-amber-900">${p.judul || 'Pengumuman'}</div>
              <div class="text-xs text-amber-700 mt-1">${p.isi || p.deskripsi || ''}</div>
            </div>
          `).join('')}
          <button class="w-full text-center text-xs text-amber-600 hover:text-amber-800 font-medium mt-2" onclick="App.navigateTo('pengumuman')">
            Lihat Semua Pengumuman &rarr;
          </button>
        </div>
      </div>
      ` : ''}

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        ${!isOrtu ? `
        <button class="card hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer group" onclick="App.navigateTo('murid')">
          <div class="card-body flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-emerald-200">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div class="text-left">
              <div class="font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">Data Siswa</div>
              <div class="text-xs text-gray-500 mt-0.5">${totalMurid} siswa aktif terdaftar</div>
            </div>
            <svg class="w-5 h-5 text-gray-300 group-hover:text-emerald-500 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </button>
        ` : ''}

        ${isAdmin ? `
        <button class="card hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer group" onclick="App.navigateTo('guru')">
          <div class="card-body flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-200">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            </div>
            <div class="text-left">
              <div class="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Data Guru</div>
              <div class="text-xs text-gray-500 mt-0.5">${guruAktif} guru & staff aktif</div>
            </div>
            <svg class="w-5 h-5 text-gray-300 group-hover:text-blue-500 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </button>
        ` : ''}

        ${!isOrtu ? `
        <button class="card hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer group" onclick="App.navigateTo('jadwal')">
          <div class="card-body flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-purple-200">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <div class="text-left">
              <div class="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Jadwal Pelajaran</div>
              <div class="text-xs text-gray-500 mt-0.5">${jadwalHariIni.length} jadwal hari ${namaHari}</div>
            </div>
            <svg class="w-5 h-5 text-gray-300 group-hover:text-purple-500 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </button>
        ` : ''}

        ${isAdmin ? `
        <button class="card hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer group" onclick="App.navigateTo('ppdb')">
          <div class="card-body flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-violet-200">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
            </div>
            <div class="text-left">
              <div class="font-bold text-gray-800 group-hover:text-violet-600 transition-colors">PPDB Online</div>
              <div class="text-xs text-gray-500 mt-0.5">Pendaftaran siswa baru</div>
            </div>
            <svg class="w-5 h-5 text-gray-300 group-hover:text-violet-500 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </button>
        ` : ''}

        <button class="card hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer group" onclick="window.open('ppdb.html','_blank')">
          <div class="card-body flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-pink-200">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
            </div>
            <div class="text-left">
              <div class="font-bold text-gray-800 group-hover:text-pink-600 transition-colors">PPDB Publik</div>
              <div class="text-xs text-gray-500 mt-0.5">Halaman pendaftaran publik</div>
            </div>
            <svg class="w-5 h-5 text-gray-300 group-hover:text-pink-500 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </div>
        </button>

        ${!isOrtu ? `
        <button class="card hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-pointer group" onclick="App.navigateTo('pengumuman')">
          <div class="card-body flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white shadow-lg group-hover:shadow-red-200">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
            </div>
            <div class="text-left">
              <div class="font-bold text-gray-800 group-hover:text-red-600 transition-colors">Pengumuman</div>
              <div class="text-xs text-gray-500 mt-0.5">Running text & pengumuman</div>
            </div>
            <svg class="w-5 h-5 text-gray-300 group-hover:text-red-500 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </button>
        ` : ''}
      </div>

      <div id="dashboardSignage" class="rounded-2xl overflow-hidden shadow-xl mb-6" style="background:linear-gradient(135deg,#065f46 0%,#047857 30%,#059669 60%,#0a7e5c 100%);color:#f1f5f9;">
        <div class="p-4 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <div class="font-bold text-sm">Layar Info & Bel</div>
              <div class="text-[10px] text-white/50">Tampilan signage real-time</div>
            </div>
          </div>
          <button onclick="window.open('signage.html','_blank')" class="text-[10px] bg-white/15 hover:bg-white/25 px-3 py-1 rounded-full transition font-medium">
            Fullscreen &rarr;
          </button>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-0">
          <div class="p-5 border-r border-white/10">
            <div class="text-center mb-4">
              <div id="dshClockTime" class="text-4xl font-black tracking-wider" style="font-family:'Inter',sans-serif">00:00:00</div>
              <div id="dshClockDate" class="text-xs text-white/70 mt-1">Senin, 1 Januari 2026</div>
              <div id="dshClockHijri" class="text-[10px] text-white/50 mt-0.5"></div>
            </div>
            <div class="bg-white/10 rounded-xl p-3 text-center border border-white/10">
              <div class="text-[10px] text-white/60 uppercase tracking-wide mb-1">Menuju Bel Selanjutnya</div>
              <div id="dshCountdownLabel" class="text-[10px] text-white/70">--</div>
              <div id="dshCountdownTime" class="text-2xl font-bold text-amber-300">00:00</div>
            </div>
            <div class="mt-4">
              <div class="text-[10px] text-white/50 uppercase tracking-wide mb-2 font-semibold">Pelajaran Saat Ini</div>
              <div id="dshCurrentLesson" class="bg-white/10 rounded-xl p-3 border border-white/10">
                <div class="text-xs text-white/50">--</div>
              </div>
            </div>
          </div>
          <div class="p-5 border-r border-white/10 max-h-[360px] overflow-y-auto">
            <div class="text-[10px] text-white/50 uppercase tracking-wide mb-3 font-semibold">Jadwal Bel Hari Ini</div>
            <div id="dshBellTimeline" class="space-y-1"></div>
          </div>
          <div class="p-5 max-h-[360px] overflow-y-auto">
            <div class="text-[10px] text-white/50 uppercase tracking-wide mb-3 font-semibold">Pengumuman</div>
            <div id="dshAnnouncements" class="space-y-2"></div>
            <div class="mt-4">
              <div class="text-[10px] text-white/50 uppercase tracking-wide mb-2 font-semibold">Hadits Hari Ini</div>
              <div id="dshHadith" class="bg-white/10 rounded-xl p-3 border border-white/10"></div>
            </div>
          </div>
        </div>
      </div>`;
    this._initDashboardSignage();
  },

  _initDashboardSignage() {
    const HARI_MAP = {0:'Minggu',1:'Senin',2:'Selasa',3:'Rabu',4:'Kamis',5:'Jumat',6:'Sabtu'};
    const BEL_JENIS = { masuk:{label:'Masuk',color:'#4ade80'}, pergantian:{label:'Pergantian',color:'#60a5fa'}, istirahat:{label:'Istirahat',color:'#fbbf24'}, shalat_dhuha:{label:'Dhuha',color:'#a78bfa'}, shalat_dzuhur:{label:'Dzuhur',color:'#22d3ee'}, pulang:{label:'Pulang',color:'#f87171'}, ekstrakurikuler:{label:'Ekskul',color:'#f472b6'}, khusus:{label:'Khusus',color:'#9ca3af'} };
    const defaultSchedule = Signage.getDefaultSchedule();

    function getTodaySchedule() {
      const dayIdx = new Date().getDay();
      let stored = defaultSchedule;
      try { stored = JSON.parse(localStorage.getItem('mops_bel_jadwal') || 'null') || defaultSchedule; } catch(e) {}
      return stored.filter(b => b.aktif && b.hari.indexOf(dayIdx) !== -1).sort((a,b) => a.waktu.localeCompare(b.waktu));
    }

    function updateClock() {
      const now = new Date();
      const timeEl = document.getElementById('dshClockTime');
      const dateEl = document.getElementById('dshClockDate');
      const hijriEl = document.getElementById('dshClockHijri');
      if (timeEl) timeEl.textContent = now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
      if (dateEl) dateEl.textContent = now.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
      if (hijriEl) { try { hijriEl.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(now); } catch(e){} }
    }

    function updateCountdown() {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2,'0');
      const mm = String(now.getMinutes()).padStart(2,'0');
      const currentTime = hh+':'+mm;
      const schedule = getTodaySchedule();
      let nextBell = null;
      for (let i=0;i<schedule.length;i++) { if(schedule[i].waktu>currentTime){nextBell=schedule[i];break;} }
      const timeEl = document.getElementById('dshCountdownTime');
      const labelEl = document.getElementById('dshCountdownLabel');
      if(!nextBell){if(timeEl)timeEl.textContent='--:--';if(labelEl)labelEl.textContent='Tidak ada jadwal';return;}
      const nowSec=now.getHours()*3600+now.getMinutes()*60+now.getSeconds();
      const parts=nextBell.waktu.split(':');
      const targetSec=parseInt(parts[0])*3600+parseInt(parts[1])*60;
      let diff=targetSec-nowSec; if(diff<0)diff=0;
      const m=Math.floor(diff/60),s=diff%60;
      if(timeEl)timeEl.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
      if(labelEl)labelEl.textContent='Menuju '+nextBell.nama;
    }

    function renderBellTimeline() {
      const el = document.getElementById('dshBellTimeline');
      if(!el)return;
      const schedule = getTodaySchedule();
      const now = new Date();
      const ct = String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
      el.innerHTML = schedule.map(b => {
        const st = b.waktu<ct?'opacity-40':b.waktu===ct?'bg-white/20 border-white/30':'';
        const ji = BEL_JENIS[b.jenis]||BEL_JENIS.masuk;
        return `<div class="flex items-center gap-2 p-2 rounded-lg ${st} border border-transparent transition-all">
          <span class="text-[10px] font-mono font-bold w-12 shrink-0">${b.waktu}</span>
          <span class="w-2 h-2 rounded-full shrink-0" style="background:${ji.color}"></span>
          <span class="text-[11px] truncate flex-1">${b.nama}</span>
          <span class="text-[9px] text-white/40 shrink-0">${ji.label}</span>
        </div>`;
      }).join('');
    }

    function renderCurrentLesson() {
      const el = document.getElementById('dshCurrentLesson');
      if(!el)return;
      const jadwal=JSON.parse(localStorage.getItem('mops_jadwal')||'[]');
      const mapel=JSON.parse(localStorage.getItem('mops_mata_pelajaran')||'[]');
      const guru=JSON.parse(localStorage.getItem('mops_guru')||'[]');
      const now=new Date();
      const hari=HARI_MAP[now.getDay()];
      const slots=typeof TIME_SLOTS!=='undefined'?TIME_SLOTS:[];
      const ct=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
      let slot=null;
      for(let i=0;i<slots.length;i++){if(ct>=slots[i].mulai&&ct<slots[i].selesai){slot=slots[i];break;}}
      if(!slot){el.innerHTML='<div class="text-[11px] text-white/50">Tidak ada pelajaran</div>';return;}
      const today=jadwal.filter(j=>j.hari===hari);
      const lessons=today.filter(j=>j.jam_ke===slot.jam_ke);
      if(lessons.length===0){el.innerHTML='<div class="text-[11px] text-white/50">Istirahat / Kosong</div>';return;}
      const mp=mapel.find(m=>m.id===lessons[0].mata_pelajaran_id);
      const teachers=[];
      lessons.forEach(l=>{const g=guru.find(x=>x.id===l.guru_id);if(g&&teachers.indexOf(g.nama_lengkap)===-1)teachers.push(g.nama_lengkap);});
      el.innerHTML=`<div class="text-[10px] text-amber-300 font-bold mb-1">Pelajaran ke-${slot.jam_ke}</div>
        <div class="text-sm font-bold">${mp?mp.nama_mapel:'-'}</div>
        <div class="text-[11px] text-white/60">Guru: ${teachers.length>0?teachers.join(', '):'-'}</div>`;
    }

    function renderAnnouncements() {
      const el = document.getElementById('dshAnnouncements');
      if(!el)return;
      const pengumuman=JSON.parse(localStorage.getItem('mops_pengumuman')||'[]');
      const now=new Date().toISOString().split('T')[0];
      let active=pengumuman.filter(p=>p.aktif!==false&&(!p.tanggal_akhir||p.tanggal_akhir>=now)).slice(0,4);
      if(!active.length)active=[{judul:'Selamat Datang',isi:'Selamat datang di SI-MANTAP',prioritas:'normal'}];
      el.innerHTML=active.map(p=>{
        const border=p.prioritas==='tinggi'?'border-l-2 border-red-400':p.prioritas==='sedang'?'border-l-2 border-amber-400':'';
        return `<div class="bg-white/10 rounded-lg p-2.5 border border-white/10 ${border}">
          <div class="text-[11px] font-bold">${p.judul||'Info'}</div>
          <div class="text-[10px] text-white/60 mt-0.5 line-clamp-2">${p.isi||p.deskripsi||''}</div>
        </div>`;
      }).join('');
    }

    function renderHadith() {
      const el = document.getElementById('dshHadith');
      if(!el)return;
      const hadiths=[
        {text:'Barangsiapa menempuh jalan untuk mencari ilmu, Allah akan memudahkan baginya jalan menuju surga.',source:'HR. Muslim'},
        {text:'Sesungguhnya Allah mencintai hamba yang berkarya dan terampil serta profesional.',source:'HR. Bayhaqi'},
        {text:'Tuntutlah ilmu dari buaian hingga ke liang lahat.',source:'HR. Ibnu Majah'},
        {text:'Ilmu itu lebih baik daripada harta. Ilmu akan menjaga engkau.',source:'HR. Al-Bayhaqi'},
        {text:'Mintalah kepada Allah ilmu yang bermanfaat.',source:'HR. Ibnu Majah'},
        {text:'Orang yang paling sempurna imannya adalah yang paling baik akhlaknya.',source:'HR. Abu Dawud'},
        {text:'Carilah ilmu walaupun ke Tiongkok.',source:'HR. Ibnu Majah'},
      ];
      const idx=Math.floor(new Date()/86400000)%hadiths.length;
      const h=hadiths[idx];
      el.innerHTML=`<div class="text-[11px] italic text-white/80 leading-relaxed">\u201C${h.text}\u201D</div>
        <div class="text-[10px] text-amber-300/70 mt-1.5 text-right">\u2014 ${h.source}</div>`;
    }

    if(this._dshInterval)clearInterval(this._dshInterval);
    updateClock();updateCountdown();renderBellTimeline();renderCurrentLesson();renderAnnouncements();renderHadith();
    this._dshInterval=setInterval(()=>{updateClock();updateCountdown();renderBellTimeline();renderCurrentLesson();},1000);
  },

  _renderDashboardGuru(page) {
    const user = Auth.currentUser;
    const abs = JSON.parse(localStorage.getItem('mops_absensi') || '[]');
    const jadwal = JSON.parse(localStorage.getItem('mops_jadwal') || '[]');
    const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]');
    const mapel = JSON.parse(localStorage.getItem('mops_mata_pelajaran') || '[]');
    const penilaian = JSON.parse(localStorage.getItem('mops_penilaian') || '[]');
    const today = new Date().toISOString().split('T')[0];

    const jadwalHariIni = jadwal.filter(j => j.guru_id === user?.id);
    const absHari = abs.filter(a => a.tanggal === today);
    const hadirHari = absHari.filter(a => a.status === 'Hadir').length;
    const pctHadir = absHari.length > 0 ? Math.round((hadirHari / absHari.length) * 100) : 0;

    page.innerHTML = `
      <div class="mb-6 p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white">
        <h2 class="text-xl font-bold">Assalamu'alaikum, ${user.nama_lengkap}</h2>
        <p class="text-white/80 text-sm mt-1">Selamat bertugas hari ini</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 stat-grid">
        <div class="stat-card green"><div class="stat-value text-green-600">${jadwalHariIni.length}</div><div class="stat-label">Jadwal Hari Ini</div></div>
        <div class="stat-card blue"><div class="stat-value text-blue-600">${pctHadir}%</div><div class="stat-label">Kehadiran Siswa</div></div>
        <div class="stat-card purple"><div class="stat-value text-purple-600">${penilaian.filter(p => p.tahun_pelajaran === '2025/2026').length}</div><div class="stat-label">Nilai Tercatat</div></div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="card"><div class="card-header"><h3 class="font-bold">Akses Cepat</h3></div><div class="card-body">
          <div class="grid grid-cols-2 gap-3">
            <button class="p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition text-left" onclick="App.navigateTo('absensi')"><div class="text-emerald-600 font-bold">Absensi</div><div class="text-xs text-gray-500 mt-1">Input kehadiran siswa</div></button>
            <button class="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition text-left" onclick="App.navigateTo('penilaian')"><div class="text-blue-600 font-bold">Input Nilai</div><div class="text-xs text-gray-500 mt-1">Penilaian & rapor</div></button>
            <button class="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition text-left" onclick="App.navigateTo('kalender')"><div class="text-purple-600 font-bold">Kalender</div><div class="text-xs text-gray-500 mt-1">Jadwal kegiatan</div></button>
            <button class="p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition text-left" onclick="App.navigateTo('kurikulum')"><div class="text-yellow-600 font-bold">Kurikulum</div><div class="text-xs text-gray-500 mt-1">Perangkat pembelajaran</div></button>
          </div>
        </div></div>
        <div class="card"><div class="card-header"><h3 class="font-bold">Kehadiran Siswa Hari Ini</h3></div><div class="card-body space-y-3">
          <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg"><span class="text-sm text-gray-600">Hadir</span><span class="badge badge-green">${hadirHari}</span></div>
          <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"><span class="text-sm text-gray-600">Izin</span><span class="badge badge-yellow">${absHari.filter(a => a.status === 'Izin').length}</span></div>
          <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg"><span class="text-sm text-gray-600">Sakit</span><span class="badge badge-blue">${absHari.filter(a => a.status === 'Sakit').length}</span></div>
          <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg"><span class="text-sm text-gray-600">Alpha</span><span class="badge badge-red">${absHari.filter(a => a.status === 'Alpha').length}</span></div>
        </div></div>
      </div>`;
  },

  _renderDashboardOrtu(page) {
    const user = Auth.currentUser;
    const murid = JSON.parse(localStorage.getItem('mops_murid') || '[]');
    const abs = JSON.parse(localStorage.getItem('mops_absensi') || '[]');
    const penilaian = JSON.parse(localStorage.getItem('mops_penilaian') || '[]');
    const today = new Date().toISOString().split('T')[0];

    const ortuMurid = JSON.parse(localStorage.getItem('mops_ortu_murid') || '[]');
    const rels = ortuMurid.filter(r => r.ortu_id === user?.id || r.user_id === user?.id);
    const childIds = rels.map(r => r.murid_id);
    const myChildren = murid.filter(m => childIds.includes(m.id)).slice(0, 3);
    const absHari = abs.filter(a => a.tanggal === today);
    const hadirHari = absHari.filter(a => a.status === 'Hadir').length;

    page.innerHTML = `
      <div class="mb-6 p-4 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl text-white">
        <h2 class="text-xl font-bold">Assalamu'alaikum, ${user.nama_lengkap}</h2>
        <p class="text-white/80 text-sm mt-1">Monitoring akademik anak</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 stat-grid">
        <div class="stat-card green"><div class="stat-value text-green-600">${myChildren.length}</div><div class="stat-label">Anak Terdaftar</div></div>
        <div class="stat-card blue"><div class="stat-value text-blue-600">${hadirHari}/${absHari.length}</div><div class="stat-label">Kehadiran Hari Ini</div></div>
        <div class="stat-card purple"><div class="stat-value text-purple-600">${penilaian.length}</div><div class="stat-label">Nilai Tercatat</div></div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="card"><div class="card-header"><h3 class="font-bold">Anak Anda</h3></div><div class="card-body space-y-3">
          ${myChildren.length > 0 ? myChildren.map(m => {
            const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]').find(k => k.id === m.kelas_id);
            return `<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div><div class="font-medium text-sm">${m.nama_lengkap}</div><div class="text-xs text-gray-500">${kelas?.nama_kelas || '-'}</div></div><span class="badge badge-green">Aktif</span></div>`;
          }).join('') : '<p class="text-gray-400 text-sm text-center py-4">Belum ada data anak</p>'}
        </div></div>
        <div class="card"><div class="card-header"><h3 class="font-bold">Menu Cepat</h3></div><div class="card-body">
          <div class="grid grid-cols-2 gap-3">
            <button class="p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition text-left" onclick="App.navigateTo('absensi')"><div class="text-emerald-600 font-bold">Absensi</div><div class="text-xs text-gray-500 mt-1">Lihat kehadiran</div></button>
            <button class="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition text-left" onclick="App.navigateTo('penilaian')"><div class="text-blue-600 font-bold">Nilai</div><div class="text-xs text-gray-500 mt-1">Lihat rapor</div></button>
            <button class="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition text-left" onclick="App.navigateTo('kalender')"><div class="text-purple-600 font-bold">Kalender</div><div class="text-xs text-gray-500 mt-1">Jadwal sekolah</div></button>
          </div>
        </div></div>
      </div>`;
  },

  // ========== GURU ==========
  renderGuru() {
    const page = document.getElementById('activePage');
    const guru = JSON.parse(localStorage.getItem('mops_guru') || '[]');
    page.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-2">
          <div class="search-box"><input type="text" id="searchGuru" placeholder="Cari nama, NIP..." class="form-input w-64" oninput="Pages._filterGuru()"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
          <select id="filterStatusGuru" class="form-select w-36" onchange="Pages._filterGuru()"><option value="">Semua Status</option><option value="Aktif">Aktif</option><option value="Non-Aktif">Non-Aktif</option><option value="Cuti">Cuti</option></select>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-outline" onclick="Pages._importGuru()">Import CSV</button>
          <button class="btn btn-outline" onclick="Utils.downloadCSV(JSON.parse(localStorage.getItem('mops_guru')||'[]'),'data_guru.csv');showToast('success','Export berhasil')">Export</button>
          <button class="btn btn-primary" onclick="Pages._formGuru()">+ Tambah Guru</button>
        </div>
      </div>
      <div class="card"><div class="table-container"><table><thead><tr><th>No</th><th>Nama</th><th>NIP</th><th>NUPTK</th><th>Mapel</th><th>Status</th><th>Kepegawaian</th><th>Aksi</th></tr></thead>
        <tbody id="guruTableBody">${guru.map((g, i) => this._guruRow(g, i + 1)).join('')}</tbody>
      </table></div><div class="card-body border-t"><span class="text-sm text-gray-500">${guru.length} guru terdaftar</span></div></div>`;
  },

  _guruRow(g, no) {
    const sb = g.status_guru === 'Aktif' ? 'badge-green' : g.status_guru === 'Cuti' ? 'badge-yellow' : 'badge-red';
    return `<tr><td class="font-medium">${no}</td><td><div class="flex items-center gap-3"><div class="avatar avatar-sm">${Utils.getInitials(g.nama_lengkap)}</div><div><div class="font-medium text-sm">${g.nama_lengkap}</div><div class="text-xs text-gray-400">${g.jenis_kelamin || '-'}</div></div></div></td><td class="text-sm">${g.nip || '-'}</td><td class="text-sm">${g.nuptk || '-'}</td><td class="text-sm">${g.mata_pelajaran || '-'}</td><td><span class="badge ${sb}">${g.status_guru}</span></td><td><span class="badge badge-blue">${g.status_pegawai || '-'}</span></td><td><div class="flex gap-1"><button class="btn btn-sm btn-outline" onclick="Pages._formGuru('${g.id}')">Edit</button><button class="btn btn-sm btn-outline text-red-500" onclick="Pages._deleteGuru('${g.id}')">Hapus</button></div></td></tr>`;
  },

  _filterGuru() {
    const s = document.getElementById('searchGuru')?.value?.toLowerCase() || '';
    const st = document.getElementById('filterStatusGuru')?.value || '';
    let g = JSON.parse(localStorage.getItem('mops_guru') || '[]');
    if (s) g = g.filter(x => (x.nama_lengkap || '').toLowerCase().includes(s) || (x.nip || '').includes(s));
    if (st) g = g.filter(x => x.status_guru === st);
    document.getElementById('guruTableBody').innerHTML = g.map((x, i) => this._guruRow(x, i + 1)).join('');
  },

  _formGuru(id = null) {
    const g = id ? JSON.parse(localStorage.getItem('mops_guru') || '[]').find(x => x.id === id) : null;
    openModal(g ? 'Edit Guru' : 'Tambah Guru', `<form onsubmit="Pages._saveGuru(event,'${id||''}')"><div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-group"><label class="form-label">Nama Lengkap *</label><input type="text" class="form-input" name="nama_lengkap" value="${g?.nama_lengkap||''}" required></div>
      <div class="form-group"><label class="form-label">NIP</label><input type="text" class="form-input" name="nip" value="${g?.nip||''}"></div>
      <div class="form-group"><label class="form-label">NUPTK</label><input type="text" class="form-input" name="nuptk" value="${g?.nuptk||''}"></div>
      <div class="form-group"><label class="form-label">NIK</label><input type="text" class="form-input" name="nik" value="${g?.nik||''}"></div>
      <div class="form-group"><label class="form-label">Jenis Kelamin</label><select class="form-select" name="jenis_kelamin"><option value="Laki-laki" ${g?.jenis_kelamin==='Laki-laki'?'selected':''}>Laki-laki</option><option value="Perempuan" ${g?.jenis_kelamin==='Perempuan'?'selected':''}>Perempuan</option></select></div>
      <div class="form-group"><label class="form-label">Tempat Lahir</label><input type="text" class="form-input" name="tempat_lahir" value="${g?.tempat_lahir||''}"></div>
      <div class="form-group"><label class="form-label">Tanggal Lahir</label><input type="date" class="form-input" name="tanggal_lahir" value="${g?.tanggal_lahir||''}"></div>
      <div class="form-group"><label class="form-label">Mata Pelajaran</label><input type="text" class="form-input" name="mata_pelajaran" value="${g?.mata_pelajaran||''}"></div>
      <div class="form-group"><label class="form-label">Status</label><select class="form-select" name="status_guru"><option value="Aktif" ${g?.status_guru==='Aktif'?'selected':''}>Aktif</option><option value="Non-Aktif" ${g?.status_guru==='Non-Aktif'?'selected':''}>Non-Aktif</option><option value="Cuti" ${g?.status_guru==='Cuti'?'selected':''}>Cuti</option></select></div>
      <div class="form-group"><label class="form-label">Kepegawaian</label><select class="form-select" name="status_pegawai"><option value="PNS" ${g?.status_pegawai==='PNS'?'selected':''}>PNS</option><option value="PPPK" ${g?.status_pegawai==='PPPK'?'selected':''}>PPPK</option><option value="GTY" ${g?.status_pegawai==='GTY'?'selected':''}>GTY</option><option value="GTT" ${g?.status_pegawai==='GTT'?'selected':''}>GTT</option><option value="Honorer" ${g?.status_pegawai==='Honorer'?'selected':''}>Honorer</option></select></div>
      <div class="form-group"><label class="form-label">Golongan</label><input type="text" class="form-input" name="golongan" value="${g?.golongan||''}"></div>
      <div class="form-group"><label class="form-label">No. HP</label><input type="text" class="form-input" name="no_hp" value="${g?.no_hp||''}"></div>
      <div class="form-group md:col-span-2"><label class="form-label">Alamat</label><textarea class="form-textarea" name="alamat">${g?.alamat||''}</textarea></div>
    </div><div class="flex justify-end gap-2 mt-4 pt-4 border-t"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button type="submit" class="btn btn-primary">Simpan</button></div></form>`);
  },

  async _saveGuru(e, id) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    if (id) { await DB.update('guru', id, data); showToast('success', 'Guru diperbarui'); }
    else { data.madrasah_id = Auth.currentUser?.madrasah_id || 'mad_001'; await DB.insert('guru', data); showToast('success', 'Guru ditambahkan'); }
    Realtime.broadcast('data_changed', 'guru');
    closeModal(); this.renderGuru();
  },

  async _deleteGuru(id) {
    if (!Utils.confirm('Hapus data guru ini?')) return;
    await DB.delete('guru', id); showToast('success', 'Guru dihapus');
    Realtime.broadcast('data_changed', 'guru');
    this.renderGuru();
  },

  _importGuru() {
    Utils.uploadFile('.csv', async (file) => {
      const text = await file.text();
      const data = Utils.parseCSV(text);
      if (!data.length) return showToast('error', 'File kosong');
      const mapped = data.map(r => ({ nama_lengkap: r.nama_lengkap||r.nama||'', nip: r.nip||'', nuptk: r.nuptk||'', mata_pelajaran: r.mata_pelajaran||r.mapel||'', status_guru: 'Aktif', status_pegawai: r.status_pegawai||'', madrasah_id: Auth.currentUser?.madrasah_id||'mad_001' }));
      await DB.insertBatch('guru', mapped);
      showToast('success', `${mapped.length} guru diimport`); this.renderGuru();
    });
  },

  // ========== MURID ==========
  renderMurid() {
    const page = document.getElementById('activePage');
    const murid = JSON.parse(localStorage.getItem('mops_murid') || '[]');
    const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]');
    page.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-2">
          <div class="search-box"><input type="text" id="searchMurid" placeholder="Cari nama, NISN..." class="form-input w-64" oninput="Pages._filterMurid()"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
          <select id="filterKelasMurid" class="form-select w-36" onchange="Pages._filterMurid()"><option value="">Semua Kelas</option>${kelas.map(k => `<option value="${k.id}">${k.nama_kelas}</option>`).join('')}</select>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-outline" onclick="Pages._importMurid()">Import</button>
          <button class="btn btn-outline" onclick="Utils.downloadCSV(JSON.parse(localStorage.getItem('mops_murid')||'[]'),'data_siswa.csv');showToast('success','Export berhasil')">Export</button>
          <button class="btn btn-primary" onclick="Pages._formMurid()">+ Tambah Siswa</button>
        </div>
      </div>
      <div class="card"><div class="table-container"><table><thead><tr><th>No</th><th>Nama</th><th>NISN</th><th>Kelas</th><th>JK</th><th>Tgl Lahir</th><th>Orang Tua</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody id="muridTableBody">${murid.map((m, i) => this._muridRow(m, i + 1)).join('')}</tbody>
      </table></div><div class="card-body border-t"><span class="text-sm text-gray-500">${murid.length} siswa terdaftar</span></div></div>`;
  },

  _muridRow(m, no) {
    const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]').find(k => k.id === m.kelas_id);
    return `<tr><td class="font-medium">${no}</td><td><div class="flex items-center gap-2"><div class="avatar avatar-sm">${Utils.getInitials(m.nama_lengkap)}</div><span class="font-medium text-sm">${m.nama_lengkap}</span></div></td><td class="text-sm">${m.nisn||'-'}</td><td><span class="badge badge-blue">${kelas?.nama_kelas||'-'}</span></td><td class="text-sm">${m.jenis_kelamin||'-'}</td><td class="text-sm">${Utils.formatShortDate(m.tanggal_lahir)}</td><td class="text-sm">${m.nama_ayah||'-'}</td><td><span class="badge ${m.status_aktif?'badge-green':'badge-red'}">${m.status_aktif?'Aktif':'Non-Aktif'}</span></td><td><div class="flex gap-1"><button class="btn btn-sm btn-outline" onclick="Pages._formMurid('${m.id}')">Edit</button><button class="btn btn-sm btn-outline text-red-500" onclick="Pages._deleteMurid('${m.id}')">Hapus</button></div></td></tr>`;
  },

  _filterMurid() {
    const s = document.getElementById('searchMurid')?.value?.toLowerCase() || '';
    const k = document.getElementById('filterKelasMurid')?.value || '';
    let m = JSON.parse(localStorage.getItem('mops_murid') || '[]');
    if (s) m = m.filter(x => (x.nama_lengkap||'').toLowerCase().includes(s) || (x.nisn||'').includes(s));
    if (k) m = m.filter(x => x.kelas_id === k);
    document.getElementById('muridTableBody').innerHTML = m.map((x, i) => this._muridRow(x, i + 1)).join('');
  },

  _formMurid(id = null) {
    const m = id ? JSON.parse(localStorage.getItem('mops_murid') || '[]').find(x => x.id === id) : null;
    const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]');
    openModal(m ? 'Edit Siswa' : 'Tambah Siswa', `<form onsubmit="Pages._saveMurid(event,'${id||''}')"><div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-group"><label class="form-label">Nama Lengkap *</label><input type="text" class="form-input" name="nama_lengkap" value="${m?.nama_lengkap||''}" required></div>
      <div class="form-group"><label class="form-label">NISN</label><input type="text" class="form-input" name="nisn" value="${m?.nisn||''}"></div>
      <div class="form-group"><label class="form-label">Kelas *</label><select class="form-select" name="kelas_id" required><option value="">Pilih</option>${kelas.map(k => `<option value="${k.id}" ${m?.kelas_id===k.id?'selected':''}>${k.nama_kelas}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Jenis Kelamin</label><select class="form-select" name="jenis_kelamin"><option value="Laki-laki" ${m?.jenis_kelamin==='Laki-laki'?'selected':''}>Laki-laki</option><option value="Perempuan" ${m?.jenis_kelamin==='Perempuan'?'selected':''}>Perempuan</option></select></div>
      <div class="form-group"><label class="form-label">Tempat Lahir</label><input type="text" class="form-input" name="tempat_lahir" value="${m?.tempat_lahir||''}"></div>
      <div class="form-group"><label class="form-label">Tanggal Lahir</label><input type="date" class="form-input" name="tanggal_lahir" value="${m?.tanggal_lahir||''}"></div>
      <div class="form-group"><label class="form-label">Nama Ayah</label><input type="text" class="form-input" name="nama_ayah" value="${m?.nama_ayah||''}"></div>
      <div class="form-group"><label class="form-label">Nama Ibu</label><input type="text" class="form-input" name="nama_ibu" value="${m?.nama_ibu||''}"></div>
      <div class="form-group"><label class="form-label">No. HP Orang Tua</label><input type="text" class="form-input" name="no_hp_ortu" value="${m?.no_hp_ortu||''}"></div>
      <div class="form-group"><label class="form-label">Tahun Masuk</label><input type="text" class="form-input" name="tahun_masuk" value="${m?.tahun_masuk||'2025/2026'}"></div>
      <div class="form-group md:col-span-2"><label class="form-label">Alamat</label><textarea class="form-textarea" name="alamat">${m?.alamat||''}</textarea></div>
    </div><div class="flex justify-end gap-2 mt-4 pt-4 border-t"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button type="submit" class="btn btn-primary">Simpan</button></div></form>`);
  },

  async _saveMurid(e, id) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.status_aktif = true;
    if (id) { await DB.update('murid', id, data); showToast('success', 'Siswa diperbarui'); }
    else { data.madrasah_id = Auth.currentUser?.madrasah_id || 'mad_001'; await DB.insert('murid', data); showToast('success', 'Siswa ditambahkan'); }
    Realtime.broadcast('data_changed', 'murid');
    closeModal(); this.renderMurid();
  },

  async _deleteMurid(id) {
    if (!Utils.confirm('Hapus data siswa ini?')) return;
    await DB.delete('murid', id); showToast('success', 'Siswa dihapus');
    Realtime.broadcast('data_changed', 'murid');
    this.renderMurid();
  },

  _importMurid() {
    Utils.uploadFile('.csv', async (file) => {
      const text = await file.text();
      const data = Utils.parseCSV(text);
      if (!data.length) return showToast('error', 'File kosong');
      const mapped = data.map(r => ({ nama_lengkap: r.nama_lengkap||r.nama||'', nisn: r.nisn||'', nis: r.nis||'', kelas_id: r.kelas_id||'', jenis_kelamin: r.jenis_kelamin||r.jk||'', tanggal_lahir: r.tanggal_lahir||'', tahun_masuk: r.tahun_masuk||'2025/2026', nama_ayah: r.nama_ayah||'', nama_ibu: r.nama_ibu||'', status_aktif: true, madrasah_id: Auth.currentUser?.madrasah_id||'mad_001' }));
      await DB.insertBatch('murid', mapped);
      showToast('success', `${mapped.length} siswa diimport`); this.renderMurid();
    });
  },

  // ========== KELAS ==========
  renderKelas() {
    const page = document.getElementById('activePage');
    const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]');
    const murid = JSON.parse(localStorage.getItem('mops_murid') || '[]');
    page.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 class="font-bold text-lg">Daftar Kelas</h3>
        <button class="btn btn-primary" onclick="Pages._formKelas()">+ Tambah Kelas</button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        ${kelas.map(k => {
          const jml = murid.filter(m => m.kelas_id === k.id && m.status_aktif).length;
          const pct = k.kapasitas > 0 ? Math.round((jml / k.kapasitas) * 100) : 0;
          return `<div class="card hover:shadow-lg transition-all">
            <div class="card-body">
              <div class="flex items-center justify-between mb-3">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">${k.nama_kelas}</div>
                <div class="flex gap-1">
                  <button class="btn btn-sm btn-outline" onclick="Pages._formKelas('${k.id}')">Edit</button>
                  <button class="btn btn-sm btn-outline text-red-500 border-red-200 hover:bg-red-50" onclick="Pages._deleteKelas('${k.id}')">Hapus</button>
                </div>
              </div>
              <div class="text-sm text-gray-500 mb-1">Tingkat ${k.tingkat}</div>
              <div class="text-sm text-gray-500 mb-2">Ruang: ${k.ruang||'-'}</div>
              <div class="flex items-center justify-between mb-1"><span class="text-xs text-gray-400">${jml}/${k.kapasitas} siswa</span><span class="text-xs font-medium ${pct>90?'text-red-500':'text-emerald-600'}">${pct}%</span></div>
              <div class="w-full bg-gray-200 rounded-full h-2"><div class="h-2 rounded-full ${pct>90?'bg-red-500':'bg-emerald-500'}" style="width:${Math.min(pct,100)}%"></div></div>
            </div>
          </div>`;
        }).join('')}
      </div>`;
  },

  _formKelas(id = null) {
    const k = id ? JSON.parse(localStorage.getItem('mops_kelas') || '[]').find(x => x.id === id) : null;
    openModal(k ? 'Edit Kelas' : 'Tambah Kelas', `<form onsubmit="Pages._saveKelas(event,'${id||''}')"><div class="grid grid-cols-2 gap-4">
      <div class="form-group"><label class="form-label">Nama Kelas *</label><input type="text" class="form-input" name="nama_kelas" value="${k?.nama_kelas||''}" required></div>
      <div class="form-group"><label class="form-label">Tingkat *</label><input type="number" class="form-input" name="tingkat" value="${k?.tingkat||''}" min="1" max="12" required></div>

      <div class="form-group"><label class="form-label">Ruang</label><input type="text" class="form-input" name="ruang" value="${k?.ruang||''}"></div>
      <div class="form-group"><label class="form-label">Kapasitas</label><input type="number" class="form-input" name="kapasitas" value="${k?.kapasitas||30}"></div>
      <div class="form-group"><label class="form-label">Tahun Pelajaran</label><input type="text" class="form-input" name="tahun_pelajaran" value="${k?.tahun_pelajaran||'2025/2026'}"></div>
    </div><div class="flex justify-end gap-2 mt-4 pt-4 border-t"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button type="submit" class="btn btn-primary">Simpan</button></div></form>`);
  },

  async _saveKelas(e, id) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.tingkat = parseInt(data.tingkat); data.kapasitas = parseInt(data.kapasitas) || 30;
    if (id) { await DB.update('kelas', id, data); showToast('success', 'Kelas diperbarui'); }
    else { data.madrasah_id = Auth.currentUser?.madrasah_id || 'mad_001'; data.jumlah_murid = 0; await DB.insert('kelas', data); showToast('success', 'Kelas ditambahkan'); }
    Realtime.broadcast('data_changed', 'kelas');
    closeModal(); this.renderKelas();
  },

  async _deleteKelas(id) {
    const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]').find(x => x.id === id);
    const murid = JSON.parse(localStorage.getItem('mops_murid') || '[]');
    const jmlMurid = murid.filter(m => m.kelas_id === id && m.status_aktif).length;
    if (jmlMurid > 0) {
      const targetOptions = JSON.parse(localStorage.getItem('mops_kelas') || '[]')
        .filter(k => k.id !== id).map(k => `<option value="${k.id}">${k.nama_kelas}</option>`).join('');
      openModal('Pindahkan Siswa', `<div class="space-y-4">
        <p class="text-sm text-gray-600">Masih ada <strong>${jmlMurid} siswa</strong> di kelas <strong>${kelas?.nama_kelas}</strong>. Pindahkan ke kelas lain sebelum menghapus.</p>
        <select id="targetKelas" class="form-input">${targetOptions}</select>
        <div class="flex justify-end gap-2 pt-3 border-t">
          <button class="btn btn-outline" onclick="closeModal()">Batal</button>
          <button class="btn btn-primary" onclick="Pages._moveAndDeleteKelas('${id}')">Pindahkan & Hapus</button>
        </div>
      </div>`);
      return;
    }
    if (!Utils.confirm(`Hapus kelas ${kelas?.nama_kelas || ''}?`)) return;
    await DB.delete('kelas', id);
    showToast('success', 'Kelas dihapus');
    Realtime.broadcast('data_changed', 'kelas');
    this.renderKelas();
  },

  async _moveAndDeleteKelas(id) {
    const targetId = document.getElementById('targetKelas').value;
    if (!targetId) return showToast('error', 'Pilih kelas target');
    const murid = JSON.parse(localStorage.getItem('mops_murid') || '[]');
    let moved = 0;
    for (const m of murid) {
      if (m.kelas_id === id && m.status_aktif) {
        await DB.update('murid', m.id, { kelas_id: targetId });
        moved++;
      }
    }
    await DB.delete('kelas', id);
    showToast('success', `${moved} siswa dipindahkan, kelas dihapus`);
    closeModal();
    Realtime.broadcast('data_changed', 'kelas');
    this.renderKelas();
  },

  // ========== MAPEL ==========
  renderMapel() {
    const page = document.getElementById('activePage');
    const mapel = JSON.parse(localStorage.getItem('mops_mata_pelajaran') || '[]');
    page.innerHTML = `<div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h3 class="font-bold text-lg">Mata Pelajaran</h3><button class="btn btn-primary" onclick="Pages._formMapel()">+ Tambah Mapel</button></div>
      <div class="card"><div class="table-container"><table><thead><tr><th>No</th><th>Kode</th><th>Nama Mapel</th><th>Kelompok</th><th>Jam/Minggu</th><th>Aksi</th></tr></thead>
        <tbody>${mapel.map((m, i) => `<tr><td>${i+1}</td><td><span class="badge badge-blue">${m.kode_mapel}</span></td><td class="font-medium">${m.nama_mapel}</td><td><span class="badge badge-${m.kelompok==='A'?'green':'blue'}">Kelompok ${m.kelompok}</span></td><td>${m.jam_pelajaran}</td><td><div class="flex gap-1"><button class="btn btn-sm btn-outline" onclick="Pages._formMapel('${m.id}')">Edit</button><button class="btn btn-sm btn-outline text-red-500" onclick="Pages._deleteMapel('${m.id}')">Hapus</button></div></td></tr>`).join('')}</tbody>
      </table></div></div>`;
  },

  _formMapel(id = null) {
    const m = id ? JSON.parse(localStorage.getItem('mops_mata_pelajaran') || '[]').find(x => x.id === id) : null;
    openModal(m ? 'Edit Mapel' : 'Tambah Mapel', `<form onsubmit="Pages._saveMapel(event,'${id||''}')"><div class="grid grid-cols-2 gap-4">
      <div class="form-group"><label class="form-label">Kode *</label><input type="text" class="form-input" name="kode_mapel" value="${m?.kode_mapel||''}" required></div>
      <div class="form-group"><label class="form-label">Nama Mapel *</label><input type="text" class="form-input" name="nama_mapel" value="${m?.nama_mapel||''}" required></div>
      <div class="form-group"><label class="form-label">Kelompok</label><select class="form-select" name="kelompok"><option value="A" ${m?.kelompok==='A'?'selected':''}>A (Keagamaan)</option><option value="B" ${m?.kelompok==='B'?'selected':''}>B (Umum)</option><option value="C" ${m?.kelompok==='C'?'selected':''}>C (Kejuruan)</option></select></div>
      <div class="form-group"><label class="form-label">Jam/Minggu</label><input type="number" class="form-input" name="jam_pelajaran" value="${m?.jam_pelajaran||1}" min="1"></div>
    </div><div class="flex justify-end gap-2 mt-4 pt-4 border-t"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button type="submit" class="btn btn-primary">Simpan</button></div></form>`);
  },

  async _saveMapel(e, id) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    data.jam_pelajaran = parseInt(data.jam_pelajaran) || 1;
    if (id) { await DB.update('mata_pelajaran', id, data); showToast('success', 'Mapel diperbarui'); }
    else { data.madrasah_id = Auth.currentUser?.madrasah_id || 'mad_001'; await DB.insert('mata_pelajaran', data); showToast('success', 'Mapel ditambahkan'); }
    Realtime.broadcast('data_changed', 'mapel');
    closeModal(); this.renderMapel();
  },

  async _deleteMapel(id) {
    if (!Utils.confirm('Hapus mapel ini?')) return;
    await DB.delete('mata_pelajaran', id); showToast('success', 'Mapel dihapus');
    Realtime.broadcast('data_changed', 'mapel');
    this.renderMapel();
  },

  // ========== MANAJEMEN USER ==========
  async renderManajemenUser() {
    const page = document.getElementById('activePage');
    const users = await DB.getAll('profiles', {}, 'created_at', false);
    const roleLabels = { super_admin: 'Super Admin', admin_kanwil: 'Admin Kanwil', admin_kabupaten: 'Admin Kabupaten', kepala_madrasah: 'Kepala Madrasah', operator: 'Operator', guru: 'Guru', ortu: 'Orang Tua' };
    const roleColors = { super_admin: 'badge-red', admin_kanwil: 'badge-purple', admin_kabupaten: 'badge-purple', kepala_madrasah: 'badge-blue', operator: 'badge-blue', guru: 'badge-green', ortu: 'badge-yellow' };

    page.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-2">
          <div class="search-box"><input type="text" id="searchUser" placeholder="Cari nama, email..." class="form-input w-64" oninput="Pages._filterUser()"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
          <select id="filterRoleUser" class="form-select w-36" onchange="Pages._filterUser()"><option value="">Semua Role</option><option value="guru">Guru</option><option value="ortu">Orang Tua</option><option value="operator">Operator</option><option value="kepala_madrasah">Kepala Madrasah</option></select>
        </div>
      </div>
      <div class="card">
        <div class="table-container">
          <table>
            <thead><tr><th>No</th><th>Nama</th><th>Email</th><th>Role</th><th>Status</th><th>Dibuat</th><th>Aksi</th></tr></thead>
            <tbody id="userTableBody">${users.map((u, i) => this._userRow(u, i + 1, roleLabels, roleColors)).join('')}</tbody>
          </table>
        </div>
        <div class="card-body border-t"><span class="text-sm text-gray-500">${users.length} user terdaftar</span></div>
      </div>
      <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
        <strong>Catatan:</strong> User baru didaftarkan melalui halaman Register. Admin dapat mengubah role dan status di sini.
      </div>`;
  },

  _userRow(u, no, roleLabels, roleColors) {
    const sb = u.is_active ? 'badge-green' : 'badge-red';
    const sl = roleLabels[u.role] || u.role;
    const sc = roleColors[u.role] || 'badge-blue';
    return `<tr>
      <td class="font-medium">${no}</td>
      <td><div class="flex items-center gap-2"><div class="avatar avatar-sm">${Utils.getInitials(u.nama_lengkap || u.email)}</div><span class="font-medium text-sm">${u.nama_lengkap || '-'}</span></div></td>
      <td class="text-sm">${u.email}</td>
      <td><span class="badge ${sc}">${sl}</span></td>
      <td><span class="badge ${sb}">${u.is_active ? 'Aktif' : 'Non-Aktif'}</span></td>
      <td class="text-sm">${u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID') : '-'}</td>
      <td><div class="flex gap-1 flex-wrap">
        <button class="btn btn-sm btn-outline" onclick="Pages._formEditUser('${u.id}','${(u.nama_lengkap||'').replace(/'/g,"\\'")}','${u.email}','${u.role}')">Edit</button>
        <button class="btn btn-sm btn-outline" onclick="Pages._formChangeRole('${u.id}','${u.role}')">Role</button>
        <button class="btn btn-sm btn-outline" onclick="Pages._toggleUserActive('${u.id}',${u.is_active})">${u.is_active ? 'Non-Aktifkan' : 'Aktifkan'}</button>
      </div></td>
    </tr>`;
  },

  _filterUser() {
    this.renderManajemenUser();
  },

  async _formChangeRole(userId, currentRole) {
    openModal('Ubah Role', `<form onsubmit="Pages._saveRole(event,'${userId}')">
      <div class="form-group"><label class="form-label">Role</label>
        <select class="form-select" name="role">
          <option value="guru" ${currentRole==='guru'?'selected':''}>Guru</option>
          <option value="ortu" ${currentRole==='ortu'?'selected':''}>Orang Tua</option>
          <option value="operator" ${currentRole==='operator'?'selected':''}>Operator</option>
          <option value="kepala_madrasah" ${currentRole==='kepala_madrasah'?'selected':''}>Kepala Madrasah</option>
          <option value="super_admin" ${currentRole==='super_admin'?'selected':''}>Super Admin</option>
        </select>
      </div>
      <div class="flex justify-end gap-2 mt-4 pt-4 border-t"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button type="submit" class="btn btn-primary">Simpan</button></div>
    </form>`);
  },

  async _saveRole(e, userId) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    await DB.update('profiles', userId, { role: data.role });
    showToast('success', 'Role berhasil diubah');
    closeModal();
    this.renderManajemenUser();
  },

  async _toggleUserActive(userId, currentActive) {
    await DB.update('profiles', userId, { is_active: !currentActive });
    showToast('success', currentActive ? 'User dinonaktifkan' : 'User diaktifkan');
    this.renderManajemenUser();
  },

  _formEditUser(userId, nama, email, role) {
    openModal('Edit Profil User', `<form onsubmit="Pages._saveEditUser(event,'${userId}')">
      <div class="space-y-4">
        <div class="form-group"><label class="form-label">Nama Lengkap</label><input type="text" class="form-input" name="nama_lengkap" value="${nama}" required></div>
        <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" name="email" value="${email}" required></div>
        <div class="form-group"><label class="form-label">Password Baru (kosongkan jika tidak diubah)</label><input type="password" class="form-input" name="password" minlength="6" placeholder="Minimal 6 karakter"></div>
      </div>
      <div class="flex justify-end gap-2 mt-4 pt-4 border-t">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">Simpan</button>
      </div>
    </form>`);
  },

  async _saveEditUser(e, userId) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const updates = { nama_lengkap: data.nama_lengkap, email: data.email };
    if (data.password && data.password.trim()) {
      updates.password = data.password;
    }
    await DB.update('profiles', userId, updates);

    if (userId === Auth.currentUser?.id) {
      Object.assign(Auth.currentUser, updates);
      localStorage.setItem('mops_current_user', JSON.stringify(Auth.currentUser));
      this.updateUserInfo();
    }

    showToast('success', 'Profil user berhasil diubah');
    closeModal();
    this.renderManajemenUser();
  },
};
