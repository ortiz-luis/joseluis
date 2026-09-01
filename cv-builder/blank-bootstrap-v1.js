(() => {
  const KEY='joseluis-cv-builder-v2';
  try {
    const saved=JSON.parse(localStorage.getItem(KEY)||'null');
    if(!saved?._blankMode) return;
    const blank={
      _blankMode:true,
      basics:{name:'',label:'',email:'',phone:'',url:'',summary:'',location:{address:''},photo:''},
      work:[],education:[],volunteer:[],skills:[],languages:[],interestsText:''
    };
    localStorage.setItem(KEY,JSON.stringify(blank));
  } catch {}
})();
