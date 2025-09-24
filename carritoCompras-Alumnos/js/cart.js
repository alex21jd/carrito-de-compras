// Lógica de carrito: agregar, quitar, cambiar cantidades y renderizar
import { carrito, setCarrito } from './state.js';
import { crearImagenCarrito } from './ui/images.js';
import { mostrarMensaje } from './ui/toast.js';

/** Agrega un producto (obj ya existente) al carrito por id */
export function agregarAlCarrito(producto, productoId) {
  const existe = carrito.find((i) => i.id === productoId);
  if (existe) existe.cantidad++;
  else carrito.push({ ...producto, cantidad: 1 });
  actualizarCarrito();
  mostrarMensaje(`Se agregó "${producto.nombre}" al carrito`, 'success');
}

/** Cambia cantidad +-1 para un producto del carrito */
export function cambiarCantidad(productoId, delta) {
  const item = carrito.find((i) => i.id === productoId);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) eliminarDelCarrito(productoId);
  else actualizarCarrito();
}

/** Actualiza cantidad desde input numérico */
export function actualizarCantidad(productoId, nuevaCantidad) {
  const qty = parseInt(nuevaCantidad, 10);
  const item = carrito.find((i) => i.id === productoId);
  if (!item) return;
  if (isNaN(qty) || qty <= 0) return eliminarDelCarrito(productoId);
  item.cantidad = qty;
  actualizarCarrito();
}

/** Elimina un item completamente del carrito */
export function eliminarDelCarrito(productoId) {
  const item = carrito.find((i) => i.id === productoId);
  setCarrito(carrito.filter((i) => i.id !== productoId));
  if (item) mostrarMensaje(`Se eliminó "${item.nombre}" del carrito`);
  actualizarCarrito();
}

/** Recalcula el total y lo muestra */
export function actualizarTotal(totalAmountEl) {
  const total = carrito.reduce((sum, item) => sum + Number(item.precio) * item.cantidad, 0);
  totalAmountEl.textContent = total.toFixed(2);
}

/** Re-renderiza la vista del carrito (lista + totales + contador) */
export function actualizarCarrito() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartContainer = document.getElementById('cart-container');
  const emptyCart = document.getElementById('empty-cart');
  const totalAmount = document.getElementById('total-amount');

  const totalItems = carrito.reduce((sum, i) => sum + i.cantidad, 0);
  cartCount.textContent = String(totalItems);
  actualizarTotal(totalAmount);

  cartItems.innerHTML = '';
  if (carrito.length === 0) {
    cartContainer.style.display = 'none';
    emptyCart.style.display = 'block';
    return;
  }

  cartContainer.style.display = 'block';
  emptyCart.style.display = 'none';

  carrito.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-header">
        <div class="cart-item-image">${crearImagenCarrito(item)}</div>
        <div class="cart-item-info">
          <h4>${item.nombre}</h4>
          <div class="cart-item-price">$${Number(item.precio).toFixed(2)}</div>
        </div>
      </div>
      <div class="quantity-controls">
        <button class="quantity-btn" onclick="cambiarCantidad(${item.id}, -1)">-</button>
        <input type="number" class="quantity-input" value="${item.cantidad}" onchange="actualizarCantidad(${item.id}, this.value)" min="1">
        <button class="quantity-btn" onclick="cambiarCantidad(${item.id}, 1)">+</button>
        <button class="remove-btn" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
      </div>
      <div class="item-total">Total: $${(Number(item.precio) * item.cantidad).toFixed(2)}</div>`;
    cartItems.appendChild(row);
  });
}

/** Vacía por completo el carrito */
export function vaciarCarrito() {
  setCarrito([]);
  actualizarCarrito();
}

