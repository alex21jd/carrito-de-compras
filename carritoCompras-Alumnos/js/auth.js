// Autenticación + UI asociada a login/register/logout y vista admin
import { apiLogin, apiRegister, apiCreateProduct, apiUpdateProduct, apiDeleteProduct, apiGetProduct } from './api.js';
import { productos, setProductos, usuarioActual, setUsuarioActual, vistaActual, setVistaActual } from './state.js';
import { mostrarModal, cerrarModal, mostrarLoadingEnModal, ocultarLoadingEnModal } from './ui/modal.js';
import { mostrarMensaje } from './ui/toast.js';

/** Actualiza el botón de login y el toggle de admin según el estado actual */
export function actualizarEstadoLogin() {
  const loginBtn = document.querySelector('.login-btn');
  const adminToggleBtn = document.getElementById('admin-toggle');
  if (!loginBtn || !adminToggleBtn) return;

  const nuevoBtn = loginBtn.cloneNode(true);
  loginBtn.parentNode.replaceChild(nuevoBtn, loginBtn);

  const icon = nuevoBtn.querySelector('.login-icon');
  const text = nuevoBtn.querySelector('.login-text');

  if (usuarioActual) {
    if (icon) icon.textContent = '👤';
    if (text) text.textContent = usuarioActual.email || 'Mi cuenta';
    nuevoBtn.addEventListener('click', mostrarConfirmacionLogout);
    // Muestra el toggle de admin
    adminToggleBtn.style.display = 'flex';
    adminToggleBtn.onclick = () => cambiarVista(vistaActual === 'customer' ? 'admin' : 'customer');
  } else {
    if (icon) icon.textContent = '🔐';
    if (text) text.textContent = 'Iniciar Sesión';
    nuevoBtn.addEventListener('click', mostrarModalLogin);
    adminToggleBtn.style.display = 'none';
    if (vistaActual === 'admin') cambiarVista('customer');
  }
}

/** Cambia entre vista de cliente y admin */
export function cambiarVista(vista) {
  const customerView = document.getElementById('customer-view');
  const adminView = document.getElementById('admin-view');
  const adminIcon = document.querySelector('#admin-toggle .admin-icon');
  const adminText = document.querySelector('#admin-toggle .admin-text');

  setVistaActual(vista);
  if (vista === 'admin') {
    if (customerView) customerView.style.display = 'none';
    if (adminView) adminView.style.display = 'block';
    if (adminIcon) adminIcon.textContent = '🛍️';
    if (adminText) adminText.textContent = 'Ver Tienda';
    mostrarProductosAdmin();
  } else {
    if (customerView) customerView.style.display = 'block';
    if (adminView) adminView.style.display = 'none';
    if (adminIcon) adminIcon.textContent = '🛠️';
    if (adminText) adminText.textContent = 'Administrar';
  }
}

/** Renderiza tarjetas de productos en la vista admin */
export function mostrarProductosAdmin() {
  const container = document.getElementById('admin-products-container');
  if (!container) return;
  container.innerHTML = '';
  productos.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'admin-product-card';
    card.innerHTML = `
      <div class="admin-product-header">
        <div class="admin-product-icon">${p.imagen || '🧩'}</div>
        <div class="admin-product-info"><h3>${p.nombre}</h3><p>${p.descripcion}</p></div>
      </div>
      <div class="admin-product-details">
        <div class="admin-detail-item"><div class="admin-detail-label">Precio</div><div class="admin-detail-value">$${Number(p.precio).toFixed(2)}</div></div>
        <div class="admin-detail-item"><div class="admin-detail-label">Stock</div><div class="admin-detail-value">${p.stock || 0}</div></div>
      </div>
      <div class="admin-product-actions">
        <button class="btn-secondary" onclick="editarProducto(${p.id})">✏️ Editar</button>
        <button class="btn-danger" onclick="confirmarEliminarProducto(${p.id})">🗑️ Eliminar</button>
      </div>`;
    container.appendChild(card);
  });
}

