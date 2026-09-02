(() => {
  if(typeof state==='undefined') return;

  const RECENT_KEY='postula-recent-v1';
  const recentRead=()=>{try{return JSON.parse(localStorage.getItem(RECENT_KEY)||'[]')}catch{return []}};
  const recentWrite=x=>localStorage.setItem(RECENT_KEY,JSON.stringify(x.slice(0,8)));
  const addRecent=(label,href,kind='')=>{if(!label||!href)return;const a=recentRead().filter(x=>x.href!==href);a.unshift({label,href,kind,at:Date.now()});recentWrite(a)};
  const usable=d=>d?.status==='ready'&&!!d?.storagePath;
  const iconName={Identidad:'identity',CV:'cv',Estudios:'study',Idiomas:'languages',Recomendaciones:'recommendation',Muestras:'sample',Otros:'folder'};
  const cats=[['Identidad','Identidad'],['CV','CV y carta de motivación'],['Estudios','Estudios'],['Idiomas','Idiomas'],['Recomendaciones','Recomendaciones'],['Muestras','Muestras'],['Otros','Otros']];
  let docSearch='';

  function iconSvg(name){
    const paths={
      identity:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M13 10h5M13 14h4"/>',
      cv:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><circle cx="10" cy="13" r="2"/><path d="M7 19c.7-2 5.3-2 6 0"/>',
      study:'<path d="m2 9.5 10-5 10 5-10 5z"/><path d="M6 12v4.5c3.5 2.2 8.5 2.2 12 0V12"/><path d="M22 9.5v6"/>',
      languages:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
      recommendation:'<circle cx="9" cy="8" r="3"/><path d="M3.5 19c.8-4.3 10.2-4.3 11 0"/><path d="m16 12 2 2 4-5"/>',
      sample:'<path d="M6 2h9l4 4v16H6z"/><path d="M15 2v5h5M9 12h7M9 16h7"/>',
      folder:'<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
      letter:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
      trash:'<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
      document:'<path d="M6 2h9l4 4v16H6z"/><path d="M15 2v5h5M9 12h6M9 16h6"/>',
      opportunity:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
    };
    return `<svg class="doc-icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name]||paths.document}</svg>`;
  }
  const iconForCategory=cat=>iconSvg(iconName[cat]||'document');

  route=function(){const raw=location.hash.replace(/^#/,'');const [page='home',id]=raw.split('/');return {page:page||'home',id}};

  nav.splice(0,nav.length,
    ['home','⌂','Inicio'],
    ['opportunities','▣','Oportunidades'],
    ['documents','▤','Documentos'],
    ['create','▧','CV y cartas'],
    ['templates','⌘','Plantillas'],
    ['profile','⚙','Cuenta']
  );

  const pageTitle=t=>`<div class="final-page-head"><h1>${esc(t)}</h1></div>`;
  const searchBox=(value,placeholder,attr)=>`<label class="final-search"><span>⌕</span><input ${attr} value="${esc(value)}" placeholder="${esc(placeholder)}"></label>`;

  function createPage(){
    const cvDocs=(state.documents||[]).filter(d=>usable(d)&&(d.category==='CV'||/cv|curriculum|motiv|lettre|carta/i.test(d.name||'')));
    const existing=cvDocs.length?`<div class="final-section"><h2>Recientes</h2><div class="final-list">${cvDocs.slice(0,5).map(d=>`<button class="final-row" data-view-doc="${esc(d.id)}"><span class="file-token">${/motiv|lettre|carta/i.test(d.name||'')?iconSvg('letter'):iconSvg('cv')}</span><span><b>${esc(d.name)}</b><small>Documento guardado</small></span><i>›</i></button>`).join('')}</div></div>`:'';
    return `<section class="page final-page">${pageTitle('CV y cartas')}<div class="create-choice-grid">
      <a class="create-choice" href="cv-builder/"><span class="choice-icon">${iconSvg('cv')}</span><div><b>Currículum vitae</b><small>CV profesional editable y exportable</small></div><i>›</i></a>
      <a class="create-choice" href="letter-builder/"><span class="choice-icon">${iconSvg('letter')}</span><div><b>Carta de motivación</b><small>Carta personalizada y exportable</small></div><i>›</i></a>
    </div>${existing}</section>`;
  }

  function templatesPage(){
    return `<section class="page final-page">${pageTitle('Plantillas')}<div class="filter-tabs"><button class="active">Todas</button><button>CV</button><button>Cartas</button></div><div class="final-list templates-list">
      <a class="final-row" href="cv-builder/"><span class="file-token">${iconSvg('cv')}</span><span><b>CV original 2022</b><small>Base editable disponible</small></span><i>›</i></a>
      <a class="final-row" href="letter-builder/"><span class="file-token">${iconSvg('letter')}</span><span><b>Carta de motivación general</b><small>Base editable disponible</small></span><i>›</i></a>
    </div></section>`;
  }

  function settingsPage(){
    const theme=document.documentElement.dataset.theme||'light';
    return `<section class="page final-page">${pageTitle('Configuración')}<div class="settings-card"><h2>Apariencia</h2><button class="settings-row" data-final-theme><span>Tema</span><b>${theme==='dark'?'Oscuro':'Claro'}</b><i>›</i></button></div><div class="settings-card"><h2>Documentos</h2><div class="settings-row static"><span>Almacenamiento</span><b>Privado y compartido dentro del espacio</b></div></div></section>`;
  }

  function recentPage(){const xs=recentRead();return `<section class="page final-page">${pageTitle('Recientes')}<div class="final-list">${xs.length?xs.map(x=>`<a class="final-row" href="${esc(x.href)}"><span class="file-token">${iconSvg(x.kind==='opportunity'?'opportunity':'document')}</span><span><b>${esc(x.label)}</b><small>Abierto recientemente</small></span><i>›</i></a>`).join(''):'<div class="empty">Todavía no hay elementos recientes</div>'}</div></section>`}

  function documentCategoryPage(id){
    const cat=decodeURIComponent(id||'Otros');
    const docs=(state.documents||[]).filter(d=>usable(d)&&d.category===cat);
    return `<section class="page final-page"><a class="final-back" href="#documents">‹ Documentos</a>${pageTitle(cat==='CV'?'CV y carta de motivación':cat)}<div class="final-list">${docs.length?docs.map(d=>`<div class="final-row doc-category-row"><span class="file-token">${iconForCategory(cat)}</span><span><b>${esc(d.name)}</b><small>${esc(window.postulaDocumentRoleLabel?.(d.documentRole)||'Listo')}</small></span><div class="row-actions"><button data-view-doc="${esc(d.id)}">Ver</button><button class="tiny-trash" data-delete-doc="${esc(d.id)}" aria-label="Eliminar ${esc(d.name)}" title="Eliminar">${iconSvg('trash')}</button></div></div>`).join(''):'<div class="empty">Sin documentos utilizables en 2026</div>'}</div><button class="final-add-doc" data-upload-category="${esc(cat)}">+ Añadir documento</button></section>`;
  }

  docsPage=function(){
    const q=docSearch.trim().toLowerCase();
    if(q){
      const docs=(state.documents||[]).filter(d=>usable(d)&&String(d.name||'').toLowerCase().includes(q));
      return `<section class="page final-page">${pageTitle('Documentos')}${searchBox(docSearch,'Buscar documentos','data-doc-search')}<div class="final-list">${docs.length?docs.map(d=>`<button class="final-row" data-view-doc="${esc(d.id)}"><span class="file-token">${iconForCategory(d.category)}</span><span><b>${esc(d.name)}</b><small>${esc(d.category)}</small></span><i>›</i></button>`).join(''):'<div class="empty">Sin resultados</div>'}</div></section>`;
    }
    return `<section class="page final-page">${pageTitle('Documentos')}${searchBox('', 'Buscar documentos','data-doc-search')}<div class="document-category-list">${cats.map(([id,label])=>{const n=(state.documents||[]).filter(d=>usable(d)&&d.category===id).length;return `<div class="document-cat-shell"><a class="document-cat-row" href="#document-category/${encodeURIComponent(id)}"><span class="cat-icon">${iconForCategory(id)}</span><b>${esc(label)}</b><small>${n}</small><i>›</i></a><button data-upload-category="${esc(id)}" aria-label="Añadir documento a ${esc(label)}">+</button></div>`}).join('')}</div></section>`;
  };

  const oldOpp=oppPage;
  oppPage=function(id){const o=state.opportunities.find(x=>x.id===id);if(o)addRecent(o.title,`#opportunity/${o.id}`,'opportunity');return oldOpp(id)};

  const oldRenderNav=renderNav;
  renderNav=function(){oldRenderNav();const desk=document.querySelector('#desktop-nav');if(desk&&!desk.querySelector('.nav-secondary')){desk.insertAdjacentHTML('beforeend',`<div class="nav-secondary"><a class="nav-link" href="#recent"><span class="nav-icon">◷</span><span>Recientes</span></a><a class="nav-link" href="#settings"><span class="nav-icon">⚙</span><span>Configuración</span></a></div>`)}}

  render=function(){
    renderNav();const x=route();
    const html=x.page==='opportunities'?oppsPage():x.page==='opportunity'?oppPage(x.id):x.page==='documents'?docsPage():x.page==='document-category'?documentCategoryPage(x.id):x.page==='create'?createPage():x.page==='templates'?templatesPage():x.page==='recent'?recentPage():x.page==='settings'?settingsPage():x.page==='profile'?profilePage():homePage();
    $('#main').innerHTML=html;bind();
    document.querySelectorAll('[data-doc-search]').forEach(inp=>{inp.oninput=()=>{docSearch=inp.value;docsPage&&render()}});
    document.querySelectorAll('[data-upload-category]').forEach(btn=>{btn.onclick=e=>{e.preventDefault();docFilter=btn.dataset.uploadCategory;const f=document.querySelector('#file-input');if(f){f.value='';f.click()}}});
    document.querySelectorAll('[data-final-theme]').forEach(btn=>btn.onclick=()=>{const next=(document.documentElement.dataset.theme||'light')==='dark'?'light':'dark';document.documentElement.dataset.theme=next;localStorage.setItem('postula-theme-v1',next);render()});
    const r=route();if(r.page==='documents')addRecent('Documentos','#documents','document');
  };

  window.addEventListener('hashchange',()=>{docSearch='';});
  render();
})();