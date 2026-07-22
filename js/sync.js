// ============================================
// SI-MANTAP - CROSS-DEVICE SYNC LAYER
// ============================================
// Loads before other scripts. Intercepts localStorage writes
// for mops_* keys and syncs to server API + listens to SSE.

const SyncAPI = {
  available: false,
  _sse: null,
  _syncing: false,
  API_BASE: window.location.origin,

  SKIP_KEYS: ['mops_current_user', 'mops_dark_mode', 'mops_settings', 'mops_sync_log'],

  async init() {
    try {
      if (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL && !SUPABASE_URL.includes('YOUR_')) {
        console.log('[Sync] Supabase terdeteksi, skip server sync');
        return;
      }
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 3000);
      const resp = await fetch(this.API_BASE + '/api/tables', { signal: ctrl.signal });
      clearTimeout(t);
      if (resp.ok) {
        this.available = true;
        console.log('[Sync] Server connected');
        this._interceptLocalStorage();
        await this.pullAll();
        await this._pushAll();
        this._connectSSE();
      }
    } catch (e) {
      console.log('[Sync] Server unavailable, using localStorage only');
    }
  },

  async pullAll() {
    if (!this.available) return;
    try {
      const resp = await fetch(this.API_BASE + '/api/tables');
      const tables = await resp.json();
      for (const table of tables) {
        if (table === 'audit_log' || table === 'sync_log') continue;
        await this.pullTable(table);
      }
    } catch (e) {
      console.warn('[Sync] pullAll failed:', e.message);
    }
  },

  async pullTable(table) {
    if (!this.available) return;
    try {
      const resp = await fetch(this.API_BASE + '/api/table/' + encodeURIComponent(table));
      if (!resp.ok) return;
      const serverData = await resp.json();
      if (!Array.isArray(serverData)) return;

      this._syncing = true;
      const localData = JSON.parse(localStorage.getItem('mops_' + table) || '[]');

      if (localData.length === 0 && serverData.length > 0) {
        localStorage.setItem('mops_' + table, JSON.stringify(serverData));
      } else if (serverData.length > 0) {
        const merged = this._mergeData(localData, serverData);
        localStorage.setItem('mops_' + table, JSON.stringify(merged));
      }
      this._syncing = false;
    } catch (e) {
      this._syncing = false;
    }
  },

  _mergeData(local, server) {
    const map = new Map();
    for (const r of server) {
      if (r.id) map.set(r.id, r);
    }
    for (const r of local) {
      if (r.id && !map.has(r.id)) {
        map.set(r.id, r);
      }
    }
    return Array.from(map.values());
  },

  async pushTable(table, data) {
    if (!this.available) return;
    try {
      await fetch(this.API_BASE + '/api/table/' + encodeURIComponent(table), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn('[Sync] pushTable failed:', e.message);
    }
  },

  async _pushAll() {
    if (!this.available) return;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('mops_') || this.SKIP_KEYS.includes(key)) continue;
      const table = key.replace('mops_', '');
      if (table === 'audit_log' || table === 'sync_log') continue;
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(data) && data.length > 0) {
          await this.pushTable(table, data);
        }
      } catch (e) {}
    }
  },

  _interceptLocalStorage() {
    const orig = Storage.prototype.setItem;
    const self = this;
    Storage.prototype.setItem = function(key, value) {
      orig.call(this, key, value);
      if (!key.startsWith('mops_') || self._syncing) return;
      if (self.SKIP_KEYS.includes(key)) return;
      const table = key.replace('mops_', '');
      try {
        const data = JSON.parse(value);
        if (Array.isArray(data)) {
          self.pushTable(table, data);
        }
      } catch (e) {}
    };
  },

  _connectSSE() {
    if (this._sse) {
      this._sse.close();
    }
    this._sse = new EventSource(this.API_BASE + '/api/events');
    this._sse.onmessage = () => {};

    this._sse.addEventListener('data_changed', (e) => {
      try {
        const { table } = JSON.parse(e.data);
        if (!table) return;
        console.log('[Sync] SSE:', table);
        this.pullTable(table).then(() => {
          if (typeof Realtime !== 'undefined') {
            Realtime.broadcast('data_changed', table);
          }
        });
      } catch (err) {}
    });

    this._sse.onerror = () => {
      console.log('[Sync] SSE reconnecting...');
    };
  },
};

SyncAPI.init();
