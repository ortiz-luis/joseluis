(() => {
  const preview=document.querySelector('#preview');
  if(!preview)return;
  const clean=()=>{
    const walker=document.createTreeWalker(preview,NodeFilter.SHOW_TEXT);
    let n;
    while((n=walker.nextNode())){
      n.nodeValue=n.nodeValue
        .replace(/\s*-\s*revisar año de egreso/gi,'')
        .replace(/revisar nivel actual/gi,'');
    }
  };
  const obs=new MutationObserver(clean);
  obs.observe(preview,{childList:true,subtree:true,characterData:true});
  clean();
})();