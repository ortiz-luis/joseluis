(()=>{
  const prior=window.postulaRequirementGuidance;
  const H='https://opcion.hiringroom.com/jobs/get_vacancy/6a974fedfa59a8ac93d7aad4';
  const L21527='https://www.bcn.cl/leychile/navegar?i=1187684&f=2026-01-13';
  const L20084='https://www.bcn.cl/leychile/Navegar?idLey=20084';
  const guide={
    cv:{advice:'La vacante está publicada como Junior. No hace falta inventar experiencia en justicia juvenil: conviene abrir el CV con la experiencia municipal en seguridad pública, diagnóstico territorial, encuestas/focus groups, análisis y redacción de informes.',url:H,label:'Ver cargo oficial'},
    degree:{advice:'Aquí sí hay un requisito formal simple: acreditar un título universitario en Sociología, Trabajo Social o Antropología. El diploma o certificado oficial disponible basta para preparar el dossier; si luego piden otro formato se reemplaza.',url:H,label:'Ver requisito de título'},
    laws:{advice:'La convocatoria pide conocimientos de las leyes 21.527 y 20.084, pero no exige un curso ni un certificado. La tarea razonable es leer sus puntos centrales y preparar una hoja breve con Servicio de Reinserción, responsabilidad penal adolescente, derechos y confidencialidad.',url:L21527,label:'Leer Ley 21.527'},
    recommendation:{advice:'Pide contar con referencias de jefaturas recientes; no dice que deban ser cartas de recomendación. Prepara 2 contactos con nombre, cargo, relación laboral, teléfono/email y avísales que podrían llamarlos. Eso evita convertir este punto en un trámite mayor de lo necesario.',url:H,label:'Ver requisito de referencias'},
    juvenile:{advice:'La experiencia con adolescentes, jóvenes o programas de Justicia Juvenil aparece como deseable, no obligatoria. No es razón para descartarse. La estrategia es explicar la transferencia desde seguridad pública municipal, trabajo territorial, análisis social y coordinación con actores locales.',url:H,label:'Ver qué es obligatorio y qué es deseable'},
    childrights:{advice:'Convención de Derechos del Niño, Tribunales de Garantía y estrategias socio-jurídicas también figuran como deseables. Una lectura dirigida basta para llegar mejor preparado; no necesitas demostrar experiencia previa que la oferta no exige.',url:L20084,label:'Leer marco de responsabilidad adolescente'},
    application:{advice:'La postulación oficial permite importar los datos del CV o completar el formulario manualmente. Con CV, título y referencias preparados, el resto es un formulario normal; no hay una barrera migratoria ni lingüística adicional para un chileno trabajando en Chile.',url:H,label:'Abrir postulación oficial'}
  };
  window.postulaRequirementGuidance=(o,q)=>{
    if(o?.id==='corporacion-opcion-mca-2026'){
      const g=guide[q?.id]||{};
      return {advice:q?.help||'Puedes avanzar con lo que ya tengas y completar este punto después.',category:q?.category||'Otros',...g};
    }
    return prior?.(o,q)||{advice:q?.help||'No hace falta resolverlo todo ahora.',category:q?.category||'Otros'};
  };
})();