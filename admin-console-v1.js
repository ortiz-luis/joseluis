(() => {
  let workspaces=null,loading=false;
  const info=()=>window.postulaWorkspace?.info?.()||null;
  const isAdmin=()=>!!info()?.isAdmin;
  const session=()=>window.postulaAuth?.getSession?.()||null;

  const adminIcon=()=>'<svg viewBox="0 0 24 24" aria-hidden="true" style="width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round"><path d="M12 3 4 6v5c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>';

  async function refreshWorkspaces(){
    if(!isAdmin()||loading)return;
    loading=true;
    try{workspaces=await window.postulaWorkspace.listWorkspaces()}catch(err){console.error(err);workspaces=[]}
    finally{loading=false;if(route().page==='admin')render()}
  }

  function adminPage(){
    if(!isAdmin())return '<section class="page final-page"><h1>Sin acceso</h1><p>Esta sección sólo está disponible para el administrador.</p></section>';
    const i=info(),u=session()?.user,ws=workspaces||[];
    const users=new Set(ws.flatMap(w=>(w.members||[]).map(m=>m.user_id))).size;
    return `<section class="page final-page admin-console">
      <div class="final-page-head"><div><span class="admin-eyebrow">SUPERUSUARIO</span><h1>Administración</h1><p class="admin-lead">Herramientas del sistema que los usuarios normales no ven.</p></div></div>
      <div class="admin-summary-grid">
        <div class="admin-stat"><span>Espacios</span><strong>${ws.length}</strong></div>
        <div class="admin-stat"><span>Usuarios</span><strong>${users}</strong></div>
        <div class="admin-stat"><span>Espacio actual</span><strong>${esc(i?.workspaceName||'—')}</strong></div>
      </div>
      <section class="admin-card"><div class="admin-card-head"><div><h2>Espacios</h2><p>Tu cuenta puede entrar a cualquier espacio. Un usuario normal sólo ve el suyo.</p></div></div>
        <div class="admin-workspace-list">${loading&&!ws.length?'<div class="account-muted">Cargando…</div>':ws.map(w=>{
          const active=w.id===i?.workspaceId;
          const owner=(w.members||[]).find(m=>m.user_id===w.created_by)?.profile;
          return `<div class="admin-workspace-row ${active?'active':''}"><div><strong>${esc(w.name)}</strong><span>${esc(owner?.email||'Sin propietario visible')} · ${(w.members||[]).length} usuario(s)</span></div>${active?'<span class="admin-current">Actual</span>':`<button class="button soft" data-admin-workspace="${esc(w.id)}">Abrir</button>`}</div>`
        }).join('')||'<div class="account-muted">No hay espacios.</div>'}</div>
      </section>
      <section class="admin-card"><div class="admin-card-head"><div><h2>Diagnóstico</h2><p>Información técnica reservada para ti.</p></div></div>
        <div class="admin-diagnostic">
          <div><span>Cuenta</span><strong>${esc(u?.email||'—')}</strong></div>
          <div><span>Rol</span><strong>Administrador</strong></div>
          <div><span>Workspace ID</span><code>${esc(i?.workspaceId||'—')}</code></div>
          <div><span>Sincronización</span><strong>${window.postulaWorkspace?.isReady?.()?'Lista':'Cargando'}</strong></div>
          <div><span>Oportunidades</span><strong>${state?.opportunities?.length||0}</strong></div>
          <div><span>Documentos cargados</span><strong>${state?.documents?.filter?.(d=>d.status==='ready').length||0}</strong></div>
        </div>
      </section>
      <section class="admin-card"><div class="admin-card-head"><div><h2>Prueba de permisos</h2><p>Para comprobar la experiencia real del usuario normal, cierra sesión y entra con tu segundo correo. La sección Administración y los controles de sistema desaparecerán.</p></div></div></section>
    </section>`;
  }

  const previousRenderNav=renderNav;
  renderNav=function(){
    previousRenderNav();
    if(!isAdmin())return;
    ['#desktop-nav','#mobile-nav'].forEach(sel=>{
      const navEl=document.querySelector(sel);if(!navEl||navEl.querySelector('[data-admin-nav]'))return;
      navEl.insertAdjacentHTML('beforeend',`<a data-admin-nav class="nav-link ${route().page==='admin'?'active':''}" href="#admin"><span class="nav-icon">${adminIcon()}</span><span>Administración</span></a>`);
    });
  };

  const previousRender=render;
  render=function(){
    if(route().page==='admin'){
      renderNav();document.querySelector('#main').innerHTML=adminPage();bind();bindAdmin();return;
    }
    previousRender();
    enforceRoleUI();
  };

  function enforceRoleUI(){
    if(isAdmin())return;
    document.querySelectorAll('[data-action="add-opp"]').forEach(x=>x.remove());
    document.querySelectorAll('[data-admin-nav]').forEach(x=>x.remove());
  }
  function bindAdmin(){
    document.querySelectorAll('[data-admin-workspace]').forEach(btn=>btn.onclick=async()=>{
      btn.disabled=true;btn.textContent='Abriendo…';
      try{await window.postulaWorkspace.switchWorkspace(btn.dataset.adminWorkspace);workspaces=await window.postulaWorkspace.listWorkspaces();location.hash='#home';render()}
      catch(err){alert('No se pudo abrir el espacio: '+err.message);btn.disabled=false;btn.textContent='Abrir'}
    });
  }

  const oldAddOpp=typeof addOpp==='function'?addOpp:null;
  if(oldAddOpp){window.addOpp=function(){if(!isAdmin()){alert('Sólo el administrador puede crear oportunidades.');return;}return oldAddOpp()}}

  window.addEventListener('postula-workspace-ready',()=>{if(isAdmin())refreshWorkspaces();enforceRoleUI();render()});
  window.addEventListener('hashchange',()=>{if(route().page==='admin'&&isAdmin()&&!workspaces)refreshWorkspaces()});
  let tries=0;const boot=()=>{if(info()){if(isAdmin())refreshWorkspaces();enforceRoleUI()}else if(++tries<80)setTimeout(boot,150)};boot();
})();