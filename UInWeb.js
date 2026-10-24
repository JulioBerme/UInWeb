function UInWeb_openWindow(id) {
  function UInWeb_centerWindow(windowEl) {    
      if (!windowEl) return

      const parent = windowEl.closest('.client-area, .desktop')
      if (!parent) return;

      const parentWidth = parent.clientWidth;
      const parentHeight = parent.clientHeight;

      const windowWidth = windowEl.offsetWidth;
      const windowHeight = windowEl.offsetHeight;

      let newLeft = (parentWidth - windowWidth) / 2;
      let newTop = (parentHeight - windowHeight) / 2;

      if(newLeft < 0) newLeft = 0
      if(newTop < 0) newTop = 0
      
      windowEl.style.position = 'absolute';
      windowEl.style.left = `${newLeft}px`;
      windowEl.style.top = `${newTop}px`;
  }

  const windowEl = document.querySelector('#'+id)

  if(!windowEl) return;

  const popupsEl = windowEl.closest('.popups')

  if(popupsEl) {
    popupsEl.style.display = 'flex'
  }

  windowEl.classList.remove('closed'); 
  windowEl.classList.add('opened');

  UInWeb_centerWindow(windowEl)
}

function UInWeb_closeWindow(id) {
  const windowEl = document.querySelector('#'+id)

  if(!windowEl) return;

  const popupsEl = windowEl.closest('.popups')

  if(popupsEl) {
    popupsEl.style.display = 'none'
  }

  windowEl.classList.add('closed'); 
  windowEl.classList.remove('opened');
  windowEl.classList.remove('maximized');
}

function UInWeb_toggleWindow(id) {
  if(document.querySelector('#'+id).classList.contains('opened')) {
    UInWeb_closeWindow(id)
  } else if(document.querySelector('#'+id).classList.contains('closed')) {
    UInWeb_openWindow(id)
  }
}

function UInWeb_isWindowOpened(id) {
  return document.querySelector('#'+id).classList.contains('opened')
}

function UInWeb_isWindowClosed(id) {
  return document.querySelector('#'+id).classList.contains('closed')
}

function UInWeb_lockWindow(id) {
  const windowEl = document.querySelector('#'+id)

  if(!windowEl) return;

  windowEl.classList.add('locked')
}

function UInWeb_unlockWindow(id) {
  const windowEl = document.querySelector('#'+id)

  if(!windowEl) return;

  windowEl.classList.remove('locked')
}

function UInWeb_setProgressBar(id, message = null, progress = null) {
  const windowEl = document.querySelector('#'+id)

  if(!windowEl) return;  
          
  windowEl.querySelector('.status-bar-message').innerHTML = message ?? ''
  windowEl.querySelector('.status-bar-progess .progess-text').innerHTML = progress ? progress+'%' : ''
  windowEl.querySelector('.status-bar-progess').style.setProperty('--progress', progress ? progress+'%' : '')
}

function UInWeb_updateShortcutsVisibility() {
  const shortcuts = document.querySelectorAll('.desktop-bar-shortcut');

  shortcuts.forEach(shortcut => {
    const targetId = shortcut.getAttribute('target');
    if (!targetId) return;

    const targetWindow = document.getElementById(targetId);

    if (targetWindow && targetWindow.classList.contains('window')) {
      if (targetWindow.classList.contains('opened')) {
        shortcut.style.display = 'none';
      } else if (targetWindow.classList.contains('closed')) {
        shortcut.style.display = 'flex';
      }
    }
  });
}

function UInWeb_updateWidgets() {
  const widgets = document.querySelectorAll('.widget');

  widgets.forEach(widget => widget.dispatchEvent(new CustomEvent('widget-generate', { bubbles: true })));
}

