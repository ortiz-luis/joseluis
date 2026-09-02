(()=>{
  if(typeof state==='undefined')return;

  const MARIHE={
    id:'marihe-2027',
    title:'MARIHE — Erasmus Mundus 2027',
    institution:'MARIHE Consortium / Erasmus Mundus',
    country:'Europa / Asia',
    city:'Austria · Finlandia · movilidad internacional',
    funding:'Matrícula cubierta; beca EMJM hasta €1.400/mes',
    duration:'2 años',
    deadline:'2026-09-21',
    status:'preparing',
    priority:'Alta',
    sourceUrl:'https://www.marihe.eu/how-to-apply/',
    why:'Vía profesional en política y gestión de educación superior, evaluación, investigación e innovación. Sociología es elegible y el perfil de análisis social, encuestas e informes puede traducirse bien a policy y monitoring/evaluation.',
    notes:'Round 1: 21 sep 2026, 10:00 CEST. Son 9 documentos obligatorios. Si queda preseleccionado, Round 2 pide un video antes del 11 dic 2026. La matrícula de €18.000 está cubierta para todos los seleccionados; las becas Erasmus Mundus disponibles añaden hasta €1.400/mes.',
    requirements:[
      {id:'marihe-application',label:'Formulario MARIHE firmado',type:'document',category:'Otros',state:'action'},
      {id:'passport',label:'Pasaporte / documento de identidad',type:'document',category:'Identidad',state:'action'},
      {id:'cv',label:'CV Europass en inglés',type:'document',category:'CV',state:'action'},
      {id:'motivation',label:'Carta de motivación MARIHE',type:'document',category:'CV',state:'action'},
      {id:'degree',label:'Título universitario',type:'document',category:'Estudios',state:'action'},
      {id:'transcript',label:'Certificado de notas / transcript',type:'document',category:'Estudios',state:'action'},
      {id:'english',label:'Prueba de inglés',type:'document',category:'Idiomas',state:'action'},
      {id:'recommendation',label:'Dos cartas de recomendación',type:'document',category:'Recomendaciones',state:'action'},
      {id:'marihe-essay',label:'Essay MARIHE',type:'document',category:'Muestras',state:'action'},
      {id:'marihe-video',label:'Video de Round 2 (sólo si queda preseleccionado)',type:'action',category:'Otros',state:'action'}
    ]
  };

  const APP_DOCS='https://www.marihe.eu/application-documents/';
  const ADMISSION='https://www.marihe.eu/admission-requirements/';
  const TIMELINE='https://www.marihe.eu/how-to-apply/application-process-and-timetable';
  const FUNDING='https://www.marihe.eu/funding/';
  const specific={
    'marihe-application':{advice:'Es el formulario oficial de MARIHE. Se puede preparar con calma y revisar antes de enviarlo; recuerda que la versión final debe ir fechada y firmada a mano.',url:APP_DOCS,label:'Abrir documentos oficiales',category:'Otros'},
    passport:{advice:'Sólo necesitas una copia escaneada y legible de un documento de identidad válido. Si ya tienes el pasaporte guardado en Documentos, úsalo como punto de partida.',url:APP_DOCS,label:'Ver requisito oficial',category:'Identidad'},
    cv:{advice:'MARIHE pide CV en formato Europass y sin fotografía. No hace falta reconstruir toda tu trayectoria desde cero: usa el CV actual como base y adapta después el formato.',url:APP_DOCS,label:'Ver instrucciones del CV',category:'CV'},
    motivation:{advice:'La carta usa una plantilla y una declaración sobre uso de IA. Empieza con un borrador centrado en educación superior, policy, análisis y tu experiencia aplicada; luego lo ajustamos al formato oficial.',url:APP_DOCS,label:'Ver plantilla oficial',category:'CV'},
    degree:{advice:'Si el diploma definitivo todavía no estuviera disponible, MARIHE permite solicitar entrega tardía hasta el 11 de diciembre mediante la declaración prevista, siempre que se presente esa declaración antes del deadline principal. No bloquees el resto del dossier por este punto.',url:APP_DOCS,label:'Ver regla de entrega tardía',category:'Estudios'},
    transcript:{advice:'Sube el transcript oficial que tengas. Si no está en inglés, MARIHE exige además traducción oficialmente certificada; puedes organizar primero el original y dejar la traducción como siguiente subtarea.',url:APP_DOCS,label:'Ver reglas de traducción',category:'Estudios'},
    english:{advice:'Este requisito sí es formal, pero hay margen de organización: MARIHE acepta cinco pruebas concretas o una exención que cumpla sus reglas. Si el resultado del test llega después del 21 de septiembre, puede pedirse entrega tardía hasta el 11 de diciembre presentando antes la declaración correspondiente.',url:ADMISSION,label:'Ver pruebas de inglés aceptadas',category:'Idiomas'},
    recommendation:{advice:'Se requieren dos cartas. No necesitas tener ambas hoy: identifica primero a dos personas, envíales las instrucciones oficiales y guarda cada carta cuando llegue. Lo importante ahora es iniciar las solicitudes con tiempo.',url:APP_DOCS,label:'Ver instrucciones para referencias',category:'Recomendaciones'},
    'marihe-essay':{advice:'El essay tiene plantilla y declaración sobre IA. Trátalo como una pieza separada de la carta: primero guarda un borrador suficientemente bueno y luego lo afinamos según el tema oficial.',url:APP_DOCS,label:'Ver plantilla del essay',category:'Muestras'},
    'marihe-video':{advice:'No tienes que preparar este video ahora. Sólo lo presentan quienes pasan a Round 2. Si quedas preseleccionado, el plazo es el 11 de diciembre de 2026; por ahora basta con saber que existe.',url:TIMELINE,label:'Ver Round 2',category:'Otros'}
  };

  const previousGuidance=window.postulaRequirementGuidance;
  window.postulaRequirementGuidance=(o,q)=>{
    if(o?.id==='marihe-2027'){
      const g=specific[q?.id]||{};
      return {advice:g.advice||'Guarda el mejor respaldo que ya tengas; se puede reemplazar más adelante.',url:g.url||APP_DOCS,label:g.label||'Ver instrucciones oficiales',category:g.category||q?.category||'Otros'};
    }
    return previousGuidance?.(o,q)||{advice:q?.help||'No hace falta resolverlo todo ahora.',category:q?.category||'Otros'};
  };

  function ensure(){
    if(!Array.isArray(state.opportunities))return;
    let changed=false;
    if(!state.opportunities.some(o=>o.id===MARIHE.id)){
      state.opportunities.push(JSON.parse(JSON.stringify(MARIHE)));
      changed=true;
    }
    const unesco=state.opportunities.find(o=>o.id==='unesco-internship-2026');
    if(unesco&&!/Education Sector/i.test(unesco.notes||'')){
      unesco.notes=((unesco.notes||'').trim()+' También existe un pool específico de UNESCO Education Sector con la misma lógica general de elegibilidad; se puede tratar como una orientación dentro de esta candidatura.').trim();
      changed=true;
    }
    if(changed){try{save()}catch{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch{}}try{render()}catch{}}
  }

  window.addEventListener('postula-workspace-ready',()=>setTimeout(ensure,0));
  if(window.postulaWorkspace?.isReady?.())setTimeout(ensure,0);
  else setTimeout(ensure,1200);
})();
