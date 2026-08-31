(() => {
  const MAP_KEY='postula-storage-map-v1';

  function readMap(){
    try{return JSON.parse(localStorage.getItem(MAP_KEY)||'{}')}catch{return {}}
  }

  function reconcile(){
    if(typeof state==='undefined'||!Array.isArray(state.documents))return false;
    const map=readMap();
    let changed=false;

    for(const doc of state.documents){
      const byId=map[doc.id];
      const byName=map[`name:${doc.name}`];
      const meta=byId||byName;
      if(!meta?.path)continue;

      if(!byId){
        map[doc.id]=meta;
        changed=true;
      }
      if(doc.fileStored!==true||doc.status!=='ready'||doc.storageProvider!=='supabase'){
        doc.fileStored=true;
        doc.status='ready';
        doc.storageProvider='supabase';
        changed=true;
      }
    }

    if(changed){
      localStorage.setItem(MAP_KEY,JSON.stringify(map));
      try{save()}catch{}
      try{render()}catch{}
    }
    return changed;
  }

  window.addEventListener('load',()=>setTimeout(reconcile,200));
  window.addEventListener('hashchange',()=>setTimeout(reconcile,50));
  document.addEventListener('change',e=>{
    const input=e.target;
    if(input instanceof HTMLInputElement&&input.id==='file-input')setTimeout(reconcile,800);
  });

  window.postulaReconcileStorage=reconcile;
})();
