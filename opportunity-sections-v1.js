(() => {
  if(typeof state==='undefined')return;
  const usable=d=>d?.status==='ready'&&!!d?.storagePath;
  const match=(d,q)=>window.postulaDocumentMatch?.(d,q);
  const getOpp=id=>state.opportunities.find(o=>o.id===id);
  const tabs=(o,active)=>`<nav class="opp-section-tabs"><a class="${active==='summary'?'active':''}" href="#opportunity/${o.id}">Resumen</a><a class="${active==='tasks'?'active':''}" href="#opportunity-tasks/${o.id}">Tareas</a><a class="${active==='documents'?'active':''}" href="#opportunity-documents/${o.id}">Documentos</a><a class="${active==='info'?'active':''}" href="#opportunity-info/${o.id}">Info</a></nav>`;
  const head=o=>`<a class="final-back" href="#opportunities">‹ Oportunidades</a><div class="opp-section-head"><h1>${esc(o.title)}</h1><p>${esc(o.country||'')}${o.city?` · ${esc(o.city)}`:''}</p></div>`;
  const linked=(q)=>(state.documents||[]).find(d=>usable(d)&&match(d,q));

  function tasksPage(o){const req=o.requirements||[];return `<section class="page final-page opportunity-section">${head(o)}${tabs(o,'tasks')}<div class="section-meta"><span>${statuses[o.status]||o.status||''}</span>${o.deadline?`<small>Cierre: ${fmt(o.deadline)}</small>`:''}</div><div class="task-list-final">${req.map(q=>{const d=q.type==='document'?linked(q):null;const ready=q.type==='document'?!!d:q.state==='ready';return `<div class="task-final ${ready?'done':''}"><span class="task-check">${ready?'✓':'○'}</span><div><b>${esc(q.label)}</b>${q.help?`<small>${esc(q.help)}</small>`:''}</div><div class="task-actions">${q.type==='document'?(d?`<button data-view-doc="${esc(d.id)}">Ver</button>`:`<button data-action="req" data-id="${esc(o.id)}" data-req="${esc(q.id)}">Añadir</button>`):`<button data-requirement-done="${esc(q.id)}" data-opportunity="${esc(o.id)}">${ready?'Reabrir':'Listo'}</button>`}</div></div>`}).join('')}</div></section>`}

  function documentsPage(o){const qs=(o.requirements||[]).filter(q=>q.type==='document');return `<section class="page final-page opportunity-section">${head(o)}${tabs(o,'documents')}<div class="final-list">${qs.map(q=>{const d=linked(q);return `<div class="final-row"><span class="file-token">▤</span><span><b>${esc(q.label)}</b><small>${d?esc(d.name):'Por subir'}</small></span><div class="row-actions">${d?`<button data-view-doc="${esc(d.id)}">Ver</button><button class="tiny-trash" data-delete-doc="${esc(d.id)}">⌫</button>`:`<button data-action="req" data-id="${esc(o.id)}" data-req="${esc(q.id)}">Añadir</button>`}</div></div>`}).join('')||'<div class="empty">Esta oportunidad no tiene documentos específicos</div>'}</div></section>`}

  function infoPage(o){return `<section class="page final-page opportunity-section">${head(o)}${tabs(o,'info')}<div class="info-grid-final"><div><span>Lugar</span><b>${esc(o.city||o.country||'Por confirmar')}</b></div><div><span>Duración</span><b>${esc(o.duration||'Por confirmar')}</b></div><div><span>Financiación</span><b>${esc(o.funding||'Por confirmar')}</b></div><div><span>Deadline</span><b>${esc(o.deadline?fmt(o.deadline):'Por confirmar')}</b></div></div>${o.why?`<div class="info-note"><h2>Por qué puede interesar</h2><p>${esc(o.why)}</p></div>`:''}${o.notes?`<div class="info-note"><h2>Notas</h2><p>${esc(o.notes)}</p></div>`:''}${o.sourceUrl?`<a class="official-final" href="${esc(o.sourceUrl)}" target="_blank" rel="noopener">Abrir página oficial ↗</a>`:''}</section>`}

  const oldOpp=oppPage;
  oppPage=function(id){const html=oldOpp(id);const o=getOpp(id);return o?html.replace('<div class="opp-hero"',`${tabs(o,'summary')}<div class="opp-hero"`):html};

  const priorRender=render;
  render=function(){
    priorRender();
    const r=route(),o=getOpp(r.id);
    if(o&&['opportunity-tasks','opportunity-documents','opportunity-info'].includes(r.page)){
      const main=document.querySelector('#main');
      main.innerHTML=r.page==='opportunity-tasks'?tasksPage(o):r.page==='opportunity-documents'?documentsPage(o):infoPage(o);
      bind();
    }
    const drawer=document.querySelector('.ui-drawer .drawer-links');
    if(drawer&&!drawer.dataset.finalized){drawer.dataset.finalized='1';drawer.innerHTML='<a href="#home">⌂ <span>Inicio</span></a><a href="#opportunities">▣ <span>Oportunidades</span></a><a href="#documents">▤ <span>Documentos</span></a><a href="#create">▧ <span>CV y cartas</span></a><a href="#templates">⌘ <span>Plantillas</span></a><a href="#recent">◷ <span>Recientes</span></a><a href="#settings">⚙ <span>Configuración</span></a><a href="#profile">♙ <span>Cuenta</span></a>';drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('.ui-drawer')?.classList.remove('open');document.querySelector('.ui-drawer-backdrop')?.classList.remove('open')}))}
  };
  render();
})();