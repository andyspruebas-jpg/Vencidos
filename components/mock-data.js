// ═══════════════════════════════════════════════
// API CLIENT — Vencidos App v3
// Replaces mock data. All state backed by /api/ backend.
// ═══════════════════════════════════════════════

const API_BASE = '/vencidos/api';

// ── Static reference data (no API needed) ────────
const SUCURSALES = [
  { id: 'AM', name: 'América',    city: 'Santa Cruz' },
  { id: 'PR', name: 'Prado',      city: 'La Paz' },
  { id: 'SH', name: 'Shopping',   city: 'Santa Cruz' },
  { id: 'MC', name: 'Megacenter', city: 'Santa Cruz' },
  { id: 'ML', name: 'Multicine',  city: 'Santa Cruz' },
  { id: 'EQ', name: 'Equipetrol', city: 'Santa Cruz' },
  { id: 'CB', name: 'Cinebol',    city: 'Cochabamba' },
  { id: 'BN', name: 'Beni',       city: 'Trinidad' },
  { id: 'CO', name: 'Comercio',   city: 'La Paz' },
  { id: 'PN', name: 'Pinos',      city: 'Santa Cruz' },
  { id: 'SM', name: 'San Martín', city: 'Santa Cruz' },
  { id: 'SG', name: 'San Miguel', city: 'Santa Cruz' },
  { id: 'SU', name: 'Sucre',      city: 'Sucre' },
  { id: 'VN', name: 'Ventura',    city: 'Santa Cruz' },
  { id: 'AG', name: '06 Agosto',  city: 'La Paz' },
  { id: 'VL', name: 'Velarde',    city: 'Santa Cruz' },
];

const PROVEEDORES = [
  { name: 'BELLCOS BOLIVIA SA.',             cambio: true },
  { name: 'CAROLE BEAUTY SUPPLY S.R.L.',     cambio: true },
  { name: 'MEGALABS BOLIVIA S.R.L.',         cambio: true },
  { name: 'AGRONAT S.A.',                    cambio: true },
  { name: 'COLHER GROUP S.R.L.',             cambio: true },
  { name: 'MARIA FERNANDA PRADA RAMIREZ',    cambio: false },
  { name: 'AMANDA OFICIAL',                  cambio: false },
  { name: 'BELMED LIMITADA',                 cambio: false },
  { name: 'HBDERM SRL',                      cambio: false },
  { name: 'CORPORACION FRAGANCE S.R.L.',     cambio: false },
  { name: 'DISTRIBUIDORA AROMAS S.R.L.',     cambio: true },
  { name: 'ELITE BRANDS S.R.L.',             cambio: false },
  { name: 'AIDISA BOLIVIA S.A.',             cambio: false },
  { name: 'ALIMENTOS AGUA CLARA S.A.',       cambio: false },
  { name: 'SOCIEDAD COMERCIAL HANSA LTDA.',  cambio: false },
];

const CATEGORIAS = [
  { cat1: 'ALIMENTOS',          cat2: 'PROTEÍNA ANIMAL',   cat3: 'ENLATADOS' },
  { cat1: 'ALIMENTOS',          cat2: 'CEREALES',           cat3: 'AVENAS' },
  { cat1: 'ALIMENTOS',          cat2: 'GALLETAS',           cat3: 'INTEGRALES' },
  { cat1: 'ALIMENTOS',          cat2: 'LÁCTEOS',            cat3: 'LECHE VEGETAL' },
  { cat1: 'ALIMENTOS',          cat2: 'SALSAS',             cat3: 'SALSAS FRÍAS' },
  { cat1: 'BEBIDAS Y TABACOS',  cat2: 'GASEOSAS',           cat3: 'GASEOSAS' },
  { cat1: 'BEBIDAS Y TABACOS',  cat2: 'BEBIDAS ALCOHÓLICAS',cat3: 'ESPUMANTES' },
  { cat1: 'CUIDADO PERSONAL',   cat2: 'MANOS Y PIES',       cat3: 'ESMALTES' },
  { cat1: 'CUIDADO PERSONAL',   cat2: 'DERMOCOSMÉTICA',     cat3: 'CREMAS' },
  { cat1: 'CUIDADO PERSONAL',   cat2: 'LABIAL',             cat3: 'BÁLSAMO LABIAL' },
  { cat1: 'CUIDADO PERSONAL',   cat2: 'MAQUILLAJE',         cat3: 'SOMBRAS' },
  { cat1: 'HOGAR',              cat2: 'COCINA',             cat3: 'UTENSILIOS' },
  { cat1: 'HOGAR',              cat2: 'LIMPIEZA',           cat3: 'DETERGENTES' },
];

