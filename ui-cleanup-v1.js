(() => {
  const replaceLongDash=s=>typeof s==='string'?s.replace(/—/g,'·'):s;

  function scrubValue(value,seen=new WeakSet()){
    if(typeof value==='string')return replaceLongDash(value);
    if(!value||typeof value!=='object')return value;
    if(seen.has(value))return value;
    seen.add(value);
    if(Array.isArray(value)){
      for(let i=0;i<value.length;i++)value[i]=scrubValue(value[i],seen);
      return value;
    }
    for(const k of Object.keys(value))value[k]=scrubValue(value[k],seen);
    return value;
  }

  function scrubDom(root=document.body){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let n;
    while((n=walker.nextNode())){
      if(n.nodeValue&&n.nodeValue.includes('—'))n.nodeValue=replaceLongDash(n.nodeValue);
    }
    document.querySelectorAll('[title],[aria-label],[placeholder]').forEach(el=>{
      for(const a of ['title','aria-label','placeholder']){
        const v=el.getAttribute(a);
        if(v&&v.includes('—'))el.setAttribute(a,replaceLongDash(v));
      }
    });
  }

  try{
    if(typeof state!=='undefined'){
      scrubValue(state);
      if(typeof save==='function')save();
    }
  }catch{}

  scrubDom();
  const observer=new MutationObserver(mutations=>{
    for(const m of mutations){
      if(m.type==='characterData'&&m.target.nodeValue?.includes('—'))m.target.nodeValue=replaceLongDash(m.target.nodeValue);
      for(const node of m.addedNodes||[]){
        if(node.nodeType===Node.TEXT_NODE&&node.nodeValue?.includes('—'))node.nodeValue=replaceLongDash(node.nodeValue);
        else if(node.nodeType===Node.ELEMENT_NODE)scrubDom(node);
      }
    }
  });
  observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
})();