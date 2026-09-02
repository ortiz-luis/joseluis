(() => {
  if(typeof state==='undefined')return;
  const currentUser=()=>window.postulaAuth?.getSession?.()?.user||null;
  const addDesktopExtras=()=>{
    const navEl=document.querySelector('#desktop-nav');
    if(!navEl||navEl.dataset.productV2)return;
    navEl.dataset.productV2='1';
    const extra=document.createElement('div');extra.className='product-desktop-extra';
    extra.innerHTML='<a href="cv-builder/">▤ <span>CV y cartas</span></a><a href="#profile">⚙ <span>Configuración</span></a>';
    navEl.insertAdjacentElement('afterend',extra);
  };
  const ensureDrawer=()=>{
    if(document.querySelector('.ui-drawer'))return;
    const top=document.querySelector('.topbar');
    if(top){const b=document.createElement('button');b.className='ui-drawer-button';b.type='button';b.setAttribute('aria-label','Abrir menú');b.textContent='☰';top.prepend(b)}
    const back=document.createElement('div');back.className='ui-drawer-backdrop';document.body.appendChild(back);
    const d=document.createElement('aside');d.className='ui-drawer';
    d.innerHTML='<div class="drawer-brand"><span class="brand-mark small">P</span><strong>Postulaciones Joseluis</strong></div><nav class="drawer-links"><a href="#home">⌂ <span>Inicio</span></a><a href="#opportunities">▢ <span>Oportunidades</span></a><a href="#documents">▣ <span>Documentos</span></a><a href="cv-builder/">▤ <span>CV y cartas</span></a><a href="#profile">⚙ <span>Cuenta y configuración</span></a></nav><div class="drawer-divider"></div><div class="drawer-account">Espacio compartido · Postulaciones Joseluis</div>';
    document.body.appendChild(d);
    const close=()=>{d.classList.remove('open');back.classList.remove('open')};
    document.querySelector('.ui-drawer-button')?.addEventListener('click',()=>{d.classList.add('open');back.classList.add('open')});
    back.addEventListener('click',close);d.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  };
  const progressFor=o=>{const req=o?.requirements||[];if(!req.length)return 0;const n=req.filter(q=>q.state==='ready').length;return Math.round(100*n/req.length)};
  homePage=function(){
    const active=state.opportunities.filter(o=>o.status!=='closed'&&o.status!=='excluded'&&o.priority!=='No elegible');
    const dated=active.filter(o=>o.deadline&&days(o.deadline)>=0).sort((a,b)=>a.deadline.localeCompare(b.deadline));
    const next=dated[0]||active[0];
    const after=(dated.length?dated.slice(1,3):active.filter(o=>o!==next).slice(0,2));
    const pct=progressFor(next);
    const deadline=next?.deadline?`Vence en ${Math.max(0,days(next.deadline))} días`:'Deadline por confirmar';
    const nextReq=(next?.requirements||[]).find(q=>q.state!=='ready');
    return `<section class="page home-v2"><h1 class="home-title">Buenos días, Joseluis</h1><p class="home-kicker">Todo está bajo control</p>${next?`<h2>Lo siguiente</h2><a class="home-focus-card" href="#opportunity/${esc(next.id)}"><span class="home-focus-icon">◉</span><span><strong>${esc(next.title)}</strong><small>${esc(nextReq?.label||'Revisar candidatura')}</small><div class="home-progress"><span style="width:${pct}%"></span></div></span><span class="home-date">${esc(deadline)}</span></a>`:''}${after.length?`<h2>Después</h2><div class="home-after">${after.map(o=>{const q=(o.requirements||[]).find(x=>x.state!=='ready');const dl=o.deadline?`Vence en ${Math.max(0,days(o.deadline))} días`:'Fecha por confirmar';return `<a href="#opportunity/${esc(o.id)}"><span class="dot">◉</span><span><strong>${esc(q?.label||o.title)}</strong><small>${esc(dl)}</small></span><span>›</span></a>`}).join('')}</div>`:''}</section>`;
  };
  const priorRender=render;
  render=function(){priorRender();addDesktopExtras();ensureDrawer()};
  addDesktopExtras();ensureDrawer();render();
})();