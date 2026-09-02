(() => {
  const SUPABASE_URL='https://qqzrpzjtvrbtkbhmdjmp.supabase.co';
  const SUPABASE_KEY='sb_publishable_-1TjOOzBlXwxaXuyOotQAg_c33AjzCN';
  const BUCKET='documents';
  const token=()=>window.postulaAuth?.getAccessToken?.()||null;
  const session=()=>window.postulaAuth?.getSession?.()||null;
  const isAdmin=()=>!!window.postulaWorkspace?.info?.()?.isAdmin;
  const headers=(extra={})=>({apikey:SUPABASE_KEY,Authorization:`Bearer ${token()}`,...extra});
  const clean=s=>String(s||'file').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/^-+|-+$/g,'');
  const encPath=p=>p.split('/').map(encodeURIComponent).join('/');
  const storageUrl=p=>`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encPath(p)}`;
  async function db(path,options={}){
    const r=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{...options,headers:headers({'Content-Type':'application/json',...(options.headers||{})})});
    let data=null;try{data=await r.json()}catch{}
    if(!r.ok)throw new Error(data?.message||data?.error||`Database ${r.status}`);return data;
  }
  async function updateDocument(doc,changes={}){
    if(!isAdmin())throw new Error('Permiso de administrador requerido');
    if(!doc?.backendId)throw new Error('Documento sin registro editable');
    const payload={updated_at:new Date().toISOString()};
    if(Object.prototype.hasOwnProperty.call(changes,'name'))payload.name=changes.name;
    if(Object.prototype.hasOwnProperty.call(changes,'category'))payload.category=changes.category;
    if(Object.prototype.hasOwnProperty.call(changes,'documentRole'))payload.document_role=changes.documentRole||null;
    await db(`documents?id=eq.${encodeURIComponent(doc.backendId)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)});
    await window.postulaDocuments?.loadDocuments?.();
    return true;
  }
  async function replaceDocument(doc,file){
    if(!isAdmin())throw new Error('Permiso de administrador requerido');
    if(!doc?.backendId||!file)throw new Error('Documento no reemplazable');
    const uid=session()?.user?.id;if(!uid)throw new Error('Sesión no disponible');
    const path=`${uid}/${Date.now()}-${clean(file.name)}`;
    const up=await fetch(storageUrl(path),{method:'POST',headers:headers({'Content-Type':file.type||'application/octet-stream','x-upsert':'true'}),body:file});
    if(!up.ok)throw new Error(await up.text()||`Storage ${up.status}`);
    await db(`documents?id=eq.${encodeURIComponent(doc.backendId)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({storage_path:path,mime_type:file.type||null,size_bytes:file.size,status:'ready',updated_at:new Date().toISOString()})});
    if(doc.storagePath&&doc.storagePath!==path){try{await fetch(storageUrl(doc.storagePath),{method:'DELETE',headers:headers()})}catch{}}
    await window.postulaDocuments?.loadDocuments?.();
    return true;
  }
  function attach(){if(!window.postulaDocuments){setTimeout(attach,100);return}Object.assign(window.postulaDocuments,{updateDocument,replaceDocument})}
  attach();
})();