document.addEventListener('widget', (e) => {
  const widgetEl = e.target
  
  if(widgetEl.classList.contains('widget-datatables')) {
    if(!widgetEl.dtO) {
      widgetEl.dtO = new DataTable('#'+widgetEl.id);
    } else {}
  }
})