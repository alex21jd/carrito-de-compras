# 🛒 Carrito de Compras - Proyecto de Clase

Un proyecto educativo de carrito de compras que necesita ser completado por los alumnos. El proyecto está parcialmente implementado y requiere que los estudiantes completen las funcionalidades principales.

## 🎯 Objetivos de Aprendizaje

- Manipulación del DOM con JavaScript
- Manejo de arrays y objetos
- Event listeners y manejo de eventos
- Lógica de programación
- Carga de datos desde archivos JSON

## 📋 Estado Actual del Proyecto

### ✅ Ya Implementado
- Carga de productos desde JSON
- Estructura HTML completa
- Estilos CSS
- Función para mostrar productos
- Interfaz básica del carrito
- Sistema de modales y mensajes
- Manejo de imágenes con fallback (emojis/imágenes reales)

### ❌ Por Implementar (TAREAS PARA ALUMNOS)

1. **Función `agregarAlCarrito()`**
   - Buscar producto por ID
   - Verificar si ya existe en el carrito
   - Agregar nuevo producto o incrementar cantidad

2. **Función `actualizarCarrito()`**
   - Actualizar contador en el header
   - Mostrar/ocultar elementos según estado del carrito
   - Generar HTML para items del carrito

3. **Función `cambiarCantidad()`**
   - Modificar cantidad de productos
   - Validar que no sea menor a 1

4. **Función `eliminarDelCarrito()`**
   - Remover productos del carrito
   - Actualizar la vista

5. **Función `actualizarTotal()`**
   - Calcular precio total del carrito
   - Actualizar elemento en pantalla

6. **Función `procederPago()`**
   - Validar carrito no vacío
   - Mostrar confirmación de compra
   - Vaciar carrito tras confirmación

7. **Event Listeners**
   - Conectar botones con sus funciones
   - Configurar eventos en la inicialización

## 📁 Estructura del Proyecto

```
carritoCompras-Alumnos/
├── index.html          # Estructura HTML (✅ Completo)
├── styles.css          # Estilos CSS (✅ Completo)
├── script.js           # JavaScript (❌ Por completar)
├── productos.json      # Datos de productos (✅ Simplificado)
└── README.md           # Esta documentación
```

## � Instrucciones para Empezar

1. Abre el archivo `script.js`
2. Busca los comentarios `TODO:` y `PISTA:`
3. Implementa las funciones siguiendo las pistas
4. Prueba tu código abriendo `index.html` en el navegador

## 💡 Pistas y Consejos

### Para `agregarAlCarrito()`:
```javascript
// Buscar producto: productos.find(p => p.id === productoId)
// Buscar en carrito: carrito.find(item => item.id === productoId)
// Agregar al carrito: carrito.push({...producto, cantidad: 1})
```

### Para `actualizarTotal()`:
```javascript
// Usar reduce para sumar: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
```

### Para mostrar/ocultar elementos:
```javascript
// Mostrar: elemento.style.display = 'block'
// Ocultar: elemento.style.display = 'none'
```

## 🎨 Datos de Productos

Los productos están en `productos.json` con la estructura:
```json
{
    "id": 1,
    "nombre": "Laptop",
    "precio": 500.00,
    "descripcion": "Laptop básica para uso diario",
    "imagen": "💻"
}
```

### 📸 Sistema de Imágenes
- **Emojis**: Por defecto se usan emojis como `"imagen": "💻"`
- **Imágenes reales**: Si usas rutas como `"imagen": "./public/images/laptop.jpg"`
- **Fallback automático**: Si una imagen falla, se muestra el emoji de respaldo
- **Funciones incluidas**: `crearImagenProducto()` y `crearImagenCarrito()`

## 🏆 Funcionalidades Extra (Opcionales)

Una vez completadas las funciones básicas, puedes implementar:
- Búsqueda de productos
- Persistencia con localStorage
- Validaciones adicionales
- Animaciones y efectos
- Filtros por precio

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura de la página
- **CSS3**: Estilos y diseño responsive
- **JavaScript**: Lógica de la aplicación
- **JSON**: Almacenamiento de datos

---

**¡Buena suerte completando el proyecto! 🚀**
    nombre: "Nombre del producto",
    precio: 99.99,
    descripcion: "Descripción del producto",
    imagen: "🛍️"  // Emoji como imagen
}
```

### Array del Carrito
El carrito mantiene los productos seleccionados:
```javascript
{
    id: 1,
    nombre: "Nombre del producto",
    precio: 99.99,
    descripcion: "Descripción del producto",
    imagen: "🛍️",
    cantidad: 2  // Cantidad seleccionada
}
```

## 🎯 Funcionalidades Principales

### 1. Gestión de Productos
- `mostrarProductos()`: Renderiza la lista de productos
- `agregarAlCarrito(id)`: Agrega un producto al carrito

### 2. Gestión del Carrito
- `actualizarCarrito()`: Actualiza la visualización del carrito
- `cambiarCantidad(id, cambio)`: Modifica la cantidad de un producto
- `actualizarCantidad(id, cantidad)`: Actualiza cantidad desde input
- `eliminarDelCarrito(id)`: Elimina un producto del carrito
- `vaciarCarrito()`: Vacía todo el carrito

### 3. Cálculos y Totales
- `actualizarTotal()`: Calcula el total del carrito
- `obtenerInfoCarrito()`: Obtiene información completa del carrito

### 4. Interfaz de Usuario
- `toggleCarrito()`: Muestra/oculta el carrito
- `mostrarMensaje(mensaje)`: Muestra notificaciones temporales
- `procederPago()`: Simula el proceso de checkout

## 🎨 Características de Diseño

### Responsive Design
- Adaptable a dispositivos móviles
- Grid layout para productos
- Interfaz optimizada para touch

### Elementos Visuales
- Tarjetas de productos con hover effects
- Botones interactivos con transiciones
- Esquema de colores moderno
- Iconografía con emojis

## 🚀 Cómo Usar

1. **Abrir el archivo**: Simplemente abre `index.html` en tu navegador
2. **Explorar productos**: Navega por la lista de productos disponibles
3. **Agregar al carrito**: Haz clic en "Agregar al Carrito" en cualquier producto
4. **Ver carrito**: Haz clic en el botón del carrito en el header
5. **Gestionar cantidades**: Usa los botones +/- o edita directamente
6. **Proceder al pago**: Haz clic en "Proceder al Pago" para simular la compra

## 🔧 Personalización

### Agregar Nuevos Productos
Edita el array `productos` en `script.js`:
```javascript
productos.push({
    id: 7,
    nombre: "Nuevo Producto",
    precio: 149.99,
    descripcion: "Descripción del nuevo producto",
    imagen: "🆕"
});
```

### Modificar Estilos
Edita `styles.css` para cambiar:
- Colores del esquema
- Tipografías
- Espaciados y layouts
- Efectos de hover

### Ampliar Funcionalidades
El código está estructurado para facilitar:
- Implementación de filtros de productos
- Sistema de categorías
- Persistencia con localStorage
- Integración con APIs de pago

## 📱 Compatibilidad

- ✅ Chrome (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Dispositivos móviles

## 📈 Posibles Mejoras Futuras

- [ ] Persistencia con localStorage
- [ ] Filtros y búsqueda de productos
- [ ] Categorías de productos
- [ ] Imágenes reales en lugar de emojis
- [ ] Sistema de descuentos
- [ ] Integración con API de pago
- [ ] Historial de compras
- [ ] Sistema de favoritos

---

💡 **Tip**: Este proyecto es ideal para aprender conceptos de JavaScript como manipulación del DOM, arrays, objetos y gestión de estado básica.
