(()=>{
  if(typeof state==='undefined')return;
  const OPP={id:'corporacion-opcion-mca-2026',title:'Corporación Opción — Profesional de Sistematización de Prácticas',institution:'Corporación Opción',country:'Chile',city:'La Florida, Región Metropolitana',funding:'CLP $1.330.278 brutos/mes',duration:'Jornada completa · presencial',deadline:'2026-09-08',status:'preparing',priority:'Máxima',interestRating:5,sourceUrl:'https://opcion.hiringroom.com/jobs/get_vacancy/6a974fedfa59a8ac93d7aad4',why:'Encaje directo para Sociología junior: sistematización de intervenciones, análisis y registro de resultados, encuestas, elaboración de documentos y propuestas de mejora en reinserción juvenil. Su experiencia municipal en seguridad pública, diagnóstico territorial, encuestas, focus groups e informes se puede traducir de forma muy natural al cargo.',notes:'Vacante Junior / sin experiencia. Presencial en La Florida. Requiere título de Sociología, Trabajo Social o Antropología, conocimientos de Ley 21.527 y Ley 20.084 y referencias de jefaturas recientes. La experiencia con adolescentes/justicia juvenil y el manejo de derechos de infancia y estrategias socio-jurídicas son deseables, no obligatorios. Cierre: 8 sep 2026.',requirements:[
    {id:'cv',label:'CV orientado al cargo',type:'document',category:'CV',state:'action',help:'Usa el CV actual como base y destaca seguridad pública municipal, diagnóstico territorial, encuestas/focus groups, análisis y redacción de informes.'},
    {id:'degree',label:'Título universitario',type:'document',category:'Estudios',state:'action',help:'La convocatoria exige acreditar título de Sociología, Trabajo Social o Antropología. Sube el diploma o certificado oficial que ya tengas.'},
    {id:'laws',label:'Conocer Ley 21.527 y Ley 20.084',type:'action',category:'Otros',state:'action',help:'La oferta pide conocimientos, no un certificado específico. Basta preparar una lectura enfocada de ambas leyes y una breve nota con los puntos relevantes para reinserción juvenil.'},
    {id:'recommendation',label:'Referencias de jefaturas recientes',type:'document',category:'Recomendaciones',state:'action',help:'La oferta pide referencias laborales recientes, no necesariamente cartas. Prepara nombre, cargo, relación laboral, teléfono/email y confirma que estén disponibles para ser contactados.'},
    {id:'juvenile',label:'Experiencia con adolescentes / justicia juvenil (deseable)',type:'action',category:'Otros',state:'action',help:'Es deseable, no obligatoria. No bloquea la postulación. Enfatiza experiencia transferible en seguridad pública, trabajo territorial, análisis social y contacto con actores municipales.'},
    {id:'childrights',label:'Derechos de infancia y enfoque socio-jurídico (deseable)',type:'action',category:'Otros',state:'action',help:'También es deseable. Puedes preparar una lectura breve sobre Convención de Derechos del Niño, tribunales de garantía y el enfoque de reinserción sin pretender experiencia que no tengas.'},
    {id:'application',label:'Formulario de postulación',type:'easy',category:'Otros',state:'easy',help:'HiringRoom permite importar el CV o completar el formulario manualmente. Haz primero el CV y las referencias; el formulario es el último paso.'}
  ]};
  function ensure(){
    if(!Array.isArray(state.opportunities))return;
    let changed=false;
    state.opportunities.forEach(o=>{if(o.id!==OPP.id&&o.interestRating==null&&/muy alta/i.test(String(o.priority||''))){o.interestRating=4;changed=true}});
    const i=state.opportunities.findIndex(o=>o.id===OPP.id);
    if(i<0){state.opportunities.unshift(JSON.parse(JSON.stringify(OPP)));changed=true}
    else if(state.opportunities[i].interestRating==null){state.opportunities[i].interestRating=5;changed=true}
    if(changed){try{save()}catch{} try{render()}catch{}}
  }
  window.addEventListener('postula-workspace-ready',()=>setTimeout(ensure,0));
  if(window.postulaWorkspace?.isReady?.())ensure();
})();