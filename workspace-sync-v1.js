(() => {
  const SUPABASE_URL='https://qqzrpzjtvrbtkbhmdjmp.supabase.co';
  const SUPABASE_KEY='sb_publishable_-1TjOOzBlXwxaXuyOotQAg_c33AjzCN';
  let info=null,ready=false,saveTimer=null,saveWrapped=false;

  const token=()=>window.postulaAuth?.getAccessToken?.()||null;
  const headers=(extra={})=>({apikey:SUPABASE_KEY,Authorization:`Bearer ${token()}`,'Content-Type':'application/json',...extra});
  async function req(path,options={}){
    const r=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{...options,headers:headers(options.headers||{})});
    let data=null;try{data=await r.json()}catch{}
    if(!r.ok)throw new Error(data?.message||data?.error||`Workspace ${r.status}`);
    return data;
  }
  const sharedState=()=>({profile:state.profile||{},opportunities:state.opportunities||[],history:state.history||[]});
  const persistLocal=()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch{}};

  async function pushState(){
    if(!ready||!info?.workspaceId||!token())return;
    const uid=window.postulaAuth?.getSession?.()?.user?.id;if(!uid)return;
    const body={workspace_id:info.workspaceId,state:sharedState(),updated_by:uid,updated_at:new Date().toISOString()};
    await req('workspace_state?on_conflict=workspace_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(body)});
  }
  function schedulePush(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>pushState().catch(console.error),220)}
  function wrapSave(){
    if(saveWrapped||typeof save!=='function')return;
    const previous=save;
    save=function(msg=''){previous(msg);schedulePush()};
    saveWrapped=true;
  }

  async function load(){
    if(!token())return false;
    const session=window.postulaAuth?.getSession?.(),uid=session?.user?.id;if(!uid)return false;
    const profiles=await req(`profiles?user_id=eq.${encodeURIComponent(uid)}&select=user_id,email,display_name,role&limit=1`);
    const memberships=await req(`workspace_members?user_id=eq.${encodeURIComponent(uid)}&select=workspace_id,member_role&order=created_at.asc&limit=1`);
    if(!memberships?.length){
      info={profile:profiles?.[0]||null,workspaceId:null,workspaceName:null,memberRole:null,isAdmin:profiles?.[0]?.role==='admin'};
      ready=true;wrapSave();window.dispatchEvent(new CustomEvent('postula-workspace-ready'));return true;
    }
    const membership=memberships[0];
    const ws=await req(`workspaces?id=eq.${encodeURIComponent(membership.workspace_id)}&select=id,name&limit=1`);
    info={profile:profiles?.[0]||null,workspaceId:membership.workspace_id,workspaceName:ws?.[0]?.name||'Postulaciones Joseluis',memberRole:membership.member_role,isAdmin:profiles?.[0]?.role==='admin'||membership.member_role==='admin'};
    const rows=await req(`workspace_state?workspace_id=eq.${encodeURIComponent(info.workspaceId)}&select=state,updated_by,updated_at&limit=1`);
    if(rows?.length&&rows[0].state&&Object.keys(rows[0].state).length){
      const remote=rows[0].state;
      if(remote.profile)state.profile={...(state.profile||{}),...remote.profile};
      if(Array.isArray(remote.opportunities))state.opportunities=remote.opportunities;
      if(Array.isArray(remote.history))state.history=remote.history;
      info.updatedBy=rows[0].updated_by;info.updatedAt=rows[0].updated_at;
      persistLocal();
    }else{
      await pushState();
    }
    ready=true;wrapSave();
    try{render()}catch{}
    window.dispatchEvent(new CustomEvent('postula-workspace-ready'));
    return true;
  }

  async function listPeople(){
    if(!info?.isAdmin||!info.workspaceId)return {members:[],candidates:[]};
    const profiles=await req('profiles?select=user_id,email,display_name,role&order=created_at.asc');
    const memberships=await req(`workspace_members?workspace_id=eq.${encodeURIComponent(info.workspaceId)}&select=user_id,member_role,created_at`);
    const memberMap=new Map((memberships||[]).map(m=>[m.user_id,m]));
    const members=(profiles||[]).filter(p=>memberMap.has(p.user_id)).map(p=>({...p,memberRole:memberMap.get(p.user_id).member_role}));
    const candidates=(profiles||[]).filter(p=>!memberMap.has(p.user_id));
    return {members,candidates};
  }
  async function addMember(userId){
    if(!info?.isAdmin||!info.workspaceId)throw new Error('Permiso de administrador requerido');
    await req('workspace_members',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({workspace_id:info.workspaceId,user_id:userId,member_role:'member'})});
    return listPeople();
  }
  async function removeMember(userId){
    if(!info?.isAdmin||!info.workspaceId)throw new Error('Permiso de administrador requerido');
    if(userId===window.postulaAuth?.getSession?.()?.user?.id)throw new Error('No puedes quitar tu propio acceso administrador');
    await req(`workspace_members?workspace_id=eq.${encodeURIComponent(info.workspaceId)}&user_id=eq.${encodeURIComponent(userId)}`,{method:'DELETE',headers:{Prefer:'return=minimal'}});
    return listPeople();
  }
  window.postulaWorkspace={info:()=>info,isReady:()=>ready,pushState,listPeople,addMember,removeMember};
  let tries=0;const boot=()=>{if(token())load().catch(console.error);else if(++tries<80)setTimeout(boot,150)};boot();
})();