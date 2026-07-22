// ============================================
// PPDB ONLINE - MULTI-STEP WIZARD FORM
// ============================================

const PPDBWizard = {
  currentStep: 1,
  totalSteps: 4,
  formData: {},

  init() {
    this.currentStep = 1;
    this.formData = {};
    this.render();
  },

  render() {
    const page = document.getElementById('activePage');
    if (!page) return;

    page.innerHTML = `
      <div class="ppdb-wizard-container">
        <!-- Header -->
        <div class="ppdb-hero">
          <div class="ppdb-hero-bg"></div>
          <div class="ppdb-hero-content">
            <div class="ppdb-hero-icon">🎓</div>
            <h1 class="ppdb-hero-title">Penerimaan Peserta Didik Baru</h1>
            <p class="ppdb-hero-subtitle">Tahun Pelajaran ${this.getTahunPelajaran()}</p>
            <div class="ppdb-hero-badge">
              <span class="ppdb-badge-dot"></span>
              Pendaftaran sedang dibuka
            </div>
          </div>
        </div>

        <!-- Progress Steps -->
        <div class="ppdb-progress-container">
          <div class="ppdb-progress-bar">
            <div class="ppdb-progress-fill" style="width: ${(this.currentStep / this.totalSteps) * 100}%"></div>
          </div>
          <div class="ppdb-steps">
            ${this.renderStepIndicators()}
          </div>
        </div>

        <!-- Form Content -->
        <div class="ppdb-form-card">
          <div class="ppdb-form-header">
            <h2 class="ppdb-form-title">${this.getStepTitle()}</h2>
            <p class="ppdb-form-subtitle">${this.getStepSubtitle()}</p>
          </div>
          <div class="ppdb-form-body">
            ${this.renderStepContent()}
          </div>
          <div class="ppdb-form-footer">
            <button class="ppdb-btn ppdb-btn-outline" onclick="PPDBWizard.prevStep()" ${this.currentStep === 1 ? 'disabled' : ''}>
              <svg class="ppdb-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              Kembali
            </button>
            ${this.currentStep < this.totalSteps ? `
              <button class="ppdb-btn ppdb-btn-primary" onclick="PPDBWizard.nextStep()">
                Selanjutnya
                <svg class="ppdb-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            ` : `
              <button class="ppdb-btn ppdb-btn-success" onclick="PPDBWizard.submitForm()">
                <svg class="ppdb-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Kirim Pendaftaran
              </button>
            `}
          </div>
        </div>

        <!-- Info Cards -->
        <div class="ppdb-info-grid">
          <div class="ppdb-info-card">
            <div class="ppdb-info-icon">📋</div>
            <h3 class="ppdb-info-title">Persyaratan</h3>
            <ul class="ppdb-info-list">
              <li>Akta Kelahiran</li>
              <li>Kartu Keluarga</li>
              <li>Ijazah/Surat Keterangan</li>
              <li>Pas Photo 3x4</li>
            </ul>
          </div>
          <div class="ppdb-info-card">
            <div class="ppdb-info-icon">📅</div>
            <h3 class="ppdb-info-title">Jadwal</h3>
            <ul class="ppdb-info-list">
              <li>Pendaftaran: Juli - Agustus</li>
              <li>Seleksi: Agustus</li>
              <li>Pengumuman: September</li>
              <li>MPLS: September</li>
            </ul>
          </div>
          <div class="ppdb-info-card">
            <div class="ppdb-info-icon">📞</div>
            <h3 class="ppdb-info-title">Hubungi Kami</h3>
            <ul class="ppdb-info-list">
              <li>Telp: (0351) 123456</li>
              <li>WA: 081234567890</li>
              <li>Email: ppdb@miiu.sch.id</li>
              <li>Jam: 08.00 - 15.00</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    this.loadSavedData();
  },

  renderStepIndicators() {
    const steps = [
      { num: 1, label: 'Data Diri' },
      { num: 2, label: 'Orang Tua' },
      { num: 3, label: 'Sekolah' },
      { num: 4, label: 'Konfirmasi' }
    ];
    return steps.map(s => `
      <div class="ppdb-step ${this.currentStep >= s.num ? 'active' : ''} ${this.currentStep === s.num ? 'current' : ''}">
        <div class="ppdb-step-circle">${this.currentStep > s.num ? '✓' : s.num}</div>
        <div class="ppdb-step-label">${s.label}</div>
      </div>
    `).join('');
  },

  getStepTitle() {
    const titles = {
      1: 'Data Pribadi Calon Siswa',
      2: 'Data Orang Tua / Wali',
      3: 'Data Asal Sekolah',
      4: 'Konfirmasi & Kirim'
    };
    return titles[this.currentStep];
  },

  getStepSubtitle() {
    const subtitles = {
      1: 'Lengkapi data diri calon siswa dengan benar',
      2: 'Masukkan data orang tua atau wali',
      3: 'Informasi sekolah asal dan jenjang yang dipilih',
      4: 'Periksa kembali data sebelum mengirim'
    };
    return subtitles[this.currentStep];
  },

  renderStepContent() {
    switch(this.currentStep) {
      case 1: return this.renderStep1();
      case 2: return this.renderStep2();
      case 3: return this.renderStep3();
      case 4: return this.renderStep4();
    }
  },

  renderStep1() {
    return `
      <div class="ppdb-form-grid">
        <div class="ppdb-form-group ppdb-full">
          <label class="ppdb-label">Nama Lengkap <span class="ppdb-required">*</span></label>
          <input type="text" class="ppdb-input" id="ppdb_nama" placeholder="Masukkan nama lengkap" value="${this.formData.nama_lengkap || ''}" oninput="PPDBWizard.saveField('nama_lengkap', this.value)">
        </div>
        <div class="ppdb-form-group">
          <label class="ppdb-label">Tempat Lahir <span class="ppdb-required">*</span></label>
          <input type="text" class="ppdb-input" id="ppdb_tempat_lahir" placeholder="Kota/Kabupaten" value="${this.formData.tempat_lahir || ''}" oninput="PPDBWizard.saveField('tempat_lahir', this.value)">
        </div>
        <div class="ppdb-form-group">
          <label class="ppdb-label">Tanggal Lahir <span class="ppdb-required">*</span></label>
          <input type="date" class="ppdb-input" id="ppdb_tgl_lahir" value="${this.formData.tgl_lahir || ''}" onchange="PPDBWizard.saveField('tgl_lahir', this.value)">
        </div>
        <div class="ppdb-form-group">
          <label class="ppdb-label">Jenis Kelamin <span class="ppdb-required">*</span></label>
          <div class="ppdb-radio-group">
            <label class="ppdb-radio ${this.formData.jenis_kelamin === 'L' ? 'active' : ''}">
              <input type="radio" name="jk" value="L" ${this.formData.jenis_kelamin === 'L' ? 'checked' : ''} onchange="PPDBWizard.saveField('jenis_kelamin', 'L')">
              <span class="ppdb-radio-icon">👨</span>
              <span>Laki-laki</span>
            </label>
            <label class="ppdb-radio ${this.formData.jenis_kelamin === 'P' ? 'active' : ''}">
              <input type="radio" name="jk" value="P" ${this.formData.jenis_kelamin === 'P' ? 'checked' : ''} onchange="PPDBWizard.saveField('jenis_kelamin', 'P')">
              <span class="ppdb-radio-icon">👩</span>
              <span>Perempuan</span>
            </label>
          </div>
        </div>
        <div class="ppdb-form-group">
          <label class="ppdb-label">NISN</label>
          <input type="text" class="ppdb-input" id="ppdb_nisn" placeholder="Nomor Induk Siswa Nasional" value="${this.formData.nisn || ''}" oninput="PPDBWizard.saveField('nisn', this.value)" maxlength="10">
        </div>
        <div class="ppdb-form-group ppdb-full">
          <label class="ppdb-label">Alamat Lengkap <span class="ppdb-required">*</span></label>
          <textarea class="ppdb-textarea" id="ppdb_alamat" placeholder="Jalan, RT/RW, Desa/Kelurahan, Kecamatan" oninput="PPDBWizard.saveField('alamat', this.value)">${this.formData.alamat || ''}</textarea>
        </div>
        <div class="ppdb-form-group">
          <label class="ppdb-label">No. HP/WA</label>
          <input type="tel" class="ppdb-input" id="ppdb_no_hp" placeholder="08xxxxxxxxxx" value="${this.formData.no_hp || ''}" oninput="PPDBWizard.saveField('no_hp', this.value)">
        </div>
        <div class="ppdb-form-group">
          <label class="ppdb-label">Agama</label>
          <select class="ppdb-select" id="ppdb_agama" onchange="PPDBWizard.saveField('agama', this.value)">
            <option value="">Pilih Agama</option>
            <option value="Islam" ${this.formData.agama === 'Islam' ? 'selected' : ''}>Islam</option>
            <option value="Kristen" ${this.formData.agama === 'Kristen' ? 'selected' : ''}>Kristen</option>
            <option value="Katolik" ${this.formData.agama === 'Katolik' ? 'selected' : ''}>Katolik</option>
            <option value="Hindu" ${this.formData.agama === 'Hindu' ? 'selected' : ''}>Hindu</option>
            <option value="Buddha" ${this.formData.agama === 'Buddha' ? 'selected' : ''}>Buddha</option>
          </select>
        </div>
      </div>
    `;
  },

  renderStep2() {
    return `
      <div class="ppdb-section-label">Data Ayah</div>
      <div class="ppdb-form-grid">
        <div class="ppdb-form-group ppdb-full">
          <label class="ppdb-label">Nama Ayah <span class="ppdb-required">*</span></label>
          <input type="text" class="ppdb-input" id="ppdb_nama_ayah" placeholder="Nama lengkap ayah" value="${this.formData.nama_ayah || ''}" oninput="PPDBWizard.saveField('nama_ayah', this.value)">
        </div>
        <div class="ppdb-form-group">
          <label class="ppdb-label">Pekerjaan Ayah</label>
          <input type="text" class="ppdb-input" id="ppdb_pekerjaan_ayah" placeholder="Pekerjaan" value="${this.formData.pekerjaan_ayah || ''}" oninput="PPDBWizard.saveField('pekerjaan_ayah', this.value)">
        </div>
        <div class="ppdb-form-group">
          <label class="ppdb-label">No. HP Ayah</label>
          <input type="tel" class="ppdb-input" id="ppdb_hp_ayah" placeholder="08xxxxxxxxxx" value="${this.formData.hp_ayah || ''}" oninput="PPDBWizard.saveField('hp_ayah', this.value)">
        </div>
      </div>

      <div class="ppdb-divider"></div>

      <div class="ppdb-section-label">Data Ibu</div>
      <div class="ppdb-form-grid">
        <div class="ppdb-form-group ppdb-full">
          <label class="ppdb-label">Nama Ibu <span class="ppdb-required">*</span></label>
          <input type="text" class="ppdb-input" id="ppdb_nama_ibu" placeholder="Nama lengkap ibu" value="${this.formData.nama_ibu || ''}" oninput="PPDBWizard.saveField('nama_ibu', this.value)">
        </div>
        <div class="ppdb-form-group">
          <label class="ppdb-label">Pekerjaan Ibu</label>
          <input type="text" class="ppdb-input" id="ppdb_pekerjaan_ibu" placeholder="Pekerjaan" value="${this.formData.pekerjaan_ibu || ''}" oninput="PPDBWizard.saveField('pekerjaan_ibu', this.value)">
        </div>
        <div class="ppdb-form-group">
          <label class="ppdb-label">No. HP Ibu</label>
          <input type="tel" class="ppdb-input" id="ppdb_hp_ibu" placeholder="08xxxxxxxxxx" value="${this.formData.hp_ibu || ''}" oninput="PPDBWizard.saveField('hp_ibu', this.value)">
        </div>
      </div>

      <div class="ppdb-divider"></div>

      <div class="ppdb-section-label">Wali (Opsional)</div>
      <div class="ppdb-form-grid">
        <div class="ppdb-form-group ppdb-full">
          <label class="ppdb-label">Nama Wali</label>
          <input type="text" class="ppdb-input" id="ppdb_nama_wali" placeholder="Kosongkan jika tidak ada" value="${this.formData.nama_wali || ''}" oninput="PPDBWizard.saveField('nama_wali', this.value)">
        </div>
        <div class="ppdb-form-group">
          <label class="ppdb-label">Pekerjaan Wali</label>
          <input type="text" class="ppdb-input" id="ppdb_pekerjaan_wali" placeholder="Pekerjaan" value="${this.formData.pekerjaan_wali || ''}" oninput="PPDBWizard.saveField('pekerjaan_wali', this.value)">
        </div>
        <div class="ppdb-form-group">
          <label class="ppdb-label">No. HP Wali</label>
          <input type="tel" class="ppdb-input" id="ppdb_hp_wali" placeholder="08xxxxxxxxxx" value="${this.formData.hp_wali || ''}" oninput="PPDBWizard.saveField('hp_wali', this.value)">
        </div>
      </div>
    `;
  },

  renderStep3() {
    return `
      <div class="ppdb-form-grid">
        <div class="ppdb-form-group ppdb-full">
          <label class="ppdb-label">Asal Sekolah <span class="ppdb-required">*</span></label>
          <input type="text" class="ppdb-input" id="ppdb_asal_sekolah" placeholder="Nama sekolah asal" value="${this.formData.asal_sekolah || ''}" oninput="PPDBWizard.saveField('asal_sekolah', this.value)">
        </div>
        <div class="ppdb-form-group">
          <label class="ppdb-label">Jenjang <span class="ppdb-required">*</span></label>
          <div class="ppdb-jenjang-grid">
            <label class="ppdb-jenjang-card ${this.formData.jenjang === 'MI' ? 'active' : ''}">
              <input type="radio" name="jenjang" value="MI" ${this.formData.jenjang === 'MI' ? 'checked' : ''} onchange="PPDBWizard.saveField('jenjang', 'MI'); PPDBWizard.updateJenjangUI()">
              <div class="ppdb-jenjang-icon">🏫</div>
              <div class="ppdb-jenjang-name">MI</div>
              <div class="ppdb-jenjang-desc">Madrasah Ibtidaiyah</div>
            </label>
            <label class="ppdb-jenjang-card ${this.formData.jenjang === 'MTs' ? 'active' : ''}">
              <input type="radio" name="jenjang" value="MTs" ${this.formData.jenjang === 'MTs' ? 'checked' : ''} onchange="PPDBWizard.saveField('jenjang', 'MTs'); PPDBWizard.updateJenjangUI()">
              <div class="ppdb-jenjang-icon">🏛️</div>
              <div class="ppdb-jenjang-name">MTs</div>
              <div class="ppdb-jenjang-desc">Madrasah Tsanawiyah</div>
            </label>
            <label class="ppdb-jenjang-card ${this.formData.jenjang === 'MA' ? 'active' : ''}">
              <input type="radio" name="jenjang" value="MA" ${this.formData.jenjang === 'MA' ? 'checked' : ''} onchange="PPDBWizard.saveField('jenjang', 'MA'); PPDBWizard.updateJenjangUI()">
              <div class="ppdb-jenjang-icon">🎓</div>
              <div class="ppdb-jenjang-name">MA</div>
              <div class="ppdb-jenjang-desc">Madrasah Aliyah</div>
            </label>
          </div>
        </div>
        <div class="ppdb-form-group">
          <label class="ppdb-label">Tahun Pelajaran</label>
          <input type="text" class="ppdb-input" id="ppdb_tahun_pelajaran" value="${this.getTahunPelajaran()}" readonly style="background:#f3f4f6">
        </div>
        <div class="ppdb-form-group">
          <label class="ppdb-label">Jenis Pendaftaran</label>
          <select class="ppdb-select" id="ppdb_jenis_daftar" onchange="PPDBWizard.saveField('jenis_pendaftaran', this.value)">
            <option value="baru" ${this.formData.jenis_pendaftaran === 'baru' ? 'selected' : ''}>Siswa Baru</option>
            <option value="pindahan" ${this.formData.jenis_pendaftaran === 'pindahan' ? 'selected' : ''}>Pindahan</option>
            <option value="mutasi" ${this.formData.jenis_pendaftaran === 'mutasi' ? 'selected' : ''}>Mutasi</option>
          </select>
        </div>
      </div>
    `;
  },

  renderStep4() {
    const d = this.formData;
    return `
      <div class="ppdb-confirm-card">
        <div class="ppdb-confirm-header">
          <div class="ppdb-confirm-icon">📋</div>
          <div>
            <h3 class="ppdb-confirm-title">Ringkasan Pendaftaran</h3>
            <p class="ppdb-confirm-sub">Pastikan semua data sudah benar</p>
          </div>
        </div>

        <div class="ppdb-confirm-section">
          <h4 class="ppdb-confirm-section-title">👤 Data Pribadi</h4>
          <div class="ppdb-confirm-grid">
            <div class="ppdb-confirm-item">
              <span class="ppdb-confirm-label">Nama</span>
              <span class="ppdb-confirm-value">${d.nama_lengkap || '-'}</span>
            </div>
            <div class="ppdb-confirm-item">
              <span class="ppdb-confirm-label">Lahir</span>
              <span class="ppdb-confirm-value">${d.tempat_lahir ? d.tempat_lahir + ', ' : ''}${d.tgl_lahir ? this.formatDate(d.tgl_lahir) : '-'}</span>
            </div>
            <div class="ppdb-confirm-item">
              <span class="ppdb-confirm-label">Jenis Kelamin</span>
              <span class="ppdb-confirm-value">${d.jenis_kelamin === 'L' ? 'Laki-laki' : d.jenis_kelamin === 'P' ? 'Perempuan' : '-'}</span>
            </div>
            <div class="ppdb-confirm-item">
              <span class="ppdb-confirm-label">NISN</span>
              <span class="ppdb-confirm-value">${d.nisn || '-'}</span>
            </div>
            <div class="ppdb-confirm-item ppdb-full">
              <span class="ppdb-confirm-label">Alamat</span>
              <span class="ppdb-confirm-value">${d.alamat || '-'}</span>
            </div>
          </div>
        </div>

        <div class="ppdb-confirm-section">
          <h4 class="ppdb-confirm-section-title">👨‍👩‍👧 Orang Tua</h4>
          <div class="ppdb-confirm-grid">
            <div class="ppdb-confirm-item">
              <span class="ppdb-confirm-label">Ayah</span>
              <span class="ppdb-confirm-value">${d.nama_ayah || '-'} ${d.pekerjaan_ayah ? '(' + d.pekerjaan_ayah + ')' : ''}</span>
            </div>
            <div class="ppdb-confirm-item">
              <span class="ppdb-confirm-label">Ibu</span>
              <span class="ppdb-confirm-value">${d.nama_ibu || '-'} ${d.pekerjaan_ibu ? '(' + d.pekerjaan_ibu + ')' : ''}</span>
            </div>
            <div class="ppdb-confirm-item">
              <span class="ppdb-confirm-label">HP Ayah</span>
              <span class="ppdb-confirm-value">${d.hp_ayah || '-'}</span>
            </div>
            <div class="ppdb-confirm-item">
              <span class="ppdb-confirm-label">HP Ibu</span>
              <span class="ppdb-confirm-value">${d.hp_ibu || '-'}</span>
            </div>
          </div>
        </div>

        <div class="ppdb-confirm-section">
          <h4 class="ppdb-confirm-section-title">🏫 Sekolah</h4>
          <div class="ppdb-confirm-grid">
            <div class="ppdb-confirm-item">
              <span class="ppdb-confirm-label">Asal Sekolah</span>
              <span class="ppdb-confirm-value">${d.asal_sekolah || '-'}</span>
            </div>
            <div class="ppdb-confirm-item">
              <span class="ppdb-confirm-label">Jenjang</span>
              <span class="ppdb-confirm-value"><span class="ppdb-jenjang-badge">${d.jenjang || '-'}</span></span>
            </div>
            <div class="ppdb-confirm-item">
              <span class="ppdb-confirm-label">Jenis Daftar</span>
              <span class="ppdb-confirm-value">${d.jenis_pendaftaran === 'pindahan' ? 'Pindahan' : d.jenis_pendaftaran === 'mutasi' ? 'Mutasi' : 'Siswa Baru'}</span>
            </div>
            <div class="ppdb-confirm-item">
              <span class="ppdb-confirm-label">Tahun Pelajaran</span>
              <span class="ppdb-confirm-value">${this.getTahunPelajaran()}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  saveField(field, value) {
    this.formData[field] = value;
    localStorage.setItem('mops_ppdb_draft', JSON.stringify(this.formData));
  },

  loadSavedData() {
    try {
      const saved = localStorage.getItem('mops_ppdb_draft');
      if (saved) {
        const data = JSON.parse(saved);
        this.formData = { ...this.formData, ...data };
      }
    } catch(e) {}
  },

  nextStep() {
    if (!this.validateCurrentStep()) return;
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  validateCurrentStep() {
    const d = this.formData;
    switch(this.currentStep) {
      case 1:
        if (!d.nama_lengkap?.trim()) { showToast('error', 'Nama lengkap wajib diisi'); return false; }
        if (!d.tempat_lahir?.trim()) { showToast('error', 'Tempat lahir wajib diisi'); return false; }
        if (!d.tgl_lahir) { showToast('error', 'Tanggal lahir wajib diisi'); return false; }
        if (!d.jenis_kelamin) { showToast('error', 'Jenis kelamin wajib dipilih'); return false; }
        if (!d.alamat?.trim()) { showToast('error', 'Alamat wajib diisi'); return false; }
        return true;
      case 2:
        if (!d.nama_ayah?.trim()) { showToast('error', 'Nama ayah wajib diisi'); return false; }
        if (!d.nama_ibu?.trim()) { showToast('error', 'Nama ibu wajib diisi'); return false; }
        return true;
      case 3:
        if (!d.asal_sekolah?.trim()) { showToast('error', 'Asal sekolah wajib diisi'); return false; }
        if (!d.jenjang) { showToast('error', 'Jenjang wajib dipilih'); return false; }
        return true;
      default:
        return true;
    }
  },

  async submitForm() {
    const data = { ...this.formData };
    data.no_pendaftaran = Utils.generateNoPendaftaran(data.jenjang);
    data.status = 'pending';
    data.tahun_penerimaan = this.getTahunPelajaran();
    data.tanggal_daftar = new Date().toISOString();
    data.madrasah_id = Auth.currentUser?.madrasah_id || 'mad_001';

    try {
      await DB.insert('ppdb_pendaftaran', data);
      localStorage.removeItem('mops_ppdb_draft');
      showToast('success', `Pendaftaran berhasil! No. ${data.no_pendaftaran}`);
      Realtime.broadcast('data_changed', 'ppdb_pendaftaran');

      // Show success animation
      this.showSuccess(data.no_pendaftaran);
    } catch(e) {
      showToast('error', 'Gagal menyimpan data: ' + e.message);
    }
  },

  showSuccess(noPendaftaran) {
    const page = document.getElementById('activePage');
    page.innerHTML = `
      <div class="ppdb-success-container">
        <div class="ppdb-success-card">
          <div class="ppdb-success-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 class="ppdb-success-title">Pendaftaran Berhasil!</h2>
          <p class="ppdb-success-sub">Nomor pendaftaran Anda:</p>
          <div class="ppdb-success-number">${noPendaftaran}</div>
          <p class="ppdb-success-info">Simpan nomor pendaftaran ini untuk keperluan verifikasi</p>
          <div class="ppdb-success-actions">
            <button class="ppdb-btn ppdb-btn-primary" onclick="Pages.renderPPDB()">Lihat Data PPDB</button>
            <button class="ppdb-btn ppdb-btn-outline" onclick="PPDBWizard.printReceipt('${noPendaftaran}')">
              <svg class="ppdb-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              Cetak Tanda Terima
            </button>
          </div>
        </div>
      </div>
    `;
  },

  printReceipt(noPendaftaran) {
    const d = this.formData;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tanda Terima PPDB - ${noPendaftaran}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 3px double #059669; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #059669; margin: 0; font-size: 20px; }
          .header p { color: #666; margin: 5px 0 0; font-size: 12px; }
          .receipt-no { text-align: center; font-size: 24px; font-weight: bold; color: #059669; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          td { padding: 8px 0; border-bottom: 1px dotted #ddd; }
          td:first-child { width: 140px; color: #666; font-size: 13px; }
          td:last-child { font-weight: 500; }
          .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>MI BUSTANUL ULUM CURAHKALONG 01</h1>
          <p>Tanda Terima Pendaftaran PPDB</p>
        </div>
        <div class="receipt-no">No. ${noPendaftaran}</div>
        <table>
          <tr><td>Nama</td><td>${d.nama_lengkap || '-'}</td></tr>
          <tr><td>Tempat/Tgl Lahir</td><td>${d.tempat_lahir || '-'}, ${d.tgl_lahir || '-'}</td></tr>
          <tr><td>Jenis Kelamin</td><td>${d.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td></tr>
          <tr><td>Jenjang</td><td>${d.jenjang || '-'}</td></tr>
          <tr><td>Asal Sekolah</td><td>${d.asal_sekolah || '-'}</td></tr>
          <tr><td>Nama Ayah</td><td>${d.nama_ayah || '-'}</td></tr>
          <tr><td>Nama Ibu</td><td>${d.nama_ibu || '-'}</td></tr>
          <tr><td>Alamat</td><td>${d.alamat || '-'}</td></tr>
        </table>
        <div class="footer">
          <p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
          <p>Simpan tanda terima ini untuk keperluan verifikasi</p>
        </div>
        <script>window.onload=function(){window.print();}<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  },

  updateJenjangUI() {
    document.querySelectorAll('.ppdb-jenjang-card').forEach(card => {
      const input = card.querySelector('input[type="radio"]');
      card.classList.toggle('active', input?.checked);
    });
  },

  getTahunPelajaran() {
    const now = new Date();
    const year = now.getFullYear();
    return `${year}/${year + 1}`;
  },

  formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }
};

// ========== PPDB ADMIN (Data Table) ==========
Pages.renderPPDB = function() {
  const page = document.getElementById('activePage');
  const ppdb = JSON.parse(localStorage.getItem('mops_ppdb_pendaftaran') || '[]');
  const stats = {
    total: ppdb.length,
    pending: ppdb.filter(p => p.status === 'pending').length,
    verified: ppdb.filter(p => p.status === 'verified').length,
    accepted: ppdb.filter(p => p.status === 'accepted').length,
    rejected: ppdb.filter(p => p.status === 'rejected').length
  };

  page.innerHTML = `
    <div class="mb-6">
      <button class="ppdb-btn ppdb-btn-primary ppdb-btn-lg" onclick="PPDBWizard.init()">
        <svg class="ppdb-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
        Daftarkan Siswa Baru
      </button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div class="ppdb-stat-card">
        <div class="ppdb-stat-icon ppdb-stat-blue">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </div>
        <div class="ppdb-stat-info">
          <div class="ppdb-stat-value">${stats.total}</div>
          <div class="ppdb-stat-label">Total</div>
        </div>
      </div>
      <div class="ppdb-stat-card">
        <div class="ppdb-stat-icon ppdb-stat-yellow">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div class="ppdb-stat-info">
          <div class="ppdb-stat-value">${stats.pending}</div>
          <div class="ppdb-stat-label">Menunggu</div>
        </div>
      </div>
      <div class="ppdb-stat-card">
        <div class="ppdb-stat-icon ppdb-stat-green">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div class="ppdb-stat-info">
          <div class="ppdb-stat-value">${stats.accepted}</div>
          <div class="ppdb-stat-label">Diterima</div>
        </div>
      </div>
      <div class="ppdb-stat-card">
        <div class="ppdb-stat-icon ppdb-stat-red">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div class="ppdb-stat-info">
          <div class="ppdb-stat-value">${stats.rejected}</div>
          <div class="ppdb-stat-label">Ditolak</div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div class="flex gap-2">
        <select id="filterStatusPPDB" class="ppdb-select" onchange="Pages._filterPPDB()" style="width:auto">
          <option value="">Semua Status</option>
          ${PPDB_STATUS.map(s => `<option value="${s.value}">${s.label}</option>`).join('')}
        </select>
        <input type="text" class="ppdb-input" id="searchPPDB" placeholder="Cari nama..." oninput="Pages._filterPPDB()" style="width:200px">
      </div>
      <button class="ppdb-btn ppdb-btn-outline" onclick="Pages._exportPPDB()">
        <svg class="ppdb-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        Export CSV
      </button>
    </div>

    <div class="ppdb-table-container">
      <table class="ppdb-table">
        <thead>
          <tr>
            <th>No</th>
            <th>No. Daftar</th>
            <th>Nama</th>
            <th>Jenjang</th>
            <th>Asal Sekolah</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody id="ppdbTableBody">
          ${ppdb.length === 0 ? `
            <tr><td colspan="7" class="ppdb-empty-state">
              <div class="ppdb-empty-icon">📭</div>
              <div class="ppdb-empty-text">Belum ada pendaftar</div>
            </td></tr>
          ` : ppdb.map((p, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><span class="ppdb-badge ppdb-badge-blue">${p.no_pendaftaran}</span></td>
              <td class="ppdb-table-name">${p.nama_lengkap}</td>
              <td><span class="ppdb-badge ppdb-badge-purple">${p.jenjang}</span></td>
              <td>${p.asal_sekolah || '-'}</td>
              <td><span class="ppdb-badge ppdb-badge-${PPDB_STATUS.find(s => s.value === p.status)?.color || 'gray'}">${PPDB_STATUS.find(s => s.value === p.status)?.label || p.status}</span></td>
              <td>
                <div class="ppdb-table-actions">
                  <button class="ppdb-action-btn ppdb-action-success" onclick="Pages._updatePPDB('${p.id}','accepted')" title="Terima">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  </button>
                  <button class="ppdb-action-btn ppdb-action-danger" onclick="Pages._updatePPDB('${p.id}','rejected')" title="Tolak">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

Pages._filterPPDB = function() {
  const status = document.getElementById('filterStatusPPDB')?.value || '';
  const search = (document.getElementById('searchPPDB')?.value || '').toLowerCase();
  let ppdb = JSON.parse(localStorage.getItem('mops_ppdb_pendaftaran') || '[]');
  if (status) ppdb = ppdb.filter(p => p.status === status);
  if (search) ppdb = ppdb.filter(p => p.nama_lengkap?.toLowerCase().includes(search));

  const tbody = document.getElementById('ppdbTableBody');
  if (!tbody) return;

  if (ppdb.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="ppdb-empty-state">
      <div class="ppdb-empty-icon">🔍</div>
      <div class="ppdb-empty-text">Tidak ada data ditemukan</div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = ppdb.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><span class="ppdb-badge ppdb-badge-blue">${p.no_pendaftaran}</span></td>
      <td class="ppdb-table-name">${p.nama_lengkap}</td>
      <td><span class="ppdb-badge ppdb-badge-purple">${p.jenjang}</span></td>
      <td>${p.asal_sekolah || '-'}</td>
      <td><span class="ppdb-badge ppdb-badge-${PPDB_STATUS.find(s => s.value === p.status)?.color || 'gray'}">${PPDB_STATUS.find(s => s.value === p.status)?.label || p.status}</span></td>
      <td>
        <div class="ppdb-table-actions">
          <button class="ppdb-action-btn ppdb-action-success" onclick="Pages._updatePPDB('${p.id}','accepted')" title="Terima">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </button>
          <button class="ppdb-action-btn ppdb-action-danger" onclick="Pages._updatePPDB('${p.id}','rejected')" title="Tolak">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
};

Pages._updatePPDB = async function(id, status) {
  await DB.update('ppdb_pendaftaran', id, { status });
  showToast('success', 'Status diperbarui');
  Realtime.broadcast('data_changed', 'ppdb_pendaftaran');
  Pages.renderPPDB();
};

Pages._exportPPDB = function() {
  const ppdb = JSON.parse(localStorage.getItem('mops_ppdb_pendaftaran') || '[]');
  if (ppdb.length === 0) { showToast('error', 'Tidak ada data untuk diexport'); return; }
  const headers = ['No. Daftar', 'Nama', 'NISN', 'Jenjang', 'Asal Sekolah', 'Nama Ayah', 'Nama Ibu', 'Alamat', 'Status'];
  const rows = ppdb.map(p => [p.no_pendaftaran, p.nama_lengkap, p.nisn || '', p.jenjang, p.asal_sekolah || '', p.nama_ayah || '', p.nama_ibu || '', p.alamat || '', p.status]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ppdb_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  showToast('success', 'File CSV berhasil diunduh');
};
