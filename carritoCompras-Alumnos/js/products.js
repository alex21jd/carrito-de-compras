// Renderizado de productos (vista de cliente)
import { productos } from './state.js';
import { crearImagenProducto } from './ui/images.js';

/**
 * Inserta tarjetas de producto en el contenedor dado.
 * Mantiene el onclick inline para compatibilidad, exponiendo la función en window desde main.
 */
export function renderizarProductos(container) {
  container.innerHTML = '';
  productos.forEach((producto) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image">${crearImagenProducto(producto)}</div>
      <div class="product-info">
        <h3 class="product-name">${producto.nombre}</h3>
        <p class="product-description">${producto.descripcion}</p>
        <div class="product-price">$${Number(producto.precio).toFixed(2)}</div>
        <button class="add-to-cart-btn" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
      </div>`;
    container.appendChild(card);
  });
}

