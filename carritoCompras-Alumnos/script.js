// Array de productos disponibles (se cargará desde JSON)
let productos = [];

// Array del carrito de compras
let carrito = [];

// Referencias a elementos del DOM
const productosContainer = document.getElementById('products-container');
const cartSection = document.getElementById('cart-section');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartContainer = document.getElementById('cart-container');
const emptyCart = document.getElementById('empty-cart');
const totalAmount = document.getElementById('total-amount');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart');
const loginBtn = document.querySelector('.login-btn');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', async function () {
    await cargarProductos();
    mostrarProductos();
    actualizarCarrito();

    // TODO: Agregar event listeners para los botones
    // PISTA: checkoutBtn necesita un evento 'click' que llame a una función para procesar el pago
    // PISTA: clearCartBtn necesita un evento 'click' que llame a mostrarModalVaciarCarrito()
    // PISTA: loginBtn necesita un evento 'click' que llame a mostrarModalLogin()
    // NOTA: Las funciones de modales ya están implementadas al final del archivo
});

// Función para cargar productos desde JSON
async function cargarProductos() {
    try {
        const response = await fetch('./productos.json');
        productos = await response.json();
    } catch (error) {
        console.error('Error cargando productos:', error);
        // Productos de respaldo en caso de error
        productos = [
            {
                id: 1,
                nombre: "Producto de ejemplo",
                precio: 99.99,
                descripcion: "Error cargando productos desde JSON",
                imagen: "📦"
            }
        ];
    }
}

// Función para mostrar los productos en la página
function mostrarProductos() {
    productosContainer.innerHTML = '';

    productos.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.className = 'product-card';

        productoCard.innerHTML = `
            <div class="product-image">${crearImagenProducto(producto)}</div>
            <div class="product-info">
                <h3 class="product-name">${producto.nombre}</h3>
                <p class="product-description">${producto.descripcion}</p>
                <div class="product-price">$${producto.precio.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="agregarAlCarrito(${producto.id})">
                    Agregar al Carrito
                </button>
            </div>
        `;

        productosContainer.appendChild(productoCard);
    });
}

// TODO: Función para agregar un producto al carrito
function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);

    if (producto) {
        const itemEnCarrito = carrito.find(item => item.id === productoId);
        if (itemEnCarrito) {
            itemEnCarrito.cantidad += 1;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
    }

    actualizarCarrito();
    mostrarMensaje('Producto agregado');
}

