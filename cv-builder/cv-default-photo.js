(() => {
  const KEY='joseluis-cv-builder-v2';
  const PHOTO='PLACEHOLDER';
  try {
    const data=JSON.parse(localStorage.getItem(KEY)||'null');
    if(data && !data?.basics?.photo){
      data.basics=data.basics||{};
      data.basics.photo=PHOTO;
      localStorage.setItem(KEY,JSON.stringify(data));
      location.reload();
    }
  } catch(e) { console.warn('No se pudo cargar la foto por defecto',e); }
})();