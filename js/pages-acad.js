// ============================================
// MADRASAHOPS - ACADEMIC PAGES
// (Jadwal, Absensi, Kalender, Penilaian, Kurikulum)
// ============================================

// ========== JADWAL PELAJARAN ==========
Pages.renderJadwal = function() {
  const page = document.getElementById('activePage');
  const jadwal = JSON.parse(localStorage.getItem('mops_jadwal') || '[]');
  const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]');
  const mapel = JSON.parse(localStorage.getItem('mops_mata_pelajaran') || '[]');
  const guru = JSON.parse(localStorage.getItem('mops_guru') || '[]');
  const kelasId = kelas[0]?.id || '';
  const filtered = jadwal.filter(j => j.kelas_id === kelasId);

  page.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
      <select id="jadwalKelas" class="form-select" onchange="Pages.renderJadwal()">${kelas.map(k => `<option value="${k.id}" ${k.id===kelasId?'selected':''}>${k.nama_kelas}</option>`).join('')}</select>
      <button class="btn btn-primary" onclick="Pages._formJadwal()">+ Tambah Jadwal</button>
    </div>
    <div class="card"><div class="table-container overflow-x-auto"><table class="schedule-table">
      <thead><tr><th>Jam</th>${HARI.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${TIME_SLOTS.map(ts => `<tr>
        <td class="text-center font-medium"><div class="text-xs">${ts.jam_ke}</div><div class="text-[10px] text-gray-400">${ts.mulai}-${ts.selesai}</div></td>
        ${HARI.map(hari => {
          const j = filtered.find(x => x.hari === hari && x.jam_ke === ts.jam_ke);
          if (j) {
            const mp = mapel.find(m => m.id === j.mata_pelajaran_id);
            const gr = guru.find(g => g.id === j.guru_id);
            return `<td class="schedule-cell cursor-pointer" onclick="Pages._formJadwal('${j.id}')"><div class="mapel-name">${mp?.nama_mapel||'-'}</div><div class="guru-name">${gr?.nama_lengkap||'-'}</div><div class="ruang-name">${j.ruang||''}</div></td>`;
          }
          return `<td class="schedule-cell cursor-pointer" style="background:#f9fafb" onclick="Pages._formJadwal(null,'${hari}',${ts.jam_ke})"><span class="text-gray-300 text-xs">+</span></td>`;
        }).join('')}
      </tr>`).join('')}</tbody>
    </table></div></div>`;
};

Pages._formJadwal = function(id = null, hari = '', jamKe = 1) {
  const j = id ? JSON.parse(localStorage.getItem('mops_jadwal') || '[]').find(x => x.id === id) : null;
  const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]');
  const mapel = JSON.parse(localStorage.getItem('mops_mata_pelajaran') || '[]');
  const guru = JSON.parse(localStorage.getItem('mops_guru') || '[]');
  openModal(j ? 'Edit Jadwal' : 'Tambah Jadwal', `<form onsubmit="Pages._saveJadwal(event,'${id||''}')"><div class="grid grid-cols-2 gap-4">
    <div class="form-group"><label class="form-label">Hari *</label><select class="form-select" name="hari" required>${HARI.map(h => `<option value="${h}" ${(j?.hari||hari)===h?'selected':''}>${h}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Jam Ke *</label><select class="form-select" name="jam_ke" required>${TIME_SLOTS.map(t => `<option value="${t.jam_ke}" ${(j?.jam_ke||jamKe)===t.jam_ke?'selected':''}>${t.jam_ke} (${t.mulai}-${t.selesai})</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Kelas *</label><select class="form-select" name="kelas_id" required><option value="">Pilih</option>${kelas.map(k => `<option value="${k.id}" ${j?.kelas_id===k.id?'selected':''}>${k.nama_kelas}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Mapel *</label><select class="form-select" name="mata_pelajaran_id" required><option value="">Pilih</option>${mapel.map(m => `<option value="${m.id}" ${j?.mata_pelajaran_id===m.id?'selected':''}>${m.nama_mapel}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Guru</label><select class="form-select" name="guru_id"><option value="">Pilih</option>${guru.map(g => `<option value="${g.id}" ${j?.guru_id===g.id?'selected':''}>${g.nama_lengkap}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Ruang</label><input type="text" class="form-input" name="ruang" value="${j?.ruang||''}"></div>
  </div><div class="flex justify-end gap-2 mt-4 pt-4 border-t"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button type="submit" class="btn btn-primary">Simpan</button></div></form>`);
};

Pages._saveJadwal = async function(e, id) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  data.jam_ke = parseInt(data.jam_ke);
  const ts = TIME_SLOTS.find(t => t.jam_ke === data.jam_ke);
  if (ts) { data.jam_mulai = ts.mulai; data.jam_selesai = ts.selesai; }
  data.tahun_pelajaran = '2025/2026';
  if (id) { await DB.update('jadwal', id, data); showToast('success', 'Jadwal diperbarui'); }
  else { data.madrasah_id = Auth.currentUser?.madrasah_id || 'mad_001'; await DB.insert('jadwal', data); showToast('success', 'Jadwal ditambahkan'); }
  Realtime.broadcast('data_changed', 'jadwal');
  closeModal(); Pages.renderJadwal();
};

// ========== ABSENSI SISWA ==========
Pages.renderAbsensi = function() {
  const page = document.getElementById('activePage');
  const user = Auth.currentUser;
  const role = user?.role;
  const isReadOnly = role === 'ortu';
  const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]');
  const today = new Date().toISOString().split('T')[0];
  const kelasId = kelas[0]?.id || '';
  const murid = JSON.parse(localStorage.getItem('mops_murid') || '[]').filter(m => m.kelas_id === kelasId && m.status_aktif);
  const absensi = JSON.parse(localStorage.getItem('mops_absensi') || '[]');

  const header = isReadOnly
    ? `<div class="flex items-center gap-3 mb-4">
        <select id="absensiKelas" class="form-select" onchange="Pages.renderAbsensi()">${kelas.map(k => `<option value="${k.id}" ${k.id===kelasId?'selected':''}>${k.nama_kelas}</option>`).join('')}</select>
        <input type="date" id="absensiTanggal" class="form-input" value="${today}">
        <span class="badge badge-blue">Mode Lihat Saja</span>
      </div>`
    : `<div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-3">
          <select id="absensiKelas" class="form-select" onchange="Pages.renderAbsensi()">${kelas.map(k => `<option value="${k.id}" ${k.id===kelasId?'selected':''}>${k.nama_kelas}</option>`).join('')}</select>
          <input type="date" id="absensiTanggal" class="form-input" value="${today}">
        </div>
        <button class="btn btn-primary" onclick="Pages._saveAbsensi()">Simpan Absensi</button>
      </div>`;

  page.innerHTML = `
    ${header}
    <div class="card"><div class="table-container"><table>
      <thead><tr><th>No</th><th>Nama Siswa</th><th>Status</th>${isReadOnly ? '' : '<th>Keterangan</th>'}</tr></thead>
      <tbody>${murid.map((m, i) => {
        const existing = absensi.find(a => a.murid_id === m.id && a.tanggal === today);
        const statusBadge = existing ? `<span class="badge badge-${existing.status==='Hadir'?'green':existing.status==='Izin'?'yellow':existing.status==='Sakit'?'blue':'red'}">${existing.status}</span>` : '<span class="text-gray-300">-</span>';
        if (isReadOnly) {
          return `<tr><td>${i+1}</td><td><div class="flex items-center gap-2"><div class="avatar avatar-sm">${Utils.getInitials(m.nama_lengkap)}</div><span class="font-medium text-sm">${m.nama_lengkap}</span></div></td><td>${statusBadge}</td></tr>`;
        }
        return `<tr><td>${i+1}</td><td><div class="flex items-center gap-2"><div class="avatar avatar-sm">${Utils.getInitials(m.nama_lengkap)}</div><span class="font-medium text-sm">${m.nama_lengkap}</span></div></td>
          <td><div class="flex gap-1 flex-wrap">${ABSENSI_STATUS.map(s => `<button class="absensi-btn ${s.value.toLowerCase()} ${existing?.status===s.value?'active':''}" onclick="Pages._setAbs('${m.id}','${s.value}',this)">${s.value}</button>`).join('')}</div></td>
          <td><input type="text" class="form-input text-sm" placeholder="Catatan..." value="${existing?.keterangan||''}" style="width:150px" data-murid="${m.id}"></td></tr>`;
      }).join('')}</tbody>
    </table></div></div>`;
  Pages._absData = {};
};

Pages._absData = {};
Pages._setAbs = function(mid, status, btn) {
  Pages._absData[mid] = Pages._absData[mid] || {};
  Pages._absData[mid].status = status;
  btn.closest('tr').querySelectorAll('.absensi-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
};

Pages._saveAbsensi = async function() {
  const today = document.getElementById('absensiTanggal')?.value || new Date().toISOString().split('T')[0];
  const kelasId = document.getElementById('absensiKelas')?.value;
  const existing = JSON.parse(localStorage.getItem('mops_absensi') || '[]');
  for (const [mid, val] of Object.entries(Pages._absData)) {
    if (!val.status) continue;
    const keteranganInput = document.querySelector(`input[data-murid="${mid}"]`);
    const keterangan = keteranganInput ? keteranganInput.value.trim() : (val.keterangan || '');
    const idx = existing.findIndex(a => a.murid_id === mid && a.tanggal === today);
    const rec = { murid_id: mid, kelas_id: kelasId, tanggal: today, status: val.status, keterangan, guru_id: Auth.currentUser?.id, madrasah_id: Auth.currentUser?.madrasah_id || 'mad_001' };
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...rec };
      await DB.update('absensi', existing[idx].id, rec).catch(() => {});
    } else {
      const newRec = { id: Utils.generateId(), ...rec, created_at: new Date().toISOString() };
      existing.push(newRec);
      await DB.insert('absensi', newRec).catch(() => {});
    }
  }
  localStorage.setItem('mops_absensi', JSON.stringify(existing));
  Pages._absData = {};
  Realtime.broadcast('data_changed', 'absensi');
  showToast('success', 'Absensi berhasil disimpan');
};

// ========== ABSENSI GURU ==========
Pages.renderAbsensiGuru = function() {
  const page = document.getElementById('activePage');
  const user = Auth.currentUser;
  const isAdmin = Auth.isSuperAdmin();
  const guru = JSON.parse(localStorage.getItem('mops_guru') || '[]').filter(g => g.status_guru === 'Aktif');
  const absGuru = JSON.parse(localStorage.getItem('mops_absensi_guru') || '[]');
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  if (isAdmin) {
    // ADMIN VIEW — lihat semua absensi guru hari ini
    const todayAbs = absGuru.filter(a => a.tanggal === today);
    page.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 class="font-bold text-lg">Absensi Guru — ${Utils.formatDate(today)}</h3>
          <p class="text-sm text-gray-500">${todayAbs.length}/${guru.length} guru sudah absen hari ini</p>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-outline" onclick="Pages._exportAbsGuru()"><svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>Export</button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stat-grid">
        <div class="stat-card green"><div class="stat-value text-green-600">${todayAbs.filter(a=>a.jam_masuk).length}</div><div class="stat-label">Sudah Absen Masuk</div></div>
        <div class="stat-card blue"><div class="stat-value text-blue-600">${todayAbs.filter(a=>a.jam_keluar).length}</div><div class="stat-label">Sudah Absen Pulang</div></div>
        <div class="stat-card yellow"><div class="stat-value text-yellow-600">${guru.length - todayAbs.filter(a=>a.jam_masuk).length}</div><div class="stat-label">Belum Absen</div></div>
        <div class="stat-card purple"><div class="stat-value text-purple-600">${todayAbs.filter(a=>a.status==='Terlambat').length}</div><div class="stat-label">Terlambat</div></div>
      </div>

      <div class="card">
        <div class="card-header"><h3 class="font-bold">Daftar Kehadiran Guru</h3></div>
        <div class="table-container">
          <table>
            <thead><tr><th>No</th><th>Guru</th><th>Mata Pelajaran</th><th>Jam Masuk</th><th>Jam Pulang</th><th>Status</th><th>Lokasi</th><th>Foto</th></tr></thead>
            <tbody>
              ${guru.map((g, i) => {
                const a = todayAbs.find(x => x.guru_table_id === g.id || x.guru_id === g.id || x.nama_guru === g.nama_lengkap);
                const statusBadge = a?.status === 'Hadir' ? 'badge-green' : a?.status === 'Terlambat' ? 'badge-yellow' : a?.status === 'Izin' ? 'badge-blue' : a?.status === 'Sakit' ? 'badge-purple' : 'badge-red';
                return `<tr>
                  <td>${i+1}</td>
                  <td><div class="flex items-center gap-2">
                    ${a?.foto_selfie ? `<img src="${a.foto_selfie}" class="w-8 h-8 rounded-full object-cover border-2 border-green-400">` : `<div class="avatar avatar-sm">${Utils.getInitials(g.nama_lengkap)}</div>`}
                    <div><div class="font-medium text-sm">${g.nama_lengkap}</div><div class="text-xs text-gray-400">${g.nip||g.nuptk||'-'}</div></div>
                  </div></td>
                  <td class="text-sm">${g.mata_pelajaran||'-'}</td>
                  <td class="text-sm font-mono">${a?.jam_masuk||'-'}</td>
                  <td class="text-sm font-mono">${a?.jam_keluar||'-'}</td>
                  <td><span class="badge ${statusBadge}">${a?.status||'Alpha'}</span></td>
                  <td>${a?.latitude ? `<button class="btn btn-xs btn-outline text-blue-600" onclick="Pages._showAbsLocation(${a.latitude},${a.longitude},'${g.nama_lengkap}')"><svg class="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg> Lihat</button>` : '<span class="text-xs text-gray-400">-</span>'}</td>
                  <td>${a?.foto_selfie ? `<button class="btn btn-xs btn-outline" onclick="Pages._showAbsFoto('${a.foto_selfie}','${g.nama_lengkap}')">Lihat</button>` : '<span class="text-xs text-gray-400">-</span>'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  } else {
    // GURU VIEW — selfie absen
    const myAbs = absGuru.find(a => a.guru_id === user.id && a.tanggal === today);
    const sudahMasuk = !!myAbs?.jam_masuk;
    const sudahPulang = !!myAbs?.jam_keluar;

    page.innerHTML = `
      <div class="max-w-lg mx-auto">
        <div class="text-center mb-6">
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-3">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <h2 class="font-bold text-xl">Absensi Guru</h2>
          <p class="text-gray-500">${Utils.formatDate(today)} • ${timeStr}</p>
        </div>

        ${sudahMasuk ? `
        <div class="card mb-4">
          <div class="card-body">
            <div class="flex items-center gap-4 mb-3">
              ${myAbs.foto_selfie ? `<img src="${myAbs.foto_selfie}" class="w-16 h-16 rounded-xl object-cover border-2 border-green-400">` : ''}
              <div>
                <div class="font-bold text-green-600">✓ Sudah Absen Masuk</div>
                <div class="text-sm text-gray-500">Jam: ${myAbs.jam_masuk}</div>
                ${myAbs.lokasi_nama ? `<div class="text-xs text-gray-400 mt-1">📍 ${myAbs.lokasi_nama}</div>` : ''}
              </div>
            </div>
          </div>
        </div>` : ''}

        <div class="card mb-4">
          <div class="card-body text-center">
            <img id="absPreview" class="w-full max-w-sm mx-auto rounded-xl mb-4 hidden">
            
            <div id="absUploadSection">
              <label class="btn btn-primary w-full py-4 text-lg font-bold cursor-pointer" for="absSelfieInput">
                <svg class="w-6 h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Ambil Foto Selfie
              </label>
              <input type="file" id="absSelfieInput" accept="image/*" capture="user" class="hidden" onchange="Pages._onSelfieCapture(event)">
              <p class="text-xs text-gray-400 mt-2">Kamera depan HP akan terbuka otomatis</p>
            </div>

            <div id="absRetakeControls" class="hidden">
              <div class="text-sm text-gray-500 mb-3">Foto berhasil diambil. Pastikan wajah terlihat jelas.</div>
              <button class="btn btn-outline w-full" onclick="Pages._retakeSelfie()">Foto Ulang</button>
            </div>
          </div>
        </div>

        <div id="absLocation" class="card mb-4 hidden">
          <div class="card-body">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div>
                <div class="font-medium text-sm" id="absLocName">Mendapatkan lokasi...</div>
                <div class="text-xs text-gray-400" id="absLocCoords">-</div>
              </div>
            </div>
          </div>
        </div>

        <div id="absSubmitSection" class="hidden space-y-3">
          <div class="form-group">
            <label class="form-label font-bold">Keterangan</label>
            <select id="absKeterangan" class="form-select">
              <option value="Hadir">Hadir</option>
              <option value="Izin">Izin</option>
              <option value="Sakit">Sakit</option>
              <option value="Tugas Dinas">Tugas Dinas</option>
            </select>
          </div>
          <button class="btn btn-primary w-full py-4 text-lg font-bold" onclick="Pages._submitAbsGuru('${sudahMasuk?'keluar':'masuk'}')">
            ${sudahMasuk ? '.Absen Pulang' : 'Absen Masuk'}
          </button>
        </div>

        ${sudahMasuk && !sudahPulang ? `
        <div id="absPulangSection" class="mt-4">
          <label class="btn btn-warning w-full py-3 cursor-pointer" for="absPulangInput">
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Absen Pulang (Selfie)
          </label>
          <input type="file" id="absPulangInput" accept="image/*" capture="user" class="hidden" onchange="Pages._onSelfieCapture(event);Pages._absMode='keluar';">
        </div>` : ''}

        ${sudahPulang ? `
        <div class="card">
          <div class="card-body text-center">
            <div class="text-green-600 font-bold text-lg">✓ Sudah Absen Pulang</div>
            <div class="text-sm text-gray-500">Jam: ${myAbs.jam_keluar}</div>
          </div>
        </div>` : ''}
      </div>`;

    Pages._capturedSelfie = null;
    Pages._capturedLocation = null;
    Pages._absMode = sudahMasuk ? 'keluar' : 'masuk';
  }
};

// ========== ABSENSI GURU - CAMERA & GPS ==========
Pages._onSelfieCapture = function(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(ev) {
    Pages._capturedSelfie = ev.target.result;
    document.getElementById('absPreview').src = ev.target.result;
    document.getElementById('absPreview').classList.remove('hidden');
    document.getElementById('absUploadSection').classList.add('hidden');
    document.getElementById('absRetakeControls').classList.remove('hidden');
    document.getElementById('absSubmitSection').classList.remove('hidden');
  };
  reader.readAsDataURL(file);

  // Mulai ambil lokasi
  Pages._getAbsLocation();
};

Pages._retakeSelfie = function() {
  Pages._capturedSelfie = null;
  document.getElementById('absPreview').classList.add('hidden');
  document.getElementById('absRetakeControls').classList.add('hidden');
  document.getElementById('absSubmitSection').classList.add('hidden');
  document.getElementById('absUploadSection').classList.remove('hidden');
  document.getElementById('absSelfieInput').value = '';
};

Pages._getAbsLocation = function() {
  const locName = document.getElementById('absLocName');
  const locCoords = document.getElementById('absLocCoords');
  const locCard = document.getElementById('absLocation');
  
  locCard.classList.remove('hidden');
  locName.textContent = 'Mendapatkan lokasi GPS...';
  locCoords.textContent = 'Mohon tunggu...';

  if (!navigator.geolocation) {
    locName.textContent = 'GPS tidak didukung browser ini';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const acc = Math.round(pos.coords.accuracy);
      Pages._capturedLocation = { latitude: lat, longitude: lng, accuracy: acc };
      locCoords.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)} • Akurasi: ${acc}m`;
      
      // Reverse geocode via Nominatim
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id`)
        .then(r => r.json())
        .then(data => {
          const addr = data.display_name || 'Lokasi tidak diketahui';
          locName.textContent = addr;
        })
        .catch(() => { locName.textContent = 'Lokasi GPS ditemukan'; });
    },
    (err) => {
      locName.textContent = 'Gagal mendapatkan lokasi: ' + err.message;
      locCoords.textContent = 'Anda bisa tetap absen tanpa lokasi';
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
  );
};

Pages._submitAbsGuru = async function(tipe) {
  const user = Auth.currentUser;
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const timeNow = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const keterangan = document.getElementById('absKeterangan')?.value || 'Hadir';

  let absGuru = JSON.parse(localStorage.getItem('mops_absensi_guru') || '[]');
  let existing = absGuru.find(a => a.guru_id === user.id && a.tanggal === today);

  if (!existing) {
    const guruList = JSON.parse(localStorage.getItem('mops_guru') || '[]');
    const guruRec = guruList.find(g => g.nama_lengkap === user.nama_lengkap);
    existing = {
      id: 'absg_' + Date.now(),
      guru_id: user.id,
      guru_table_id: guruRec ? guruRec.id : null,
      nama_guru: user.nama_lengkap,
      tanggal: today,
      madrasah_id: user.madrasah_id || 'mad_001',
    };
    absGuru.push(existing);
  }

  if (tipe === 'masuk') {
    existing.jam_masuk = timeNow;
    existing.foto_masuk = Pages._capturedSelfie;
    existing.latitude_masuk = Pages._capturedLocation?.latitude || null;
    existing.longitude_masuk = Pages._capturedLocation?.longitude || null;
    existing.akurasi_masuk = Pages._capturedLocation?.accuracy || null;
    existing.lokasi_nama = document.getElementById('absLocName')?.textContent || '';
    
    // Deteksi keterlambatan (jam 07:00)
    const hour = now.getHours();
    const minute = now.getMinutes();
    if (hour > 7 || (hour === 7 && minute > 0)) {
      existing.status = 'Terlambat';
    } else {
      existing.status = keterangan;
    }
  } else {
    existing.jam_keluar = timeNow;
    existing.foto_keluar = Pages._capturedSelfie;
    existing.latitude_keluar = Pages._capturedLocation?.latitude || null;
    existing.longitude_keluar = Pages._capturedLocation?.longitude || null;
  }

  localStorage.setItem('mops_absensi_guru', JSON.stringify(absGuru));
  DB.insert('absensi_guru', existing).catch(() => {});
  Realtime.broadcast('data_changed', 'absensi_guru');

  showToast('success', tipe === 'masuk' ? 'Absen masuk berhasil! ✓' : 'Absen pulang berhasil! ✓');
  Pages.renderAbsensiGuru();
};

Pages._showAbsFoto = function(foto, nama) {
  openModal('Foto Selfie — ' + nama, `<img src="${foto}" class="w-full rounded-xl">`);
};

Pages._showAbsLocation = function(lat, lng, nama) {
  openModal('Lokasi — ' + nama, `
    <div class="mb-3 text-sm text-gray-600">${lat.toFixed(6)}, ${lng.toFixed(6)}</div>
    <div class="rounded-xl overflow-hidden border" style="height:400px">
      <iframe src="https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}" style="width:100%;height:100%;border:none"></iframe>
    </div>
    <div class="mt-3 text-center"><a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}" target="_blank" class="text-blue-600 underline text-sm">Buka di OpenStreetMap</a></div>
  `);
};

Pages._exportAbsGuru = function() {
  const absGuru = JSON.parse(localStorage.getItem('mops_absensi_guru') || '[]');
  const today = new Date().toISOString().split('T')[0];
  const todayAbs = absGuru.filter(a => a.tanggal === today);
  const guru = JSON.parse(localStorage.getItem('mops_guru') || '[]');
  
  const data = todayAbs.map(a => {
    const g = guru.find(x => x.id === a.guru_id);
    return {
      'Nama Guru': a.nama_guru || g?.nama_lengkap || '',
      'NIP': g?.nip || '',
      'Status': a.status || '',
      'Jam Masuk': a.jam_masuk || '',
      'Jam Pulang': a.jam_keluar || '',
      'Lokasi': a.lokasi_nama || '',
    };
  });
  
  Utils.downloadCSV(data, `absensi_guru_${today}.csv`);
  showToast('success', 'Export absensi guru berhasil');
};

// ========== KALENDER ==========
Pages.renderKalender = function() {
  const page = document.getElementById('activePage');
  const user = Auth.currentUser;
  const role = user?.role;
  const canEdit = Auth.isSuperAdmin();
  const kalender = JSON.parse(localStorage.getItem('mops_kalender') || '[]');
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  let html = `<div class="mb-4 flex items-center justify-between"><h3 class="font-bold text-lg">${monthName}</h3>${canEdit ? '<button class="btn btn-primary" onclick="Pages._formKalender()">+ Tambah Event</button>' : ''}</div>`;
  html += '<div class="calendar-grid">';
  ['Min','Sen','Sel','Rab','Kam','Jum','Sab'].forEach(d => html += `<div class="calendar-day header">${d}</div>`);
  for (let i = 0; i < firstDay; i++) html += '<div class="calendar-day"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const events = kalender.filter(k => ds >= k.tanggal_mulai && ds <= (k.tanggal_selesai || k.tanggal_mulai));
    html += `<div class="calendar-day ${d===now.getDate()?'today':''}"><div class="font-medium text-sm">${d}</div>${events.map(e => `<div class="calendar-event" style="background:${e.warna||'#10B981'}" title="${e.judul}">${e.judul.substring(0,12)}</div>`).join('')}</div>`;
  }
  html += '</div>';

  html += '<div class="mt-6"><h4 class="font-bold mb-3">Event Mendatang</h4><div class="space-y-2">';
  const upcoming = kalender.filter(k => k.tanggal_mulai >= new Date().toISOString().split('T')[0]).sort((a,b) => a.tanggal_mulai.localeCompare(b.tanggal_mulai));
  upcoming.forEach(e => {
    html += `<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><div class="w-3 h-3 rounded-full" style="background:${e.warna||'#10B981'}"></div><div class="flex-1"><div class="font-medium text-sm">${e.judul}</div><div class="text-xs text-gray-400">${Utils.formatDate(e.tanggal_mulai)}${e.tanggal_selesai?' - '+Utils.formatDate(e.tanggal_selesai):''}</div></div><span class="badge badge-${e.kategori==='Ujian'?'yellow':e.kategori==='Libur'?'red':'blue'}">${e.kategori}</span>${canEdit ? `<button class="btn btn-sm btn-outline text-red-500" onclick="Pages._deleteKalender('${e.id}')">Hapus</button>` : ''}</div>`;
  });
  if (!upcoming.length) html += '<p class="text-gray-400 text-sm">Tidak ada event mendatang</p>';
  html += '</div></div>';
  page.innerHTML = html;
};

Pages._formKalender = function() {
  openModal('Tambah Event', `<form onsubmit="Pages._saveKalender(event)"><div class="grid grid-cols-2 gap-4">
    <div class="form-group col-span-2"><label class="form-label">Judul *</label><input type="text" class="form-input" name="judul" required></div>
    <div class="form-group"><label class="form-label">Tanggal Mulai *</label><input type="date" class="form-input" name="tanggal_mulai" required></div>
    <div class="form-group"><label class="form-label">Tanggal Selesai</label><input type="date" class="form-input" name="tanggal_selesai"></div>
    <div class="form-group"><label class="form-label">Kategori</label><select class="form-select" name="kategori">${KALENDER_KATEGORI.map(k => `<option value="${k.value}">${k.value}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Warna</label><input type="color" class="form-input h-10" name="warna" value="#10B981"></div>
  </div><div class="flex justify-end gap-2 mt-4 pt-4 border-t"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button type="submit" class="btn btn-primary">Simpan</button></div></form>`);
};

Pages._saveKalender = async function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  data.tahun_pelajaran = '2025/2026'; data.madrasah_id = Auth.currentUser?.madrasah_id || 'mad_001';
  await DB.insert('kalender', data);
  Realtime.broadcast('data_changed', 'kalender');
  closeModal(); showToast('success', 'Event ditambahkan'); Pages.renderKalender();
};

Pages._deleteKalender = async function(id) {
  if (!Utils.confirm('Hapus event ini?')) return;
  await DB.delete('kalender', id);
  Realtime.broadcast('data_changed', 'kalender');
  showToast('success', 'Event dihapus'); Pages.renderKalender();
};

// ========== PENILAIAN ==========
Pages.renderPenilaian = function() {
  const page = document.getElementById('activePage');
  const user = Auth.currentUser;
  const role = user?.role;
  const isReadOnly = role === 'ortu';
  const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]');
  const mapel = JSON.parse(localStorage.getItem('mops_mata_pelajaran') || '[]');
  const kelasId = kelas[0]?.id || '';
  const mapelId = mapel[0]?.id || '';
  const murid = JSON.parse(localStorage.getItem('mops_murid') || '[]').filter(m => m.kelas_id === kelasId && m.status_aktif);
  const penilaian = JSON.parse(localStorage.getItem('mops_penilaian') || '[]');
  const jenisNilai = ['PH1','PH2','PH3','PH4','PTS','PAS'];

  const header = isReadOnly
    ? `<div class="flex flex-wrap items-center gap-3 mb-4">
        <span class="badge badge-blue">Mode Lihat Saja</span>
        <select id="penKelas" class="form-select" onchange="Pages.renderPenilaian()">${kelas.map(k => `<option value="${k.id}" ${k.id===kelasId?'selected':''}>${k.nama_kelas}</option>`).join('')}</select>
        <select id="penMapel" class="form-select" onchange="Pages.renderPenilaian()">${mapel.map(m => `<option value="${m.id}" ${m.id===mapelId?'selected':''}>${m.nama_mapel}</option>`).join('')}</select>
        <select id="penJenis" class="form-select" onchange="Pages.renderPenilaian()">${jenisNilai.map(j => `<option value="${j}">${j}</option>`).join('')}</select>
      </div>`
    : `<div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-3">
          <select id="penKelas" class="form-select" onchange="Pages.renderPenilaian()">${kelas.map(k => `<option value="${k.id}" ${k.id===kelasId?'selected':''}>${k.nama_kelas}</option>`).join('')}</select>
          <select id="penMapel" class="form-select" onchange="Pages.renderPenilaian()">${mapel.map(m => `<option value="${m.id}" ${m.id===mapelId?'selected':''}>${m.nama_mapel}</option>`).join('')}</select>
          <select id="penJenis" class="form-select" onchange="Pages.renderPenilaian()">${jenisNilai.map(j => `<option value="${j}">${j}</option>`).join('')}</select>
        </div>
        <button class="btn btn-primary" onclick="Pages._savePenilaian()">Simpan Semua</button>
      </div>`;

  page.innerHTML = `
    ${header}
    <div class="card"><div class="table-container"><table>
      <thead><tr><th>No</th><th>Nama Siswa</th><th>Nilai</th><th>Predikat</th></tr></thead>
      <tbody>${murid.map((m, i) => {
        const existing = penilaian.find(p => p.murid_id === m.id && p.mata_pelajaran_id === mapelId && p.jenis_nilai === document.getElementById('penJenis')?.value);
        const pred = existing?.nilai ? Utils.calculatePredikat(existing.nilai) : '-';
        if (isReadOnly) {
          return `<tr><td>${i+1}</td><td class="font-medium text-sm">${m.nama_lengkap}</td><td class="font-bold">${existing?.nilai || '-'}</td><td><span class="badge badge-${Utils.getPredikatColor(pred)}">${pred}</span></td></tr>`;
        }
        return `<tr><td>${i+1}</td><td class="font-medium text-sm">${m.nama_lengkap}</td><td><input type="number" class="form-input text-sm w-20" value="${existing?.nilai||''}" min="0" max="100" data-murid="${m.id}"></td><td><span class="badge badge-${Utils.getPredikatColor(pred)}">${pred}</span></td></tr>`;
      }).join('')}</tbody>
    </table></div></div>`;
};

Pages._savePenilaian = async function() {
  const mapelId = document.getElementById('penMapel')?.value;
  const kelasId = document.getElementById('penKelas')?.value;
  const jenis = document.getElementById('penJenis')?.value;
  const existing = JSON.parse(localStorage.getItem('mops_penilaian') || '[]');
  document.querySelectorAll('#activePage tbody input[type="number"]').forEach(input => {
    const muridId = input.dataset.murid;
    const nilai = parseFloat(input.value);
    if (!nilai) return;
    const idx = existing.findIndex(p => p.murid_id === muridId && p.mata_pelajaran_id === mapelId && p.jenis_nilai === jenis);
    const rec = { murid_id: muridId, mata_pelajaran_id: mapelId, kelas_id: kelasId, jenis_nilai: jenis, nilai, tahun_pelajaran: '2025/2026', semester: 'Ganjil' };
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...rec };
      DB.update('penilaian', existing[idx].id, rec).catch(() => {});
    } else {
      const newRec = { id: Utils.generateId(), ...rec, created_at: new Date().toISOString() };
      existing.push(newRec);
      DB.insert('penilaian', newRec).catch(() => {});
    }
  });
  localStorage.setItem('mops_penilaian', JSON.stringify(existing));
  Realtime.broadcast('data_changed', 'penilaian');
  showToast('success', 'Penilaian disimpan'); Pages.renderPenilaian();
};

// ========== KURIKULUM KMA 183 ==========
Pages.renderKurikulum = function() {
  const page = document.getElementById('activePage');
  const perangkat = JSON.parse(localStorage.getItem('mops_perangkat_pembelajaran') || '[]');
  const mapel = JSON.parse(localStorage.getItem('mops_mata_pelajaran') || '[]');
  const guru = JSON.parse(localStorage.getItem('mops_guru') || '[]');

  page.innerHTML = `<div class="flex flex-wrap items-center justify-between gap-3 mb-4"><h3 class="font-bold text-lg">Perangkat Pembelajaran (KMA 183)</h3><button class="btn btn-primary" onclick="Pages._formKurikulum()">+ Tambah Perangkat</button></div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      ${perangkat.map(p => {
        const mp = mapel.find(m => m.id === p.mata_pelajaran_id);
        const gr = guru.find(g => g.id === p.guru_id);
        return `<div class="card"><div class="card-body"><div class="flex items-center justify-between mb-2"><span class="badge badge-${p.jenis==='RPP'?'blue':p.jenis==='Silabus'?'green':'purple'}">${p.jenis}</span><span class="badge ${p.is_approved?'badge-green':'badge-yellow'}">${p.is_approved?'Disetujui':'Draft'}</span></div><h4 class="font-bold text-sm mb-1">${p.judul}</h4><p class="text-xs text-gray-500">${mp?.nama_mapel||'-'} - ${gr?.nama_lengkap||'-'}</p></div></div>`;
      }).join('')}
      ${perangkat.length === 0 ? '<div class="col-span-3 text-center py-12 text-gray-400">Belum ada perangkat pembelajaran</div>' : ''}
    </div>`;
};

Pages._formKurikulum = function() {
  const mapel = JSON.parse(localStorage.getItem('mops_mata_pelajaran') || '[]');
  const guru = JSON.parse(localStorage.getItem('mops_guru') || '[]');
  openModal('Tambah Perangkat', `<form onsubmit="Pages._saveKurikulum(event)"><div class="grid grid-cols-2 gap-4">
    <div class="form-group"><label class="form-label">Jenis *</label><select class="form-select" name="jenis" required><option>RPP</option><option>Modul Ajar</option><option>Silabus</option><option>Prota</option><option>Promes</option><option>PH</option></select></div>
    <div class="form-group"><label class="form-label">Judul *</label><input type="text" class="form-input" name="judul" required></div>
    <div class="form-group"><label class="form-label">Mapel</label><select class="form-select" name="mata_pelajaran_id"><option value="">Pilih</option>${mapel.map(m => `<option value="${m.id}">${m.nama_mapel}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Guru</label><select class="form-select" name="guru_id"><option value="">Pilih</option>${guru.map(g => `<option value="${g.id}">${g.nama_lengkap}</option>`).join('')}</select></div>
  </div><div class="flex justify-end gap-2 mt-4 pt-4 border-t"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button type="submit" class="btn btn-primary">Simpan</button></div></form>`);
};

Pages._saveKurikulum = async function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  data.tahun_pelajaran = '2025/2026'; data.semester = 'Ganjil'; data.madrasah_id = Auth.currentUser?.madrasah_id || 'mad_001';
  await DB.insert('perangkat_pembelajaran', data);
  Realtime.broadcast('data_changed', 'perangkat_pembelajaran');
  closeModal(); showToast('success', 'Perangkat ditambahkan'); Pages.renderKurikulum();
};
