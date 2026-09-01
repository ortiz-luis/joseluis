(() => {
  const deadlineLabel=o=>o.deadline?fmt(o.deadline):'Por confirmar';
  const deadlineKey=o=>o.deadline||'9999-12-31';
  const visibleOpportunity=o=>o.status!=='closed'&&o.status!=='excluded'&&o.priority!=='No elegible';
  const interestScore=o=>{
    const p=String(o.priority||'').toLowerCase();
    if(p.includes('muy alta'))return 5;
    if(p==='alta'||p.includes('alta'))return 4;
    if(p.includes('media'))return 3;
    if(p.includes('plan b'))return 2;
    if(p.includes('baja'))return 2;
    return 3;
  };
  const stars=o=>{const n=interestScore(o);return `<span class="interest-stars" aria-label="Interés ${n} de 5" title="Interés ${n} de 5"><span class="filled">${'★'.repeat(n)}</span><span class="empty">${'★'.repeat(5-n)}</span></span>`};
  oppsPage=function(){
    const list=state.opportunities
      .filter(o=>visibleOpportunity(o)&&(filter==='all'||o.status===filter))
      .sort((a,b)=>deadlineKey(a).localeCompare(deadlineKey(b))||String(a.title||'').localeCompare(String(b.title||'')));
    const header=`<div class="opp-list-head opportunity-grid"><span>Oportunidad</span><span>Interés</span><span>Deadline</span><span></span></div>`;
    const rows=list.map(o=>`<a class="app-row opportunity-grid" href="#opportunity/${o.id}"><div><strong>${esc(o.title)}</strong><span>${esc(o.country)}</span></div><div class="opp-interest">${stars(o)}</div><div class="opp-deadline">${esc(deadlineLabel(o))}</div><b>›</b></a>`).join('');
    return `<section class="page"><div class="page-head compact"><h1>Oportunidades</h1><button class="circle-action" data-action="add-opp">+</button></div><div class="filters compact-filters">${[['all','Todas'],['preparing','Preparando'],['considering','Mirando'],['submitted','Enviadas']].map(([k,l])=>`<button class="pill ${filter===k?'active':''}" data-filter="${k}">${l}</button>`).join('')}</div><div class="app-list">${header}${rows}</div></section>`;
  };
  render();
})();