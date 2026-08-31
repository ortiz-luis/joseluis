(() => {
  const KEY='joseluis-cv-builder-v1';
  const empty=()=>({basics:{name:'',label:'',email:'',phone:'',url:'',summary:'',location:{address:''}},work:[],education:[],skills:[],languages:[]});
  let resume=load();

  function load(){try{return {...empty(),...JSON.parse(localStorage.getItem(KEY)||'null')}}catch{return empty()}}
  function save(){localStorage.setItem(KEY,JSON.stringify(resume));const el=document.querySelector('#saved-state');if(el){el.textContent='Guardado localmente';clearTimeout(save.t);save.t=setTimeout(()=>el.textContent='Guardado',900)}}
  function get(obj,path){return path.split('.').reduce((a,k)=>a?.[k],obj)??''}
  function set(obj,path,value){const keys=path.split('.');let cur=obj;keys.slice(0,-1).forEach(k=>cur=cur[k]??=( {} ));cur[keys.at(-1)]=value}
  function h(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

  document.querySelectorAll('[data-field]').forEach(el=>{el.value=get(resume,el.dataset.field);el.addEventListener('input',()=>{set(resume,el.dataset.field,el.value);save();renderPreview()})});

  const configs={
    work:{container:'#work-list',template:'#work-template',blank:{position:'',name:'',startDate:'',endDate:'',summary:''}},
    education:{container:'#education-list',template:'#education-template',blank:{institution:'',studyType:'',area:'',date:''}},
    skills:{container:'#skills-list',template:'#skills-template',blank:{name:'',keywords:[]}},
    languages:{container:'#languages-list',template:'#languages-template',blank:{language:'',fluency:''}}
  };

  function renderList(type){const cfg=configs[type],host=document.querySelector(cfg.container);host.innerHTML='';(resume[type]||[]).forEach((item,index)=>{const frag=document.querySelector(cfg.template).content.cloneNode(true);const root=frag.querySelector('[data-entry]');root.querySelectorAll('[data-key]').forEach(el=>{const key=el.dataset.key;el.value=Array.isArray(item[key])?item[key].join(', '):(item[key]||'');el.addEventListener('input',()=>{resume[type][index][key]=key==='keywords'?el.value.split(',').map(x=>x.trim()).filter(Boolean):el.value;save();renderPreview()})});root.querySelector('[data-remove]').onclick=()=>{resume[type].splice(index,1);save();renderList(type);renderPreview()};host.append(frag)})}
  Object.keys(configs).forEach(renderList);
  document.querySelectorAll('[data-add]').forEach(btn=>btn.onclick=()=>{const type=btn.dataset.add;resume[type].push(structuredClone(configs[type].blank));save();renderList(type);renderPreview()});

  const template=document.querySelector('#template');
  template.value=localStorage.getItem(KEY+'-template')||'classic';
  template.onchange=()=>{localStorage.setItem(KEY+'-template',template.value);renderPreview()};

  function item(title,sub,date,summary){return `<div class="item"><div class="item-head"><strong>${h(title)}</strong><span class="meta">${h(date)}</span></div>${sub?`<div class="meta">${h(sub)}</div>`:''}${summary?`<p>${h(summary)}</p>`:''}</div>`}
  function section(title,body){return body?`<section><h2>${h(title)}</h2>${body}</section>`:''}
  function renderPreview(){
    const b=resume.basics||{},contact=[b.email,b.phone,b.location?.address,b.url].filter(Boolean).join(' · ');
    const work=(resume.work||[]).filter(x=>Object.values(x).some(Boolean)).map(x=>item(x.position,x.name,[x.startDate,x.endDate].filter(Boolean).join(' - '),x.summary)).join('');
    const edu=(resume.education||[]).filter(x=>Object.values(x).some(Boolean)).map(x=>item(x.studyType,[x.institution,x.area].filter(Boolean).join(' · '),x.date,'')).join('');
    const skills=(resume.skills||[]).filter(x=>x.name||x.keywords?.length).map(x=>`<div class="skill-line"><strong>${h(x.name)}</strong>${x.name&&x.keywords?.length?': ':''}${h((x.keywords||[]).join(', '))}</div>`).join('');
    const langs=(resume.languages||[]).filter(x=>x.language||x.fluency).map(x=>`<div class="skill-line"><strong>${h(x.language)}</strong>${x.fluency?`: ${h(x.fluency)}`:''}</div>`).join('');
    const preview=document.querySelector('#preview');preview.className='resume '+template.value;
    preview.innerHTML=`<header><h1>${h(b.name||'Tu nombre')}</h1>${b.label?`<div class="headline">${h(b.label)}</div>`:''}${contact?`<div class="contact">${h(contact)}</div>`:''}</header>${b.summary?section('Perfil',`<p>${h(b.summary)}</p>`):''}${section('Experiencia',work)}${section('Educación',edu)}${section('Habilidades',skills)}${section('Idiomas',langs)}`;
  }

  function cleanJSON(){return {basics:{...resume.basics,location:{address:resume.basics?.location?.address||''}},work:resume.work||[],education:resume.education||[],skills:(resume.skills||[]).map(x=>({...x,keywords:Array.isArray(x.keywords)?x.keywords:[]})),languages:resume.languages||[]}}
  function dl(name,text,type='text/plain'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  document.querySelector('#download-json').onclick=()=>dl('resume.json',JSON.stringify(cleanJSON(),null,2),'application/json');
  document.querySelector('#download-tex').onclick=()=>dl('CV.tex',latex());
  document.querySelector('#download-cls').onclick=()=>dl('resume.cls',resumeClass());
  document.querySelector('#print-pdf').onclick=()=>window.print();
  document.querySelector('#clear-data').onclick=()=>{if(!confirm('¿Borrar todos los datos guardados por el creador de CV en este navegador?'))return;resume=empty();localStorage.removeItem(KEY);location.reload()};

  function tex(s=''){return String(s).replace(/\\/g,'\\textbackslash{}').replace(/([#$%&_{}])/g,'\\$1').replace(/\^/g,'\\textasciicircum{}').replace(/~/g,'\\textasciitilde{}')}
  function latex(){
    const b=resume.basics||{},opt=template.value==='classic'?'':`[${template.value}]`,lines=[];
    lines.push(`\\documentclass${opt}{resume}`,'\\begin{document}',`\\cvname{${tex(b.name)}}`,`\\cvheadline{${tex(b.label)}}`,`\\cvcontact{${tex([b.email,b.phone,b.location?.address,b.url].filter(Boolean).join(' · '))}}`);
    if(b.summary)lines.push('\\cvsection{Perfil}',tex(b.summary),'');
    if(resume.work?.length){lines.push('\\cvsection{Experiencia}');resume.work.forEach(x=>{if(!Object.values(x).some(Boolean))return;lines.push(`\\cventry{${tex(x.position)}}{${tex(x.name)}}{${tex([x.startDate,x.endDate].filter(Boolean).join(' - '))}}`,tex(x.summary),'')})}
    if(resume.education?.length){lines.push('\\cvsection{Educación}');resume.education.forEach(x=>{if(!Object.values(x).some(Boolean))return;lines.push(`\\cventry{${tex(x.studyType)}}{${tex([x.institution,x.area].filter(Boolean).join(' · '))}}{${tex(x.date)}}`,'')})}
    if(resume.skills?.some(x=>x.name||x.keywords?.length)){lines.push('\\cvsection{Habilidades}');resume.skills.forEach(x=>{if(x.name||x.keywords?.length)lines.push(`\\cvline{${tex(x.name)}}{${tex((x.keywords||[]).join(', '))}}`)});lines.push('')}
    if(resume.languages?.some(x=>x.language||x.fluency)){lines.push('\\cvsection{Idiomas}');resume.languages.forEach(x=>{if(x.language||x.fluency)lines.push(`\\cvline{${tex(x.language)}}{${tex(x.fluency)}}`)});lines.push('')}
    lines.push('\\end{document}');return lines.join('\n')
  }

  function resumeClass(){return String.raw`\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{resume}[2026/08/31 Simple CV class]
\LoadClass[10pt,a4paper]{article}
\RequirePackage[margin=1.6cm]{geometry}
\RequirePackage{enumitem}
\RequirePackage[hidelinks]{hyperref}
\RequirePackage[T1]{fontenc}
\RequirePackage[utf8]{inputenc}
\pagestyle{empty}
\setlength{\parindent}{0pt}
\newif\ifcompact
\newif\ifacademic
\DeclareOption{compact}{\compacttrue}
\DeclareOption{academic}{\academictrue}
\ProcessOptions\relax
\ifcompact\geometry{margin=1.25cm}\fi
\newcommand{\cvname}[1]{{\LARGE\bfseries #1}\par}
\newcommand{\cvheadline}[1]{{\normalsize #1}\par}
\newcommand{\cvcontact}[1]{{\small #1}\par\vspace{0.6em}}
\newcommand{\cvsection}[1]{\vspace{0.8em}{\bfseries\ifacademic\large\else\normalsize\MakeUppercase\fi #1}\par\hrule\vspace{0.45em}}
\newcommand{\cventry}[3]{\textbf{#1}\hfill {\small #3}\par{\small #2}\par}
\newcommand{\cvline}[2]{\textbf{#1}: #2\par}
`}

  renderPreview();
})();