(() => {
  const SORT_KEY='postula-opportunity-sort-v1';
  let opportunitySort=localStorage.getItem(SORT_KEY)||'deadline';
  const deadlineLabel=o=>o.deadline?fmt(o.deadline):'Por confirmar';
  const deadlineKey=o=>o.deadline||'9999-12-31';
  const visibleOpportunity=o=>o.status!=='closed'&&o.status!=='excluded'&&o.priority!=='No elegible';
  const interestScore=o=>{
    const manual=Number(o.interestRating);
    if(Number.isInteger(manual)&&manual>=1&&manual<=5)return manual;
    const p=String(o.priority||'').toLowerCase();
    if(p.includes('muy alta'))return 5;
    if(p==='alta'||p.includes('alta'))return 4;
    if(p.includes('media'))return 3;
    if(p.includes('plan b'))return 2;
    if(p.includes('baja'))return 2;
    return 3;
  };
  const stars=o=>{
    const n=interestScore(o);
    return `<span class="interest-stars editable" role="radiogroup" aria-label="Interés de ${esc(o.title)}">${[1,2,3,4,5].map(i=>`<button type="button" class="interest-star ${i<=n?'filled':'empty'}" data-interest-id="${esc(o.id)}" data-interest-value="${i}" role="radio" aria-checked="${i===n?'true':'false'}" aria-label="${i} de 5 estrellas" title="${i} de 5">★</button>`).join('')}</span>`;
  };
  const compare=(a,b)=>{
    if(opportunitySort==='interest')return interestScore(b)-interestScore(a)||deadlineKey(a).localeCompare(deadlineKey(b))||String(a.title||'').localeCompare(String(b.title||''));
    return deadlineKey(a).localeCompare(deadlineKey(b))||interestScore(b)-interestScore(a)||String(a.title||'').localeCompare(String(b.title||''));
  };
  const sortControls=()=>`<div class="opportunity-sort" aria-label="Ordenar oportunidades"><span>Ordenar</span><button type="button" class="sort-pill ${opportunitySort==='deadline'?'active':''}" data-opportunity-sort="deadline">Deadline</button><button type="button" class="sort-pill ${opportunitySort==='interest'?'active':''}" data-opportunity-sort="interest">Interés</button></div>`;
  oppsPage=function(){
    const list=state.opportunities
      .filter(o=>visibleOpportunity(o)&&(filter==='all'||o.status===filter))
      .sort(compare);
    const header=`<div class="opp-list-head opportunity-grid"><span>Oportunidad</span><span>Interés</span><span>Deadline</span><span></span></div>`;
    const rows=list.map(o=>`<a class="app-row opportunity-grid" href="#opportunity/${o.id}"><div><strong>${esc(o.title)}</strong><span>${esc(o.country)}</span></div><div class="opp-interest">${stars(o)}</div><div class="opp-deadline">${esc(deadlineLabel(o))}</div><b>›</b></a>`).join('');
    return `<section class="page"><div class="page-head compact"><h1>Oportunidades</h1><button class="circle-action" data-action="add-opp">+</button></div><div class="opportunity-toolbar"><div class="filters compact-filters">${[['all','Todas'],['preparing','Preparando'],['considering','Mirando'],['submitted','Enviadas']].map(([k,l])=>`<button class="pill ${filter===k?'active':''}" data-filter="${k}">${l}</button>`).join('')}</div>${sortControls()}</div><div class="app-list">${header}${rows}</div></section>`;
  };

  document.addEventListener('click',e=>{
    const star=e.target.closest?.('[data-interest-value]');
    if(star){
      e.preventDefault();e.stopPropagation();
      const o=state.opportunities.find(x=>x.id===star.dataset.interestId);
      if(!o)return;
      o.interestRating=Math.max(1,Math.min(5,Number(star.dataset.interestValue)||3));
      save();render();return;
    }
    const sort=e.target.closest?.('[data-opportunity-sort]');
    if(sort){
      e.preventDefault();e.stopPropagation();
      opportunitySort=sort.dataset.opportunitySort==='interest'?'interest':'deadline';
      localStorage.setItem(SORT_KEY,opportunitySort);
      render();
    }
  },true);
  render();
})();