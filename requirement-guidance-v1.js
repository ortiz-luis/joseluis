(() => {
  if(typeof state==='undefined')return;

  const U={
    gmf:'https://recruiting.paylocity.com/recruiting/jobs/Details/4320819/German-Marshall-Fund-Of-The-US/Trainee',
    blue:'https://traineeships.ec.europa.eu/about/process-overview/updated-application-instructions_en',
    blueSubmit:'https://traineeships.ec.europa.eu/complete-and-submit-application_en',
    cor:'https://www.cor.europa.eu/en/about/work-us/traineeships',
    schuman:'https://www.europarl.europa.eu/at-your-service/en/work-with-us/traineeships',
    schumanFaq:'https://www.europarl.europa.eu/at-your-service/files/work-with-us/traineeships/home-page/en-frequently-asked-questions.pdf',
    eit:'https://www.eit.europa.eu/sites/default/files/2025-06/Decision%2014-2025_Traineeship%20Scheme.pdf',
    unesco:'https://careers.unesco.org/content/Internship-Programme/',
    oecd:'https://www.oecd.org/en/about/careers/young-associates.html',
    mapp:'https://www.mundusmapp.org/admissions-checklist/',
    luksic:'https://www.sciencespo.fr/students/en/fees-funding/bursaries-financial-aid/luksic-scholarship/',
    france:'https://france-visas.gouv.fr/es/web/france-visas/jeunes-voyageurs'
  };

  const common={
    cv:{advice:'No hace falta que sea la versión definitiva. Sube el mejor CV que tengas hoy: después se puede reemplazar por una versión mejor sin perder el avance del dossier.',category:'CV'},
    degree:{advice:'Empieza por lo que ya tengas: diploma escaneado, certificado oficial de egreso o documento universitario equivalente. Si la convocatoria exige una forma concreta, el enlace oficial de abajo lo aclara.',category:'Estudios'},
    transcript:{advice:'Puede servir el certificado oficial de notas o transcript emitido por la universidad. Guarda primero la copia que tengas; luego podemos sustituirla por una versión traducida o certificada si la convocatoria lo pide.',category:'Estudios'},
    grades:{advice:'Guarda aquí el certificado de notas o transcript. La conversión de GPA, si hace falta, se resuelve después; no necesitas rehacer tus documentos académicos ahora.',category:'Estudios'},
    motivation:{advice:'No necesitas una carta perfecta para avanzar. Puedes crear un primer borrador con el builder, guardarlo aquí y mejorarlo después para esta convocatoria.',category:'CV'},
    english:{advice:'Antes de asumir que necesitas pagar un examen, revisa qué pruebas acepta esta convocatoria. Muchas aceptan certificados, estudios cursados en el idioma u otras evidencias además de IELTS/TOEFL.',category:'Idiomas'},
    application:{advice:'Este punto significa preparar el formulario, no tenerlo terminado ahora. Puedes subir una copia PDF, captura o borrador como respaldo del progreso y reemplazarla cuando envíes la versión final.',category:'Otros'},
    preferences:{advice:'Es una decisión, no un documento difícil. Puedes guardar una nota o captura con tus opciones provisionales y cambiarlas antes de enviar la candidatura.',category:'Otros'},
    eligibility:{advice:'Trátalo como una comprobación previa, no como algo que tengas que “conseguir”. Si la regla no encaja, lo sabremos pronto y evitaremos gastar energía en un dossier que no corresponde.',category:'Otros'},
    visa:{advice:'No necesitas resolver hoy todo el proceso migratorio. Guarda cualquier comprobación, correo o nota oficial que aclare tu situación y úsala como respaldo mientras verificamos el requisito exacto.',category:'Otros'},
    age:{advice:'Esto es sólo una comprobación de elegibilidad. Guarda una captura o nota de la regla oficial si te sirve; no hay ningún documento especial que “fabricar”.',category:'Otros'},
    history:{advice:'Basta con confirmar si ya utilizaste antes este programa. Si tienes una visa o resolución antigua, puedes guardarla aquí como respaldo; si no, una nota de verificación es suficiente para organizar el dossier.',category:'Otros'},
    funds:{advice:'No necesitas reunir hoy un dossier financiero perfecto. Empieza guardando un extracto bancario reciente o una nota con la lista de justificantes; France‑Visas te dará la lista exacta según tu situación.',category:'Otros'}
  };

  const specific={
    'gmf-brussels-2026:english':{advice:'GMF exige inglés fluido, pero la oferta no pide un certificado lingüístico específico. Si no tienes examen oficial, puedes guardar aquí evidencia útil de trabajo/estudios en inglés o una nota para preparar la entrevista.',url:U.gmf,label:'Ver oferta oficial'},
    'gmf-brussels-2026:motivation':{advice:'La oferta pide CV y cover letter. Si la plataforma falla, GMF indica expresamente que se pueden enviar por email a hr@gmfus.org indicando el puesto en el asunto. Eso da una vía de respaldo real.',url:U.gmf,label:'Ver instrucciones de GMF'},
    'gmf-brussels-2026:visa':{advice:'La oferta no resuelve por sí sola la situación migratoria. No bloquees el resto del dossier por esto: guarda cualquier respuesta de RR. HH. o comprobación de permiso y sigue preparando CV/carta.',url:U.gmf,label:'Ver oferta oficial'},

    'blue-book-2027:english':{advice:'Blue Book acepta varias formas de prueba: certificados CEFR, TOEFL/IELTS/DELF/DELE, Duolingo English Test, estudios universitarios cursados íntegramente en el idioma y otras certificaciones oficiales. Incluso certificados vencidos pueden aceptarse. Primero revisa lo que ya tienes.',url:U.blue,label:'Ver pruebas de idioma aceptadas'},
    'blue-book-2027:application':{advice:'La candidatura se arma como un dossier de justificantes. Blue Book pide preparar con tiempo un único PDF con índice y pruebas de lo que declares. Puedes ir reuniendo piezas aquí sin enviar nada todavía.',url:U.blueSubmit,label:'Ver cómo se presenta el dossier'},
    'blue-book-2027:degree':{advice:'Para estudios completados se aceptan diplomas/títulos y transcripts. Los títulos obtenidos fuera de la UE pueden aceptarse si prueban un ciclo universitario completo; no asumas que un título chileno queda fuera.',url:U.blue,label:'Ver reglas de estudios'},
    'blue-book-2027:transcript':{advice:'El transcript/listado de asignaturas es una de las pruebas previstas por Blue Book. Sube la copia oficial que tengas; si luego hace falta traducción, podemos reemplazarla.',url:U.blue,label:'Ver documentos aceptados'},

    'cor-cicero-2027:english':{advice:'El CoR pide fluidez en una lengua de la UE y conocimiento satisfactorio de inglés o francés. No conviertas esto en un problema documental antes de tiempo: primero guarda cualquier certificado o evidencia disponible y revisa el formulario oficial.',url:U.cor,label:'Ver requisitos del CoR'},
    'cor-cicero-2027:motivation':{advice:'El formulario puede modificarse antes del cierre. Puedes preparar una motivación provisional, guardarla y afinarla después sin tener que resolver todo en una sesión.',url:U.cor,label:'Ver cómo postular'},

    'schuman-2027:english':{advice:'Para Schuman, los justificantes de elegibilidad normalmente no se envían con la candidatura inicial: se solicitan si quedas preseleccionado. Así que puedes avanzar con CV y motivación sin entrar en pánico por reunir hoy cada certificado.',url:U.schumanFaq,label:'Ver FAQ Schuman'},
    'schuman-2027:degree':{advice:'Si aún no tienes el diploma físico, la FAQ indica que una declaración oficial de la universidad puede servir si eres seleccionado, siempre que confirme que el título se obtuvo a tiempo.',url:U.schumanFaq,label:'Ver FAQ Schuman'},
    'schuman-2027:motivation':{advice:'La candidatura puede redactarse en una lengua oficial de la UE; el Parlamento recomienda CV en inglés o francés y la motivación en la lengua de la oferta. Un borrador bueno basta para empezar.',url:U.schumanFaq,label:'Ver recomendaciones de candidatura'},

    'eit-2027:english':{advice:'EIT exige muy buen inglés, pero permite justificarlo con diplomas, certificados o prueba de haber estudiado en el idioma. Antes de pensar en un examen nuevo, revisa qué evidencia ya tienes.',url:U.eit,label:'Ver reglas del programa EIT'},
    'eit-2027:degree':{advice:'EIT permite copias de diplomas o certificados oficiales relevantes. Para estudios en curso, contempla una declaración oficial de la universidad. Sube lo que tengas y luego ajustamos si hace falta.',url:U.eit,label:'Ver reglas de titulaciones'},
    'eit-2027:cv':{advice:'El CV se completa en el sistema de candidatura. Puedes usar tu CV actual como base y guardar aquí una copia de trabajo; no necesitas rehacerlo desde cero antes de abrir el formulario.',url:U.eit,label:'Ver reglas del traineeship'},
    'eit-2027:preferences':{advice:'Elegir áreas es una decisión reversible mientras preparas la candidatura. Guarda una nota con tus dos opciones favoritas y vuelve a ella después; no bloquea el resto del dossier.',url:U.eit,label:'Ver reglas del traineeship'},

    'unesco-internship-2026:english':{advice:'UNESCO pide excelente inglés o francés. La página no exige aquí un examen concreto. Puedes guardar certificados, estudios o experiencia en el idioma como respaldo y seguir con el resto de la candidatura.',url:U.unesco,label:'Ver requisitos UNESCO'},
    'unesco-internship-2026:application':{advice:'UNESCO recomienda tener CV y carta listos antes de empezar porque el formulario tiene tiempo limitado. Prepara esas dos piezas aquí primero; luego el formulario será mucho menos estresante.',url:U.unesco,label:'Ver cómo preparar la candidatura'},
    'unesco-internship-2026:degree':{advice:'UNESCO acepta estudiantes avanzados o titulados recientes según reglas específicas. Si tus documentos no están en inglés o francés, indica que puede presentarse una traducción no oficial en PDF para la candidatura.',url:U.unesco,label:'Ver elegibilidad UNESCO'},

    'oecd-yap-2027:eligibility':{advice:'Este es un filtro real, no un documento pendiente. La OECD ofrece un comprobador de elegibilidad. Haz esa verificación primero; si no encaja la cohorte concreta, no significa que falte un papel, sino que conviene priorizar otra oportunidad.',url:U.oecd,label:'Abrir comprobador/criterios OECD'},
    'oecd-yap-2027:english':{advice:'La OECD pide fluidez en inglés o francés y compromiso de alcanzar buen nivel del otro. La página de criterios no exige un examen concreto; guarda la mejor evidencia que ya tengas y no frenes el dossier por un certificado nuevo.',url:U.oecd,label:'Ver criterios OECD'},
    'oecd-yap-2027:grades':{advice:'La OECD usa un umbral académico y ofrece una herramienta de conversión de GPA. Guarda primero tu transcript oficial; la conversión se puede hacer después sin modificar el documento original.',url:U.oecd,label:'Ver criterios y GPA OECD'},

    'mundus-mapp-2027:english':{advice:'Mundus MAPP acepta varias pruebas, no sólo IELTS: TOEFL, IELTS, Cambridge, PTE y Duolingo (130) para admisión, además de posibles exenciones en casos concretos de estudios íntegramente en inglés. Revisa primero la vía que te resulte más fácil.',url:U.mapp,label:'Ver opciones de inglés MAPP'},
    'mundus-mapp-2027:degree':{advice:'Para la candidatura se pide copia escaneada del diploma y transcript, con traducción oficial al inglés cuando corresponda. Sube ahora tus originales; la versión traducida puede reemplazarlos después.',url:U.mapp,label:'Ver checklist MAPP'},
    'mundus-mapp-2027:transcript':{advice:'El transcript es parte del formulario. Empieza con el documento oficial que tengas y deja la traducción/certificación como una subtarea posterior, no como un bloqueo para empezar.',url:U.mapp,label:'Ver checklist MAPP'},
    'mundus-mapp-2027:motivation':{advice:'El statement of purpose tiene un máximo de 500 palabras. Eso es manejable: guarda primero un borrador de una página y luego lo afinamos para el track elegido.',url:U.mapp,label:'Ver instrucciones del statement'},

    'sciencespo-luksic-2027:motivation':{advice:'La beca Luksic pide una carta de motivación de máximo 2 páginas dirigida al comité. Puedes crear una primera versión aquí y mejorarla después; no necesitas resolver todo el máster y la beca de una vez.',url:U.luksic,label:'Ver beca Luksic'},
    'sciencespo-luksic-2027:eligibility':{advice:'La beca exige nacionalidad chilena, residencia habitual en Chile (con una excepción para estudios temporales fuera) y no tener doble nacionalidad UE, además de admisión en un máster elegible. Es una verificación, no un documento que tengas que conseguir.',url:U.luksic,label:'Ver elegibilidad Luksic'},
    'sciencespo-luksic-2027:english':{advice:'El requisito de idioma depende del máster de Sciences Po elegido; la beca en sí se centra en admisión + CV + motivación. Primero define el máster y después comprobamos su prueba lingüística concreta.',url:U.luksic,label:'Ver proceso Luksic'},
    'sciencespo-luksic-2027:cv':{advice:'La beca pide CV en su formulario paralelo a la admisión. Tu CV actual sirve como punto de partida; puedes reemplazarlo cuando tengas una versión más orientada a servicio público.',url:U.luksic,label:'Ver proceso Luksic'},

    'france-working-holiday:age':{advice:'Para ciudadanos chilenos, France‑Visas indica que la solicitud puede presentarse desde los 18 años hasta el día en que se cumplen 30. Comprueba esto primero: es una regla objetiva, no algo que falte en tu dossier.',url:U.france,label:'Ver regla de edad oficial'},
    'france-working-holiday:funds':{advice:'France‑Visas pide recursos suficientes y recomienda usar su asistente para obtener la lista exacta de justificantes según tu caso. Puedes empezar guardando extractos bancarios recientes y luego ajustar el dossier.',url:U.france,label:'Ver lista oficial en France‑Visas'},
    'france-working-holiday:history':{advice:'Confirma simplemente si ya utilizaste el programa antes. Si tienes una visa antigua, súbela; si no, guarda una nota de verificación. No hace falta producir un certificado especial para organizar este punto.',url:U.france,label:'Ver condiciones oficiales'},
    'france-working-holiday:passport':{advice:'Guarda una copia legible del pasaporte. France‑Visas generará después la lista exacta de piezas para tu solicitud; tener el pasaporte en el dossier ya te permite avanzar.',url:U.france,label:'Ver France‑Visas'}
  };

  function guidance(o,q){
    const key=`${o?.id||''}:${q?.id||''}`;
    const base=common[q?.id]||{};
    const custom=specific[key]||{};
    const fallback=q?.type==='document'
      ? {advice:'No necesitas la versión perfecta para avanzar. Sube el mejor documento disponible hoy; si después aparece una versión más oficial, traducida o actualizada, se puede reemplazar.',category:q.category||'Otros'}
      : {advice:'No hace falta resolverlo todo hoy. Puedes guardar una prueba, nota o captura que muestre tu avance y volver a este punto más adelante.',category:q.category||'Otros'};
    return {...fallback,...base,...custom,category:custom.category||base.category||q?.category||fallback.category||'Otros'};
  }

  const oldRoleLabel=window.postulaDocumentRoleLabel;
  const extraRoleLabels={english:'Prueba de idioma',application:'Formulario / candidatura',visa:'Situación migratoria',eligibility:'Comprobación de elegibilidad',preferences:'Preferencias',age:'Comprobación de edad',history:'Antecedente del programa',funds:'Recursos financieros'};
  window.postulaDocumentRoleLabel=role=>extraRoleLabels[role]||oldRoleLabel?.(role)||role||'';
  window.postulaRequirementGuidance=guidance;

  function usable(d){return d?.status==='ready'&&!!d?.storagePath}
  function linked(q){return (state.documents||[]).find(d=>usable(d)&&window.postulaDocumentMatch?.(d,q))}
  function uploadFor(o,q){
    const g=guidance(o,q),role=window.postulaRequirementRole?.(q)||q.id||null;
    window.postulaDocuments?.setUploadContext?.({role,label:q.label,category:g.category,opportunityId:o.id,requirementId:q.id,markRequirementReady:true});
    closeModal();
    const input=document.querySelector('#file-input');if(input){input.value='';input.click()}
  }

  openReq=function(id,rid){
    const o=state.opportunities.find(x=>x.id===id),q=(o?.requirements||[]).find(x=>x.id===rid);if(!q)return;
    const g=guidance(o,q),doc=linked(q),done=q.state==='ready'||!!doc;
    const official=g.url?`<a class="req-guidance-link" href="${esc(g.url)}" target="_blank" rel="noopener">${esc(g.label||'Ver requisito oficial')} ↗</a>`:'';
    const existing=doc?`<div class="existing-doc-card truthful"><div class="doc-list-main"><span class="real-file-mark">DOC</span><span><b>${esc(doc.name)}</b><small>Respaldo guardado para este punto</small></span></div><div class="doc-list-actions"><button type="button" data-view-doc="${esc(doc.id)}">Visualizar</button><button type="button" data-download-doc="${esc(doc.id)}">Descargar</button></div></div>`:'';
    openModal(`<h2>${esc(q.label)}</h2><div class="req-calm-card"><strong>No hace falta resolverlo todo ahora.</strong><p>${esc(g.advice)}</p>${official}</div>${existing}<div class="req-guidance-actions"><button type="button" class="button primary" id="req-upload-support">${doc?'Subir otro respaldo':'Subir respaldo al dossier'}</button>${q.type!=='document'?`<button type="button" class="button soft" id="req-manual-done">${done?'Marcar como pendiente':'Marcar resuelto sin archivo'}</button>`:''}</div>`);
    const up=document.querySelector('#req-upload-support');if(up)up.onclick=()=>uploadFor(o,q);
    const manual=document.querySelector('#req-manual-done');if(manual)manual.onclick=()=>{q.state=done?'action':'ready';save(done?'Vuelto a pendiente':'Marcado como resuelto');closeModal();render()};
  };
})();