/** Abre modal de Login y realiza autenticación */
export function mostrarModalLogin() {
  mostrarModal({
    icono: '🔐',
    titulo: 'Iniciar Sesión',
    mensaje: `
      <form id="login-form" style="display:flex;flex-direction:column;gap:10px;">
        <input type="email" placeholder="Correo electrónico" required style="padding:8px;border-radius:4px;border:1px solid #ccc;">
        <input type="password" placeholder="Contraseña" required style="padding:8px;border-radius:4px;border:1px solid #ccc;">
      </form>
      <p style="text-align:center;margin-top:15px;">¿No tienes cuenta?
        <a href="#" onclick="cerrarModal(document.querySelector('.modal-overlay')); setTimeout(() => mostrarModalRegister(), 100);" style="color:#007bff;text-decoration:none;font-weight:bold;">Regístrate aquí</a>
      </p>`,
    textoConfirmar: 'Iniciar sesión',
    textoCancel: 'Cancelar',
    onConfirmar: async () => {
      const form = document.getElementById('login-form');
      const email = form.elements[0].value.trim();
      const password = form.elements[1].value;
      if (!email || !password) { mostrarMensaje('Por favor completa todos los campos', 'error'); return false; }
      try {
        mostrarLoadingEnModal('Iniciando sesión...');
        const data = await apiLogin({ email, password });
        const nuevoUsuario = { email, ...data };
        setUsuarioActual(nuevoUsuario);
        try { localStorage.setItem('usuario', JSON.stringify(nuevoUsuario)); } catch {}
        mostrarMensaje('Inicio de sesión exitoso', 'success');
        actualizarEstadoLogin();
        cerrarModal(document.querySelector('.modal-overlay'));
      } catch (e) {
        ocultarLoadingEnModal('Iniciar sesión');
        mostrarMensaje(`Error: ${e.message}`, 'error');
        return false;
      }
      return false; // evita cierre automático, lo hacemos manual arriba
    }
  });
}

