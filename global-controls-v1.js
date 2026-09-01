(() => {
  const THEME_KEY='postula-theme-v1';
  const theme=()=>localStorage.getItem(THEME_KEY)||'light';
  const applyTheme=t=>{document.documentElement.dataset.theme=t;localStorage.setItem(THEME_KEY,t)};
  applyTheme(theme());

  function mount(){
    const topbar=document.querySelector('.topbar');
    if(!topbar)return;
    let controls=topbar.querySelector('.global-controls');
    if(!controls){
      controls=document.createElement('div');
      controls.className='global-controls';
      controls.innerHTML=`<button type="button" class="account-signout-button" data-global-signout aria-label="Cerrar sesión"><span class="door-icon">↪</span><span>Salir</span></button><label class="theme-toggle"><span>Claro</span><input type="checkbox" data-global-theme><i></i><span>Oscuro</span></label>`;
      topbar.appendChild(controls);
    }
    const toggle=controls.querySelector('[data-global-theme]');
    toggle.checked=theme()==='dark';
    toggle.onchange=()=>applyTheme(toggle.checked?'dark':'light');
    const out=controls.querySelector('[data-global-signout]');
    out.onclick=()=>window.postulaAuth?.signOut?.();
  }

  mount();
  const timer=setInterval(()=>{mount();if(window.postulaAuth?.signOut)clearInterval(timer)},200);
})();