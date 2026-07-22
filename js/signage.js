// ============================================
// SI-MANTAP - DIGITAL SIGNAGE ENGINE v2.0
// Bel Otomatis & Layar Informasi
// ============================================

var Signage = {
  _clockInterval: null,
  _countdownInterval: null,
  _refreshInterval: null,
  _audioCtx: null,
  _lastBellPlayed: null,
  _lastWarningPlayed: null,
  _bellEnabled: true,
  _bellVolume: 0.7,
  _quietMode: false,
  _warningEnabled: true,
  _warningMinutes: 5,
  _ttsEnabled: false,
  _ttsVoice: 'id-ID',
  _ttsRate: 0.9,
  _customAudioData: null,
  _activeSoundType: 'bawaan',
  _fridayPause: false,
  _autoAdzan: true,

  // === JENIS BEL ===
  BEL_JENIS: {
    masuk: { label: 'Masuk', color: '#059669', icon: 'play' },
    pergantian: { label: 'Pergantian', color: '#3b82f6', icon: 'refresh' },
    istirahat: { label: 'Istirahat', color: '#f59e0b', icon: 'pause' },
    shalat_dhuha: { label: 'Shalat Dhuha', color: '#8b5cf6', icon: 'mosque' },
    shalat_dzuhur: { label: 'Shalat Dzuhur', color: '#06b6d4', icon: 'mosque' },
    pulang: { label: 'Pulang', color: '#ef4444', icon: 'home' },
    ekstrakurikuler: { label: 'Ekstrakurikuler', color: '#ec4899', icon: 'star' },
    khusus: { label: 'Khusus', color: '#6b7280', icon: 'special' },
  },

  // === HARI ===
  HARI_MAP: { 0: 'Minggu', 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu' },
  HARI_SHORT: { 1: 'Sn', 2: 'Sl', 3: 'Rb', 4: 'Km', 5: 'Jm', 6: 'Sb' },

  // === DEFAULT BELL SCHEDULE ===
  getDefaultSchedule: function() {
    return [
      // Senin-Sabtu
      { id: 'bl_01', hari: [1,2,3,4,5,6], waktu: '06:45', nama: 'Murattal & Dhuha', jenis: 'shalat_dhuha', guru: '', kelas: '', suara: 'bawaan', durasi: 30, aktif: true },
      { id: 'bl_02', hari: [1,2,3,4,5,6], waktu: '07:15', nama: 'Pelajaran ke-1 Mulai', jenis: 'masuk', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_03', hari: [1,2,3,4,5,6], waktu: '07:50', nama: 'Pelajaran ke-1 Selesai', jenis: 'pergantian', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_04', hari: [1,2,3,4,5,6], waktu: '07:55', nama: 'Pelajaran ke-2 Mulai', jenis: 'masuk', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_05', hari: [1,2,3,4,5,6], waktu: '08:30', nama: 'Pelajaran ke-2 Selesai', jenis: 'pergantian', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_06', hari: [1,2,3,4,5,6], waktu: '08:35', nama: 'Pelajaran ke-3 Mulai', jenis: 'masuk', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_07', hari: [1,2,3,4,5,6], waktu: '09:10', nama: 'Pelajaran ke-3 Selesai', jenis: 'pergantian', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_08', hari: [1,2,3,4,5,6], waktu: '09:10', nama: 'Istirahat 1', jenis: 'istirahat', guru: '', kelas: '', suara: 'bawaan', durasi: 15, aktif: true },
      { id: 'bl_09', hari: [1,2,3,4,5,6], waktu: '09:25', nama: 'Pelajaran ke-4 Mulai', jenis: 'masuk', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_10', hari: [1,2,3,4,5,6], waktu: '10:00', nama: 'Pelajaran ke-4 Selesai', jenis: 'pergantian', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_11', hari: [1,2,3,4,5,6], waktu: '10:05', nama: 'Pelajaran ke-5 Mulai', jenis: 'masuk', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_12', hari: [1,2,3,4,5,6], waktu: '10:40', nama: 'Pelajaran ke-5 Selesai', jenis: 'pergantian', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_13', hari: [1,2,3,4,5,6], waktu: '10:40', nama: 'Istirahat 2', jenis: 'istirahat', guru: '', kelas: '', suara: 'bawaan', durasi: 15, aktif: true },
      { id: 'bl_14', hari: [1,2,3,4,5,6], waktu: '10:55', nama: 'Pelajaran ke-6 Mulai', jenis: 'masuk', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_15', hari: [1,2,3,4,5,6], waktu: '11:30', nama: 'Pelajaran ke-6 Selesai', jenis: 'pergantian', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_16', hari: [1,2,3,4,5,6], waktu: '11:35', nama: 'Pelajaran ke-7 Mulai', jenis: 'masuk', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_17', hari: [1,2,3,4,5,6], waktu: '12:05', nama: 'Pelajaran ke-7 Selesai', jenis: 'shalat_dzuhur', guru: '', kelas: '', suara: 'bawaan', durasi: 25, aktif: true },
      { id: 'bl_18', hari: [1,2,3,4,5,6], waktu: '12:30', nama: 'Pelajaran ke-8 Mulai', jenis: 'masuk', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_19', hari: [1,2,3,4,5,6], waktu: '13:05', nama: 'Pelajaran ke-8 Selesai', jenis: 'pergantian', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_20', hari: [1,2,3,4,5,6], waktu: '13:10', nama: 'Pelajaran ke-9 Mulai', jenis: 'masuk', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_21', hari: [1,2,3,4,5,6], waktu: '13:45', nama: 'Pelajaran ke-9 Selesai', jenis: 'pergantian', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_22', hari: [1,2,3,4,5,6], waktu: '13:45', nama: 'Pelajaran ke-10 Mulai', jenis: 'masuk', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_23', hari: [1,2,3,4,5,6], waktu: '14:20', nama: 'Pelajaran ke-10 Selesai', jenis: 'pergantian', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
      { id: 'bl_24', hari: [1,2,3,4,5,6], waktu: '14:20', nama: 'Ekstrakurikuler', jenis: 'ekstrakurikuler', guru: '', kelas: '', suara: 'bawaan', durasi: 60, aktif: true },
      { id: 'bl_25', hari: [1,2,3,4,5,6], waktu: '15:20', nama: 'Bel Pulang', jenis: 'pulang', guru: '', kelas: '', suara: 'bawaan', durasi: 0, aktif: true },
    ];
  },

  // === GET TODAY'S SCHEDULE ===
  getTodaySchedule: function() {
    var now = new Date();
    var dayIndex = now.getDay();
    var stored = this._loadSchedule();
    var today = stored.filter(function(b) {
      return b.aktif && b.hari.indexOf(dayIndex) !== -1;
    });
    today.sort(function(a, b) { return a.waktu.localeCompare(b.waktu); });
    return today;
  },

  _loadSchedule: function() {
    try {
      var stored = JSON.parse(localStorage.getItem('mops_bel_jadwal') || 'null');
      if (stored && stored.length > 0) return stored;
    } catch (e) {}
    var defaults = this.getDefaultSchedule();
    this._saveSchedule(defaults);
    return defaults;
  },

  _saveSchedule: function(schedule) {
    localStorage.setItem('mops_bel_jadwal', JSON.stringify(schedule));
  },

  // === LOAD SETTINGS ===
  loadSettings: function() {
    try {
      var s = JSON.parse(localStorage.getItem('mops_settings') || '{}');
      this._bellEnabled = s.bellEnabled !== false;
      this._bellVolume = s.bellVolume != null ? s.bellVolume : 0.7;
      this._quietMode = s.bellQuietMode === true;
      this._warningEnabled = s.bellWarningEnabled !== false;
      this._warningMinutes = s.bellWarningMinutes || 5;
      this._ttsEnabled = s.bellTtsEnabled === true;
      this._ttsVoice = s.bellTtsVoice || 'id-ID';
      this._ttsRate = s.bellTtsRate || 0.9;
      this._activeSoundType = s.bellSoundType || 'bawaan';
      this._customAudioData = s.bellCustomAudio || null;
      this._fridayPause = s.bellFridayPause === true;
      this._autoAdzan = s.bellAutoAdzan !== false;
    } catch (e) {}
  },

  // === APPLY SETTINGS TO UI ===
  applySettings: function() {
    try {
      var s = JSON.parse(localStorage.getItem('mops_settings') || '{}');
      var logoText = s.logoText || 'MO';
      var madrasahName = s.madrasahName || 'MI BUSTANUL ULUM CURAHKALONG 01';
      var tagline = s.appTagline || 'Sistem Informasi Madrasah';

      document.getElementById('logoText').textContent = logoText;
      document.getElementById('madrasahName').textContent = madrasahName;
      document.getElementById('madrasahTagline').textContent = tagline;
      document.title = 'Layar Info & Bel - ' + madrasahName;

      if (s.appLogo) {
        document.getElementById('signageLogo').innerHTML = '<img src="' + s.appLogo + '">';
      }

      var bellDot = document.getElementById('bellDot');
      var bellLabel = document.getElementById('bellLabel');
      if (bellDot) {
        bellDot.style.background = this._bellEnabled ? '#4ade80' : '#ef4444';
      }
      if (bellLabel) {
        bellLabel.textContent = this._bellEnabled ? 'ON' : 'OFF';
      }

      var quietBadge = document.getElementById('quietModeBadge');
      if (quietBadge) {
        quietBadge.classList.toggle('hidden', !this._quietMode);
      }
    } catch (e) {}
  },

  // === AUDIO ENGINE ===
  _ensureAudioCtx: function() {
    if (!this._audioCtx) {
      this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this._audioCtx.state === 'suspended') {
      this._audioCtx.resume();
    }
    return this._audioCtx;
  },

  playBell: function(bellItem) {
    if (!this._bellEnabled) return;
    if (this._quietMode) return;

    // Check Friday pause
    if (this._fridayPause && new Date().getDay() === 5) return;

    var soundType = bellItem.suara || this._activeSoundType;

    // Custom audio file
    if (soundType === 'custom' && this._customAudioData) {
      this._playCustomAudio(this._customAudioData);
      this.showBellPopup(bellItem);
      this._logBell(bellItem, 'custom');
      return;
    }

    // TTS announcement
    if (soundType === 'tts' || this._ttsEnabled) {
      this._speakTTS(bellItem.nama);
    }

    // Built-in sounds by type
    switch (bellItem.jenis) {
      case 'shalat_dhuha':
      case 'shalat_dzuhur':
        this._playAdzan();
        break;
      case 'pulang':
        this._playPulangBell();
        break;
      case 'istirahat':
        this._playIstirahatBell();
        break;
      case 'masuk':
        this._playMasukBell();
        break;
      case 'pergantian':
        this._playPergantianBell();
        break;
      default:
        this._playDefaultBell();
    }

    this.showBellPopup(bellItem);
    this._logBell(bellItem, soundType);
  },

  playWarningBell: function(bellItem) {
    if (!this._bellEnabled || !this._warningEnabled || this._quietMode) return;
    try {
      var ctx = this._ensureAudioCtx();
      var now = ctx.currentTime;
      var vol = this._bellVolume;

      // Warning: 3 short beeps
      for (var i = 0; i < 3; i++) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0, now + i * 0.3);
        gain.gain.linearRampToValueAtTime(vol * 0.15, now + i * 0.3 + 0.05);
        gain.gain.linearRampToValueAtTime(0, now + i * 0.3 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.3);
        osc.stop(now + i * 0.3 + 0.3);
      }

      if (this._ttsEnabled) {
        setTimeout(function() { Signage._speakTTS('Peringatan, ' + bellItem.nama + ' akan dimulai dalam ' + Signage._warningMinutes + ' menit'); }, 1000);
      }
    } catch (e) {}
  },

  // === BELL SOUND VARIANTS ===
  _playMasukBell: function() {
    try {
      var ctx = this._ensureAudioCtx();
      var now = ctx.currentTime;
      var vol = this._bellVolume;
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
      // Final chime
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
    } catch (e) {}
  },

  _playPergantianBell: function() {
    try {
      var ctx = this._ensureAudioCtx();
      var now = ctx.currentTime;
      var vol = this._bellVolume;
      [440, 554.37, 659.25, 554.37, 440].forEach(function(freq, i) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + i * 0.18);
        gain.gain.linearRampToValueAtTime(vol * 0.25, now + i * 0.18 + 0.03);
        gain.gain.linearRampToValueAtTime(0, now + i * 0.18 + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.18);
        osc.stop(now + i * 0.18 + 0.18);
      });
    } catch (e) {}
  },

  _playIstirahatBell: function() {
    try {
      var ctx = this._ensureAudioCtx();
      var now = ctx.currentTime;
      var vol = this._bellVolume;
      // Descending pattern
      [783.99, 659.25, 523.25, 440].forEach(function(freq, i) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + i * 0.2);
        gain.gain.linearRampToValueAtTime(vol * 0.25, now + i * 0.2 + 0.03);
        gain.gain.linearRampToValueAtTime(0, now + i * 0.2 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.2);
        osc.stop(now + i * 0.2 + 0.2);
      });
    } catch (e) {}
  },

  _playPulangBell: function() {
    try {
      var ctx = this._ensureAudioCtx();
      var now = ctx.currentTime;
      var vol = this._bellVolume;
      // Happy ascending-descending
      [523.25, 659.25, 783.99, 1046.50, 783.99, 659.25, 523.25].forEach(function(freq, i) {
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
    } catch (e) {}
  },

  _playAdzan: function() {
    try {
      var ctx = this._ensureAudioCtx();
      var now = ctx.currentTime;
      var vol = this._bellVolume;
      // Simplified Adzan-like melody (Allahu Akbar pattern)
      var melody = [
        { f: 392, d: 0.5 }, { f: 440, d: 0.3 }, { f: 523.25, d: 0.8 },
        { f: 440, d: 0.3 }, { f: 523.25, d: 1.0 },
        { f: 392, d: 0.5 }, { f: 440, d: 0.3 }, { f: 523.25, d: 0.8 },
        { f: 587.33, d: 0.3 }, { f: 523.25, d: 1.0 },
      ];
      var t = now;
      melody.forEach(function(n) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = n.f;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(vol * 0.2, t + 0.05);
        gain.gain.setValueAtTime(vol * 0.2, t + n.d * 0.7);
        gain.gain.linearRampToValueAtTime(0, t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + n.d + 0.05);
        t += n.d;
      });
    } catch (e) {}
  },

  _playDefaultBell: function() {
    try {
      var ctx = this._ensureAudioCtx();
      var now = ctx.currentTime;
      var vol = this._bellVolume;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 440;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol * 0.2, now + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  },

  _playCustomAudio: function(dataUrl) {
    try {
      var audio = new Audio(dataUrl);
      audio.volume = this._bellVolume;
      audio.play().catch(function() {});
    } catch (e) {}
  },

  // === TTS ===
  _speakTTS: function(text) {
    if (!this._ttsEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      var utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this._ttsVoice;
      utterance.rate = this._ttsRate;
      utterance.volume = this._bellVolume;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  },

  // === BELL LOG ===
  _logBell: function(bellItem, soundType) {
    try {
      var log = JSON.parse(localStorage.getItem('mops_bel_log') || '[]');
      log.unshift({
        id: 'blog_' + Date.now(),
        waktu: new Date().toISOString(),
        jadwal_id: bellItem.id,
        nama: bellItem.nama,
        jenis: bellItem.jenis,
        suara: soundType,
      });
      // Keep last 200 entries
      if (log.length > 200) log = log.slice(0, 200);
      localStorage.setItem('mops_bel_log', JSON.stringify(log));
    } catch (e) {}
  },

  // === BELL POPUP ===
  showBellPopup: function(bellItem) {
    var popup = document.getElementById('bellPopup');
    var textEl = document.getElementById('bellPopupText');
    var subEl = document.getElementById('bellPopupSub');
    var timeEl = document.getElementById('bellPopupTime');
    var iconEl = document.getElementById('bellPopupIcon');

    var jenisInfo = this.BEL_JENIS[bellItem.jenis] || this.BEL_JENIS.masuk;

    textEl.textContent = bellItem.nama;
    subEl.textContent = jenisInfo.label;
    timeEl.textContent = bellItem.waktu + ' WIB';

    // Style by type
    iconEl.className = 'bell-popup-icon';
    if (bellItem.jenis === 'shalat_dhuha' || bellItem.jenis === 'shalat_dzuhur') {
      iconEl.classList.add('adzan-mode');
    }

    popup.classList.remove('hidden');

    var bellIndicator = document.getElementById('bellStatus');
    if (bellIndicator) bellIndicator.classList.add('active');

    var self = this;
    setTimeout(function() {
      popup.classList.add('hidden');
      if (bellIndicator) bellIndicator.classList.remove('active');
    }, 6000);
  },

  // === CLOCK & COUNTDOWN ===
  startClock: function() {
    var self = this;
    var update = function() {
      var now = new Date();
      var timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      var dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      document.getElementById('clockTime').textContent = timeStr;
      document.getElementById('clockDate').textContent = dateStr;

      // Hijri date
      var hijriEl = document.getElementById('clockHijri');
      if (hijriEl) {
        hijriEl.textContent = self._getHijriDate(now);
      }

      self.checkBellTrigger(now);
    };
    update();
    this._clockInterval = setInterval(update, 1000);
  },

  _getHijriDate: function(date) {
    try {
      // Simple approximation - in production use a proper Hijri library
      var options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      // Attempt to use Intl with Islamic calendar
      var formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', options);
      return formatter.format(date);
    } catch (e) {
      return '';
    }
  },

  checkBellTrigger: function(now) {
    var hh = String(now.getHours()).padStart(2, '0');
    var mm = String(now.getMinutes()).padStart(2, '0');
    var ss = String(now.getSeconds()).padStart(2, '0');
    var currentTime = hh + ':' + mm;
    var bellKey = currentTime + ':' + ss;

    // Check Friday pause
    if (this._fridayPause && now.getDay() === 5) return;

    var schedule = this.getTodaySchedule();

    // Warning bells (5 minutes before)
    if (this._warningEnabled && this._warningMinutes > 0) {
      var warningKey = 'warn_' + currentTime;
      if (this._lastWarningPlayed !== warningKey) {
        schedule.forEach(function(b) {
          var parts = b.waktu.split(':');
          var targetSec = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60;
          var currentSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
          var diff = targetSec - currentSec;
          if (diff > 0 && diff <= Signage._warningMinutes * 60 && diff > (Signage._warningMinutes * 60 - 60)) {
            if (b.jenis !== 'istirahat' && b.jenis !== 'shalat_dhuha' && b.jenis !== 'shalat_dzuhur') {
              Signage._lastWarningPlayed = warningKey;
              Signage.playWarningBell(b);
            }
          }
        });
      }
    }

    // Main bell trigger
    if (this._lastBellPlayed === bellKey) return;
    var matched = schedule.find(function(b) { return b.waktu === currentTime; });
    if (matched && ss === '00') {
      this._lastBellPlayed = bellKey;
      this.playBell(matched);
    }
  },

  startCountdown: function() {
    var self = this;
    var update = function() {
      var now = new Date();
      var hh = String(now.getHours()).padStart(2, '0');
      var mm = String(now.getMinutes()).padStart(2, '0');
      var currentTime = hh + ':' + mm;

      var schedule = self.getTodaySchedule();
      var nextBell = null;

      for (var i = 0; i < schedule.length; i++) {
        if (schedule[i].waktu > currentTime) {
          nextBell = schedule[i];
          break;
        }
      }

      var countdownTime = document.getElementById('countdownTime');
      var countdownLabel = document.getElementById('countdownLabel');
      var countdownBox = document.getElementById('countdownBox');

      if (!nextBell) {
        countdownTime.textContent = '--:--';
        countdownLabel.textContent = 'Tidak ada jadwal berikutnya';
        return;
      }

      var nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      var parts = nextBell.waktu.split(':');
      var targetSec = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60;
      var diff = targetSec - nowSec;
      if (diff < 0) diff = 0;

      var m = Math.floor(diff / 60);
      var s = diff % 60;

      // Urgent styling
      if (diff <= 300 && diff > 0) {
        countdownBox.style.background = 'rgba(245, 158, 11, 0.2)';
        countdownBox.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      } else {
        countdownBox.style.background = 'rgba(255, 255, 255, 0.1)';
        countdownBox.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      }

      countdownTime.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      countdownLabel.textContent = 'Menuju ' + nextBell.nama;

      self.updateBellTimeline(currentTime, schedule);
      self.updateUpcomingSchedule(currentTime, schedule);
      self.renderCurrentLesson(currentTime, schedule);
    };
    update();
    this._countdownInterval = setInterval(update, 1000);
  },

  // === RENDER ===
  render: function() {
    this.renderBellTimeline();
    this.renderCurrentLesson();
    this.renderAnnouncements();
    this.renderHadith();
    this.updateLogCount();
    this.initRunningText();
  },

  renderBellTimeline: function() {
    var container = document.getElementById('bellTimeline');
    var schedule = this.getTodaySchedule();
    var now = new Date();
    var currentTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    var icons = {
      masuk: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>',
      pergantian: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9"/></svg>',
      istirahat: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      pulang: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
    };

    var html = '';
    var self = this;
    schedule.forEach(function(bell) {
      var status = bell.waktu < currentTime ? 'past' : bell.waktu === currentTime ? 'active' : 'future';
      var jenisInfo = self.BEL_JENIS[bell.jenis] || {};
      html += '<div class="bell-item ' + status + '">';
      html += '<span class="bell-item-time">' + bell.waktu + '</span>';
      html += '<span class="bell-item-label">' + bell.nama + '</span>';
      html += '<span class="bell-item-type" style="color:' + (jenisInfo.color || '#6b7280') + '">';
      html += (icons[bell.jenis] || icons.masuk);
      html += ' ' + (jenisInfo.label || bell.jenis);
      html += '</span>';
      html += '</div>';
    });

    if (schedule.length === 0) {
      html = '<div class="schedule-empty">Tidak ada jadwal hari ini</div>';
    }

    container.innerHTML = html;
  },

  updateBellTimeline: function(currentTime, schedule) {
    var items = document.querySelectorAll('.bell-item');
    schedule.forEach(function(bell, i) {
      if (items[i]) {
        items[i].className = 'bell-item ' + (bell.waktu < currentTime ? 'past' : bell.waktu === currentTime ? 'active' : 'future');
      }
    });
  },

  renderCurrentLesson: function(currentTime, schedule) {
    var jadwal = JSON.parse(localStorage.getItem('mops_jadwal') || '[]');
    var mapel = JSON.parse(localStorage.getItem('mops_mata_pelajaran') || '[]');
    var guru = JSON.parse(localStorage.getItem('mops_guru') || '[]');

    var now = new Date();
    var dayIndex = now.getDay();
    var hari = this.HARI_MAP[dayIndex];

    // Find current time slot from TIME_SLOTS
    var slots = typeof TIME_SLOTS !== 'undefined' ? TIME_SLOTS : [];
    var currentSlot = null;
    for (var i = 0; i < slots.length; i++) {
      if (currentTime >= slots[i].mulai && currentTime < slots[i].selesai) {
        currentSlot = slots[i];
        break;
      }
    }

    var currentLessonEl = document.getElementById('currentLesson');
    var noLessonEl = document.getElementById('noLesson');

    if (!currentSlot) {
      currentLessonEl.style.display = 'none';
      noLessonEl.classList.remove('hidden');
      return;
    }

    currentLessonEl.style.display = 'block';
    noLessonEl.classList.add('hidden');

    var todaySchedule = jadwal.filter(function(j) { return j.hari === hari; });
    var slotLessons = todaySchedule.filter(function(j) { return j.jam_ke === currentSlot.jam_ke; });

    document.getElementById('lessonNumber').textContent = 'Pelajaran ke-' + currentSlot.jam_ke;

    if (slotLessons.length > 0) {
      var firstLesson = slotLessons[0];
      var mp = mapel.find(function(m) { return m.id === firstLesson.mata_pelajaran_id; });
      var uniqueTeachers = [];
      slotLessons.forEach(function(sl) {
        var g2 = guru.find(function(g) { return g.id === sl.guru_id; });
        if (g2 && uniqueTeachers.indexOf(g2.nama_lengkap) === -1) uniqueTeachers.push(g2.nama_lengkap);
      });

      document.getElementById('lessonSubject').textContent = mp ? mp.nama_mapel : '-';
      document.getElementById('lessonTeacher').textContent = 'Guru: ' + (uniqueTeachers.length > 0 ? uniqueTeachers.join(', ') : '-');
      document.getElementById('lessonClass').textContent = 'Kelas: Semua Kelas (' + slotLessons.length + ' kelas)';
    } else {
      document.getElementById('lessonSubject').textContent = 'Istirahat / Tidak Ada Jadwal';
      document.getElementById('lessonTeacher').textContent = '';
      document.getElementById('lessonClass').textContent = '';
    }
  },

  updateUpcomingSchedule: function(currentTime, schedule) {
    var container = document.getElementById('upcomingSchedule');
    var jadwal = JSON.parse(localStorage.getItem('mops_jadwal') || '[]');
    var mapel = JSON.parse(localStorage.getItem('mops_mata_pelajaran') || '[]');
    var guru = JSON.parse(localStorage.getItem('mops_guru') || '[]');

    var now = new Date();
    var dayIndex = now.getDay();
    var hari = this.HARI_MAP[dayIndex];

    var slots = typeof TIME_SLOTS !== 'undefined' ? TIME_SLOTS : [];
    var upcoming = [];
    var foundCurrent = false;

    for (var i = 0; i < slots.length; i++) {
      var ts = slots[i];
      if (currentTime < ts.selesai) {
        var slotJadwal = jadwal.filter(function(j) { return j.hari === hari && j.jam_ke === ts.jam_ke; });
        if (slotJadwal.length > 0) {
          var mp = mapel.find(function(m) { return m.id === slotJadwal[0].mata_pelajaran_id; });
          var gr = guru.find(function(g) { return g.id === slotJadwal[0].guru_id; });
          var isNext = currentTime < ts.mulai && !foundCurrent;
          if (currentTime >= ts.mulai) foundCurrent = true;
          upcoming.push({
            time: ts.mulai + ' - ' + ts.selesai,
            subject: mp ? mp.nama_mapel : '-',
            teacher: gr ? gr.nama_lengkap : '-',
            isNext: isNext
          });
        }
      }
    }

    // Also add upcoming bells
    var self = this;
    var bellUpcoming = schedule.filter(function(b) { return b.waktu > currentTime; }).slice(0, 5);

    if (upcoming.length === 0 && bellUpcoming.length === 0) {
      container.innerHTML = '<div class="schedule-empty">Tidak ada jadwal lagi hari ini</div>';
      return;
    }

    var html = '';
    upcoming.forEach(function(item) {
      html += '<div class="schedule-item' + (item.isNext ? ' next' : '') + '">';
      html += '<div class="schedule-item-time">' + item.time + '</div>';
      html += '<div class="schedule-item-subject">' + item.subject + '</div>';
      html += '<div class="schedule-item-teacher">' + item.teacher + '</div>';
      html += '</div>';
    });
    container.innerHTML = html;
  },

  renderAnnouncements: function() {
    var container = document.getElementById('announcementContent');
    var pengumuman = JSON.parse(localStorage.getItem('mops_pengumuman') || '[]');
    var settings = JSON.parse(localStorage.getItem('mops_settings') || '{}');
    var oldAnnouncements = settings.announcements || [];

    // Filter active & not expired
    var now = new Date().toISOString().split('T')[0];
    var activePengumuman = pengumuman.filter(function(p) {
      if (p.aktif === false) return false;
      if (p.tanggal_akhir && p.tanggal_akhir < now) return false;
      return true;
    });

    if (activePengumuman.length === 0 && oldAnnouncements.length === 0) {
      activePengumuman = [
        { judul: 'Selamat Datang', isi: 'Selamat datang di SI-MANTAP - Sistem Informasi Madrasah', prioritas: 'normal', aktif: true },
        { judul: 'Info', isi: 'Gunakan menu admin untuk menambah pengumuman baru', prioritas: 'normal', aktif: true },
      ];
    }

    var html = '';
    if (activePengumuman.length > 0) {
      activePengumuman.forEach(function(p) {
        var priorityClass = p.prioritas === 'tinggi' ? 'style="border-left:3px solid #ef4444;padding-left:8px"' :
                           p.prioritas === 'sedang' ? 'style="border-left:3px solid #f59e0b;padding-left:8px"' : '';
        html += '<div class="announcement-item" ' + priorityClass + '>';
        html += '<strong>' + p.judul + ':</strong> ' + p.isi;
        html += '</div>';
      });
    } else {
      oldAnnouncements.forEach(function(a) {
        html += '<div class="announcement-item">' + a + '</div>';
      });
    }
    container.innerHTML = html;
  },

  renderHadith: function() {
    var hadiths = [
      { text: 'Barangsiapa menempuh jalan untuk mencari ilmu, Allah akan memudahkan baginya jalan menuju surga.', source: 'HR. Muslim' },
      { text: 'Sesungguhnya Allah mencintai hamba yang berkarya dan terampil (ahli) serta profesional (mahir).', source: 'HR. Bayhaqi' },
      { text: 'Tuntutlah ilmu dari buaian hingga ke liang lahat.', source: 'HR. Ibnu Majah' },
      { text: 'Ilmu itu lebih baik daripada harta. Ilmu akan menjaga engkau, dan harta akan engkau jaga.', source: 'HR. Al-Bayhaqi' },
      { text: 'Barangsiapa yang melalui jalan untuk menuntut ilmu, maka Allah akan memudahkan baginya jalan ke surga.', source: 'HR. Muslim' },
      { text: 'Mintalah kepada Allah ilmu yang bermanfaat, dan berlindunglah kepada Allah dari ilmu yang tidak bermanfaat.', source: 'HR. Ibnu Majah' },
      { text: 'Siapa yang mengerjakan kebaikan seberat zarrah pun, niscaya dia akan melihat (balasan)nya.', source: 'QS. Az-Zalzalah: 7' },
      { text: 'Sesungguhnya Allah tidak melihat kepada rupa dan harta kalian, tetapi Allah melihat kepada hati dan amal kalian.', source: 'HR. Muslim' },
      { text: 'Orang yang paling sempurna imannya adalah yang paling baik akhlaknya.', source: 'HR. Abu Dawud' },
      { text: 'Permudahlah dan janganlah kamu mempersulit, dan berilah kabar gembira dan janganlah kamu mengusir.', source: 'HR. Bukhari' },
      { text: 'Jadilah engkau di dunia seolah-olah engkau orang asing atau musafir.', source: 'HR. Bukhari' },
      { text: 'Bertakwalah kamu kepada Allah di mana pun kamu berada, dan ikutilah kejelekan dengan kebaikan.', source: 'HR. Tirmidzi' },
      { text: 'Orang yang kuat itu bukanlah orang yang banyak berkelahi, tetapi orang yang kuat ialah orang yang menahan dirinya ketika marah.', source: 'HR. Bukhari & Muslim' },
      { text: 'Carilah ilmu walaupun ke Tiongkok, karena mencari ilmu itu wajib bagi setiap muslim.', source: 'HR. Ibnu Majah' },
      { text: 'Dua kebiasaan yang tidak pernah hilang dari diriku: berpuasa dan sholat malam.', source: 'HR. Ahmad' },
    ];

    var today = new Date();
    var dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    var index = dayOfYear % hadiths.length;
    var hadith = hadiths[index];

    document.getElementById('hadithText').textContent = '\u201C' + hadith.text + '\u201D';
    document.getElementById('hadithSource').textContent = '\u2014 ' + hadith.source;
  },

  initRunningText: function() {
    var el = document.getElementById('runningText');
    if (!el) return;
    var saved = localStorage.getItem('mops_running_text');
    var text = (saved && saved.trim()) || '🕌 Selamat Datang di SI-MANTAP (Sistem Informasi Madrasah yang Amanah & Terpusat) — Sistem Digital Resmi Madrasah. Mari bersama membangun tata kelola madrasah yang amanah, profesional, transparan, akuntabel, efektif, dan berbasis teknologi demi meningkatkan mutu pelayanan pendidikan Islam. ✨ Madrasah Hebat, Madrasah Bermartabat. 🕊 Semoga setiap data yang dikelola menjadi amal jariyah.';
    el.textContent = text;
  },

  updateLogCount: function() {
    var el = document.getElementById('bellLogCount');
    if (!el) return;
    var log = JSON.parse(localStorage.getItem('mops_bel_log') || '[]');
    el.textContent = log.length > 0 ? log.length + ' bel tercatat hari ini' : '';
  },

  // === INIT ===
  init: function() {
    this.loadSettings();
    this.applySettings();
    this.startClock();
    this.startCountdown();
    this.render();
    this.startAutoRefresh();
    this.initRunningText();

    // Load custom audio if set
    try {
      var s = JSON.parse(localStorage.getItem('mops_settings') || '{}');
      if (s.bellCustomAudio) {
        this._customAudioData = s.bellCustomAudio;
      }
    } catch (e) {}
  },

  startAutoRefresh: function() {
    var self = this;
    this._refreshInterval = setInterval(function() {
      self.render();
      self.loadSettings();
      self.applySettings();
    }, 30000);
  },

  destroy: function() {
    if (this._clockInterval) clearInterval(this._clockInterval);
    if (this._countdownInterval) clearInterval(this._countdownInterval);
    if (this._refreshInterval) clearInterval(this._refreshInterval);
  }
};

// === GLOBAL HELPERS ===
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(function() {});
  } else {
    document.exitFullscreen();
  }
}

// === INIT ===
document.addEventListener('DOMContentLoaded', function() {
  Signage.init();
});
