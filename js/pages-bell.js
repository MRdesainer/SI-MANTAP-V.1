// ============================================
// SI-MANTAP - BELL ADMIN DASHBOARD
// Manajemen Jadwal Bel Otomatis
// ============================================

// Bell jenis definitions (standalone for app.html context)
const BEL_JENIS = {
  masuk: { label: 'Masuk', color: '#059669', icon: 'play' },
  pergantian: { label: 'Pergantian', color: '#3b82f6', icon: 'refresh' },
  istirahat: { label: 'Istirahat', color: '#f59e0b', icon: 'pause' },
  shalat_dhuha: { label: 'Shalat Dhuha', color: '#8b5cf6', icon: 'mosque' },
  shalat_dzuhur: { label: 'Shalat Dzuhur', color: '#06b6d4', icon: 'mosque' },
  pulang: { label: 'Pulang', color: '#ef4444', icon: 'home' },
  ekstrakurikuler: { label: 'Ekstrakurikuler', color: '#ec4899', icon: 'star' },
  khusus: { label: 'Khusus', color: '#6b7280', icon: 'special' },
};

const BEL_HARI_NAMES = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

const BEL_DEFAULT_SCHEDULE = [
  { id:'bl_01', hari:[1,2,3,4,5,6], waktu:'06:45', nama:'Murattal & Dhuha', jenis:'shalat_dhuha', guru:'', kelas:'', suara:'bawaan', durasi:30, aktif:true },
  { id:'bl_02', hari:[1,2,3,4,5,6], waktu:'07:15', nama:'Pelajaran ke-1 Mulai', jenis:'masuk', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_03', hari:[1,2,3,4,5,6], waktu:'07:50', nama:'Pelajaran ke-1 Selesai', jenis:'pergantian', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_04', hari:[1,2,3,4,5,6], waktu:'07:55', nama:'Pelajaran ke-2 Mulai', jenis:'masuk', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_05', hari:[1,2,3,4,5,6], waktu:'08:30', nama:'Pelajaran ke-2 Selesai', jenis:'pergantian', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_06', hari:[1,2,3,4,5,6], waktu:'08:35', nama:'Pelajaran ke-3 Mulai', jenis:'masuk', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_07', hari:[1,2,3,4,5,6], waktu:'09:10', nama:'Pelajaran ke-3 Selesai', jenis:'pergantian', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_08', hari:[1,2,3,4,5,6], waktu:'09:10', nama:'Istirahat 1', jenis:'istirahat', guru:'', kelas:'', suara:'bawaan', durasi:15, aktif:true },
  { id:'bl_09', hari:[1,2,3,4,5,6], waktu:'09:25', nama:'Pelajaran ke-4 Mulai', jenis:'masuk', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_10', hari:[1,2,3,4,5,6], waktu:'10:00', nama:'Pelajaran ke-4 Selesai', jenis:'pergantian', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_11', hari:[1,2,3,4,5,6], waktu:'10:05', nama:'Pelajaran ke-5 Mulai', jenis:'masuk', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_12', hari:[1,2,3,4,5,6], waktu:'10:40', nama:'Pelajaran ke-5 Selesai', jenis:'pergantian', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_13', hari:[1,2,3,4,5,6], waktu:'10:40', nama:'Istirahat 2', jenis:'istirahat', guru:'', kelas:'', suara:'bawaan', durasi:15, aktif:true },
  { id:'bl_14', hari:[1,2,3,4,5,6], waktu:'10:55', nama:'Pelajaran ke-6 Mulai', jenis:'masuk', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_15', hari:[1,2,3,4,5,6], waktu:'11:30', nama:'Pelajaran ke-6 Selesai', jenis:'shalat_dzuhur', guru:'', kelas:'', suara:'bawaan', durasi:25, aktif:true },
  { id:'bl_16', hari:[1,2,3,4,5,6], waktu:'11:35', nama:'Pelajaran ke-7 Mulai', jenis:'masuk', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_17', hari:[1,2,3,4,5,6], waktu:'12:05', nama:'Pelajaran ke-7 Selesai', jenis:'shalat_dzuhur', guru:'', kelas:'', suara:'bawaan', durasi:25, aktif:true },
  { id:'bl_18', hari:[1,2,3,4,5,6], waktu:'12:30', nama:'Pelajaran ke-8 Mulai', jenis:'masuk', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_19', hari:[1,2,3,4,5,6], waktu:'13:05', nama:'Pelajaran ke-8 Selesai', jenis:'pergantian', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_20', hari:[1,2,3,4,5,6], waktu:'13:10', nama:'Pelajaran ke-9 Mulai', jenis:'masuk', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_21', hari:[1,2,3,4,5,6], waktu:'13:45', nama:'Pelajaran ke-9 Selesai', jenis:'pergantian', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_22', hari:[1,2,3,4,5,6], waktu:'13:45', nama:'Pelajaran ke-10 Mulai', jenis:'masuk', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_23', hari:[1,2,3,4,5,6], waktu:'14:20', nama:'Pelajaran ke-10 Selesai', jenis:'pergantian', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
  { id:'bl_24', hari:[1,2,3,4,5,6], waktu:'14:20', nama:'Ekstrakurikuler', jenis:'ekstrakurikuler', guru:'', kelas:'', suara:'bawaan', durasi:60, aktif:true },
  { id:'bl_25', hari:[1,2,3,4,5,6], waktu:'15:20', nama:'Bel Pulang', jenis:'pulang', guru:'', kelas:'', suara:'bawaan', durasi:0, aktif:true },
];

function getBelSchedule() {
  try {
    var stored = JSON.parse(localStorage.getItem('mops_bel_jadwal') || 'null');
    if (stored && stored.length > 0) return stored;
  } catch (e) {}
  localStorage.setItem('mops_bel_jadwal', JSON.stringify(BEL_DEFAULT_SCHEDULE));
  return BEL_DEFAULT_SCHEDULE;
}

Pages.renderBellAdmin = function() {
  const page = document.getElementById('activePage');
  const schedule = getBelSchedule();
  const log = JSON.parse(localStorage.getItem('mops_bel_log') || '[]');
  const settings = JSON.parse(localStorage.getItem('mops_settings') || '{}');
  const bellEnabled = settings.bellEnabled !== false;
  const quietMode = settings.bellQuietMode === true;
  const fridayPause = settings.bellFridayPause === true;

  const today = new Date();
  const dayIndex = today.getDay();
  const hariNames = BEL_HARI_NAMES;

  const todayBells = schedule.filter(b => b.aktif && b.hari.indexOf(dayIndex) !== -1);
  todayBells.sort((a,b) => a.waktu.localeCompare(b.waktu));

  const currentTime = String(today.getHours()).padStart(2,'0') + ':' + String(today.getMinutes()).padStart(2,'0');
  let activeBell = null;
  let nextBell = null;
  for (let i = 0; i < todayBells.length; i++) {
    if (todayBells[i].waktu <= currentTime) activeBell = todayBells[i];
    if (todayBells[i].waktu > currentTime && !nextBell) nextBell = todayBells[i];
  }

  const bellJenis = BEL_JENIS;

  page.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="stat-card ${bellEnabled && !quietMode ? 'green' : 'red'}">
        <div class="stat-value text-${bellEnabled && !quietMode ? 'green' : 'red'}-600">${bellEnabled && !quietMode ? 'AKTIF' : 'NONAKTIF'}</div>
        <div class="stat-label">Status Sistem Bel</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-value text-blue-600">${todayBells.length}</div>
        <div class="stat-label">Jadwal Hari Ini (${hariNames[dayIndex]})</div>
      </div>
      <div class="stat-card yellow">
        <div class="stat-value text-yellow-600">${nextBell ? nextBell.waktu : '--:--'}</div>
        <div class="stat-label">Bel Selanjutnya</div>
      </div>
      <div class="stat-card purple">
        <div class="stat-value text-purple-600">${log.length}</div>
        <div class="stat-label">Log Aktivitas</div>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
      <h3 class="font-bold text-lg">Jadwal Bel Otomatis</h3>
      <div class="flex gap-2 flex-wrap">
        <button class="btn ${bellEnabled ? 'btn-danger' : 'btn-primary'}" onclick="Pages._toggleBellSystem()">
          ${bellEnabled ? 'Nonaktifkan Bel' : 'Aktifkan Bel'}
        </button>
        <button class="btn btn-outline" onclick="Pages._toggleQuietMode()">
          ${quietMode ? 'Matikan Mode Senyap' : 'Mode Senyap'}
        </button>
        <button class="btn btn-outline" onclick="Pages._duplicateJadwal()">
          Duplikasi Jadwal
        </button>
        <button class="btn btn-primary" onclick="Pages._formBelJadwal()">
          + Tambah Jadwal
        </button>
      </div>
    </div>

    <!-- Quick Settings -->
    <div class="card mb-4">
      <div class="card-header"><h3 class="font-bold text-sm">Pengaturan Cepat</h3></div>
      <div class="card-body">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="form-group">
            <label class="form-label text-xs">Volume Bel</label>
            <input type="range" min="0" max="100" value="${(settings.bellVolume||0.7)*100}" class="w-full" onchange="Pages._updateBellSetting('bellVolume', this.value/100)">
            <div class="text-xs text-gray-400 text-center mt-1">${Math.round((settings.bellVolume||0.7)*100)}%</div>
          </div>
          <div class="form-group">
            <label class="form-label text-xs">Warning Bell</label>
            <select class="form-select text-sm" onchange="Pages._updateBellSetting('bellWarningEnabled', this.value==='true')">
              <option value="true" ${settings.bellWarningEnabled !== false ? 'selected' : ''}>Aktif</option>
              <option value="false" ${settings.bellWarningEnabled === false ? 'selected' : ''}>Nonaktif</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label text-xs">Tunda (menit sebelum)</label>
            <select class="form-select text-sm" onchange="Pages._updateBellSetting('bellWarningMinutes', parseInt(this.value))">
              ${[1,2,3,5,10].map(m => `<option value="${m}" ${(settings.bellWarningMinutes||5)===m?'selected':''}>${m} menit</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label text-xs">Jumat Otomatis</label>
            <select class="form-select text-sm" onchange="Pages._updateBellSetting('bellFridayPause', this.value==='true')">
              <option value="false" ${!fridayPause ? 'selected' : ''}>Normal</option>
              <option value="true" ${fridayPause ? 'selected' : ''}>Jeda Jumat (11.30-13.00)</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
          <div class="form-group">
            <label class="form-label text-xs">Tipe Suara Default</label>
            <select class="form-select text-sm" onchange="Pages._updateBellSetting('bellSoundType', this.value)">
              <option value="bawaan" ${(settings.bellSoundType||'bawaan')==='bawaan'?'selected':''}>Bawaan (Digital)</option>
              <option value="adzan" ${settings.bellSoundType==='adzan'?'selected':''}>Adzan</option>
              <option value="tts" ${settings.bellSoundType==='tts'?'selected':''}>TTS Pengumuman</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label text-xs">Teks-to-Speech</label>
            <select class="form-select text-sm" onchange="Pages._updateBellSetting('bellTtsEnabled', this.value==='true')">
              <option value="false" ${!settings.bellTtsEnabled ? 'selected' : ''}>Nonaktif</option>
              <option value="true" ${settings.bellTtsEnabled ? 'selected' : ''}>Aktif</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label text-xs">Adzan Otomatis</label>
            <select class="form-select text-sm" onchange="Pages._updateBellSetting('bellAutoAdzan', this.value==='true')">
              <option value="true" ${settings.bellAutoAdzan !== false ? 'selected' : ''}>Aktif</option>
              <option value="false" ${settings.bellAutoAdzan === false ? 'selected' : ''}>Nonaktif</option>
            </select>
          </div>
          <div class="form-group flex items-end">
            <button class="btn btn-outline w-full text-sm" onclick="Pages._testBellSound()">Uji Suara Bel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Schedule Table by Day -->
    <div class="card mb-4">
      <div class="card-header flex items-center justify-between">
        <h3 class="font-bold text-sm">Jadwal Lengkap (Semua Hari)</h3>
        <div class="flex gap-2">
          <select id="bellDayFilter" class="form-select text-sm py-1" onchange="Pages._filterBellSchedule()">
            <option value="all">Semua Hari</option>
            ${[1,2,3,4,5,6].map(d => `<option value="${d}" ${d===dayIndex?'selected':''}>${hariNames[d]}</option>`).join('')}
          </select>
          <button class="btn btn-sm btn-outline" onclick="Pages._exportBellSchedule()">Export</button>
          <label class="btn btn-sm btn-outline cursor-pointer">
            Import
            <input type="file" accept=".json,.csv" class="hidden" onchange="Pages._importBellSchedule(event)">
          </label>
        </div>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Nama/Kegiatan</th>
              <th>Jenis</th>
              <th>Hari</th>
              <th>Suara</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody id="bellScheduleBody">
            ${schedule.sort((a,b) => a.waktu.localeCompare(b.waktu)).map(b => {
              const jInfo = bellJenis[b.jenis] || bellJenis.masuk;
              const hariLabels = b.hari.map(h => hariNames[h]?.substring(0,2)).join(', ');
              const isActive = b.waktu === currentTime && b.hari.indexOf(dayIndex) !== -1;
              return `<tr class="${isActive ? 'bg-green-50' : ''}">
                <td class="font-mono font-bold text-sm">${b.waktu}</td>
                <td class="font-medium text-sm">${b.nama}</td>
                <td><span class="badge" style="background:${jInfo.color}20;color:${jInfo.color};border:1px solid ${jInfo.color}40">${jInfo.label}</span></td>
                <td class="text-xs">${hariLabels}</td>
                <td class="text-xs capitalize">${b.suara || 'bawaan'}</td>
                <td><span class="badge ${b.aktif ? 'badge-green' : 'badge-red'}">${b.aktif ? 'Aktif' : 'Nonaktif'}</span></td>
                <td>
                  <div class="flex gap-1">
                    <button class="btn btn-sm btn-outline" onclick="Pages._formBelJadwal('${b.id}')">Edit</button>
                    <button class="btn btn-sm btn-outline text-red-500" onclick="Pages._deleteBelJadwal('${b.id}')">Hapus</button>
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Bell Log -->
    <div class="card">
      <div class="card-header flex items-center justify-between">
        <h3 class="font-bold text-sm">Log Aktivitas Bel</h3>
        <button class="btn btn-sm btn-outline text-red-500" onclick="Pages._clearBellLog()">Hapus Log</button>
      </div>
      <div class="table-container" style="max-height:300px;overflow-y:auto">
        <table>
          <thead><tr><th>Waktu</th><th>Nama Bel</th><th>Jenis</th><th>Suara</th></tr></thead>
          <tbody>
            ${log.length === 0 ? '<tr><td colspan="4" class="text-center text-gray-400 text-sm py-4">Belum ada aktivitas</td></tr>' :
              log.slice(0, 50).map(l => {
                const jInfo = bellJenis[l.jenis] || bellJenis.masuk;
                const d = new Date(l.waktu);
                return `<tr>
                  <td class="text-xs font-mono">${d.toLocaleString('id-ID')}</td>
                  <td class="text-sm">${l.nama}</td>
                  <td><span class="badge" style="background:${jInfo.color}20;color:${jInfo.color}">${jInfo.label}</span></td>
                  <td class="text-xs capitalize">${l.suara}</td>
                </tr>`;
              }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

// === FORM JADWAL BEL ===
Pages._formBelJadwal = function(id) {
  const schedule = JSON.parse(localStorage.getItem('mops_bel_jadwal') || 'null') || BEL_DEFAULT_SCHEDULE;
  const b = id ? schedule.find(x => x.id === id) : null;
  const bellJenis = BEL_JENIS;
  const hariNames = ['','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

  const suaraOptions = [
    {value:'bawaan',label:'Bawaan (Digital)'},
    {value:'adzan',label:'Adzan'},
    {value:'custom',label:'Custom Audio'},
    {value:'tts',label:'TTS Pengumuman'},
  ];

  openModal(b ? 'Edit Jadwal Bel' : 'Tambah Jadwal Bel', `
    <form onsubmit="Pages._saveBelJadwal(event,'${id||''}')">
      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label">Waktu (Jam:Menit) *</label>
          <input type="time" class="form-input" name="waktu" value="${b?.waktu||'07:00'}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Nama/Kegiatan *</label>
          <input type="text" class="form-input" name="nama" value="${b?.nama||''}" placeholder="Contoh: Pelajaran ke-1 Mulai" required>
        </div>
        <div class="form-group">
          <label class="form-label">Jenis Bel *</label>
          <select class="form-select" name="jenis" required>
            ${Object.entries(bellJenis).map(([k,v]) => `<option value="${k}" ${b?.jenis===k?'selected':''}>${v.label}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Suara</label>
          <select class="form-select" name="suara">
            ${suaraOptions.map(s => `<option value="${s.value}" ${(b?.suara||'bawaan')===s.value?'selected':''}>${s.label}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Durasi (menit)</label>
          <input type="number" class="form-input" name="durasi" value="${b?.durasi||0}" min="0" max="180">
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" name="aktif">
            <option value="true" ${b?.aktif !== false ? 'selected' : ''}>Aktif</option>
            <option value="false" ${b?.aktif === false ? 'selected' : ''}>Nonaktif</option>
          </select>
        </div>
      </div>
      <div class="form-group mt-3">
        <label class="form-label">Berlaku untuk Hari</label>
        <div class="flex flex-wrap gap-3 mt-2">
          ${[1,2,3,4,5,6].map(h => `
            <label class="flex items-center gap-1 text-sm cursor-pointer">
              <input type="checkbox" name="hari_${h}" value="${h}" ${b?.hari?.indexOf(h)!==-1 || (!b && [1,2,3,4,5,6].indexOf(h)!==-1) ? 'checked' : ''} class="rounded">
              ${hariNames[h]}
            </label>
          `).join('')}
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-3">
        <div class="form-group">
          <label class="form-label">Guru Pengajar (opsional)</label>
          <input type="text" class="form-input" name="guru" value="${b?.guru||''}" placeholder="Nama guru">
        </div>
        <div class="form-group">
          <label class="form-label">Kelas (opsional)</label>
          <input type="text" class="form-input" name="kelas" value="${b?.kelas||''}" placeholder="Semua kelas">
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4 pt-4 border-t">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button>
        <button type="button" class="btn btn-outline" onclick="Pages._testBellFromForm()">Test Suara</button>
        <button type="submit" class="btn btn-primary">Simpan</button>
      </div>
    </form>
  `);
};

Pages._saveBelJadwal = function(e, id) {
  e.preventDefault();
  const form = e.target;
  const data = {
    waktu: form.waktu.value,
    nama: form.nama.value,
    jenis: form.jenis.value,
    suara: form.suara.value,
    durasi: parseInt(form.durasi.value) || 0,
    aktif: form.aktif.value === 'true',
    guru: form.guru.value,
    kelas: form.kelas.value,
    hari: [],
  };

  [1,2,3,4,5,6].forEach(h => {
    if (form['hari_' + h] && form['hari_' + h].checked) {
      data.hari.push(h);
    }
  });

  if (data.hari.length === 0) {
    showToast('error', 'Pilih minimal satu hari');
    return;
  }

  let schedule = JSON.parse(localStorage.getItem('mops_bel_jadwal') || 'null') || BEL_DEFAULT_SCHEDULE;

  if (id) {
    const idx = schedule.findIndex(x => x.id === id);
    if (idx !== -1) {
      schedule[idx] = { ...schedule[idx], ...data };
    }
  } else {
    data.id = 'bl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    schedule.push(data);
  }

  localStorage.setItem('mops_bel_jadwal', JSON.stringify(schedule));
  Realtime.broadcast('data_changed', 'bel_jadwal');
  closeModal();
  showToast('success', id ? 'Jadwal diperbarui' : 'Jadwal ditambahkan');
  Pages.renderBellAdmin();
};

Pages._deleteBelJadwal = function(id) {
  if (!confirm('Hapus jadwal bel ini?')) return;
  let schedule = JSON.parse(localStorage.getItem('mops_bel_jadwal') || 'null') || BEL_DEFAULT_SCHEDULE;
  schedule = schedule.filter(x => x.id !== id);
  localStorage.setItem('mops_bel_jadwal', JSON.stringify(schedule));
  Realtime.broadcast('data_changed', 'bel_jadwal');
  showToast('success', 'Jadwal dihapus');
  Pages.renderBellAdmin();
};

// === TOGGLE & SETTINGS ===
Pages._toggleBellSystem = function() {
  const settings = JSON.parse(localStorage.getItem('mops_settings') || '{}');
  settings.bellEnabled = settings.bellEnabled === false ? true : false;
  localStorage.setItem('mops_settings', JSON.stringify(settings));
  Realtime.broadcast('settings_changed', settings);
  showToast('success', settings.bellEnabled ? 'Sistem bel diaktifkan' : 'Sistem bel dinonaktifkan');
  Pages.renderBellAdmin();
};

Pages._toggleQuietMode = function() {
  const settings = JSON.parse(localStorage.getItem('mops_settings') || '{}');
  settings.bellQuietMode = !settings.bellQuietMode;
  localStorage.setItem('mops_settings', JSON.stringify(settings));
  Realtime.broadcast('settings_changed', settings);
  showToast('success', settings.bellQuietMode ? 'Mode senyap diaktifkan' : 'Mode senyap dimatikan');
  Pages.renderBellAdmin();
};

Pages._updateBellSetting = function(key, value) {
  const settings = JSON.parse(localStorage.getItem('mops_settings') || '{}');
  settings[key] = value;
  localStorage.setItem('mops_settings', JSON.stringify(settings));
  Realtime.broadcast('settings_changed', settings);
  showToast('info', 'Pengaturan diperbarui');
};

// === TEST BELL ===
Pages._testBellSound = function() {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    var now = ctx.currentTime;
    var vol = 0.5;
    // Play masuk bell pattern
    var notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach(function(freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(vol * 0.25, now + i * 0.15 + 0.03);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.15 + 0.13);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.15);
    });
    var osc2 = ctx.createOscillator();
    var gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = 1046.50;
    gain2.gain.setValueAtTime(0, now + 0.6);
    gain2.gain.linearRampToValueAtTime(vol * 0.3, now + 0.65);
    gain2.gain.linearRampToValueAtTime(0, now + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.6);
    osc2.stop(now + 1.2);
    showToast('info', 'Memutar suara test...');
  } catch (e) {
    showToast('error', 'Gagal memutar suara: ' + e.message);
  }
};

Pages._testBellFromForm = function() {
  Pages._testBellSound();
};

// === DUPLICATE ===
Pages._duplicateJadwal = function() {
  const hariNames = ['','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  openModal('Duplikasi Jadwal', `
    <div class="space-y-4">
      <div class="form-group">
        <label class="form-label">Salin dari Hari</label>
        <select id="dupSource" class="form-select">
          ${[1,2,3,4,5,6].map(h => `<option value="${h}">${hariNames[h]}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Ke Hari</label>
        <div class="flex flex-wrap gap-3 mt-2">
          ${[1,2,3,4,5,6].map(h => `
            <label class="flex items-center gap-1 text-sm cursor-pointer">
              <input type="checkbox" id="dupTarget_${h}" value="${h}" class="rounded">
              ${hariNames[h]}
            </label>
          `).join('')}
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4 pt-4 border-t">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button>
        <button type="button" class="btn btn-primary" onclick="Pages._executeDuplicate()">Duplikasi</button>
      </div>
    </div>
  `);
};

Pages._executeDuplicate = function() {
  const source = parseInt(document.getElementById('dupSource').value);
  let schedule = JSON.parse(localStorage.getItem('mops_bel_jadwal') || 'null') || BEL_DEFAULT_SCHEDULE;
  const targets = [];
  [1,2,3,4,5,6].forEach(h => {
    if (document.getElementById('dupTarget_' + h) && document.getElementById('dupTarget_' + h).checked) {
      targets.push(h);
    }
  });

  if (targets.length === 0) {
    showToast('error', 'Pilih minimal satu hari tujuan');
    return;
  }

  // Remove existing entries for target days from source schedule
  const sourceBells = schedule.filter(b => b.hari.indexOf(source) !== -1);
  if (sourceBells.length === 0) {
    showToast('error', 'Tidak ada jadwal untuk hari sumber');
    return;
  }

  // Remove target day from all source bells, then add new copies
  schedule.forEach(b => {
    if (b.hari.indexOf(source) !== -1) {
      targets.forEach(t => {
        if (b.hari.indexOf(t) === -1) {
          b.hari.push(t);
        }
      });
    }
  });

  localStorage.setItem('mops_bel_jadwal', JSON.stringify(schedule));
  Realtime.broadcast('data_changed', 'bel_jadwal');
  closeModal();
  showToast('success', 'Jadwal berhasil diduplikasi');
  Pages.renderBellAdmin();
};

// === IMPORT/EXPORT ===
Pages._exportBellSchedule = function() {
  const schedule = JSON.parse(localStorage.getItem('mops_bel_jadwal') || 'null') || BEL_DEFAULT_SCHEDULE;
  const json = JSON.stringify(schedule, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'jadwal_bel_' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('success', 'Jadwal berhasil di-export');
};

Pages._importBellSchedule = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) throw new Error('Format tidak valid');
      localStorage.setItem('mops_bel_jadwal', JSON.stringify(data));
      Realtime.broadcast('data_changed', 'bel_jadwal');
      showToast('success', 'Jadwal berhasil di-import (' + data.length + ' jadwal)');
      Pages.renderBellAdmin();
    } catch (err) {
      showToast('error', 'Gagal import: ' + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
};

// === LOG ===
Pages._clearBellLog = function() {
  if (!confirm('Hapus semua log aktivitas bel?')) return;
  localStorage.setItem('mops_bel_log', '[]');
  showToast('success', 'Log dihapus');
  Pages.renderBellAdmin();
};

// ============================================
// HALAMAN PENGUMUMAN & RUNNING TEXT
// ============================================

Pages.renderPengumuman = function() {
  const page = document.getElementById('activePage');
  const pengumuman = JSON.parse(localStorage.getItem('mops_pengumuman') || '[]');
  const runningText = localStorage.getItem('mops_running_text') || '';
  const waSettings = JSON.parse(localStorage.getItem('mops_wa_settings') || '{}');
  const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]');
  const ortu = JSON.parse(localStorage.getItem('mops_ortu') || '[]');
  const ortuMurid = JSON.parse(localStorage.getItem('mops_ortu_murid') || '[]');
  const murid = JSON.parse(localStorage.getItem('mops_murid') || '[]');

  // Hitung jumlah kontak WA per kelas
  let totalKontak = 0;
  const kelasWithContact = kelas.map(k => {
    const muridKelas = murid.filter(m => m.kelas_id === k.id);
    const ortuIds = [];
    muridKelas.forEach(m => {
      const rel = ortuMurid.filter(r => r.murid_id === m.id);
      rel.forEach(r => {
        const o = ortu.find(x => x.id === r.ortu_id || x.id === r.user_id);
        if (o && o.no_hp) ortuIds.push(o.no_hp);
      });
    });
    totalKontak += ortuIds.length;
    return { ...k, jumlahKontak: ortuIds.length };
  });

  page.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="stat-card green">
        <div class="stat-value text-green-600">${pengumuman.length}</div>
        <div class="stat-label">Pengumuman Aktif</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-value text-blue-600">${runningText ? 'Aktif' : 'Kosong'}</div>
        <div class="stat-label">Running Text</div>
      </div>
      <div class="stat-card purple">
        <div class="stat-value text-purple-600">${totalKontak}</div>
        <div class="stat-label">Kontak WA Wali Murid</div>
      </div>
      <div class="stat-card yellow">
        <div class="stat-value text-yellow-600">${kelas.length}</div>
        <div class="stat-label">Total Kelas</div>
      </div>
    </div>

    <!-- RUNNING TEXT EDITOR -->
    <div class="card mb-4">
      <div class="card-header"><h3 class="font-bold">Running Text (Teks Berjalan)</h3></div>
      <div class="card-body">
        <div class="form-group">
          <label class="form-label">Teks yang ditampilkan di layar info (scrolling)</label>
          <textarea id="runningTextInput" class="form-input" rows="3" placeholder="Masukkan teks running text...">${runningText}</textarea>
        </div>
        <div class="flex justify-between items-center mt-3">
          <div class="text-xs text-gray-400">Teks akan ditampilkan sebagai scrolling text di layar info</div>
          <button class="btn btn-primary" onclick="Pages._saveRunningText()">Simpan Running Text</button>
        </div>
      </div>
    </div>

    <!-- PENGUMUMAN CRUD -->
    <div class="card mb-4">
      <div class="card-header flex items-center justify-between">
        <h3 class="font-bold">Daftar Pengumuman</h3>
        <button class="btn btn-primary" onclick="Pages._formPengumuman()">+ Tambah Pengumuman</button>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th width="30">No</th>
              <th>Judul</th>
              <th>Isi Pengumuman</th>
              <th width="80">Prioritas</th>
              <th width="80">Status</th>
              <th width="100">Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${pengumuman.length === 0 ? '<tr><td colspan="6" class="text-center text-gray-400 py-6">Belum ada pengumuman. Klik "+ Tambah Pengumuman" untuk membuat baru.</td></tr>' :
              pengumuman.map((p, i) => `
                <tr class="${p.prioritas === 'tinggi' ? 'bg-red-50' : ''}">
                  <td>${i + 1}</td>
                  <td class="font-medium text-sm">${p.judul}</td>
                  <td class="text-sm" style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.isi}</td>
                  <td><span class="badge ${p.prioritas === 'tinggi' ? 'badge-red' : p.prioritas === 'sedang' ? 'badge-yellow' : 'badge-blue'}">${p.prioritas || 'normal'}</span></td>
                  <td><span class="badge ${p.aktif !== false ? 'badge-green' : 'badge-red'}">${p.aktif !== false ? 'Aktif' : 'Nonaktif'}</span></td>
                  <td>
                    <div class="flex gap-1">
                      <button class="btn btn-sm btn-outline" onclick="Pages._formPengumuman('${p.id}')">Edit</button>
                      <button class="btn btn-sm btn-outline text-red-500" onclick="Pages._deletePengumuman('${p.id}')">Hapus</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- WHATSAPP BROADCAST -->
    <div class="card mb-4">
      <div class="card-header"><h3 class="font-bold">Kirim Pengumuman via WhatsApp</h3></div>
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="form-group">
              <label class="form-label">Pilih Pengumuman</label>
              <select id="waPengumumanSelect" class="form-select" onchange="Pages._previewWaMessage()">
                <option value="">-- Pilih pengumuman --</option>
                ${pengumuman.filter(p => p.aktif !== false).map(p => `<option value="${p.id}">${p.judul}</option>`).join('')}
                <option value="_custom">Pesan Kustom...</option>
              </select>
            </div>
            <div id="waCustomMessage" class="form-group" style="display:none">
              <label class="form-label">Pesan Kustom</label>
              <textarea id="waCustomText" class="form-input" rows="4" placeholder="Tulis pesan WhatsApp..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Kirim Ke</label>
              <select id="waTarget" class="form-select">
                <option value="all">Semua Wali Murid</option>
                ${kelas.map(k => `<option value="${k.id}">Kelas ${k.nama_kelas}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Sertakan Header</label>
              <select id="waWithHeader" class="form-select">
                <option value="true">Ya (dengan nama madrasah)</option>
                <option value="false">Tidak</option>
              </select>
            </div>
          </div>
          <div>
            <label class="form-label">Preview Pesan</label>
            <div id="waPreview" class="p-4 bg-green-50 border border-green-200 rounded-lg text-sm" style="min-height:120px;font-family:sans-serif;white-space:pre-wrap;color:#333">
              Pilih pengumuman untuk melihat preview...
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center mt-4 pt-4 border-t">
          <div class="text-xs text-gray-400">
            <svg class="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Fitur ini membuka WhatsApp Web/app dengan pesan siap kirim. Tekan kirim manual untuk mengirim ke setiap nomor.
          </div>
          <button class="btn btn-success" onclick="Pages._sendWhatsApp()" style="background:#25D366;border-color:#25D366;color:white">
            <svg class="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Kirim via WhatsApp
          </button>
        </div>
      </div>
    </div>

    <!-- DATA KONTAK WA PER KELAS -->
    <div class="card">
      <div class="card-header flex items-center justify-between">
        <h3 class="font-bold">Data Kontak WA Wali Murid per Kelas</h3>
        <button class="btn btn-sm btn-outline" onclick="Pages._formAddContact()">+ Tambah Kontak</button>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr><th>No</th><th>Kelas</th><th>Jumlah Murid</th><th>Kontak WA</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            ${kelas.map((k, i) => {
              const muridKelas = murid.filter(m => m.kelas_id === k.id);
              const kelasContact = kelasWithContact.find(x => x.id === k.id);
              return `<tr>
                <td>${i + 1}</td>
                <td class="font-medium">${k.nama_kelas}</td>
                <td>${muridKelas.length}</td>
                <td><span class="badge ${kelasContact.jumlahKontak > 0 ? 'badge-green' : 'badge-red'}">${kelasContact.jumlahKontak} nomor</span></td>
                <td><button class="btn btn-sm btn-outline" onclick="Pages._editContactsKelas('${k.id}')">Kelola</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

// === FORM PENGUMUMAN ===
Pages._formPengumuman = function(id) {
  const pengumuman = JSON.parse(localStorage.getItem('mops_pengumuman') || '[]');
  const p = id ? pengumuman.find(x => x.id === id) : null;

  openModal(p ? 'Edit Pengumuman' : 'Tambah Pengumuman', `
    <form onsubmit="Pages._savePengumuman(event,'${id||''}')">
      <div class="space-y-4">
        <div class="form-group">
          <label class="form-label">Judul Pengumuman *</label>
          <input type="text" class="form-input" name="judul" value="${p?.judul||''}" placeholder="Contoh: Jadwal UTS Ganjil" required>
        </div>
        <div class="form-group">
          <label class="form-label">Isi Pengumuman *</label>
          <textarea class="form-input" name="isi" rows="4" placeholder="Tulis isi pengumuman..." required>${p?.isi||''}</textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label class="form-label">Prioritas</label>
            <select class="form-select" name="prioritas">
              <option value="normal" ${p?.prioritas==='normal'||!p?'selected':''}>Normal</option>
              <option value="sedang" ${p?.prioritas==='sedang'?'selected':''}>Sedang</option>
              <option value="tinggi" ${p?.prioritas==='tinggi'?'selected':''}>Tinggi (Penting)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-select" name="aktif">
              <option value="true" ${p?.aktif!==false?'selected':''}>Aktif (tampil di layar)</option>
              <option value="false" ${p?.aktif===false?'selected':''}>Nonaktif (sembunyi)</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Tampilkan Sampai (opsional)</label>
          <input type="date" class="form-input" name="tanggal_akhir" value="${p?.tanggal_akhir||''}">
        </div>
        <div class="form-group">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="kirim_wa" ${p?.kirim_wa?'checked':''} class="rounded">
            <span class="text-sm">Kirim otomatis via WhatsApp saat disimpan</span>
          </label>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4 pt-4 border-t">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">Simpan</button>
      </div>
    </form>
  `);
};

Pages._savePengumuman = function(e, id) {
  e.preventDefault();
  const form = e.target;
  const data = {
    judul: form.judul.value,
    isi: form.isi.value,
    prioritas: form.prioritas.value,
    aktif: form.aktif.value === 'true',
    tanggal_akhir: form.tanggal_akhir.value || null,
    kirim_wa: form.kirim_wa.checked,
    updated_at: new Date().toISOString(),
  };

  let pengumuman = JSON.parse(localStorage.getItem('mops_pengumuman') || '[]');

  if (id) {
    const idx = pengumuman.findIndex(x => x.id === id);
    if (idx !== -1) pengumuman[idx] = { ...pengumuman[idx], ...data };
  } else {
    data.id = 'peng_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    data.created_at = new Date().toISOString();
    pengumuman.unshift(data);
  }

  localStorage.setItem('mops_pengumuman', JSON.stringify(pengumuman));
  Realtime.broadcast('data_changed', 'pengumuman');
  closeModal();
  showToast('success', id ? 'Pengumuman diperbarui' : 'Pengumuman ditambahkan');
  Pages.renderPengumuman();

  // Kirim WA otomatis jika dicentang
  if (data.kirim_wa) {
    setTimeout(() => Pages._sendWhatsAppForPengumuman(data), 500);
  }
};

Pages._deletePengumuman = function(id) {
  if (!confirm('Hapus pengumuman ini?')) return;
  let pengumuman = JSON.parse(localStorage.getItem('mops_pengumuman') || '[]');
  pengumuman = pengumuman.filter(x => x.id !== id);
  localStorage.setItem('mops_pengumuman', JSON.stringify(pengumuman));
  Realtime.broadcast('data_changed', 'pengumuman');
  showToast('success', 'Pengumuman dihapus');
  Pages.renderPengumuman();
};

// === RUNNING TEXT ===
Pages._saveRunningText = function() {
  const text = document.getElementById('runningTextInput')?.value || '';
  localStorage.setItem('mops_running_text', text);
  Realtime.broadcast('settings_changed', { runningText: text });
  showToast('success', 'Running text disimpan');
};

// === WHATSAPP ===
Pages._previewWaMessage = function() {
  const select = document.getElementById('waPengumumanSelect');
  const customDiv = document.getElementById('waCustomMessage');
  const preview = document.getElementById('waPreview');
  const withHeader = document.getElementById('waWithHeader')?.value === 'true';
  const settings = JSON.parse(localStorage.getItem('mops_settings') || '{}');
  const madrasahName = settings.madrasahName || 'MI Bustanul Ulum Curahkalong 01';

  if (select.value === '_custom') {
    customDiv.style.display = 'block';
    preview.textContent = 'Ketik pesan di kolom kustom...';
    return;
  }

  customDiv.style.display = 'none';

  if (!select.value) {
    preview.textContent = 'Pilih pengumuman untuk melihat preview...';
    return;
  }

  const pengumuman = JSON.parse(localStorage.getItem('mops_pengumuman') || '[]');
  const p = pengumuman.find(x => x.id === select.value);
  if (!p) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  let msg = '';
  if (withHeader) {
    msg += ` Assalamu'alaikum Wr. Wb.\n\n`;
    msg += `_*${madrasahName}*_\n`;
    msg += `${'─'.repeat(25)}\n\n`;
  }
  msg += `_*${p.judul}*_\n\n`;
  msg += `${p.isi}\n\n`;
  if (withHeader) {
    msg += `${'─'.repeat(25)}\n`;
    msg += `Demikian pengumuman ini disampaikan.\n`;
    msg += `Atas perhatian dan kerjasamanya kami ucapkan terima kasih.\n\n`;
    msg += `_Wassalamu'alaikum Wr. Wb._\n\n`;
    msg += `_${madrasahName}_\n`;
    msg += `${dateStr}`;
  }

  preview.textContent = msg;
};

Pages._sendWhatsApp = function() {
  const select = document.getElementById('waPengumumanSelect');
  const target = document.getElementById('waTarget').value;
  const withHeader = document.getElementById('waWithHeader')?.value === 'true';

  let message = '';

  if (select.value === '_custom') {
    message = document.getElementById('waCustomText')?.value || '';
  } else if (select.value) {
    // Trigger preview to get message
    Pages._previewWaMessage();
    message = document.getElementById('waPreview')?.textContent || '';
  }

  if (!message.trim()) {
    showToast('error', 'Pilih pengumuman atau tulis pesan terlebih dahulu');
    return;
  }

  // Collect phone numbers
  const phones = Pages._getPhoneNumbers(target);

  if (phones.length === 0) {
    showToast('error', 'Tidak ada kontak WA ditemukan. Pastikan data wali murid memiliki nomor HP.');
    return;
  }

  // Encode message
  const encoded = encodeURIComponent(message);

  // Open WhatsApp for each phone (with delay)
  let opened = 0;
  const maxOpen = Math.min(phones.length, 10); // Limit to prevent browser blocking

  showToast('info', `Membuka ${maxOpen} chat WhatsApp...`);

  phones.slice(0, maxOpen).forEach(function(phone, i) {
    setTimeout(function() {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
      window.open(url, '_blank');
      opened++;
    }, i * 800); // 800ms delay between each
  });

  // Log
  try {
    const log = JSON.parse(localStorage.getItem('mops_wa_log') || '[]');
    log.unshift({
      id: 'wal_' + Date.now(),
      waktu: new Date().toISOString(),
      target: target,
      jumlah: Math.min(phones.length, maxOpen),
      pesan: message.substring(0, 100),
    });
    if (log.length > 100) log.length = 100;
    localStorage.setItem('mops_wa_log', JSON.stringify(log));
  } catch (e) {}

  setTimeout(function() {
    showToast('success', `${Math.min(phones.length, maxOpen)} chat WhatsApp dibuka. Tekan kirim di masing-masing chat.`);
  }, maxOpen * 800 + 500);
};

Pages._sendWhatsAppForPengumuman = function(pengumuman) {
  const withHeader = true;
  const settings = JSON.parse(localStorage.getItem('mops_settings') || '{}');
  const madrasahName = settings.madrasahName || 'MI Bustanul Ulum Curahkalong 01';
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  let msg = `Assalamu'alaikum Wr. Wb.\n\n`;
  msg += `*${madrasahName}*\n`;
  msg += `${'─'.repeat(25)}\n\n`;
  msg += `*${pengumuman.judul}*\n\n`;
  msg += `${pengumuman.isi}\n\n`;
  msg += `${'─'.repeat(25)}\n`;
  msg += `Demikian pengumuman ini disampaikan.\n`;
  msg += `Atas perhatian dan kerjasamanya kami ucapkan terima kasih.\n\n`;
  msg += `_Wassalamu'alaikum Wr. Wb._\n\n`;
  msg += `*${madrasahName}*\n`;
  msg += `${dateStr}`;

  const encoded = encodeURIComponent(msg);
  const phones = Pages._getPhoneNumbers('all');

  if (phones.length === 0) {
    showToast('error', 'Tidak ada kontak WA. Tambahkan nomor HP wali murid terlebih dahulu.');
    return;
  }

  let i = 0;
  const maxOpen = Math.min(phones.length, 10);

  phones.slice(0, maxOpen).forEach(function(phone, idx) {
    setTimeout(function() {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
    }, idx * 800);
  });

  showToast('success', `Membuka ${maxOpen} chat WhatsApp...`);
};

Pages._getPhoneNumbers = function(target) {
  const murid = JSON.parse(localStorage.getItem('mops_murid') || '[]');
  const ortu = JSON.parse(localStorage.getItem('mops_ortu') || '[]');
  const ortuMurid = JSON.parse(localStorage.getItem('mops_ortu_murid') || '[]');
  const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]');
  const guru = JSON.parse(localStorage.getItem('mops_guru') || '[]');

  let muridList = [];
  if (target === 'all') {
    muridList = murid;
  } else {
    muridList = murid.filter(m => m.kelas_id === target);
  }

  const phones = [];
  const seen = new Set();

  muridList.forEach(function(m) {
    const rels = ortuMurid.filter(r => r.murid_id === m.id);
    rels.forEach(function(r) {
      const ortuId = r.ortu_id || r.user_id;
      const o = ortu.find(x => x.id === ortuId);
      if (o && o.no_hp && !seen.has(o.no_hp)) {
        seen.add(o.no_hp);
        phones.push(o.no_hp);
      }
    });
  });

  // Also add guru phones if target matches
  if (target === 'all') {
    guru.forEach(function(g) {
      if (g.no_hp && !seen.has(g.no_hp)) {
        seen.add(g.no_hp);
        phones.push(g.no_hp);
      }
    });
  }

  return phones;
};

Pages._formAddContact = function() {
  const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]');
  const murid = JSON.parse(localStorage.getItem('mops_murid') || '[]');
  const ortu = JSON.parse(localStorage.getItem('mops_ortu') || '[]');
  const ortuMurid = JSON.parse(localStorage.getItem('mops_ortu_murid') || '[]');

  openModal('Kelola Kontak WA Wali Murid', `
    <div class="space-y-4">
      <p class="text-sm text-gray-500">Untuk menambahkan kontak WA wali murid, silakan edit data orang tua pada menu <strong>Data Siswa > Edit > Data Orang Tua</strong> dan isi kolom <strong>No. HP</strong>.</p>
      <p class="text-sm text-gray-500">Atau import data kontak dari file CSV/Excel melalui menu <strong>Import EMIS 4.0</strong>.</p>
      <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 class="font-bold text-sm text-yellow-800 mb-2">Format Import Kontak WA</h4>
        <p class="text-xs text-yellow-700">File CSV dengan kolom: <code>nama_ortu, no_hp, nama_murid, kelas</code></p>
        <p class="text-xs text-yellow-700 mt-1">Contoh: <code>Budi Santoso, 08123456789, Ahmad Ali, 1A</code></p>
      </div>
      <div class="form-group">
        <label class="form-label">Import dari CSV</label>
        <input type="file" accept=".csv" class="form-input" onchange="Pages._importContactCSV(event)">
      </div>
    </div>
    <div class="flex justify-end mt-4 pt-4 border-t">
      <button type="button" class="btn btn-outline" onclick="closeModal()">Tutup</button>
    </div>
  `);
};

Pages._editContactsKelas = function(kelasId) {
  const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]');
  const murid = JSON.parse(localStorage.getItem('mops_murid') || '[]');
  const ortu = JSON.parse(localStorage.getItem('mops_ortu') || '[]');
  const ortuMurid = JSON.parse(localStorage.getItem('mops_ortu_murid') || '[]');

  const k = kelas.find(x => x.id === kelasId);
  const muridKelas = murid.filter(m => m.kelas_id === kelasId);

  const rows = muridKelas.map(m => {
    const rels = ortuMurid.filter(r => r.murid_id === m.id);
    let noHp = '';
    let ortuId = '';
    rels.forEach(r => {
      const o = ortu.find(x => x.id === (r.ortu_id || r.user_id));
      if (o && o.no_hp) { noHp = o.no_hp; ortuId = o.id; }
    });
    return `<tr>
      <td class="text-sm">${m.nama_lengkap}</td>
      <td><input type="text" class="form-input text-sm py-1" value="${noHp}" placeholder="08123456789" id="hp_${m.id}" data-ortu-id="${ortuId}" data-murid-id="${m.id}"></td>
      <td><button class="btn btn-sm btn-primary" onclick="Pages._saveContactHP('${m.id}')">Simpan</button></td>
    </tr>`;
  }).join('');

  openModal(`Kontak WA Kelas ${k?.nama_kelas || kelasId}`, `
    <div class="table-container" style="max-height:400px;overflow-y:auto">
      <table>
        <thead><tr><th>Nama Murid</th><th>No. HP Wali</th><th>Aksi</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="flex justify-end mt-4 pt-4 border-t">
      <button type="button" class="btn btn-outline" onclick="closeModal()">Tutup</button>
    </div>
  `);
};

Pages._saveContactHP = function(muridId) {
  const input = document.getElementById('hp_' + muridId);
  if (!input) return;
  const hp = input.value.trim();
  const ortuId = input.dataset.ortuId;

  if (!hp) {
    showToast('error', 'Nomor HP tidak boleh kosong');
    return;
  }

  let ortu = JSON.parse(localStorage.getItem('mops_ortu') || '[]');

  if (ortuId) {
    const idx = ortu.findIndex(x => x.id === ortuId);
    if (idx !== -1) {
      ortu[idx].no_hp = hp;
      localStorage.setItem('mops_ortu', JSON.stringify(ortu));
    }
  } else {
    // Create new ortu entry
    const newOrtu = {
      id: 'ortu_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      nama_lengkap: 'Wali Murid',
      no_hp: hp,
      created_at: new Date().toISOString(),
    };
    ortu.push(newOrtu);
    localStorage.setItem('mops_ortu', JSON.stringify(ortu));

    // Link to murid
    let ortuMurid = JSON.parse(localStorage.getItem('mops_ortu_murid') || '[]');
    ortuMurid.push({ ortu_id: newOrtu.id, murid_id: muridId });
    localStorage.setItem('mops_ortu_murid', JSON.stringify(ortuMurid));
  }

  showToast('success', 'Nomor HP tersimpan');
};

Pages._importContactCSV = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const lines = e.target.result.split('\n').filter(l => l.trim());
      let imported = 0;
      let ortu = JSON.parse(localStorage.getItem('mops_ortu') || '[]');
      let ortuMurid = JSON.parse(localStorage.getItem('mops_ortu_murid') || '[]');
      const murid = JSON.parse(localStorage.getItem('mops_murid') || '[]');
      const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]');

      // Skip header
      const startIdx = lines[0].toLowerCase().includes('nama') ? 1 : 0;

      for (let i = startIdx; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        if (parts.length < 3) continue;

        const [namaOrtu, noHp, namaMurid, kelasName] = parts;
        if (!noHp || noHp.length < 8) continue;

        // Find murid by name and kelas
        const kelasEntry = kelas.find(k => k.nama_kelas === kelasName);
        let muridEntry = null;
        if (kelasEntry) {
          muridEntry = murid.find(m => m.nama_lengkap === namaMurid && m.kelas_id === kelasEntry.id);
        }
        if (!muridEntry) {
          muridEntry = murid.find(m => m.nama_lengkap === namaMurid);
        }

        // Check if ortu with this phone already exists
        const existing = ortu.find(o => o.no_hp === noHp);
        if (existing) {
          // Link to murid if found
          if (muridEntry) {
            const alreadyLinked = ortuMurid.some(r => r.ortu_id === existing.id && r.murid_id === muridEntry.id);
            if (!alreadyLinked) {
              ortuMurid.push({ ortu_id: existing.id, murid_id: muridEntry.id });
            }
          }
        } else {
          const newOrtu = {
            id: 'ortu_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            nama_lengkap: namaOrtu || 'Wali Murid',
            no_hp: noHp,
            created_at: new Date().toISOString(),
          };
          ortu.push(newOrtu);
          if (muridEntry) {
            ortuMurid.push({ ortu_id: newOrtu.id, murid_id: muridEntry.id });
          }
        }
        imported++;
      }

      localStorage.setItem('mops_ortu', JSON.stringify(ortu));
      localStorage.setItem('mops_ortu_murid', JSON.stringify(ortuMurid));
      closeModal();
      showToast('success', `${imported} kontak berhasil di-import`);
      Pages.renderPengumuman();
    } catch (err) {
      showToast('error', 'Gagal import: ' + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
};
