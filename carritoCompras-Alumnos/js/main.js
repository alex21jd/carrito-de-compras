// Punto de entrada: inicializa eventos, carga productos y expone funciones globales necesarias
import { apiListProducts } from './api.js';
import { productos, setProductos, cargarUsuarioDesdeStorage } from './state.js';
import { renderizarProductos } from './products.js';
import { agregarAlCarrito as addToCart, cambiarCantidad, actualizarCantidad, eliminarDelCarrito, actualizarCarrito, vaciarCarrito } from './cart.js';
import { mostrarMensaje } from './ui/toast.js';
import { mostrarModal } from './ui/modal.js';
import { actualizarEstadoLogin, mostrarModalProducto } from './auth.js';

// Exponer funciones necesarias para los onclick inline existentes
// eslint-disable-next-line no-undef
window.agregarAlCarrito = (id) => {
  const p = productos.find((x) => x.id === id);
  if (!p) return mostrarMensaje('Producto no encontrado', 'error');
  addToCart(p, id);
};
// eslint-disable-next-line no-undef
window.cambiarCantidad = cambiarCantidad;
// eslint-disable-next-line no-undef
window.actualizarCantidad = actualizarCantidad;
// eslint-disable-next-line no-undef
window.eliminarDelCarrito = eliminarDelCarrito;

document.addEventListener('DOMContentLoaded', async () => {
  // Cargar usuario (si existe) y actualizar header
  cargarUsuarioDesdeStorage();
  actualizarEstadoLogin();

  // Cargar productos desde API y renderizar
  try {
    const list = await apiListProducts();
    setProductos(list);
  } catch (e) {
    console.error('Error cargando productos:', e);
    setProductos([{ id: 1, nombre: 'Producto de ejemplo', descripcion: 'Error al cargar productos', precio: 99.99, imagen: '🧩' }]);
  }

  const productosContainer = document.getElementById('products-container');
  if (productosContainer) renderizarProductos(productosContainer);
  actualizarCarrito();

  // Botones principales
  const clearCartBtn = document.getElementById('clear-cart');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (!document.querySelector('.modal-overlay')) {
        mostrarModal({
          icono: '🧹', titulo: '¿Vaciar carrito?',
          mensaje: 'Esta acción eliminará todos los productos del carrito. No se puede deshacer.',
          textoConfirmar: 'Sí, vaciar', textoCancel: 'Cancelar', onConfirmar: () => vaciarCarrito()
        });
      }
    });
  }

  const newProductBtn = document.getElementById('new-product-btn');
  if (newProductBtn) {
    newProductBtn.addEventListener('click', () => mostrarModalProducto());
  }
});
