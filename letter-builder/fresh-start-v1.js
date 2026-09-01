(() => {
  const KEY='joseluis-letter-builder-v3';
  const BLANK_ONCE='joseluis-letter-builder-blank-once-v1';
  const blank=()=>({sender:{name:'',address:'',phone:'',email:'',subtitle:'',signatureNote:''},es:{date:'',recipient:'',address:'',subject:'',opening:'',body:'',closing:''},fr:{date:'',recipient:'',address:'',subject:'',opening:'',body:'',closing:''}});

  document.querySelector('#start-fresh')?.addEventListener('click',()=>{
    if(!confirm('¿Empezar la carta desde cero? Se vaciarán todos los campos de esta edición. Al salir y volver, reaparecerá el ejemplo de referencia.'))return;
    sessionStorage.setItem(BLANK_ONCE,'1');
    localStorage.setItem(KEY,JSON.stringify(blank()));
    location.reload();
  });
})();