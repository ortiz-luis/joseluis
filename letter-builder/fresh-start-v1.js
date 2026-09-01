(() => {
  const KEY='joseluis-letter-builder-v3';
  const blank=()=>({sender:{name:'',address:'',phone:'',email:'',subtitle:'',signatureNote:''},es:{date:'',recipient:'',address:'',subject:'',opening:'',body:'',closing:''},fr:{date:'',recipient:'',address:'',subject:'',opening:'',body:'',closing:''}});
  document.querySelector('#start-fresh')?.addEventListener('click',()=>{
    if(!confirm('¿Empezar la carta desde cero? Se vaciarán todos los campos guardados en este navegador.'))return;
    localStorage.setItem(KEY,JSON.stringify(blank()));
    location.reload();
  });
})();