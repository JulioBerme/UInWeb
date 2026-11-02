document.addEventListener('widget-generate', (e) => {
  const widgetEl = e.target
    
  if(widgetEl.classList.contains('widget-slim-select')) {
    if(!widgetEl.slimSelectO) {
        const setup = window[widgetEl.getAttribute('data-setup')] ?? {};
        widgetEl.slimSelectO = new SlimSelect(Object.assign(
          setup,
          {
            select: '#'+widgetEl.id
          },          
        ));
    }
  }
})
