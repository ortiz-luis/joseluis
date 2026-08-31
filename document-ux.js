(() => {
  const modal=document.querySelector('#modal');
  if(modal && !modal.dataset.backdropClose){
    modal.dataset.backdropClose='1';
    modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
  }

  const labelFor=d=>{
    if(d.status==='ready') return d.updated?new Date(d.updated).getFullYear()+' · actual':'Actual';
    if(d.status==='located') return `${d.sourceYear||'Histórico'}${d.needsUpdate?' · actualizar':''}`;
    if(d.status==='known-not-found') return 'Existe · falta localizar';
    return d.sourceYear?String(d.sourceYear):'Pendiente';
  };

  function previewHTML(d){
    const ext=(d.name.split('.').pop()||'').toUpperCase();
    const kind=d.category==='CV'?'CV':d.category==='Estudios'?'DOC':d.category==='Muestras'?'TXT':d.category==='Otros'?'DOC':ext;
    return `<div class="doc-preview-card"><div class="doc-preview-sheet"><span>${esc(kind)}</span><b>${esc(d.name)}</b><small>${esc(labelFor(d))}</small></div></div>`;
  }

  function openDoc(d){
    if(!d)return;
    const canOpen=!!(d.objectUrl||d.downloadUrl||d.privateUrl);
    openModal(`<h2>${esc(d.name)}</h2>${previewHTML(d)}<div class="doc-modal-meta">${esc(labelFor(d))}</div><div class="modal-actions doc-modal-actions">${canOpen?`<a class="button soft" href="${esc(d.objectUrl||d.downloadUrl||d.privateUrl)}" target="_blank" rel="noopener">Abrir</a>`:''}${d.needsUpdate?'<button class="button primary" id="replace-doc">Subir versión nueva</button>':''}</div>${!canOpen&&d.status==='located'?'<p class="tiny center">La versión está localizada, pero el archivo todavía no ha sido importado al almacenamiento privado.</p>':''}`);
    const replace=document.querySelector('#replace-doc');
    if(replace)replace.onclick=()=>{modal.close();document.querySelector('#file-input').click()};
  }

  if(typeof docsPage==='function'){
    docsPage=function(){
      const cats=['CV','Estudios','Idiomas','Recomendaciones','Muestras','Otros'];
      const counts=Object.fromEntries(cats.map(c=>[c,state.documents.filter(d=>d.category===c).length]));
      const docs=docFilter==='all'?[]:state.documents.filter(d=>d.category===docFilter);
      return `<section class="page"><div class="page-head compact"><h1>Documentos</h1><button class="circle-action" data-action="upload">+</button></div><div class="wallet-list">${cats.map(c=>`<button class="wallet-row ${docFilter===c?'active':''}" data-docfilter="${c}"><span>${icon(c)}</span><strong>${c}</strong><b>${counts[c]||0}</b><i>›</i></button>`).join('')}</div>${docFilter!=='all'?`<div class="doc-items">${docs.map(d=>`<button class="doc-item doc-open" data-open-doc="${esc(d.id)}"><div><strong>${esc(d.name)}</strong><span>${esc(labelFor(d))}</span></div><span class="mini-priority">›</span></button>`).join('')||'<div class="empty">Sin documentos</div>'}</div>`:''}</section>`;
    };
  }

  const oldBind=typeof bind==='function'?bind:null;
  if(oldBind){
    bind=function(){
      oldBind();
      document.querySelectorAll('[data-open-doc]').forEach(el=>el.onclick=()=>openDoc(state.documents.find(d=>d.id===el.dataset.openDoc)));
    };
  }

  if(typeof openReq==='function'){
    const originalOpenReq=openReq;
    openReq=function(id,rid){
      const o=state.opportunities.find(x=>x.id===id),q=(o?.requirements||[]).find(x=>x.id===rid);
      if(!q||q.type!=='document')return originalOpenReq(id,rid);
      const candidates=state.documents.filter(d=>d.category===q.category);
      const best=candidates.find(d=>d.status==='ready')||candidates.find(d=>d.status==='located')||candidates[0];
      openModal(`<h2>${esc(q.label)}</h2>${best?`<div class="existing-doc-label">Versión que ya tenemos</div><button class="existing-doc-card" id="open-existing">${previewHTML(best)}<span><b>${esc(best.name)}</b><small>${esc(labelFor(best))}</small></span><i>›</i></button>`:'<div class="empty compact-empty">No hay una versión anterior</div>'}<button class="button primary full" id="upload-new-version">${best?'Subir versión nueva':'Subir archivo'}</button>`);
      const ex=document.querySelector('#open-existing'); if(ex)ex.onclick=()=>openDoc(best);
      document.querySelector('#upload-new-version').onclick=()=>{modal.close();document.querySelector('#file-input').click()};
    };
  }

  if(typeof render==='function')render();
})();
