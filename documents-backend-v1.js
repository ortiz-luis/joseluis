(() => {
  const SUPABASE_URL='https://qqzrpzjtvrbtkbhmdjmp.supabase.co';
  const SUPABASE_KEY='sb_publishable_-1TjOOzBlXwxaXuyOotQAg_c33AjzCN';
  const BUCKET='documents';

  const token=()=>window.postulaAuth?.getAccessToken?.()||null;
  const headers=(extra={})=>({apikey:SUPABASE_KEY,Authorization:`Bearer ${token()}`,...extra});
  const clean=s=>String(s||'file').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/^-+|-+$/g,'');
  const encPath=p=>p.split('/').map(encodeURIComponent).join('/');
  const storageUrl=p=>`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encPath(p)}`;

  async function currentUser(){
    const t=token(); if(!t)return null;
    const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${t}`}});
    if(!r.ok)return null;
    return r.json();
  }

  async function dbRequest(path,options={}){
    const r=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{...options,headers:headers({'Content-Type':'application/json',...(options.headers||{})})});
    let data=null; try{data=await r.json()}catch{}
    if(!r.ok)throw new Error(data?.message||data?.error||`Database ${r.status}`);
    return data;
  }

  async function loadDocuments(){
    if(!token()||typeof state==='undefined'||!Array.isArray(state.documents))return [];
    const rows=await dbRequest('documents?select=*&order=created_at.desc');
    for(const row of rows){
      let d=state.documents.find(x=>x.backendId===row.id);
      if(!d)d=state.documents.find(x=>String(x.name||'').trim().toLowerCase()===String(row.name||'').trim().toLowerCase());
      if(!d){
        d={id:`db-${row.id}`,name:row.name,category:row.category||'Otros'};
        state.documents.push(d);
      }
      d.backendId=row.id;
      d.name=row.name;
      d.category=row.category||d.category||'Otros';
      d.status=row.status==='ready'?'ready':row.status;
      d.fileStored=row.status==='ready';
      d.storageProvider='supabase';
      d.storagePath=row.storage_path;
      d.mimeType=row.mime_type||'';
      d.sizeBytes=row.size_bytes||null;
      d.updated=row.updated_at||row.created_at;
      d.objectUrl=`postula-storage:${row.storage_path}`;
      d.downloadUrl=d.objectUrl;
      d.previewUrl=d.objectUrl;
    }
    try{save()}catch{}
    try{render()}catch{}
    return rows;
  }

  async function uploadFile(file){
    const user=await currentUser();
    if(!user?.id)throw new Error('Sesión no disponible');
    const category=(typeof docFilter!=='undefined'&&docFilter&&docFilter!=='all')?docFilter:'Otros';
    const path=`${user.id}/${Date.now()}-${clean(file.name)}`;
    const up=await fetch(storageUrl(path),{method:'POST',headers:headers({'Content-Type':file.type||'application/octet-stream','x-upsert':'true'}),body:file});
    if(!up.ok)throw new Error(await up.text()||`Storage ${up.status}`);
    const inserted=await dbRequest('documents',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({user_id:user.id,name:file.name,category,storage_path:path,mime_type:file.type||null,size_bytes:file.size,status:'ready'})});
    await loadDocuments();
    return Array.isArray(inserted)?inserted[0]:inserted;
  }

  async function fetchBlob(doc){
    if(!doc?.storagePath)return null;
    const r=await fetch(storageUrl(doc.storagePath),{headers:headers()});
    if(!r.ok)throw new Error(`No se pudo leer el documento (${r.status})`);
    return r.blob();
  }

  async function visualize(doc){
    const blob=await fetchBlob(doc); if(!blob)return false;
    const url=URL.createObjectURL(blob);
    const modal=document.querySelector('#modal');
    const isPdf=/pdf/i.test(blob.type)||/\.pdf$/i.test(doc.name||'');
    const isImage=/^image\//i.test(blob.type)||/\.(png|jpe?g|webp)$/i.test(doc.name||'');
    if(typeof openModal!=='function'){window.open(url,'_blank');return true;}
    modal?.classList.add('viewer-modal');
    const body=isPdf?`<div class="viewer-frame"><object data="${url}" type="application/pdf"><div class="viewer-empty"><b>No se pudo incrustar el PDF</b><span>Usa Descargar.</span></div></object></div>`:isImage?`<div class="viewer-frame"><img src="${url}" alt="${esc(doc.name)}" style="max-width:100%;max-height:75vh;object-fit:contain"></div>`:`<div class="viewer-frame"><div class="viewer-empty"><b>Vista previa no disponible para este formato</b><span>Puedes descargar el original.</span></div></div>`;
    openModal(`<div class="viewer-shell"><div class="viewer-toolbar"><strong>${esc(doc.name)}</strong><div class="viewer-actions"><button type="button" class="button soft" id="db-download">Descargar</button></div></div>${body}</div>`);
    const dl=document.querySelector('#db-download');
    if(dl)dl.onclick=()=>download(doc,blob);
    modal?.addEventListener('close',()=>URL.revokeObjectURL(url),{once:true});
    return true;
  }

  async function download(doc,knownBlob=null){
    const blob=knownBlob||await fetchBlob(doc); if(!blob)return false;
    const url=URL.createObjectURL(blob); const a=document.createElement('a');
    a.href=url;a.download=doc.name||'documento';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);return true;
  }

  document.addEventListener('change',e=>{
    const input=e.target;
    if(!(input instanceof HTMLInputElement)||input.id!=='file-input'||!input.files?.length)return;
    [...input.files].forEach(file=>uploadFile(file).catch(err=>{console.error('Document upload failed',err);try{alert('No se pudo guardar el documento: '+err.message)}catch{}}));
  },true);

  document.addEventListener('click',e=>{
    const v=e.target.closest?.('[data-visualize-doc],[data-view-doc]');
    if(v){
      const id=v.dataset.visualizeDoc||v.dataset.viewDoc;
      const doc=typeof state!=='undefined'?state.documents.find(d=>d.id===id):null;
      if(doc?.storagePath){e.preventDefault();e.stopImmediatePropagation();visualize(doc).catch(console.error);return;}
    }
    const d=e.target.closest?.('[data-download-doc]');
    if(d){
      const doc=typeof state!=='undefined'?state.documents.find(x=>x.id===d.dataset.downloadDoc):null;
      if(doc?.storagePath){e.preventDefault();e.stopImmediatePropagation();download(doc).catch(console.error);}
    }
  },true);

  function boot(){
    if(token())loadDocuments().catch(console.error);
    else setTimeout(boot,250);
  }
  window.addEventListener('hashchange',()=>{if(token())loadDocuments().catch(console.error)});
  boot();
  window.postulaDocuments={loadDocuments,uploadFile,visualize,download};
})();
