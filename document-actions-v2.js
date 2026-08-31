(() => {
  const RAW='https://github.com/ortiz-luis/joseluis-private-data/raw/refs/heads/main/';
  const VIEW='https://github.com/ortiz-luis/joseluis-private-data/blob/main/';
  const paths={
    'gmail-cv-es-v3':'documents/cv/CV_Moraga_Joseluis_ES_v3_2022.pdf',
    'gmail-cv-fr-v3':'documents/cv/CV_Moraga_Joseluis_FR_v3_2022.pdf',
    'gmail-motivation-es':'documents/motivation/Carta_Moraga_Joseluis_ES_v3_2022.pdf',
    'gmail-motivation-fr':'documents/motivation/Lettre_Moraga_Joseluis_FR_v3_2022.pdf',
    'gmail-passport':'documents/identity/Pasaporte_2022.pdf',
    'gmail-sciencespo-admission':'documents/international/Admission_MORAGA_2022.pdf',
    'gmail-ufro-mobility':'documents/international/UFRO_Mobility_Funding_2022.pdf',
    'gmail-sciencespo-dossier':'documents/applications/Dossier_FSI_MAJ_2021-2022_completo.doc'
  };
  const enc=p=>p.split('/').map(encodeURIComponent).join('/');
  const urls=d=>{const p=paths[d?.id];return p?{view:VIEW+enc(p),download:RAW+enc(p)}:null};
  const label=d=>d?.status==='located'?`${d.sourceYear||'Histórico'}${d.needsUpdate?' · actualizar':''}`:(d?.sourceYear||'Pendiente');
  const mark=d=>{const n=(d?.name||'').toLowerCase();return n.endsWith('.pdf')?'PDF':(n.endsWith('.doc')||n.endsWith('.docx'))?'DOC':d?.category==='CV'?'CV':'DOC'};
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
  const actionButtons=d=>{const u=urls(d);if(!u)return '<span class="doc-list-action">Ver</span>';return `<div class="doc-list-actions"><a href="${esc(u.view)}" target="_blank" rel="noopener">Visualizar</a><a href="${esc(u.download)}" target="_blank" rel="noopener">Descargar</a></div>`};

  docsPage=function(){
    const cats=['CV','Estudios','Idiomas','Recomendaciones','Muestras','Otros'];
    const counts=Object.fromEntries(cats.map(c=>[c,state.documents.filter(d=>d.category===c).length]));
    const docs=docFilter==='all'?[]:state.documents.filter(d=>d.category===docFilter);
    return `<section class="page"><div class="page-head compact"><h1>Documentos</h1><button class="circle-action" data-action="upload">+</button></div><div class="wallet-list">${cats.map(c=>`<button class="wallet-row ${docFilter===c?'active':''}" data-docfilter="${c}"><span>${icon(c)}</span><strong>${c}</strong><b>${counts[c]||0}</b><i>›</i></button>`).join('')}</div>${docFilter!=='all'?`<div class="doc-items">${docs.map(d=>`<div class="doc-item"><div class="doc-list-main"><span class="real-file-mark">${mark(d)}</span><div><strong>${esc(d.name)}</strong><span>${esc(label(d))}</span></div></div>${actionButtons(d)}</div>`).join('')||'<div class="empty">Sin documentos</div>'}</div>`:''}</section>`;
  };

  openReq=function(id,rid){
    const o=state.opportunities.find(x=>x.id===id),q=(o?.requirements||[]).find(x=>x.id===rid);
    if(!q)return;
    if(q.type!=='document'){
      openModal(`<h2>${esc(q.label)}</h2><p class="small-note">${q.state==='easy'?'Podemos resolver esto rápidamente.':'Todavía hay que resolver este punto.'}</p>`);
      return;
    }
    const candidates=state.documents.filter(d=>matches(d,q));
    const best=candidates.find(d=>d.status==='ready')||candidates.find(d=>d.status==='located')||candidates[0];
    const u=best?urls(best):null;
    const existing=best?`<div class="existing-doc-label">Versión que ya tenemos</div><div class="existing-doc-card truthful"><div class="doc-list-main"><span class="real-file-mark">${mark(best)}</span><span><b>${esc(best.name)}</b><small>${esc(label(best))}</small></span></div>${u?`<div class="doc-list-actions"><a href="${esc(u.view)}" target="_blank" rel="noopener">Visualizar</a><a href="${esc(u.download)}" target="_blank" rel="noopener">Descargar</a></div>`:'<span class="doc-list-action">Ver</span>'}</div>`:`<div class="empty compact-empty"><b>Todavía no lo tenemos</b><span>No hay un documento equivalente guardado.</span></div>`;
    openModal(`<h2>${esc(q.label)}</h2>${existing}<button class="button primary full" id="upload-new-version">${best?'Subir versión nueva':'Subir archivo'}</button>`);
    document.querySelector('#upload-new-version').onclick=()=>{document.querySelector('#modal').close();document.querySelector('#file-input').click()};
  };

  const priorBind=bind;
  bind=function(){priorBind();};
  render();
})();