/** Abre modal de Registro y realiza alta */
export function mostrarModalRegister() {
  mostrarModal({
    icono: '🆕',
    titulo: 'Crear Cuenta',
    mensaje: `
      <form id="register-form" style="display:flex;flex-direction:column;gap:10px;">
        <input type="email" placeholder="Correo electrónico" required style="padding:8px;border-radius:4px;border:1px solid #ccc;">
        <input type="password" placeholder="Contraseña" required style="padding:8px;border-radius:4px;border:1px solid #ccc;" minlength="6">
        <input type="password" placeholder="Confirmar contraseña" required style="padding:8px;border-radius:4px;border:1px solid #ccc;" minlength="6">
      </form>
      <p style="text-align:center;margin-top:15px;">¿Ya tienes cuenta?
        <a href="#" onclick="cerrarModal(document.querySelector('.modal-overlay')); setTimeout(() => mostrarModalLogin(), 100);" style="color:#007bff;text-decoration:none;font-weight:bold;">Inicia sesión aquí</a>
      </p>`,
    textoConfirmar: 'Crear cuenta',
    textoCancel: 'Cancelar',
    onConfirmar: async () => {
      const form = document.getElementById('register-form');
      const email = form.elements[0].value.trim();
      const password = form.elements[1].value;
      const confirmPassword = form.elements[2].value;
      if (!email || !password || !confirmPassword) { mostrarMensaje('Por favor completa todos los campos', 'error'); return false; }
      if (password !== confirmPassword) { mostrarMensaje('Las contraseñas no coinciden', 'error'); return false; }
      if (password.length < 6) { mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error'); return false; }
      try {
        mostrarLoadingEnModal('Creando cuenta...');
        await apiRegister({ email, password });
        mostrarMensaje('Registro exitoso. Puedes iniciar sesión ahora.', 'success');
        cerrarModal(document.querySelector('.modal-overlay'));
        setTimeout(() => mostrarModalLogin(), 400);
      } catch (e) {
        ocultarLoadingEnModal('Crear cuenta');
        mostrarMensaje(`Error: ${e.message}`, 'error');
        return false;
      }
      return false;
    }
  });
}

/** Muestra confirmación de logout y borra usuario si se confirma */
export function mostrarConfirmacionLogout() {
  mostrarModal({
    icono: '🚪',
    titulo: '¿Cerrar sesión?',
    mensaje: `¿Estás seguro que quieres cerrar tu sesión?`,
    textoConfirmar: 'Sí, cerrar sesión',
    textoCancel: 'Cancelar',
    onConfirmar: () => cerrarSesion()
  });
}

/** Limpia usuario y actualiza UI */
export function cerrarSesion() {
  setUsuarioActual(null);
  try { localStorage.removeItem('usuario'); } catch {}
  actualizarEstadoLogin();
  mostrarMensaje('Sesión cerrada correctamente', 'info');
}

// ===== Admin: crear/editar/eliminar productos =====

/** Abre modal para crear/editar producto */
export function mostrarModalProducto(productoId = null) {
  const esEdicion = productoId !== null;
  const titulo = esEdicion ? 'Editar Producto' : 'Nuevo Producto';
  const textoBoton = esEdicion ? 'Actualizar Producto' : 'Crear Producto';

  let ini = { nombre: '', descripcion: '', precio: '', stock: '' };
  if (esEdicion) {
    const p = productos.find((x) => x.id === productoId);
    if (p) ini = { nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, stock: p.stock || 0 };
  }

  mostrarModal({
    icono: esEdicion ? '✏️' : '🆕',
    titulo,
    mensaje: `
      <form id="product-form" class="product-form">
        <div class="form-group"><label>Nombre</label><input type="text" id="product-name" value="${ini.nombre}" required></div>
        <div class="form-group"><label>Descripción</label><textarea id="product-description" required>${ini.descripcion}</textarea></div>
        <div class="form-group"><label>Precio</label><input type="number" id="product-price" step="0.01" min="0" value="${ini.precio}" required></div>
        <div class="form-group"><label>Stock</label><input type="number" id="product-stock" min="0" value="${ini.stock}" required></div>
      </form>`,
    textoConfirmar: textoBoton,
    textoCancel: 'Cancelar',
    onConfirmar: async () => {
      const form = document.getElementById('product-form');
      const nombre = form.querySelector('#product-name').value.trim();
      const descripcion = form.querySelector('#product-description').value.trim();
      const precio = parseFloat(form.querySelector('#product-price').value);
      const stock = parseInt(form.querySelector('#product-stock').value, 10);
      if (!nombre || !descripcion || isNaN(precio) || isNaN(stock)) { mostrarMensaje('Completa todos los campos correctamente', 'error'); return false; }
      if (precio <= 0) { mostrarMensaje('El precio debe ser mayor a 0', 'error'); return false; }
      if (stock < 0) { mostrarMensaje('El stock no puede ser negativo', 'error'); return false; }

      const body = { name: nombre, description: descripcion, price: String(precio), stock };
      try {
        const token = (usuarioActual && usuarioActual.token) || '';
        //--------------Función de creación/edición ------------------------
        if (esEdicion) {
          await apiUpdateProduct(productoId, body, token);
          const p = await apiGetProduct(productoId, token);
          const idx = productos.findIndex((x) => x.id === productoId);
          if (idx >= 0) productos[idx] = p;
        } else {
          const nuevo = await apiCreateProduct(body, token);
          productos.push(nuevo);
        }
        mostrarMensaje('Producto guardado', 'success');
        mostrarProductosAdmin();
      } catch (e) {
        mostrarMensaje(`Error al guardar: ${e.message}`, 'error');
        return false;
      }
      return false;
    }
  });
}

/** Abre modal de edición */
export function editarProducto(id) { mostrarModalProducto(id); }

/** Confirma y elimina producto */
export function confirmarEliminarProducto(id) {
  const p = productos.find((x) => x.id === id);
  if (!p) return;
  mostrarModal({
    icono: '🗑️',
    titulo: '¿Eliminar producto?',
    mensaje: `¿Estás seguro que quieres eliminar "${p.nombre}"? Esta acción no se puede deshacer.`,
    textoConfirmar: 'Sí, eliminar',
    textoCancel: 'Cancelar',
    onConfirmar: async () => {
      try {
        const token = (usuarioActual && usuarioActual.token) || '';
        //--------------Función de eliminación ------------------------
        await apiDeleteProduct(id, token);
        const i = productos.findIndex((x) => x.id === id);
        if (i >= 0) productos.splice(i, 1);
        mostrarMensaje('Producto eliminado', 'success');
        mostrarProductosAdmin();
      } catch (e) {
        mostrarMensaje(`Error al eliminar: ${e.message}`, 'error');
      }
    }
  });
}

// Exposición a window para los onclick inline existentes
// eslint-disable-next-line no-undef
window.mostrarModalLogin = mostrarModalLogin;
// eslint-disable-next-line no-undef
window.mostrarModalRegister = mostrarModalRegister;
// eslint-disable-next-line no-undef
window.cerrarModal = cerrarModal;
// eslint-disable-next-line no-undef
window.editarProducto = editarProducto;
// eslint-disable-next-line no-undef
window.confirmarEliminarProducto = confirmarEliminarProducto;
