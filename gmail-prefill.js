(() => {
  const KEY='joseluis-portal-v3';
  const retiredDocumentIds=new Set([
    'gmail-cv-es-v3','gmail-cv-fr-v3','gmail-cv-editable','gmail-motivation-es','gmail-motivation-fr',
    'gmail-sciencespo-admission','gmail-ufro-mobility','gmail-sciencespo-dossier','gmail-photo','gmail-crous',
    'known-recommendation-2022','known-cv','known-degree','known-transcript'
  ]);

  let s;
  try{s=JSON.parse(localStorage.getItem(KEY)||'null')}catch{}
  if(!s)return;

  s.profile=s.profile||{};
  if(!s.profile.name || s.profile.name==='José Luis') s.profile.name='Joseluis';
  s.profile.country=s.profile.country||'Chile';
  s.profile.field='Sociología · Universidad de La Frontera';
  s.profile.international='Sciences Po Rennes · semestre 2022';
  s.profile.tools='Excel · Word · SPSS';
  s.profile.languages='Español · Inglés por confirmar · Francés por confirmar';
  s.profile.focus='Investigación social · sociología política/histórica';

  // 2026 policy: active Documents contains only current, usable files.
  // Historical evidence remains in archive/backend but must not be re-injected into active state.
  s.documents=(s.documents||[]).filter(d=>!retiredDocumentIds.has(d.id));
  localStorage.setItem(KEY,JSON.stringify(s));

  try{state=s}catch{}

  if(typeof profilePage==='function'){
    profilePage=function(){
      const p=state.profile||{};
      const rows=[
        ['Formación',p.field||''],
        ['Internacional',p.international||''],
        ['Herramientas',p.tools||''],
        ['Idiomas',p.languages||'']
      ];
      return `<section class="page"><div class="page-head compact"><h1>Perfil</h1><button class="circle-action" data-action="edit-profile">✎</button></div><div class="profile-app">${rows.map(([k,v])=>`<div><span>${k}</span><strong>${esc(v)}</strong></div>`).join('')}</div></section>`;
    };
  }

  if(typeof render==='function')render();
})();
