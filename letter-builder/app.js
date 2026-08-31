(() => {
  const KEY='joseluis-letter-builder-v1';
  const blank=()=>({es:{date:'',recipient:'',address:'',subject:'',opening:'Estimado Señor o Señora,',body:'',closing:'Saludos cordiales,'},fr:{date:'',recipient:'',address:'',subject:'',opening:'Madame, Monsieur,',body:'',closing:'Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations respectueuses,'}});
  let letters=load();let lang='es';
  function load(){try{return JSON.parse(localStorage.getItem(KEY))||blank()}catch{return blank()}}
  function save(){localStorage.setItem(KEY,JSON.stringify(letters))}
  const ids=['date','recipient','address','subject','opening','body','closing'];
  const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tex=s=>String(s??'').replace(/\\/g,'\\textbackslash{}').replace(/([#$%&_{}])/g,'\\$1').replace(/\^/g,'\\textasciicircum{}').replace(/~/g,'\\textasciitilde{}');
  function fill(){const d=letters[lang]||{};ids.forEach(id=>document.querySelector('#'+id).value=d[id]||'');render()}
  ids.forEach(id=>document.querySelector('#'+id).oninput=e=>{letters[lang][id]=e.target.value;save();render()});
  document.querySelector('#lang').onchange=e=>{lang=e.target.value;fill()};
  document.querySelector('#import').onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const data=JSON.parse(r.result);if(data.letters)letters={...blank(),...data.letters};else if(data.es||data.fr)letters={...blank(),...data};else throw new Error();save();fill()}catch{alert('Archivo de importación no válido')}};r.readAsText(f)};
  function render(){const d=letters[lang];document.querySelector('#preview').innerHTML=`<div class="recipient"><strong>${h(d.recipient)}</strong>${d.address?`\n${h(d.address)}`:''}</div><div class="date">${h(d.date)}</div>${d.subject?`<div class="subject">${h(d.subject)}</div>`:''}<p>${h(d.opening)}</p><div class="body">${h(d.body)}</div><div class="closing">${h(d.closing)}<br><br>Joseluis Moraga</div>`}
  function latex(){const d=letters[lang];return `\\documentclass[11pt,a4paper]{letter}\n\\usepackage[utf8]{inputenc}\n\\usepackage[T1]{fontenc}\n\\usepackage[margin=2.3cm]{geometry}\n\\signature{Joseluis Moraga}\n\\begin{document}\n\\begin{letter}{${tex(d.recipient)}\\\\${tex(d.address).replace(/\n/g,'\\\\')}}\n\\date{${tex(d.date)}}\n\\opening{${tex(d.opening)}}\n${d.subject?`\\textbf{${tex(d.subject)}}\\\\[1em]\n`:''}${tex(d.body).replace(/\n\n/g,'\\par\n')}\n\\closing{${tex(d.closing)}}\n\\end{letter}\n\\end{document}`}
  const dl=(n,t)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/plain'}));a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)};
  document.querySelector('#tex').onclick=()=>dl(`Carta_${lang.toUpperCase()}.tex`,latex());document.querySelector('#pdf').onclick=()=>window.print();fill();
})();