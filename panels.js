document.addEventListener('mousedown', (e) => {
    const resistorHEl = e.target;
    
    if(!resistorHEl.classList.contains('widget-panel-horizontal-resistor')) return;

    const panelHEl = e.target.closest('.widget-panels-horizontal');

    if(panelHEl) {    
        if(resistorHEl) {            
            resistorHEl.isDragging = true;                        
        }
        
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none'; // Evita que se seleccione texto por accidente
    }
});

document.addEventListener('mousemove', (e) => {
    const panelHEl = e.target.closest('.widget-panels-horizontal');

    if(panelHEl) {
        const resistorHEl = panelHEl.querySelector('.widget-panel-horizontal-resistor');
        const panelLeft = panelHEl.querySelector('.widget-panel-left');

        if(!resistorHEl.isDragging) return;

        const rect = panelHEl.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        let percent = (offsetX / rect.width) * 100;

        if(percent < 10) percent = 10;
        if(percent > 90) percent = 90;

        panelLeft.style.width = percent + '%';
    }
});

document.addEventListener('mouseup', (e) => {
    document.querySelectorAll('.widget-panel-horizontal-resistor').forEach((e) => {
        e.isDragging = false;

        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';     
    });
});

document.addEventListener('mousedown', (e) => {
    const resistorVEl = e.target;
    
    if(!resistorVEl.classList.contains('widget-panel-vertical-resistor')) return;

    const panelVEl = e.target.closest('.widget-panels-vertical');

    if(panelVEl) {    
        if(resistorVEl) {            
            resistorVEl.isDragging = true;                        
        }
        
        document.body.style.cursor = 'ns-resize';
        document.body.style.userSelect = 'none'; // Evita que se seleccione texto por accidente
    }
});

document.addEventListener('mousemove', (e) => {
    const panelVEl = e.target.closest('.widget-panels-vertical');

    if(panelVEl) {
        const resistorVEl = panelVEl.querySelector('.widget-panel-vertical-resistor');
        const panelTop = panelVEl.querySelector('.widget-panel-top');

        if(!resistorVEl.isDragging) return;

        const rect = panelVEl.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        let percent = (offsetY / rect.height) * 100;

        if(percent < 10) percent = 10;
        if(percent > 90) percent = 90;

        panelTop.style.height = percent + '%';
    }
});

document.addEventListener('mouseup', (e) => {
    document.querySelectorAll('.widget-panel-vertical-resistor').forEach((e) => {
        e.isDragging = false;

        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';     
    });
});