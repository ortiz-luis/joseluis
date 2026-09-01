(() => {
  const item=nav.find(x=>x[0]==='profile');
  if(item){item[1]='⚙';item[2]='Cuenta'}

  const session=()=>window.postulaAuth?.getSession?.()||null;
  const user=()=>session()?.user||null;

  profilePage=function(){
    const u=user();
    const email=u?.email||'Cargando…';
    return `<section class="page account-page"><div class="page-head compact"><h1>Cuenta</h1></div><div class="profile-app account-app"><div><span>Email</span><strong>${esc(email)}</strong></div><div><span>Sesión</span><strong>${u?'Iniciada':'Comprobando…'}</strong></div><div><span>Documentos</span><strong>Guardados de forma privada en tu cuenta</strong></div></div></section>`;
  };

  render();
  let tries=0;
  const refreshAccount=()=>{
    if(window.postulaAuth?.getSession?.()?.user){if(route().page==='profile')render();return;}
    if(++tries<30)setTimeout(refreshAccount,150);
  };
  refreshAccount();
})();