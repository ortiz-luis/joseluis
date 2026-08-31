(() => {
  const deadlineLabel=o=>o.deadline?fmt(o.deadline):'Por confirmar';
  const deadlineKey=o=>o.deadline||'9999-12-31';
  oppsPage=function(){
    const list=state.opportunities
      .filter(o=>filter==='all'||o.status===filter)
      .sort((a,b)=>deadlineKey(a).localeCompare(deadlineKey(b))||String(a.title||'').localeCompare(String(b.title||'')));
    const header=`<div class="opp-list-head" style="display:grid;grid-template-columns:minmax(0,1fr) 150px 110px 24px;gap:16px;align-items:center;padding:0 18px 8px;color:#6c7a73;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em"><span>Oportunidad</span><span>Deadline</span><span>Prioridad</span><span></span></div>`;
    const rows=list.map(o=>`<a class="app-row" href="#opportunity/${o.id}" style="display:grid;grid-template-columns:minmax(0,1fr) 150px 110px 24px;gap:16px;align-items:center"><div><strong>${esc(o.title)}</strong><span>${esc(o.country)}</span></div><div class="opp-deadline" style="font-weight:700;white-space:nowrap">${esc(deadlineLabel(o))}</div><div><span class="mini-priority">${esc(o.priority||statuses[o.status]||'')}</span></div><b>›</b></a>`).join('');
    return `<section class="page"><div class="page-head compact"><h1>Oportunidades</h1><button class="circle-action" data-action="add-opp">+</button></div><div class="filters compact-filters">${[['all','Todas'],['preparing','Preparando'],['considering','Mirando'],['submitted','Enviadas']].map(([k,l])=>`<button class="pill ${filter===k?'active':''}" data-filter="${k}">${l}</button>`).join('')}</div><div class="app-list">${header}${rows}</div></section>`;
  };
  render();
})();