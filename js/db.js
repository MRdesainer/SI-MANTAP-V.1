// ============================================
// MADRASAHOPS - DATABASE UTILITY LAYER
// ============================================

function getDB() {
  if (supabase) return supabase;
  return null;
}

function _isOnline() {
  try {
    return typeof SUPABASE_URL !== 'undefined' && supabase && SUPABASE_URL && !SUPABASE_URL.includes('YOUR_');
  } catch(e) { return false; }
}

function _isValidUUID(v) {
  return v && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

function getMadrasahId() {
  const u = (typeof Auth !== 'undefined' && Auth.currentUser && Auth.currentUser.madrasah_id) ? Auth.currentUser.madrasah_id : null;
  if (_isValidUUID(u)) return u;
  try {
    const list = JSON.parse(localStorage.getItem('mops_madrasah') || '[]');
    if (list.length > 0 && _isValidUUID(list[0].id)) return list[0].id;
  } catch(e) {}
  return null;
}

const DB = {
  _clean(record) {
    const out = {};
    for (const [k, v] of Object.entries(record)) {
      if (v === '' || v === undefined) out[k] = null;
      else out[k] = v;
    }
    return out;
  },

  async getAll(table, filters = {}, orderBy = 'created_at', ascending = false) {
    const db = getDB();
    if (db) {
      let query = db.from(table).select('*');
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'string' && value.includes('%')) {
            query = query.ilike(key, value);
          } else if (Array.isArray(value)) {
            query = query.in(key, value);
          } else {
            query = query.eq(key, value);
          }
        }
      });
      const { data, error } = await query.order(orderBy, { ascending });
      if (error) throw error;
      return data || [];
    } else {
      let data = JSON.parse(localStorage.getItem(`mops_${table}`) || '[]');
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'string' && value.includes('%')) {
            const search = value.replace(/%/g, '').toLowerCase();
            data = data.filter(d => String(d[key] || '').toLowerCase().includes(search));
          } else {
            data = data.filter(d => d[key] === value);
          }
        }
      });
      data.sort((a, b) => {
        const va = a[orderBy] || '';
        const vb = b[orderBy] || '';
        return ascending ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
      });
      return data;
    }
  },

  async getById(table, id) {
    const db = getDB();
    if (db) {
      const { data, error } = await db.from(table).select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    } else {
      const data = JSON.parse(localStorage.getItem(`mops_${table}`) || '[]');
      return data.find(d => d.id === id) || null;
    }
  },

  async insert(table, record) {
    const db = getDB();
    if (db) {
      const cleaned = this._clean(record);
      const { data, error } = await db.from(table).insert(cleaned).select().single();
      if (error) {
        console.error(`[DB] insert ${table} error:`, error);
        throw new Error(error.message + (error.hint ? ' | ' + error.hint : ''));
      }
      const localData = JSON.parse(localStorage.getItem(`mops_${table}`) || '[]');
      localData.push(data);
      localStorage.setItem(`mops_${table}`, JSON.stringify(localData));
      return data;
    } else {
      const data = JSON.parse(localStorage.getItem(`mops_${table}`) || '[]');
      const newRecord = {
        ...record,
        id: 'loc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      };
      data.push(newRecord);
      localStorage.setItem(`mops_${table}`, JSON.stringify(data));
      return newRecord;
    }
  },

  async update(table, id, updates) {
    const db = getDB();
    if (db) {
      const cleaned = this._clean({ ...updates, updated_at: new Date().toISOString() });
      const { data, error } = await db.from(table).update(cleaned).eq('id', id).select().single();
      if (error) {
        console.error(`[DB] update ${table} error:`, error);
        throw new Error(error.message + (error.hint ? ' | ' + error.hint : ''));
      }
      const localData = JSON.parse(localStorage.getItem(`mops_${table}`) || '[]');
      const idx = localData.findIndex(d => d.id === id);
      if (idx !== -1) { localData[idx] = { ...localData[idx], ...data }; }
      else { localData.push(data); }
      localStorage.setItem(`mops_${table}`, JSON.stringify(localData));
      return data;
    } else {
      const data = JSON.parse(localStorage.getItem(`mops_${table}`) || '[]');
      const idx = data.findIndex(d => d.id === id);
      if (idx === -1) throw new Error('Record not found');
      data[idx] = { ...data[idx], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem(`mops_${table}`, JSON.stringify(data));
      return data[idx];
    }
  },

  async delete(table, id) {
    const db = getDB();
    if (db) {
      const { error } = await db.from(table).delete().eq('id', id);
      if (error) throw error;
      let localData = JSON.parse(localStorage.getItem(`mops_${table}`) || '[]');
      localData = localData.filter(d => d.id !== id);
      localStorage.setItem(`mops_${table}`, JSON.stringify(localData));
      return true;
    } else {
      let data = JSON.parse(localStorage.getItem(`mops_${table}`) || '[]');
      data = data.filter(d => d.id !== id);
      localStorage.setItem(`mops_${table}`, JSON.stringify(data));
      return true;
    }
  },

  async count(table, filters = {}) {
    const db = getDB();
    if (db) {
      let query = db.from(table).select('*', { count: 'exact', head: true });
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    } else {
      const data = JSON.parse(localStorage.getItem(`mops_${table}`) || '[]');
      return data.filter(d => {
        return Object.entries(filters).every(([key, value]) => d[key] === value);
      }).length;
    }
  },

  async search(table, field, searchTerm) {
    const db = getDB();
    if (db) {
      const { data, error } = await db.from(table).select('*').ilike(field, `%${searchTerm}%`);
      if (error) throw error;
      return data || [];
    } else {
      const data = JSON.parse(localStorage.getItem(`mops_${table}`) || '[]');
      const term = searchTerm.toLowerCase();
      return data.filter(d => String(d[field] || '').toLowerCase().includes(term));
    }
  },

  async insertBatch(table, records) {
    const db = getDB();
    if (db) {
      const cleaned = records.map(r => this._clean(r));
      const { data, error } = await db.from(table).insert(cleaned).select();
      if (error) {
        console.error(`[DB] insertBatch ${table} error:`, error);
        throw new Error(error.message + (error.hint ? ' | ' + error.hint : ''));
      }
      const localData = JSON.parse(localStorage.getItem(`mops_${table}`) || '[]');
      localData.push(...(data || []));
      localStorage.setItem(`mops_${table}`, JSON.stringify(localData));
      return data || [];
    } else {
      const existing = JSON.parse(localStorage.getItem(`mops_${table}`) || '[]');
      const newRecords = records.map(r => ({
        ...r,
        id: r.id || 'loc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      }));
      existing.push(...newRecords);
      localStorage.setItem(`mops_${table}`, JSON.stringify(existing));
      return newRecords;
    }
  },

  async logAudit(userId, action, tableName, recordId, oldData, newData) {
    await this.insert('audit_log', {
      user_id: userId,
      action,
      table_name: tableName,
      record_id: recordId,
      old_data: oldData ? JSON.stringify(oldData) : null,
      new_data: newData ? JSON.stringify(newData) : null,
    });
  },

  async pullAll() {
    if (!_isOnline()) return;
    const tables = [
      'users', 'guru', 'murid', 'kelas', 'mata_pelajaran', 'jadwal',
      'absensi', 'absensi_guru', 'kalender', 'wali_kelas', 'tahun_pelajaran',
      'semester', 'ruang', 'penilaian', 'rapor', 'sarana', 'keuangan_transaksi',
      'keuangan_kategori', 'keuangan_anggaran', 'rapbm', 'ppdb_pendaftaran',
      'madrasah', 'pengumuman', 'running_text', 'bel_jadwal', 'bel_log',
      'kritik_saran', 'prestasi', 'ortu', 'ortu_murid', 'profiles'
    ];
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*');
        if (!error && data) {
          localStorage.setItem(`mops_${table}`, JSON.stringify(data));
        }
      } catch(e) { console.warn(`[DB] pull ${table} gagal:`, e.message); }
    }
    try {
      const { data: sRows, error: sErr } = await supabase.from('settings').select('*');
      if (!sErr && sRows && sRows.length > 0) {
        const appRow = sRows.find(r => r.key === 'app_settings');
        if (appRow && appRow.value) {
          const local = JSON.parse(localStorage.getItem('mops_settings') || '{}');
          const merged = { ...appRow.value, ...local };
          localStorage.setItem('mops_settings', JSON.stringify(merged));
        }
      }
    } catch(e) { console.warn('[DB] pull settings gagal:', e.message); }
  },

  _realtimeChannel: null,

  subscribeRealtime() {
    if (!_isOnline() || this._realtimeChannel) return;
    this._realtimeChannel = supabase.channel('mops_changes');
    const tables = [
      'users', 'guru', 'murid', 'kelas', 'mata_pelajaran', 'jadwal',
      'absensi', 'absensi_guru', 'kalender', 'penilaian', 'rapor',
      'keuangan_transaksi', 'ppdb_pendaftaran', 'pengumuman', 'running_text',
      'bel_jadwal', 'kritik_saran', 'sarana', 'settings'
    ];
    this._realtimeChannel.on('postgres_changes', { event: '*', schema: 'public' }, async (payload) => {
      const table = payload.table;
      if (!tables.includes(table)) return;
      try {
        const { data, error } = await supabase.from(table).select('*');
        if (!error && data) {
          localStorage.setItem(`mops_${table}`, JSON.stringify(data));
          if (typeof Realtime !== 'undefined') Realtime.broadcast('data_changed', table);
        }
      } catch(e) {}
    });
    this._realtimeChannel.subscribe();
    console.log('[DB] Realtime subscriptions aktif');
  }
};
