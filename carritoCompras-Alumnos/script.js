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
    console.log('Inicializando aplicación...'); // Debug
    
    try {
        await cargarProductos();
        console.log('Productos cargados, llamando a mostrarProductos...'); // Debug
        mostrarProductos();
        actualizarCarrito();
        
        // Cargar usuario desde localStorage si existe
        cargarUsuarioDesdeStorage();
        
        // Solo configurar el event listener inicial si no hay usuario logueado
        // actualizarEstadoLogin() ya configurará el listener apropiado
        if (!usuarioActual) {
            const loginBtn = document.querySelector('.login-btn');
            loginBtn.addEventListener('click', mostrarModalLogin);
        }
        
        // Event listener para botón de nuevo producto
        const newProductBtn = document.getElementById('new-product-btn');
        newProductBtn.addEventListener('click', () => mostrarModalProducto());

        console.log('Aplicación inicializada correctamente');
        
    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }

    // TODO: Agregar event listeners para los botones
    // PISTA: checkoutBtn necesita un evento 'click' que llame a una función para procesar el pago
    // PISTA: clearCartBtn necesita un evento 'click' que llame a mostrarModalVaciarCarrito()

    // PISTA: loginBtn necesita un evento 'click' que llame a mostrarModalLogin()
    // NOTA: Las funciones de modales ya están implementadas al final del archivo
});

