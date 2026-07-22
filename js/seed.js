// ============================================
// MADRASAHOPS - SEED DATA (OFFLINE MODE)
// ============================================

function initLocalData() {
  if (typeof supabase !== 'undefined' && supabase) {
    console.log('[Seed] Supabase terdeteksi, skip seed localStorage');
    return;
  }

  const tables = [
    'users', 'guru', 'murid', 'kelas', 'mata_pelajaran', 'jadwal', 'absensi',
    'absensi_guru', 'kalender', 'wali_kelas', 'tahun_pelajaran', 'semester',
    'ruang', 'penilaian', 'rapor', 'sarana', 'keuangan_transaksi', 'keuangan_kategori',
    'keuangan_anggaran', 'rapbm', 'ppdb_pendaftaran', 'audit_log', 'madrasah',
    'perangkat_pembelajaran', 'prestasi', 'ortu', 'ortu_murid', 'sync_log',
    'ptk_verifikasi', 'guru_tunjangan', 'guru_riwayat', 'feedback',
    'bel_jadwal', 'bel_log'
  ];
  tables.forEach(table => {
    if (!localStorage.getItem(`mops_${table}`)) {
      localStorage.setItem(`mops_${table}`, '[]');
    }
  });

  // Default admin
  const users = JSON.parse(localStorage.getItem('mops_users') || '[]');
  if (users.length === 0) {
    users.push(
      { id: 'user_admin_001', email: 'admin@kemenag.go.id', password: 'admin123', nama_lengkap: 'Admin Kemenag', role: 'super_admin', is_active: true, created_at: new Date().toISOString() },
      { id: 'user_guru_001', email: 'guru@mi.sch.id', password: 'guru123', nama_lengkap: 'Ahmad Fauzi, S.Pd.I', role: 'guru', madrasah_id: 'mad_001', is_active: true, created_at: new Date().toISOString() },
      { id: 'user_ortu_001', email: 'ortu@mi.sch.id', password: 'ortu123', nama_lengkap: 'Budi Santoso (Orang Tua)', role: 'ortu', madrasah_id: 'mad_001', is_active: true, created_at: new Date().toISOString() }
    );
    localStorage.setItem('mops_users', JSON.stringify(users));
  } else if (!users.find(u => u.role === 'ortu')) {
    users.push({ id: 'user_ortu_001', email: 'ortu@mi.sch.id', password: 'ortu123', nama_lengkap: 'Budi Santoso (Orang Tua)', role: 'ortu', madrasah_id: 'mad_001', is_active: true, created_at: new Date().toISOString() });
    localStorage.setItem('mops_users', JSON.stringify(users));
  }

  // Madrasah
  const madrasah = JSON.parse(localStorage.getItem('mops_madrasah') || '[]');
  if (madrasah.length === 0) {
    madrasah.push(
      { id: 'mad_001', npsn: '11111111', nama_madrasah: 'MI Al-Hikmah', jenjang: 'MI', alamat: 'Jl. Pendidikan No. 1', kabupaten: 'Kota Jakarta', provinsi: 'DKI Jakarta', status: 'Aktif', akreditasi: 'A', created_at: new Date().toISOString() },
      { id: 'mad_002', npsn: '22222222', nama_madrasah: 'MTs Nurul Iman', jenjang: 'MTs', alamat: 'Jl. Pesantren No. 10', kabupaten: 'Kota Jakarta', provinsi: 'DKI Jakarta', status: 'Aktif', akreditasi: 'B', created_at: new Date().toISOString() },
      { id: 'mad_003', npsn: '33333333', nama_madrasah: 'MA Al-Azhar', jenjang: 'MA', alamat: 'Jl. Ilmu No. 5', kabupaten: 'Kota Jakarta', provinsi: 'DKI Jakarta', status: 'Aktif', akreditasi: 'A', created_at: new Date().toISOString() }
    );
    localStorage.setItem('mops_madrasah', JSON.stringify(madrasah));
  }

  // Guru
  const guru = JSON.parse(localStorage.getItem('mops_guru') || '[]');
  if (guru.length === 0) {
    const guruData = [
      { id: 'guru_001', nip: '198501012010011001', nuptk: '1234567890123456', nama_lengkap: 'Ahmad Fauzi, S.Pd.I', jenis_kelamin: 'Laki-laki', tempat_lahir: 'Jakarta', tanggal_lahir: '1985-01-01', status_guru: 'Aktif', status_pegawai: 'PNS', mata_pelajaran: "Al-Qur'an Hadis", jabatan: 'Guru', golongan: 'III/c', madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'guru_002', nip: '198702022010012002', nuptk: '2345678901234567', nama_lengkap: 'Siti Aminah, S.Pd', jenis_kelamin: 'Perempuan', tempat_lahir: 'Bandung', tanggal_lahir: '1987-02-02', status_guru: 'Aktif', status_pegawai: 'PNS', mata_pelajaran: 'Fiqih', jabatan: 'Guru', golongan: 'III/c', madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'guru_003', nip: '198803032010013003', nuptk: '3456789012345678', nama_lengkap: 'Muhammad Ridwan, S.Ag', jenis_kelamin: 'Laki-laki', tempat_lahir: 'Surabaya', tanggal_lahir: '1988-03-03', status_guru: 'Aktif', status_pegawai: 'PNS', mata_pelajaran: 'Aqidah Akhlak', jabatan: 'Guru', golongan: 'III/b', madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'guru_004', nip: '199004042010014004', nuptk: '4567890123456789', nama_lengkap: 'Fatimah Azzahra, S.Pd', jenis_kelamin: 'Perempuan', tempat_lahir: 'Yogyakarta', tanggal_lahir: '1990-04-04', status_guru: 'Aktif', status_pegawai: 'PPPK', mata_pelajaran: 'Bahasa Arab', jabatan: 'Guru', golongan: 'III/a', madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'guru_005', nip: '199105052010015005', nuptk: '5678901234567890', nama_lengkap: 'Abdullah Saleh, S.Pd.I', jenis_kelamin: 'Laki-laki', tempat_lahir: 'Medan', tanggal_lahir: '1991-05-05', status_guru: 'Aktif', status_pegawai: 'GTY', mata_pelajaran: 'Prakarya dan IPS', jabatan: 'Guru', madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'guru_006', nip: '199206062010016006', nuptk: '6789012345678901', nama_lengkap: 'Aisyah Putri, S.Pd', jenis_kelamin: 'Perempuan', tempat_lahir: 'Semarang', tanggal_lahir: '1992-06-06', status_guru: 'Aktif', status_pegawai: 'GTY', mata_pelajaran: 'Matematika', jabatan: 'Guru', madrasah_id: 'mad_001', created_at: new Date().toISOString() },
    ];
    localStorage.setItem('mops_guru', JSON.stringify(guruData));
  }

  // --- Migrasi: Hapus rombel A/B dari data lama ---
  const kelasList = JSON.parse(localStorage.getItem('mops_kelas') || '[]');
  const muridList = JSON.parse(localStorage.getItem('mops_murid') || '[]');
  const hasRombelB = kelasList.some(k => k.id && k.id.match(/kelas_\d+[AB]/i));
  if (hasRombelB) {
    // Pindahkan semua siswa ke kelas tanpa rombel, hapus kelas A/B
    const cleanedKelas = [];
    for (let i = 1; i <= 6; i++) {
      const existing = kelasList.find(k => k.id === `kelas_${i}`);
      cleanedKelas.push(existing || {
        id: `kelas_${i}`, nama_kelas: `Kelas ${i}`, tingkat: i, rombel: '',
        ruang: `Ruang ${i}`, tahun_pelajaran: '2025/2026', kapasitas: 30, jumlah_murid: 0,
        madrasah_id: 'mad_001', created_at: new Date().toISOString()
      });
    }
    localStorage.setItem('mops_kelas', JSON.stringify(cleanedKelas));
    // Update kelas_id semua siswa
    muridList.forEach(m => {
      const match = m.kelas_id && m.kelas_id.match(/kelas_(\d+)/);
      if (match) m.kelas_id = `kelas_${match[1]}`;
    });
    localStorage.setItem('mops_murid', JSON.stringify(muridList));
  }

  // Kelas
  const kelas = JSON.parse(localStorage.getItem('mops_kelas') || '[]');
  if (kelas.length === 0) {
    const kelasData = [];
    for (let i = 1; i <= 6; i++) {
      kelasData.push({
        id: `kelas_${i}`, nama_kelas: `Kelas ${i}`, tingkat: i, rombel: '',
        ruang: `Ruang ${i}`,
        tahun_pelajaran: '2025/2026', kapasitas: 30, jumlah_murid: 0,
        madrasah_id: 'mad_001', created_at: new Date().toISOString()
      });
    }
    localStorage.setItem('mops_kelas', JSON.stringify(kelasData));
  }

  // Murid
  const murid = JSON.parse(localStorage.getItem('mops_murid') || '[]');
  if (murid.length === 0) {
    const namaLaki = ['Muhammad Ali', 'Ahmad Rizki', 'Abdul Rahman', 'Omar Faruk', 'Hasan Basri', 'Yusuf Kurniawan', 'Ibrahim Fauzi', 'Umar Syafei', 'Hamzah Yakub', 'Bilal Amri'];
    const namaPerempuan = ['Aisyah Zahra', 'Fatimah Azzahra', 'Khadijah Rahma', 'Maryam Salsabila', 'Hafsah Putri', 'Zainab Auliya', 'Nusaibah Azizah', 'Ruqayyah Dewi', 'Sakinah Aminah', 'Halimah Sari'];
    const muridData = [];
    let nisn = 100001;
    for (let i = 1; i <= 6; i++) {
      const namaPool = i % 2 === 0 ? namaPerempuan : namaLaki;
      const count = 8 + Math.floor(Math.random() * 7);
      for (let j = 0; j < count; j++) {
        const nm = namaPool[j % namaPool.length];
        const jk = i % 2 === 0 ? 'Perempuan' : 'Laki-laki';
        muridData.push({
          id: `murid_${nisn}`, nis: `NIS${nisn}`, nisn: String(nisn),
          nama_lengkap: nm + (j > 0 ? ' ' + String.fromCharCode(65 + j) : ''),
          kelas_id: `kelas_${i}`, jenis_kelamin: jk,
          tempat_lahir: 'Jakarta', tanggal_lahir: `${2014 + (6 - i)}-0${(j % 9) + 1}-15`,
          agama: 'Islam', tahun_masuk: '2025/2026', status_aktif: true,
          madrasah_id: 'mad_001', created_at: new Date().toISOString()
        });
        nisn++;
      }
    }
    localStorage.setItem('mops_murid', JSON.stringify(muridData));
  }

  // Mata Pelajaran
  const mapel = JSON.parse(localStorage.getItem('mops_mata_pelajaran') || '[]');
  if (mapel.length === 0) {
    const mapelData = [
      { id: 'mp_01', kode_mapel: 'QH01', nama_mapel: "Al-Qur'an Hadis", kelompok: 'A', jam_pelajaran: 4, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'mp_02', kode_mapel: 'FI02', nama_mapel: 'Fiqih', kelompok: 'A', jam_pelajaran: 3, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'mp_03', kode_mapel: 'AK03', nama_mapel: 'Aqidah Akhlak', kelompok: 'A', jam_pelajaran: 3, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'mp_04', kode_mapel: 'BA04', nama_mapel: 'Bahasa Arab', kelompok: 'A', jam_pelajaran: 3, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'mp_05', kode_mapel: 'PI05', nama_mapel: 'Prakarya dan IPS', kelompok: 'B', jam_pelajaran: 4, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'mp_06', kode_mapel: 'MT06', nama_mapel: 'Matematika', kelompok: 'B', jam_pelajaran: 4, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'mp_07', kode_mapel: 'IN07', nama_mapel: 'Bahasa Indonesia', kelompok: 'B', jam_pelajaran: 4, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'mp_08', kode_mapel: 'IP08', nama_mapel: 'IPA', kelompok: 'B', jam_pelajaran: 3, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'mp_09', kode_mapel: 'PJ09', nama_mapel: 'Pendidikan Jasmani', kelompok: 'B', jam_pelajaran: 2, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'mp_10', kode_mapel: 'SB10', nama_mapel: 'Seni Budaya', kelompok: 'B', jam_pelajaran: 2, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'mp_11', kode_mapel: 'BK11', nama_mapel: 'Bahasa Inggris', kelompok: 'B', jam_pelajaran: 2, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'mp_12', kode_mapel: 'TI12', nama_mapel: 'TIK', kelompok: 'B', jam_pelajaran: 2, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
    ];
    localStorage.setItem('mops_mata_pelajaran', JSON.stringify(mapelData));
  }

  // Ruang
  const ruang = JSON.parse(localStorage.getItem('mops_ruang') || '[]');
  if (ruang.length === 0) {
    const ruangData = [];
    for (let i = 1; i <= 14; i++) {
      ruangData.push({ id: `ruang_${i}`, nama_ruang: `Ruang ${i}`, gedung: i <= 12 ? 'Gedung Utama' : 'Gedung B', kapasitas: 30, status: 'Tersedia', madrasah_id: 'mad_001', created_at: new Date().toISOString() });
    }
    ruangData.push({ id: 'ruang_15', nama_ruang: 'Lab Komputer', gedung: 'Gedung B', kapasitas: 30, status: 'Tersedia', madrasah_id: 'mad_001', created_at: new Date().toISOString() });
    ruangData.push({ id: 'ruang_16', nama_ruang: 'Perpustakaan', gedung: 'Gedung Utama', kapasitas: 20, status: 'Tersedia', madrasah_id: 'mad_001', created_at: new Date().toISOString() });
    ruangData.push({ id: 'ruang_17', nama_ruang: 'Aula', gedung: 'Gedung Utama', kapasitas: 100, status: 'Tersedia', madrasah_id: 'mad_001', created_at: new Date().toISOString() });
    localStorage.setItem('mops_ruang', JSON.stringify(ruangData));
  }

  // Keuangan Kategori
  const keuKategori = JSON.parse(localStorage.getItem('mops_keuangan_kategori') || '[]');
  if (keuKategori.length === 0) {
    const katData = [
      { id: 'kk_01', nama_kategori: 'Dana BOS', jenis: 'pendapatan', kelompok: 'Pemerintah', created_at: new Date().toISOString() },
      { id: 'kk_02', nama_kategori: 'SPP', jenis: 'pendapatan', kelompok: 'Siswa', created_at: new Date().toISOString() },
      { id: 'kk_03', nama_kategori: 'Infaq', jenis: 'pendapatan', kelompok: 'Donasi', created_at: new Date().toISOString() },
      { id: 'kk_04', nama_kategori: 'Gaji & Tunjangan', jenis: 'belanja', kelompok: 'Kepegawaian', created_at: new Date().toISOString() },
      { id: 'kk_05', nama_kategori: 'Pemeliharaan', jenis: 'belanja', kelompok: 'Sarana', created_at: new Date().toISOString() },
      { id: 'kk_06', nama_kategori: 'Listrik & Air', jenis: 'belanja', kelompok: 'Operasional', created_at: new Date().toISOString() },
      { id: 'kk_07', nama_kategori: 'Perlengkapan', jenis: 'belanja', kelompok: 'Operasional', created_at: new Date().toISOString() },
      { id: 'kk_08', nama_kategori: 'Kegiatan Belajar', jenis: 'belanja', kelompok: 'Akademik', created_at: new Date().toISOString() },
    ];
    localStorage.setItem('mops_keuangan_kategori', JSON.stringify(katData));
  }

  // Keuangan Transaksi (sample)
  const keuTransaksi = JSON.parse(localStorage.getItem('mops_keuangan_transaksi') || '[]');
  if (keuTransaksi.length === 0) {
    const trxData = [];
    const bulan = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'];
    bulan.forEach(b => {
      trxData.push(
        { id: `trx_${b}_1`, tanggal: `${b}-05`, jenis: 'masuk', kategori_id: 'kk_01', deskripsi: 'Dana BOS Triwulan', nominal: 150000000, sumber_dana: 'BOS', tahun_pelajaran: '2025/2026', madrasah_id: 'mad_001', created_at: new Date().toISOString() },
        { id: `trx_${b}_2`, tanggal: `${b}-10`, jenis: 'masuk', kategori_id: 'kk_02', deskripsi: 'SPP Siswa', nominal: 45000000, sumber_dana: 'SPP', tahun_pelajaran: '2025/2026', madrasah_id: 'mad_001', created_at: new Date().toISOString() },
        { id: `trx_${b}_3`, tanggal: `${b}-15`, jenis: 'keluar', kategori_id: 'kk_04', deskripsi: 'Gaji Guru & Staff', nominal: 120000000, sumber_dana: 'BOS', tahun_pelajaran: '2025/2026', madrasah_id: 'mad_001', created_at: new Date().toISOString() },
        { id: `trx_${b}_4`, tanggal: `${b}-20`, jenis: 'keluar', kategori_id: 'kk_06', deskripsi: 'Listrik & Air', nominal: 5000000, sumber_dana: 'BOS', tahun_pelajaran: '2025/2026', madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      );
    });
    localStorage.setItem('mops_keuangan_transaksi', JSON.stringify(trxData));
  }

  // Sarana (sample)
  const sarana = JSON.parse(localStorage.getItem('mops_sarana') || '[]');
  if (sarana.length === 0) {
    const saranaData = [
      { id: 'sar_01', nama_barang: 'Meja Guru', kategori: 'Perlengkapan', jumlah: 15, kondisi: 'Baik', lokasi: 'Ruang Guru', tahun_pengadaan: 2020, nilai_perolehan: 7500000, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'sar_02', nama_barang: 'Kursi Siswa', kategori: 'Perlengkapan', jumlah: 400, kondisi: 'Baik', lokasi: 'Ruang Kelas', tahun_pengadaan: 2019, nilai_perolehan: 40000000, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'sar_03', nama_barang: 'Proyektor', kategori: 'IT', jumlah: 8, kondisi: 'Baik', lokasi: 'Ruang Kelas', tahun_pengadaan: 2022, nilai_perolehan: 24000000, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'sar_04', nama_barang: 'Komputer Desktop', kategori: 'IT', jumlah: 20, kondisi: 'Rusak Ringan', lokasi: 'Lab Komputer', tahun_pengadaan: 2021, nilai_perolehan: 100000000, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'sar_05', nama_barang: 'Papan Tulis Digital', kategori: 'IT', jumlah: 6, kondisi: 'Baik', lokasi: 'Ruang Kelas', tahun_pengadaan: 2023, nilai_perolehan: 18000000, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
      { id: 'sar_06', nama_barang: 'Buku Perpustakaan', kategori: 'Perpustakaan', jumlah: 500, kondisi: 'Baik', lokasi: 'Perpustakaan', tahun_pengadaan: 2020, nilai_perolehan: 25000000, madrasah_id: 'mad_001', created_at: new Date().toISOString() },
    ];
    localStorage.setItem('mops_sarana', JSON.stringify(saranaData));
  }

  // Absensi sample (today)
  const absensi = JSON.parse(localStorage.getItem('mops_absensi') || '[]');
  if (absensi.length === 0) {
    const today = new Date().toISOString().split('T')[0];
    const muridList = JSON.parse(localStorage.getItem('mops_murid') || '[]');
    const absData = [];
    const statuses = ['Hadir', 'Hadir', 'Hadir', 'Hadir', 'Hadir', 'Hadir', 'Izin', 'Sakit', 'Alpha'];
    muridList.slice(0, 20).forEach((m, idx) => {
      absData.push({
        id: `abs_${m.id}_${idx}`, tanggal: today, murid_id: m.id,
        kelas_id: m.kelas_id, status: statuses[idx % statuses.length],
        madrasah_id: 'mad_001', created_at: new Date().toISOString()
      });
    });
    localStorage.setItem('mops_absensi', JSON.stringify(absData));
  }

  // Kalender
  const kalender = JSON.parse(localStorage.getItem('mops_kalender') || '[]');
  if (kalender.length === 0) {
    const kalData = [
      { id: 'kal_01', judul: 'Awal Tahun Pelajaran 2025/2026', tanggal_mulai: '2025-07-14', kategori: 'Kegiatan', warna: '#10B981', tahun_pelajaran: '2025/2026', created_at: new Date().toISOString() },
      { id: 'kal_02', judul: 'Mid Semester Ganjil', tanggal_mulai: '2025-09-15', tanggal_selesai: '2025-09-20', kategori: 'Ujian', warna: '#F59E0B', tahun_pelajaran: '2025/2026', created_at: new Date().toISOString() },
      { id: 'kal_03', judul: 'Hari Santri Nasional', tanggal_mulai: '2025-10-22', kategori: 'Acara', warna: '#3B82F6', tahun_pelajaran: '2025/2026', created_at: new Date().toISOString() },
      { id: 'kal_04', judul: 'PAS Semester Ganjil', tanggal_mulai: '2025-12-01', tanggal_selesai: '2025-12-12', kategori: 'Ujian', warna: '#F59E0B', tahun_pelajaran: '2025/2026', created_at: new Date().toISOString() },
      { id: 'kal_05', judul: 'Libur Natal', tanggal_mulai: '2025-12-25', tanggal_selesai: '2025-12-26', kategori: 'Libur', warna: '#EF4444', tahun_pelajaran: '2025/2026', created_at: new Date().toISOString() },
      { id: 'kal_06', judul: 'Upacara HUT RI', tanggal_mulai: '2025-08-17', kategori: 'Upacara', warna: '#8B5CF6', tahun_pelajaran: '2025/2026', created_at: new Date().toISOString() },
      { id: 'kal_07', judul: 'PAS Semester Genap', tanggal_mulai: '2026-05-25', tanggal_selesai: '2026-06-05', kategori: 'Ujian', warna: '#F59E0B', tahun_pelajaran: '2025/2026', created_at: new Date().toISOString() },
    ];
    localStorage.setItem('mops_kalender', JSON.stringify(kalData));
  }

  // Penilaian sample
  const penilaian = JSON.parse(localStorage.getItem('mops_penilaian') || '[]');
  if (penilaian.length === 0) {
    const muridList = JSON.parse(localStorage.getItem('mops_murid') || '[]');
    const penData = [];
    const mapelList = ['mp_01', 'mp_02', 'mp_03', 'mp_04', 'mp_06', 'mp_07'];
    muridList.slice(0, 15).forEach(m => {
      mapelList.forEach(mp => {
        const base = 65 + Math.floor(Math.random() * 30);
        penData.push(
          { id: `pen_${m.id}_${mp}_ph1`, murid_id: m.id, mata_pelajaran_id: mp, kelas_id: m.kelas_id, jenis_nilai: 'PH1', nilai: base + Math.floor(Math.random() * 5), tahun_pelajaran: '2025/2026', semester: 'Ganjil', created_at: new Date().toISOString() },
          { id: `pen_${m.id}_${mp}_ph2`, murid_id: m.id, mata_pelajaran_id: mp, kelas_id: m.kelas_id, jenis_nilai: 'PH2', nilai: base + Math.floor(Math.random() * 5), tahun_pelajaran: '2025/2026', semester: 'Ganjil', created_at: new Date().toISOString() },
          { id: `pen_${m.id}_${mp}_pts`, murid_id: m.id, mata_pelajaran_id: mp, kelas_id: m.kelas_id, jenis_nilai: 'PTS', nilai: base + Math.floor(Math.random() * 10), tahun_pelajaran: '2025/2026', semester: 'Ganjil', created_at: new Date().toISOString() },
          { id: `pen_${m.id}_${mp}_pas`, murid_id: m.id, mata_pelajaran_id: mp, kelas_id: m.kelas_id, jenis_nilai: 'PAS', nilai: base + Math.floor(Math.random() * 10), tahun_pelajaran: '2025/2026', semester: 'Ganjil', created_at: new Date().toISOString() },
        );
      });
    });
    localStorage.setItem('mops_penilaian', JSON.stringify(penData));
  }

  // Tahun Pelajaran
  const tp = JSON.parse(localStorage.getItem('mops_tahun_pelajaran') || '[]');
  if (tp.length === 0) {
    localStorage.setItem('mops_tahun_pelajaran', JSON.stringify([
      { id: 'tp_01', nama: '2025/2026', is_active: true, created_at: new Date().toISOString() },
      { id: 'tp_02', nama: '2024/2025', is_active: false, created_at: new Date().toISOString() },
    ]));
  }

  // Semester
  const sem = JSON.parse(localStorage.getItem('mops_semester') || '[]');
  if (sem.length === 0) {
    localStorage.setItem('mops_semester', JSON.stringify([
      { id: 'sem_01', nama: 'Ganjil', tahun_pelajaran_id: 'tp_01', is_active: true, tanggal_mulai: '2025-07-01', tanggal_selesai: '2025-12-31', created_at: new Date().toISOString() },
      { id: 'sem_02', nama: 'Genap', tahun_pelajaran_id: 'tp_01', is_active: false, tanggal_mulai: '2026-01-02', tanggal_selesai: '2026-06-30', created_at: new Date().toISOString() },
    ]));
  }

  // Bel Jadwal Default (MI Bustanul Ulum Curahkalong 01)
  const belJadwal = JSON.parse(localStorage.getItem('mops_bel_jadwal') || '[]');
  if (belJadwal.length === 0) {
    const defaultBel = [
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
    localStorage.setItem('mops_bel_jadwal', JSON.stringify(defaultBel));
  }

  // Bel Log default kosong
  if (!localStorage.getItem('mops_bel_log')) {
    localStorage.setItem('mops_bel_log', '[]');
  }
}
