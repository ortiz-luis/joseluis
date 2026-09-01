(() => {
  const el=document.createElement('div');
  el.id='cv-loading';
  el.innerHTML='<div class="cv-loading-card"><strong>Preparando el CV...</strong><span>La vista previa estará lista en unos segundos.</span><div class="cv-loading-track"><i></i></div></div>';
  const style=document.createElement('style');
  style.textContent='#cv-loading{position:fixed;inset:64px 0 0;z-index:9999;background:rgba(245,248,246,.94);display:grid;place-items:center;transition:opacity .2s ease}.cv-loading-card{width:min(360px,calc(100vw - 40px));background:#fff;border:1px solid #dce6e0;border-radius:14px;padding:20px;box-shadow:0 12px 34px rgba(31,50,40,.12);font-family:Inter,system-ui,sans-serif;color:#25332c}.cv-loading-card strong{display:block;font-size:16px;margin-bottom:5px}.cv-loading-card span{display:block;font-size:12px;color:#68766f;margin-bottom:14px}.cv-loading-track{height:6px;border-radius:999px;background:#e7efea;overflow:hidden}.cv-loading-track i{display:block;width:38%;height:100%;background:#377158;border-radius:999px;animation:cvload 1.05s ease-in-out infinite}@keyframes cvload{0%{transform:translateX(-110%)}100%{transform:translateX(290%)}}#cv-loading.done{opacity:0;pointer-events:none}';
  document.head.appendChild(style);
  document.body.appendChild(el);
  const done=()=>{requestAnimationFrame(()=>requestAnimationFrame(()=>{el.classList.add('done');setTimeout(()=>el.remove(),250)}))};
  if(document.readyState==='complete')done();else window.addEventListener('load',done,{once:true});
})();