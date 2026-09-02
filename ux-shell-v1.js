(()=>{
 const RECENTS_KEY='joseluis-ux-recents-v1';
 const labels={home:'Inicio',opportunities:'Oportunidades',opportunity:'Oportunidad',documents:'Documentos',create:'CV y cartas',templates:'Plantillas',profile:'Perfil',settings:'Configuración'};
 const $=s=>document.querySelector(s);
 const mobile=()=>window.matchMedia('(max-width:820px)').matches;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
 function route(){const [page='home',id]=location.hash.replace(/^#/,'').split('/');return {page:page||'home',id}}
 function state(){try{return JSON.parse(localStorage.getItem('joseluis-portal-v3')||'{}')}catch{return {}}}
 function titleForHash(hash){const [page,id]=hash.replace(/^#/,'').split('/');const s=state();if(page==='opportunity'&&id){const o=(s.opportunities||[]).find(x=>x.id===id);return o?.title||'Oportunidad'}return labels[page]||'Inicio'}
 function getRecents(){try{return JSON.parse(localStorage.getItem(RECENTS_KEY)||'[]')}catch{return []}}
 function setRecents(items){localStorage.setItem(RECENTS_KEY,JSON.stringify(items.slice(0,7)))}
 function track(){const h=location.hash||'#home';const r=route();if(['home','profile','settings','recent'].includes(r.page))return;const item={hash:h,title:titleForHash(h),t:Date.now()};setRecents([item,...getRecents().filter(x=>x.hash!==h)])}
 function collapse(){if(mobile()){document.body.classList.remove('ux-drawer-open')}else{document.body.classList.add('ux-desktop-collapsed')}syncAria()}
 function expand(){if(mobile()){document.body.classList.add('ux-drawer-open');setTimeout(()=>$('#ux-search-input')?.focus(),60)}else{document.body.classList.remove('ux-desktop-collapsed')}syncAria()}
 function syncAria(){const b=$('.ux-menu');if(!b)return;const expanded=mobile()?document.body.classList.contains('ux-drawer-open'):!document.body.classList.contains('ux-desktop-collapsed');b.setAttribute('aria-expanded',String(expanded))}
 function renderRecents(){const box=$('#ux-recents');if(!box)return;const items=getRecents();box.innerHTML=items.length?items.map(x=>`<a class="ux-recent" href="${esc(x.hash)}">${esc(x.title)}</a>`).join(''):'<div class="ux-recent-empty">Todavía no hay elementos recientes</div>'}
 function searchData(q){const s=state(),needle=q.trim().toLowerCase();if(!needle)return[];const base=[{title:'Inicio',meta:'Sección',hash:'#home'},{title:'Oportunidades',meta:'Sección',hash:'#opportunities'},{title:'Documentos',meta:'Sección',hash:'#documents'},{title:'CV y cartas',meta:'Sección',hash:'#create'},{title:'Plantillas',meta:'Sección',hash:'#templates'}];const opps=(s.opportunities||[]).map(o=>({title:o.title,meta:[o.institution,o.country,o.city].filter(Boolean).join(' · '),hash:`#opportunity/${o.id}`}));const docs=(s.documents||[]).map(d=>({title:d.name||'Documento',meta:['Documento',d.category].filter(Boolean).join(' · '),hash:'#documents'}));return [...base,...opps,...docs].filter(x=>(`${x.title} ${x.meta}`).toLowerCase().includes(needle)).slice(0,12)}
 function renderResults(){const input=$('#ux-search-input'),box=$('#ux-results');if(!input||!box)return;const q=input.value,rows=searchData(q);if(!q.trim()){box.classList.remove('open');box.innerHTML='';return}box.classList.add('open');box.innerHTML=rows.length?rows.map(x=>`<a class="ux-result" href="${esc(x.hash)}"><strong>${esc(x.title)}</strong><span>${esc(x.meta)}</span></a>`).join(''):'<div class="ux-no-results">Sin resultados</div>'}
 function refreshTitle(){const el=$('.ux-page-title');if(el)el.textContent=titleForHash(location.hash||'#home')}
 function build(){
  const sidebar=$('.sidebar'),topbar=$('.topbar');if(!sidebar||!topbar||sidebar.dataset.uxReady)return;sidebar.dataset.uxReady='1';
  const brand=sidebar.querySelector('.brand'),nav=sidebar.querySelector('#desktop-nav'),foot=sidebar.querySelector('.sidebar-foot');
  const head=document.createElement('div');head.className='ux-sidebar-head';if(brand)head.appendChild(brand);head.insertAdjacentHTML('beforeend','<button class="ux-close" type="button" aria-label="Ocultar barra lateral">◧</button>');sidebar.prepend(head);
  const search=document.createElement('div');search.innerHTML='<label class="ux-search"><span>⌕</span><input id="ux-search-input" type="search" placeholder="Buscar" autocomplete="off" aria-label="Buscar en todo el portal"></label><div id="ux-results" class="ux-results"></div>';head.after(search);
  if(nav){nav.insertAdjacentHTML('afterend','<div class="ux-section-label">Recientes</div><div id="ux-recents" class="ux-recents"></div>')}
  if(foot){foot.innerHTML='<a class="ux-account" href="#profile"><span class="ux-account-avatar">JL</span><span>José Luis</span></a>'}
  topbar.innerHTML='<div class="ux-topbar-left"><button class="ux-menu" type="button" aria-label="Mostrar barra lateral" aria-expanded="true">☰</button><span class="ux-page-title"></span></div>';
  document.body.insertAdjacentHTML('beforeend','<div class="ux-scrim" aria-hidden="true"></div>');
  $('.ux-menu')?.addEventListener('click',expand);$('.ux-close')?.addEventListener('click',collapse);$('.ux-scrim')?.addEventListener('click',collapse);
  $('#ux-search-input')?.addEventListener('input',renderResults);
  sidebar.addEventListener('click',e=>{if(mobile()&&e.target.closest('a'))collapse()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mobile())collapse();if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();expand();setTimeout(()=>$('#ux-search-input')?.focus(),50)}});
  window.addEventListener('resize',()=>{document.body.classList.remove('ux-drawer-open');syncAria()});
  renderRecents();refreshTitle();syncAria();
 }
 function onRoute(){track();renderRecents();refreshTitle();renderResults();if(mobile())collapse()}
 window.addEventListener('hashchange',onRoute);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{build();track();renderRecents()});else{build();track();renderRecents()}
})();
