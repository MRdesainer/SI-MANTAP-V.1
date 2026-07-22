// ============================================
// MADRASAHOPS - FINANCE, KEPEGAWAIAN & REMAINING PAGES
// ============================================

// ========== KEPEGAWAIAN ==========
Pages.renderKepegawaian = function() {
  const page = document.getElementById('activePage');
  const guru = JSON.parse(localStorage.getItem('mops_guru') || '[]');
  const tunjangan = JSON.parse(localStorage.getItem('mops_guru_tunjangan') || '[]');
  const stats = { pns: guru.filter(g => g.status_pegawai==='PNS').length, pppk: guru.filter(g => g.status_pegawai==='PPPK').length, gty: guru.filter(g => g.status_pegawai==='GTY').length, gtt: guru.filter(g => g.status_pegawai==='GTT').length };

  page.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
      <div class="stat-card green"><div class="stat-value text-green-600">${stats.pns}</div><div class="stat-label">PNS</div></div>
      <div class="stat-card blue"><div class="stat-value text-blue-600">${stats.pppk}</div><div class="stat-label">PPPK</div></div>
      <div class="stat-card yellow"><div class="stat-value text-yellow-600">${stats.gty}</div><div class="stat-label">GTY</div></div>
      <div class="stat-card purple"><div class="stat-value text-purple-600">${stats.gtt}</div><div class="stat-label">GTT</div></div>
    </div>
    <div class="card"><div class="card-header"><h3 class="font-bold">Status PTK</h3></div><div class="table-container"><table>
      <thead><tr><th>No</th><th>Nama</th><th>NIP</th><th>NUPTK</th><th>Status</th><th>Kepegawaian</th></tr></thead>
      <tbody>${guru.map((g,i) => `<tr><td>${i+1}</td><td class="font-medium text-sm">${g.nama_lengkap}</td><td class="text-sm">${g.nip||'-'}</td><td class="text-sm">${g.nuptk||'-'}</td><td><span class="badge badge-green">${g.status_guru}</span></td><td><span class="badge badge-blue">${g.status_pegawai||'-'}</span></td></tr>`).join('')}</tbody>
    </table></div></div>`;
};

// ========== KEUANGAN BOS ==========
Pages.renderKeuangan = function() {
  const page = document.getElementById('activePage');
  const trx = JSON.parse(localStorage.getItem('mops_keuangan_transaksi') || '[]');
  const kategori = JSON.parse(localStorage.getItem('mops_keuangan_kategori') || '[]');
  const totalMasuk = trx.filter(t => t.jenis==='masuk').reduce((s,t) => s+(parseFloat(t.nominal)||0), 0);
  const totalKeluar = trx.filter(t => t.jenis==='keluar').reduce((s,t) => s+(parseFloat(t.nominal)||0), 0);

  page.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div class="stat-card green"><div class="stat-value text-green-600">${Utils.formatCurrency(totalMasuk)}</div><div class="stat-label">Total Pendapatan</div></div>
      <div class="stat-card red"><div class="stat-value text-red-600">${Utils.formatCurrency(totalKeluar)}</div><div class="stat-label">Total Belanja</div></div>
      <div class="stat-card blue"><div class="stat-value text-blue-600">${Utils.formatCurrency(totalMasuk-totalKeluar)}</div><div class="stat-label">Saldo</div></div>
    </div>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div class="flex gap-2">
        <select id="filterJenisTrx" class="form-select" onchange="Pages._filterTrx()"><option value="">Semua</option><option value="masuk">Pendapatan</option><option value="keluar">Belanja</option></select>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-outline" onclick="Utils.downloadCSV(JSON.parse(localStorage.getItem('mops_keuangan_transaksi')||'[]'),'keuangan_bos.csv');showToast('success','Export berhasil')">Export</button>
        <button class="btn btn-primary" onclick="Pages._formTransaksi()">+ Tambah Transaksi</button>
      </div>
    </div>
    <div class="card"><div class="table-container"><table>
      <thead><tr><th>Tanggal</th><th>Jenis</th><th>Kategori</th><th>Deskripsi</th><th>Sumber</th><th>Nominal</th><th>Aksi</th></tr></thead>
      <tbody id="trxTableBody">${trx.sort((a,b)=>(b.tanggal||'').localeCompare(a.tanggal||'')).map(t => {
        const kat = kategori.find(k => k.id===t.kategori_id);
        return `<tr><td class="text-sm">${Utils.formatShortDate(t.tanggal)}</td><td><span class="badge badge-${t.jenis==='masuk'?'green':'red'}">${t.jenis==='masuk'?'Masuk':'Keluar'}</span></td><td class="text-sm">${kat?.nama_kategori||'-'}</td><td class="text-sm font-medium">${t.deskripsi}</td><td><span class="badge badge-blue">${t.sumber_dana||'-'}</span></td><td class="text-sm font-bold ${t.jenis==='masuk'?'text-green-600':'text-red-600'}">${t.jenis==='masuk'?'+':'-'}${Utils.formatCurrency(t.nominal)}</td><td><button class="btn btn-sm btn-outline text-red-500" onclick="Pages._deleteTrx('${t.id}')">Hapus</button></td></tr>`;
      }).join('')}</tbody>
    </table></div></div>`;
};

Pages._filterTrx = function() {
  const jenis = document.getElementById('filterJenisTrx')?.value || '';
  let trx = JSON.parse(localStorage.getItem('mops_keuangan_transaksi') || '[]');
  if (jenis) trx = trx.filter(t => t.jenis === jenis);
  const kategori = JSON.parse(localStorage.getItem('mops_keuangan_kategori') || '[]');
  document.getElementById('trxTableBody').innerHTML = trx.sort((a,b)=>(b.tanggal||'').localeCompare(a.tanggal||'')).map(t => {
    const kat = kategori.find(k => k.id===t.kategori_id);
    return `<tr><td class="text-sm">${Utils.formatShortDate(t.tanggal)}</td><td><span class="badge badge-${t.jenis==='masuk'?'green':'red'}">${t.jenis==='masuk'?'Masuk':'Keluar'}</span></td><td class="text-sm">${kat?.nama_kategori||'-'}</td><td class="text-sm font-medium">${t.deskripsi}</td><td><span class="badge badge-blue">${t.sumber_dana||'-'}</span></td><td class="text-sm font-bold ${t.jenis==='masuk'?'text-green-600':'text-red-600'}">${t.jenis==='masuk'?'+':'-'}${Utils.formatCurrency(t.nominal)}</td><td><button class="btn btn-sm btn-outline text-red-500" onclick="Pages._deleteTrx('${t.id}')">Hapus</button></td></tr>`;
  }).join('');
};

