(() => {
  const KEY='joseluis-letter-builder-v2';
  const defaults=()=>({
    sender:{name:'Joseluis Esteban MORAGA NUÑEZ',address:'',phone:'',email:'',subtitle:'Sociólogo'},
    es:{
      date:'',
      recipient:'Comité de selección',
      address:'',
      subject:'Candidatura',
      opening:'Estimado Comité de selección:',
      body:'Me dirijo a ustedes para presentar mi candidatura y expresar mi interés en esta oportunidad. Soy sociólogo formado en la Universidad de La Frontera, con experiencia académica internacional a través de un semestre de estudios en Sciences Po Rennes.\n\nMi formación me ha permitido desarrollar un interés especial por la sociología política, la sociología histórica, la investigación social y el análisis de políticas públicas. Me interesa especialmente participar en contextos donde pueda combinar análisis riguroso, trabajo con información y comprensión de fenómenos sociales complejos.\n\nLa experiencia de estudiar en Francia reforzó además mi capacidad de adaptación a entornos internacionales y mi interés por continuar desarrollando mi trayectoria fuera de Chile. Considero que esta oportunidad sería una buena instancia para aportar mi formación, seguir adquiriendo experiencia práctica y trabajar con equipos diversos.\n\nAgradezco su tiempo y consideración. Quedo disponible para proporcionar cualquier información adicional que estimen necesaria y para conversar con mayor detalle sobre mi candidatura.',
      closing:'Atentamente,'
    },
    fr:{
      date:'',
      recipient:'Comité de sélection',
      address:'',
      subject:'Candidature',
      opening:'Madame, Monsieur,',
      body:'Je vous adresse ma candidature afin de vous faire part de mon intérêt pour cette opportunité. Je suis sociologue diplômé de l’Universidad de La Frontera au Chili et j’ai également eu une expérience académique internationale grâce à un semestre d’études à Sciences Po Rennes.\n\nMa formation m’a permis de développer un intérêt particulier pour la sociologie politique, la sociologie historique, la recherche en sciences sociales et l’analyse des politiques publiques. Je souhaite notamment évoluer dans des environnements où je peux mobiliser des capacités d’analyse rigoureuses, travailler avec des informations complexes et contribuer à la compréhension de phénomènes sociaux.\n\nMon expérience d’études en France a également renforcé ma capacité d’adaptation à un contexte international et mon souhait de poursuivre mon parcours professionnel à l’étranger. Cette opportunité représenterait pour moi l’occasion de mettre à profit ma formation, d’acquérir une expérience pratique supplémentaire et de travailler au sein d’équipes diverses.\n\nJe vous remercie pour l’attention portée à ma candidature et reste à votre disposition pour toute information complémentaire ou pour un entretien.',
      closing:'Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.'
    }
  });

  function mergeSaved(saved){
    const d=defaults();
    if(!saved || typeof saved!=='object') return d;
    return {
      sender:{...d.sender,...(saved.sender||{})},
      es:{...d.es,...(saved.es||{})},
      fr:{...d.fr,...(saved.fr||{})}
    };
  }

  function load(){
    try{return mergeSaved(JSON.parse(localStorage.getItem(KEY)))}catch{return defaults()}
  }

  let letters=load();let lang='es';
  function save(){localStorage.setItem(KEY,JSON.stringify(letters))}
  const ids=['date','recipient','address','subject','opening','body','closing'];
  const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tex=s=>String(s??'').replace(/\\/g,'\\textbackslash{}').replace(/([#$%&_{}])/g,'\\$1').replace(/\^/g,'\\textasciicircum{}').replace(/~/g,'\\textasciitilde{}');
  function fill(){const d=letters[lang]||{};ids.forEach(id=>document.querySelector('#'+id).value=d[id]||'');render()}
  ids.forEach(id=>document.querySelector('#'+id).oninput=e=>{letters[lang][id]=e.target.value;save();render()});
  document.querySelector('#lang').onchange=e=>{lang=e.target.value;fill()};
  document.querySelector('#import').onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const data=JSON.parse(r.result);const next=defaults();if(data.cv?.basics){const b=data.cv.basics;next.sender={name:b.name||next.sender.name,address:b.location?.address||'',phone:b.phone||'',email:b.email||'',subtitle:b.label||next.sender.subtitle}}if(data.letters)Object.assign(next,{es:{...next.es,...(data.letters.es||{})},fr:{...next.fr,...(data.letters.fr||{})}});else if(data.es||data.fr)Object.assign(next,{es:{...next.es,...(data.es||{})},fr:{...next.fr,...(data.fr||{})}});letters=next;save();fill()}catch{alert('Archivo de importación no válido')}};r.readAsText(f)};
  function paras(text){return h(text).split(/\n\s*\n/).filter(Boolean).map(x=>`<p>${x.replace(/\n/g,'<br>')}</p>`).join('')}
  function render(){const d=letters[lang],s=letters.sender||defaults().sender,subjectPrefix=lang==='fr'?'Objet :':'Asunto:';document.querySelector('#preview').innerHTML=`<div class="sender"><strong>${h(s.name)}</strong>${s.address?`<span>${h(s.address)}</span>`:''}${s.phone?`<span>✎ ${h(s.phone)}</span>`:''}${s.email?`<span>✉ ${h(s.email)}</span>`:''}</div><div class="date">${h(d.date)}</div><div class="recipient"><strong>${h(d.recipient)}</strong>${d.address?`<span>${h(d.address)}</span>`:''}</div>${d.subject?`<div class="subject"><span>${subjectPrefix}</span> ${h(d.subject)}</div>`:''}<div class="opening">${h(d.opening)}</div><div class="body">${paras(d.body)}</div><div class="closing">${h(d.closing)}</div><div class="signature"><strong>${h(s.name)}</strong>${s.subtitle?`<span>${h(s.subtitle)}</span>`:''}</div>`}
  function latex(){const d=letters[lang],s=letters.sender||defaults().sender,prefix=lang==='fr'?'Objet :':'Asunto:';return `\\documentclass[11pt,a4paper]{article}\n\\usepackage[utf8]{inputenc}\n\\usepackage[T1]{fontenc}\n\\usepackage[a4paper,top=1.7cm,bottom=1.7cm,left=2.0cm,right=2.0cm]{geometry}\n\\usepackage{ragged2e}\n\\pagestyle{empty}\n\\setlength{\\parindent}{0pt}\n\\begin{document}\n\\begin{flushright}\n\\textbf{${tex(s.name)}}\\\\\n${tex(s.address).replace(/\n/g,'\\\\\n')}\\\\\n${tex(s.phone)}\\\\\n${tex(s.email)}\n\\end{flushright}\n\\vspace{1.2em}\n\\begin{flushright}${tex(d.date)}\\end{flushright}\n\\vspace{0.5em}\n\\textbf{${tex(d.recipient)}}\\\\\n${tex(d.address).replace(/\n/g,'\\\\\n')}\n\\vspace{4.5em}\n\\textbf{${prefix}} ${tex(d.subject)}\n\\vspace{2.2em}\n${tex(d.opening)}\n\\vspace{1.4em}\n\\justifying\n${tex(d.body).replace(/\n\n/g,'\\par\\vspace{0.7em}\n').replace(/\n/g,' ')}\n\\vspace{0.9em}\n\\begin{center}${tex(d.closing)}\\end{center}\n\\vspace{2.2em}\n\\begin{flushright}\\textbf{${tex(s.name)}}${s.subtitle?`\\\\${tex(s.subtitle)}`:''}\\end{flushright}\n\\end{document}`}
  const dl=(n,t)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/plain'}));a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)};
  document.querySelector('#tex').onclick=()=>dl(`Carta_${lang.toUpperCase()}.tex`,latex());document.querySelector('#pdf').onclick=()=>window.print();fill();
})();