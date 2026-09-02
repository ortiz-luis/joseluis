(() => {
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('#req-upload-support,[data-action="req"]');if(!b)return;
    const r=typeof route==='function'?route():null;
    const o=(state?.opportunities||[]).find(x=>x.id===(b.dataset.id||r?.id));if(!o)return;
    const rid=b.dataset.req;
    let q=rid?(o.requirements||[]).find(x=>x.id===rid):null;
    if(!q){const title=document.querySelector('#modal h2')?.textContent?.trim();q=(o.requirements||[]).find(x=>x.label===title)}
    if(!q)return;
    const g=window.postulaRequirementGuidance?.(o,q);
    if(g?.category&&typeof docFilter!=='undefined')docFilter=g.category;
  },true);
})();
