// ============================================
// SI-MANTAP - EMIS 4.0 IMPORT ENGINE
// ============================================

const EmisImport = {
  currentTab: 'siswa',
  previewData: [],
  errors: [],

  // EMIS 4.0 field mappings - sesuai format export EMIS 4.0 Kemenag
  EMIS_FIELDS: {
    siswa: {
      required: ['nama_lengkap'],
      optional: ['nisn','nik','tempat_lahir','tanggal_lahir','tingkat_rombel','tingkat','status','jenis_kelamin','alamat','no_telepon','nama_ayah','nama_ibu','nama_wali','kebutuhan_khusus','disabilitas','nomor_kip','nama_rombel'],
      aliases: {
        'NO': '_skip', 'NAMA LENGKAP': 'nama_lengkap', 'NISN': 'nisn', 'NIK': 'nik',
        'TEMPAT LAHIR': 'tempat_lahir', 'TANGGAL LAHIR': 'tanggal_lahir',
        'TINGKAT - ROMBEL': 'tingkat_rombel',
        'UMUR': '_skip', 'STATUS': 'status', 'JENIS KELAMIN': 'jenis_kelamin',
        'ALAMAT': 'alamat', 'NO TELEPON': 'no_telepon',
        'KEBUTUHAN KHUSUS': 'kebutuhan_khusus', 'DISABILITAS': 'disabilitas',
        'NOMOR KIP/PIP': 'nomor_kip', 'NOMOR KIP': 'nomor_kip',
        'NAMA AYAH KANDUNG': 'nama_ayah', 'NAMA IBU KANDUNG': 'nama_ibu', 'NAMA WALI': 'nama_wali',
        'NAMA AYAH': 'nama_ayah', 'NAMA IBU': 'nama_ibu',
        'JK': 'jenis_kelamin', 'GENDER': 'jenis_kelamin',
        'NO HP': 'no_telepon', 'NO_HP': 'no_telepon', 'TELEPON': 'no_telepon',
        'KELAS': 'tingkat_rombel', 'ROMBEL': 'tingkat_rombel',
      }
    },
    guru: {
      required: ['nama_lengkap'],
      optional: ['nik','nuptk','status_pegawai','nip','jenis_kelamin','tempat_lahir','tanggal_lahir','no_hp','email','mata_pelajaran','tugas','penempatan','total_jtm'],
      aliases: {
        'NAMA LENGKAP': 'nama_lengkap', 'NIK': 'nik', 'NUPTK': 'nuptk',
        'STATUS KEPEGAWAIAN': 'status_pegawai', 'NIP': 'nip',
        'JENIS KELAMIN': 'jenis_kelamin', 'TEMPAT LAHIR': 'tempat_lahir',
        'TANGGAL LAHIR': 'tanggal_lahir', 'NOMOR HANDPHONE': 'no_hp',
        'EMAIL': 'email', 'EMAIL AKUN MADRASAH DIGITAL': '_skip',
        'PASSWORD AWAL': '_skip', 'TUGAS': 'tugas',
        'MATA PELAJARAN': 'mata_pelajaran', 'PENEMPATAN': 'penempatan',
        'TOTAL JTM': 'total_jtm', 'EMAIL AKUN MADRASAH HEBAT': '_skip',
        'JK': 'jenis_kelamin', 'NO HP': 'no_hp', 'TELEPON': 'no_hp',
        'MAPEL': 'mata_pelajaran', 'GOLONGAN': '_skip',
      }
    },
    kelas: {
      required: ['nama_kelas'],
      optional: ['tingkat','rombel','ruang','kapasitas','tahun_pelajaran','wali_kelas','kurikulum','jurusan'],
      aliases: {
        'NAMA KELAS': 'nama_kelas', 'KELAS': 'nama_kelas', 'NAMA ROMBEL': 'nama_kelas', 'ROMBEL': 'nama_kelas',
        'TINGKAT': 'tingkat', 'TINGKAT KELAS': 'tingkat', 'JENJANG': 'tingkat',
        'WALI KELAS': 'wali_kelas', 'WALI': 'wali_kelas', 'GURU WALI': 'wali_kelas',
        'RUANG': 'ruang', 'NAMA RUANGAN': 'ruang', 'RUANGAN': 'ruang',
        'KAPASITAS': 'kapasitas', 'KAPASITAS SISWA': 'kapasitas',
        'TAHUN PELAJARAN': 'tahun_pelajaran', 'TAHUN AJARAN': 'tahun_pelajaran', 'TAHUN': 'tahun_pelajaran',
        'KURIKULUM': 'kurikulum', 'JURUSAN': 'jurusan',
      }
    }
  },

  EMIS_TEMPLATES: {
    siswa: 'No,Nama Lengkap,NISN,NIK,Tempat Lahir,Tanggal Lahir,Tingkat - Rombel,Umur,Status,Jenis Kelamin,Alamat,No Telepon,Kebutuhan Khusus,Disabilitas,Nomor KIP/PIP,Nama Ayah Kandung,Nama Ibu Kandung,Nama Wali\n1,AHMAD FAUZI,0051234567,3509091404870001,JEMBER,2014-05-01,Kelas 1 - Kelas 1,11 th 1 bln,Aktif,Laki-laki,Jl. Mawar No. 1 Bangsalsari Jember,081234567890,Tidak Ada,Tidak Ada,,SANTOSO,SITI AMINAH,SANTOSO\n2,SITI NURHALIZA,0051234568,3509095704140002,JEMBER,2014-03-15,Kelas 1 - Kelas 1,12 th 3 bln,Aktif,Perempuan,Curahkalong Tengah Bangsalsari Jember,081234567891,Tidak Ada,Tidak Ada,,AHMAD HIDAYAT,RAHMAWATI,AHMAD HIDAYAT',
    guru: 'Nama Lengkap,NIK,NUPTK,Status Kepegawaian,NIP,Jenis Kelamin,Tempat Lahir,Tanggal Lahir,Nomor Handphone,Email,Mata Pelajaran,Penempatan,Total JTM\nACH. ANWARI,3509091404870001,1746765667200012,Non PNS,,Laki-laki,JEMBER,1987-04-14,082338872202,achanwari319@gmail.com,,Satminkal,6\nFAISOL S.Pd.I,3509092506810007,20577596,Non PNS,,Laki-laki,JEMBER,1981-06-25,085230133440,raihanwiwik38@gmail.com,,Satminkal,6',
    kelas: 'Nama Kelas,Tingkat,Rombel,Ruang,Kapasitas,Tahun Pelajaran,Kurikulum\n1,1,,Ruang 1,30,2025/2026,Kurikulum Merdeka\n2,1,,Ruang 2,30,2025/2026,Kurikulum Merdeka\n3,2,,Ruang 3,30,2025/2026,Kurikulum Merdeka\n4,2,,Ruang 4,30,2025/2026,Kurikulum Merdeka\n5,3,,Ruang 5,30,2025/2026,Kurikulum Merdeka\n6,3,,Ruang 6,30,2025/2026,Kurikulum Merdeka',
  },

  render() {
    const page = document.getElementById('activePage');
    page.innerHTML = `
      <div class="mb-6">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 class="text-xl font-bold">Import Data EMIS 4.0</h2>
            <p class="text-sm text-gray-500 mt-1">Import data dari sistem EMIS Kemenag (export Excel/CSV)</p>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-outline text-sm" onclick="EmisImport.downloadAllTemplates()">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Download Semua Template
            </button>
          </div>
        </div>

        <div class="flex gap-1 border-b border-gray-200 mb-0">
          <button class="emis-tab active" onclick="EmisImport.switchTab('siswa')" id="tab-siswa">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Siswa
          </button>
          <button class="emis-tab" onclick="EmisImport.switchTab('guru')" id="tab-guru">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Guru / PTK
          </button>
          <button class="emis-tab" onclick="EmisImport.switchTab('kelas')" id="tab-kelas">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            Kelas / Rombel
          </button>
        </div>
      </div>

      <div id="emisImportContent"></div>
    `;
    this.renderTabContent();
  },

  renderTabContent() {
    const el = document.getElementById('emisImportContent');
    const tab = this.currentTab;
    const fields = this.EMIS_FIELDS[tab];
    const template = this.EMIS_TEMPLATES[tab];
    const count = JSON.parse(localStorage.getItem('mops_' + (tab === 'guru' ? 'guru' : tab === 'siswa' ? 'murid' : 'kelas')) || '[]').length;

    el.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="card">
            <div class="card-header">
              <h3 class="font-bold">Upload File ${tab === 'siswa' ? 'Siswa' : tab === 'guru' ? 'Guru / PTK' : 'Kelas / Rombel'}</h3>
              <div class="flex gap-2">
                <button class="btn btn-sm btn-outline" onclick="EmisImport.downloadTemplate()">
                  <svg class="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  Download Template
                </button>
              </div>
            </div>
            <div class="card-body">
              <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition cursor-pointer" onclick="EmisImport.selectFile()" id="dropZone">
                <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                <p class="text-gray-500 font-medium">Klik atau seret file ke sini</p>
                <p class="text-xs text-gray-400 mt-1">Format: .csv, .tsv, .xlsx (max 5MB)</p>
                <p class="text-xs text-gray-400">File EMIS 4.0 langsung bisa di-import</p>
              </div>
            </div>
          </div>

          <div id="emisPreview" class="hidden mt-4">
            <div class="card">
              <div class="card-header">
                <h3 class="font-bold">Preview Data</h3>
                <div class="flex gap-2">
                  <span class="badge badge-green" id="previewValid">0 valid</span>
                  <span class="badge badge-red" id="previewError">0 error</span>
                </div>
              </div>
              <div class="card-body">
                <div id="emisErrorList" class="hidden mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm"></div>
                <div class="table-container max-h-80 overflow-y-auto" id="previewTable"></div>
              </div>
              <div class="card-body border-t">
                <div class="flex justify-between items-center">
                  <div class="text-sm text-gray-500">
                    <span id="previewTotal">0</span> baris akan diimport
                    <span class="text-xs text-gray-400 ml-2">(mengganti data lama jika NISN/NIP sudah ada)</span>
                  </div>
                  <div class="flex gap-2">
                    <button class="btn btn-outline" onclick="EmisImport.clearPreview()">Batal</button>
                    <button class="btn btn-primary" onclick="EmisImport.executeImport()" id="btnImport">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                      Import Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="card">
            <div class="card-header"><h3 class="font-bold text-sm">Petunjuk Import</h3></div>
            <div class="card-body space-y-3 text-sm">
              <div class="flex gap-2"><span class="text-emerald-500 font-bold">1.</span><span>Export data dari EMIS 4.0 (Daftar Siswa / Daftar GTK)</span></div>
              <div class="flex gap-2"><span class="text-emerald-500 font-bold">2.</span><span>Upload file .xlsx atau .csv langsung</span></div>
              <div class="flex gap-2"><span class="text-emerald-500 font-bold">3.</span><span>Preview data & pastikan kolom terdeteksi</span></div>
              <div class="flex gap-2"><span class="text-emerald-500 font-bold">4.</span><span>Klik Import untuk menyimpan data</span></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h3 class="font-bold text-sm">Kolom yang Dikenali</h3></div>
            <div class="card-body">
              <p class="text-xs text-gray-500 mb-2">Kolom di template akan otomatis dicocokkan dengan field EMIS 4.0:</p>
              <div class="space-y-1" id="fieldList"></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h3 class="font-bold text-sm">Data Saat Ini</h3></div>
            <div class="card-body space-y-2">
              <div class="flex justify-between text-sm"><span class="text-gray-500">Total ${tab === 'siswa' ? 'Siswa' : tab === 'guru' ? 'Guru' : 'Kelas'}</span><span class="font-bold">${count}</span></div>
              <div class="text-xs text-gray-400 mt-2 p-2 bg-yellow-50 rounded-lg">
                Import akan mengupdate data berdasarkan NISN (siswa) / NIP (guru) / Nama Kelas. Jika tidak ada match, data baru akan ditambahkan.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderFieldList();
  },

  renderFieldList() {
    const el = document.getElementById('fieldList');
    if (!el) return;
    const fields = this.EMIS_FIELDS[this.currentTab];
    const all = [...fields.required, ...fields.optional];
    el.innerHTML = all.map(f => {
      const isReq = fields.required.includes(f);
      return `<div class="flex items-center gap-2 text-xs">
        <span class="w-1.5 h-1.5 rounded-full ${isReq ? 'bg-red-400' : 'bg-gray-300'}"></span>
        <span class="font-mono text-gray-600">${f}</span>
        ${isReq ? '<span class="text-red-400">*</span>' : ''}
      </div>`;
    }).join('');
  },

  switchTab(tab) {
    this.currentTab = tab;
    this.previewData = [];
    this.errors = [];
    document.querySelectorAll('.emis-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tab)?.classList.add('active');
    this.renderTabContent();
  },

  selectFile() {
    Utils.uploadFile('.csv,.tsv,.xlsx,.xls', async (file) => {
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) return showToast('error', 'File terlalu besar (max 5MB)');

      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'xlsx' || ext === 'xls') {
        this.processExcel(file);
      } else {
        const text = await file.text();
        this.processCSV(text, file.name);
      }
    });
  },

  processExcel(file) {
    if (typeof XLSX === 'undefined') {
      showToast('error', 'Library XLSX belum dimuat. Reload halaman.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        // Use first sheet (or sheet matching current tab)
        let sheetName = wb.SheetNames[0];
        // Try to find matching sheet
        for (const name of wb.SheetNames) {
          const lower = name.toLowerCase();
          if (this.currentTab === 'siswa' && (lower.includes('siswa') || lower.includes('kelas'))) { sheetName = name; break; }
          if (this.currentTab === 'guru' && (lower.includes('guru') || lower.includes('gtk'))) { sheetName = name; break; }
          if (this.currentTab === 'kelas' && lower.includes('kelas')) { sheetName = name; break; }
        }

        const ws = wb.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
        if (data.length < 2) return showToast('error', 'File kosong atau tidak ada data');

        // Convert to CSV-like format for processCSV
        const csvLines = data.map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','));
        const csvText = csvLines.join('\n');

        showToast('info', `Sheet "${sheetName}" (${data.length - 1} baris)`);
        this.processCSV(csvText, file.name);
      } catch (err) {
        showToast('error', 'Gagal membaca file Excel: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  },

  processCSV(text, filename) {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return showToast('error', 'File kosong atau tidak ada data');

    const delimiter = lines[0].includes('\t') ? '\t' : ',';
    const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, '').replace(/\r/g, ''));
    const fields = this.EMIS_FIELDS[this.currentTab];

    const headerMap = headers.map(h => {
      const upper = h.toUpperCase().trim();
      return fields.aliases[upper] || null;
    });

    const rows = [];
    let skippedRows = 0;

    lines.slice(1).forEach((line, idx) => {
      const values = line.split(delimiter).map(v => v.trim().replace(/"/g, '').replace(/\r/g, ''));
      const row = {};
      headers.forEach((h, i) => {
        const mapped = headerMap[i];
        if (mapped && mapped !== '_skip') {
          let val = values[i] || '';
          // Bersihkan prefix apostrophe dari Excel ("'3509xxx" → "3509xxx")
          if (typeof val === 'string' && val.startsWith("'")) val = val.substring(1);
          row[mapped] = val;
        }
      });

      // Parse "Tingkat - Rombel" → extract tingkat number
      if (row.tingkat_rombel) {
        const match = row.tingkat_rombel.match(/(\d+)/);
        if (match) row.tingkat = parseInt(match[1]);
        const rombelMatch = row.tingkat_rombel.match(/-\s*(.+)/);
        if (rombelMatch) row.nama_rombel = rombelMatch[1].trim();
      }

      // Skip baris yang benar-benar kosong (tidak ada nama)
      if (!row.nama_lengkap || row.nama_lengkap.trim() === '') {
        skippedRows++;
        return;
      }

      // Normalize JK
      if (row.jenis_kelamin) {
        const jk = String(row.jenis_kelamin).toUpperCase();
        if (jk === '1' || jk === 'L' || jk === 'LAKI-LAKI' || jk === 'LAKI') row.jenis_kelamin = 'Laki-laki';
        else if (jk === '2' || jk === 'P' || jk === 'PEREMPUAN') row.jenis_kelamin = 'Perempuan';
      }

      // Normalize status
      const s = String(row.status || '').toUpperCase();
      row.status_aktif = (s === 'AKTIF' || s === '1' || s === 'TRUE' || s === 'Y' || s === '');

      // Normalize tingkat
      if (row.tingkat && typeof row.tingkat !== 'number') {
        const t = parseInt(row.tingkat);
        if (!isNaN(t)) row.tingkat = t;
      }

      // Normalize status_pegawai for guru
      if (row.status_pegawai) {
        const sp = row.status_pegawai.toUpperCase();
        if (sp === 'NON PNS' || sp === 'NON ASN') row.status_pegawai = 'Honorer';
        else if (sp === 'PNS') row.status_pegawai = 'PNS';
        else if (sp === 'PPPK') row.status_pegawai = 'PPPK';
      }

      rows.push(row);
    });

    this.previewData = rows;
    this.errors = [];
    if (skippedRows > 0) this.errors.push(`${skippedRows} baris kosong dilewati (nama tidak ada)`);
    this.showPreview();
  },

  showPreview() {
    const previewEl = document.getElementById('emisPreview');
    const tableEl = document.getElementById('previewTable');
    const errEl = document.getElementById('emisErrorList');

    previewEl.classList.remove('hidden');

    const hasRealErrors = this.errors.some(e => !e.includes('dilewati'));
    document.getElementById('previewValid').textContent = `${this.previewData.length} valid`;
    document.getElementById('previewError').textContent = hasRealErrors ? `${this.errors.filter(e => !e.includes('dilewati')).length} error` : '0 error';
    document.getElementById('previewTotal').textContent = this.previewData.length;

    if (this.errors.length > 0) {
      errEl.classList.remove('hidden');
      const errClass = hasRealErrors ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700';
      errEl.className = `mb-4 p-3 border rounded-lg text-sm ${errClass}`;
      errEl.innerHTML = this.errors.map(e => `<div>${e}</div>`).join('');
    } else {
      errEl.classList.add('hidden');
    }

    if (this.previewData.length === 0) {
      tableEl.innerHTML = '<p class="text-center text-gray-400 py-4">Tidak ada data valid untuk diimport</p>';
      document.getElementById('btnImport').disabled = true;
      return;
    }

    document.getElementById('btnImport').disabled = false;

    const headers = Object.keys(this.previewData[0]).filter(h => this.previewData.some(r => r[h]));
    const displayHeaders = headers.slice(0, 8);
    const moreCount = headers.length - 8;

    tableEl.innerHTML = `
      <table>
        <thead><tr>
          <th>No</th>
          ${displayHeaders.map(h => `<th>${h}</th>`).join('')}
          ${moreCount > 0 ? `<th>+${moreCount} kolom</th>` : ''}
        </tr></thead>
        <tbody>
          ${this.previewData.slice(0, 50).map((r, i) => `
            <tr>
              <td class="text-xs">${i + 1}</td>
              ${displayHeaders.map(h => `<td class="text-xs">${r[h] || '-'}</td>`).join('')}
              ${moreCount > 0 ? '<td class="text-xs text-gray-400">...</td>' : ''}
            </tr>
          `).join('')}
          ${this.previewData.length > 50 ? `<tr><td colspan="${displayHeaders.length + 2}" class="text-center text-xs text-gray-400 py-2">...dan ${this.previewData.length - 50} baris lainnya</td></tr>` : ''}
        </tbody>
      </table>
    `;
  },

  clearPreview() {
    this.previewData = [];
    this.errors = [];
    document.getElementById('emisPreview').classList.add('hidden');
  },

  async executeImport() {
    if (this.previewData.length === 0) return showToast('error', 'Tidak ada data untuk diimport');

    const tab = this.currentTab;
    const storageKey = tab === 'guru' ? 'mops_guru' : tab === 'siswa' ? 'mops_murid' : 'mops_kelas';
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const madrasahId = Auth.currentUser?.madrasah_id || 'mad_001';

    let imported = 0, updated = 0, added = 0;

    for (const row of this.previewData) {
      let mapped;
      if (tab === 'siswa') {
        mapped = {
          nama_lengkap: row.nama_lengkap || '',
          nisn: row.nisn || '',
          nik: row.nik || '',
          tempat_lahir: row.tempat_lahir || '',
          tanggal_lahir: this.normalizeDate(row.tanggal_lahir),
          jenis_kelamin: row.jenis_kelamin || '',
          alamat: row.alamat || '',
          no_hp: row.no_telepon || '',
          nama_ayah: row.nama_ayah || '',
          nama_ibu: row.nama_ibu || '',
          nama_wali: row.nama_wali || '',
          kebutuhan_khusus: row.kebutuhan_khusus || 'Tidak Ada',
          disabilitas: row.disabilitas || 'Tidak Ada',
          nomor_kip: row.nomor_kip || '',
          tingkat: row.tingkat || '',
          nama_rombel: row.nama_rombel || '',
          tahun_masuk: '2026/2027',
          status_aktif: row.status_aktif !== false,
          madrasah_id: madrasahId,
        };
        // Match by NISN
        const idx = existing.findIndex(e => e.nisn && e.nisn === row.nisn);
        if (idx >= 0) { existing[idx] = { ...existing[idx], ...mapped }; updated++; }
        else { mapped.id = 'murid_' + Date.now() + '_' + Math.random().toString(36).substr(2,5); existing.push(mapped); added++; }
      }
      else if (tab === 'guru') {
        mapped = {
          nama_lengkap: row.nama_lengkap || '',
          nip: row.nip || '',
          nuptk: row.nuptk || '',
          nik: row.nik || '',
          jenis_kelamin: row.jenis_kelamin || '',
          tempat_lahir: row.tempat_lahir || '',
          tanggal_lahir: this.normalizeDate(row.tanggal_lahir),
          mata_pelajaran: row.mata_pelajaran || '',
          status_guru: 'Aktif',
          status_pegawai: row.status_pegawai || '',
          no_hp: row.no_hp || '',
          email: row.email || '',
          tugas: row.tugas || '',
          penempatan: row.penempatan || '',
          total_jtm: row.total_jtm || '',
          madrasah_id: madrasahId,
        };
        const idx = existing.findIndex(e => e.nip && e.nip === row.nip);
        if (idx >= 0) { existing[idx] = { ...existing[idx], ...mapped }; updated++; }
        else { mapped.id = 'guru_' + Date.now() + '_' + Math.random().toString(36).substr(2,5); existing.push(mapped); added++; }
      }
      else if (tab === 'kelas') {
        mapped = {
          nama_kelas: row.nama_kelas || '',
          tingkat: typeof row.tingkat === 'number' ? row.tingkat : parseInt(row.tingkat) || 1,
          rombel: row.rombel || row.nama_kelas || '',
          ruang: row.ruang || '',
          kapasitas: parseInt(row.kapasitas) || 30,
          tahun_pelajaran: row.tahun_pelajaran || '2025/2026',
          wali_kelas: row.wali_kelas || '',
          kurikulum: row.kurikulum || 'Kurikulum Merdeka',
          jurusan: row.jurusan || '',
          madrasah_id: madrasahId,
          jumlah_murid: 0,
        };
        const idx = existing.findIndex(e => e.nama_kelas === row.nama_kelas);
        if (idx >= 0) { existing[idx] = { ...existing[idx], ...mapped }; updated++; }
        else { mapped.id = 'kelas_' + Date.now() + '_' + Math.random().toString(36).substr(2,5); existing.push(mapped); added++; }
      }

      imported++;
    }

    localStorage.setItem(storageKey, JSON.stringify(existing));
    Realtime.broadcast('data_changed', tab === 'guru' ? 'guru' : tab === 'siswa' ? 'murid' : 'kelas');

    showToast('success', `Import selesai: ${added} ditambahkan, ${updated} diupdate`);

    this.previewData = [];
    this.errors = [];
    this.renderTabContent();

    // Refresh nav page if currently viewing the same data
    if (typeof Pages !== 'undefined') {
      if (tab === 'guru' && typeof Pages.renderGuru === 'function') Pages.renderGuru();
      if (tab === 'siswa' && typeof Pages.renderMurid === 'function') Pages.renderMurid();
      if (tab === 'kelas' && typeof Pages.renderKelas === 'function') Pages.renderKelas();
    }
  },

  normalizeDate(dateStr) {
    if (!dateStr) return '';
    // Try dd-mm-yyyy
    const parts1 = dateStr.split(/[-\/]/);
    if (parts1.length === 3) {
      let [d, m, y] = parts1;
      if (d.length === 1) d = '0' + d;
      if (m.length === 1) m = '0' + m;
      if (y.length === 2) y = '20' + y;
      if (d.length <= 2 && m.length <= 2 && y.length === 4) return `${y}-${m}-${d}`;
    }
    // Already YYYY-MM-DD or other
    return dateStr;
  },

  downloadTemplate() {
    const content = this.EMIS_TEMPLATES[this.currentTab];
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `template_emis_${this.currentTab}.csv`;
    link.click();
    showToast('success', 'Template berhasil didownload');
  },

  downloadAllTemplates() {
    Object.keys(this.EMIS_TEMPLATES).forEach(tab => {
      const content = this.EMIS_TEMPLATES[tab];
      const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `template_emis_${tab}.csv`;
      link.click();
    });
    showToast('success', 'Semua template berhasil didownload');
  },
};
