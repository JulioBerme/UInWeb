document.addEventListener('widget-generate', (e) => {
  const widgetEl = e.target;
    
  if(widgetEl.classList.contains('widget-accordion')) {
    const contentEl = document.createElement('div');
    contentEl.classList.add('widget-accordion-content');
    contentEl.append(...widgetEl.childNodes);
    widgetEl.insertAdjacentHTML(
        'afterbegin', 
        `
            <div class="widget-accordion-button">
                <div class="widget-accordion-button-caption">${widgetEl.getAttribute('data-caption')}</div>
                <div class="widget-accordion-button-arrow"></div>
            </div>
        `
    )
    widgetEl.append(contentEl);
  }
})

document.addEventListener('click', (e) => {
    let buttonEl = e.target
    
    if(!buttonEl.classList.contains('widget-accordion-button')) {  
        buttonEl = e.target.closest('.widget-accordion-button');
    }

    if(!buttonEl) return;

    const accordionEl = buttonEl.closest('.widget-accordion')

    if(accordionEl.classList.contains('opened')) {
        accordionEl.classList.remove('opened');
        accordionEl.classList.add('closed');
    } else if(accordionEl.classList.contains('closed')) {
        accordionEl.classList.remove('closed');
        accordionEl.classList.add('opened');
    }
})