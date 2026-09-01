(() => {
  const usable=d=>d?.status==='ready'&&!!d?.storagePath;
  const cvLetter=d=>d?.category==='CV'||/\bcv\b|curriculum|motiv|lettre|carta/i.test(d?.name||'');
  const docsFor=id=>{
    const all=(state.documents||[]).filter(usable);
    if(id==='CV') return all.filter(cvLetter);
    if(id==='Otros') return all.filter(d=>d.category==='Otros'&&!cvLetter(d));
    return all.filter(d=>d.category===id);
  };
  const mark=d=>{const n=(d?.name||'').toLowerCase();return n.endsWith('.pdf')?'PDF':(n.endsWith('.doc')||n.endsWith('.docx'))?'DOC':/\.(png|jpe?g|webp)$/i.test(n)?'IMG':d?.category==='CV'?'CV':'DOC'};
  const actions=d=>`<div class="doc-list-actions"><button type="button" data-view-doc="${esc(d.id)}">Visualizar</button><button type="button" data-download-doc="${esc(d.id)}">Descargar</button></div>`;
  const trashIcon=()=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8v9m4-9v9m4-9v9M5 5h14M9 5V3h6v2m-9 0 1 16h10l1-16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const nested=d=>`<div class="doc-item-shell"><div class="doc-item"><div class="doc-list-main"><span class="real-file-mark">${mark(d)}</span><div><strong>${esc(d.name)}</strong><span>Listo</span></div></div>${actions(d)}</div><button type="button" class="doc-trash" data-delete-doc="${esc(d.id)}" aria-label="Eliminar ${esc(d.name)}" title="Eliminar documento">${trashIcon()}</button></div>`;
  const builderActions=()=>`<div class="doc-builder-actions"><a href="cv-builder/"><span>CV</span><strong>Crear CV</strong></a><a href="letter-builder/"><span>Carta</span><strong>Crear carta</strong></a></div>`;
  const cats=[
    ['Identidad','Identidad'],
    ['CV','CV y carta de motivación'],
    ['Estudios','Estudios'],
    ['Idiomas','Idiomas'],
    ['Recomendaciones','Recomendaciones'],
    ['Muestras','Muestras'],
    ['Otros','Otros']
  ];
  docsPage=function(){
    const rows=cats.map(([id,title])=>{
      const open=docFilter===id,docs=docsFor(id);
      let children='';
      if(open){
        if(id==='CV') children+=builderActions();
        children+=docs.length?docs.map(nested).join(''):`<div class="empty category-empty">Sin documentos utilizables en 2026</div>`;
      }
      return `<div class="document-category-group"><div class="category-row-shell"><button class="wallet-row ${open?'active':''}" data-docfilter="${id}"><span>${icon(id)}</span><strong>${title}</strong><b>${docs.length}</b><i>${open?'⌄':'›'}</i></button><button type="button" class="category-add" data-upload-category="${id}" aria-label="Añadir documento a ${title}" title="Añadir documento">+</button></div>${children}</div>`;
    }).join('');
    return `<section class="page"><div class="page-head compact"><h1>Documentos</h1></div><div class="wallet-list">${rows}</div></section>`;
  };

  document.addEventListener('click',e=>{
    const add=e.target.closest?.('[data-upload-category]');
    if(!add)return;
    e.preventDefault();e.stopPropagation();
    docFilter=add.dataset.uploadCategory;
    const input=document.querySelector('#file-input');
    if(input){input.value='';input.click()}
  },true);

  render();
})();