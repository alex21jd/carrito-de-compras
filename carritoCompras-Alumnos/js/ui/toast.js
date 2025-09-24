// UI: mensajes de notificación (toast) para feedback al usuario

/**
 * Muestra un toast temporal en la esquina inferior derecha.
 * @param {string} texto Mensaje a mostrar
 * @param {'info'|'error'|'success'} tipo Tipo de mensaje (para colores)
 */
export function mostrarMensaje(texto, tipo = 'info') {
  const mensajeDiv = document.createElement('div');
  mensajeDiv.className = 'toast-message';
  mensajeDiv.textContent = texto;

  const color = tipo === 'error' ? '#dc3545' : tipo === 'success' ? '#28a745' : '#333';
  mensajeDiv.style.cssText = `
    position: fixed; right: 16px; bottom: 16px; z-index: 9999;
    background: ${color}; color: #fff; padding: 10px 14px; border-radius: 6px;
    box-shadow: 0 8px 24px rgba(0,0,0,.2); font-size: 14px; max-width: 320px;
    transform: translateX(120%); opacity: .0; animation: toast-in .25s ease-out forwards;
  `;

  if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `@keyframes toast-in{from{transform:translateX(120%);opacity:.0}to{transform:translateX(0);opacity:1}}`;
    document.head.appendChild(style);
  }

  document.body.appendChild(mensajeDiv);
  setTimeout(() => mensajeDiv.remove(), 3000);
}