const ORIGENES       = ['INSUMO', 'INTERNACIONAL', 'N/A', 'NACIONAL', 'PRODUCCION'];
const ABC_VALUES     = ['AA', 'A', 'B', 'C', 'D', 'E'];
const ETIQUETAS      = ['DESCONTINUADO', 'ESTACIONAL', 'Ninguno', 'POR ARCHIVAR', 'POR DESCONTINUAR', 'SOBRECOBERTURA', 'VIGENTE'];
const COBERTURA_RANGES = ['0-7', '7-14', '14-30', '>30', '>60', '>90', '>120', '>180'];
const ESTADOS        = [
  { id: 'proximo_vencer',  label: 'Próximo a vencer',          color: '#F59E0B' },
  { id: 'vence_mas_3m',    label: 'Vence en más de 3 meses',   color: '#3B82F6' },
  { id: 'venta_impulso',   label: 'Venta Impulso',             color: '#8B5CF6' },
  { id: 'vence_menos_3m',  label: 'Vence en menos de 3 meses', color: '#F97316' },
  { id: 'devoluciones',    label: 'Devoluciones',              color: '#14B8A6' },
  { id: 'ya_vencido',      label: 'Ya vencido',                color: '#EF4444' },
];
const ESTADOS_DANADO      = ['USO PARA TESTER', 'DESECHO/INSERVIBLE', 'VERDE', 'VENTA INTERNA', 'TRASPASO'];
const ACCIONES_VENCIDOS   = ['Impulsar venta en sala', 'Descuento del 10%', 'Descuento del 15%', 'Descuento del 20%', 'Traspaso a almacén para cambio', 'Traspaso a su almacén de vencidos'];
const ACCIONES_DANADOS    = ['Dar de baja para tester', 'Traspaso a su almacén de dañados', 'Dar descuento del 30%', 'Dar descuento del 20%', 'Traspaso'];

const PRODUCT_NAMES = [
  ['7771609004265', 'SCHWEPPES GASEOSA GINGER ALE 990ML'],
  ['8001860252846', 'LECHE VEGETAL RISO AVENA ORIGINAL 1L'],
  ['7771257080345', 'SALSA GOLF BRIXY POTE 350GR'],
  ['7771605000759', 'SIMBA GASEOSA 2L'],
  ['7790895007064', 'COSTA GALLETA SALVADO INTEGRALES 250GR'],
  ['7771383630532', 'AVENA INSTANTÁNEA QUAKER 300GR'],
  ['7772109000122', 'CHAMPAGNE ESPUMANTE BRUT 750ML'],
  ['4011700742547', '4711 PERFUME ACQUA LEMON 50ML'],
  ['7840029230001', 'ATÚN ENLATADO EN ACEITE 170GR'],
  ['7891116079805', 'OLLA A PRESIÓN 6L INOX'],
  ['6971383631157', 'SET PERFILADOR CEJAS 2PCS'],
  ['7772115221436', 'SARDINA EN SALSA DE TOMATE 125GR'],
  ['8411700757039', 'NIVEA BÁLSAMO LABIAL 4.8GR'],
  ['7790580125004', 'CHINA GLAZE ESMALTE 14ML CORAL'],
  ['7771234567890', 'WET N WILD PALETA SOMBRAS 10 TONOS'],
  ['7772345678901', 'CLINIQUE LOCIÓN ANTI-BLEMISH 200ML'],
  ['7773456789012', 'SPLASH AROMASENSE 250ML'],
  ['7774567890123', 'DETERGENTE LÍQUIDO ARIEL 2L'],
  ['7775678901234', 'GALLETA MABEL SALVADO NATURAL 200GR'],
  ['7776789012345', 'BASSA HYDRIN SERUM ANTIEDAD 30ML'],
];

