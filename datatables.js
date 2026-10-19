document.addEventListener('widget', (e) => {
  const widgetEl = e.target
  
  if(widgetEl.classList.contains('widget-datatables')) {
    if(!widgetEl.dtO) {
      const tableEl = widgetEl.closest('table')
      if(!tableEl) return
      widgetEl.dtO = new DataTable(
          '#'+tableEl.id,
          {
            paging: false, 
            searching: false,
            info: false, 
            lengthChange: false,
          }
        );
    } else {}
  }
})