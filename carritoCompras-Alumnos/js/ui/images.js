// UI: helpers para imágenes y fallbacks visuales

/** Genera HTML de imagen del producto o fallback */
export function crearImagenProducto(producto) {
  if (producto.imagen && typeof producto.imagen === 'string' && producto.imagen.startsWith('./public/images/')) {
    const fb = producto.imagenFallback || '🛒';
    return `<img src="${producto.imagen}" alt="${producto.nombre}" onerror="mostrarFallbackProducto(this, '${fb}')">`;
  }
  return `<div class="product-image-fallback">${producto.imagenFallback || producto.imagen || '🛒'}</div>`;
}

/** Genera HTML de imagen del item del carrito o fallback */
export function crearImagenCarrito(item) {
  if (item.imagen && typeof item.imagen === 'string' && item.imagen.startsWith('./public/images/')) {
    const fb = item.imagenFallback || '🛒';
    return `<img src="${item.imagen}" alt="${item.nombre}" onerror="mostrarFallbackCarrito(this, '${fb}')">`;
  }
  return `<div class="cart-item-image-fallback">${item.imagenFallback || item.imagen || '🛒'}</div>`;
}

/** Reemplaza la imagen por un contenedor fallback (producto) */
export function mostrarFallbackProducto(imgElement, fallback) {
  if (imgElement?.parentElement) {
    imgElement.parentElement.innerHTML = `<div class="product-image-fallback">${fallback}</div>`;
  }
}

/** Reemplaza la imagen por un contenedor fallback (carrito) */
export function mostrarFallbackCarrito(imgElement, fallback) {
  if (imgElement?.parentElement) {
    imgElement.parentElement.innerHTML = `<div class="cart-item-image-fallback">${fallback}</div>`;
  }
}

// Expone fallbacks para los onclick inline existentes
// Nota: necesario mientras se use HTML con atributos onclick
// eslint-disable-next-line no-undef
window.mostrarFallbackProducto = mostrarFallbackProducto;
// eslint-disable-next-line no-undef
window.mostrarFallbackCarrito = mostrarFallbackCarrito;

