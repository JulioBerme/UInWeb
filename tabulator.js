function resize(areaEl) {
  const tabulators = areaEl.querySelectorAll('.widget-tabulator')

  const rect = areaEl.getBoundingClientRect()
  tabulators.forEach((el) => {    
    const pw = el.getAttribute('data-pw')
    const ph = el.getAttribute('data-ph')
    if(pw) {      
      el.style.width  = (rect.width * (parseInt(pw) / 100))+'px'
    }
    if(ph) {      
      el.style.height  = (rect.height * (parseInt(ph) / 100))+'px'
    }
  })    
}

document.addEventListener('widget-generate', (e) => {
  const widgetEl = e.target
    
  if(widgetEl.classList.contains('widget-tabulator')) {
    if(!widgetEl.tabulatorO) {
      const tableEl = widgetEl.querySelector('table')
      if(!tableEl) return      
      const setup = window[widgetEl.getAttribute('data-setup')] ?? {};
      widgetEl.tabulatorO = new Tabulator('#'+tableEl.id, Object.assign({        
        resizableRows: true,
        movableColumns: true,
        height: "100%"        
      }, setup));
      resize(widgetEl.closest('.client-area'))
    }
  }
})

window.addEventListener('widget-resize', (e) => {
  resize(e.detail.element)
})