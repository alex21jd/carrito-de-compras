// Estado global y utilidades de almacenamiento
// - Mantiene productos, carrito, usuario y vista actual
// - Expone helpers para leer/escribir estado de forma centralizada

/** @type {Array<any>} Lista de productos disponibles */
export let productos = [];

/** @type {Array<any>} Carrito de compras (items con {id, nombre, precio, cantidad, ...}) */
export let carrito = [];

/** @type {{email?: string, token?: string, user?: any} | null} Usuario autenticado */
export let usuarioActual = null;

/** @type {'customer'|'admin'} Vista actualmente activa */
export let vistaActual = 'customer';

// Setters para permitir actualización controlada desde otros módulos
export function setProductos(list) { productos = Array.isArray(list) ? list : []; }
export function setCarrito(list) { carrito = Array.isArray(list) ? list : []; }
export function setUsuarioActual(u) { usuarioActual = u || null; }
export function setVistaActual(v) { vistaActual = v === 'admin' ? 'admin' : 'customer'; }

// Persistencia básica de usuario en localStorage
export function cargarUsuarioDesdeStorage() {
  try {
    const raw = localStorage.getItem('usuario');
    if (raw) {
      usuarioActual = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error cargando usuario desde localStorage:', e);
    localStorage.removeItem('usuario');
    usuarioActual = null;
  }
}

export function guardarUsuarioEnStorage() {
  try {
    if (usuarioActual) {
      localStorage.setItem('usuario', JSON.stringify(usuarioActual));
    } else {
      localStorage.removeItem('usuario');
    }
  } catch (e) {
    console.error('Error guardando usuario en localStorage:', e);
  }
}

