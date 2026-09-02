(() => {
  if(typeof state==='undefined')return;
  const info=()=>window.postulaWorkspace?.info?.()||null;
  const isAdmin=()=>!!info()?.isAdmin;
  const cats=['Identidad','CV','Estudios','Idiomas','Recomendaciones','Muestras','Otros'];
  const statusOptions=()=>Object.entries(statuses||{}).map(([k,v])=>`<option value="${esc(k)}">${esc(v)}</option>`).join('');
  const field=(label,name,value='',type='text')=>`<label class="admin-edit-field"><span>${esc(label)}</span><input type="${type}" data-admin-field="${esc(name)}" value="${esc(value??'')}"></label>`;
  const area=(label,name,value='')=>`<label class="admin-edit-field admin-edit-wide"><span>${esc(label)}</span><textarea data-admin-field="${esc(name)}" rows="4">${esc(value??'')}</textarea></label>`;

  function requirementRow(q={}){
    const id=q.id||`req-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    const type=q.type||'action',stateValue=q.state||'action';
    return `<div class="admin-req-row" data-admin-req="${esc(id)}">
      <div class="admin-req-main">
        <label><span>Nombre</span><input data-r="label" value="${esc(q.label||'')}"></label>
        <label><span>Tipo</span><select data-r="type"><option value="action" ${type==='action'?'selected':''}>Acción</option><option value="easy" ${type==='easy'?'selected':''}>Simple</option><option value="document" ${type==='document'?'selected':''}>Documento</option></select></label>
        <label><span>Categoría</span><select data-r="category"><option value="">—</option>${cats.map(c=>`<option value="${esc(c)}" ${q.category===c?'selected':''}>${esc(c)}</option>`).join('')}</select></label>
        <label><span>Estado</span><select data-r="state"><option value="action" ${stateValue==='action'?'selected':''}>Pendiente</option><option value="easy" ${stateValue==='easy'?'selected':''}>Simple</option><option value="ready" ${stateValue==='ready'?'selected':''}>Listo</option></select></label>
      </div>
      <label class="admin-req-help"><span>Ayuda / nota</span><input data-r="help" value="${esc(q.help||'')}"></label>
      <button type="button" class="admin-req-delete" data-admin-delete-req>Eliminar requisito</button>
    </div>`;
  }

  function openOpportunityEditor(existing=null){
    if(!isAdmin())return;
    const isNew=!existing;
    const o=existing||{id:`manual-${Date.now()}`,title:'',institution:'',country:'',city:'',funding:'',duration:'',deadline:'',status:'new',priority:'',sourceUrl:'',why:'',notes:'',requirements:[]};
    openModal(`<div class="admin-editor"><div class="admin-editor-title"><div><span>SUPERUSUARIO</span><h2>${isNew?'Nueva oportunidad':'Editar oportunidad'}</h2></div></div>
      <div class="admin-edit-grid">
        ${field('Título','title',o.title)}${field('Institución','institution',o.institution)}
        ${field('País','country',o.country)}${field('Ciudad','city',o.city)}
        ${field('Financiación','funding',o.funding)}${field('Duración','duration',o.duration)}
        ${field('Fecha límite','deadline',o.deadline,'date')}${field('Prioridad','priority',o.priority)}
        <label class="admin-edit-field"><span>Estado</span><select data-admin-field="status">${statusOptions()}</select></label>
        ${field('Página oficial','sourceUrl',o.sourceUrl,'url')}
        ${area('Por qué interesa / descripción','why',o.why)}${area('Notas','notes',o.notes)}
      </div>
      <section class="admin-req-section"><div class="admin-req-head"><div><h3>Requisitos y tareas</h3><p>También puedes cambiar el nombre, tipo, categoría, estado y ayuda de cada requisito.</p></div><button type="button" class="button soft" data-admin-add-req>+ Añadir requisito</button></div><div data-admin-req-list>${(o.requirements||[]).map(requirementRow).join('')}</div></section>
      <div class="admin-editor-actions">${!isNew?'<button type="button" class="admin-danger" data-admin-delete-opportunity>Eliminar oportunidad</button>':''}<span></span><button type="button" class="button soft" data-admin-cancel>Cancelar</button><button type="button" class="button primary" data-admin-save-opportunity>Guardar cambios</button></div>
    </div>`);
    const modal=document.querySelector('#modal');
    const status=modal.querySelector('[data-admin-field="status"]');if(status)status.value=o.status||'new';
    modal.querySelector('[data-admin-cancel]')?.addEventListener('click',closeModal);
    modal.querySelector('[data-admin-add-req]')?.addEventListener('click',()=>modal.querySelector('[data-admin-req-list]')?.insertAdjacentHTML('beforeend',requirementRow()));
    modal.querySelector('[data-admin-req-list]')?.addEventListener('click',e=>{const b=e.target.closest('[data-admin-delete-req]');if(b)b.closest('.admin-req-row')?.remove()});
    modal.querySelector('[data-admin-save-opportunity]')?.addEventListener('click',()=>{
      modal.querySelectorAll('[data-admin-field]').forEach(el=>{o[el.dataset.adminField]=el.value.trim()});
      if(!o.title){alert('El título no puede quedar vacío.');return;}
      o.requirements=[...modal.querySelectorAll('.admin-req-row')].map(row=>({id:row.dataset.adminReq,label:row.querySelector('[data-r="label"]')?.value.trim()||'Requisito',type:row.querySelector('[data-r="type"]')?.value||'action',category:row.querySelector('[data-r="category"]')?.value||'',state:row.querySelector('[data-r="state"]')?.value||'action',help:row.querySelector('[data-r="help"]')?.value.trim()||''}));
      if(isNew)state.opportunities.unshift(o);
      save(isNew?'Oportunidad creada':'Oportunidad actualizada');closeModal();location.hash=`#opportunity/${o.id}`;render();
    });
    modal.querySelector('[data-admin-delete-opportunity]')?.addEventListener('click',()=>{if(!confirm(`¿Eliminar definitivamente “${o.title}”?`))return;state.opportunities=state.opportunities.filter(x=>x.id!==o.id);save('Oportunidad eliminada');closeModal();location.hash='#opportunities';render()});
  }

  function openWorkspaceProfileEditor(){
    if(!isAdmin())return;const p=state.profile||{};
    openModal(`<div class="admin-editor"><div class="admin-editor-title"><div><span>SUPERUSUARIO</span><h2>Editar datos del espacio</h2></div></div><div class="admin-edit-grid">${field('Nombre visible','name',p.name)}${field('País','country',p.country)}${field('Área / profesión','field',p.field)}</div><div class="admin-editor-actions"><span></span><button type="button" class="button soft" data-admin-cancel>Cancelar</button><button type="button" class="button primary" data-admin-save-profile>Guardar</button></div></div>`);
    const modal=document.querySelector('#modal');modal.querySelector('[data-admin-cancel]')?.addEventListener('click',closeModal);modal.querySelector('[data-admin-save-profile]')?.addEventListener('click',()=>{modal.querySelectorAll('[data-admin-field]').forEach(el=>p[el.dataset.adminField]=el.value.trim());state.profile=p;save('Datos actualizados');closeModal();render()});
  }

  function documentRoleOptions(value=''){
    const roles=[['','Sin rol específico'],['cv','CV'],['motivation_letter','Carta de motivación'],['passport','Pasaporte'],['degree','Título'],['transcript','Certificado de notas'],['language_certificate','Certificado de idioma'],['recommendation','Recomendación'],['writing_sample','Muestra']];
    return roles.map(([v,l])=>`<option value="${esc(v)}" ${value===v?'selected':''}>${esc(l)}</option>`).join('');
  }
  function openDocumentEditor(doc){
    if(!isAdmin()||!doc)return;
    openModal(`<div class="admin-editor"><div class="admin-editor-title"><div><span>SUPERUSUARIO</span><h2>Editar documento</h2><p>${esc(doc.name)}</p></div></div><div class="admin-edit-grid">${field('Nombre','name',doc.name)}<label class="admin-edit-field"><span>Categoría</span><select data-admin-doc-category>${cats.map(c=>`<option value="${esc(c)}" ${doc.category===c?'selected':''}>${esc(c)}</option>`).join('')}</select></label><label class="admin-edit-field"><span>Uso del documento</span><select data-admin-doc-role>${documentRoleOptions(doc.documentRole||'')}</select></label></div><div class="admin-document-file"><div><strong>Archivo físico</strong><span>Puedes sustituir el archivo conservando este registro.</span></div><button type="button" class="button soft" data-admin-replace-doc>Reemplazar archivo</button><input type="file" data-admin-replace-input hidden></div><div class="admin-editor-actions"><button type="button" class="admin-danger" data-admin-delete-document>Eliminar documento</button><span></span><button type="button" class="button soft" data-admin-cancel>Cancelar</button><button type="button" class="button primary" data-admin-save-document>Guardar cambios</button></div></div>`);
    const modal=document.querySelector('#modal'),api=window.postulaDocuments;
    modal.querySelector('[data-admin-cancel]')?.addEventListener('click',closeModal);
    modal.querySelector('[data-admin-save-document]')?.addEventListener('click',async e=>{const b=e.currentTarget;b.disabled=true;b.textContent='Guardando…';try{await api?.updateDocument?.(doc,{name:modal.querySelector('[data-admin-field="name"]')?.value.trim()||doc.name,category:modal.querySelector('[data-admin-doc-category]')?.value||doc.category,documentRole:modal.querySelector('[data-admin-doc-role]')?.value||null});closeModal();render()}catch(err){alert('No se pudo actualizar: '+err.message);b.disabled=false;b.textContent='Guardar cambios'}});
    const input=modal.querySelector('[data-admin-replace-input]');modal.querySelector('[data-admin-replace-doc]')?.addEventListener('click',()=>input?.click());input?.addEventListener('change',async()=>{const file=input.files?.[0];if(!file)return;const btn=modal.querySelector('[data-admin-replace-doc]');btn.disabled=true;btn.textContent='Reemplazando…';try{await api?.replaceDocument?.(doc,file);closeModal();render()}catch(err){alert('No se pudo reemplazar: '+err.message);btn.disabled=false;btn.textContent='Reemplazar archivo'}});
    modal.querySelector('[data-admin-delete-document]')?.addEventListener('click',async()=>{if(!confirm(`¿Eliminar definitivamente “${doc.name}”?`))return;try{await api?.deleteDocument?.(doc);closeModal();render()}catch(err){alert('No se pudo eliminar: '+err.message)}});
  }

  function openDocumentManager(){
    if(!isAdmin())return;const docs=(state.documents||[]).filter(d=>d.status==='ready'&&d.storagePath);
    openModal(`<div class="admin-editor"><div class="admin-editor-title"><div><span>SUPERUSUARIO</span><h2>Administrar documentos</h2><p>Renombra, reclasifica, cambia el rol, sustituye o elimina cualquier documento del espacio actual.</p></div></div><div class="admin-manager-list">${docs.map(d=>`<button type="button" data-admin-pick-doc="${esc(d.id)}"><span><strong>${esc(d.name)}</strong><small>${esc(d.category||'Otros')}</small></span><b>Editar</b></button>`).join('')||'<div class="empty">No hay documentos guardados.</div>'}</div></div>`);
    document.querySelector('#modal')?.querySelectorAll('[data-admin-pick-doc]').forEach(b=>b.onclick=()=>{const d=state.documents.find(x=>x.id===b.dataset.adminPickDoc);if(d)openDocumentEditor(d)});
  }

  function bar(label,buttons){return `<div class="admin-edit-bar"><div><span>SUPERUSUARIO</span><strong>${esc(label)}</strong></div><div>${buttons}</div></div>`}
  function decorate(){
    const main=document.querySelector('#main');if(!main)return;main.querySelectorAll('.admin-edit-bar,.admin-inline-edit').forEach(x=>x.remove());if(!isAdmin())return;
    const r=route(),page=main.querySelector('.page');if(!page)return;
    if(r.page==='home')page.insertAdjacentHTML('afterbegin',bar('Puedes editar los datos que alimentan este espacio','<button type="button" data-admin-edit-profile>Editar datos</button>'));
    else if(r.page==='opportunities')page.insertAdjacentHTML('afterbegin',bar('Catálogo editable','<button type="button" data-admin-new-opportunity>+ Nueva oportunidad</button>'));
    else if(['opportunity','opportunity-tasks','opportunity-documents','opportunity-info'].includes(r.page))page.insertAdjacentHTML('afterbegin',bar('Todos los campos de esta oportunidad son editables','<button type="button" data-admin-edit-opportunity>Editar oportunidad</button>'));
    else if(r.page==='documents')page.insertAdjacentHTML('afterbegin',bar('Gestiona los documentos del espacio actual','<button type="button" data-admin-manage-documents>Administrar documentos</button>'));
    else if(r.page==='document-category'){
      page.insertAdjacentHTML('afterbegin',bar('Puedes editar cada documento de esta categoría','<button type="button" data-admin-manage-documents>Administrar todos</button>'));
      page.querySelectorAll('.doc-category-row').forEach(row=>{const id=row.querySelector('[data-view-doc]')?.dataset.viewDoc;if(id&& !row.querySelector('[data-admin-edit-doc]'))row.querySelector('.row-actions')?.insertAdjacentHTML('afterbegin',`<button type="button" class="admin-inline-edit" data-admin-edit-doc="${esc(id)}">Editar</button>`)});
    } else if(r.page==='create')page.insertAdjacentHTML('afterbegin',bar('Los documentos creados aquí también quedan bajo tu gestión','<button type="button" data-admin-manage-documents>Administrar guardados</button>'));
    else if(r.page==='templates')page.insertAdjacentHTML('afterbegin',bar('Las plantillas se modifican abriendo su constructor','<a href="cv-builder/">Editar CV</a><a href="letter-builder/">Editar carta</a>'));
    else if(r.page==='profile')page.insertAdjacentHTML('afterbegin',bar('Administra los datos visibles del espacio','<button type="button" data-admin-edit-profile>Editar datos del espacio</button>'));
  }

  document.addEventListener('click',e=>{
    if(!isAdmin())return;
    const t=e.target.closest('[data-admin-new-opportunity],[data-admin-edit-opportunity],[data-admin-edit-profile],[data-admin-manage-documents],[data-admin-edit-doc]');if(!t)return;
    e.preventDefault();e.stopPropagation();
    if(t.matches('[data-admin-new-opportunity]'))openOpportunityEditor();
    else if(t.matches('[data-admin-edit-opportunity]'))openOpportunityEditor(state.opportunities.find(o=>o.id===route().id));
    else if(t.matches('[data-admin-edit-profile]'))openWorkspaceProfileEditor();
    else if(t.matches('[data-admin-manage-documents]'))openDocumentManager();
    else if(t.matches('[data-admin-edit-doc]'))openDocumentEditor(state.documents.find(d=>d.id===t.dataset.adminEditDoc));
  },true);

  const priorRender=render;
  render=function(){priorRender();decorate()};
  window.addEventListener('postula-workspace-ready',()=>{try{render()}catch{decorate()}});
  setTimeout(decorate,500);setTimeout(decorate,1500);
})();