// ── Pure calculation functions ────────────────────
function calcAccionVencido(proveedor, proveedorCambio, estadoVenc, sinFecha) {
  if (sinFecha) return 'Impulsar venta en sala';
  const provEspecial = ['BELLCOS BOLIVIA SA.', 'CAROLE BEAUTY SUPPLY S.R.L.', 'MEGALABS BOLIVIA S.R.L.'];
  const provTiempo   = ['AGRONAT S.A.', 'COLHER GROUP S.R.L.'];
  if (proveedorCambio && provEspecial.includes(proveedor) && estadoVenc === 'Ya vencido') return 'Traspaso a almacén para cambio';
  if (provTiempo.includes(proveedor)) {
    if (estadoVenc === 'Vence en menos de 3 meses') return 'Traspaso a almacén para cambio';
    if (proveedor === 'COLHER GROUP S.R.L.' && estadoVenc === 'Vence en 4 meses') return 'Traspaso a almacén para cambio';
  }
  if (proveedorCambio) {
    if (estadoVenc === 'Ya vencido') return 'Traspaso a almacén para cambio';
    if (estadoVenc === 'Vencido')    return 'Traspaso a su almacén de vencidos';
    if (estadoVenc === 'Vence en menos de 3 meses') return 'Descuento del 15%';
    if (estadoVenc === 'Vence en más de 3 meses')   return 'Descuento del 10%';
    if (estadoVenc === 'Próximo a vencer')           return 'Impulsar venta en sala';
    return '';
  }
  if (estadoVenc === 'Ya vencido' || estadoVenc === 'Vencido') return 'Traspaso a su almacén de vencidos';
  if (estadoVenc === 'Vence en menos de 3 meses' || estadoVenc === 'Vence en más de 3 meses') return 'Descuento del 20%';
  if (estadoVenc === 'Próximo a vencer') return 'Impulsar venta en sala';
  return '';
}

function calcAccionDanado(estadoDanado, proveedorCambio, traspasoDestino) {
  if (estadoDanado === 'USO PARA TESTER')    return 'Dar de baja para tester';
  if (estadoDanado === 'DESECHO/INSERVIBLE') return 'Traspaso a su almacén de dañados';
  if (estadoDanado === 'VERDE')              return 'Dar descuento del 30%';
  if (estadoDanado === 'VENTA INTERNA')      return 'Dar descuento del 20%';
  if (estadoDanado === 'TRASPASO')           return traspasoDestino || 'Traspaso';
  return '';
}

function calcDiasRestantes(fechaVencimiento) {
  if (!fechaVencimiento) return null;
  const now = new Date(); now.setHours(0,0,0,0);
  const vence = new Date(fechaVencimiento + 'T00:00:00');
  return Math.floor((vence - now) / (1000 * 60 * 60 * 24));
}

function calcEstadoVencimiento(dias) {
  if (dias === null || dias === undefined) return '';
  if (dias < -30) return 'Ya vencido';
  if (dias < 0)   return 'Vencido';
  if (dias < 90)  return 'Vence en menos de 3 meses';
  if (dias < 180) return 'Vence en más de 3 meses';
  return 'Próximo a vencer';
}

function calcEstadoSOS(fechaVencimiento, proveedorCambio) {
  if (!fechaVencimiento) return 'proximo_vencer';
  const dias = calcDiasRestantes(fechaVencimiento);
  if (dias === null) return 'proximo_vencer';
  if (dias < 0) return proveedorCambio ? 'devoluciones' : 'ya_vencido';
  if (dias < 90) return 'vence_menos_3m';
  if (dias < 180) return 'vence_mas_3m';
  return 'proximo_vencer';
}

function calcCobertura(days) {
  if (days <= 7)   return '0-7';
  if (days <= 14)  return '7-14';
  if (days <= 30)  return '14-30';
  if (days <= 60)  return '>30';
  if (days <= 90)  return '>60';
  if (days <= 120) return '>90';
  if (days <= 180) return '>120';
  return '>180';
}

