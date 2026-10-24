function activateTab(tabEl) {
    if(!tabEl) return;

    const id = tabEl.getAttribute('data-target');

    if(!id) return;

    const tabsEl = tabEl.closest('.widget-tabs');

    if(!tabsEl) return;

    tabsEl.querySelectorAll('.widget-tabs-items').forEach((el) => {
        el.classList.remove('active');
        const id = el.getAttribute('data-target');
        
        if(id) {
           document.querySelector('#'+id).classList.remove('active');
        }
    })

    tabEl.classList.add('active');
    document.querySelector('#'+id).classList.add('active');
}

document.addEventListener('widget-generate', (e) => {
    const widgetEl = e.target;
        
    if(widgetEl.classList.contains('widget-tabs')) {
        widgetEl.querySelectorAll('.widget-tabs-items').forEach((el) => {
            if(el.classList.contains('active')) {
                activateTab(el);
            }
        })
    }
})

document.addEventListener('click', (e) => {
    let tabEl = e.target;

    if(!tabEl.classList.contains('widget-tabs-items')) {
        tabEl = tabEl.closest('.widget-tabs-items');
    }

    activateTab(tabEl);
})