// Función para cargar productos desde API
async function cargarProductos() {
    console.log('Cargando productos desde:', PRODUCTS_URL);
    
    try {
        const response = await fetch(PRODUCTS_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const productosAPI = await response.json();
        console.log('Datos recibidos de la API:', productosAPI);
        
        // La API devuelve un objeto con una propiedad "products" que contiene el array
        const arrayProductos = productosAPI.products || productosAPI;
        console.log('Array de productos extraído:', arrayProductos);
        
        // Verificar que arrayProductos es un array
        if (!Array.isArray(arrayProductos)) {
            console.error('Los datos no son un array:', arrayProductos);
            throw new Error('Los datos de productos no están en el formato esperado');
        }
        
        // Transformar productos - el precio ya viene como número
        productos = arrayProductos.map(producto => ({
            id: producto.id,
            nombre: producto.name,
            precio: Number(producto.price), // Asegurar que es número
            descripcion: producto.description,
            stock: producto.stock || 0,
            imagen: obtenerIconoAleatorio()
        }));
        
        console.log('Productos transformados:', productos);
        
    } catch (error) {
        console.error('Error cargando productos:', error);
        // Productos de respaldo
        productos = [
            {
                id: 999,
                nombre: "Error de conexión",
                precio: 0,
                descripcion: `No se pudieron cargar los productos: ${error.message}`,
                imagen: "⚠️",
                stock: 0
            }
        ];
    }
}

// Función para obtener un icono aleatorio
function obtenerIconoAleatorio() {
    return ICONOS_PRODUCTOS[Math.floor(Math.random() * ICONOS_PRODUCTOS.length)];
}

// Función para mostrar los productos en la página
function mostrarProductos() {
    console.log('=== MOSTRANDO PRODUCTOS ===');
    console.log('Array productos:', productos);
    console.log('Container elemento:', productosContainer);
    
    if (!productosContainer) {
        console.error('¡El container de productos no existe!');
        return;
    }
    
    productosContainer.innerHTML = '';

    if (!productos || productos.length === 0) {
        console.log('No hay productos para mostrar');
        productosContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666; grid-column: 1 / -1;">
                <h3>🔍 No hay productos disponibles</h3>
                <p>No se pudieron cargar los productos desde el servidor.</p>
            </div>
        `;
        return;
    }

    console.log(`Renderizando ${productos.length} productos`);
    
    productos.forEach((producto, index) => {
        console.log(`Renderizando producto ${index}:`, producto);
        
        const productoCard = document.createElement('div');
        productoCard.className = 'product-card';

        productoCard.innerHTML = `
            <div class="product-image">${producto.imagen}</div>
            <div class="product-info">
                <h3 class="product-name">${producto.nombre}</h3>
                <p class="product-description">${producto.descripcion}</p>
                <div class="product-price">$${producto.precio.toLocaleString('es-CO')}</div>
                <button class="add-to-cart-btn" onclick="agregarAlCarrito(${producto.id})">
                    Agregar al Carrito
                </button>
            </div>
        `;

        productosContainer.appendChild(productoCard);
        console.log(`Producto ${index} agregado al DOM`);
    });
    
    console.log('=== FIN RENDERIZADO ===');
}

// TODO: Función para agregar un producto al carrito
function agregarAlCarrito(productoId) {
    // PISTA: Necesitas buscar el producto en el array 'productos' usando el productoId
    const producto = productos.find(p => p.id === productoId);
    // PISTA: Verifica si el producto ya existe en el carrito
    const itemExiste = carrito.find(item => item.id === productoId);
    // PISTA: Si existe, incrementa la cantidad; si no existe, agrégalo con cantidad 1
    if (itemExiste) {
        itemExiste.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    // PISTA: No olvides llamar actualizarCarrito() al final
    // PISTA: Puedes usar mostrarMensaje() para notificar al usuario
    actualizarCarrito();
    mostrarMensaje(`Se agregó "${producto.nombre}" al carrito`);
}

// Función para actualizar la visualización del carrito
function actualizarCarrito() {
    // TODO: Actualizar contador del carrito en el header
    // PISTA: Calcula el total de items sumando todas las cantidades
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    cartCount.textContent = totalItems;

    // TODO: Actualizar el total del precio
    actualizarTotal();

    // Limpiar contenido anterior
    cartItems.innerHTML = '';

    if (carrito.length === 0) {
        // TODO: Implementar lógica para carrito vacío
        cartContainer.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    cartContainer.style.display = 'block';
    emptyCart.style.display = 'none';

    // TODO: Mostrar items del carrito
    // PISTA: Recorre el array carrito con forEach
    // PISTA: Para cada item, crea un div con clase 'cart-item'
    // PISTA: Incluye botones para cambiar cantidad y eliminar
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
    // PISTA: Busca el item en el carrito usando find()
    const item = carrito.find(i => i.id === productoId);

    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            eliminarDelCarrito(productoId);
        }
        else {
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
    // PISTA: Usa filter() para crear un nuevo array sin el producto a eliminar
    const producto = carrito.find(i => i.id === productoId);
    // PISTA: Actualiza el array carrito con el resultado del filter
    carrito = carrito.filter(i => i.id !== productoId);
    mostrarMensaje(`Se eliminó "${producto.nombre}" del carrito`);
    actualizarCarrito();
    // PISTA: Llama a actualizarCarrito()
}

// Función para actualizar el total del carrito
function actualizarTotal() {
    // TODO: Calcular el total sumando precio * cantidad de cada item
    // PISTA: Usa reduce() para sumar todos los subtotales
    // PISTA: Actualiza el textContent de totalAmount con el resultado
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
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
        if (onConfirmar) {
            const resultado = onConfirmar();
            // Solo cerrar el modal si onConfirmar no retorna false
            if (resultado !== false) {
                cerrarModal(overlay);
            }
        } else {
            cerrarModal(overlay);
        }
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

// Función para mostrar modal de login
function mostrarModalLogin() {
    mostrarModal({
        icono: '👤',
        titulo: 'Iniciar Sesión',
        mensaje: `
        <form id="login-form" style="display: flex; flex-direction: column; gap: 10px;">
            <input type="email" placeholder="Correo electrónico" required style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
            <input type="password" placeholder="Contraseña" required style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
        </form>
        <p style="text-align: center; margin-top: 15px;">
            ¿No tienes cuenta? 
            <a href="#" onclick="cerrarModal(document.querySelector('.modal-overlay')); setTimeout(() => mostrarModalRegister(), 100);" 
            style="color: #007bff; text-decoration: none; font-weight: bold;">Regístrate aquí</a>
        </p>
        `,
        textoConfirmar: 'Iniciar sesión',
        textoCancel: 'Cancelar',
        onConfirmar: () => {
            const form = document.getElementById('login-form')
            const email = form.elements[0].value;
            const password = form.elements[1].value;
            
            if (!email || !password) {
                mostrarMensaje('Por favor completa todos los campos');
                return false; // Evitar que se cierre el modal
            }
            
            loginUsuario({ email, password });
            return false; // Evitar que se cierre el modal automáticamente
        }
    });
}

// Función para mostrar modal de registro
function mostrarModalRegister() {
    mostrarModal({
        icono: '📝',
        titulo: 'Crear Cuenta',
        mensaje: `
        <form id="register-form" style="display: flex; flex-direction: column; gap: 10px;">
            <input type="email" placeholder="Correo electrónico" required style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
            <input type="password" placeholder="Contraseña" required style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;" minlength="6">
            <input type="password" placeholder="Confirmar contraseña" required style="padding: 8px; border-radius: 4px; border: 1px solid #ccc;" minlength="6">
        </form>
        <p style="text-align: center; margin-top: 15px;">
            ¿Ya tienes cuenta? 
            <a href="#" onclick="cerrarModal(document.querySelector('.modal-overlay')); setTimeout(() => mostrarModalLogin(), 100);" 
            style="color: #007bff; text-decoration: none; font-weight: bold;">Inicia sesión aquí</a>
        </p>
        `,
        textoConfirmar: 'Crear cuenta',
        textoCancel: 'Cancelar',
        onConfirmar: () => {
            const form = document.getElementById('register-form');
            const email = form.elements[0].value;
            const password = form.elements[1].value;
            const confirmPassword = form.elements[2].value;
            
            if (!email || !password || !confirmPassword) {
                mostrarMensaje('Por favor completa todos los campos');
                return false; // Evitar que se cierre el modal
            }
            
            if (password !== confirmPassword) {
                mostrarMensaje('Las contraseñas no coinciden');
                return false; // Evitar que se cierre el modal
            }
            
            if (password.length < 6) {
                mostrarMensaje('La contraseña debe tener al menos 6 caracteres');
                return false; // Evitar que se cierre el modal
            }
            
            registerUsuario({ email, password });
            return false; // Evitar que se cierre el modal automáticamente
        }
    });
}

// Función para mostrar loading en modal
function mostrarLoadingEnModal(texto = 'Cargando...') {
    const modal = document.querySelector('.modal');
    if (modal) {
        const confirmBtn = modal.querySelector('.modal-btn-confirm');
        const cancelBtn = modal.querySelector('.modal-btn-cancel');
        
        // Deshabilitar botones
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = `
                <span style="display: inline-flex; align-items: center; gap: 8px;">
                    <div style="width: 16px; height: 16px; border: 2px solid #fff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    ${texto}
                </span>
            `;
        }
        if (cancelBtn) {
            cancelBtn.disabled = true;
            cancelBtn.style.opacity = '0.5';
        }
        
        // Agregar animación de spinner si no existe
        if (!document.querySelector('#loading-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-styles';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Función para ocultar loading en modal
function ocultarLoadingEnModal(textoOriginal) {
    const modal = document.querySelector('.modal');
    if (modal) {
        const confirmBtn = modal.querySelector('.modal-btn-confirm');
        const cancelBtn = modal.querySelector('.modal-btn-cancel');
        
        // Rehabilitar botones
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = textoOriginal;
        }
        if (cancelBtn) {
            cancelBtn.disabled = false;
            cancelBtn.style.opacity = '1';
        }
    }
}

// Variable global para almacenar el usuario actual
let usuarioActual = null;

// URLs de los endpoints
const LOGIN_URL = 'https://xp8qpg8w-3000.brs.devtunnels.ms/auth/login';
const REGISTER_URL = 'https://xp8qpg8w-3000.brs.devtunnels.ms/auth/register';
const PRODUCTS_URL = 'https://xp8qpg8w-3000.brs.devtunnels.ms/products';

// Sistema de iconos aleatorios para productos
const ICONOS_PRODUCTOS = [
    '📱', '💻', '⌚', '📺', '🎧', '📷', '🖥️', '⌨️', '🖱️', '🖨️',
    '📟', '💿', '💾', '💽', '📀', '🔌', '🔋', '💡', '🕯️', '🔦',
    '📚', '📖', '✏️', '✒️', '🖊️', '🖍️', '📝', '📄', '📃', '📑',
    '🍎', '🍌', '🍊', '🍋', '🍉', '🍇', '🥝', '🍓', '🫐', '🍒',
    '👕', '👔', '👗', '👠', '👟', '👒', '🎒', '👜', '💼', '🧳',
    '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸', '🥊', '🎱',
    '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐',
    '🏠', '🏡', '🏢', '🏬', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪'
];

// Variable para controlar la vista actual
let vistaActual = 'customer'; // 'customer' o 'admin'

// Función para login de usuario
async function loginUsuario({ email, password }) {
    // Mostrar loading
    mostrarLoadingEnModal('Iniciando sesión...');
    
    try {
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            // Guardar usuario en localStorage y variable global
            usuarioActual = {
                email: email,
                token: data.token,
                user: data.user,
                ...data // Incluir cualquier dato adicional del servidor
            };
            localStorage.setItem('usuario', JSON.stringify(usuarioActual));
            
            console.log('Usuario logueado:', usuarioActual);
            mostrarMensaje('Inicio de sesión exitoso');
            actualizarEstadoLogin();
            cerrarModal(document.querySelector('.modal-overlay'));
        } else {
            // Ocultar loading antes de mostrar error
            ocultarLoadingEnModal('Iniciar sesión');
            mostrarMensaje(`Error: ${data.error || data.message || 'Error en el login'}`);
        }
    } catch (error) {
        console.error('Error en la solicitud de login:', error);
        // Ocultar loading antes de mostrar error
        ocultarLoadingEnModal('Iniciar sesión');
        mostrarMensaje('Error de conexión. Inténtalo de nuevo.');
    }
}

// Función para registrar usuario
async function registerUsuario({ email, password }) {
    // Mostrar loading
    mostrarLoadingEnModal('Creando cuenta...');
    
    try {
        const response = await fetch(REGISTER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            mostrarMensaje('Registro exitoso. Puedes iniciar sesión ahora.');
            cerrarModal(document.querySelector('.modal-overlay'));
            // Mostrar modal de login después del registro exitoso
            setTimeout(() => mostrarModalLogin(), 500);
        } else {
            // Ocultar loading antes de mostrar error
            ocultarLoadingEnModal('Crear cuenta');
            mostrarMensaje(`Error: ${data.error || data.message || 'Error en el registro'}`);
        }
    } catch (error) {
        console.error('Error en la solicitud de registro:', error);
        // Ocultar loading antes de mostrar error
        ocultarLoadingEnModal('Crear cuenta');
        mostrarMensaje('Error de conexión. Inténtalo de nuevo.');
    }
}

// Función para mostrar confirmación de logout
function mostrarConfirmacionLogout() {
    mostrarModal({
        icono: '👋',
        titulo: '¿Cerrar sesión?',
        mensaje: `¿Estás seguro que quieres cerrar tu sesión?\n\nActualmente estás logueado como: ${usuarioActual.email}`,
        textoConfirmar: 'Sí, cerrar sesión',
        textoCancel: 'Cancelar',
        onConfirmar: () => {
            cerrarSesion();
        }
    });
}

// Función para cerrar sesión
function cerrarSesion() {
    usuarioActual = null;
    localStorage.removeItem('usuario');
    actualizarEstadoLogin();
    mostrarMensaje('Sesión cerrada correctamente');
}

// Función para cambiar entre vistas
function cambiarVista(vista) {
    const customerView = document.getElementById('customer-view');
    const adminView = document.getElementById('admin-view');
    const adminToggleBtn = document.getElementById('admin-toggle');
    const adminIcon = adminToggleBtn.querySelector('.admin-icon');
    const adminText = adminToggleBtn.querySelector('.admin-text');
    
    vistaActual = vista;
    
    if (vista === 'admin') {
        customerView.style.display = 'none';
        adminView.style.display = 'block';
        adminIcon.textContent = '🛒';
        adminText.textContent = 'Ver Tienda';
        mostrarProductosAdmin();
    } else {
        customerView.style.display = 'block';
        adminView.style.display = 'none';
        adminIcon.textContent = '⚙️';
        adminText.textContent = 'Administrar';
    }
}

// Función para mostrar productos en vista de administración
function mostrarProductosAdmin() {
    const container = document.getElementById('admin-products-container');
    container.innerHTML = '';

    productos.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.className = 'admin-product-card';

        productoCard.innerHTML = `
            <div class="admin-product-header">
                <div class="admin-product-icon">${producto.imagen}</div>
                <div class="admin-product-info">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                </div>
            </div>
            <div class="admin-product-details">
                <div class="admin-detail-item">
                    <div class="admin-detail-label">Precio</div>
                    <div class="admin-detail-value">$${producto.precio.toFixed(2)}</div>
                </div>
                <div class="admin-detail-item">
                    <div class="admin-detail-label">Stock</div>
                    <div class="admin-detail-value">${producto.stock || 0}</div>
                </div>
            </div>
            <div class="admin-product-actions">
                <button class="btn-secondary" onclick="editarProducto(${producto.id})">
                    ✏️ Editar
                </button>
                <button class="btn-danger" onclick="confirmarEliminarProducto(${producto.id})">
                    🗑️ Eliminar
                </button>
            </div>
        `;

        container.appendChild(productoCard);
    });
}

// Función para actualizar el estado del login en la UI
function actualizarEstadoLogin() {
    const loginBtn = document.querySelector('.login-btn');
    const loginIcon = loginBtn.querySelector('.login-icon');
    const loginText = loginBtn.querySelector('.login-text');
    const adminToggleBtn = document.getElementById('admin-toggle');
    
    // Remover todos los event listeners previos
    const nuevoBtn = loginBtn.cloneNode(true);
    loginBtn.parentNode.replaceChild(nuevoBtn, loginBtn);
    
    // Obtener las nuevas referencias después del reemplazo
    const newLoginIcon = nuevoBtn.querySelector('.login-icon');
    const newLoginText = nuevoBtn.querySelector('.login-text');
    
    if (usuarioActual) {
        newLoginIcon.textContent = '👋';
        newLoginText.textContent = usuarioActual.email;
        nuevoBtn.addEventListener('click', mostrarConfirmacionLogout);
        
        // Mostrar botón de administración
        adminToggleBtn.style.display = 'flex';
        adminToggleBtn.addEventListener('click', () => {
            cambiarVista(vistaActual === 'customer' ? 'admin' : 'customer');
        });
    } else {
        newLoginIcon.textContent = '👤';
        newLoginText.textContent = 'Iniciar Sesión';
        nuevoBtn.addEventListener('click', mostrarModalLogin);
        
        // Ocultar botón de administración y volver a vista de cliente
        adminToggleBtn.style.display = 'none';
        if (vistaActual === 'admin') {
            cambiarVista('customer');
        }
    }
}

// ===== FUNCIONES DE ADMINISTRACIÓN DE PRODUCTOS =====

// Función para obtener headers con autorización
function obtenerHeadersConAuth() {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (usuarioActual && usuarioActual.token) {
        headers['Authorization'] = `Bearer ${usuarioActual.token}`;
        console.log('Header Authorization agregado:', headers['Authorization']);
    } else {
        console.warn('No hay token disponible para autorización');
    }
    
    return headers;
}

// Función para obtener producto por ID desde API
async function obtenerProductoPorId(id) {
    try {
        console.log('Obteniendo producto con ID:', id);
        const response = await fetch(`${PRODUCTS_URL}/${id}`, {
            headers: obtenerHeadersConAuth()
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const producto = await response.json();
        return {
            id: producto.id,
            nombre: producto.name,
            precio: parseFloat(producto.price),
            descripcion: producto.description,
            stock: producto.stock
        };
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        throw error;
    }
}

// Función para crear nuevo producto
async function crearProducto(datosProducto) {
    mostrarLoadingEnModal('Creando producto...');
    
    try {
        console.log('Creando producto con datos:', datosProducto);
        const response = await fetch(PRODUCTS_URL, {
            method: 'POST',
            headers: obtenerHeadersConAuth(),
            body: JSON.stringify(datosProducto)
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error del servidor:', errorData);
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const nuevoProducto = await response.json();
        console.log('Producto creado:', nuevoProducto);
        
        mostrarMensaje('Producto creado exitosamente');
        cerrarModal(document.querySelector('.modal-overlay'));
        
        // Recargar productos
        await cargarProductos();
        mostrarProductos();
        if (vistaActual === 'admin') {
            mostrarProductosAdmin();
        }
        
    } catch (error) {
        console.error('Error creando producto:', error);
        ocultarLoadingEnModal('Crear Producto');
        mostrarMensaje(`Error al crear el producto: ${error.message}`);
    }
}

// Función para actualizar producto existente
async function actualizarProducto(id, datosProducto) {
    mostrarLoadingEnModal('Actualizando producto...');
    
    try {
        console.log('Actualizando producto con ID:', id, 'y datos:', datosProducto);
        const response = await fetch(`${PRODUCTS_URL}/${id}`, {
            method: 'PUT',
            headers: obtenerHeadersConAuth(),
            body: JSON.stringify(datosProducto)
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error del servidor:', errorData);
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const productoActualizado = await response.json();
        console.log('Producto actualizado:', productoActualizado);
        
        mostrarMensaje('Producto actualizado exitosamente');
        cerrarModal(document.querySelector('.modal-overlay'));
        
        // Recargar productos
        await cargarProductos();
        mostrarProductos();
        if (vistaActual === 'admin') {
            mostrarProductosAdmin();
        }
        
    } catch (error) {
        console.error('Error actualizando producto:', error);
        ocultarLoadingEnModal('Actualizar Producto');
        mostrarMensaje(`Error al actualizar el producto: ${error.message}`);
    }
}

// Función para eliminar producto
async function eliminarProducto(id) {
    try {
        console.log('Eliminando producto con ID:', id);
        const response = await fetch(`${PRODUCTS_URL}/${id}`, {
            method: 'DELETE',
            headers: obtenerHeadersConAuth()
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error del servidor:', errorData);
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        console.log('Producto eliminado exitosamente');
        mostrarMensaje('Producto eliminado exitosamente');
        
        // Recargar productos
        await cargarProductos();
        mostrarProductos();
        if (vistaActual === 'admin') {
            mostrarProductosAdmin();
        }
        
    } catch (error) {
        console.error('Error eliminando producto:', error);
        mostrarMensaje(`Error al eliminar el producto: ${error.message}`);
    }
}

// Función para mostrar modal de producto (crear/editar)
function mostrarModalProducto(productoId = null) {
    const esEdicion = productoId !== null;
    const titulo = esEdicion ? 'Editar Producto' : 'Nuevo Producto';
    const textoBoton = esEdicion ? 'Actualizar Producto' : 'Crear Producto';
    
    // Si es edición, obtener los datos del producto
    let datosIniciales = { nombre: '', descripcion: '', precio: '', stock: '' };
    if (esEdicion) {
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
            datosIniciales = {
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio,
                stock: producto.stock || 0
            };
        }
    }
    
    mostrarModal({
        icono: esEdicion ? '✏️' : '➕',
        titulo: titulo,
        mensaje: `
        <form id="product-form" class="product-form">
            <div class="form-group">
                <label for="product-name">Nombre del Producto</label>
                <input type="text" id="product-name" value="${datosIniciales.nombre}" required>
            </div>
            <div class="form-group">
                <label for="product-description">Descripción</label>
                <textarea id="product-description" required>${datosIniciales.descripcion}</textarea>
            </div>
            <div class="form-group">
                <label for="product-price">Precio</label>
                <input type="number" id="product-price" step="0.01" min="0" value="${datosIniciales.precio}" required>
            </div>
            <div class="form-group">
                <label for="product-stock">Stock</label>
                <input type="number" id="product-stock" min="0" value="${datosIniciales.stock}" required>
            </div>
        </form>
        `,
        textoConfirmar: textoBoton,
        textoCancel: 'Cancelar',
        onConfirmar: () => {
            const form = document.getElementById('product-form');
            const nombre = form.querySelector('#product-name').value.trim();
            const descripcion = form.querySelector('#product-description').value.trim();
            const precio = parseFloat(form.querySelector('#product-price').value);
            const stock = parseInt(form.querySelector('#product-stock').value);
            
            // Validaciones
            if (!nombre || !descripcion || isNaN(precio) || isNaN(stock)) {
                mostrarMensaje('Por favor completa todos los campos correctamente');
                return false;
            }
            
            if (precio <= 0) {
                mostrarMensaje('El precio debe ser mayor a 0');
                return false;
            }
            
            if (stock < 0) {
                mostrarMensaje('El stock no puede ser negativo');
                return false;
            }
            
            const datosProducto = {
                name: nombre,
                description: descripcion,
                price: precio.toString(),
                stock: stock
            };
            
            if (esEdicion) {
                actualizarProducto(productoId, datosProducto);
            } else {
                crearProducto(datosProducto);
            }
            
            return false; // Evitar que se cierre el modal automáticamente
        }
    });
}

// Función para editar producto
function editarProducto(id) {
    mostrarModalProducto(id);
}

// Función para confirmar eliminación de producto
function confirmarEliminarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    mostrarModal({
        icono: '⚠️',
        titulo: '¿Eliminar producto?',
        mensaje: `¿Estás seguro que quieres eliminar el producto "${producto.nombre}"?\n\nEsta acción no se puede deshacer.`,
        textoConfirmar: 'Sí, eliminar',
        textoCancel: 'Cancelar',
        onConfirmar: () => {
            eliminarProducto(id);
        }
    });
}

// Función para cargar usuario desde localStorage
function cargarUsuarioDesdeStorage() {
    try {
        const usuarioGuardado = localStorage.getItem('usuario');
        if (usuarioGuardado) {
            usuarioActual = JSON.parse(usuarioGuardado);
            actualizarEstadoLogin();
        }
    } catch (error) {
        console.error('Error cargando usuario desde localStorage:', error);
        localStorage.removeItem('usuario'); // Limpiar datos corruptos
    }
}
