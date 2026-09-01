(() => {
  const DEFAULT_PHOTO='assets/foto-cv-default.jpeg';
  const apply=()=>{
    const preview=document.querySelector('#preview');
    if(!preview) return;
    const placeholder=preview.querySelector('.legacy-photo.placeholder');
    if(placeholder){
      const img=document.createElement('img');
      img.className='legacy-photo';
      img.src=DEFAULT_PHOTO;
      img.alt='';
      placeholder.replaceWith(img);
      return;
    }
    if(!preview.querySelector('.cv-photo') && !preview.querySelector('.legacy-photo')){
      const header=preview.querySelector('header');
      if(header){
        const img=document.createElement('img');
        img.className='cv-photo';
        img.src=DEFAULT_PHOTO;
        img.alt='';
        header.prepend(img);
      }
    }
  };
  const observer=new MutationObserver(apply);
  const preview=document.querySelector('#preview');
  if(preview) observer.observe(preview,{childList:true,subtree:true});
  apply();
})();