Pages._formTransaksi = function() {
  const kategori = JSON.parse(localStorage.getItem('mops_keuangan_kategori') || '[]');
  openModal('Tambah Transaksi', `<form onsubmit="Pages._saveTrx(event)"><div class="grid grid-cols-2 gap-4">
    <div class="form-group"><label class="form-label">Tanggal *</label><input type="date" class="form-input" name="tanggal" value="${new Date().toISOString().split('T')[0]}" required></div>
    <div class="form-group"><label class="form-label">Jenis *</label><select class="form-select" name="jenis" required><option value="masuk">Pendapatan</option><option value="keluar">Belanja</option></select></div>
    <div class="form-group"><label class="form-label">Kategori</label><select class="form-select" name="kategori_id"><option value="">Pilih</option>${kategori.map(k => `<option value="${k.id}">${k.nama_kategori}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Sumber Dana</label><select class="form-select" name="sumber_dana"><option value="">Pilih</option>${KEUANGAN_SUMBER_DANA.map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>
    <div class="form-group col-span-2"><label class="form-label">Deskripsi *</label><input type="text" class="form-input" name="deskripsi" required></div>
    <div class="form-group col-span-2"><label class="form-label">Nominal *</label><input type="number" class="form-input" name="nominal" min="0" required></div>
  </div><div class="flex justify-end gap-2 mt-4 pt-4 border-t"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button type="submit" class="btn btn-primary">Simpan</button></div></form>`);
};

Pages._saveTrx = async function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  data.nominal = parseFloat(data.nominal); data.tahun_pelajaran = '2025/2026';
  data.madrasah_id = Auth.currentUser?.madrasah_id || 'mad_001';
  await DB.insert('keuangan_transaksi', data);
  closeModal(); showToast('success', 'Transaksi ditambahkan'); Realtime.broadcast('data_changed', 'keuangan_transaksi'); Pages.renderKeuangan();
};

Pages._deleteTrx = async function(id) {
  if (!Utils.confirm('Hapus transaksi ini?')) return;
  await DB.delete('keuangan_transaksi', id); showToast('success', 'Transaksi dihapus'); Realtime.broadcast('data_changed', 'keuangan_transaksi'); Pages.renderKeuangan();
};

// ========== RAPBM ==========
Pages.renderRAPBM = function() {
  const page = document.getElementById('activePage');
  page.innerHTML = `<div class="card"><div class="card-header"><h3 class="font-bold">RAPBM 2025/2026</h3></div><div class="card-body">
    <p class="text-sm text-gray-500 mb-4">Rencana Anggaran Pendapatan dan Belanja Madrasah</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div><h4 class="font-bold text-green-600 mb-3">PENDAPATAN</h4><div class="space-y-2">
        <div class="flex justify-between p-2 bg-green-50 rounded"><span class="text-sm">Dana BOS</span><span class="font-bold text-sm">${Utils.formatCurrency(900000000)}</span></div>
        <div class="flex justify-between p-2 bg-green-50 rounded"><span class="text-sm">SPP Siswa</span><span class="font-bold text-sm">${Utils.formatCurrency(270000000)}</span></div>
        <div class="flex justify-between p-2 bg-green-50 rounded"><span class="text-sm">Infaq & Donasi</span><span class="font-bold text-sm">${Utils.formatCurrency(50000000)}</span></div>
        <div class="flex justify-between p-2 bg-green-100 rounded border-t-2 border-green-500"><span class="font-bold">TOTAL</span><span class="font-bold text-green-600">${Utils.formatCurrency(1220000000)}</span></div>
      </div></div>
      <div><h4 class="font-bold text-red-600 mb-3">BELANJA</h4><div class="space-y-2">
        <div class="flex justify-between p-2 bg-red-50 rounded"><span class="text-sm">Gaji & Tunjangan</span><span class="font-bold text-sm">${Utils.formatCurrency(720000000)}</span></div>
        <div class="flex justify-between p-2 bg-red-50 rounded"><span class="text-sm">Pemeliharaan</span><span class="font-bold text-sm">${Utils.formatCurrency(100000000)}</span></div>
        <div class="flex justify-between p-2 bg-red-50 rounded"><span class="text-sm">Listrik & Air</span><span class="font-bold text-sm">${Utils.formatCurrency(60000000)}</span></div>
        <div class="flex justify-between p-2 bg-red-50 rounded"><span class="text-sm">Perlengkapan</span><span class="font-bold text-sm">${Utils.formatCurrency(80000000)}</span></div>
        <div class="flex justify-between p-2 bg-red-50 rounded"><span class="text-sm">Kegiatan Belajar</span><span class="font-bold text-sm">${Utils.formatCurrency(120000000)}</span></div>
        <div class="flex justify-between p-2 bg-red-100 rounded border-t-2 border-red-500"><span class="font-bold">TOTAL</span><span class="font-bold text-red-600">${Utils.formatCurrency(1080000000)}</span></div>
      </div></div>
    </div>
    <div class="mt-6 p-4 bg-blue-50 rounded-lg text-center"><div class="text-sm text-gray-500">SISA ANGGARAN</div><div class="text-2xl font-bold text-blue-600">${Utils.formatCurrency(140000000)}</div></div>
  </div></div>`;
};

// ========== SARANA ==========
Pages.renderSarana = function() {
  const page = document.getElementById('activePage');
  const sarana = JSON.parse(localStorage.getItem('mops_sarana') || '[]');
  const total = sarana.reduce((s,i) => s+(i.jumlah||0), 0);
  const nilai = sarana.reduce((s,i) => s+(i.nilai_perolehan||0), 0);

  page.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div class="stat-card blue"><div class="stat-value text-blue-600">${Utils.formatNumber(total)}</div><div class="stat-label">Total Barang</div></div>
      <div class="stat-card green"><div class="stat-value text-green-600">${sarana.filter(s=>s.kondisi==='Baik').length}</div><div class="stat-label">Kondisi Baik</div></div>
      <div class="stat-card purple"><div class="stat-value text-purple-600 text-lg">${Utils.formatCurrency(nilai)}</div><div class="stat-label">Nilai Perolehan</div></div>
    </div>
    <div class="flex justify-end mb-4"><button class="btn btn-primary" onclick="Pages._formSarana()">+ Tambah Barang</button></div>
    <div class="card"><div class="table-container"><table>
      <thead><tr><th>No</th><th>Nama Barang</th><th>Kategori</th><th>Jumlah</th><th>Kondisi</th><th>Lokasi</th><th>Nilai</th><th>Aksi</th></tr></thead>
      <tbody>${sarana.map((s,i) => `<tr><td>${i+1}</td><td class="font-medium text-sm">${s.nama_barang}</td><td><span class="badge badge-blue">${s.kategori}</span></td><td>${s.jumlah}</td><td><span class="badge badge-${SARANA_KONDISI.find(k=>k.value===s.kondisi)?.color||'gray'}">${s.kondisi}</span></td><td class="text-sm">${s.lokasi||'-'}</td><td class="text-sm">${Utils.formatCurrency(s.nilai_perolehan)}</td><td><div class="flex gap-1"><button class="btn btn-sm btn-outline" onclick="Pages._formSarana('${s.id}')">Edit</button><button class="btn btn-sm btn-outline text-red-500" onclick="Pages._deleteSarana('${s.id}')">Hapus</button></div></td></tr>`).join('')}</tbody>
    </table></div></div>`;
};

Pages._formSarana = function(id = null) {
  const s = id ? JSON.parse(localStorage.getItem('mops_sarana') || '[]').find(x => x.id === id) : null;
  openModal(s ? 'Edit Barang' : 'Tambah Barang', `<form onsubmit="Pages._saveSarana(event,'${id||''}')"><div class="grid grid-cols-2 gap-4">
    <div class="form-group col-span-2"><label class="form-label">Nama Barang *</label><input type="text" class="form-input" name="nama_barang" value="${s?.nama_barang||''}" required></div>
    <div class="form-group"><label class="form-label">Kategori</label><select class="form-select" name="kategori"><option>Gedung</option><option>Perlengkapan</option><option>IT</option><option>Perpustakaan</option><option>Olahraga</option><option>Lainnya</option></select></div>
    <div class="form-group"><label class="form-label">Jumlah</label><input type="number" class="form-input" name="jumlah" value="${s?.jumlah||1}" min="1"></div>
    <div class="form-group"><label class="form-label">Kondisi</label><select class="form-select" name="kondisi"><option value="Baik" ${s?.kondisi==='Baik'?'selected':''}>Baik</option><option value="Rusak Ringan" ${s?.kondisi==='Rusak Ringan'?'selected':''}>Rusak Ringan</option><option value="Rusak Berat" ${s?.kondisi==='Rusak Berat'?'selected':''}>Rusak Berat</option><option value="Hilang" ${s?.kondisi==='Hilang'?'selected':''}>Hilang</option></select></div>
    <div class="form-group"><label class="form-label">Lokasi</label><input type="text" class="form-input" name="lokasi" value="${s?.lokasi||''}"></div>
    <div class="form-group"><label class="form-label">Nilai Perolehan</label><input type="number" class="form-input" name="nilai_perolehan" value="${s?.nilai_perolehan||''}"></div>
  </div><div class="flex justify-end gap-2 mt-4 pt-4 border-t"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button type="submit" class="btn btn-primary">Simpan</button></div></form>`);
};

Pages._saveSarana = async function(e, id) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  data.jumlah = parseInt(data.jumlah)||1; data.nilai_perolehan = parseFloat(data.nilai_perolehan)||0;
  if (id) { await DB.update('sarana', id, data); showToast('success', 'Barang diperbarui'); }
  else { data.madrasah_id = Auth.currentUser?.madrasah_id || 'mad_001'; await DB.insert('sarana', data); showToast('success', 'Barang ditambahkan'); }
  Realtime.broadcast('data_changed', 'sarana');
  closeModal(); Pages.renderSarana();
};

Pages._deleteSarana = async function(id) {
  if (!Utils.confirm('Hapus barang ini?')) return;
  await DB.delete('sarana', id); showToast('success', 'Barang dihapus'); Realtime.broadcast('data_changed', 'sarana'); Pages.renderSarana();
};

// ========== LAPORAN ==========
Pages.renderLaporan = function() {
  const page = document.getElementById('activePage');
  const reports = [
    { id: 'murid', title: 'Rekapitulasi Siswa', desc: 'Jumlah siswa per kelas dan tingkat', color: 'green' },
    { id: 'guru', title: 'Data Guru & PTK', desc: 'Daftar lengkap guru dan status', color: 'blue' },
    { id: 'absensi', title: 'Laporan Absensi', desc: 'Rekap kehadiran siswa', color: 'purple' },
    { id: 'keuangan', title: 'Laporan Keuangan BOS', desc: 'Realisasi penggunaan dana', color: 'yellow' },
    { id: 'inventaris', title: 'Inventaris Aset', desc: 'Daftar seluruh aset', color: 'red' },
    { id: 'ppdb', title: 'Data PPDB', desc: 'Rekap pendaftaran siswa baru', color: 'teal' },
  ];
  page.innerHTML = `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    ${reports.map(r => `<div class="card cursor-pointer hover:shadow-lg transition-all" onclick="Pages._generateReport('${r.id}')"><div class="card-body text-center py-8">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-${r.color}-100 flex items-center justify-center"><svg class="w-8 h-8 text-${r.color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
      <h4 class="font-bold mb-1">${r.title}</h4><p class="text-xs text-gray-500">${r.desc}</p>
    </div></div>`).join('')}
  </div>`;
};

Pages._generateReport = function(type) {
  let data = [];
  let filename = '';
  switch(type) {
    case 'murid': data = JSON.parse(localStorage.getItem('mops_murid') || '[]'); filename = 'rekap_siswa.csv'; break;
    case 'guru': data = JSON.parse(localStorage.getItem('mops_guru') || '[]'); filename = 'data_guru.csv'; break;
    case 'absensi': data = JSON.parse(localStorage.getItem('mops_absensi') || '[]'); filename = 'absensi_siswa.csv'; break;
    case 'keuangan': data = JSON.parse(localStorage.getItem('mops_keuangan_transaksi') || '[]'); filename = 'keuangan_bos.csv'; break;
    case 'inventaris': data = JSON.parse(localStorage.getItem('mops_sarana') || '[]'); filename = 'inventaris.csv'; break;
    case 'ppdb': data = JSON.parse(localStorage.getItem('mops_ppdb_pendaftaran') || '[]'); filename = 'data_ppdb.csv'; break;
  }
  if (data.length === 0) return showToast('warning', 'Tidak ada data untuk diexport');
  Utils.downloadCSV(data, filename);
  showToast('success', `Laporan ${filename} berhasil diexport`);
};

// ========== PENGATURAN ==========
Pages.renderPengaturan = function() {
  const page = document.getElementById('activePage');
  const user = Auth.currentUser;
  const isAdmin = Auth.isSuperAdmin();
  const settings = JSON.parse(localStorage.getItem('mops_settings') || '{}');
  const appName = settings.appName || APP_CONFIG.appName;
  const appTagline = settings.appTagline || APP_CONFIG.tagline;
  const logoText = settings.logoText || 'MO';
  const logoColor = settings.logoColor || '#059669';
  const appLogo = settings.appLogo || '';
  const madrasahLogo = settings.madrasahLogo || '';
  const madrasahName = settings.madrasahName || 'MI Al-Hikmah';
  const madrasahNpsn = settings.madrasahNpsn || '11111111';
  const madrasahAlamat = settings.madrasahAlamat || 'Jl. Pendidikan No. 1, Kota Jakarta, DKI Jakarta';
  const madrasahJenjang = settings.madrasahJenjang || 'MI';
  const madrasahAkreditasi = settings.madrasahAkreditasi || 'A';
  const madrasahStatus = settings.madrasahStatus || 'Aktif';
  const madrasahKepala = settings.madrasahKepala || '-';
  const madrasahTelp = settings.madrasahTelp || '-';
  const madrasahEmail = settings.madrasahEmail || '-';

  const appLogoHtml = appLogo
    ? `<img src="${appLogo}" class="w-full h-full object-contain">`
    : `<span class="text-3xl font-bold text-white">${logoText}</span>`;
  const madrasahLogoHtml = madrasahLogo
    ? `<img src="${madrasahLogo}" class="w-full h-full object-contain">`
    : `<span class="text-3xl font-bold text-white">${logoText}</span>`;

  page.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="card"><div class="card-header"><h3 class="font-bold">Profil Madrasah</h3></div><div class="card-body space-y-4">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0" style="background:${logoColor}">${madrasahLogoHtml}</div>
        <div><h4 class="font-bold text-lg">${madrasahName}</h4><p class="text-sm text-gray-500">NPSN: ${madrasahNpsn}</p><p class="text-sm text-gray-500">Jenjang: ${madrasahJenjang}</p></div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="text-xs text-gray-500">Status</label><div class="badge badge-green">${madrasahStatus}</div></div>
        <div><label class="text-xs text-gray-500">Akreditasi</label><div class="badge badge-blue">${madrasahAkreditasi}</div></div>
        <div class="col-span-2"><label class="text-xs text-gray-500">Alamat</label><div class="text-sm">${madrasahAlamat}</div></div>
      </div>
    </div></div>
    <div class="card"><div class="card-header"><h3 class="font-bold">Pengguna Aktif</h3></div><div class="card-body space-y-4">
      <div class="flex items-center gap-4"><div class="avatar avatar-lg">${Utils.getInitials(user?.nama_lengkap)}</div><div><h4 class="font-bold">${user?.nama_lengkap}</h4><p class="text-sm text-gray-500">${ROLES[user?.role]?.label || user?.role}</p><p class="text-sm text-gray-400">${user?.email}</p></div></div>
      <div class="pt-4 border-t space-y-3">
        <h4 class="font-bold text-sm">Manajemen Akun</h4>
        ${Auth.isSuperAdmin() ? `
        <button class="btn btn-primary w-full" onclick="Pages._showChangePassword()">Ubah Password</button>
        <div class="text-xs text-gray-400 text-center">Hubungi admin untuk mengubah password guru/ortu</div>
        ` : `
        <div class="text-xs text-gray-400 text-center">Hubungi admin untuk mengubah password</div>
        `}
        <button class="btn btn-danger w-full" onclick="Auth.logout()">Keluar dari Sistem</button>
      </div>
    </div></div>
    <div class="card lg:col-span-2"><div class="card-header"><h3 class="font-bold">Tentang Sistem</h3></div><div class="card-body">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div class="p-3 bg-gray-50 rounded-lg"><div class="text-xs text-gray-500">Nama Aplikasi</div><div class="font-bold text-sm">${appName}</div></div>
        <div class="p-3 bg-gray-50 rounded-lg"><div class="text-xs text-gray-500">Versi</div><div class="font-bold text-sm">${APP_CONFIG.version}</div></div>
        <div class="p-3 bg-gray-50 rounded-lg"><div class="text-xs text-gray-500">Kementerian</div><div class="font-bold text-sm">Kemenag RI</div></div>
        <div class="p-3 bg-gray-50 rounded-lg"><div class="text-xs text-gray-500">Mode</div><div class="font-bold text-sm">${getDB() ? 'Online' : 'Offline'}</div></div>
      </div>
    </div></div>
    <div class="card lg:col-span-2"><div class="card-header flex items-center justify-between">
      <h3 class="font-bold">Pengaturan Bel Otomatis</h3>
      <a href="signage.html" target="_blank" class="btn btn-sm btn-primary">Buka Layar Info & Bel</a>
    </div><div class="card-body">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div class="p-3 bg-gray-50 rounded-lg text-center">
          <div class="text-xs text-gray-500">Status Bel</div>
          <div class="font-bold text-sm ${settings.bellEnabled !== false ? 'text-green-600' : 'text-red-600'}">${settings.bellEnabled !== false ? 'AKTIF' : 'NONAKTIF'}</div>
        </div>
        <div class="p-3 bg-gray-50 rounded-lg text-center">
          <div class="text-xs text-gray-500">Volume</div>
          <div class="font-bold text-sm">${Math.round((settings.bellVolume||0.7)*100)}%</div>
        </div>
        <div class="p-3 bg-gray-50 rounded-lg text-center">
          <div class="text-xs text-gray-500">Mode Senyap</div>
          <div class="font-bold text-sm ${settings.bellQuietMode ? 'text-red-600' : 'text-green-600'}">${settings.bellQuietMode ? 'AKTIF' : 'OFF'}</div>
        </div>
        <div class="p-3 bg-gray-50 rounded-lg text-center">
          <div class="text-xs text-gray-500">Tipe Suara</div>
          <div class="font-bold text-sm capitalize">${settings.bellSoundType || 'Bawaan'}</div>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-sm ${settings.bellEnabled !== false ? 'btn-danger' : 'btn-primary'}" onclick="Pages._toggleBellFromPengaturan()">
          ${settings.bellEnabled !== false ? 'Nonaktifkan Bel' : 'Aktifkan Bel'}
        </button>
        <button class="btn btn-sm btn-outline" onclick="Pages._toggleQuietFromPengaturan()">
          ${settings.bellQuietMode ? 'Matikan Mode Senyap' : 'Mode Senyap'}
        </button>
        <button class="btn btn-sm btn-outline" onclick="App.navigateTo('bell_admin')">Pengaturan Lanjutan</button>
      </div>
    </div></div>
    ${isAdmin ? `
    <div class="card lg:col-span-2"><div class="card-header"><h3 class="font-bold">Pengaturan Aplikasi</h3></div><div class="card-body">
      <form onsubmit="Pages._saveSettings(event)">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h4 class="font-bold text-sm text-gray-700 border-b pb-2">Identitas Aplikasi</h4>
            <div class="form-group">
              <label class="form-label">Nama Aplikasi</label>
              <input type="text" name="appName" class="form-input" value="${appName}">
            </div>
            <div class="form-group">
              <label class="form-label">Tagline / Keterangan</label>
              <input type="text" name="appTagline" class="form-input" value="${appTagline}">
            </div>
            <div class="form-group">
              <label class="form-label">Teks Logo (jika tidak pakai gambar)</label>
              <input type="text" name="logoText" class="form-input" value="${logoText}" maxlength="3">
            </div>
            <div class="form-group">
              <label class="form-label">Warna Latar Logo</label>
              <input type="color" name="logoColor" class="form-input h-10" value="${logoColor}">
            </div>
          </div>
          <div class="space-y-4">
            <h4 class="font-bold text-sm text-gray-700 border-b pb-2">Profil Madrasah</h4>
            <div class="form-group">
              <label class="form-label">Nama Madrasah</label>
              <input type="text" name="madrasahName" class="form-input" value="${madrasahName}">
            </div>
            <div class="form-group">
              <label class="form-label">NPSN</label>
              <input type="text" name="madrasahNpsn" class="form-input" value="${madrasahNpsn}">
            </div>
            <div class="form-group">
              <label class="form-label">Alamat Lengkap</label>
              <textarea name="madrasahAlamat" class="form-input" rows="2">${madrasahAlamat}</textarea>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="form-group">
                <label class="form-label">Jenjang</label>
                <select name="madrasahJenjang" class="form-select">
                  ${['MI','MTs','MA','MAK'].map(j => `<option ${j===madrasahJenjang?'selected':''}>${j}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Akreditasi</label>
                <select name="madrasahAkreditasi" class="form-select">
                  ${['A','B','C','D'].map(a => `<option ${a===madrasahAkreditasi?'selected':''}>${a}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Kepala Madrasah</label>
              <input type="text" name="madrasahKepala" class="form-input" value="${madrasahKepala}">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="form-group">
                <label class="form-label">Telepon</label>
                <input type="text" name="madrasahTelp" class="form-input" value="${madrasahTelp}">
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" name="madrasahEmail" class="form-input" value="${madrasahEmail}">
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t">
          <h4 class="font-bold text-sm text-gray-700 mb-4">Logo</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="text-center">
              <label class="form-label mb-2 block">Logo Aplikasi (sidebar)</label>
              <div class="relative inline-block">
                <label for="inputAppLogo" class="cursor-pointer block w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 hover:border-emerald-400 transition flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-emerald-50">
                  <div id="previewAppLogo" class="w-full h-full flex items-center justify-center">${appLogo ? `<img src="${appLogo}" class="w-full h-full object-contain">` : `<div class="text-center"><svg class="w-8 h-8 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><div class="text-xs text-gray-400 mt-1">Klik untuk upload</div>`}</div>
                </label>
                <input type="file" id="inputAppLogo" accept="image/*" class="hidden" onchange="Pages._previewLogo('appLogo', this)">
              </div>
              ${appLogo ? `<button type="button" class="btn btn-sm btn-outline text-red-500 mt-2" onclick="Pages._removeLogo('appLogo')">Hapus Logo</button>` : ''}
            </div>
            <div class="text-center">
              <label class="form-label mb-2 block">Logo Madrasah</label>
              <div class="relative inline-block">
                <label for="inputMadrasahLogo" class="cursor-pointer block w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 hover:border-emerald-400 transition flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-emerald-50">
                  <div id="previewMadrasahLogo" class="w-full h-full flex items-center justify-center">${madrasahLogo ? `<img src="${madrasahLogo}" class="w-full h-full object-contain">` : `<div class="text-center"><svg class="w-8 h-8 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><div class="text-xs text-gray-400 mt-1">Klik untuk upload</div>`}</div>
                </label>
                <input type="file" id="inputMadrasahLogo" accept="image/*" class="hidden" onchange="Pages._previewLogo('madrasahLogo', this)">
              </div>
              ${madrasahLogo ? `<button type="button" class="btn btn-sm btn-outline text-red-500 mt-2" onclick="Pages._removeLogo('madrasahLogo')">Hapus Logo</button>` : ''}
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
          <button type="button" class="btn btn-outline" onclick="Pages.renderPengaturan()">Batal</button>
          <button type="submit" class="btn btn-primary">Simpan Pengaturan</button>
        </div>
      </form>
    </div></div>
    ` : ''}
  </div>`;
};

Pages._previewLogo = function(key, input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('error', 'Ukuran gambar maksimal 2MB'); return; }
  const reader = new FileReader();
  reader.onload = function(e) {
    const settings = JSON.parse(localStorage.getItem('mops_settings') || '{}');
    settings[key] = e.target.result;
    localStorage.setItem('mops_settings', JSON.stringify(settings));
    Realtime.broadcast('settings_changed', settings);
    const preview = document.getElementById('preview' + key.charAt(0).toUpperCase() + key.slice(1));
    if (preview) preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-contain">`;
    Pages._refreshLogoDisplay(key);
  };
  reader.readAsDataURL(file);
};

Pages._removeLogo = function(key) {
  const settings = JSON.parse(localStorage.getItem('mops_settings') || '{}');
  delete settings[key];
  localStorage.setItem('mops_settings', JSON.stringify(settings));
  Realtime.broadcast('settings_changed', settings);
  Pages.renderPengaturan();
  Pages._refreshLogoDisplay(key);
};

Pages._refreshLogoDisplay = function(key) {
  const settings = JSON.parse(localStorage.getItem('mops_settings') || '{}');
  const logoText = settings.logoText || 'MO';
  const logoColor = settings.logoColor || '#059669';
  const val = settings[key];
  if (key === 'appLogo') {
    const sidebarIcon = document.querySelector('.sidebar-logo .logo-icon');
    if (sidebarIcon) {
      if (val) { sidebarIcon.innerHTML = `<img src="${val}" class="w-full h-full object-contain">`; }
      else { sidebarIcon.innerHTML = logoText; sidebarIcon.style.background = logoColor; }
    }
  }
};

Pages._toggleBellFromPengaturan = function() {
  const settings = JSON.parse(localStorage.getItem('mops_settings') || '{}');
  settings.bellEnabled = settings.bellEnabled === false ? true : false;
  localStorage.setItem('mops_settings', JSON.stringify(settings));
  Realtime.broadcast('settings_changed', settings);
  showToast('success', settings.bellEnabled ? 'Sistem bel diaktifkan' : 'Sistem bel dinonaktifkan');
  Pages.renderPengaturan();
};

Pages._toggleQuietFromPengaturan = function() {
  const settings = JSON.parse(localStorage.getItem('mops_settings') || '{}');
  settings.bellQuietMode = !settings.bellQuietMode;
  localStorage.setItem('mops_settings', JSON.stringify(settings));
  Realtime.broadcast('settings_changed', settings);
  showToast('success', settings.bellQuietMode ? 'Mode senyap diaktifkan' : 'Mode senyap dimatikan');
  Pages.renderPengaturan();
};

Pages._saveSettings = function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const settings = JSON.parse(localStorage.getItem('mops_settings') || '{}');
  Object.assign(settings, data);
  localStorage.setItem('mops_settings', JSON.stringify(settings));
  Realtime.broadcast('settings_changed', settings);
  showToast('success', 'Pengaturan berhasil disimpan! Halaman akan dimuat ulang.');
  setTimeout(() => location.reload(), 1000);
};

Pages._showChangePassword = function() {
  openModal('Ubah Password', `<form onsubmit="Pages._changePassword(event)"><div class="space-y-4">
    <div class="form-group"><label class="form-label">Password Lama</label><input type="password" class="form-input" name="old_password" required></div>
    <div class="form-group"><label class="form-label">Password Baru</label><input type="password" class="form-input" name="new_password" minlength="6" required></div>
    <div class="form-group"><label class="form-label">Konfirmasi Password</label><input type="password" class="form-input" name="confirm_password" required></div>
  </div><div class="flex justify-end gap-2 mt-4 pt-4 border-t"><button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button><button type="submit" class="btn btn-primary">Simpan</button></div></form>`);
};

Pages._changePassword = function(e) {
  e.preventDefault();
  showToast('success', 'Password berhasil diubah');
  closeModal();
};

// ========== SINKRONISASI ==========
Pages.renderSync = function() {
  const page = document.getElementById('activePage');
  const syncLog = JSON.parse(localStorage.getItem('mops_sync_log') || '[]');
  page.innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="card"><div class="card-body text-center py-8 cursor-pointer hover:shadow-lg transition-all" onclick="Pages._syncData('EMIS')">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-100 flex items-center justify-center"><span class="text-2xl font-bold text-blue-600">E</span></div>
      <h4 class="font-bold mb-1">EMIS</h4><p class="text-xs text-gray-500">Sinkronisasi data dari EMIS Kemenag</p>
      <button class="btn btn-primary mt-4">Sinkron Sekarang</button>
    </div></div>
    <div class="card"><div class="card-body text-center py-8 cursor-pointer hover:shadow-lg transition-all" onclick="Pages._syncData('Dapodik')">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center"><span class="text-2xl font-bold text-green-600">D</span></div>
      <h4 class="font-bold mb-1">Dapodik</h4><p class="text-xs text-gray-500">Sinkronisasi data dari Dapodik</p>
      <button class="btn btn-primary mt-4">Sinkron Sekarang</button>
    </div></div>
    <div class="card"><div class="card-body text-center py-8 cursor-pointer hover:shadow-lg transition-all" onclick="Pages._syncData('SIMPATIKA')">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-100 flex items-center justify-center"><span class="text-2xl font-bold text-purple-600">S</span></div>
      <h4 class="font-bold mb-1">SIMPATIKA</h4><p class="text-xs text-gray-500">Sinkronisasi data dari SIMPATIKA</p>
      <button class="btn btn-primary mt-4">Sinkron Sekarang</button>
    </div></div>
  </div>
  <div class="card mt-6"><div class="card-header"><h3 class="font-bold">Riwayat Sinkronisasi</h3></div><div class="table-container"><table>
    <thead><tr><th>Tanggal</th><th>Sumber</th><th>Jenis Data</th><th>Jumlah</th><th>Status</th></tr></thead>
    <tbody>${syncLog.length ? syncLog.map(l => `<tr><td class="text-sm">${Utils.formatDate(l.created_at)}</td><td><span class="badge badge-blue">${l.sumber}</span></td><td class="text-sm">${l.jenis_data}</td><td>${l.jumlah_data}</td><td><span class="badge badge-${l.status==='success'?'green':'red'}">${l.status}</span></td></tr>`).join('') : '<tr><td colspan="5" class="text-center text-gray-400 py-8">Belum ada riwayat sinkronisasi</td></tr>'}</tbody>
  </table></div></div>`;
};

Pages._syncData = function(sumber) {
  showLoading();
  setTimeout(() => {
    const log = { id: Utils.generateId(), sumber, jenis_data: 'Guru, Siswa, Kelas', jumlah_data: Math.floor(Math.random() * 100) + 10, status: 'success', created_at: new Date().toISOString() };
    const logs = JSON.parse(localStorage.getItem('mops_sync_log') || '[]');
    logs.unshift(log);
    localStorage.setItem('mops_sync_log', JSON.stringify(logs));
    hideLoading();
    showToast('success', `Sinkronisasi ${sumber} berhasil!`);
    Pages.renderSync();
  }, 2000);
};

// ========== KRITIK & SARAN ==========
Pages.renderKritikSaran = function() {
  const page = document.getElementById('activePage');
  const user = Auth.currentUser;
  const isAdmin = Auth.isSuperAdmin();

  if (isAdmin) {
    Pages._renderKritikSaranAdmin(page);
  } else {
    Pages._renderKritikSaranUser(page);
  }
};

Pages._renderKritikSaranUser = function(page) {
  const user = Auth.currentUser;
  const feedback = JSON.parse(localStorage.getItem('mops_feedback') || '[]');
  const myFeedback = feedback.filter(f => f.user_id === user.id).sort((a, b) => b.created_at.localeCompare(a.created_at));

  const statusBadge = (s) => {
    const map = { baru: 'badge-blue', diproses: 'badge-yellow', selesai: 'badge-green', ditolak: 'badge-red' };
    const label = { baru: 'Baru', diproses: 'Diproses', selesai: 'Selesai', ditolak: 'Ditolak' };
    return `<span class="badge ${map[s] || 'badge-gray'}">${label[s] || s}</span>`;
  };

  const kategoriIcon = (k) => {
    const map = { saran: '💡', kritik: '⚠️', apresiasi: '👍', teknis: '🔧', lainnya: '📝' };
    return map[k] || '📝';
  };

  page.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <div class="card-header"><h3 class="font-bold">Kirim Masukan</h3></div>
        <div class="card-body">
          <form onsubmit="Pages._saveFeedback(event)">
            <div class="form-group mb-3">
              <label class="form-label">Kategori *</label>
              <select name="kategori" class="form-select" required>
                <option value="">Pilih kategori</option>
                <option value="saran">💡 Saran Perbaikan</option>
                <option value="kritik">⚠️ Kritik</option>
                <option value="apresiasi">👍 Apresiasi</option>
                <option value="teknis">🔧 Masalah Teknis</option>
                <option value="lainnya">📝 Lainnya</option>
              </select>
            </div>
            <div class="form-group mb-3">
              <label class="form-label">Subjek *</label>
              <input type="text" name="subjek" class="form-input" placeholder="Contoh: Fitur absensi online" required>
            </div>
            <div class="form-group mb-3">
              <label class="form-label">Pesan *</label>
              <textarea name="pesan" class="form-input" rows="4" placeholder="Tulis masukan Anda secara detail..." required></textarea>
            </div>
            <button type="submit" class="btn btn-primary w-full">Kirim Masukan</button>
          </form>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3 class="font-bold">Riwayat Masukan Saya</h3><span class="badge badge-gray">${myFeedback.length} masukan</span></div>
        <div class="card-body space-y-3" style="max-height:500px;overflow-y:auto">
          ${myFeedback.length === 0 ? '<div class="text-center py-8 text-gray-400"><p class="text-4xl mb-2">📭</p><p>Belum ada masukan</p></div>' : ''}
          ${myFeedback.map(f => `
            <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-lg">${kategoriIcon(f.kategori)}</span>
                  <span class="font-bold text-sm">${f.subjek}</span>
                </div>
                ${statusBadge(f.status)}
              </div>
              <p class="text-sm text-gray-600 mb-2">${f.pesan}</p>
              <div class="text-xs text-gray-400 mb-2">${Utils.formatDate(f.created_at)}</div>
              ${f.balasan ? `
                <div class="mt-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div class="text-xs font-bold text-emerald-700 mb-1">📋 Balasan Admin:</div>
                  <p class="text-sm text-emerald-800">${f.balasan}</p>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;
};

Pages._saveFeedback = function(e) {
  e.preventDefault();
  const user = Auth.currentUser;
  const data = Object.fromEntries(new FormData(e.target).entries());
  const feedback = JSON.parse(localStorage.getItem('mops_feedback') || '[]');
  feedback.unshift({
    id: Utils.generateId(),
    user_id: user.id,
    user_nama: user.nama_lengkap,
    user_role: user.role,
    kategori: data.kategori,
    subjek: data.subjek,
    pesan: data.pesan,
    status: 'baru',
    balasan: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  localStorage.setItem('mops_feedback', JSON.stringify(feedback));
  Realtime.broadcast('feedback_changed', { action: 'new' });
  showToast('success', 'Masukan berhasil dikirim! Terima kasih.');
  Pages.renderKritikSaran();
};

Pages._renderKritikSaranAdmin = function(page) {
  const feedback = JSON.parse(localStorage.getItem('mops_feedback') || '[]').sort((a, b) => b.created_at.localeCompare(a.created_at));

  const statusBadge = (s) => {
    const map = { baru: 'badge-blue', diproses: 'badge-yellow', selesai: 'badge-green', ditolak: 'badge-red' };
    const label = { baru: 'Baru', diproses: 'Diproses', selesai: 'Selesai', ditolak: 'Ditolak' };
    return `<span class="badge ${map[s] || 'badge-gray'}">${label[s] || s}</span>`;
  };

  const roleBadge = (r) => {
    const map = { guru: 'badge-teal', ortu: 'badge-pink' };
    const label = { guru: 'Guru', ortu: 'Orang Tua' };
    return `<span class="badge ${map[r] || 'badge-gray'}">${label[r] || r}</span>`;
  };

  const kategoriIcon = (k) => {
    const map = { saran: '💡', kritik: '⚠️', apresiasi: '👍', teknis: '🔧', lainnya: '📝' };
    return map[k] || '📝';
  };

  const stats = {
    baru: feedback.filter(f => f.status === 'baru').length,
    diproses: feedback.filter(f => f.status === 'diproses').length,
    selesai: feedback.filter(f => f.status === 'selesai').length,
    total: feedback.length
  };

  page.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 stat-grid">
      <div class="stat-card blue"><div class="stat-value text-blue-600">${stats.total}</div><div class="stat-label">Total Masukan</div></div>
      <div class="stat-card yellow"><div class="stat-value text-yellow-600">${stats.baru}</div><div class="stat-label">Belum Ditanggapi</div></div>
      <div class="stat-card purple"><div class="stat-value text-purple-600">${stats.diproses}</div><div class="stat-label">Sedang Diproses</div></div>
      <div class="stat-card green"><div class="stat-value text-green-600">${stats.selesai}</div><div class="stat-label">Selesai Ditangani</div></div>
    </div>
    <div class="card">
      <div class="card-header flex items-center justify-between">
        <h3 class="font-bold">Daftar Masukan</h3>
        <select id="filterFeedbackStatus" class="form-select w-40" onchange="Pages._filterFeedback()">
          <option value="">Semua Status</option>
          <option value="baru">Baru</option>
          <option value="diproses">Diproses</option>
          <option value="selesai">Selesai</option>
          <option value="ditolak">Ditolak</option>
        </select>
      </div>
      <div class="card-body" id="feedbackList">
        ${feedback.length === 0 ? '<div class="text-center py-12 text-gray-400"><p class="text-5xl mb-3">📭</p><p class="font-medium">Belum ada masukan dari pengguna</p></div>' : ''}
        ${feedback.map(f => `
          <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-3 feedback-item" data-status="${f.status}">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-lg">${kategoriIcon(f.kategori)}</span>
                <span class="font-bold text-sm">${f.subjek}</span>
                ${roleBadge(f.user_role)}
                <span class="text-xs text-gray-400">${f.user_nama}</span>
              </div>
              ${statusBadge(f.status)}
            </div>
            <p class="text-sm text-gray-600 mb-2">${f.pesan}</p>
            <div class="text-xs text-gray-400 mb-3">${Utils.formatDate(f.created_at)}</div>
            ${f.balasan ? `
              <div class="p-3 bg-emerald-50 rounded-lg border border-emerald-100 mb-3">
                <div class="text-xs font-bold text-emerald-700 mb-1">Balasan Admin:</div>
                <p class="text-sm text-emerald-800">${f.balasan}</p>
              </div>
            ` : ''}
            <div class="flex gap-2 flex-wrap">
              <select class="form-select text-xs" style="width:auto;padding:4px 8px" onchange="Pages._updateFeedbackStatus('${f.id}', this.value)">
                <option value="baru" ${f.status==='baru'?'selected':''}>Baru</option>
                <option value="diproses" ${f.status==='diproses'?'selected':''}>Diproses</option>
                <option value="selesai" ${f.status==='selesai'?'selected':''}>Selesai</option>
                <option value="ditolak" ${f.status==='ditolak'?'selected':''}>Ditolak</option>
              </select>
              <button class="btn btn-sm btn-primary" onclick="Pages._replyFeedback('${f.id}')">Balas</button>
              <button class="btn btn-sm btn-outline text-red-500" onclick="Pages._deleteFeedback('${f.id}')">Hapus</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
};

Pages._filterFeedback = function() {
  const status = document.getElementById('filterFeedbackStatus')?.value;
  document.querySelectorAll('.feedback-item').forEach(el => {
    el.style.display = (!status || el.dataset.status === status) ? '' : 'none';
  });
};

Pages._updateFeedbackStatus = function(id, status) {
  const feedback = JSON.parse(localStorage.getItem('mops_feedback') || '[]');
  const idx = feedback.findIndex(f => f.id === id);
  if (idx >= 0) {
    feedback[idx].status = status;
    feedback[idx].updated_at = new Date().toISOString();
    localStorage.setItem('mops_feedback', JSON.stringify(feedback));
    Realtime.broadcast('feedback_changed', { action: 'status', id });
    showToast('success', 'Status diperbarui');
    Pages.renderKritikSaran();
  }
};

Pages._replyFeedback = function(id) {
  const feedback = JSON.parse(localStorage.getItem('mops_feedback') || '[]');
  const f = feedback.find(x => x.id === id);
  if (!f) return;
  openModal('Balas Masukan', `
    <div class="mb-3 p-3 bg-gray-50 rounded-lg">
      <div class="font-bold text-sm mb-1">${f.subjek}</div>
      <p class="text-sm text-gray-600">${f.pesan}</p>
    </div>
    <form onsubmit="Pages._saveReply(event, '${id}')">
      <div class="form-group">
        <label class="form-label">Balasan</label>
        <textarea name="balasan" class="form-input" rows="3" placeholder="Tulis balasan..." required>${f.balasan || ''}</textarea>
      </div>
      <div class="flex justify-end gap-2 mt-4 pt-4 border-t">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Batal</button>
        <button type="submit" class="btn btn-primary">Kirim Balasan</button>
      </div>
    </form>
  `);
};

Pages._saveReply = function(e, id) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const feedback = JSON.parse(localStorage.getItem('mops_feedback') || '[]');
  const idx = feedback.findIndex(f => f.id === id);
  if (idx >= 0) {
    feedback[idx].balasan = data.balasan;
    feedback[idx].status = 'diproses';
    feedback[idx].updated_at = new Date().toISOString();
    localStorage.setItem('mops_feedback', JSON.stringify(feedback));
    Realtime.broadcast('feedback_changed', { action: 'reply', id });
    closeModal();
    showToast('success', 'Balasan terkirim');
    Pages.renderKritikSaran();
  }
};

Pages._deleteFeedback = function(id) {
  if (!Utils.confirm('Hapus masukan ini?')) return;
  const feedback = JSON.parse(localStorage.getItem('mops_feedback') || '[]');
  localStorage.setItem('mops_feedback', JSON.stringify(feedback.filter(f => f.id !== id)));
  Realtime.broadcast('feedback_changed', { action: 'delete', id });
  showToast('success', 'Masukan dihapus');
  Pages.renderKritikSaran();
};
