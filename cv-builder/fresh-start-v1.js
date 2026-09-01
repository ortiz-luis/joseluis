(() => {
  const KEY='joseluis-cv-builder-v2';
  const SESSION_MODE='joseluis-cv-builder-session-mode-v2';
  const RELOAD_FLAG='joseluis-cv-builder-blank-reload-v1';
  const LEGACY_MODE='joseluis-cv-builder-mode-v1';

  const blank=()=>({basics:{name:'',label:'',email:'',phone:'',url:'',summary:'',location:{address:''},photo:''},work:[],education:[],volunteer:[],skills:[],languages:[],interestsText:''});

  // Migration from the previous implementation: its persistent blank flag was a bug.
  // If found, discard that state so reopening the builder restores the historical reference.
  const legacyMode=localStorage.getItem(LEGACY_MODE);
  if(legacyMode==='blank'){
    localStorage.removeItem(KEY);
  }
  localStorage.removeItem(LEGACY_MODE);

  const isBlankSession=()=>sessionStorage.getItem(SESSION_MODE)==='blank';

  const stripDefaultPhoto=()=>{
    if(!isBlankSession())return;
    const p=document.querySelector('#preview');
    if(!p)return;
    p.querySelectorAll('.cv-photo').forEach(el=>el.remove());
    p.querySelectorAll('.legacy-photo').forEach(el=>{
      if(el.tagName==='IMG'){
        const d=document.createElement('div');
        d.className='legacy-photo placeholder blank-photo';
        d.textContent='';
        el.replaceWith(d);
      }else{
        el.textContent='';
        el.classList.add('blank-photo');
      }
    });
  };
  const reconcile=()=>setTimeout(stripDefaultPhoto,0);

  document.querySelector('#start-fresh')?.addEventListener('click',()=>{
    if(!confirm('¿Empezar el CV desde cero? Esta vista se vaciará temporalmente, incluida la foto. Al salir y volver a entrar se restaurarán los valores de referencia.'))return;
    sessionStorage.setItem(SESSION_MODE,'blank');
    sessionStorage.setItem(RELOAD_FLAG,'1');
    localStorage.setItem(KEY,JSON.stringify(blank()));
    location.reload();
  });

  const restore=document.querySelector('#clear-data');
  if(restore)restore.onclick=()=>{
    if(!confirm('¿Restaurar ahora los valores de referencia antiguos?'))return;
    sessionStorage.removeItem(SESSION_MODE);
    sessionStorage.setItem(RELOAD_FLAG,'1');
    localStorage.removeItem(KEY);
    location.reload();
  };

  // Importing a base or loading a new photo turns the current work into a normal custom edit.
  document.querySelector('#import-private')?.addEventListener('change',()=>sessionStorage.removeItem(SESSION_MODE));
  document.querySelector('#photo-input')?.addEventListener('change',()=>sessionStorage.removeItem(SESSION_MODE));

  document.querySelector('.editor')?.addEventListener('input',reconcile);
  document.querySelector('#template')?.addEventListener('change',reconcile);
  reconcile();

  // Blank mode is session-only. Preserve it through the single reload used to enter/restore it,
  // but discard it when the user actually leaves the builder. The next visit starts from defaults.
  window.addEventListener('pagehide',()=>{
    if(sessionStorage.getItem(RELOAD_FLAG)==='1'){
      sessionStorage.removeItem(RELOAD_FLAG);
      return;
    }
    if(isBlankSession()){
      localStorage.removeItem(KEY);
      sessionStorage.removeItem(SESSION_MODE);
    }
  });
})();