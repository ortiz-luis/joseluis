(() => {
  const SUPABASE_URL='https://qqzrpzjtvrbtkbhmdjmp.supabase.co';
  const SUPABASE_KEY='sb_publishable_-1TjOOzBlXwxaXuyOotQAg_c33AjzCN';
  const BUCKET='documents';

  const token=()=>window.postulaAuth?.getAccessToken?.()||null;
  const clean=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

  async function currentUserId(){
    const t=token(); if(!t)return null;
    const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${t}`}});
    if(!r.ok)return null;
    const u=await r.json(); return u?.id||null;
  }

  async function listStored(){
    const uid=await currentUserId(); if(!uid)return [];
    const t=token();
    const r=await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`,{
      method:'POST',
      headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${t}`,'Content-Type':'application/json'},
      body:JSON.stringify({prefix:`${uid}/`,limit:1000,offset:0,sortBy:{column:'created_at',order:'desc'}})
    });
    if(!r.ok)return [];
    const rows=await r.json();
    return Array.isArray(rows)?rows:[];
  }

  function originalName(storageName){
    const leaf=String(storageName||'').split('/').pop()||'';
    return leaf.replace(/^\d+-/,'');
  }

  async function reconcile(){
    if(typeof state==='undefined'||!Array.isArray(state.documents))return false;
    const rows=await listStored();
    if(!rows.length)return false;
    const storedNames=new Set(rows.map(r=>clean(originalName(r.name))));
    let changed=false;
    for(const doc of state.documents){
      if(storedNames.has(clean(doc.name))){
        if(doc.fileStored!==true||doc.status!=='ready'||doc.storageProvider!=='supabase'){
          doc.fileStored=true;
          doc.status='ready';
          doc.storageProvider='supabase';
          changed=true;
        }
      }
    }
    if(changed){
      try{save()}catch{}
      try{render()}catch{}
    }
    return changed;
  }

  window.addEventListener('load',()=>setTimeout(reconcile,500));
  window.addEventListener('hashchange',()=>setTimeout(reconcile,150));
  document.addEventListener('change',e=>{
    const input=e.target;
    if(input instanceof HTMLInputElement&&input.id==='file-input')setTimeout(reconcile,1800);
  });
  window.postulaReconcileStorage=reconcile;
})();
