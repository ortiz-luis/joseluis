(() => {
  const KEY='joseluis-cv-builder-v2';
  const base=()=>({
    basics:{name:'Joseluis Moraga',label:'Sociólogo',email:'',phone:'',url:'',summary:'Sociólogo con interés en sociología política, sociología histórica, investigación social y políticas públicas.',location:{address:''},photo:''},
    work:[],
    education:[
      {institution:'Universidad de La Frontera',studyType:'Sociología',area:'Temuco, Chile',date:'2019 - revisar año de egreso'},
      {institution:'Sciences Po Rennes',studyType:'Semestre de estudios',area:'Rennes, Francia',date:'2022'},
      {institution:'Colegio Santa Cruz',studyType:'Enseñanza media',area:'Temuco, Chile',date:'2016'}
    ],
    volunteer:[
      {position:'Participación',name:'Protectora de Canes y Felinos, Universidad de La Frontera',date:'2019 - 2021',summary:''},
      {position:'Participación',name:'Academia Aukamapu de Cine y Medios',date:'2015',summary:''}
    ],
    skills:[{name:'Áreas',keywords:['Sociología','Política','Historia','Comunicación oral y escrita']},{name:'Herramientas',keywords:['Excel','Word','SPSS']}],
    languages:[{language:'Español',fluency:'Nativo'},{language:'Inglés',fluency:'Revisar nivel actual'},{language:'Francés',fluency:'Revisar nivel actual'}],
    interestsText:'Política, Cine, Animales, Música'
  });
  let resume=load();
  function load(){try{return JSON.parse(localStorage.getItem(KEY))||base()}catch{return base()}}
  function save(){localStorage.setItem(KEY,JSON.stringify(resume));const e=document.querySelector('#saved-state');if(e)e.textContent='Guardado localmente'}
  const get=(o,p)=>p.split('.').reduce((a,k)=>a?.[k],o)??'';
  const set=(o,p,v)=>{const ks=p.split('.');let c=o;ks.slice(0,-1).forEach(k=>c=c[k]??={});c[ks.at(-1)]=v};
  const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tex=s=>String(s??'').replace(/\\/g,'\\textbackslash{}').replace(/([#$%&_{}])/g,'\\$1').replace(/\^/g,'\\textasciicircum{}').replace(/~/g,'\\textasciitilde{}');

  function bindFields(){document.querySelectorAll('[data-field]').forEach(el=>{el.value=get(resume,el.dataset.field);el.oninput=()=>{set(resume,el.dataset.field,el.value);save();renderPreview()}})}
  const cfg={
    work:{c:'#work-list',t:'#work-template',b:{position:'',name:'',startDate:'',endDate:'',summary:''}},
    education:{c:'#education-list',t:'#education-template',b:{institution:'',studyType:'',area:'',date:''}},
    volunteer:{c:'#volunteer-list',t:'#volunteer-template',b:{position:'',name:'',date:'',summary:''}},
    skills:{c:'#skills-list',t:'#skills-template',b:{name:'',keywords:[]}},
    languages:{c:'#languages-list',t:'#languages-template',b:{language:'',fluency:''}}
  };
  function renderList(type){const x=cfg[type],host=document.querySelector(x.c);host.innerHTML='';(resume[type]||[]).forEach((it,i)=>{const f=document.querySelector(x.t).content.cloneNode(true),r=f.querySelector('[data-entry]');r.querySelectorAll('[data-key]').forEach(el=>{const k=el.dataset.key;el.value=Array.isArray(it[k])?it[k].join(', '):(it[k]||'');el.oninput=()=>{resume[type][i][k]=k==='keywords'?el.value.split(',').map(x=>x.trim()).filter(Boolean):el.value;save();renderPreview()}});r.querySelector('[data-remove]').onclick=()=>{resume[type].splice(i,1);save();renderList(type);renderPreview()};host.append(f)})}
  Object.keys(cfg).forEach(renderList);
  document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{resume[b.dataset.add].push(structuredClone(cfg[b.dataset.add].b));save();renderList(b.dataset.add);renderPreview()});
  bindFields();

  const tpl=document.querySelector('#template');tpl.value=localStorage.getItem(KEY+'-template')||'legacy';tpl.onchange=()=>{localStorage.setItem(KEY+'-template',tpl.value);renderPreview()};
  document.querySelector('#photo-input').onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{resume.basics.photo=r.result;save();renderPreview()};r.readAsDataURL(f)};
  document.querySelector('#import-private').onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(d.cv)resume={...base(),...d.cv,basics:{...base().basics,...(d.cv.basics||{}),location:{...base().basics.location,...(d.cv.basics?.location||{})}}};else resume={...base(),...d};save();location.reload()}catch{alert('Archivo de importación no válido')}};r.readAsText(f)};

  function item(title,sub,date,summary){return `<div class="item"><div class="item-head"><strong>${h(title)}</strong><span class="meta">${h(date)}</span></div>${sub?`<div class="meta">${h(sub)}</div>`:''}${summary?`<p>${h(summary)}</p>`:''}</div>`}
  const section=(t,b)=>b?`<section><h2>${h(t)}</h2>${b}</section>`:'';
  function renderPreview(){const b=resume.basics||{},contact=[b.email,b.phone,b.location?.address,b.url].filter(Boolean).join(' · '),photo=b.photo?`<img class="cv-photo" src="${b.photo}" alt="">`:'';
    const work=(resume.work||[]).filter(x=>Object.values(x).some(Boolean)).map(x=>item(x.position,x.name,[x.startDate,x.endDate].filter(Boolean).join(' - '),x.summary)).join('');
    const edu=(resume.education||[]).filter(x=>Object.values(x).some(Boolean)).map(x=>item(x.studyType,[x.institution,x.area].filter(Boolean).join(' · '),x.date,'')).join('');
    const vol=(resume.volunteer||[]).filter(x=>Object.values(x).some(Boolean)).map(x=>item(x.position,x.name,x.date,x.summary)).join('');
    const sk=(resume.skills||[]).map(x=>`<div class="skill-line"><strong>${h(x.name)}</strong>${x.keywords?.length?`: ${h(x.keywords.join(', '))}`:''}</div>`).join('');
    const la=(resume.languages||[]).map(x=>`<div class="skill-line"><strong>${h(x.language)}</strong>${x.fluency?`: ${h(x.fluency)}`:''}</div>`).join('');
    const p=document.querySelector('#preview');p.className='resume '+tpl.value;p.innerHTML=`<header>${photo}<div><h1>${h(b.name)}</h1><div class="headline">${h(b.label)}</div>${contact?`<div class="contact">${h(contact)}</div>`:''}</div></header>${section('Perfil',`<p>${h(b.summary)}</p>`)}${section('Experiencia',work)}${section('Educación',edu)}${section('Actividades',vol)}${section('Habilidades',sk)}${section('Idiomas',la)}${resume.interestsText?section('Intereses',`<p>${h(resume.interestsText)}</p>`):''}`}
  function clean(){return {...resume,interests:(resume.interestsText||'').split(',').map(x=>({name:x.trim()})).filter(x=>x.name)}}
  const dl=(n,t,m='text/plain')=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:m}));a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)};
  document.querySelector('#download-json').onclick=()=>dl('resume.json',JSON.stringify(clean(),null,2),'application/json');document.querySelector('#download-tex').onclick=()=>dl('CV.tex',latex());document.querySelector('#download-cls').onclick=()=>dl('resume.cls',resumeClass());document.querySelector('#print-pdf').onclick=()=>window.print();document.querySelector('#clear-data').onclick=()=>{if(confirm('¿Borrar los datos locales del CV?')){localStorage.removeItem(KEY);location.reload()}};
  function latex(){const b=resume.basics,l=[];l.push('\\documentclass{resume}','\\begin{document}',`\\cvname{${tex(b.name)}}`,`\\cvheadline{${tex(b.label)}}`,`\\cvcontact{${tex([b.email,b.phone,b.location?.address,b.url].filter(Boolean).join(' · '))}}`);if(b.summary)l.push('\\cvsection{Perfil}',tex(b.summary),'');for(const [key,title] of [['work','Experiencia'],['education','Educación'],['volunteer','Actividades']]){if(resume[key]?.length){l.push(`\\cvsection{${title}}`);resume[key].forEach(x=>{const a=x.position||x.studyType||'',sub=x.name||[x.institution,x.area].filter(Boolean).join(' · '),d=x.date||[x.startDate,x.endDate].filter(Boolean).join(' - ');l.push(`\\cventry{${tex(a)}}{${tex(sub)}}{${tex(d)}}`,tex(x.summary||''),'')})}}if(resume.skills?.length){l.push('\\cvsection{Habilidades}');resume.skills.forEach(x=>l.push(`\\cvline{${tex(x.name)}}{${tex((x.keywords||[]).join(', '))}}`))}if(resume.languages?.length){l.push('\\cvsection{Idiomas}');resume.languages.forEach(x=>l.push(`\\cvline{${tex(x.language)}}{${tex(x.fluency)}}`))}if(resume.interestsText)l.push('\\cvsection{Intereses}',tex(resume.interestsText));l.push('\\end{document}');return l.join('\n')}
  function resumeClass(){return String.raw`\NeedsTeXFormat{LaTeX2e}\ProvidesClass{resume}[2026 CV]\LoadClass[10pt,a4paper]{article}\RequirePackage[margin=1.5cm]{geometry}\RequirePackage[hidelinks]{hyperref}\RequirePackage[T1]{fontenc}\RequirePackage[utf8]{inputenc}\pagestyle{empty}\setlength{\parindent}{0pt}\newcommand{\cvname}[1]{{\LARGE\bfseries #1}\par}\newcommand{\cvheadline}[1]{{\normalsize #1}\par}\newcommand{\cvcontact}[1]{{\small #1}\par\vspace{.6em}}\newcommand{\cvsection}[1]{\vspace{.8em}{\bfseries\MakeUppercase{#1}}\par\hrule\vspace{.45em}}\newcommand{\cventry}[3]{\textbf{#1}\hfill{\small #3}\par{\small #2}\par}\newcommand{\cvline}[2]{\textbf{#1}: #2\par}`}
  renderPreview();
})();