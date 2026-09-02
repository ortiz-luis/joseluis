(() => {
  const SUPABASE_URL='https://qqzrpzjtvrbtkbhmdjmp.supabase.co';
  const SUPABASE_KEY='sb_publishable_-1TjOOzBlXwxaXuyOotQAg_c33AjzCN';
  const ACTIVE_USER_KEY='postula-active-user-v2';
  const ADMIN_WORKSPACE_KEY='postula-admin-workspace-v1';
  let info=null,ready=false,saveTimer=null,saveWrapped=false,lastError=null;

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
  function freshSharedState(){
    const base=(typeof seed!=='undefined'&&typeof clone==='function')?clone(seed):{profile:{name:'José Luis',country:'Chile',field:'Sociología'},opportunities:[],history:[]};
    return {profile:base.profile||{},opportunities:base.opportunities||[],history:base.history||[]};
  }
  function isolateBrowserForUser(uid){
    const previous=localStorage.getItem(ACTIVE_USER_KEY);
    if(previous&&previous!==uid){
      const fresh=freshSharedState();
      state.profile=fresh.profile;state.opportunities=fresh.opportunities;state.history=fresh.history;state.documents=[];
      ['joseluis-cv-builder-v2','joseluis-letter-builder-v3','postula-recent-v1','joseluis-ux-recents-v1'].forEach(k=>localStorage.removeItem(k));
      persistLocal();
    }
    localStorage.setItem(ACTIVE_USER_KEY,uid);
  }
  function reportError(err){
    lastError=String(err?.message||err||'No se pudo cargar el espacio');
    ready=false;
    window.dispatchEvent(new CustomEvent('postula-workspace-error',{detail:{message:lastError}}));
  }

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

  async function allWorkspaces(){
    if(!info?.isAdmin)return [];
    const ws=await req('workspaces?select=id,name,created_by,created_at&order=created_at.asc');
    const members=await req('workspace_members?select=workspace_id,user_id,member_role');
    const profiles=await req('profiles?select=user_id,email,display_name,role');
    const pm=new Map((profiles||[]).map(p=>[p.user_id,p]));
    return (ws||[]).map(w=>({...w,members:(members||[]).filter(m=>m.workspace_id===w.id).map(m=>({...m,profile:pm.get(m.user_id)||null}))}));
  }

  async function resolveWorkspace(uid,isAdmin,forcedId=null){
    const memberships=await req(`workspace_members?user_id=eq.${encodeURIComponent(uid)}&select=workspace_id,member_role,created_at&order=created_at.asc`);
    if(isAdmin){
      const ws=await req('workspaces?select=id,name,created_by,created_at&order=created_at.asc');
      const chosen=forcedId||localStorage.getItem(ADMIN_WORKSPACE_KEY)||memberships?.[0]?.workspace_id||ws?.[0]?.id||null;
      const row=(ws||[]).find(x=>x.id===chosen)||(ws||[])[0]||null;
      if(row){localStorage.setItem(ADMIN_WORKSPACE_KEY,row.id);return {workspaceId:row.id,workspaceName:row.name,memberRole:'admin'}};
      return {workspaceId:null,workspaceName:null,memberRole:'admin'};
    }
    const membership=memberships?.[0];
    if(!membership)return {workspaceId:null,workspaceName:null,memberRole:null};
    const ws=await req(`workspaces?id=eq.${encodeURIComponent(membership.workspace_id)}&select=id,name&limit=1`);
    return {workspaceId:membership.workspace_id,workspaceName:ws?.[0]?.name||'Mi espacio',memberRole:membership.member_role};
  }

  async function load(options={}){
    lastError=null;
    if(!token())return false;
    const session=window.postulaAuth?.getSession?.(),uid=session?.user?.id;if(!uid)return false;
    isolateBrowserForUser(uid);
    const profiles=await req(`profiles?user_id=eq.${encodeURIComponent(uid)}&select=user_id,email,display_name,role&limit=1`);
    const profile=profiles?.[0]||null,isAdmin=profile?.role==='admin';
    const selected=await resolveWorkspace(uid,isAdmin,options.workspaceId||null);
    info={profile,workspaceId:selected.workspaceId,workspaceName:selected.workspaceName,memberRole:selected.memberRole,isAdmin};
    if(!info.workspaceId){ready=true;wrapSave();window.dispatchEvent(new CustomEvent('postula-workspace-ready'));return true;}

    const rows=await req(`workspace_state?workspace_id=eq.${encodeURIComponent(info.workspaceId)}&select=state,updated_by,updated_at&limit=1`);
    if(rows?.length&&rows[0].state&&Object.keys(rows[0].state).length){
      const remote=rows[0].state;
      state.profile={...freshSharedState().profile,...(remote.profile||{})};
      state.opportunities=Array.isArray(remote.opportunities)?remote.opportunities:freshSharedState().opportunities;
      state.history=Array.isArray(remote.history)?remote.history:[];
      info.updatedBy=rows[0].updated_by;info.updatedAt=rows[0].updated_at;
    }else{
      const fresh=freshSharedState();
      state.profile=fresh.profile;state.opportunities=fresh.opportunities;state.history=fresh.history;state.documents=[];
      ready=true;persistLocal();await pushState();
    }
    persistLocal();ready=true;wrapSave();
    try{await window.postulaDocuments?.loadDocuments?.()}catch{}
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
  async function switchWorkspace(workspaceId){
    if(!info?.isAdmin)throw new Error('Permiso de administrador requerido');
    localStorage.setItem(ADMIN_WORKSPACE_KEY,workspaceId);ready=false;
    try{await load({workspaceId});return info}catch(err){reportError(err);throw err}
  }
  async function reload(){
    ready=false;
    try{return await load()}catch(err){reportError(err);throw err}
  }
  window.postulaWorkspace={info:()=>info,isReady:()=>ready,lastError:()=>lastError,pushState,listPeople,addMember,removeMember,listWorkspaces:allWorkspaces,switchWorkspace,reload};
  let tries=0;const boot=()=>{
    if(token())reload().catch(console.error);
    else if(++tries<80)setTimeout(boot,150)
  };boot();
})();