(() => {
  let people=null,loading=false;
  const session=()=>window.postulaAuth?.getSession?.()||null;
  const info=()=>window.postulaWorkspace?.info?.()||null;

  async function refreshPeople(){
    const i=info();if(!i?.isAdmin||loading)return;
    loading=true;
    try{people=await window.postulaWorkspace.listPeople()}catch(err){console.error(err)}finally{loading=false;if(route().page==='profile')render()}
  }
  const roleLabel=i=>i?.isAdmin?'Administrador':'Usuario';
  const memberRows=()=>{
    if(!people)return '<div class="account-muted">Cargando usuarios…</div>';
    const me=session()?.user?.id;
    return (people.members||[]).map(p=>`<div class="account-member"><div><strong>${esc(p.display_name||p.email||'Usuario')}</strong><span>${esc(p.email||'')}</span></div><span class="account-role">${p.memberRole==='admin'?'Admin':'Miembro'}</span>${p.user_id!==me?`<button type="button" class="account-member-remove" data-workspace-remove="${esc(p.user_id)}" title="Quitar acceso" aria-label="Quitar acceso">×</button>`:''}</div>`).join('')||'<div class="account-muted">Sin miembros adicionales.</div>';
  };

  profilePage=function(){
    const u=session()?.user,i=info(),email=u?.email||'Cargando…';
    const admin=i?.isAdmin?`<section class="account-section"><div class="account-section-head"><div><h2>Espacio actual</h2><p>${esc(i.workspaceName||'Postulaciones')}</p></div></div><div class="account-member-list">${memberRows()}</div><div class="account-muted" style="margin-top:12px">Las cuentas nuevas reciben su propio espacio. Para verlas o cambiar entre espacios usa <strong>Administración</strong>.</div></section>`:'';
    return `<section class="page account-page"><div class="page-head compact"><h1>Cuenta</h1></div><div class="profile-app account-app"><div><span>Email</span><strong>${esc(email)}</strong></div><div><span>Rol</span><strong>${roleLabel(i)}</strong></div><div><span>Espacio</span><strong>${esc(i?.workspaceName||'Sin acceso asignado')}</strong></div><div><span>Documentos</span><strong>${i?.isAdmin?'Acceso de superusuario según el espacio seleccionado':'Sólo los del espacio autorizado'}</strong></div></div>${admin}<div style="margin-top:18px"><button type="button" class="button soft" data-account-signout>Cerrar sesión</button></div></section>`;
  };

  const previousBind=bind;
  bind=function(){
    previousBind();
    document.querySelectorAll('[data-workspace-remove]').forEach(btn=>btn.onclick=async e=>{e.preventDefault();if(!confirm('¿Quitar el acceso de este usuario al espacio?'))return;btn.disabled=true;try{people=await window.postulaWorkspace.removeMember(btn.dataset.workspaceRemove);render()}catch(err){alert(err.message);btn.disabled=false}});
    document.querySelectorAll('[data-account-signout]').forEach(btn=>btn.onclick=async e=>{e.preventDefault();btn.disabled=true;btn.textContent='Saliendo…';try{await window.postulaAuth?.signOut?.()}catch{btn.disabled=false;btn.textContent='Cerrar sesión'}});
  };

  window.addEventListener('postula-workspace-ready',()=>{if(info()?.isAdmin)refreshPeople();if(route().page==='profile')render()});
  let tries=0;const boot=()=>{if(info()){if(info().isAdmin)refreshPeople();if(route().page==='profile')render()}else if(++tries<60)setTimeout(boot,150)};boot();
})();