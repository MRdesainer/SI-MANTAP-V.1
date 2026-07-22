-- ============================================
-- MADRASAHOPS INTEGRATED - COMPLETE DATABASE SCHEMA
-- SI-MANTAP: Sistem Informasi Madrasah Yang Amanah & Terpusat (Kemenag RI)
-- PostgreSQL / Supabase Compatible
-- ============================================

-- ============================================
-- 1. AUTENTIKASI & KEAMANAN
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nama_lengkap TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'operator' CHECK (role IN (
    'super_admin', 'admin_kanwil', 'admin_kabupaten', 
    'kepala_madrasah', 'operator', 'guru', 'ortu'
  )),
  madrasah_id UUID,
  avatar TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. DATA INDUK MADRASAH
-- ============================================

CREATE TABLE IF NOT EXISTS madrasah (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  npsn TEXT UNIQUE,
  nama_madrasah TEXT NOT NULL,
  jenjang TEXT NOT NULL CHECK (jenjang IN ('MI', 'MTs', 'MA', 'MAK')),
  alamat TEXT,
  kecamatan TEXT,
  kabupaten TEXT,
  provinsi TEXT,
  kode_pos TEXT,
  no_telepon TEXT,
  email TEXT,
  website TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Non-Aktif', 'Ditutup')),
  akreditasi TEXT CHECK (akreditasi IN ('A', 'B', 'C', 'Belum')),
  tanggal_akreditasi DATE,
  sk_pendirian TEXT,
  tanggal_pendirian DATE,
  visi TEXT,
  misi TEXT,
  logo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tahun_pelajaran (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT false,
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS semester (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  tahun_pelajaran_id UUID REFERENCES tahun_pelajaran(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT false,
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. MODUL GURU & PTK (Kepegawaian)
-- ============================================

CREATE TABLE IF NOT EXISTS guru (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nip TEXT,
  nuptk TEXT,
  nik TEXT,
  nama_lengkap TEXT NOT NULL,
  jenis_kelamin TEXT CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
  tempat_lahir TEXT,
  tanggal_lahir DATE,
  agama TEXT,
  alamat TEXT,
  no_hp TEXT,
  email TEXT,
  foto TEXT,
  pendidikan_terakhir TEXT,
  institusi_pendidikan TEXT,
  tahun_lulus INTEGER,
  mata_pelajaran TEXT,
  status_guru TEXT DEFAULT 'Aktif' CHECK (status_guru IN ('Aktif', 'Non-Aktif', 'Cuti', 'Pensiun', 'Mutasi')),
  status_pegawai TEXT CHECK (status_pegawai IN ('PNS', 'PPPK', 'GTY', 'GTT', 'Honorer')),
  jabatan TEXT,
  tmt DATE,
  golongan TEXT,
  no_rekening TEXT,
  nama_bank TEXT,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  emis_id TEXT,
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('synced', 'pending', 'error')),
  last_sync TIMESTAMPTZ,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ptk_verifikasi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guru_id UUID REFERENCES guru(id) ON DELETE CASCADE,
  status_verifikasi TEXT DEFAULT 'pending' CHECK (status_verifikasi IN (
    'pending', 'verified', 'rejected', 'need_revision'
  )),
  verifikator TEXT,
  catatan TEXT,
  dokumen_pendukung TEXT[],
  tanggal_verifikasi TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guru_tunjangan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guru_id UUID REFERENCES guru(id) ON DELETE CASCADE,
  jenis_tunjangan TEXT NOT NULL CHECK (jenis_tunjangan IN (
    'TPG', 'Insentif', 'BTPS', 'Tunjangan Khusus', 'Kepala Madrasah'
  )),
  nominal DECIMAL(15, 2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  periode TEXT,
  tanggal_pengajuan DATE,
  tanggal_pembayaran DATE,
  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guru_riwayat (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guru_id UUID REFERENCES guru(id) ON DELETE CASCADE,
  jenis_riwayat TEXT NOT NULL CHECK (jenis_riwayat IN (
    'Kenaikan Pangkat', 'Mutasi', 'Pensiun', 'SK Baru', 'Perpanjangan'
  )),
  tanggal DATE,
  nomor_sk TEXT,
  deskripsi TEXT,
  dokumen TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. MODUL MURID (Siswa)
-- ============================================

CREATE TABLE IF NOT EXISTS kelas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_kelas TEXT NOT NULL,
  tingkat INTEGER NOT NULL,
  rombel TEXT,
  ruang TEXT,
  tahun_pelajaran TEXT NOT NULL,
  kapasitas INTEGER DEFAULT 30,
  jumlah_murid INTEGER DEFAULT 0,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(nama_kelas, tahun_pelajaran, madrasah_id)
);

CREATE TABLE IF NOT EXISTS murid (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nis TEXT,
  nisn TEXT UNIQUE,
  nik TEXT,
  nama_lengkap TEXT NOT NULL,
  kelas_id UUID REFERENCES kelas(id) ON DELETE SET NULL,
  jenis_kelamin TEXT CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
  tempat_lahir TEXT,
  tanggal_lahir DATE,
  agama TEXT,
  alamat TEXT,
  no_hp TEXT,
  nama_ayah TEXT,
  pekerjaan_ayah TEXT,
  nama_ibu TEXT,
  pekerjaan_ibu TEXT,
  no_hp_ortu TEXT,
  email_ortu TEXT,
  foto TEXT,
  status_aktif BOOLEAN DEFAULT true,
  tahun_masuk TEXT,
  tahun_lulus TEXT,
  no_ijazah TEXT,
  asal_sekolah TEXT,
  jenis_pendaftaran TEXT CHECK (jenis_pendaftaran IN ('Baru', 'Pindahan', 'Reguler')),
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  emis_id TEXT,
  sync_status TEXT DEFAULT 'pending',
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wali_kelas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kelas_id UUID REFERENCES kelas(id) ON DELETE CASCADE,
  guru_id UUID REFERENCES guru(id) ON DELETE SET NULL,
  tahun_pelajaran TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(kelas_id, tahun_pelajaran)
);

-- ============================================
-- 5. MODUL AKADEMIK & KURIKULUM (KMA 183)
-- ============================================

CREATE TABLE IF NOT EXISTS mata_pelajaran (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kode_mapel TEXT NOT NULL,
  nama_mapel TEXT NOT NULL,
  kelompok TEXT CHECK (kelompok IN ('A', 'B', 'C')),
  jam_pelajaran INTEGER DEFAULT 1,
  guru_pengampu UUID REFERENCES guru(id) ON DELETE SET NULL,
  kelas_id UUID REFERENCES kelas(id) ON DELETE SET NULL,
  deskripsi TEXT,
  tahun_pelajaran TEXT,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jadwal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hari TEXT NOT NULL CHECK (hari IN ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu')),
  jam_ke INTEGER NOT NULL CHECK (jam_ke BETWEEN 1 AND 10),
  jam_mulai TEXT NOT NULL,
  jam_selesai TEXT NOT NULL,
  kelas_id UUID REFERENCES kelas(id) ON DELETE CASCADE,
  mata_pelajaran_id UUID REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
  guru_id UUID REFERENCES guru(id) ON DELETE SET NULL,
  ruang TEXT,
  keterangan TEXT,
  tahun_pelajaran TEXT NOT NULL,
  semester TEXT DEFAULT 'Ganjil',
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kurikulum (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_kurikulum TEXT NOT NULL,
  deskripsi TEXT,
  tahun_pelajaran TEXT,
  is_active BOOLEAN DEFAULT false,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS perangkat_pembelajaran (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  jenis TEXT NOT NULL CHECK (jenis IN ('RPP', 'Modul Ajar', 'Silabus', 'Prota', 'Promes', 'PH')),
  mata_pelajaran_id UUID REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
  guru_id UUID REFERENCES guru(id) ON DELETE SET NULL,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  file_url TEXT,
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  tahun_pelajaran TEXT,
  semester TEXT,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. MODUL PENILAIAN & RAPOR
-- ============================================

CREATE TABLE IF NOT EXISTS penilaian (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  murid_id UUID REFERENCES murid(id) ON DELETE CASCADE,
  mata_pelajaran_id UUID REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
  kelas_id UUID REFERENCES kelas(id) ON DELETE CASCADE,
  jenis_nilai TEXT NOT NULL CHECK (jenis_nilai IN (
    'PH1', 'PH2', 'PH3', 'PH4', 'PTS', 'PAS', 'PAKET'
  )),
  nilai DECIMAL(5, 2),
  deskripsi TEXT,
  guru_id UUID REFERENCES guru(id) ON DELETE SET NULL,
  tahun_pelajaran TEXT,
  semester TEXT,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rapor (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  murid_id UUID REFERENCES murid(id) ON DELETE CASCADE,
  kelas_id UUID REFERENCES kelas(id) ON DELETE CASCADE,
  tahun_pelajaran TEXT NOT NULL,
  semester TEXT NOT NULL,
  rata_rata DECIMAL(5, 2),
  predikat TEXT,
  rank_kelas INTEGER,
  status_naik BOOLEAN,
  catatan_wali TEXT,
  catatan_kepala TEXT,
  is_locked BOOLEAN DEFAULT false,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rapor_sikap (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  murid_id UUID REFERENCES murid(id) ON DELETE CASCADE,
  kelas_id UUID REFERENCES kelas(id) ON DELETE CASCADE,
  jenis_sikap TEXT NOT NULL CHECK (jenis_sikap IN ('Spiritual', 'Sosial')),
  aspek TEXT NOT NULL,
  predikat TEXT,
  deskripsi TEXT,
  tahun_pelajaran TEXT,
  semester TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. MODUL ABSENSI
-- ============================================

CREATE TABLE IF NOT EXISTS absensi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  murid_id UUID REFERENCES murid(id) ON DELETE CASCADE,
  kelas_id UUID REFERENCES kelas(id) ON DELETE CASCADE,
  jadwal_id UUID REFERENCES jadwal(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('Hadir', 'Izin', 'Sakit', 'Alpha', 'Terlambat')),
  keterangan TEXT,
  guru_id UUID REFERENCES guru(id) ON DELETE SET NULL,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(murid_id, tanggal, jadwal_id)
);

CREATE TABLE IF NOT EXISTS absensi_guru (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  guru_id UUID REFERENCES guru(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('Hadir', 'Izin', 'Sakit', 'Alpha', 'Terlambat', 'Tugas Dinas')),
  jam_masuk TIME,
  jam_keluar TIME,
  keterangan TEXT,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guru_id, tanggal)
);

-- ============================================
-- 8. MODUL KEUANGAN & BOS
-- ============================================

CREATE TABLE IF NOT EXISTS rapbm (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tahun_pelajaran TEXT NOT NULL,
  total_pendapatan DECIMAL(15, 2) DEFAULT 0,
  total_belanja DECIMAL(15, 2) DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  tanggal_approval DATE,
  catatan TEXT,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS keuangan_kategori (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_kategori TEXT NOT NULL,
  jenis TEXT NOT NULL CHECK (jenis IN ('pendapatan', 'belanja')),
  kelompok TEXT,
  is_active BOOLEAN DEFAULT true,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS keuangan_transaksi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  jenis TEXT NOT NULL CHECK (jenis IN ('masuk', 'keluar')),
  kategori_id UUID REFERENCES keuangan_kategori(id) ON DELETE SET NULL,
  deskripsi TEXT NOT NULL,
  nominal DECIMAL(15, 2) NOT NULL,
  sumber_dana TEXT CHECK (sumber_dana IN ('BOS', 'SPP', 'Infaq', 'Hibah', 'Lainnya')),
  bukti_transaksi TEXT,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  tahun_pelajaran TEXT,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS keuangan_anggaran (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kategori_id UUID REFERENCES keuangan_kategori(id) ON DELETE SET NULL,
  anggaran DECIMAL(15, 2) DEFAULT 0,
  realisasi DECIMAL(15, 2) DEFAULT 0,
  tahun_pelajaran TEXT,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. MODUL SARANA & PRASARANA
-- ============================================

CREATE TABLE IF NOT EXISTS sarana (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_barang TEXT NOT NULL,
  kategori TEXT NOT NULL CHECK (kategori IN (
    'Gedung', 'Ruang Kelas', 'Laboratorium', 'Perpustakaan', 
    'Perlengkapan', 'IT', 'Olahraga', 'Seni', 'Lainnya'
  )),
  jumlah INTEGER DEFAULT 1,
  kondisi TEXT DEFAULT 'Baik' CHECK (kondisi IN ('Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang')),
  lokasi TEXT,
  tahun_pengadaan INTEGER,
  sumber_pengadaan TEXT,
  nilai_perolehan DECIMAL(15, 2),
  no_inventaris TEXT,
  foto TEXT,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sarana_laporan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sarana_id UUID REFERENCES sarana(id) ON DELETE CASCADE,
  pelapor TEXT,
  jenis_kerusakan TEXT,
  deskripsi TEXT,
  foto_kerusakan TEXT,
  status TEXT DEFAULT 'dilaporkan' CHECK (status IN (
    'dilaporkan', 'diproses', 'diperbaiki', 'selesai', 'ditolak'
  )),
  tanggal_laporan DATE DEFAULT CURRENT_DATE,
  tanggal_perbaikan DATE,
  biaya_perbaikan DECIMAL(15, 2),
  catatan_perbaikan TEXT,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. MODUL PPDB
-- ============================================

CREATE TABLE IF NOT EXISTS ppdb_pendaftaran (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  no_pendaftaran TEXT UNIQUE NOT NULL,
  nama_lengkap TEXT NOT NULL,
  jenjang TEXT NOT NULL CHECK (jenjang IN ('MI', 'MTs', 'MA', 'MAK')),
  jenis_pendaftaran TEXT CHECK (jenis_pendaftaran IN ('Baru', 'Pindahan')),
  nisn TEXT,
  nik TEXT,
  tempat_lahir TEXT,
  tanggal_lahir DATE,
  jenis_kelamin TEXT CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
  agama TEXT,
  alamat TEXT,
  asal_sekolah TEXT,
  nama_ayah TEXT,
  pekerjaan_ayah TEXT,
  nama_ibu TEXT,
  pekerjaan_ibu TEXT,
  no_hp_ortu TEXT,
  email_ortu TEXT,
  foto TEXT,
  akta_kelahiran TEXT,
  kartu_keluarga TEXT,
  ijazah TEXT,
  skhun TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'verified', 'accepted', 'rejected', 'registered'
  )),
  catatan TEXT,
  nilai_ujian DECIMAL(5, 2),
  urutan_rangking INTEGER,
  tahun_penerimaan TEXT,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. MODUL KALENDER
-- ============================================

CREATE TABLE IF NOT EXISTS kalender (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE,
  kategori TEXT CHECK (kategori IN ('Libur', 'Ujian', 'Acara', 'Kegiatan', 'Upacara', 'Lainnya')),
  warna TEXT DEFAULT '#10B981',
  is_recurring BOOLEAN DEFAULT false,
  tahun_pelajaran TEXT,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. MODUL RUANG
-- ============================================

CREATE TABLE IF NOT EXISTS ruang (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_ruang TEXT NOT NULL,
  gedung TEXT,
  kapasitas INTEGER DEFAULT 30,
  status TEXT DEFAULT 'Tersedia' CHECK (status IN ('Tersedia', 'Digunakan', 'Perawatan')),
  keterangan TEXT,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. MODUL INTEGRASI (EMIS/Dapodik/SIMPATIKA)
-- ============================================

CREATE TABLE IF NOT EXISTS sync_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sumber TEXT NOT NULL CHECK (sumber IN ('EMIS', 'Dapodik', 'SIMPATIKA', 'Manual')),
  jenis_data TEXT NOT NULL,
  jumlah_data INTEGER DEFAULT 0,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'partial', 'failed')),
  catatan TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sync_mapping (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sumber TEXT NOT NULL,
  field_sumber TEXT NOT NULL,
  field_lokal TEXT NOT NULL,
  tipe_konversi TEXT,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. MODUL ORANG TUA / WALI
-- ============================================

CREATE TABLE IF NOT EXISTS ortu (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  nama_lengkap TEXT NOT NULL,
  nik TEXT,
  no_hp TEXT,
  email TEXT,
  alamat TEXT,
  pekerjaan TEXT,
  penghasilan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ortu_murid (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ortu_id UUID REFERENCES ortu(id) ON DELETE CASCADE,
  murid_id UUID REFERENCES murid(id) ON DELETE CASCADE,
  hubungan TEXT CHECK (hubungan IN ('Ayah', 'Ibu', 'Wali')),
  is_primary BOOLEAN DEFAULT false,
  UNIQUE(ortu_id, murid_id)
);

-- ============================================
-- 15. MODUL BONUS & PRESTASI
-- ============================================

CREATE TABLE IF NOT EXISTS prestasi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  murid_id UUID REFERENCES murid(id) ON DELETE CASCADE,
  jenis TEXT CHECK (jenis IN ('Akademik', 'Non-Akademik', 'Olahraga', 'Seni', 'Keagamaan')),
  nama_prestasi TEXT NOT NULL,
  tingkat TEXT CHECK (tingkat IN ('Kelas', 'Sekolah', 'Kecamatan', 'Kabupaten', 'Provinsi', 'Nasional', 'Internasional')),
  tahun INTEGER,
  catatan TEXT,
  sertifikat TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 16. MODUL PENGUMUMAN & RUNNING TEXT
-- ============================================

CREATE TABLE IF NOT EXISTS pengumuman (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  isi TEXT NOT NULL,
  deskripsi TEXT,
  prioritas TEXT DEFAULT 'normal' CHECK (prioritas IN ('tinggi', 'sedang', 'normal')),
  aktif BOOLEAN DEFAULT true,
  tanggal_mulai DATE DEFAULT CURRENT_DATE,
  tanggal_akhir DATE,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS running_text (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teks TEXT NOT NULL,
  aktif BOOLEAN DEFAULT true,
  urutan INTEGER DEFAULT 0,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 17. MODUL BEL OTOMATIS
-- ============================================

CREATE TABLE IF NOT EXISTS bel_jadwal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hari INTEGER[] NOT NULL,
  waktu TEXT NOT NULL,
  nama TEXT NOT NULL,
  jenis TEXT NOT NULL CHECK (jenis IN (
    'masuk', 'pergantian', 'istirahat', 'shalat_dhuha', 'shalat_dzuhur', 'pulang', 'ekstrakurikuler', 'khusus'
  )),
  guru TEXT DEFAULT '',
  kelas TEXT DEFAULT '',
  suara TEXT DEFAULT 'bawaan',
  durasi INTEGER DEFAULT 0,
  aktif BOOLEAN DEFAULT true,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bel_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  waktu TIMESTAMPTZ DEFAULT NOW(),
  jadwal_id UUID REFERENCES bel_jadwal(id) ON DELETE SET NULL,
  nama TEXT,
  jenis TEXT,
  suara TEXT,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL
);

-- ============================================
-- 18. MODUL KRITIK & SARAN
-- ============================================

CREATE TABLE IF NOT EXISTS kritik_saran (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT,
  email TEXT,
  kategori TEXT DEFAULT 'saran' CHECK (kategori IN ('kritik', 'saran', 'apresiasi', 'keluhan', 'lainnya')),
  isi TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  status TEXT DEFAULT 'baru' CHECK (status IN ('baru', 'dibaca', 'ditindaklanjuti', 'selesai')),
  balasan TEXT,
  anonim BOOLEAN DEFAULT false,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 19. MODUL PENGATURAN SISTEM
-- ============================================

CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  madrasah_id UUID REFERENCES madrasah(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_guru_nip ON guru(nip);
CREATE INDEX IF NOT EXISTS idx_guru_nuptk ON guru(nuptk);
CREATE INDEX IF NOT EXISTS idx_guru_madrasah ON guru(madrasah_id);
CREATE INDEX IF NOT EXISTS idx_murid_nisn ON murid(nisn);
CREATE INDEX IF NOT EXISTS idx_murid_kelas ON murid(kelas_id);
CREATE INDEX IF NOT EXISTS idx_murid_nama ON murid(nama_lengkap);
CREATE INDEX IF NOT EXISTS idx_murid_madrasah ON murid(madrasah_id);
CREATE INDEX IF NOT EXISTS idx_kelas_tp ON kelas(tahun_pelajaran);
CREATE INDEX IF NOT EXISTS idx_jadwal_hari ON jadwal(hari);
CREATE INDEX IF NOT EXISTS idx_jadwal_kelas ON jadwal(kelas_id);
CREATE INDEX IF NOT EXISTS idx_absensi_tanggal ON absensi(tanggal);
CREATE INDEX IF NOT EXISTS idx_absensi_kelas ON absensi(kelas_id);
CREATE INDEX IF NOT EXISTS idx_penilaian_murid ON penilaian(murid_id);
CREATE INDEX IF NOT EXISTS idx_penilaian_mapel ON penilaian(mata_pelajaran_id);
CREATE INDEX IF NOT EXISTS idx_keuangan_tanggal ON keuangan_transaksi(tanggal);
CREATE INDEX IF NOT EXISTS idx_kalender_tanggal ON kalender(tanggal_mulai);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_table ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_ppdb_status ON ppdb_pendaftaran(status);
CREATE INDEX IF NOT EXISTS idx_sarana_kategori ON sarana(kategori);
CREATE INDEX IF NOT EXISTS idx_pengumuman_aktif ON pengumuman(aktif);
CREATE INDEX IF NOT EXISTS idx_bel_jadwal_hari ON bel_jadwal USING GIN(hari);
CREATE INDEX IF NOT EXISTS idx_bel_log_waktu ON bel_log(waktu);
CREATE INDEX IF NOT EXISTS idx_kritik_saran_status ON kritik_saran(status);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_jumlah_murid()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE kelas SET jumlah_murid = (
      SELECT COUNT(*) FROM murid WHERE kelas_id = NEW.kelas_id AND status_aktif = true
    ) WHERE id = NEW.kelas_id;
    IF TG_OP = 'UPDATE' AND OLD.kelas_id != NEW.kelas_id THEN
      UPDATE kelas SET jumlah_murid = (
        SELECT COUNT(*) FROM murid WHERE kelas_id = OLD.kelas_id AND status_aktif = true
      ) WHERE id = OLD.kelas_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE kelas SET jumlah_murid = (
      SELECT COUNT(*) FROM murid WHERE kelas_id = OLD.kelas_id AND status_aktif = true
    ) WHERE id = OLD.kelas_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_jumlah_murid
  AFTER INSERT OR UPDATE OR DELETE ON murid
  FOR EACH ROW EXECUTE FUNCTION update_jumlah_murid();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_guru_updated BEFORE UPDATE ON guru FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_murid_updated BEFORE UPDATE ON murid FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_kelas_updated BEFORE UPDATE ON kelas FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_jadwal_updated BEFORE UPDATE ON jadwal FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_kalender_updated BEFORE UPDATE ON kalender FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_penilaian_updated BEFORE UPDATE ON penilaian FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_keuangan_updated BEFORE UPDATE ON keuangan_transaksi FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_sarana_updated BEFORE UPDATE ON sarana FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_ppdb_updated BEFORE UPDATE ON ppdb_pendaftaran FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_rapbm_updated BEFORE UPDATE ON rapbm FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_pengumuman_updated BEFORE UPDATE ON pengumuman FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_kritik_saran_updated BEFORE UPDATE ON kritik_saran FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_settings_updated BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE guru ENABLE ROW LEVEL SECURITY;
ALTER TABLE murid ENABLE ROW LEVEL SECURITY;
ALTER TABLE kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mata_pelajaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE jadwal ENABLE ROW LEVEL SECURITY;
ALTER TABLE absensi ENABLE ROW LEVEL SECURITY;
ALTER TABLE absensi_guru ENABLE ROW LEVEL SECURITY;
ALTER TABLE penilaian ENABLE ROW LEVEL SECURITY;
ALTER TABLE rapor ENABLE ROW LEVEL SECURITY;
ALTER TABLE rapor_sikap ENABLE ROW LEVEL SECURITY;
ALTER TABLE kalender ENABLE ROW LEVEL SECURITY;
ALTER TABLE sarana ENABLE ROW LEVEL SECURITY;
ALTER TABLE sarana_laporan ENABLE ROW LEVEL SECURITY;
ALTER TABLE keuangan_transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE keuangan_kategori ENABLE ROW LEVEL SECURITY;
ALTER TABLE keuangan_anggaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppdb_pendaftaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE madrasah ENABLE ROW LEVEL SECURITY;
ALTER TABLE tahun_pelajaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE semester ENABLE ROW LEVEL SECURITY;
ALTER TABLE wali_kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE kurikulum ENABLE ROW LEVEL SECURITY;
ALTER TABLE perangkat_pembelajaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE ruang ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortu ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortu_murid ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE ptk_verifikasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE guru_tunjangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE guru_riwayat ENABLE ROW LEVEL SECURITY;
ALTER TABLE rapbm ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengumuman ENABLE ROW LEVEL SECURITY;
ALTER TABLE running_text ENABLE ROW LEVEL SECURITY;
ALTER TABLE bel_jadwal ENABLE ROW LEVEL SECURITY;
ALTER TABLE bel_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE kritik_saran ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: Admin = full access
-- Guru = baca semua, tulis terbatas
-- Ortu = baca data anak saja
-- Publik = baca pengumuman + ppdb only
-- ============================================

-- ADMIN FULL ACCESS: semua tabel utama
DO $$ DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'guru', 'murid', 'kelas', 'mata_pelajaran', 'jadwal',
    'absensi', 'absensi_guru', 'penilaian', 'rapor', 'rapor_sikap',
    'kalender', 'sarana', 'sarana_laporan', 'keuangan_transaksi',
    'keuangan_kategori', 'keuangan_anggaran', 'ppdb_pendaftaran',
    'audit_log', 'madrasah', 'tahun_pelajaran', 'semester',
    'wali_kelas', 'kurikulum', 'perangkat_pembelajaran', 'ruang',
    'sync_log', 'sync_mapping', 'ortu', 'ortu_murid', 'prestasi',
    'ptk_verifikasi', 'guru_tunjangan', 'guru_riwayat', 'rapbm',
    'bel_jadwal', 'bel_log', 'settings'
  ]) LOOP
    EXECUTE format('
      CREATE POLICY "admin_full_%s" ON %s FOR ALL USING (is_admin());
    ', t, t);
  END LOOP;
END $$;

-- GURU: baca semua data akademik, tulis absensi + penilaian sendiri
CREATE POLICY "guru_read_data" ON guru FOR SELECT USING (get_user_role() = 'guru');
CREATE POLICY "guru_read_murid" ON murid FOR SELECT USING (get_user_role() = 'guru');
CREATE POLICY "guru_read_kelas" ON kelas FOR SELECT USING (get_user_role() = 'guru');
CREATE POLICY "guru_read_mapel" ON mata_pelajaran FOR SELECT USING (get_user_role() = 'guru');
CREATE POLICY "guru_read_jadwal" ON jadwal FOR SELECT USING (get_user_role() = 'guru');
CREATE POLICY "guru_read_penilaian" ON penilaian FOR SELECT USING (get_user_role() = 'guru');
CREATE POLICY "guru_write_penilaian" ON penilaian FOR INSERT WITH CHECK (get_user_role() = 'guru');
CREATE POLICY "guru_update_penilaian" ON penilaian FOR UPDATE USING (get_user_role() = 'guru');
CREATE POLICY "guru_read_absensi" ON absensi FOR SELECT USING (get_user_role() = 'guru');
CREATE POLICY "guru_write_absensi" ON absensi FOR INSERT WITH CHECK (get_user_role() = 'guru');
CREATE POLICY "guru_update_absensi" ON absensi FOR UPDATE USING (get_user_role() = 'guru');
CREATE POLICY "guru_read_absensi_guru" ON absensi_guru FOR SELECT USING (get_user_role() = 'guru');
CREATE POLICY "guru_read_kalender" ON kalender FOR SELECT USING (get_user_role() = 'guru');
CREATE POLICY "guru_read_rapor" ON rapor FOR SELECT USING (get_user_role() = 'guru');
CREATE POLICY "guru_read_pengumuman" ON pengumuman FOR SELECT USING (get_user_role() = 'guru');
CREATE POLICY "guru_read_bel_jadwal" ON bel_jadwal FOR SELECT USING (get_user_role() = 'guru');

-- ORTU: baca data anak saja
CREATE POLICY "ortu_read_murid" ON murid FOR SELECT USING (
  get_user_role() = 'ortu' AND (
    EXISTS (SELECT 1 FROM ortu_murid om
            JOIN ortu o ON o.id = om.ortu_id
            WHERE om.murid_id = murid.id AND o.user_id = auth.uid())
  )
);
CREATE POLICY "ortu_read_kelas" ON kelas FOR SELECT USING (get_user_role() = 'ortu');
CREATE POLICY "ortu_read_absensi" ON absensi FOR SELECT USING (
  get_user_role() = 'ortu' AND EXISTS (
    SELECT 1 FROM murid m
    JOIN ortu_murid om ON om.murid_id = m.id
    JOIN ortu o ON o.id = om.ortu_id
    WHERE absensi.murid_id = m.id AND o.user_id = auth.uid()
  )
);
CREATE POLICY "ortu_read_penilaian" ON penilaian FOR SELECT USING (
  get_user_role() = 'ortu' AND EXISTS (
    SELECT 1 FROM murid m
    JOIN ortu_murid om ON om.murid_id = m.id
    JOIN ortu o ON o.id = om.ortu_id
    WHERE penilaian.murid_id = m.id AND o.user_id = auth.uid()
  )
);
CREATE POLICY "ortu_read_rapor" ON rapor FOR SELECT USING (
  get_user_role() = 'ortu' AND EXISTS (
    SELECT 1 FROM murid m
    JOIN ortu_murid om ON om.murid_id = m.id
    JOIN ortu o ON o.id = om.ortu_id
    WHERE rapor.murid_id = m.id AND o.user_id = auth.uid()
  )
);
CREATE POLICY "ortu_read_kalender" ON kalender FOR SELECT USING (get_user_role() = 'ortu');
CREATE POLICY "ortu_read_pengumuman" ON pengumuman FOR SELECT USING (get_user_role() = 'ortu');
CREATE POLICY "ortu_read_mata_pelajaran" ON mata_pelajaran FOR SELECT USING (get_user_role() = 'ortu');
CREATE POLICY "ortu_read_jadwal" ON jadwal FOR SELECT USING (get_user_role() = 'ortu');

-- PPDB: publik bisa baca + insert (form pendaftaran), admin bisa full
CREATE POLICY "ppdb_public_read" ON ppdb_pendaftaran FOR SELECT USING (true);
CREATE POLICY "ppdb_public_insert" ON ppdb_pendaftaran FOR INSERT WITH CHECK (true);
CREATE POLICY "ppdb_admin_full" ON ppdb_pendaftaran FOR ALL USING (is_admin());

-- KRITIK_SARAN: semua bisa baca + insert
CREATE POLICY "kritik_read_all" ON kritik_saran FOR SELECT USING (true);
CREATE POLICY "kritik_insert_all" ON kritik_saran FOR INSERT WITH CHECK (true);
CREATE POLICY "kritik_admin_manage" ON kritik_saran FOR UPDATE USING (is_admin());
CREATE POLICY "kritik_admin_delete" ON kritik_saran FOR DELETE USING (is_admin());

-- PENGUMUMAN: semua user bisa baca
CREATE POLICY "pengumuman_read_all" ON pengumuman FOR SELECT USING (true);
CREATE POLICY "pengumuman_admin_manage" ON pengumuman FOR ALL USING (is_admin());

-- RUNNING_TEXT: semua user bisa baca
CREATE POLICY "running_text_read_all" ON running_text FOR SELECT USING (true);
CREATE POLICY "running_text_admin_manage" ON running_text FOR ALL USING (is_admin());

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO tahun_pelajaran (nama, is_active, tanggal_mulai, tanggal_selesai) VALUES
  ('2025/2026', true, '2025-07-01', '2026-06-30'),
  ('2024/2025', false, '2024-07-01', '2025-06-30');

INSERT INTO semester (nama, tahun_pelajaran_id, is_active, tanggal_mulai, tanggal_selesai)
SELECT 'Ganjil', id, true, '2025-07-01', '2025-12-31' FROM tahun_pelajaran WHERE nama = '2025/2026';
INSERT INTO semester (nama, tahun_pelajaran_id, is_active, tanggal_mulai, tanggal_selesai)
SELECT 'Genap', id, false, '2026-01-02', '2026-06-30' FROM tahun_pelajaran WHERE nama = '2025/2026';

-- Default madrasah
INSERT INTO madrasah (id, npsn, nama_madrasah, jenjang, alamat, kabupaten, provinsi, status, akreditasi) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '11111111', 'MI Al-Hikmah', 'MI', 'Jl. Pendidikan No. 1', 'Kota Jakarta', 'DKI Jakarta', 'Aktif', 'A'),
  ('550e8400-e29b-41d4-a716-446655440002', '22222222', 'MTs Nurul Iman', 'MTs', 'Jl. Pesantren No. 10', 'Kota Jakarta', 'DKI Jakarta', 'Aktif', 'B'),
  ('550e8400-e29b-41d4-a716-446655440003', '33333333', 'MA Al-Azhar', 'MA', 'Jl. Ilmu No. 5', 'Kota Jakarta', 'DKI Jakarta', 'Aktif', 'A'),
  ('550e8400-e29b-41d4-a716-446655440004', '44444444', 'MAK Darul Ulum', 'MAK', 'Jl. Keahlian No. 3', 'Kota Jakarta', 'DKI Jakarta', 'Aktif', 'B');

-- NOTE: Admin user dibuat via auth_security.sql (Supabase Auth, bukan tabel users)

-- Default guru
INSERT INTO guru (id, nip, nuptk, nama_lengkap, jenis_kelamin, tempat_lahir, tanggal_lahir, status_guru, status_pegawai, mata_pelajaran, jabatan, golongan, madrasah_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440201', '198501012010011001', '1234567890123456', 'Ahmad Fauzi, S.Pd.I', 'Laki-laki', 'Jakarta', '1985-01-01', 'Aktif', 'PNS', 'Al-Qur''an Hadis', 'Guru', 'III/c', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440202', '198702022010012002', '2345678901234567', 'Siti Aminah, S.Pd', 'Perempuan', 'Bandung', '1987-02-02', 'Aktif', 'PNS', 'Fiqih', 'Guru', 'III/c', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440203', '198803032010013003', '3456789012345678', 'Muhammad Ridwan, S.Ag', 'Laki-laki', 'Surabaya', '1988-03-03', 'Aktif', 'PNS', 'Aqidah Akhlak', 'Guru', 'III/b', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440204', '199004042010014004', '4567890123456789', 'Fatimah Azzahra, S.Pd', 'Perempuan', 'Yogyakarta', '1990-04-04', 'Aktif', 'PPPK', 'Bahasa Arab', 'Guru', 'III/a', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440205', '199105052010015005', '5678901234567890', 'Abdullah Saleh, S.Pd.I', 'Laki-laki', 'Medan', '1991-05-05', 'Aktif', 'GTY', 'Prakarya dan IPS', 'Guru', NULL, '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440206', '199206062010016006', '6789012345678901', 'Aisyah Putri, S.Pd', 'Perempuan', 'Semarang', '1992-06-06', 'Aktif', 'GTY', 'Matematika', 'Guru', NULL, '550e8400-e29b-41d4-a716-446655440001');

-- Default kelas (tanpa rombel)
INSERT INTO kelas (id, nama_kelas, tingkat, rombel, ruang, tahun_pelajaran, kapasitas, jumlah_murid, madrasah_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440301', 'Kelas 1', 1, '', 'Ruang 1', '2025/2026', 30, 0, '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440302', 'Kelas 2', 2, '', 'Ruang 2', '2025/2026', 30, 0, '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440303', 'Kelas 3', 3, '', 'Ruang 3', '2025/2026', 30, 0, '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440304', 'Kelas 4', 4, '', 'Ruang 4', '2025/2026', 30, 0, '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440305', 'Kelas 5', 5, '', 'Ruang 5', '2025/2026', 30, 0, '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440306', 'Kelas 6', 6, '', 'Ruang 6', '2025/2026', 30, 0, '550e8400-e29b-41d4-a716-446655440001');

-- Default mata pelajaran
INSERT INTO mata_pelajaran (id, kode_mapel, nama_mapel, kelompok, jam_pelajaran, tahun_pelajaran, madrasah_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440401', 'QH01', 'Al-Qur''an Hadis', 'A', 4, '2025/2026', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440402', 'FI02', 'Fiqih', 'A', 3, '2025/2026', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440403', 'AK03', 'Aqidah Akhlak', 'A', 3, '2025/2026', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440404', 'BA04', 'Bahasa Arab', 'A', 3, '2025/2026', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440405', 'PI05', 'Prakarya dan IPS', 'B', 4, '2025/2026', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440406', 'MT06', 'Matematika', 'B', 4, '2025/2026', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440407', 'IN07', 'Bahasa Indonesia', 'B', 4, '2025/2026', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440408', 'IP08', 'IPA', 'B', 3, '2025/2026', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440409', 'PJ09', 'Pendidikan Jasmani', 'B', 2, '2025/2026', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440410', 'SB10', 'Seni Budaya', 'B', 2, '2025/2026', '550e8400-e29b-41d4-a716-446655440001');

-- Keuangan Kategori
INSERT INTO keuangan_kategori (nama_kategori, jenis, kelompok) VALUES
  ('Dana BOS', 'pendapatan', 'Pemerintah'),
  ('SPP', 'pendapatan', 'Siswa'),
  ('Infaq', 'pendapatan', 'Donasi'),
  ('Hibah', 'pendapatan', 'Donasi'),
  ('Gaji & Tunjangan', 'belanja', 'Kepegawaian'),
  ('Pemeliharaan', 'belanja', 'Sarana'),
  ('Listrik & Air', 'belanja', 'Operasional'),
  ('Perlengkapan', 'belanja', 'Operasional'),
  ('Kegiatan Belajar', 'belanja', 'Akademik'),
  ('Lain-lain', 'belanja', 'Umum');


