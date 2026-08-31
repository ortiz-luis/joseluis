(() => {
  const modal=document.querySelector('#modal');
  if(modal && !modal.dataset.backdropClose){
    modal.dataset.backdropClose='1';
    modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
  }

  const PRIVATE_RAW='https://github.com/ortiz-luis/joseluis-private-data/raw/refs/heads/main/';
  const PRIVATE_VIEW='https://github.com/ortiz-luis/joseluis-private-data/blob/main/';
  const privatePaths={
    'gmail-cv-es-v3':'documents/cv/CV_Moraga_Joseluis_ES_v3_2022.pdf',
    'gmail-cv-fr-v3':'documents/cv/CV_Moraga_Joseluis_FR_v3_2022.pdf',
    'gmail-motivation-es':'documents/motivation/Carta_Moraga_Joseluis_ES_v3_2022.pdf',
    'gmail-motivation-fr':'documents/motivation/Lettre_Moraga_Joseluis_FR_v3_2022.pdf',
    'gmail-passport':'documents/identity/Pasaporte_2022.pdf',
    'gmail-sciencespo-admission':'documents/international/Admission_MORAGA_2022.pdf',
    'gmail-ufro-mobility':'documents/international/UFRO_Mobility_Funding_2022.pdf',
    'gmail-sciencespo-dossier':'documents/applications/Dossier_FSI_MAJ_2021-2022_completo.doc'
  };
  for(const d of (state?.documents||[])){
    const p=privatePaths[d.id];
    if(p){
      const enc=p.split('/').map(encodeURIComponent).join('/');
      d.privateUrl=PRIVATE_RAW+enc;
      d.previewUrl=PRIVATE_VIEW+enc;
    }
  }

  const labelFor=d=>{
    if(d.status==='ready') return d.updated?new Date(d.updated).getFullYear()+' · actual':'Actual';
    if(d.status==='located') return `${d.sourceYear||'Histórico'}${d.needsUpdate?' · actualizar':''}`;
    if(d.status==='known-not-found') return 'Existe · falta localizar';
    return d.sourceYear?String(d.sourceYear):'Pendiente';
  };

  const downloadHref=d=>d&&(d.objectUrl||d.downloadUrl||d.privateUrl);
  const previewHref=d=>d&&(d.objectUrl||d.previewUrl||d.downloadUrl||d.privateUrl);
  const canOpen=d=>!!downloadHref(d);
  const fileType=d=>{
    const n=(d?.name||'').toLowerCase();
    if(n.endsWith('.pdf'))return 'PDF';
    if(n.endsWith('.doc')||n.endsWith('.docx'))return 'DOC';
    if(n.endsWith('.jpg')||n.endsWith('.jpeg')||n.endsWith('.png'))return 'IMG';
    if(d?.category==='CV')return 'CV';
    return 'DOC';
  };

  function honestFileMark(d){return `<span class="real-file-mark" aria-hidden="true">${esc(fileType(d))}</span>`;}
  function openUrl(url){if(!url)return false;window.open(url,'_blank','noopener');return true;}
  function visualizeDocument(d){return openUrl(previewHref(d));}
  function downloadDocument(d){return openUrl(downloadHref(d));}

  function openDoc(d){
    if(!d)return;
    if(canOpen(d)){
      openModal(`<h2>${esc(d.name)}</h2><div class="document-summary">${honestFileMark(d)}<div><b>${esc(d.name)}</b><span>${esc(labelFor(d))}</span></div></div><div class="modal-actions"><button class="button primary" id="visualize-doc">Visualizar</button><button class="button soft" id="download-doc">Descargar</button>${d.needsUpdate?'<button class="button soft" id="replace-doc">Subir versión nueva</button>':''}</div>`);
      document.querySelector('#visualize-doc').onclick=()=>visualizeDocument(d);
      document.querySelector('#download-doc').onclick=()=>downloadDocument(d);
    }else{
      openModal(`<h2>${esc(d.name)}</h2><div class="document-summary">${honestFileMark(d)}<div><b>${esc(d.name)}</b><span>${esc(labelFor(d))}</span></div></div><p class="doc-unavailable">Tenemos registrada esta versión, pero el archivo todavía no está conectado a la app.</p>${d.needsUpdate?'<button class="button primary full" id="replace-doc">Subir versión nueva</button>':''}`);
    }
    const replace=document.querySelector('#replace-doc');
    if(replace)replace.onclick=()=>{modal.close();document.querySelector('#file-input').click()};
  }

  function matchesRequirement(d,q){
    const n=(d.name||'').toLowerCase();
    const id=(q.id||'').toLowerCase();
    const label=(q.label||'').toLowerCase();
    if(id==='cv'||label.includes('cv')) return d.category==='CV'||/\bcv\b|curriculum/.test(n);
    if(id==='passport'||label.includes('pasaporte')) return /pasaport/.test(n);
    if(id==='degree'||id==='diploma'||label.includes('título')||label.includes('titulo')||label.includes('bachelor')||label.includes('diploma')) return /t[ií]tulo|diplom|licenciatura|degree|bachelor/.test(n) && !/admis|dossier|movilidad|financiamiento/.test(n);
    if(id==='transcript'||id==='grades'||label.includes('transcript')||label.includes('nota')||label.includes('gpa')) return /transcript|nota|calific|concentraci[oó]n/.test(n);
    if(id==='motivation'||label.includes('motivaci')) return /motiv|lettre/.test(n);
    if(id==='recommendation'||label.includes('recomend')) return d.category==='Recomendaciones'||/recomend|recommend/.test(n);
    return d.category===q.category;
  }

  if(typeof docsPage==='function'){
    docsPage=function(){
      const cats=['CV','Estudios','Idiomas','Recomendaciones','Muestras','Otros'];
      const counts=Object.fromEntries(cats.map(c=>[c,state.documents.filter(d=>d.category===c).length]));
      const docs=docFilter==='all'?[]:state.documents.filter(d=>d.category===docFilter);
      return `<section class="page"><div class="page-head compact"><h1>Documentos</h1><button class="circle-action" data-action="upload">+</button></div><div class="wallet-list">${cats.map(c=>`<button class="wallet-row ${docFilter===c?'active':''}" data-docfilter="${c}"><span>${icon(c)}</span><strong>${c}</strong><b>${counts[c]||0}</b><i>›</i></button>`).join('')}</div>${docFilter!=='all'?`<div class="doc-items">${docs.map(d=>`<div class="doc-item"><div class="doc-list-main">${honestFileMark(d)}<div><strong>${esc(d.name)}</strong><span>${esc(labelFor(d))}</span></div></div>${canOpen(d)?`<div class="doc-list-actions"><button data-visualize-doc="${esc(d.id)}">Visualizar</button><button data-download-doc="${esc(d.id)}">Descargar</button></div>`:`<button class="doc-list-action" data-open-doc="${esc(d.id)}">Ver</button>`}</div>`).join('')||'<div class="empty">Sin documentos</div>'}</div>`:''}</section>`;
    };
  }

  const oldBind=typeof bind==='function'?bind:null;
  if(oldBind){bind=function(){
    oldBind();
    document.querySelectorAll('[data-open-doc]').forEach(el=>el.onclick=()=>openDoc(state.documents.find(d=>d.id===el.dataset.openDoc)));
    document.querySelectorAll('[data-visualize-doc]').forEach(el=>el.onclick=()=>visualizeDocument(state.documents.find(d=>d.id===el.dataset.visualizeDoc)));
    document.querySelectorAll('[data-download-doc]').forEach(el=>el.onclick=()=>downloadDocument(state.documents.find(d=>d.id===el.dataset.downloadDoc)));
  };}

  if(typeof openReq==='function'){
    const originalOpenReq=openReq;
    openReq=function(id,rid){
      const o=state.opportunities.find(x=>x.id===id),q=(o?.requirements||[]).find(x=>x.id===rid);
      if(!q||q.type!=='document')return originalOpenReq(id,rid);
      const candidates=state.documents.filter(d=>matchesRequirement(d,q));
      const best=candidates.find(d=>d.status==='ready')||candidates.find(d=>d.status==='located')||candidates[0];
      const existing=best?`<div class="existing-doc-label">Versión que ya tenemos</div><div class="existing-doc-card truthful"><div class="doc-list-main">${honestFileMark(best)}<span><b>${esc(best.name)}</b><small>${esc(labelFor(best))}</small></span></div>${canOpen(best)?`<div class="doc-list-actions"><button id="visualize-existing">Visualizar</button><button id="download-existing">Descargar</button></div>`:'<button id="open-existing">Ver</button>'}</div>`:`<div class="empty compact-empty"><b>Todavía no lo tenemos</b><span>No hay un documento equivalente guardado.</span></div>`;
      openModal(`<h2>${esc(q.label)}</h2>${existing}<button class="button primary full" id="upload-new-version">${best?'Subir versión nueva':'Subir archivo'}</button>`);
      const viz=document.querySelector('#visualize-existing');if(viz)viz.onclick=()=>visualizeDocument(best);
      const dl=document.querySelector('#download-existing');if(dl)dl.onclick=()=>downloadDocument(best);
      const ex=document.querySelector('#open-existing');if(ex)ex.onclick=()=>openDoc(best);
      document.querySelector('#upload-new-version').onclick=()=>{modal.close();document.querySelector('#file-input').click()};
    };
  }

  if(typeof render==='function')render();
})();
