(() => {
  const isStored=d=>!!d?.storagePath;
  const label=d=>d?.status==='ready'?'Listo':d?.status==='located'?`${d.sourceYear||'Histórico'}${d.needsUpdate?' · actualizar':''}`:d?.sourceYear?String(d.sourceYear):'Pendiente';
  const mark=d=>{const n=(d?.name||'').toLowerCase();return n.endsWith('.pdf')?'PDF':(n.endsWith('.doc')||n.endsWith('.docx'))?'DOC':/\.(png|jpe?g|webp)$/i.test(n)?'IMG':d?.category==='CV'?'CV':'DOC'};
  const matches=(d,q)=>{
    const n=(d.name||'').toLowerCase(),id=(q.id||'').toLowerCase(),l=(q.label||'').toLowerCase();
    if(id==='cv'||l.includes('cv'))return d.category==='CV'||/\bcv\b|curriculum/.test(n);
    if(id==='passport'||l.includes('pasaporte'))return /pasaport/.test(n);
    if(id==='degree'||id==='diploma'||l.includes('título')||l.includes('titulo')||l.includes('bachelor')||l.includes('diploma'))return /t[ií]tulo|diplom|licenciatura|degree|bachelor/.test(n)&&!/admis|dossier|movilidad|financiamiento/.test(n);
    if(id==='transcript'||id==='grades'||l.includes('transcript')||l.includes('nota')||l.includes('gpa'))return /transcript|nota|calific|concentraci[oó]n/.test(n);
    if(id==='motivation'||l.includes('motivaci'))return /motiv|lettre/.test(n);
    if(id==='recommendation'||l.includes('recomend'))return d.category==='Recomendaciones'||/recomend|recommend/.test(n);
    return d.category===q.category;
  };

  const actionButtons=d=>isStored(d)
    ? `<div class="doc-list-actions"><button type="button" data-view-doc="${esc(d.id)}">Visualizar</button><button type="button" data-download-doc="${esc(d.id)}">Descargar</button></div>`
    : '<span class="doc-list-action">Pendiente</span>';

  docsPage=function(){
    const cats=['CV','Estudios','Idiomas','Recomendaciones','Muestras','Otros'];
    const stored=state.documents.filter(isStored);
    const counts=Object.fromEntries(cats.map(c=>[c,stored.filter(d=>d.category===c).length]));
    const docs=docFilter==='all'?[]:stored.filter(d=>d.category===docFilter);
    return `<section class="page"><div class="page-head compact"><h1>Documentos</h1><button class="circle-action" data-action="upload">+</button></div><div class="wallet-list">${cats.map(c=>`<button class="wallet-row ${docFilter===c?'active':''}" data-docfilter="${c}"><span>${icon(c)}</span><strong>${c}</strong><b>${counts[c]||0}</b><i>›</i></button>`).join('')}</div>${docFilter!=='all'?`<div class="doc-items">${docs.map(d=>`<div class="doc-item"><div class="doc-list-main"><span class="real-file-mark">${mark(d)}</span><div><strong>${esc(d.name)}</strong><span>${esc(label(d))}</span></div></div>${actionButtons(d)}</div>`).join('')||'<div class="empty">Sin documentos guardados</div>'}</div>`:''}</section>`;
  };

  openReq=function(id,rid){
    const o=state.opportunities.find(x=>x.id===id),q=(o?.requirements||[]).find(x=>x.id===rid);if(!q)return;
    if(q.type!=='document'){openModal(`<h2>${esc(q.label)}</h2><p class="small-note">${q.state==='easy'?'Podemos resolver esto rápidamente.':'Todavía hay que resolver este punto.'}</p>`);return;}
    const candidates=state.documents.filter(d=>matches(d,q));
    const best=candidates.find(d=>d.status==='ready')||candidates.find(d=>d.status==='located')||candidates[0];
    const existing=best?`<div class="existing-doc-label">Versión que ya tenemos</div><div class="existing-doc-card truthful"><div class="doc-list-main"><span class="real-file-mark">${mark(best)}</span><span><b>${esc(best.name)}</b><small>${esc(label(best))}</small></span></div>${actionButtons(best)}</div>`:`<div class="empty compact-empty"><b>Todavía no lo tenemos</b><span>No hay un documento equivalente guardado.</span></div>`;
    openModal(`<h2>${esc(q.label)}</h2>${existing}<button class="button primary full" id="upload-new-version">${best?'Subir versión nueva':'Subir archivo'}</button>`);
    document.querySelector('#upload-new-version').onclick=()=>{document.querySelector('#modal').close();document.querySelector('#file-input').click()};
    bindViewerButtons();
  };

  function bindViewerButtons(){
    document.querySelectorAll('[data-view-doc]').forEach(el=>{el.onclick=e=>{e.preventDefault();e.stopPropagation();const d=state.documents.find(x=>x.id===el.dataset.viewDoc);if(d?.storagePath)window.postulaDocuments?.visualize(d).catch(console.error)}});
    document.querySelectorAll('[data-download-doc]').forEach(el=>{el.onclick=e=>{e.preventDefault();e.stopPropagation();const d=state.documents.find(x=>x.id===el.dataset.downloadDoc);if(d?.storagePath)window.postulaDocuments?.download(d).catch(console.error)}});
  }

  const priorBind=bind;
  bind=function(){priorBind();bindViewerButtons();};
  document.querySelector('#modal')?.addEventListener('close',()=>document.querySelector('#modal')?.classList.remove('viewer-modal'));
  render();
})();
