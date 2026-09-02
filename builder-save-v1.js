(() => {
  const SUPABASE_URL='https://qqzrpzjtvrbtkbhmdjmp.supabase.co';
  const SUPABASE_KEY='sb_publishable_-1TjOOzBlXwxaXuyOotQAg_c33AjzCN';
  const SESSION_KEY='postula-supabase-session-v1';
  const BUCKET='documents';
  const cfg=window.POSTULA_BUILDER_SAVE||{};
  const preview=document.querySelector(cfg.previewSelector||'#preview');
  const downloadBtn=document.querySelector(cfg.downloadButton||'#pdf');
  const saveBtn=document.querySelector(cfg.saveButton||'#save-library');
  if(!preview||!downloadBtn||!saveBtn)return;

  const clean=s=>String(s||'documento').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/^-+|-+$/g,'');
  const readSession=()=>{try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{return null}};
  const writeSession=s=>{if(s)localStorage.setItem(SESSION_KEY,JSON.stringify(s));else localStorage.removeItem(SESSION_KEY)};
  const ensurePdfName=n=>/\.pdf$/i.test(n)?n:`${n}.pdf`;

  function defaultName(){
    const raw=typeof cfg.defaultName==='function'?cfg.defaultName():cfg.defaultName;
    return ensurePdfName((raw||cfg.kind||'Documento').trim());
  }

  function sessionExpired(session){
    if(!session?.access_token)return true;
    const exp=Number(session.expires_at||0);
    if(exp)return exp<=Math.floor(Date.now()/1000)+60;
    try{
      const payload=JSON.parse(atob(session.access_token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));
      return Number(payload.exp||0)<=Math.floor(Date.now()/1000)+60;
    }catch{return false}
  }

  async function refreshSession(session=readSession()){
    if(!session?.refresh_token)throw new Error('Tu sesión terminó. Vuelve a entrar en Postulaciones.');
    const r=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,{
      method:'POST',
      headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({refresh_token:session.refresh_token})
    });
    let data=null;try{data=await r.json()}catch{}
    if(!r.ok||!data?.access_token){writeSession(null);throw new Error('Tu sesión terminó. Vuelve a entrar en Postulaciones.');}
    if(!data.user&&session.user)data.user=session.user;
    writeSession(data);
    return data;
  }

  async function validSession(forceRefresh=false){
    let session=readSession();
    if(!session?.access_token)throw new Error('Abre primero tu cuenta de Postulaciones e inicia sesión');
    if(forceRefresh||sessionExpired(session))session=await refreshSession(session);
    if(!session?.user?.id){
      const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${session.access_token}`}});
      if(r.status===401||r.status===403)return validSession(true);
      if(!r.ok)throw new Error('No se pudo validar tu sesión');
      session={...session,user:await r.json()};writeSession(session);
    }
    return session;
  }

  async function makePdf(){
    if(typeof html2pdf!=='function')throw new Error('El generador PDF no está disponible');
    const worker=html2pdf().set({margin:0,filename:defaultName(),image:{type:'jpeg',quality:.98},html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff',logging:false},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy']}}).from(preview);
    return worker.outputPdf('blob');
  }

  function downloadBlob(blob,name){
    const u=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=u;a.download=ensurePdfName(name);document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(u),1500);
  }

  async function authenticatedFetch(url,options={},retry=true){
    const session=await validSession();
    const headers={apikey:SUPABASE_KEY,Authorization:`Bearer ${session.access_token}`,...(options.headers||{})};
    const r=await fetch(url,{...options,headers});
    if(retry&&(r.status===401||r.status===403)){
      await refreshSession(readSession());
      return authenticatedFetch(url,options,false);
    }
    return r;
  }

  async function dbRequest(path,options={}){
    const r=await authenticatedFetch(`${SUPABASE_URL}/rest/v1/${path}`,{...options,headers:{'Content-Type':'application/json',...(options.headers||{})}});
    let data=null;try{data=await r.json()}catch{}
    if(!r.ok)throw new Error(data?.message||data?.error||`Database ${r.status}`);
    return data;
  }

  async function uploadPdf(blob,name){
    const session=await validSession(),user=session.user;
    const filename=ensurePdfName(name.trim());
    const path=`${user.id}/${Date.now()}-${clean(filename)}`;
    const encoded=path.split('/').map(encodeURIComponent).join('/');
    const up=await authenticatedFetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encoded}`,{method:'POST',headers:{'Content-Type':'application/pdf','x-upsert':'true'},body:blob});
    if(!up.ok)throw new Error(await up.text()||`Storage ${up.status}`);
    const existing=await dbRequest(`documents?select=id&name=eq.${encodeURIComponent(filename)}&limit=1`);
    const payload={category:'CV',document_role:cfg.role||null,storage_path:path,mime_type:'application/pdf',size_bytes:blob.size,status:'ready',updated_at:new Date().toISOString()};
    if(Array.isArray(existing)&&existing.length)await dbRequest(`documents?id=eq.${existing[0].id}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)});
    else await dbRequest('documents',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({user_id:user.id,name:filename,...payload})});
    return filename;
  }

  async function busy(btn,text,fn){const old=btn.textContent;btn.disabled=true;btn.textContent=text;try{return await fn()}finally{btn.disabled=false;btn.textContent=old}}

  downloadBtn.onclick=()=>busy(downloadBtn,'Preparando PDF…',async()=>{const blob=await makePdf();downloadBlob(blob,defaultName());}).catch(err=>alert('No se pudo crear el PDF: '+err.message));

  saveBtn.onclick=async()=>{
    const suggestion=defaultName().replace(/\.pdf$/i,'');
    const chosen=prompt('Nombre para guardar en CV y cartas',suggestion);
    if(chosen===null)return;
    const trimmed=chosen.trim();if(!trimmed){alert('Escribe un nombre para el documento');return;}
    busy(saveBtn,'Guardando…',async()=>{
      const blob=await makePdf();
      const filename=await uploadPdf(blob,trimmed);
      const msg=document.querySelector('#builder-save-status');
      if(msg)msg.textContent=`Guardado como ${filename}`;else alert(`Guardado en CV y cartas como ${filename}`);
    }).catch(err=>alert('No se pudo guardar: '+err.message));
  };
})();