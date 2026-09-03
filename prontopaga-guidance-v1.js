(()=>{
  const prior=window.postulaRequirementGuidance;
  window.postulaRequirementGuidance=(o,q)=>{
    if(o?.id==='prontopaga-market-research-2026')return {
      advice:q?.help||'Puedes preparar este punto con evidencia que ya tengas; no hace falta cumplir todos los deseables para postular.',
      category:q?.category||'Otros',
      url:o.sourceUrl,
      label:'Ver vacante de ProntoPaga'
    };
    return prior?.(o,q)||{advice:q?.help||'No hace falta resolverlo todo ahora.',category:q?.category||'Otros'};
  };
})();