// Función para actualizar la visualización del carrito
function actualizarCarrito() {
    const contador = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    cartCount.textContent = contador;

    actualizarTotal();
    cartItems.innerHTML = '';

    if (carrito.length === 0) {
        cartContainer.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    cartContainer.style.display = 'block';
    emptyCart.style.display = 'none';

    carrito.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <div class="cart-item-header">
                <div class="cart-item-image">${crearImagenCarrito(item)}</div>
                <div class="cart-item-info">
                    <h4>${item.nombre}</h4>
                    <div class="cart-item-price">$${item.precio.toFixed(2)}</div>
                </div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                <input type="number" class="quantity-input" value="${item.cantidad}"
                    onchange="actualizarCantidad(${item.id}, this.value)" min="1">
                <button class="quantity-btn" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
            </div>
            <div class="item-total">
                Total: $${(item.precio * item.cantidad).toFixed(2)}
            </div>
        `;

        cartItems.appendChild(cartItem);
    });
}

// TODO: Función para cambiar la cantidad de un producto
function cambiarCantidad(productoId, cambio) {
    const item = carrito.find(i => i.id === productoId);

    if (item) {
        item.cantidad += cambio;

        if (item.cantidad <= 0) {
            eliminarDelCarrito(productoId);
        } else {
            actualizarCarrito();
        }
    }
}

// TODO: Función para actualizar cantidad directamente desde el input
function actualizarCantidad(productoId, nuevaCantidad) {
    // PISTA: Convierte nuevaCantidad a entero con parseInt()
    // PISTA: Busca el item y actualiza su cantidad
    // PISTA: Si la cantidad es <= 0, elimina el producto
}

// TODO: Función para eliminar un producto del carrito
function eliminarDelCarrito(productoId) {
    const producto = carrito.find(i => i.id === productoId);
    carrito = carrito.filter(i => i.id !== productoId);
    mostrarMensaje(`Producto "${producto.nombre}" eliminado`);
    actualizarCarrito();
}

// Función para actualizar el total del carrito
function actualizarTotal() {
    conts = total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    totalAmount.textContent = total.toFixed(2);
}

// TODO: Función para proceder al pago (básica)
function procederPago() {
    // PISTA: Verifica que el carrito no esté vacío
    // PISTA: Puedes usar mostrarModal() para mostrar información de la compra
    // PISTA: O usar alert() para una versión más simple
    // PISTA: Pregunta al usuario si confirma la compra
    // PISTA: Si confirma, vacía el carrito y muestra mensaje de éxito
}

// TODO: Función para vaciar todo el carrito
function vaciarCarrito() {
    // PISTA: Asigna un array vacío a la variable carrito
    // PISTA: Llama a actualizarCarrito() para refrescar la vista
}
/* 
 * EJERCICIOS PARA LOS ALUMNOS:
 * 
 * 1. Implementar la función agregarAlCarrito()
 * 2. Completar la función actualizarCarrito()
 * 3. Implementar cambiarCantidad() y actualizarCantidad()
 * 4. Crear la función eliminarDelCarrito()
 * 5. Completar la función actualizarTotal()
 * 6. Implementar procederPago() con confirmación
 * 7. Agregar la función vaciarCarrito()
 * 8. Conectar los event listeners en la inicialización
 * 
 * FUNCIONALIDADES ADICIONALES (OPCIONALES):
 * - Agregar funcionalidad de búsqueda de productos
 * - Implementar persistencia con localStorage
 * - Agregar animaciones y mensajes de confirmación
 * - Validaciones de entrada del usuario
 */

// FUNCIONES AUXILIARES PARA MODALES Y MENSAJES (YA IMPLEMENTADAS)

// Funciones auxiliares para manejo de imágenes

// Función para crear imagen de producto con fallback
function crearImagenProducto(producto) {
    // Si tiene imagen de archivo, intentar cargarla
    if (producto.imagen && producto.imagen.startsWith('./public/images/')) {
        return `<img src="${producto.imagen}" alt="${producto.nombre}" onerror="mostrarFallbackProducto(this, '${producto.imagenFallback || '📦'}')">`;
    }
    // Si no, mostrar el fallback (emoji o imagen original)
    return `<div class="product-image-fallback">${producto.imagenFallback || producto.imagen || '📦'}</div>`;
}

// Función para crear imagen de carrito con fallback
function crearImagenCarrito(item) {
    // Si tiene imagen de archivo, intentar cargarla
    if (item.imagen && item.imagen.startsWith('./public/images/')) {
        return `<img src="${item.imagen}" alt="${item.nombre}" onerror="mostrarFallbackCarrito(this, '${item.imagenFallback || '📦'}')">`;
    }
    // Si no, mostrar el fallback (emoji o imagen original)
    return `<div class="cart-item-image-fallback">${item.imagenFallback || item.imagen || '📦'}</div>`;
}

// Función auxiliar para manejar error de imagen de producto
function mostrarFallbackProducto(imgElement, fallback) {
    imgElement.parentElement.innerHTML = `<div class="product-image-fallback">${fallback}</div>`;
}

// Función auxiliar para manejar error de imagen de carrito
function mostrarFallbackCarrito(imgElement, fallback) {
    imgElement.parentElement.innerHTML = `<div class="cart-item-image-fallback">${fallback}</div>`;
}

// Función para crear y mostrar modal personalizado
function mostrarModal({ icono, titulo, mensaje, textoConfirmar, textoCancel, onConfirmar }) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Preparar botones
    const botones = textoCancel ? 
        `<button class="modal-btn modal-btn-cancel">${textoCancel}</button>
        <button class="modal-btn modal-btn-confirm">${textoConfirmar}</button>` :
        `<button class="modal-btn modal-btn-confirm" style="flex: none; margin: 0 auto;">${textoConfirmar}</button>`;
    
    modal.innerHTML = `
        <div class="modal-header">
            <div class="modal-icon">${icono}</div>
            <h3>${titulo}</h3>
            <p style="white-space: pre-line;">${mensaje}</p>
        </div>
        <div class="modal-actions">
            ${botones}
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Event listeners
    const btnCancel = modal.querySelector('.modal-btn-cancel');
    const btnConfirm = modal.querySelector('.modal-btn-confirm');
    
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            cerrarModal(overlay);
        });
    }
    
    btnConfirm.addEventListener('click', () => {
        if (onConfirmar) onConfirmar();
        cerrarModal(overlay);
    });
    
    // Cerrar al hacer click en el overlay (solo si no es modal de información)
    if (textoCancel) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                cerrarModal(overlay);
            }
        });
    }
    
    // Cerrar con Escape
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            cerrarModal(overlay);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Función para cerrar modal
function cerrarModal(overlay) {
    overlay.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.remove();
        }
    }, 300);
}

// Función para mostrar mensajes temporales
function mostrarMensaje(mensaje) {
    // Crear elemento de mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #27ae60, #2ecc71);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: bold;
        animation: slideIn 0.3s ease;
    `;
    
    // Agregar animación CSS
    if (!document.querySelector('#message-styles')) {
        const style = document.createElement('style');
        style.id = 'message-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(mensajeDiv);
    
    // Eliminar mensaje después de 3 segundos
    setTimeout(() => {
        if (mensajeDiv.parentNode) {
            mensajeDiv.remove();
        }
    }, 3000);
}

// Función para mostrar modal de confirmación para vaciar carrito
function mostrarModalVaciarCarrito() {
    if (carrito.length === 0) {
        mostrarMensaje('El carrito ya está vacío');
        return;
    }
    
    mostrarModal({
        icono: '🗑️',
        titulo: '¿Vaciar carrito?',
        mensaje: 'Esta acción eliminará todos los productos del carrito. No se puede deshacer.',
        textoConfirmar: 'Sí, vaciar',
        textoCancel: 'Cancelar',
        onConfirmar: vaciarCarrito
    });
}

// Función para mostrar modal de login (placeholder)
function mostrarModalLogin() {
    mostrarModal({
        icono: '👤',
        titulo: 'Iniciar Sesión',
        mensaje: 'Funcionalidad de login en desarrollo.\n\nPronto podrás:\n• Guardar tu carrito\n• Ver historial de compras\n• Gestionar tus datos\n• Recibir ofertas exclusivas',
        textoConfirmar: 'Entendido',
        textoCancel: '',
        onConfirmar: null
    });
}