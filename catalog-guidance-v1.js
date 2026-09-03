(()=>{
  const prior=window.postulaRequirementGuidance;
  window.postulaRequirementGuidance=(o,q)=>{
    if(o?.id==='eclac-staff-council-283672')return {advice:q?.help||'Puedes avanzar con lo que ya tengas.',category:q?.category||'Otros',url:o.sourceUrl,label:'Ver convocatoria oficial'};
    return prior?.(o,q)||{advice:q?.help||'No hace falta resolverlo todo ahora.',category:q?.category||'Otros'};
  };
})();