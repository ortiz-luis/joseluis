(() => {
  const KEY='joseluis-letter-builder-v3';
  const today=(lang)=>new Intl.DateTimeFormat(lang==='fr'?'fr-FR':'es-CL',{day:'numeric',month:'long',year:'numeric'}).format(new Date());
  const defaults=()=>({
    sender:{
      name:'Joseluis Esteban MORAGA NUÑEZ',
      address:'Cardenal José María Caro 1340\nJuan Pablo II, Temuco - Chile',
      phone:'+56 9 30 24 95 67',
      email:'j.moraga03@ufromail.cl',
      subtitle:'Sociólogo',
      signatureNote:''
    },
    es:{
      date:today('es'),
      recipient:'Comité de selección',
      address:'',
      subject:'Candidatura',
      opening:'Estimado Señor o Señora,',
      body:'Me dirijo a ustedes para presentar mi candidatura y expresar mi interés en esta oportunidad. Soy sociólogo formado en la Universidad de La Frontera, con experiencia académica internacional a través de un semestre de estudios en Sciences Po Rennes.\n\nMi formación me ha permitido desarrollar un interés especial por la sociología política, la sociología histórica, la investigación social y el análisis de políticas públicas. Me interesa especialmente participar en contextos donde pueda combinar análisis riguroso, trabajo con información y comprensión de fenómenos sociales complejos.\n\nLa experiencia de estudiar en Francia reforzó además mi capacidad de adaptación a entornos internacionales y mi interés por continuar desarrollando mi trayectoria fuera de Chile. Considero que esta oportunidad sería una buena instancia para aportar mi formación, seguir adquiriendo experiencia práctica y trabajar con equipos diversos.\n\nAgradezco su tiempo y consideración. Quedo disponible para proporcionar cualquier información adicional que estimen necesaria y para conversar con mayor detalle sobre mi candidatura.',
      closing:'Sin nada más que agregar, espero su pronta respuesta y les envío saludos cordiales,'
    },
    fr:{
      date:today('fr'),
      recipient:'Comité de sélection',
      address:'',
      subject:'Candidature',
      opening:'Madame, Monsieur,',
      body:'Je vous adresse ma candidature afin de vous faire part de mon intérêt pour cette opportunité. Je suis sociologue diplômé de l’Universidad de La Frontera au Chili et j’ai également eu une expérience académique internationale grâce à un semestre d’études à Sciences Po Rennes.\n\nMa formation m’a permis de développer un intérêt particulier pour la sociologie politique, la sociologie historique, la recherche en sciences sociales et l’analyse des politiques publiques. Je souhaite notamment évoluer dans des environnements où je peux mobiliser des capacités d’analyse rigoureuses, travailler avec des informations complexes et contribuer à la compréhension de phénomènes sociaux.\n\nMon expérience d’études en France a également renforcé ma capacité d’adaptation à un contexte international et mon souhait de poursuivre mon parcours professionnel à l’étranger. Cette opportunité représenterait pour moi l’occasion de mettre à profit ma formation, d’acquérir une expérience pratique supplémentaire et de travailler au sein d’équipes diverses.\n\nJe vous remercie pour l’attention portée à ma candidature et reste à votre disposition pour toute information complémentaire ou pour un entretien.',
      closing:'Dans l’attente de votre réponse, je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées,'
    }
  });

  const merge=(saved)=>{
    const d=defaults();
    if(!saved||typeof saved!=='object')return d;
    return {sender:{...d.sender,...(saved.sender||{})},es:{...d.es,...(saved.es||{})},fr:{...d.fr,...(saved.fr||{})}};
  };
  const load=()=>{try{return merge(JSON.parse(localStorage.getItem(KEY)))}catch{return defaults()}};
  let letters=load();
  let lang='es';
  const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tex=s=>String(s??'').replace(/\\/g,'\\textbackslash{}').replace(/([#$%&_{}])/g,'\\$1').replace(/\^/g,'\\textasciicircum{}').replace(/~/g,'\\textasciitilde{}');
  const save=()=>localStorage.setItem(KEY,JSON.stringify(letters));
  const letterIds=['date','recipient','address','subject','opening','body','closing'];
  const senderIds=['sender-name','sender-address','sender-phone','sender-email','sender-subtitle','sender-note'];

  function fill(){
    const d=letters[lang];
    letterIds.forEach(id=>{const el=document.querySelector('#'+id);if(el)el.value=d[id]||''});
    const s=letters.sender;
    const smap={'sender-name':'name','sender-address':'address','sender-phone':'phone','sender-email':'email','sender-subtitle':'subtitle','sender-note':'signatureNote'};
    senderIds.forEach(id=>{const el=document.querySelector('#'+id);if(el)el.value=s[smap[id]]||''});
    render();
  }

  letterIds.forEach(id=>document.querySelector('#'+id)?.addEventListener('input',e=>{letters[lang][id]=e.target.value;save();render()}));
  const smap={'sender-name':'name','sender-address':'address','sender-phone':'phone','sender-email':'email','sender-subtitle':'subtitle','sender-note':'signatureNote'};
  senderIds.forEach(id=>document.querySelector('#'+id)?.addEventListener('input',e=>{letters.sender[smap[id]]=e.target.value;save();render()}));
  document.querySelector('#lang')?.addEventListener('change',e=>{lang=e.target.value;fill()});

  document.querySelector('#import')?.addEventListener('change',e=>{
    const f=e.target.files?.[0];if(!f)return;
    const r=new FileReader();
    r.onload=()=>{try{
      const data=JSON.parse(r.result);const next=defaults();
      if(data.cv?.basics){const b=data.cv.basics;next.sender={...next.sender,name:b.name||next.sender.name,address:b.location?.address||next.sender.address,phone:b.phone||next.sender.phone,email:b.email||next.sender.email,subtitle:b.label||next.sender.subtitle}}
      if(data.letters){next.es={...next.es,...(data.letters.es||{})};next.fr={...next.fr,...(data.letters.fr||{})}}
      else {if(data.es)next.es={...next.es,...data.es};if(data.fr)next.fr={...next.fr,...data.fr}}
      letters=next;save();fill();
    }catch{alert('Archivo de importación no válido')}};
    r.readAsText(f);
  });

  function paras(text){return h(text).split(/\n\s*\n/).filter(Boolean).map(x=>`<p>${x.replace(/\n/g,'<br>')}</p>`).join('')}
  function render(){
    const d=letters[lang],s=letters.sender,prefix=lang==='fr'?'Objet :':'Asunto:';
    document.querySelector('#preview').innerHTML=`
      <div class="sender"><strong>${h(s.name)}</strong><span>${h(s.address).replace(/\n/g,'<br>')}</span><span class="contact-line">✎ ${h(s.phone)}</span><span class="contact-line">✉ ${h(s.email)}</span></div>
      <div class="recipient-date-row"><div class="recipient"><strong>${h(d.recipient)}</strong>${d.address?`<span>${h(d.address).replace(/\n/g,'<br>')}</span>`:''}</div><div class="date">${h(d.date)}</div></div>
      <div class="subject"><span>${prefix}</span>${h(d.subject)}</div>
      <div class="opening">${h(d.opening)}</div>
      <div class="body">${paras(d.body)}</div>
      <div class="closing">${h(d.closing)}</div>
      <div class="signature"><strong>${h(s.name)}</strong>${s.subtitle?`<span>${h(s.subtitle)}</span>`:''}${s.signatureNote?`<span>${h(s.signatureNote)}</span>`:''}</div>`;
  }

  function latex(){
    const d=letters[lang],s=letters.sender,prefix=lang==='fr'?'Objet :':'Asunto:';
    return `\\documentclass[11pt,a4paper]{article}\n\\usepackage[utf8]{inputenc}\n\\usepackage[T1]{fontenc}\n\\usepackage[a4paper,top=1.55cm,bottom=1.8cm,left=2.0cm,right=2.0cm]{geometry}\n\\usepackage{ragged2e}\n\\pagestyle{empty}\n\\setlength{\\parindent}{0pt}\n\\begin{document}\n\\begin{flushright}\\textbf{${tex(s.name)}}\\\\${tex(s.address).replace(/\n/g,'\\\\')}\\\\${tex(s.phone)}\\\\${tex(s.email)}\\end{flushright}\n\\vspace{2.2em}\n\\noindent\\begin{minipage}[t]{0.52\\textwidth}\\textbf{${tex(d.recipient)}}\\\\${tex(d.address).replace(/\n/g,'\\\\')}\\end{minipage}\\hfill\\begin{minipage}[t]{0.43\\textwidth}\\raggedleft ${tex(d.date)}\\end{minipage}\n\\vspace{5.2em}\n${prefix}${tex(d.subject)}\n\\vspace{1.8em}\n${tex(d.opening)}\n\\vspace{1.2em}\n\\justifying ${tex(d.body).replace(/\n\n/g,'\\par\\vspace{0.65em}').replace(/\n/g,' ')}\n\\vspace{0.8em}\n\\begin{center}${tex(d.closing)}\\end{center}\n\\vspace{2.0em}\n\\begin{flushright}\\textbf{${tex(s.name)}}${s.subtitle?`\\\\${tex(s.subtitle)}`:''}${s.signatureNote?`\\\\${tex(s.signatureNote)}`:''}\\end{flushright}\n\\end{document}`;
  }

  const dl=(n,t)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/plain'}));a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)};
  document.querySelector('#tex').onclick=()=>dl(`Carta_${lang.toUpperCase()}.tex`,latex());
  document.querySelector('#pdf').onclick=()=>window.print();
  save();fill();
})();