(() => {
  const KEY='joseluis-portal-v3';
  const historicalDocs=[
    {id:'gmail-cv-es-v3',name:'CV español v3',category:'CV',status:'located',version:3,source:'Gmail',sourceYear:2022,needsUpdate:true},
    {id:'gmail-cv-fr-v3',name:'CV francés v3',category:'CV',status:'located',version:3,source:'Gmail',sourceYear:2022,needsUpdate:true},
    {id:'gmail-cv-editable',name:'CV editable · DOCX',category:'CV',status:'located',version:1,source:'Gmail',sourceYear:2022,needsUpdate:true},
    {id:'gmail-motivation-es',name:'Carta de motivación · ES',category:'Muestras',status:'located',version:3,source:'Gmail',sourceYear:2022,needsUpdate:true},
    {id:'gmail-motivation-fr',name:'Lettre de motivation · FR',category:'Muestras',status:'located',version:3,source:'Gmail',sourceYear:2022,needsUpdate:true},
    {id:'gmail-passport',name:'Pasaporte',category:'Otros',status:'located',version:1,source:'Gmail',sourceYear:2022,needsUpdate:true,sensitive:true},
    {id:'gmail-sciencespo-admission',name:'Admisión Sciences Po Rennes',category:'Estudios',status:'located',version:1,source:'Gmail',sourceYear:2022,needsUpdate:false},
    {id:'gmail-ufro-mobility',name:'Financiamiento movilidad UFRO → Rennes',category:'Estudios',status:'located',version:1,source:'Gmail',sourceYear:2022,needsUpdate:false},
    {id:'gmail-sciencespo-dossier',name:'Dossier Sciences Po Rennes',category:'Estudios',status:'located',version:1,source:'Gmail',sourceYear:2022,needsUpdate:true},
    {id:'gmail-photo',name:'Foto CV / carnet',category:'Otros',status:'located',version:1,source:'Gmail',sourceYear:2022,needsUpdate:true},
    {id:'gmail-crous',name:'Archivo CROUS Rennes',category:'Otros',status:'located',version:1,source:'Gmail',sourceYear:2022,needsUpdate:false},
    {id:'known-recommendation-2022',name:'Carta de recomendación de profesor',category:'Recomendaciones',status:'known-not-found',version:1,source:'Email',sourceYear:2022,needsUpdate:true}
  ];

  let s;
  try{s=JSON.parse(localStorage.getItem(KEY)||'null')}catch{}
  if(!s)return;

  s.profile=s.profile||{};
  s.profile.name=s.profile.name||'José Luis';
  s.profile.country=s.profile.country||'Chile';
  s.profile.field='Sociología · Universidad de La Frontera';
  s.profile.international='Sciences Po Rennes · semestre 2022';
  s.profile.tools='Excel · Word · SPSS';
  s.profile.languages='Español · Inglés por confirmar · Francés por confirmar';
  s.profile.focus='Investigación social · sociología política/histórica';

  const byId=new Map((s.documents||[]).map(d=>[d.id,d]));
  for(const d of historicalDocs){
    const old=byId.get(d.id);
    byId.set(d.id,old?{...d,...old,id:d.id}:{...d});
  }
  // Retire demo placeholders that implied documents we never actually located.
  for(const id of ['known-cv','known-degree','known-transcript'])byId.delete(id);
  s.documents=[...byId.values()];
  localStorage.setItem(KEY,JSON.stringify(s));

  try{state=s}catch{}

  if(typeof docsPage==='function'){
    docsPage=function(){
      const cats=['CV','Estudios','Idiomas','Recomendaciones','Muestras','Otros'];
      const counts=Object.fromEntries(cats.map(c=>[c,state.documents.filter(d=>d.category===c).length]));
      const docs=docFilter==='all'?[]:state.documents.filter(d=>d.category===docFilter);
      const label=d=>d.status==='ready'?'Guardado aquí':d.status==='located'?`${d.source||'Localizado'} · ${d.sourceYear||''}${d.needsUpdate?' · actualizar':''}`:'Sabemos que existe · falta localizar';
      return `<section class="page"><div class="page-head compact"><h1>Documentos</h1><button class="circle-action" data-action="upload">+</button></div><div class="wallet-list">${cats.map(c=>`<button class="wallet-row ${docFilter===c?'active':''}" data-docfilter="${c}"><span>${icon(c)}</span><strong>${c}</strong><b>${counts[c]||0}</b><i>›</i></button>`).join('')}</div>${docFilter!=='all'?`<div class="doc-items">${docs.map(d=>`<div class="doc-item"><div><strong>${esc(d.name)}</strong><span>${esc(label(d))}</span></div><span class="mini-priority">${d.status==='located'?'✓':'○'}</span></div>`).join('')||'<div class="empty">Sin documentos</div>'}</div>`:''}</section>`;
    };
  }

  if(typeof profilePage==='function'){
    profilePage=function(){
      const p=state.profile||{};
      const rows=[
        ['Formación',p.field||'—'],
        ['Internacional',p.international||'—'],
        ['Herramientas',p.tools||'—'],
        ['Idiomas',p.languages||'—']
      ];
      return `<section class="page"><div class="page-head compact"><h1>Perfil</h1><button class="circle-action" data-action="edit-profile">✎</button></div><div class="profile-app">${rows.map(([k,v])=>`<div><span>${k}</span><strong>${esc(v)}</strong></div>`).join('')}</div></section>`;
    };
  }

  if(typeof render==='function')render();
})();