// ── In-memory cache (populated by initFromAPI) ────
let MOCK_PRODUCTS      = [];
let USERS              = [];
let AUDIT_LOG          = [];
let MOCK_NOTIFICATIONS = [];
let MONTHLY_DATA       = [];
let AUTO_SYNC_TIMER    = null;
let AUTO_SYNC_RUNNING  = false;
let AUTO_SYNC_IN_FLIGHT = false;

// ── API helper ────────────────────────────────────
async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

function dispatchChange(type) {
  window.dispatchEvent(new CustomEvent('vencidos_data_changed', { detail: { type } }));
}

function sameData(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

async function refreshNotifications() {
  const notifications = await apiFetch('/notifications');
  MOCK_NOTIFICATIONS = notifications;
  window.MOCK.MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS;
  dispatchChange('notifications');
  return MOCK_NOTIFICATIONS;
}

async function syncFromAPI() {
  if (AUTO_SYNC_IN_FLIGHT) return;
  AUTO_SYNC_IN_FLIGHT = true;
  try {
    const [products, users, audit, notifications, monthly] = await Promise.all([
      apiFetch('/products'),
      apiFetch('/users'),
      apiFetch('/audit'),
      apiFetch('/notifications'),
      apiFetch('/monthly'),
    ]);

    if (!sameData(MOCK_PRODUCTS, products)) {
      MOCK_PRODUCTS = products;
      window.MOCK.MOCK_PRODUCTS = MOCK_PRODUCTS;
      dispatchChange('products');
    }
    if (!sameData(USERS, users)) {
      USERS = users;
      window.MOCK.USERS = USERS;
      dispatchChange('users');
    }
    if (!sameData(AUDIT_LOG, audit)) {
      AUDIT_LOG = audit;
      window.MOCK.AUDIT_LOG = AUDIT_LOG;
      dispatchChange('audit');
    }
    if (!sameData(MOCK_NOTIFICATIONS, notifications)) {
      MOCK_NOTIFICATIONS = notifications;
      window.MOCK.MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS;
      dispatchChange('notifications');
    }
    if (!sameData(MONTHLY_DATA, monthly)) {
      MONTHLY_DATA = monthly;
      window.MOCK.MONTHLY_DATA = MONTHLY_DATA;
      dispatchChange('monthly');
    }
  } finally {
    AUTO_SYNC_IN_FLIGHT = false;
  }
}

function startAutoSync(intervalMs = 5000) {
  if (AUTO_SYNC_RUNNING) return;
  AUTO_SYNC_RUNNING = true;
  const syncNow = () => syncFromAPI().catch(() => {});
  syncNow();
  AUTO_SYNC_TIMER = setInterval(syncNow, intervalMs);
  const onVisibility = () => {
    if (document.visibilityState === 'visible') syncNow();
  };
  document.addEventListener('visibilitychange', onVisibility);
  window.__vencidosAutoSyncVisibilityHandler = onVisibility;
}

function stopAutoSync() {
  AUTO_SYNC_RUNNING = false;
  if (AUTO_SYNC_TIMER) {
    clearInterval(AUTO_SYNC_TIMER);
    AUTO_SYNC_TIMER = null;
  }
  if (window.__vencidosAutoSyncVisibilityHandler) {
    document.removeEventListener('visibilitychange', window.__vencidosAutoSyncVisibilityHandler);
    delete window.__vencidosAutoSyncVisibilityHandler;
  }
}

// ── Init: load all data from API ──────────────────
async function initFromAPI() {
  const [products, users, audit, notifications, monthly] = await Promise.all([
    apiFetch('/products'),
    apiFetch('/users'),
    apiFetch('/audit'),
    apiFetch('/notifications'),
    apiFetch('/monthly'),
  ]);
  MOCK_PRODUCTS      = products;
  USERS              = users;
  AUDIT_LOG          = audit;
  MOCK_NOTIFICATIONS = notifications;
  MONTHLY_DATA       = monthly;
  window.MOCK.MOCK_PRODUCTS      = MOCK_PRODUCTS;
  window.MOCK.USERS              = USERS;
  window.MOCK.AUDIT_LOG          = AUDIT_LOG;
  window.MOCK.MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS;
  window.MOCK.MONTHLY_DATA       = MONTHLY_DATA;
  dispatchChange('all');
}

// ── Auth ──────────────────────────────────────────
async function login(username, password) {
  const user = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  return user;
}

// ── Products ──────────────────────────────────────
async function addProduct(prod) {
  const created = await apiFetch('/products', {
    method: 'POST',
    body: JSON.stringify(prod),
  });
  MOCK_PRODUCTS = [created, ...MOCK_PRODUCTS];
  window.MOCK.MOCK_PRODUCTS = MOCK_PRODUCTS;
  dispatchChange('products');
  try {
    await refreshNotifications();
  } catch (e) {
    console.warn('Notification refresh error:', e);
  }
  return created;
}

async function updateProduct(id, changes) {
  const updated = await apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(changes),
  });
  MOCK_PRODUCTS = MOCK_PRODUCTS.map(p => p.id === id ? updated : p);
  window.MOCK.MOCK_PRODUCTS = MOCK_PRODUCTS;
  dispatchChange('products');
  return updated;
}

