(()=>{
  const route=()=>{const [page='home']=location.hash.replace(/^#/,'').split('/');return page||'home'};
  const info=()=>window.postulaWorkspace?.info?.()||null;
  const session=()=>window.postulaAuth?.getSession?.()||null;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const displayName=()=>{
    const i=info(),u=session()?.user,meta=u?.user_metadata||{};
    return String(i?.profile?.display_name||meta.display_name||meta.full_name||u?.email||'Cuenta').trim();
  };
  async function signOut(btn){
    if(btn){btn.disabled=true;btn.textContent='Saliendo…'}
    try{await window.postulaAuth?.signOut?.()}catch(err){console.error(err);if(btn){btn.disabled=false;btn.textContent='Cerrar sesión'}}
  }
  function renderFooter(){
    const foot=document.querySelector('.sidebar-foot');if(!foot)return;
    foot.innerHTML=`<a class="ux-account" href="#profile"><span>${esc(displayName())}</span></a><button type="button" class="ux-signout" data-session-signout aria-label="Cerrar sesión"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5M14 8l4 4-4 4M18 12H8"/></svg><span>Cerrar sesión</span></button>`;
    const btn=foot.querySelector('[data-session-signout]');if(btn)btn.onclick=()=>signOut(btn);
  }
  function ensureAccountSignout(){
    const page=document.querySelector('.account-page');if(!page||page.querySelector('[data-account-signout]'))return;
    const box=document.createElement('section');box.className='account-signout-section';
    box.innerHTML='<button type="button" class="account-signout-button" data-account-signout>Cerrar sesión</button>';
    page.appendChild(box);
    const btn=box.querySelector('[data-account-signout]');if(btn)btn.onclick=()=>signOut(btn);
  }
  let guardTimer=null;
  function guardAdmin(){
    clearTimeout(guardTimer);
    if(route()!=='admin'||info())return;
    guardTimer=setTimeout(async()=>{
      if(route()!=='admin'||info())return;
      let error=null;
      try{await window.postulaWorkspace?.reload?.()}catch(err){error=err;console.error(err)}
      if(info())return;
      setTimeout(()=>{
        if(route()!=='admin'||info())return;
        const main=document.querySelector('#main');if(!main)return;
        main.innerHTML=`<section class="page final-page admin-load-error"><h1>No se pudo cargar Administración</h1><p>${esc(error?.message||'La sesión está iniciada, pero no fue posible cargar los permisos del espacio.')}</p><div class="admin-load-actions"><button type="button" class="button primary" data-admin-retry>Reintentar</button><button type="button" class="button soft" data-admin-signout>Cerrar sesión</button></div></section>`;
        const retry=main.querySelector('[data-admin-retry]');if(retry)retry.onclick=async()=>{retry.disabled=true;retry.textContent='Reintentando…';try{await window.postulaWorkspace?.reload?.();location.reload()}catch(err){alert('No se pudo cargar: '+err.message);retry.disabled=false;retry.textContent='Reintentar'}};
        const out=main.querySelector('[data-admin-signout]');if(out)out.onclick=()=>signOut(out);
      },700);
    },2500);
  }
  function refresh(){renderFooter();ensureAccountSignout();guardAdmin()}
  window.addEventListener('postula-workspace-ready',refresh);
  window.addEventListener('hashchange',()=>setTimeout(refresh,0));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh);else refresh();
  setTimeout(refresh,500);setTimeout(refresh,1600);
  const main=document.querySelector('#main');if(main)new MutationObserver(()=>ensureAccountSignout()).observe(main,{childList:true,subtree:true});
})();