(() => {
  const KEY='joseluis-cv-builder-v2';
  const MODE_KEY='joseluis-cv-builder-mode-v1';
  const blank=()=>({_blankMode:true,basics:{name:'',label:'',email:'',phone:'',url:'',summary:'',location:{address:''},photo:''},work:[],education:[],volunteer:[],skills:[],languages:[],interestsText:''});
  const stored=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return{}}};
  const mode=()=>localStorage.getItem(MODE_KEY)||'reference';
  const isBlankMode=()=>mode()==='blank';

  // Enforce the user's explicit choice before any visual reconciliation.
  if(isBlankMode() && !localStorage.getItem(KEY)){
    localStorage.setItem(KEY,JSON.stringify(blank()));
  }

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
    localStorage.setItem(MODE_KEY,'blank');
    localStorage.setItem(KEY,JSON.stringify(blank()));
    location.reload();
  });

  const restore=document.querySelector('#clear-data');
  if(restore)restore.onclick=()=>{
    if(!confirm('¿Restaurar los valores de referencia antiguos? Se reemplazarán los cambios guardados en este navegador.'))return;
    localStorage.setItem(MODE_KEY,'reference');
    localStorage.removeItem(KEY);
    location.reload();
  };

  // Importing a private base is an explicit choice to leave the empty reference state.
  document.querySelector('#import-private')?.addEventListener('change',()=>{
    localStorage.setItem(MODE_KEY,'custom');
  });

  document.querySelector('.editor')?.addEventListener('input',reconcile);
  document.querySelector('#template')?.addEventListener('change',reconcile);
  reconcile();
})();