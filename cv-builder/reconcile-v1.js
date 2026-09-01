(() => {
  const preview=document.querySelector('#preview');
  if(!preview)return;
  const clean=()=>{
    const walker=document.createTreeWalker(preview,NodeFilter.SHOW_TEXT);
    let n;
    while((n=walker.nextNode())){
      const next=n.nodeValue
        .replace(/\s*-\s*revisar año de egreso/gi,'')
        .replace(/revisar nivel actual/gi,'');
      if(next!==n.nodeValue)n.nodeValue=next;
    }
  };
  const obs=new MutationObserver(mutations=>{
    if(mutations.some(m=>m.type==='childList'))clean();
  });
  obs.observe(preview,{childList:true,subtree:true});
  clean();
})();