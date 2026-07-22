// ============================================
// MADRASAHOPS INTEGRATED - CONFIGURATION
// ============================================

const SUPABASE_URL = 'https://qbuvszefnmymagrlhrje.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFidXZzemVmbm15bWFncmxocmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3Mzg1NjIsImV4cCI6MjEwMDMxNDU2Mn0.3hvx3RkR6r3r9iicBf_gJIwmNF16O6WoxS9q2Hu-_ow';

let supabase = null;

function initSupabase() {
  // Skip jika masih placeholder
  if (!SUPABASE_URL || SUPABASE_URL.includes('YOUR_') || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('YOUR_')) {
    console.warn('Supabase belum dikonfigurasi. Mode offline (localStorage).');
    supabase = null;
    return null;
  }
  try {
    const S = window.supabase || window._supabase;
    if (S && S.createClient) {
      supabase = S.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
      console.warn('Supabase JS library belum dimuat dari CDN.');
      supabase = null;
    }
  } catch (e) {
    console.warn('Gagal init Supabase:', e.message);
    supabase = null;
  }
  return supabase;
}

const APP_CONFIG = {
  appName: 'SI-MANTAP',
  version: '2.0.0',
  tagline: 'Sistem Informasi Madrasah Yang Amanah & Terpusat',
  maxUploadSize: 5 * 1024 * 1024,
  itemsPerPage: 15,
  autoSaveInterval: 30000,
};

const TIME_SLOTS = [
  { jam_ke: 1, mulai: '07:00', selesai: '07:35' },
  { jam_ke: 2, mulai: '07:35', selesai: '08:10' },
  { jam_ke: 3, mulai: '08:10', selesai: '08:45' },
  { jam_ke: 4, mulai: '08:45', selesai: '09:20' },
  { jam_ke: 5, mulai: '09:20', selesai: '09:55' },
  { jam_ke: 6, mulai: '10:15', selesai: '10:50' },
  { jam_ke: 7, mulai: '10:50', selesai: '11:25' },
  { jam_ke: 8, mulai: '11:25', selesai: '12:00' },
  { jam_ke: 9, mulai: '12:30', selesai: '13:05' },
  { jam_ke: 10, mulai: '13:05', selesai: '13:40' },
];

const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const JENJANG_MAP = {
  MI: { label: 'Madrasah Ibtidaiyah', color: 'green', tingkat: [1,2,3,4,5,6] },
  MTs: { label: 'Madrasah Tsanawiyah', color: 'blue', tingkat: [7,8,9] },
  MA: { label: 'Madrasah Aliyah', color: 'purple', tingkat: [10,11,12] },
  MAK: { label: 'Madrasah Aliyah Kejuruan', color: 'orange', tingkat: [10,11,12] },
};

const KELOMPOK_MAPEL = [
  { value: 'A', label: 'Kelompok A (Umum Keagamaan)' },
  { value: 'B', label: 'Kelompok B (Umum)' },
  { value: 'C', label: 'Kelompok C (Kejuruan)' },
];

const ROLES = {
  super_admin: { label: 'Admin / Operator', color: 'red', icon: 'Crown' },
  guru: { label: 'Guru', color: 'teal', icon: 'GraduationCap' },
  ortu: { label: 'Orang Tua', color: 'pink', icon: 'Heart' },
};

const ABSENSI_STATUS = [
  { value: 'Hadir', color: 'green', bg: 'bg-green-100 text-green-800' },
  { value: 'Izin', color: 'yellow', bg: 'bg-yellow-100 text-yellow-800' },
  { value: 'Sakit', color: 'blue', bg: 'bg-blue-100 text-blue-800' },
  { value: 'Alpha', color: 'red', bg: 'bg-red-100 text-red-800' },
  { value: 'Terlambat', color: 'orange', bg: 'bg-orange-100 text-orange-800' },
];

const ABSENSI_GURU_STATUS = [
  ...ABSENSI_STATUS,
  { value: 'Tugas Dinas', color: 'purple', bg: 'bg-purple-100 text-purple-800' },
];

const KALENDER_KATEGORI = [
  { value: 'Libur', color: '#EF4444' },
  { value: 'Ujian', color: '#F59E0B' },
  { value: 'Acara', color: '#3B82F6' },
  { value: 'Kegiatan', color: '#10B981' },
  { value: 'Upacara', color: '#8B5CF6' },
  { value: 'Lainnya', color: '#6B7280' },
];

const KEUANGAN_SUMBER_DANA = ['BOS', 'SPP', 'Infaq', 'Hibah', 'Lainnya'];

const PPDB_STATUS = [
  { value: 'pending', label: 'Menunggu Verifikasi', color: 'yellow' },
  { value: 'verified', label: 'Terverifikasi', color: 'blue' },
  { value: 'accepted', label: 'Diterima', color: 'green' },
  { value: 'rejected', label: 'Ditolak', color: 'red' },
  { value: 'registered', label: 'Terdaftar', color: 'purple' },
];

const SARANA_KONDISI = [
  { value: 'Baik', color: 'green' },
  { value: 'Rusak Ringan', color: 'yellow' },
  { value: 'Rusak Berat', color: 'red' },
  { value: 'Hilang', color: 'gray' },
];

const ROLE_ACCESS = {
  super_admin: ['*','manajemen_user'],
  guru: ['dashboard','murid','jadwal','absensi','absensi_guru','kalender','penilaian','kurikulum','kritik_saran','pengumuman'],
  ortu: ['dashboard','kalender','absensi','penilaian','kritik_saran'],
};

const PAGE_SUBTITLES = {
  guru: 'Manajemen data pendidik dan tenaga kependidikan',
  murid: 'Manajemen data peserta didik',
  absensi: 'Pencatatan kehadiran siswa harian',
  penilaian: 'Input dan manajemen nilai siswa',
};