async function deleteProduct(id) {
  await apiFetch(`/products/${id}`, { method: 'DELETE' });
  MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== id);
  window.MOCK.MOCK_PRODUCTS = MOCK_PRODUCTS;
  dispatchChange('products');
}

// kept for backwards-compat (consolidado/data-table read from cache)
function saveProducts(arr) {
  MOCK_PRODUCTS = arr;
  window.MOCK.MOCK_PRODUCTS = arr;
  dispatchChange('products');
}

// ── Users ─────────────────────────────────────────
async function addUser(userData) {
  const created = await apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  USERS = [...USERS, created];
  window.MOCK.USERS = USERS;
  dispatchChange('users');
  return created;
}

async function updateUser(id, changes) {
  const updated = await apiFetch(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(changes),
  });
  USERS = USERS.map(u => u.id === id ? updated : u);
  window.MOCK.USERS = USERS;
  dispatchChange('users');
  return updated;
}

async function deleteUser(id) {
  await apiFetch(`/users/${id}`, { method: 'DELETE' });
  USERS = USERS.filter(u => u.id !== id);
  window.MOCK.USERS = USERS;
  dispatchChange('users');
}

function saveUsers(arr) {
  USERS = arr;
  window.MOCK.USERS = arr;
  dispatchChange('users');
}

// ── Audit ─────────────────────────────────────────
function addAuditEntry(action, detail, userName, userRole, avatar) {
  const now = new Date();
  const newEntry = {
    id: Date.now(),
    user: userName,
    role: userRole,
    avatar: avatar || userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
    action,
    detail,
    timestamp: now.toISOString(),
    date: now.toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: now.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }),
  };
  AUDIT_LOG = [newEntry, ...AUDIT_LOG];
  window.MOCK.AUDIT_LOG = AUDIT_LOG;
  dispatchChange('audit');
  // persist async, fire-and-forget
  apiFetch('/audit', {
    method: 'POST',
    body: JSON.stringify({ action, detail, userName, userRole, avatar: newEntry.avatar }),
  }).catch(e => console.warn('Audit persist error:', e));
}

// ── Expose globally ───────────────────────────────
window.MOCK = {
  // Reference data
  SUCURSALES, PROVEEDORES, CATEGORIAS,
  ABC_VALUES, ETIQUETAS, COBERTURA_RANGES, ORIGENES,
  ESTADOS, ESTADOS_DANADO, ACCIONES_VENCIDOS, ACCIONES_DANADOS,
  PRODUCT_NAMES,
  // Mutable cache (populated by initFromAPI)
  MOCK_PRODUCTS, USERS, AUDIT_LOG, MOCK_NOTIFICATIONS, MONTHLY_DATA,
  // Pure functions
  calcAccionVencido, calcAccionDanado, calcDiasRestantes,
  calcEstadoVencimiento, calcEstadoSOS, calcCobertura,
  // API functions
  initFromAPI, login,
  addProduct, updateProduct, deleteProduct, saveProducts,
  addUser, updateUser, deleteUser, saveUsers,
  addAuditEntry,
  syncFromAPI, startAutoSync, stopAutoSync,
};
