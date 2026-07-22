// ============================================
// MADRASAHOPS - UTILITY FUNCTIONS
// ============================================

const Utils = {
  formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  },

  formatShortDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  },

  formatCurrency(amount) {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  },

  formatNumber(num) {
    if (!num && num !== 0) return '0';
    return new Intl.NumberFormat('id-ID').format(num);
  },

  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  generateNoPendaftaran(jenjang) {
    const year = new Date().getFullYear();
    const prefix = jenjang === 'MI' ? 'MI' : jenjang === 'MTs' ? 'MT' : jenjang === 'MA' ? 'MA' : 'MK';
    const seq = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
    return `${prefix}-${year}-${seq}`;
  },

  debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
  },

  calculateAge(birthDate) {
    if (!birthDate) return '-';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age + ' tahun';
  },

  calculatePredikat(rataRata) {
    if (rataRata >= 90) return 'Sangat Baik';
    if (rataRata >= 80) return 'Baik';
    if (rataRata >= 70) return 'Cukup';
    if (rataRata >= 50) return 'Kurang';
    return 'Sangat Kurang';
  },

  getPredikatColor(predikat) {
    const colors = {
      'Sangat Baik': 'green', 'Baik': 'blue', 'Cukup': 'yellow',
      'Kurang': 'orange', 'Sangat Kurang': 'red',
    };
    return colors[predikat] || 'gray';
  },

  parseCSV(text) {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const obj = {};
      headers.forEach((h, i) => obj[h] = values[i] || '');
      return obj;
    });
  },

  toJSONCSV(data, headers) {
    if (!data.length) return '';
    const cols = headers || Object.keys(data[0]);
    const rows = [cols.join(',')];
    data.forEach(row => {
      rows.push(cols.map(c => `"${(row[c] || '').toString().replace(/"/g, '""')}"`).join(','));
    });
    return rows.join('\n');
  },

  downloadCSV(data, filename, headers) {
    const csv = this.toJSONCSV(data, headers);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  },

  downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  },

  uploadFile(accept, callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = (e) => callback(e.target.files[0]);
    input.click();
  },

  confirm(message) {
    return window.confirm(message);
  },

  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const val = item[key];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  },

  sumBy(array, key) {
    return array.reduce((sum, item) => sum + (parseFloat(item[key]) || 0), 0);
  },

  chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  showToast(type, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = {
      success: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
      error: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
      warning: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>',
      info: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    };
    toast.innerHTML = `${icons[type] || icons.info} ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  showLoading() {
    document.getElementById('loadingOverlay')?.classList.remove('hidden');
  },

  hideLoading() {
    document.getElementById('loadingOverlay')?.classList.add('hidden');
  },

  openModal(title, bodyHtml, footerHtml = '') {
    document.getElementById('appModalTitle').textContent = title;
    document.getElementById('appModalBody').innerHTML = bodyHtml;
    document.getElementById('appModalFooter').innerHTML = footerHtml;
    document.getElementById('appModal').classList.add('active');
  },

  closeModal() {
    document.getElementById('appModal').classList.remove('active');
  },
};

function showToast(type, message) { Utils.showToast(type, message); }
function showLoading() { Utils.showLoading(); }
function hideLoading() { Utils.hideLoading(); }
function openModal(title, body, footer) { Utils.openModal(title, body, footer); }
function closeModal() { Utils.closeModal(); }
