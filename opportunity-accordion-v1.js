(() => {
  if(typeof state==='undefined')return;

  const requirementState=q=>q.state==='ready'?'Listo':'Por hacer';
  const requirementIcon=q=>q.state==='ready'?'✓':'›';
  const fact=(label,value)=>value?`<div style="min-width:0"><span style="display:block;color:#718078;font-size:12px;margin-bottom:4px">${esc(label)}</span><strong style="display:block;font-size:15px;line-height:1.25">${esc(value)}</strong></div>`:'';
  const linkedDoc=q=>(state.documents||[]).find(d=>d?.status==='ready'&&d?.storagePath&&window.postulaDocumentMatch?.(d,q));
  const trashIcon=()=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8v9m4-9v9m4-9v9M5 5h14M9 5V3h6v2m-9 0 1 16h10l1-16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const requirementDetails=(o,q)=>{
    const done=q.state==='ready',doc=q.type==='document'?linkedDoc(q):null;
    const role=doc?(window.postulaDocumentRoleLabel?.(doc.documentRole)||'documento'):'';
    const action=q.type==='document'
      ? doc
        ? `<div class="opp-linked-doc-actions"><button type="button" class="button soft" data-view-doc="${esc(doc.id)}">Visualizar ${esc(role)}</button><button type="button" class="opp-linked-doc-trash" data-delete-doc="${esc(doc.id)}" aria-label="Eliminar ${esc(doc.name)}" title="Eliminar documento">${trashIcon()}</button></div>`
        : `<button type="button" class="button soft" data-action="req" data-id="${esc(o.id)}" data-req="${esc(q.id)}">${esc(q.actionLabel||'Abrir / subir documento')}</button>`
      : `<button type="button" class="button ${done?'soft':'primary'}" data-requirement-done="${esc(q.id)}" data-opportunity="${esc(o.id)}">${done?'Marcar por hacer':'Marcar listo'}</button>`;
    return `<details class="opp-req-accordion" style="border:1px solid #dfe8e3;border-radius:16px;background:#fff;margin:0 0 10px;overflow:hidden">
      <summary style="list-style:none;cursor:pointer;padding:16px 18px;display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:10px;align-items:center">
        <span style="width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:${done?'#e8f5ee':'#f7f2e8'};font-weight:800;color:${done?'#16764a':'#9a6b24'}">${requirementIcon(q)}</span>
        <strong style="font-size:15px;line-height:1.3">${esc(q.label)}</strong>
        <span style="font-size:12px;color:#738078">${requirementState(q)}</span>
      </summary>
      <div style="padding:0 18px 17px 56px;border-top:1px solid #edf2ef">
        <p style="margin:14px 0 14px;color:#56655e;line-height:1.55;max-width:760px">${esc(q.help||'')}</p>
        ${doc?`<div class="existing-doc-label" style="margin-bottom:8px">${esc(role||q.label)} · ${esc(doc.name)}</div>`:''}
        ${action}
      </div>
    </details>`;
  };

  oppPage=function(id){
    const o=state.opportunities.find(x=>x.id===id);
    if(!o)return `<section class="page"><h1>No encontrada</h1></section>`;
    sync(o);
    const req=o.requirements||[];
    req.forEach(q=>{if(q.type==='document')q.state=linkedDoc(q)?'ready':'action'});
    const ready=req.filter(x=>x.state==='ready').length;
    const todo=req.length-ready;
    const next=req.find(x=>x.state!=='ready');
    return `<section class="page">
      <a class="back-link" href="#opportunities">‹ Oportunidades</a>
      <div class="opp-hero" style="padding-bottom:18px">
        <h1>${esc(o.title)}</h1>
        <div class="opp-place">${esc(o.country||'')}${o.city?` · ${esc(o.city)}`:''}</div>
        <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:18px;padding:16px;border:1px solid #dfe8e3;border-radius:16px;background:#fff">
          ${fact('Deadline',o.deadline?fmt(o.deadline):'Por confirmar')}
          ${fact('Duración',o.duration||'')}
          ${fact('Financiación',o.funding||'')}
          ${fact('Lugar',o.city||o.country||'')}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
          <div class="state-strip" style="display:block;padding:14px 16px"><b style="font-size:22px">${ready}</b><small style="display:block">Listo</small></div>
          <div class="state-strip" style="display:block;padding:14px 16px"><b style="font-size:22px">${todo}</b><small style="display:block">Por hacer</small></div>
        </div>
        ${next?`<div style="margin-top:12px;padding:15px 18px;border:1px solid #cfe2d7;border-radius:16px;background:#f6fbf8"><span style="display:block;text-transform:uppercase;letter-spacing:.04em;font-size:11px;font-weight:800;color:#198754;margin-bottom:4px">Siguiente paso</span><strong>${esc(next.label)}</strong></div>`:''}
      </div>

      <div style="margin:16px 0 18px">
        <h2 style="font-size:16px;margin:0 0 7px">Por qué puede interesar</h2>
        <p style="margin:0;color:#5d6c65;line-height:1.55">${esc(o.why||'')}</p>
      </div>

      <div style="margin:18px 0 10px">
        <h2 style="font-size:16px;margin:0 0 10px">Qué hay que hacer</h2>
        ${req.map(q=>requirementDetails(o,q)).join('')}
      </div>

      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:18px">
        <select data-action="status" data-id="${esc(o.id)}">${['new','considering','preparing','submitted','closed'].map(s=>`<option value="${s}" ${o.status===s?'selected':''}>${statuses[s]||s}</option>`).join('')}</select>
        ${o.sourceUrl?`<a href="${esc(o.sourceUrl)}" target="_blank" rel="noopener">Página oficial ↗</a>`:''}
      </div>
      ${o.notes?`<p style="margin-top:14px;color:#68776f;line-height:1.5">${esc(o.notes)}</p>`:''}
    </section>`;
  };

  const priorBind=bind;
  bind=function(){
    priorBind();
    document.querySelectorAll('[data-requirement-done]').forEach(btn=>{
      btn.onclick=e=>{
        e.preventDefault();e.stopPropagation();
        const o=state.opportunities.find(x=>x.id===btn.dataset.opportunity);
        const q=(o?.requirements||[]).find(x=>x.id===btn.dataset.requirementDone);
        if(!q)return;
        q.state=q.state==='ready'?'action':'ready';
        save();render();
      };
    });
  };

  render();
})();