(()=>{
  const icons={
    home:'<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9.2V20h13V9.2"/><path d="M9.5 20v-6h5v6"/>',
    opportunities:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/><path d="M10 12v2h4v-2"/>',
    documents:'<path d="M3.5 7.5a2 2 0 0 1 2-2H10l2 2h6.5a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/><path d="M3.5 10h17"/>',
    create:'<path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 3v5h5"/><path d="M8 13h7M8 17h7"/>',
    templates:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M9 10h12"/>',
    profile:'<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    admin:'<path d="M12 3 4.5 6v5c0 4.8 3.1 8 7.5 10 4.4-2 7.5-5.2 7.5-10V6z"/><path d="m9 12 2 2 4-4"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.86 2.86-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H10v-.1A1.7 1.7 0 0 0 9.6 20a1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.88.34l-.06.06-2.86-2.86.06-.06A1.7 1.7 0 0 0 4.2 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2.4V10h.1a1.7 1.7 0 0 0 1.1-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.88L3.8 6.66 6.66 3.8l.06.06A1.7 1.7 0 0 0 8.6 4.2a1.7 1.7 0 0 0 1-.6A1.7 1.7 0 0 0 10 2.5v-.1h4v.1a1.7 1.7 0 0 0 .4 1.1 1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.86 2.86-.06.06A1.7 1.7 0 0 0 19.8 8.6a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4h.1v3.6h-.1a1.7 1.7 0 0 0-1.1.4 1.7 1.7 0 0 0-1 1z"/>'
  };
  const svg=name=>`<svg class="nav-polish-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[name]||icons.documents}</svg>`;
  const keyFor=a=>{
    const h=(a.getAttribute('href')||'').replace(/^#/,'').split('/')[0];
    return ({home:'home',opportunities:'opportunities',documents:'documents',create:'create',templates:'templates',profile:'profile',admin:'admin',settings:'settings'})[h]||null;
  };
  function polish(){
    document.querySelectorAll('#desktop-nav .nav-link,#mobile-nav .nav-link').forEach(a=>{
      const key=keyFor(a);if(!key)return;
      const slot=a.querySelector('.nav-icon');if(!slot)return;
      slot.innerHTML=svg(key);
      slot.dataset.icon=key;
    });
  }
  if(typeof renderNav==='function'){
    const previous=renderNav;
    renderNav=function(){previous();polish()};
  }
  window.addEventListener('hashchange',()=>setTimeout(polish,0));
  window.addEventListener('postula-workspace-ready',()=>setTimeout(polish,0));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',polish);else polish();
  setTimeout(polish,300);setTimeout(polish,1200);
})();