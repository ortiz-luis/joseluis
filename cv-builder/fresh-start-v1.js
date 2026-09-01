(() => {
  const KEY='joseluis-cv-builder-v2';
  const blank=()=>({_blankMode:true,basics:{name:'',label:'',email:'',phone:'',url:'',summary:'',location:{address:''},photo:''},work:[],education:[],volunteer:[],skills:[],languages:[],interestsText:''});
  const stored=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return{}}};
  const isBlankMode=()=>!!stored()._blankMode&&!stored()?.basics?.photo;
  const stripDefaultPhoto=()=>{
    if(!isBlankMode())return;
    const p=document.querySelector('#preview');if(!p)return;
    p.querySelectorAll('.cv-photo').forEach(el=>el.remove());
    p.querySelectorAll('.legacy-photo').forEach(el=>{
      if(el.tagName==='IMG'){
        const d=document.createElement('div');d.className='legacy-photo placeholder blank-photo';d.textContent='';el.replaceWith(d);
      }else{el.textContent='';el.classList.add('blank-photo')}
    });
  };
  const reconcile=()=>setTimeout(stripDefaultPhoto,0);
  document.querySelector('#start-fresh')?.addEventListener('click',()=>{
    if(!confirm('¿Empezar el CV desde cero? Se vaciarán todos los campos guardados en este navegador, incluida la foto.'))return;
    localStorage.setItem(KEY,JSON.stringify(blank()));
    location.reload();
  });
  const restore=document.querySelector('#clear-data');
  if(restore)restore.onclick=()=>{
    if(!confirm('¿Restaurar los valores de referencia antiguos? Se reemplazarán los cambios guardados en este navegador.'))return;
    localStorage.removeItem(KEY);
    location.reload();
  };
  document.querySelector('#photo-input')?.addEventListener('change',()=>setTimeout(()=>{
    const d=stored();if(d?.basics?.photo){d._blankMode=false;localStorage.setItem(KEY,JSON.stringify(d))}
  },50));
  document.querySelector('.editor')?.addEventListener('input',reconcile);
  document.querySelector('#template')?.addEventListener('change',reconcile);
  reconcile();
})();