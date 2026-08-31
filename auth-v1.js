(() => {
  const SUPABASE_URL='https://qqzrpzjtvrbtkbhmdjmp.supabase.co';
  const SUPABASE_KEY='sb_publishable_-1TjOOzBlXwxaXuyOotQAg_c33AjzCN';
  const SESSION_KEY='postula-supabase-session-v1';

  const apiHeaders=()=>({'apikey':SUPABASE_KEY,'Content-Type':'application/json'});
  const readSession=()=>{try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{return null}};
  const saveSession=s=>{if(s)localStorage.setItem(SESSION_KEY,JSON.stringify(s));else localStorage.removeItem(SESSION_KEY)};

  async function authFetch(path,options={}){
    const res=await fetch(SUPABASE_URL+path,{...options,headers:{...apiHeaders(),...(options.headers||{})}});
    let data=null;try{data=await res.json()}catch{}
    if(!res.ok)throw new Error(data?.msg||data?.message||data?.error_description||data?.error||'No se pudo completar la operación');
    return data;
  }

  async function refresh(session){
    if(!session?.refresh_token)return null;
    try{
      const s=await authFetch('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:session.refresh_token})});
      saveSession(s);return s;
    }catch{saveSession(null);return null}
  }

  async function validSession(){
    let s=readSession();if(!s?.access_token)return null;
    try{
      await authFetch('/auth/v1/user',{headers:{Authorization:`Bearer ${s.access_token}`}});
      return s;
    }catch{return await refresh(s)}
  }

  function gate(){
    let el=document.querySelector('#auth-gate');
    if(el)return el;
    el=document.createElement('div');el.id='auth-gate';el.className='auth-gate';
    el.innerHTML=`<div class="auth-card"><div class="auth-brand"><span class="brand-mark">P</span><strong>Postula</strong></div><h1>Entrar</h1><p>Tu espacio de postulaciones y documentos.</p><form id="auth-form"><label>Email<input id="auth-email" type="email" autocomplete="email" required></label><label>Contraseña<input id="auth-password" type="password" autocomplete="current-password" minlength="6" required></label><button class="auth-primary" type="submit">Entrar</button><button class="auth-secondary" type="button" id="auth-signup">Crear cuenta</button><div id="auth-message" class="auth-message" role="status"></div></form></div>`;
    document.body.appendChild(el);return el;
  }

  function message(text,type=''){const el=document.querySelector('#auth-message');if(el){el.textContent=text;el.dataset.type=type}};
  function setBusy(v){document.querySelectorAll('#auth-form button').forEach(b=>b.disabled=v)};

  async function signIn(email,password){
    const s=await authFetch('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});
    saveSession(s);return s;
  }
  async function signUp(email,password){return authFetch('/auth/v1/signup',{method:'POST',body:JSON.stringify({email,password})});}

  function unlock(session){
    document.documentElement.classList.add('postula-authenticated');
    document.querySelector('#auth-gate')?.remove();
    window.postulaAuth={
      supabaseUrl:SUPABASE_URL,
      publishableKey:SUPABASE_KEY,
      getSession:()=>readSession(),
      getAccessToken:()=>readSession()?.access_token||null,
      signOut:async()=>{
        const s=readSession();
        if(s?.access_token){try{await authFetch('/auth/v1/logout',{method:'POST',headers:{Authorization:`Bearer ${s.access_token}`}})}catch{}}
        saveSession(null);location.reload();
      }
    };
    const chip=document.querySelector('.user-chip');
    if(chip&&!chip.querySelector('.auth-signout')){
      const b=document.createElement('button');b.type='button';b.className='auth-signout';b.textContent='Salir';b.onclick=()=>window.postulaAuth.signOut();chip.appendChild(b);
    }
  }

  async function boot(){
    const s=await validSession();if(s){unlock(s);return;}
    const el=gate();
    const form=el.querySelector('#auth-form'),signup=el.querySelector('#auth-signup');
    form.onsubmit=async e=>{e.preventDefault();setBusy(true);message('Entrando…');try{const email=el.querySelector('#auth-email').value.trim(),password=el.querySelector('#auth-password').value;const session=await signIn(email,password);unlock(session)}catch(err){message(err.message,'error')}finally{setBusy(false)}};
    signup.onclick=async()=>{setBusy(true);message('Creando cuenta…');try{const email=el.querySelector('#auth-email').value.trim(),password=el.querySelector('#auth-password').value;if(!email||password.length<6)throw new Error('Escribe un email y una contraseña de al menos 6 caracteres.');const r=await signUp(email,password);if(r?.access_token){saveSession(r);unlock(r)}else message('Cuenta creada. Revisa tu email para confirmar la cuenta.','ok')}catch(err){message(err.message,'error')}finally{setBusy(false)}};
  }

  boot();
})();
