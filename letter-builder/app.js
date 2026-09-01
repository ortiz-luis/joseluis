(() => {
  const KEY='joseluis-letter-builder-v3';
  const today=(lang)=>{
    const d=new Intl.DateTimeFormat(lang==='fr'?'fr-FR':'es-CL',{day:'numeric',month:'long',year:'numeric'}).format(new Date());
    return lang==='fr'?`Temuco, Chili, ${d}`:`Temuco de Chile, ${d}`;
  };
  const defaults=()=>({
    sender:{
      name:'Joseluis Esteban MORAGA NUÑEZ',
      address:'Cardenal José María Caro 1340\nJuan Pablo II, Temuco - Chile',
      phone:'+56 9 30 24 95 67',
      email:'j.moraga03@ufromail.cl',
      subtitle:'Sociólogo',
      signatureNote:''
    },
    es:{date:today('es'),recipient:'Comité de selección',address:'',subject:'Candidatura',opening:'Estimado Señor o Señora,',body:'Me dirijo a ustedes para presentar mi candidatura y expresar mi interés en esta oportunidad. Soy sociólogo formado en la Universidad de La Frontera, con experiencia académica internacional a través de un semestre de estudios en Sciences Po Rennes.\n\nMi formación me ha permitido desarrollar un interés especial por la sociología política, la sociología histórica, la investigación social y el análisis de políticas públicas. Me interesa especialmente participar en contextos donde pueda combinar análisis riguroso, trabajo con información y comprensión de fenómenos sociales complejos.\n\nLa experiencia de estudiar en Francia reforzó además mi capacidad de adaptación a entornos internacionales y mi interés por continuar desarrollando mi trayectoria fuera de Chile. Considero que esta oportunidad sería una buena instancia para aportar mi formación, seguir adquiriendo experiencia práctica y trabajar con equipos diversos.\n\nAgradezco su tiempo y consideración. Quedo disponible para proporcionar cualquier información adicional que estimen necesaria y para conversar con mayor detalle sobre mi candidatura.',closing:'Sin nada más que agregar, espero su pronta respuesta y les envío saludos cordiales,'},
    fr:{date:today('fr'),recipient:'Comité de sélection',address:'',subject:'Candidature',opening:'Madame, Monsieur,',body:'Je vous adresse ma candidature afin de vous faire part de mon intérêt pour cette opportunité. Je suis sociologue diplômé de l’Universidad de La Frontera au Chili et j’ai également eu une expérience académique internationale grâce à un semestre d’études à Sciences Po Rennes.\n\nMa formation m’a permis de développer un intérêt particulier pour la sociologie politique, la sociologie historique, la recherche en sciences sociales et l’analyse des politiques publiques. Je souhaite notamment évoluer dans des environnements où je peux mobiliser des capacités d’analyse rigoureuses, travailler avec des informations complexes et contribuer à la compréhension de phénomènes sociaux.\n\nMon expérience d’études en France a également renforcé ma capacité d’adaptation à un contexte international et mon souhait de poursuivre mon parcours professionnel à l’étranger. Cette opportunité représenterait pour moi l’occasion de mettre à profit ma formation, d’acquérir une expérience pratique supplémentaire et de travailler au sein d’équipes diverses.\n\nJe vous remercie pour l’attention portée à ma candidature et reste à votre disposition pour toute information complémentaire ou pour un entretien.',closing:'Dans l’attente de votre réponse, je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées,'}
  });
  const merge=saved=>{const d=defaults();if(!saved||typeof saved!=='object')return d;return{sender:{...d.sender,...(saved.sender||{})},es:{...d.es,...(saved.es||{})},fr:{...d.fr,...(saved.fr||{})}}};
  const load=()=>{try{return merge(JSON.parse(localStorage.getItem(KEY)))}catch{return defaults()}};
  let letters=load(),lang='es';
  const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tex=s=>String(s??'').replace(/\\/g,'\\textbackslash{}').replace(/([#$%&_{}])/g,'\\$1').replace(/\^/g,'\\textasciicircum{}').replace(/~/g,'\\textasciitilde{}');
  const save=()=>localStorage.setItem(KEY,JSON.stringify(letters));
  const letterIds=['date','recipient','address','subject','opening','body','closing'];
  const smap={'sender-name':'name','sender-address':'address','sender-phone':'phone','sender-email':'email','sender-subtitle':'subtitle','sender-note':'signatureNote'};
  function fill(){const d=letters[lang];letterIds.forEach(id=>{const el=document.querySelector('#'+id);if(el)el.value=d[id]||''});Object.entries(smap).forEach(([id,k])=>{const el=document.querySelector('#'+id);if(el)el.value=letters.sender[k]||''});render()}
  letterIds.forEach(id=>document.querySelector('#'+id)?.addEventListener('input',e=>{letters[lang][id]=e.target.value;save();render()}));
  Object.entries(smap).forEach(([id,k])=>document.querySelector('#'+id)?.addEventListener('input',e=>{letters.sender[k]=e.target.value;save();render()}));
  document.querySelector('#lang')?.addEventListener('change',e=>{lang=e.target.value;fill()});
  document.querySelector('#import')?.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const data=JSON.parse(r.result),next=defaults();if(data.cv?.basics){const b=data.cv.basics;next.sender={...next.sender,name:b.name||next.sender.name,address:b.location?.address||next.sender.address,phone:b.phone||next.sender.phone,email:b.email||next.sender.email,subtitle:b.label||next.sender.subtitle}}if(data.letters){next.es={...next.es,...(data.letters.es||{})};next.fr={...next.fr,...(data.letters.fr||{})}}else{if(data.es)next.es={...next.es,...data.es};if(data.fr)next.fr={...next.fr,...data.fr}}letters=next;save();fill()}catch{alert('Archivo de importación no válido')}};r.readAsText(f)});
  function paras(text){return h(text).split(/\n\s*\n/).filter(Boolean).map(x=>`<p>${x.replace(/\n/g,'<br>')}</p>`).join('')}
  function render(){
    const d=letters[lang],s=letters.sender,label=lang==='fr'?'Objet :':'Asunto:';
    document.querySelector('#preview').innerHTML=`
      <div class="sender-block">
        <strong>${h(s.name)}</strong>
        <span class="address-line">⌖ ${h((s.address||'').split('\n')[0]||'')}</span>
        ${(s.address||'').split('\n').slice(1).map(x=>`<span>${h(x)}</span>`).join('')}
        ${s.phone?`<span>☎ ${h(s.phone)}</span>`:''}
        ${s.email?`<span>✉ ${h(s.email)}</span>`:''}
        <div class="sender-date">${h(d.date)}</div>
      </div>
      <div class="recipient-block"><strong>${h(d.recipient)}</strong>${d.address?`<span>${h(d.address).replace(/\n/g,'<br>')}</span>`:''}</div>
      <div class="letter-spacer"></div>
      <div class="subject-row"><span>${label}</span><div>${h(d.subject)}</div></div>
      <div class="opening">${h(d.opening)}</div>
      <div class="body">${paras(d.body)}</div>
      <div class="closing-block"><div class="closing">${h(d.closing)}</div><div class="signature-name">${h(s.name)}</div>${s.subtitle?`<div>${h(s.subtitle)}</div>`:''}${s.signatureNote?`<div>${h(s.signatureNote)}</div>`:''}</div>`;
  }
  function splitName(name){const n=String(name||'').trim();const known=n.match(/^(Joseluis Esteban)\s+(MORAGA NUÑEZ)$/i);if(known)return[known[1],known[2]];const a=n.split(/\s+/);if(a.length<2)return[n,''];return[a.slice(0,-2).join(' ')||a[0],a.slice(-2).join(' ')]}
  function latex(){
    const d=letters[lang],s=letters.sender,[first,family]=splitName(s.name),addr=(s.address||'').split('\n'),street=addr[0]||'',city=addr.slice(1).join(' '),subjectLabel=lang==='fr'?'Objet :':'Asunto:';
    const recipientAddress=tex(d.address).replace(/\n/g,'\\\\\n');
    const body=String(d.body||'').split(/\n\s*\n/).map(p=>tex(p).replace(/\n/g,' ')).join('\n\n\\smallskip\n\n');
    return `\\documentclass[12pt,a4paper,sans]{moderncv}\n\\moderncvstyle{classic}\n\\moderncvcolor{blue}\n\\nopagenumbers{}\n\\usepackage{etoolbox}\n\\usepackage[utf8]{inputenc}\n\n\\makeatletter\n\\renewcommand*{\\recomputeletterlengths}{%\n\\recomputecvlengths%\n\\setlength{\\parskip}{6\\p@}}\n\\newcommand*{\\subject}[1]{\\def\\@subject{#1}}\n\\renewcommand*{\\makelettertitle}{%\n\\recomputeletterlengths%\n\\hfill%\n\\begin{minipage}{.375\\textwidth}%\n\\raggedright%\n\\addressfont\\textcolor{color2}{%\n  {\\bfseries\\upshape\\@firstname~\\@familyname}\\@firstdetailselementfalse%\n  \\ifthenelse{\\isundefined{\\@addressstreet}}{}{\\makenewline\\addresssymbol\\@addressstreet%\n  \\ifthenelse{\\equal{\\@addresscity}{}}{}{\\makenewline\\@addresscity}}%\n  \\ifthenelse{\\isundefined{\\@homepage}}{}{\\makenewline\\mobilesymbol\\@homepage}%\n  \\ifthenelse{\\isundefined{\\@email}}{}{\\makenewline\\emailsymbol\\emaillink{\\@email}}%\n  \\ifthenelse{\\isundefined{\\@extrainfo}}{}{\\makenewline\\@extrainfo}}%\n  \\\\[2em]%\n  \\@date\\\\[1.5em]%\n\\end{minipage}\\vspace{0em}%\n\\begin{minipage}[t]{0.34\\textwidth}\n\\raggedright%\n\\addressfont%\n{\\bfseries\\upshape\\@recipientname}\\\\%\n\\@recipientaddress\n\\end{minipage}\n\\hfill\n\\null\\\\[5em]%\n\\ifthenelse{\\isundefined{\\@subject}}{}{%\n\\begin{tabular}{ p{0.08\\textwidth} p{0.92\\textwidth} }\n${subjectLabel} & \\raggedright \\@subject\n\\end{tabular}\n\\\\[1.5em]}%\n\\@opening\\\\[1.5em]%\n\\hspace{0pt}\\par\\vspace{-\\baselineskip}\\vspace{-\\parskip}}\n\\renewcommand*{\\makeletterclosing}{\n\\@closing\\\\[3em]%\n{\\bfseries \\@firstname~\\@familyname}%\n\\ifthenelse{\\isundefined{\\@enclosure}}{}{%\n\\\\%\n\\vfill%\n{\\color{color2}\\itshape\\enclname: \\@enclosure}}}\n\\makeatother\n\\patchcmd{\\makeletterclosing}{\\@closing}{\\raggedleft \\@closing}{}{}\n\\makeatother\n\\usepackage[top=1.5cm, bottom=1cm, left=2cm, right=2cm]{geometry}\n\\setlength{\\hintscolumnwidth}{3cm}\n\\firstname{${tex(first)}}\n\\familyname{${tex(family)}}\n\\address{${tex(street)}}{${tex(city)}}\n\\homepage{${tex(s.phone).replace(/ /g,'~')}}\n\\email{${tex(s.email)}}\n\\begin{document}\n\\recipient{${tex(d.recipient)}}{${recipientAddress}}\n\\date{${tex(d.date)}}\n\\subject{${tex(d.subject)}}\n\\opening{${tex(d.opening)}}\n\\closing{${tex(d.closing)}}\n\\makelettertitle\n\n${body}\n\n\\makeletterclosing\n${s.subtitle?`\\\\${tex(s.subtitle)}`:''}${s.signatureNote?`\n\\\\${tex(s.signatureNote)}`:''}\n\\end{document}`;
  }
  const dl=(n,t)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/plain'}));a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)};
  document.querySelector('#tex').onclick=()=>dl(`Carta_${lang.toUpperCase()}.tex`,latex());
  document.querySelector('#pdf').onclick=()=>window.print();
  save();fill();
})();