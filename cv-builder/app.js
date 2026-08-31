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
      {position:'Participación',name:'Curso Prevención del Coronavirus · Mutual de Seguridad',date:'2022',summary:''},
      {position:'Participación',name:'Protectora de Canes y Felinos · Universidad de La Frontera',date:'2019 - 2021',summary:''},
      {position:'Participación',name:'Academia Aukamapu de Cine y Medios',date:'2015',summary:''}
    ],
    skills:[{name:'Competencias',keywords:['Sociología','Política','Historia','Comunicación oral y escrita']},{name:'Herramientas',keywords:['Excel','Word','SPSS']}],
    languages:[{language:'Español',fluency:'Nativo'},{language:'Inglés',fluency:'Revisar nivel actual'},{language:'Francés',fluency:'Revisar nivel actual'}],
    interestsText:'Política, Animales, Cine, Música'
  });
  let resume=load();
  function load(){try{return JSON.parse(localStorage.getItem(KEY))||base()}catch{return base()}}
  function save(){localStorage.setItem(KEY,JSON.stringify(resume));const e=document.querySelector('#saved-state');if(e)e.textContent='Guardado localmente'}
  const get=(o,p)=>p.split('.').reduce((a,k)=>a?.[k],o)??'';
  const set=(o,p,v)=>{const ks=p.split('.');let c=o;ks.slice(0,-1).forEach(k=>c[k]??={});c[ks.at(-1)]=v};
  const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tex=s=>String(s??'').replace(/\\/g,'\\textbackslash{}').replace(/([#$%&_{}])/g,'\\$1').replace(/\^/g,'\\textasciicircum{}').replace(/~/g,'\\textasciitilde{}');
  const nonempty=x=>Object.values(x||{}).some(v=>Array.isArray(v)?v.length:!!v);

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
  document.querySelector('#import-private').onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(d.cv)resume={...base(),...resume,...d.cv,basics:{...base().basics,...resume.basics,...(d.cv.basics||{}),location:{...base().basics.location,...resume.basics?.location,...(d.cv.basics?.location||{})}}};else resume={...base(),...resume,...d};save();location.reload()}catch{alert('Archivo de importación no válido')}};r.readAsText(f)};

  const regularItem=(title,sub,date,summary)=>`<div class="item"><div class="item-head"><strong>${h(title)}</strong><span class="meta">${h(date)}</span></div>${sub?`<div class="meta">${h(sub)}</div>`:''}${summary?`<p>${h(summary)}</p>`:''}</div>`;
  const section=(t,b)=>b?`<section><h2>${h(t)}</h2>${b}</section>`:'';
  const legacyTitle=t=>`<h2 class="legacy-title">${h(t)}</h2>`;
  const bars={Español:100,Inglés:74,Francés:7,Excel:58,Word:58,SPSS:58};
  function legacyBar(label,value){const pct=bars[label]??55;return `<div class="legacy-bar"><div><strong>${h(label)}</strong>${value&&value!=='Nativo'&&!value.startsWith('Revisar')?`<span>${h(value)}</span>`:''}</div><i><b style="width:${pct}%"></b></i></div>`}
  function dateEntry(title,sub,date,summary=''){return `<div class="legacy-entry"><div class="legacy-entry-text"><strong>${h(title)}</strong>${sub?`<b>${h(sub)}</b>`:''}${summary?`<p>${h(summary)}</p>`:''}</div>${date?`<span class="legacy-date">${h(date)}</span>`:''}</div>`}
  function renderLegacy(){
    const b=resume.basics||{};
    const langs=(resume.languages||[]).filter(nonempty).map(x=>legacyBar(x.language,x.fluency)).join('');
    const compet=(resume.skills||[]).find(x=>/compet/i.test(x.name||''))?.keywords||[];
    const tools=(resume.skills||[]).find(x=>/herr/i.test(x.name||''))?.keywords||[];
    const edu=(resume.education||[]).filter(nonempty).map(x=>dateEntry(x.studyType,[x.institution,x.area].filter(Boolean).join(' - '),x.date)).join('');
    const work=(resume.work||[]).filter(nonempty).map(x=>dateEntry(x.position,x.name,[x.startDate,x.endDate].filter(Boolean).join(' - '),x.summary)).join('');
    const vol=(resume.volunteer||[]).filter(nonempty).map(x=>dateEntry(x.position,x.name,x.date,x.summary)).join('');
    const interests=(resume.interestsText||'').split(',').map(x=>x.trim()).filter(Boolean).map(x=>`<span>☕ ${h(x)}</span>`).join('');
    const contact=[b.location?.address&&`<div>● <span>${h(b.location.address)}</span></div>`,b.phone&&`<div>▯ <span>${h(b.phone)}</span></div>`,b.email&&`<div>✉ <span>${h(b.email)}</span></div>`,b.url&&`<div>↗ <span>${h(b.url)}</span></div>`].filter(Boolean).join('');
    return `<div class="legacy-grid">
      <aside class="legacy-left">
        ${b.photo?`<img class="legacy-photo" src="${b.photo}" alt="">`:'<div class="legacy-photo placeholder">Foto</div>'}
        ${legacyTitle('Contacto')}<div class="legacy-contact">${contact||'<span>Completar datos de contacto</span>'}</div>
        ${legacyTitle('Idiomas')}<div>${langs}</div>
        ${legacyTitle('Competencias')}<div class="legacy-list">${compet.map(x=>`<div>✣ <span>${h(x)}</span></div>`).join('')}</div>
        ${legacyTitle('Herramientas')}<div>${tools.map(x=>legacyBar(x,'')).join('')}</div>
      </aside>
      <main class="legacy-right">
        <header class="legacy-header"><h1>${h((b.name||'').toUpperCase())}</h1><i></i><div>${h(b.label||'')}</div></header>
        <div class="legacy-main">
          ${legacyTitle('Perfil')}<p class="legacy-profile">${h(b.summary||'')}</p>
          ${work?legacyTitle('Experiencia')+work:''}
          ${legacyTitle('Formación')}${edu}
          ${legacyTitle('Otros antecedentes')}${vol}
          ${legacyTitle('Centros de interés')}<div class="legacy-interests">${interests}</div>
        </div>
      </main>
    </div>`;
  }
  function renderRegular(){const b=resume.basics||{},contact=[b.email,b.phone,b.location?.address,b.url].filter(Boolean).join(' · '),photo=b.photo?`<img class="cv-photo" src="${b.photo}" alt="">`:'';
    const work=(resume.work||[]).filter(nonempty).map(x=>regularItem(x.position,x.name,[x.startDate,x.endDate].filter(Boolean).join(' - '),x.summary)).join('');
    const edu=(resume.education||[]).filter(nonempty).map(x=>regularItem(x.studyType,[x.institution,x.area].filter(Boolean).join(' · '),x.date,'')).join('');
    const vol=(resume.volunteer||[]).filter(nonempty).map(x=>regularItem(x.position,x.name,x.date,x.summary)).join('');
    const sk=(resume.skills||[]).map(x=>`<div class="skill-line"><strong>${h(x.name)}</strong>${x.keywords?.length?`: ${h(x.keywords.join(', '))}`:''}</div>`).join('');
    const la=(resume.languages||[]).map(x=>`<div class="skill-line"><strong>${h(x.language)}</strong>${x.fluency?`: ${h(x.fluency)}`:''}</div>`).join('');
    return `<header>${photo}<div><h1>${h(b.name)}</h1><div class="headline">${h(b.label)}</div>${contact?`<div class="contact">${h(contact)}</div>`:''}</div></header>${section('Perfil',`<p>${h(b.summary)}</p>`)}${section('Experiencia',work)}${section('Educación',edu)}${section('Actividades',vol)}${section('Habilidades',sk)}${section('Idiomas',la)}${resume.interestsText?section('Intereses',`<p>${h(resume.interestsText)}</p>`):''}`;
  }
  function renderPreview(){const p=document.querySelector('#preview');p.className='resume '+tpl.value;p.innerHTML=tpl.value==='legacy'?renderLegacy():renderRegular()}

  function clean(){return {...resume,interests:(resume.interestsText||'').split(',').map(x=>({name:x.trim()})).filter(x=>x.name)}}
  const dl=(n,t,m='text/plain')=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:m}));a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)};
  document.querySelector('#download-json').onclick=()=>dl('resume.json',JSON.stringify(clean(),null,2),'application/json');
  document.querySelector('#download-tex').onclick=()=>dl('CV.tex',latex());
  document.querySelector('#download-cls').onclick=()=>dl('resume.cls',resumeClass());
  document.querySelector('#print-pdf').onclick=()=>window.print();
  document.querySelector('#clear-data').onclick=()=>{if(confirm('¿Borrar los datos locales del CV?')){localStorage.removeItem(KEY);location.reload()}};

  function latex(){return tpl.value==='legacy'?legacyLatex():simpleLatex()}
  function legacyLatex(){const b=resume.basics,l=[],compet=(resume.skills||[]).find(x=>/compet/i.test(x.name||''))?.keywords||[],tools=(resume.skills||[]).find(x=>/herr/i.test(x.name||''))?.keywords||[];
    l.push('\\documentclass[10pt,a4paper]{article}','\\usepackage[utf8]{inputenc}','\\usepackage[T1]{fontenc}','\\usepackage[default]{raleway}','\\usepackage[a4paper,top=1cm,bottom=1cm,left=1cm,right=1cm]{geometry}','\\usepackage{xcolor,graphicx,paracol,tikz}','\\pagestyle{empty}','\\setlength{\\parindent}{0pt}','\\definecolor{maincol}{RGB}{182,66,82}','\\definecolor{darkcol}{RGB}{154,97,114}','\\newcommand{\\sect}[1]{\\vspace{8pt}{\\Large\\bfseries\\color{darkcol}\\MakeUppercase{#1}}\\\\[-2pt]{\\color{maincol}\\rule{0.18\\linewidth}{2pt}}\\\\[4pt]}','\\newcommand{\\datebox}[1]{\\colorbox{maincol}{\\color{white}\\strut\\hspace{8pt}#1\\hspace{8pt}}}','\\begin{document}','\\columnratio{0.31}','\\begin{paracol}{2}','\\switchcolumn[0]*');
    if(b.photo)l.push('% Add the imported photo locally as photo.jpg before compiling.','\\includegraphics[width=\\linewidth]{photo.jpg}');
    l.push('\\sect{Contacto}',tex(b.location?.address||''),'\\\\',tex(b.phone||''),'\\\\',tex(b.email||''),'\\sect{Idiomas}');(resume.languages||[]).forEach(x=>l.push('\\textbf{'+tex(x.language)+'}\\\\[5pt]'));
    l.push('\\sect{Competencias}');compet.forEach(x=>l.push('\\textbullet\\ '+tex(x)+'\\\\'));
    l.push('\\sect{Herramientas}');tools.forEach(x=>l.push('\\textbf{'+tex(x)+'}\\\\[5pt]'));
    l.push('\\switchcolumn','\\colorbox{darkcol}{\\parbox[c][3.2cm][c]{\\dimexpr\\linewidth-2\\fboxsep}{\\centering\\color{white}{\\Huge\\bfseries '+tex((b.name||'').toUpperCase())+'}\\\\[8pt]{\\large '+tex(b.label||'')+'}}}','\\sect{Perfil}',tex(b.summary||''));
    if(resume.work?.some(nonempty)){l.push('\\sect{Experiencia}');resume.work.filter(nonempty).forEach(x=>l.push('\\textbf{'+tex(x.position)+'}\\hfill\\datebox{'+tex([x.startDate,x.endDate].filter(Boolean).join(' - '))+'}\\\\{\\color{maincol}\\bfseries '+tex(x.name)+'}\\\\'+tex(x.summary||'')+'\\\\[8pt]'))}
    l.push('\\sect{Formación}');resume.education.filter(nonempty).forEach(x=>l.push('\\textbf{'+tex(x.studyType)+'}\\hfill\\datebox{'+tex(x.date)+'}\\\\{\\color{maincol}\\bfseries '+tex([x.institution,x.area].filter(Boolean).join(' - '))+'}\\\\[10pt]'));
    l.push('\\sect{Otros antecedentes}');resume.volunteer.filter(nonempty).forEach(x=>l.push('\\textbf{'+tex(x.position)+'}\\hfill\\datebox{'+tex(x.date)+'}\\\\{\\color{maincol}\\bfseries '+tex(x.name)+'}\\\\[10pt]'));
    l.push('\\sect{Centros de interés}',tex(resume.interestsText||''),'\\end{paracol}','\\end{document}');return l.join('\n')}
  function simpleLatex(){const b=resume.basics,l=[];l.push('\\documentclass{resume}','\\begin{document}',`\\cvname{${tex(b.name)}}`,`\\cvheadline{${tex(b.label)}}`,`\\cvcontact{${tex([b.email,b.phone,b.location?.address,b.url].filter(Boolean).join(' · '))}}`);if(b.summary)l.push('\\cvsection{Perfil}',tex(b.summary),'');for(const [key,title] of [['work','Experiencia'],['education','Educación'],['volunteer','Actividades']]){if(resume[key]?.length){l.push(`\\cvsection{${title}}`);resume[key].forEach(x=>{if(!nonempty(x))return;const a=x.position||x.studyType||'',sub=x.name||[x.institution,x.area].filter(Boolean).join(' · '),d=x.date||[x.startDate,x.endDate].filter(Boolean).join(' - ');l.push(`\\cventry{${tex(a)}}{${tex(sub)}}{${tex(d)}}`,tex(x.summary||''),'')})}}l.push('\\end{document}');return l.join('\n')}
  function resumeClass(){return String.raw`\NeedsTeXFormat{LaTeX2e}\ProvidesClass{resume}[2026 CV]\LoadClass[10pt,a4paper]{article}\RequirePackage[margin=1.5cm]{geometry}\RequirePackage[hidelinks]{hyperref}\RequirePackage[T1]{fontenc}\RequirePackage[utf8]{inputenc}\pagestyle{empty}\setlength{\parindent}{0pt}\newcommand{\cvname}[1]{{\LARGE\bfseries #1}\par}\newcommand{\cvheadline}[1]{{\normalsize #1}\par}\newcommand{\cvcontact}[1]{{\small #1}\par\vspace{.6em}}\newcommand{\cvsection}[1]{\vspace{.8em}{\bfseries\MakeUppercase{#1}}\par\hrule\vspace{.45em}}\newcommand{\cventry}[3]{\textbf{#1}\hfill{\small #3}\par{\small #2}\par}`}
  renderPreview();
})();