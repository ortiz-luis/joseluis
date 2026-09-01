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
  const nested=d=>`<div class="doc-item" style="margin:8px 0 10px 28px;width:calc(100% - 28px);box-sizing:border-box"><div class="doc-list-main"><span class="real-file-mark">${mark(d)}</span><div><strong>${esc(d.name)}</strong><span>Listo</span></div></div>${actions(d)}</div>`;
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
        children+=docs.length?docs.map(nested).join(''):`<div class="empty" style="margin:8px 0 10px 28px;width:calc(100% - 28px);box-sizing:border-box">Sin documentos utilizables en 2026</div>`;
      }
      return `<div class="document-category-group"><button class="wallet-row ${open?'active':''}" data-docfilter="${id}"><span>${icon(id)}</span><strong>${title}</strong><b>${docs.length}</b><i>${open?'⌄':'›'}</i></button>${children}</div>`;
    }).join('');
    return `<section class="page"><div class="page-head compact"><h1>Documentos</h1><button class="circle-action" data-action="upload" aria-label="Añadir documento">+</button></div><div class="wallet-list">${rows}</div></section>`;
  };
  render();
})();