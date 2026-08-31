(() => {
  const SUPABASE_URL='https://qqzrpzjtvrbtkbhmdjmp.supabase.co';
  const SUPABASE_KEY='sb_publishable_-1TjOOzBlXwxaXuyOotQAg_c33AjzCN';
  const BUCKET='documents';
  const MAP_KEY='postula-storage-map-v1';

  const readMap=()=>{try{return JSON.parse(localStorage.getItem(MAP_KEY)||'{}')}catch{return {}}};
  const saveMap=m=>localStorage.setItem(MAP_KEY,JSON.stringify(m));
  const clean=s=>String(s||'file').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/^-+|-+$/g,'');
  const token=()=>window.postulaAuth?.getAccessToken?.()||null;
  const headers=(extra={})=>({apikey:SUPABASE_KEY,Authorization:`Bearer ${token()}`,...extra});
  const encPath=p=>p.split('/').map(encodeURIComponent).join('/');
  const objectUrl=p=>`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encPath(p)}`;

  async function currentUserId(){
    const t=token(); if(!t)return null;
    const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${t}`}});
    if(!r.ok)return null; const u=await r.json(); return u?.id||null;
  }

  function findDocForFile(file){
    try{
      const docs=typeof state!=='undefined'&&Array.isArray(state.documents)?state.documents:[];
      const exact=docs.find(d=>d.name===file.name);
      if(exact)return exact;
      const base=clean(file.name).toLowerCase();
      return docs.slice().reverse().find(d=>clean(d.name).toLowerCase()===base)||docs[docs.length-1]||null;
    }catch{return null}
  }

  async function uploadFile(file){
    const uid=await currentUserId(); if(!uid)throw new Error('Sesión no disponible');
    const path=`${uid}/${Date.now()}-${clean(file.name)}`;
    const r=await fetch(objectUrl(path),{method:'POST',headers:headers({'Content-Type':file.type||'application/octet-stream','x-upsert':'true'}),body:file});
    if(!r.ok)throw new Error(await r.text()||`Storage ${r.status}`);
    const doc=findDocForFile(file); const m=readMap();
    const key=doc?.id||`name:${file.name}`;
    m[key]={path,name:file.name,type:file.type||'',storedAt:new Date().toISOString()};
    saveMap(m);
    return {doc,path};
  }

  async function fetchStored(doc){
    const m=readMap(); const meta=m[doc?.id]||m[`name:${doc?.name}`];
    if(!meta?.path)return null;
    const r=await fetch(objectUrl(meta.path),{headers:headers()});
    if(r.status===404)return null;
    if(!r.ok)throw new Error(`No se pudo leer el documento (${r.status})`);
    return {blob:await r.blob(),meta};
  }

  async function showStored(doc){
    const stored=await fetchStored(doc); if(!stored)return false;
    const modal=document.querySelector('#modal');
    const isPdf=/pdf/i.test(stored.blob.type)||/\.pdf$/i.test(stored.meta.name||doc?.name||'');
    const url=URL.createObjectURL(stored.blob);
    if(typeof openModal!=='function'){window.open(url,'_blank');return true;}
    modal?.classList.add('viewer-modal');
    const body=isPdf
      ? `<div class="viewer-frame"><object data="${url}" type="application/pdf"><div class="viewer-empty"><b>No se pudo incrustar el PDF</b><span>Usa Descargar.</span></div></object></div>`
      : `<div class="viewer-frame"><div class="viewer-empty"><b>Vista previa no disponible para este formato</b><span>Puedes descargar el original.</span></div></div>`;
    openModal(`<div class="viewer-shell"><div class="viewer-toolbar"><strong>${esc(doc.name)}</strong><div class="viewer-actions"><button type="button" class="button soft" id="storage-download">Descargar</button></div></div>${body}</div>`);
    const dl=document.querySelector('#storage-download');
    if(dl)dl.onclick=()=>{const a=document.createElement('a');a.href=url;a.download=stored.meta.name||doc.name||'documento';document.body.appendChild(a);a.click();a.remove()};
    modal?.addEventListener('close',()=>URL.revokeObjectURL(url),{once:true});
    return true;
  }

  async function downloadStored(doc){
    const stored=await fetchStored(doc); if(!stored)return false;
    const url=URL.createObjectURL(stored.blob); const a=document.createElement('a');
    a.href=url;a.download=stored.meta.name||doc.name||'documento';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);return true;
  }

  document.addEventListener('change',e=>{
    const input=e.target;
    if(!(input instanceof HTMLInputElement)||input.id!=='file-input'||!input.files?.length)return;
    [...input.files].forEach(file=>uploadFile(file).then(({doc})=>{
      if(doc){doc.fileStored=true;doc.storageProvider='supabase';try{save('Documento guardado')}catch{}}
    }).catch(err=>console.error('Supabase Storage upload failed',err)));
  },true);

  document.addEventListener('click',async e=>{
    const view=e.target.closest?.('[data-view-doc]');
    if(view){
      const doc=typeof state!=='undefined'?state.documents.find(d=>d.id===view.dataset.viewDoc):null;
      if(doc){try{if(await showStored(doc)){e.preventDefault();e.stopImmediatePropagation()}}catch(err){console.error(err)}}
      return;
    }
    const link=e.target.closest?.('.doc-list-actions a');
    if(link){
      const row=link.closest('.doc-item,.existing-doc-card'); const btn=row?.querySelector?.('[data-view-doc]');
      const doc=btn&&typeof state!=='undefined'?state.documents.find(d=>d.id===btn.dataset.viewDoc):null;
      if(doc){try{if(await downloadStored(doc)){e.preventDefault();e.stopImmediatePropagation()}}catch(err){console.error(err)}}
    }
  },true);

  window.postulaStorage={uploadFile,fetchStored,showStored,downloadStored,readMap};
})();
