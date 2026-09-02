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
  const token=()=>readSession()?.access_token||null;
  const headers=(extra={})=>({apikey:SUPABASE_KEY,Authorization:`Bearer ${token()}`,...extra});
  const ensurePdfName=n=>/\.pdf$/i.test(n)?n:`${n}.pdf`;

  function defaultName(){
    const raw=typeof cfg.defaultName==='function'?cfg.defaultName():cfg.defaultName;
    return ensurePdfName((raw||cfg.kind||'Documento').trim());
  }

  async function makePdf(){
    if(typeof html2pdf!=='function')throw new Error('El generador PDF no está disponible');
    const worker=html2pdf().set({
      margin:0,
      filename:defaultName(),
      image:{type:'jpeg',quality:.98},
      html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff',logging:false},
      jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},
      pagebreak:{mode:['css','legacy']}
    }).from(preview);
    return worker.outputPdf('blob');
  }

  function downloadBlob(blob,name){
    const u=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=u;a.download=ensurePdfName(name);document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(u),1500);
  }

  async function dbRequest(path,options={}){
    const r=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{...options,headers:headers({'Content-Type':'application/json',...(options.headers||{})})});
    let data=null;try{data=await r.json()}catch{}
    if(!r.ok)throw new Error(data?.message||data?.error||`Database ${r.status}`);
    return data;
  }

  async function uploadPdf(blob,name){
    const session=readSession(),user=session?.user;
    if(!session?.access_token||!user?.id)throw new Error('Abre primero tu cuenta de Postulaciones e inicia sesión');
    const filename=ensurePdfName(name.trim());
    const path=`${user.id}/${Date.now()}-${clean(filename)}`;
    const encoded=path.split('/').map(encodeURIComponent).join('/');
    const up=await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encoded}`,{method:'POST',headers:headers({'Content-Type':'application/pdf','x-upsert':'true'}),body:blob});
    if(!up.ok)throw new Error(await up.text()||`Storage ${up.status}`);
    const existing=await dbRequest(`documents?select=id&name=eq.${encodeURIComponent(filename)}&limit=1`);
    const payload={category:'CV',document_role:cfg.role||null,storage_path:path,mime_type:'application/pdf',size_bytes:blob.size,status:'ready',updated_at:new Date().toISOString()};
    if(Array.isArray(existing)&&existing.length){
      await dbRequest(`documents?id=eq.${existing[0].id}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)});
    }else{
      await dbRequest('documents',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({user_id:user.id,name:filename,...payload})});
    }
    return filename;
  }

  async function busy(btn,text,fn){
    const old=btn.textContent;btn.disabled=true;btn.textContent=text;
    try{return await fn()}finally{btn.disabled=false;btn.textContent=old}
  }

  downloadBtn.onclick=()=>busy(downloadBtn,'Preparando PDF…',async()=>{
    const blob=await makePdf();downloadBlob(blob,defaultName());
  }).catch(err=>alert('No se pudo crear el PDF: '+err.message));

  saveBtn.onclick=async()=>{
    const suggestion=defaultName().replace(/\.pdf$/i,'');
    const chosen=prompt('Nombre para guardar en CV y cartas',suggestion);
    if(chosen===null)return;
    const trimmed=chosen.trim();if(!trimmed){alert('Escribe un nombre para el documento');return;}
    busy(saveBtn,'Guardando…',async()=>{
      const blob=await makePdf();
      const filename=await uploadPdf(blob,trimmed);
      const msg=document.querySelector('#builder-save-status');
      if(msg)msg.textContent=`Guardado como ${filename}`;
      else alert(`Guardado en CV y cartas como ${filename}`);
    }).catch(err=>alert('No se pudo guardar: '+err.message));
  };
})();