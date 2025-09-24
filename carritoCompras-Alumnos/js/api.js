// API: funciones para interactuar con el backend (auth y productos)
// - No maneja UI; solo hace fetch y retorna/lanza resultados

export const API_BASE = 'https://xp8qpg8w-3000.brs.devtunnels.ms';
export const LOGIN_URL = `${API_BASE}/auth/login`;
export const REGISTER_URL = `${API_BASE}/auth/register`;
export const PRODUCTS_URL = `${API_BASE}/products`;

// Normaliza un producto aceptando claves en español o inglés
export function normalizarProducto(p) {
  if (!p || typeof p !== 'object') {
    return { id: undefined, nombre: 'Producto', descripcion: '', precio: 0, stock: 0, imagen: undefined };
  }
  if (p.product) p = p.product; // Algunos endpoints devuelven { product: { ... } }
  console.log(p);
  return {
    id: p.id,
    nombre: p.nombre ?? p.name ?? 'Producto',
    descripcion: p.descripcion ?? p.description ?? '',
    precio: Number(p.precio ?? p.price ?? 0),
    stock: p.stock ?? 0,
    imagen: p.icon || p.imagen || undefined
  };
}

/** Realiza login y retorna { token, user, ... } */
export async function apiLogin({ email, password }) {
  const resp = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = data?.error || data?.message || 'Error en el login';
    throw new Error(msg);
  }
  return data;
}

/** Registra un usuario y retorna payload del servidor */
export async function apiRegister({ email, password }) {
  const resp = await fetch(REGISTER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = data?.error || data?.message || 'Error en el registro';
    throw new Error(msg);
  }
  return data;
}

/** Lista productos (endpoint público) y normaliza cada item */
export async function apiListProducts() {
  const resp = await fetch(PRODUCTS_URL);
  if (!resp.ok) throw new Error(`Error HTTP ${resp.status}`);
  const raw = await resp.json().catch(() => []);
  const list = Array.isArray(raw) ? raw : (raw?.data || raw?.products || raw?.items || raw?.results || []);
  if (!Array.isArray(list)) throw new Error('Formato de respuesta inválido');
  return list.map(normalizarProducto);
}

// Helpers de headers con auth
export function authHeaders(token) {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

/** Obtiene un producto por id y lo normaliza */
export async function apiGetProduct(id, token) {
  const resp = await fetch(`${PRODUCTS_URL}/${id}`, { headers: authHeaders(token) });
  if (!resp.ok) throw new Error(`Error HTTP ${resp.status}`);
  const p = await resp.json().catch(() => null);
  return normalizarProducto(p);
}

/** Crea un producto y retorna el objeto normalizado (si el backend lo devuelve) */
export async function apiCreateProduct(body, token) {

}

/** Actualiza un producto y retorna el objeto normalizado (si el backend lo devuelve) */
export async function apiUpdateProduct(id, body, token) {

}

/** Elimina un producto */
export async function apiDeleteProduct(id, token) {

}

