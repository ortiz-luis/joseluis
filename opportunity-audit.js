(() => {
  const EXCLUDED_IDS=new Set(['blue-book-2027']);
  const req=(id,label,type,category,help,actionLabel='')=>({id,label,type,category:category||'',help,actionLabel,state:type==='document'?'action':'action'});
  const AUDIT={
    'gmf-brussels-2026':{
      status:'preparing',deadline:'',title:'GMF — Program & Research Trainee',funding:'€1.000–1.200 netos/mes',duration:'sep 2026–ene 2027',
      why:'Investigación, escritura y seguimiento político en un think tank internacional. Encaja con un perfil de sociología orientado a investigación y políticas públicas.',
      notes:'Oferta activa en Bruselas. Inglés fluido obligatorio; ucraniano es una ventaja fuerte, no un requisito. Si falla el portal, GMF permite enviar CV y carta por email.',
      requirements:[
        req('cv','Preparar CV en inglés','document','CV','Adaptar el CV al puesto: investigación, escritura, análisis político/social, experiencia internacional y manejo de Microsoft Office. No basta con un CV genérico.','Abrir / subir CV'),
        req('degree','Subir título universitario','document','Estudios','GMF pide un Bachelor en un área relacionada. Sociología puede defenderse como área afín si el CV y la carta conectan bien la formación con investigación, democracia y políticas públicas.','Abrir / subir título'),
        req('motivation','Preparar carta de motivación','action','', 'La carta debe explicar por qué interesa democracia, sociedad civil y políticas europeas, y qué experiencia de investigación o escritura puede aportar. También conviene explicar el interés por Ucrania sin fingir experiencia que no existe.'),
        req('english','Confirmar inglés fluido','action','', 'El trabajo es en inglés y GMF exige muy buen nivel escrito y oral. Hay que confirmar que José Luis puede desenvolverse en entrevistas y redactar textos de trabajo en inglés.'),
        req('visa','Confirmar derecho a trabajar en Bélgica','action','', 'Antes de invertir mucho tiempo hay que aclarar si GMF puede contratar a un ciudadano chileno sin permiso belga previo y qué visado o autorización sería necesaria.')
      ]
    },
    'cor-cicero-2027':{
      status:'considering',deadline:'2026-10-01',funding:'≈ €1.538/mes',duration:'16 feb–15 jul 2027',
      why:'Política social, educación, empleo, cohesión territorial y participación ciudadana son áreas muy próximas a una formación en sociología.',
      notes:'Cierre 1 oct 2026 a mediodía, hora de Bruselas. Los ciudadanos no-UE pueden ser seleccionados excepcionalmente si cumplen las reglas belgas de residencia y trabajo.',
      requirements:[
        req('degree','Subir título o certificado de estudios','document','Estudios','Hay que acreditar un grado completo o, como mínimo, haber completado el tercer año de estudios superiores antes del cierre de la convocatoria.','Abrir / subir documento'),
        req('languages','Confirmar inglés o francés','action','', 'José Luis ya tiene español como lengua de la UE. Además, el CDR pide conocimientos satisfactorios de francés o inglés; conviene definir cuál usará en la candidatura y con qué nivel real.'),
        req('services','Elegir hasta 3 servicios del CDR','action','', 'La candidatura permite indicar hasta tres servicios preferidos. Para un sociólogo, conviene revisar primero SEDEC (política social, educación, empleo e investigación), CIVEX (ciudadanía y gobernanza) y COTER (cohesión territorial).'),
        req('eligibility','Confirmar situación migratoria belga','action','', 'Ser chileno no impide postular, pero la selección de no-UE es excepcional y exige poder residir y trabajar legalmente en Bélgica. Hay que aclararlo antes de presentar.'),
        req('application','Completar formulario online','action','', 'Sólo se acepta una candidatura por período. Conviene preparar primero respuestas y documentos, y luego completar el formulario con tiempo antes del cierre.')
      ]
    },
    'schuman-2027':{
      status:'considering',deadline:'2026-10-31',funding:'Remunerada',duration:'mar–jul 2027',
      why:'El Parlamento Europeo ofrece puestos en políticas sociales, empleo, educación, investigación, comunicación y asuntos públicos.',
      notes:'La ventana para la sesión de marzo suele ser del 1 al 31 de octubre. Los candidatos no-UE pueden ser seleccionados en un número limitado y, si son elegidos, deben gestionar sus permisos.',
      requirements:[
        req('degree','Subir título universitario','document','Estudios','Se necesita un título universitario obtenido tras al menos tres años de estudios y disponible con antelación suficiente al inicio de la práctica.','Abrir / subir título'),
        req('positions','Elegir hasta 3 prácticas concretas','action','', 'No se presenta una candidatura genérica: hay que escoger ofertas concretas dentro del Parlamento. Conviene seleccionar hasta tres que encajen de verdad con sociología, políticas públicas, investigación o asuntos sociales.'),
        req('languages','Confirmar idioma de trabajo','action','', 'Hay que revisar el idioma exigido por cada oferta concreta. No basta con decir “inglés o francés” de forma genérica: cada puesto puede pedir un nivel distinto.'),
        req('application','Preparar candidatura para cada puesto','action','', 'Cada una de las prácticas elegidas debe tener una candidatura coherente con sus funciones. Conviene adaptar motivación y experiencia al puesto, no reutilizar el mismo texto sin cambios.'),
        req('visa','Tener claro el plan de visado si resulta seleccionado','action','', 'Los ciudadanos no-UE pueden ser seleccionados, pero los gastos y trámites de visado, residencia y trabajo corren a cargo del candidato.')
      ]
    },
    'eit-2027':{
      status:'preparing',deadline:'2026-09-15',funding:'≈ €1.500 netos/mes',duration:'6 meses · inicio Q1 2027',
      why:'Hay áreas de monitoring, evaluación, educación, innovación y policy research que pueden encajar con sociología aplicada.',
      notes:'Convocatoria EIT/TR/2026/20. Cierre 15 sep 2026 a las 13:00. La mayoría de las plazas son en Budapest; una plaza de comunicación puede estar en Bruselas.',
      requirements:[
        req('application','Completar candidatura online','action','', '“EU CV Online” es simplemente el portal de la Comisión Europea usado para postular. Hay que crear o usar la cuenta, completar el formulario y el CV en inglés y enviar la candidatura antes del cierre.'),
        req('degree','Subir título universitario','document','Estudios','EIT exige un título universitario completo antes de la fecha límite. Guardaremos aquí la copia que se utilizará como respaldo de la candidatura.','Abrir / subir título'),
        req('english','Confirmar inglés mínimo B2','action','', 'Hay que confirmar que José Luis puede demostrar al menos un nivel B2 de inglés y desenvolverse en una candidatura e entrevista en ese idioma.'),
        req('preferences','Elegir hasta 2 áreas de trabajo','action','', 'EIT pide indicar hasta dos áreas preferidas. Para José Luis conviene revisar primero Supervision and Monitoring e Innovation Capacity & Entrepreneurship Education, porque incluyen seguimiento, evaluación, policy research y programas educativos.'),
        req('motivation','Adaptar la motivación a esas áreas','action','', 'Las dos áreas elegidas deben aparecer claramente en la motivación. El texto debe explicar por qué su formación en sociología y experiencia internacional aportan valor justamente en esas funciones.')
      ]
    },
    'unesco-internship-2026':{
      status:'considering',deadline:'2026-12-31',funding:'No remunerada',duration:'1–6 meses',
      why:'UNESCO menciona investigación, síntesis, análisis de datos, documentos, eventos y trabajo con equipos internacionales, tareas compatibles con sociología.',
      notes:'La candidatura entra a un pool de talento válido durante seis meses; no corresponde a una plaza específica. UNESCO no paga salario, viaje ni visado.',
      requirements:[
        req('academic-window','Confirmar que cumple la regla académica','action','', 'Éste es el filtro principal: debe estar en 3º/final de Bachelor, cursando un segundo grado/Máster/PhD, o haber terminado un grado hace no más de 12 meses al emitirse el acuerdo de prácticas. Falta confirmar la fecha exacta de egreso de José Luis.'),
        req('cv','Preparar CV en inglés o francés','document','CV','La candidatura se hace sólo en inglés o francés. Conviene tener un CV actual y coherente con investigación social, análisis de datos, redacción y trabajo internacional.','Abrir / subir CV'),
        req('language','Elegir inglés o francés para postular','action','', 'UNESCO exige excelente dominio escrito y oral de inglés o francés. Hay que escoger el idioma más sólido y usarlo de forma consistente en la candidatura.'),
        req('application','Preparar respuestas antes de abrir el formulario','action','', 'El formulario pregunta por habilidades, experiencia e intereses y sólo da una hora para completarlo. Conviene redactar las respuestas antes de iniciar la sesión.'),
        req('documents','Preparar documentos académicos traducidos si hace falta','action','', 'Antes del inicio pueden pedir pasaporte y certificado de matrícula, transcript o diploma. Si los documentos no están en inglés o francés, UNESCO pide una traducción no oficial a uno de esos idiomas.')
      ]
    },
    'oecd-yap-2027':{
      status:'considering',deadline:'',title:'OECD Young Associates — próxima convocatoria',funding:'Remunerado · París',duration:'2 años',
      why:'Investigación, análisis y políticas públicas en la OCDE encajan muy bien con un perfil joven de sociología, siempre que cumpla la estricta ventana académica.',
      notes:'La convocatoria 2026–28 ya cerró. Esta ficha sirve para preparar y vigilar la próxima cohorte; no hay todavía una fecha oficial 2027 publicada.',
      requirements:[
        req('watch','Esperar apertura oficial de la próxima cohorte','action','', 'No hay que postular ahora. La acción correcta es vigilar la publicación de la próxima ronda y actualizar esta ficha cuando la OCDE publique fechas y puestos.'),
        req('graduation','Confirmar fecha exacta de graduación','action','', 'La OCDE usa una ventana muy estricta de Bachelor reciente. En 2026–28 exigió graduación entre el 1 ene 2025 y el 1 sep 2026. Necesitamos la fecha exacta de José Luis para saber si una futura cohorte puede ser viable.'),
        req('masters','Confirmar que no tiene ni cursa un máster','action','', 'En la ronda vigente, quien ya tenía o estaba cursando Máster/PhD no era elegible. Este dato debe quedar claro antes de invertir tiempo en una futura convocatoria.'),
        req('grades','Preparar notas y conversión GPA','document','Estudios','La ronda 2026–28 exigió GPA mínimo 3.0/4.0. Conviene tener el transcript y poder convertir las notas chilenas al formato solicitado.','Abrir / subir notas'),
        req('language','Confirmar inglés o francés fluido','action','', 'La OCDE exige fluidez en una de sus dos lenguas oficiales y compromiso de mejorar la otra. Hay que definir cuál sería la lengua principal de candidatura.')
      ]
    },
    'mundus-mapp-2027':{
      status:'preparing',deadline:'2026-12-01',funding:'Beca EMJM + otras ayudas',duration:'2 años · 2027–2029',
      why:'Es una transición directa desde sociología hacia policy analysis y políticas públicas, con fuerte componente internacional.',
      notes:'La cohorte 2027–29 abre el 1 sep 2026. Para optar a ayuda financiera, el cierre es 1 dic 2026 a las 23:59 CET.',
      requirements:[
        req('degree','Subir título universitario','document','Estudios','Hay que demostrar el Bachelor requerido para admisión. Si aún faltan documentos oficiales, conviene identificar qué versión provisional acepta el portal y cuándo debe llegar la versión final.','Abrir / subir título'),
        req('transcript','Subir notas / transcript','document','Estudios','El expediente académico es central tanto para admisión como para las becas. Necesitamos una copia actual y legible de las notas.','Abrir / subir notas'),
        req('english','Preparar prueba de inglés aceptada','action','', 'Para la beca no conviene dejar el idioma para después: el programa exige acreditar el inglés al postular mediante una opción aceptada. Hay que decidir pronto qué examen o evidencia utilizar.'),
        req('motivation','Preparar motivación para policy analysis','action','', 'La carta debe explicar la transición desde sociología hacia análisis de políticas públicas y por qué el carácter internacional del programa es coherente con su trayectoria.'),
        req('funding','Marcar interés en beca dentro del portal','action','', 'Quien postula antes del 1 de diciembre puede indicar en el portal que quiere ser considerado para ayuda financiera. No hace falta una candidatura separada para la beca EMJM.')
      ]
    },
    'sciencespo-luksic-2027':{
      status:'preparing',deadline:'',funding:'100% matrícula + manutención',duration:'2 años',
      why:'Beca específicamente dirigida a estudiantes chilenos para másteres de asuntos públicos o internacionales en Sciences Po.',
      notes:'La página oficial todavía muestra el cierre anterior (4 ene 2026). Para 2027 hay que vigilar la nueva fecha; no conviene inventarla. La beca exige postular al máster y, en paralelo, al formulario Luksic.',
      requirements:[
        req('programme','Elegir máster de Public Affairs o PSIA','action','', 'La beca sólo sirve para másteres de dos años en la School of Public Affairs o PSIA. Primero hay que elegir uno o dos programas que realmente encajen con sociología y el proyecto profesional.'),
        req('degree','Subir título universitario','document','Estudios','El título forma parte del expediente de admisión internacional a Sciences Po. Necesitamos una versión actual utilizable en 2026.','Abrir / subir título'),
        req('transcript','Subir notas / transcript','document','Estudios','Las notas forman parte del expediente académico y son importantes para una beca basada también en excelencia.','Abrir / subir notas'),
        req('cv','Preparar CV actualizado','document','CV','Luksic pide CV en su formulario. Debe estar adaptado al máster y mostrar claramente formación, experiencia internacional e intereses de servicio público.','Abrir / subir CV'),
        req('motivation','Preparar carta Luksic de máximo 2 páginas','action','', 'La beca pide una carta dirigida al comité de selección. Debe conectar Chile, servicio público, interés por Francia y el programa elegido; no es la misma carta que la admisión al máster.'),
        req('eligibility','Confirmar residencia en Chile y ausencia de doble nacionalidad UE','action','', 'La beca exige nacionalidad chilena, residencia habitual en Chile y no tener doble nacionalidad de un país de la UE. Hay que confirmar estas condiciones antes de preparar el expediente completo.')
      ]
    },
    'france-working-holiday':{
      status:'considering',deadline:'',title:'Visa Vacances-Travail Francia — Chile',funding:'Permite trabajar hasta 12 meses',duration:'máx. 1 año',
      why:'Puede ser una vía práctica para vivir y trabajar temporalmente en Francia mientras busca experiencia profesional, pero sólo si cumple la edad del acuerdo chileno.',
      notes:'France-Visas indica que para Chile la solicitud puede presentarse desde los 18 años hasta el día en que se cumplen 30. Debe solicitarse en Chile y el motivo principal sigue siendo viaje cultural/turístico.',
      requirements:[
        req('age','Confirmar que todavía puede postular por edad','action','', 'Para Chile, la solicitud debe hacerse antes del día en que cumple 30 años. Necesitamos la fecha de nacimiento exacta; si ya no cumple, esta oportunidad se elimina del radar.'),
        req('history','Confirmar que no usó antes este visado','action','', 'El programa está pensado como una experiencia única. Hay que confirmar que José Luis no obtuvo anteriormente una visa Vacances-Travail francesa.'),
        req('passport','Usar pasaporte vigente','document','Identidad','El pasaporte vigente ya está en Postula. Debe seguir cubriendo el período necesario para la solicitud y la estancia.','Abrir pasaporte'),
        req('funds','Preparar prueba de recursos y retorno','action','', 'La solicitud exige recursos iniciales y cumplir las condiciones del acuerdo, además de elementos relacionados con el viaje y retorno. Conviene preparar esta parte sólo después de confirmar la edad.'),
        req('appointment','Solicitar cita en Santiago','action','', 'France-Visas dispone de una vía específica Vacances-Travail en Santiago. La solicitud debe tramitarse desde Chile, por lo que hay que coordinar el momento de la cita con su situación real.')
      ]
    }
  };

  if(typeof state==='undefined')return;
  state.opportunities=(state.opportunities||[]).filter(o=>!EXCLUDED_IDS.has(o.id)&&o.status!=='excluded');
  for(const o of state.opportunities){const a=AUDIT[o.id];if(a)Object.assign(o,a);}

  const actualReady=cat=>state.documents?.some(d=>d.category===cat&&d.status==='ready'&&d.fileStored);
  if(typeof sync==='function'){
    sync=function(o){for(const q of o.requirements||[]){if(q.type==='document')q.state=actualReady(q.category)?'ready':'action';}}
  }

  save();
  if(typeof render==='function')render();
})();