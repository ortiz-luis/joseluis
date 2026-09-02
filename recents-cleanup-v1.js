(()=>{
  const RECENT_KEYS=['joseluis-ux-recents-v1','postula-recent-v1'];
  const clearStored=()=>RECENT_KEYS.forEach(k=>{try{localStorage.removeItem(k)}catch{}});

  function cleanup(){
    clearStored();

    document.querySelectorAll('#ux-recents').forEach(x=>x.remove());
    document.querySelectorAll('.ux-section-label').forEach(x=>{
      if((x.textContent||'').trim().toLowerCase()==='recientes')x.remove();
    });
    document.querySelectorAll('a[href="#recent"]').forEach(x=>x.remove());

    const main=document.querySelector('#main');
    if(main){
      main.querySelectorAll('.final-section').forEach(section=>{
        const h=section.querySelector('h2');
        if((h?.textContent||'').trim().toLowerCase()==='recientes')section.remove();
      });
    }

    if(location.hash==='#recent')location.replace('#home');
  }

  if(typeof render==='function'){
    const priorRender=render;
    render=function(){priorRender();cleanup()};
  }

  window.addEventListener('hashchange',()=>setTimeout(cleanup,0));
  window.addEventListener('postula-workspace-ready',()=>setTimeout(cleanup,0));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',cleanup);else cleanup();

  const root=document.querySelector('.app-shell');
  if(root)new MutationObserver(()=>cleanup()).observe(root,{childList:true,subtree:true});
})();
