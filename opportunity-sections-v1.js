(() => {
  if(typeof state==='undefined')return;
  const usable=d=>d?.status==='ready'&&!!d?.storagePath;
  const match=(d,q)=>window.postulaDocumentMatch?.(d,q);
  const getOpp=id=>state.opportunities.find(o=>o.id===id);
  const tabs=(o,active)=>`<nav class="opp-section-tabs"><a class="${active==='summary'?'active':''}" href="#opportunity/${o.id}">Resumen</a><a class="${active==='tasks'?'active':''}" href="#opportunity-tasks/${o.id}">Tareas</a><a class="${active==='documents'?'active':''}" href="#opportunity-documents/${o.id}">Documentos</a><a class="${active==='info'?'active':''}" href="#opportunity-info/${o.id}">Info</a></nav>`;
  const head=o=>`<a class="final-back" href="#opportunities">‹ Oportunidades</a><div class="opp-section-head"><h1>${esc(o.title)}</h1><p>${esc(o.country||'')}${o.city?` · ${esc(o.city)}`:''}</p></div>`;
  const linked=q=>(state.documents||[]).find(d=>usable(d)&&match(d,q));
  const guidance=(o,q)=>window.postulaRequirementGuidance?.(o,q)||{advice:q.help||'Guarda el mejor respaldo que tengas ahora y vuelve a este punto más adelante.'};

  function tasksPage(o){
    const req=o.requirements||[];
    return `<section class="page final-page opportunity-section">${head(o)}${tabs(o,'tasks')}<div class="section-meta"><span>${statuses[o.status]||o.status||''}</span>${o.deadline?`<small>Cierre: ${fmt(o.deadline)}</small>`:''}</div><div class="info-note" style="margin-bottom:14px"><h2>Preparar sin presión</h2><p>No necesitas cerrar cada requisito hoy. Puedes subir un respaldo provisional, consultar una alternativa oficial y mejorar el dossier después.</p></div><div class="task-list-final">${req.map(q=>{const d=linked(q),ready=q.state==='ready'||!!d,g=guidance(o,q);return `<div class="task-final ${ready?'done':''}"><span class="task-check">${ready?'✓':'○'}</span><div><b>${esc(q.label)}</b><small>${esc(g.advice||q.help||'')}</small>${g.url?`<a href="${esc(g.url)}" target="_blank" rel="noopener" style="display:inline-flex;margin-top:6px;font-size:12px;font-weight:700;color:#15784d">${esc(g.label||'Ver requisito oficial')} ↗</a>`:''}</div><div class="task-actions">${d?`<button data-view-doc="${esc(d.id)}">Ver respaldo</button>`:`<button data-action="req" data-id="${esc(o.id)}" data-req="${esc(q.id)}">Subir respaldo</button>`}${q.type!=='document'&&!d?`<button data-requirement-done="${esc(q.id)}" data-opportunity="${esc(o.id)}">${ready?'Reabrir':'Resolver sin archivo'}</button>`:''}</div></div>`}).join('')}</div></section>`
  }

  function documentsPage(o){
    const qs=o.requirements||[];
    return `<section class="page final-page opportunity-section">${head(o)}${tabs(o,'documents')}<div class="info-note" style="margin-bottom:14px"><h2>Respaldos del dossier</h2><p>Aquí pueden vivir tanto documentos formales como certificados, capturas, comprobaciones o borradores que te ayuden a demostrar y organizar cada requisito.</p></div><div class="final-list">${qs.map(q=>{const d=linked(q);return `<div class="final-row"><span class="file-token">▤</span><span><b>${esc(q.label)}</b><small>${d?esc(d.name):'Sin respaldo todavía'}</small></span><div class="row-actions">${d?`<button data-view-doc="${esc(d.id)}">Ver</button><button class="tiny-trash" data-delete-doc="${esc(d.id)}" aria-label="Eliminar respaldo">⌫</button>`:`<button data-action="req" data-id="${esc(o.id)}" data-req="${esc(q.id)}">Subir respaldo</button>`}</div></div>`}).join('')||'<div class="empty">Esta oportunidad todavía no tiene requisitos definidos</div>'}</div></section>`
  }

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
  };
  render();
})();