// UI: sistema de modales reutilizable + helpers de loading

/** Cierra el modal removiendo el overlay del DOM */
export function cerrarModal(overlay) {
  if (!overlay) overlay = document.querySelector('.modal-overlay');
  if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
}

/**
 * Crea y muestra un modal simple con título, mensaje y botones.
 * onConfirmar puede devolver false para evitar cierre automático.
 */
export function mostrarModal({ icono = '', titulo = '', mensaje = '', textoConfirmar = 'OK', textoCancel, onConfirmar }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal';

  const botones = textoCancel ?
    `<button class="modal-btn modal-btn-cancel">${textoCancel}</button>
     <button class="modal-btn modal-btn-confirm">${textoConfirmar}</button>` :
    `<button class="modal-btn modal-btn-confirm" style="flex:none;margin:0 auto;">${textoConfirmar}</button>`;

  modal.innerHTML = `
    <div class="modal-header">
      <div class="modal-icon">${icono || ''}</div>
      <h3>${titulo}</h3>
      <p style="white-space: pre-line;">${mensaje}</p>
    </div>
    <div class="modal-actions">${botones}</div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const btnCancel = modal.querySelector('.modal-btn-cancel');
  const btnConfirm = modal.querySelector('.modal-btn-confirm');

  if (btnCancel) btnCancel.addEventListener('click', () => cerrarModal(overlay));
  if (btnConfirm) btnConfirm.addEventListener('click', () => {
    if (onConfirmar) {
      const res = onConfirmar();
      if (res !== false) cerrarModal(overlay);
    } else {
      cerrarModal(overlay);
    }
  });

  return overlay;
}

/** Deshabilita botones del modal y muestra texto de loading */
export function mostrarLoadingEnModal(texto = 'Cargando...') {
  const modal = document.querySelector('.modal');
  if (!modal) return;
  const confirmBtn = modal.querySelector('.modal-btn-confirm');
  const cancelBtn = modal.querySelector('.modal-btn-cancel');
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `<span style="display:inline-flex;align-items:center;gap:8px;">
      <div style="width:16px;height:16px;border:2px solid #fff;border-top:2px solid transparent;border-radius:50%;animation:spin 1s linear infinite;"></div>
      ${texto}
    </span>`;
  }
  if (cancelBtn) { cancelBtn.disabled = true; cancelBtn.style.opacity = '0.5'; }
  if (!document.querySelector('#loading-styles')) {
    const style = document.createElement('style');
    style.id = 'loading-styles';
    style.textContent = `@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`;
    document.head.appendChild(style);
  }
}

/** Revierte el estado de loading de los botones del modal */
export function ocultarLoadingEnModal(textoOriginal) {
  const modal = document.querySelector('.modal');
  if (!modal) return;
  const confirmBtn = modal.querySelector('.modal-btn-confirm');
  const cancelBtn = modal.querySelector('.modal-btn-cancel');
  if (confirmBtn) { confirmBtn.disabled = false; confirmBtn.textContent = textoOriginal; }
  if (cancelBtn) { cancelBtn.disabled = false; cancelBtn.style.opacity = '1'; }
}

