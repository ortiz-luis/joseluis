(() => {
  const THEME_KEY='postula-theme-v1';
  const item=nav.find(x=>x[0]==='profile');
  if(item){item[1]='⚙';item[2]='Cuenta'}

  const session=()=>window.postulaAuth?.getSession?.()||null;
  const user=()=>session()?.user||null;
  const theme=()=>localStorage.getItem(THEME_KEY)||'light';
  const applyTheme=t=>{document.documentElement.dataset.theme=t;localStorage.setItem(THEME_KEY,t)};
  applyTheme(theme());

  profilePage=function(){
    const u=user();
    const email=u?.email||'Cargando…';
    const dark=theme()==='dark';
    return `<section class="page account-page"><div class="page-head compact"><h1>Cuenta</h1><div class="account-head-actions"><button type="button" class="account-signout-button" data-account-signout aria-label="Cerrar sesión"><span class="door-icon">↪</span><span>Salir</span></button><label class="theme-toggle"><span>Claro</span><input type="checkbox" data-theme-toggle ${dark?'checked':''}><i></i><span>Oscuro</span></label></div></div><div class="profile-app account-app"><div><span>Email</span><strong>${esc(email)}</strong></div><div><span>Sesión</span><strong>${u?'Iniciada':'Comprobando…'}</strong></div><div><span>Documentos</span><strong>Guardados de forma privada en tu cuenta</strong></div></div></section>`;
  };

  const priorBind=bind;
  bind=function(){
    priorBind();
    const b=document.querySelector('[data-account-signout]');
    if(b)b.onclick=()=>window.postulaAuth?.signOut?.();
    const t=document.querySelector('[data-theme-toggle]');
    if(t)t.onchange=()=>{applyTheme(t.checked?'dark':'light');if(route().page==='profile')render()};
  };

  render();
  let tries=0;
  const refreshAccount=()=>{
    if(window.postulaAuth?.getSession?.()?.user){if(route().page==='profile')render();return;}
    if(++tries<30)setTimeout(refreshAccount,150);
  };
  refreshAccount();
})();