document.addEventListener('DOMContentLoaded', () => {        
  UInWeb_updateShortcutsVisibility();
  UInWeb_updateWidgets();

  const observer = new MutationObserver((mutations) => {
    let shouldUpdateShortcutsVisibility = false;
    let shouldUpdateWidgets = false;
    
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && (node.classList.contains('window') || node.querySelector('.window'))) {
            shouldUpdateShortcutsVisibility = true;
          }
          if (node.nodeType === 1 && (node.classList.contains('widget') || node.querySelector('.widget'))) {
            shouldUpdateWidgets = true;
          }

        });
      }
    });

    if (shouldUpdateShortcutsVisibility) {
      UInWeb_updateShortcutsVisibility();
    }

    if (shouldUpdateWidgets) {
      UInWeb_updateWidgets();
    }    

    observer.observe(document.body, { childList: true, subtree: true });
  });      

  let highestZIndex = 1; // Contador global para el orden de capas
  let activeAction = null; // Almacena el estado actual de arrastre o redimensionado
  const edgeSize = 8; // Grosor en píxeles del borde interactivo para redimensionar

  // 1. Delegación para CLICS (Shortcuts, Cerrar, Maximizar)
  document.addEventListener('click', (e) => {
    let windowEl = e.target.closest('.window'), parentWindowEl;
    
    if(windowEl) {      
      do {
        parentWindowEl = windowEl.parentNode?.closest('.window');           
        if(parentWindowEl) {
          windowEl = parentWindowEl;
          windowEl.style.zIndex = ++highestZIndex;
        }
      } while(parentWindowEl);
    }

    // Abrir ventana desde el shortcut
    const shortcut = e.target.closest('.desktop-bar-shortcut');
    if (shortcut) {
      const targetId = shortcut.getAttribute('target');
      if (!targetId) return;

      const targetWindow = document.getElementById(targetId);
      if (targetWindow && targetWindow.classList.contains('window')) {
        targetWindow.classList.add('opened');
        targetWindow.classList.remove('closed');              
        shortcut.style.display = 'none';

        // Traer al frente al abrir
        targetWindow.style.zIndex = ++highestZIndex;
      }
      return;
    }

    // Botón Cerrar
    const closeBtn = e.target.closest('.title-bar-button.close');
    if (closeBtn) {
      const windowEl = closeBtn.closest('.window');
      if (windowEl) {
        windowEl.classList.add('closed');
        windowEl.classList.remove('opened');
        windowEl.classList.remove('maximized');
        windowEl.style.top = windowEl.dataset.prevTop;
        windowEl.style.left = windowEl.dataset.prevLeft;
        windowEl.style.width = windowEl.dataset.prevWidth;
        windowEl.style.height = windowEl.dataset.prevHeight;
        
        const buttonEl = windowEl.querySelector('.title-bar-button.maximize, .title-bar-button.minimize')
        buttonEl.classList.add('maximize')
        buttonEl.classList.remove('minimize')

        // Mostrar el shortcut correspondiente si existe el id
        if (windowEl.id) {
          const shortcutEl = document.querySelector(`.desktop-bar-shortcut[target="${windowEl.id}"]`);
          if (shortcutEl) shortcutEl.style.display = 'flex';
        }
      }
      return;
    }

    // Botón Maximizar / Restaurar
    const maximizeBtn = e.target.closest('.title-bar-button.maximize, .title-bar-button.minimize');
    if (maximizeBtn) {
      const windowEl = maximizeBtn.closest('.window');
      if (!windowEl) return;

      if (maximizeBtn.classList.contains('maximize')) {
        // Guardar dimensiones actuales antes de maximizar
        const rect = windowEl.getBoundingClientRect();
        windowEl.dataset.prevTop = windowEl.style.top || `${rect.top}px`;
        windowEl.dataset.prevLeft = windowEl.style.left || `${rect.left}px`;
        windowEl.dataset.prevWidth = windowEl.style.width || `${rect.width}px`;
        windowEl.dataset.prevHeight = windowEl.style.height || `${rect.height}px`;
        
        maximizeBtn.classList.remove('maximize');
        maximizeBtn.classList.add('minimize');        
        windowEl.classList.add('maximized');
        
        windowEl.style.top = '0px';
        windowEl.style.left = '0px';
        windowEl.style.width = '100%';
        windowEl.style.height = '100%';
      } else {
        // Restaurar dimensiones anteriores
        maximizeBtn.classList.remove('minimize');
        maximizeBtn.classList.add('maximize');
        windowEl.classList.remove('maximized');

        windowEl.style.top = windowEl.dataset.prevTop || '';
        windowEl.style.left = windowEl.dataset.prevLeft || '';
        windowEl.style.width = windowEl.dataset.prevWidth || '';
        windowEl.style.height = windowEl.dataset.prevHeight || '';
      }

      window.dispatchEvent(new CustomEvent('widget-resize', { detail: { element: windowEl.querySelector('.client-area') } }));

      return;
    }


    const els = document.querySelectorAll('.menu-bar .actived');
    els.forEach((el) => {
      if(!el.contains(e.target) || e.target.children.length === 0) {
        el.classList.remove('actived')
      }
    });    
    const menuEl = e.target.closest('.menu-bar')
    if(menuEl) {      
      e.target.classList.add('actived')
      if(!e.target.tabIndex) {
        e.target.tabIndex = "0"
      }
    }
  });

  // 2. Cambiar cursor según el borde al mover el ratón
  document.addEventListener('mousemove', (e) => {    
    if (activeAction) return; 
    
    const windowEl = e.target.closest('.window');
    if (!windowEl) return;
    if(windowEl.classList.contains('maximized')) return;
    if(windowEl.classList.contains('dialog')) return;

    const rect = windowEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let top = y < edgeSize;
    let bottom = y > rect.height - edgeSize;
    let left = x < edgeSize;
    let right = x > rect.width - edgeSize;

    if ((top && left) || (bottom && right)) {
      windowEl.style.cursor = 'nwse-resize';
    } else if ((top && right) || (bottom && left)) {
      windowEl.style.cursor = 'nesw-resize';
    } else if (top || bottom) {
      windowEl.style.cursor = 'ns-resize';
    } else if (left || right) {
      windowEl.style.cursor = 'ew-resize';
    } else {
      windowEl.style.cursor = 'default';
    }
  });

  // 3. Delegación para MOUSE DOWN (Enfocar, Arrastrar y Redimensionar)
  document.addEventListener('mousedown', (e) => {
    const windowEl = e.target.closest('.window');
    if (!windowEl) return;    

    const areaEl = windowEl.closest('.client-area') ?? document.querySelector('.desktop');
    let voff = 0, hoff = 0, Voff = 0, Hoff = 0
    if(areaEl) {
      voff = areaEl.getBoundingClientRect().top + areaEl.clientTop
      hoff = areaEl.getBoundingClientRect().left + areaEl.clientLeft
      Hoff = areaEl.getBoundingClientRect().width - 2*areaEl.clientTop
      Voff = areaEl.getBoundingClientRect().height - 2*areaEl.clientLeft
    }

    windowEl.style.zIndex = ++highestZIndex;

    const minButton = windowEl.querySelector('.title-bar').querySelector('.title-bar-button.minimize')
    if (minButton) return;

    const rect = windowEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let top = y < edgeSize;
    let bottom = y > rect.height - edgeSize;
    let left = x < edgeSize;
    let right = x > rect.width - edgeSize;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialLeft = rect.left;
    const initialTop = rect.top;
    const initialWidth = rect.width;
    const initialHeight = rect.height;

    activeAction = {      
      windowEl,
      hoff,
      voff,
      Hoff,
      Voff,
      dir: { top, bottom, left, right },
      startX, startY, initialLeft, initialTop, initialWidth, initialHeight
    };

    // Comprobar si se hace clic en un borde para redimensionar
    if (top || bottom || left || right) {
      activeAction.type = 'resize'
      e.preventDefault();
      return;
    }

    // Si se hace clic en la barra de título (excluyendo botones), movemos la ventana
    const titleBar = e.target.closest('.title-bar');
    if (titleBar && !e.target.classList.contains('title-bar-button')) {
      titleBar.style.cursor = 'grabbing';
      activeAction.type = 'drag'
      e.preventDefault();
      return;
    }
  });

  // 4. Movimiento global (mientras se arrastra o redimensiona)
  document.addEventListener('mousemove', (e) => {
    if (!activeAction) return;        

    const { type, windowEl, startX, startY, initialLeft, initialTop, voff, hoff, Voff, Hoff } = activeAction;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    if (type === 'drag') {
      let newLeft = initialLeft + deltaX - hoff;
      let newTop = initialTop + deltaY - voff;

      const w = windowEl.getBoundingClientRect().width
      const h = windowEl.getBoundingClientRect().height

      if(newLeft+w > Hoff) {
        newLeft = Hoff-w
      }
      if(newTop+h > Voff) {
        newTop = Voff-h
      }
      if(newLeft < 0) {
        newLeft = 0
      }
      if(newTop < 0) {
        newTop = 0
      }      

      windowEl.style.left = `${newLeft}px`;
      windowEl.style.top = `${newTop}px`;
    } 
    else if (type === 'resize') {
      if(windowEl.classList.contains('dialog')) return;

      const { dir, initialWidth, initialHeight } = activeAction;
      /*const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY - voff;*/

      let newWidth = initialWidth;
      let newHeight = initialHeight;
      let newLeft = initialLeft-hoff;
      let newTop = initialTop-voff;

      if (dir.right) {
        newWidth = initialWidth + deltaX;        
      }
      if (dir.bottom) {
        newHeight = initialHeight + deltaY;
      }
      if (dir.left) {        
        newWidth = initialWidth - deltaX;
        if (newWidth >= parseInt(window.getComputedStyle(windowEl).minWidth)) {
          newLeft = initialLeft + deltaX - hoff;
        }
      }
      if (dir.top) {
        newHeight = initialHeight - deltaY;
        if (newHeight >= parseInt(window.getComputedStyle(windowEl).minHeight)) {
          newTop = initialTop + deltaY - voff;
        }
      }

      windowEl.style.width = `${newWidth}px`;
      windowEl.style.height = `${newHeight}px`;
      windowEl.style.left = `${newLeft}px`;
      windowEl.style.top = `${newTop}px`;
      
      window.dispatchEvent(new CustomEvent('widget-resize', { detail: { element: windowEl.querySelector('.client-area') } }));              
    }
  });

  // 5. Soltar el ratón para finalizar cualquier acción
  document.addEventListener('mouseup', () => {
    if (activeAction) {
      if (activeAction.type === 'drag' && activeAction.titleBar) {
        activeAction.titleBar.style.cursor = 'default';
      }
      activeAction.windowEl.style.cursor = 'default';
      activeAction = null;
    }
  });  

  window.addEventListener('blur', (e) => {
    setTimeout(() => {        
        const elementoActivo = document.activeElement;
                  
        if (elementoActivo && elementoActivo.tagName === 'IFRAME') {
            const windowEl = elementoActivo.closest('.window')

            const eventClick = new MouseEvent('click', {
                view: window,
                bubbles: true,    
                cancelable: true, 
                clientX: 0,      
                clientY: 0       
            });
            
            windowEl.dispatchEvent(eventClick);              
        }
    }, 0);
  });

  window.addEventListener('resize', (e) => {
    document.querySelectorAll('.widget').forEach((el) => {
      window.dispatchEvent(new CustomEvent('widget-resize', { detail: { element: el.closest('.client-area') } }));      
    })
  })
});
