(()=>{
  const URL='https://qqzrpzjtvrbtkbhmdjmp.supabase.co';
  const KEY='sb_publishable_-1TjOOzBlXwxaXuyOotQAg_c33AjzCN';
  let busy=false;
  async function syncCatalog(){
    if(busy||typeof state==='undefined'||!window.postulaAuth?.getAccessToken?.())return;
    busy=true;
    try{
      const token=window.postulaAuth.getAccessToken();
      const r=await fetch(`${URL}/rest/v1/opportunity_catalog?active=eq.true&select=data&order=sort_order.asc`,{headers:{apikey:KEY,Authorization:`Bearer ${token}`}});
      if(!r.ok)return;
      const rows=await r.json();let changed=false;
      for(const row of rows||[]){
        const item=row?.data;if(!item?.id)continue;
        if(!state.opportunities.some(o=>o.id===item.id)){state.opportunities.unshift(item);changed=true;}
      }
      if(changed){save();render();}
    }catch(err){console.error('Opportunity catalog sync failed',err)}finally{busy=false}
  }
  window.addEventListener('postula-workspace-ready',()=>setTimeout(syncCatalog,0));
  if(window.postulaWorkspace?.isReady?.())syncCatalog();
})();