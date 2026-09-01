(() => {
  const DEFAULT_PHOTO='assets/foto-cv-default.jpeg';
  const preview=()=>document.querySelector('#preview');

  function applyDefaultPhoto(){
    const p=preview();
    if(!p) return;
    const placeholder=p.querySelector('.legacy-photo.placeholder');
    if(placeholder){
      const img=document.createElement('img');
      img.className='legacy-photo';
      img.src=DEFAULT_PHOTO;
      img.alt='';
      placeholder.replaceWith(img);
      return;
    }
    if(!p.querySelector('.cv-photo') && !p.querySelector('.legacy-photo')){
      const header=p.querySelector('header');
      if(header){
        const img=document.createElement('img');
        img.className='cv-photo';
        img.src=DEFAULT_PHOTO;
        img.alt='';
        header.prepend(img);
      }
    }
  }

  function cleanPreview(){
    const p=preview();
    if(!p) return;
    const walker=document.createTreeWalker(p,NodeFilter.SHOW_TEXT);
    let n;
    while((n=walker.nextNode())){
      const next=n.nodeValue
        .replace(/\s*-\s*revisar año de egreso/gi,'')
        .replace(/revisar nivel actual/gi,'');
      if(next!==n.nodeValue)n.nodeValue=next;
    }
  }

  function refineInterestIcons(){
    const p=preview();
    if(!p) return;
    p.querySelectorAll('.legacy-interests span').forEach(span=>{
      if(span.querySelector('.legacy-interest-icon')) return;
      const text=span.textContent.replace(/^\s*☕\s*/,'').trim();
      span.textContent='';
      const icon=document.createElement('i');
      icon.className='legacy-interest-icon';
      icon.setAttribute('aria-hidden','true');
      span.append(icon,document.createTextNode(text));
    });
  }

  function reconcile(){
    applyDefaultPhoto();
    cleanPreview();
    refineInterestIcons();
  }

  reconcile();
  document.querySelector('#template')?.addEventListener('change',()=>setTimeout(reconcile,0));
  document.querySelector('.editor')?.addEventListener('input',()=>setTimeout(reconcile,0));
})();