(() => {
  const AUDIT={
    'gmf-brussels-2026':{priority:'Revisar hoy',status:'preparing',deadline:'',notes:'Oferta activa. Inicio septiembre 2026; €1.000–1.200 netos/mes. Requiere bachelor en área relacionada, inglés fluido; ucraniano es un plus fuerte. Confirmar derecho a trabajar/visa en Bélgica.'},
    'blue-book-2027':{priority:'No elegible',status:'closed',deadline:'2026-09-04',notes:'Convocatoria marzo 2027: la vía ADMIN UG exige nacionalidad UE o de país candidato en estrategia de preadhesión. Con nacionalidad chilena no cumple la regla actual. No gastar tiempo en esta convocatoria.'},
    'cor-cicero-2027':{priority:'Condicional',status:'considering',deadline:'2026-10-01',funding:'≈ €1.538/mes',notes:'Primavera 2027: 16 feb–15 jul. No-UE puede postular, pero selección excepcional y debe poder residir/trabajar legalmente en Bélgica. Cierre 1 oct 2026, 12:00 Bruselas.'},
    'schuman-2027':{priority:'Condicional',status:'considering',deadline:'2026-10-31',notes:'Convocatoria para marzo–julio 2027 abre 1–31 octubre 2026. No-UE puede ser seleccionado en número limitado. Máximo 3 candidaturas; título universitario requerido antes del inicio.'},
    'eit-2027':{priority:'Condicional',status:'preparing',deadline:'2026-09-15',notes:'Convocatoria EIT/TR/2026/20 confirmada: cierre 15 sep 2026, 13:00. Traineeships de 6 meses en Budapest/Bruselas. No-UE puede ser aceptado en número limitado.'},
    'unesco-internship-2026':{priority:'Verificar egreso',status:'considering',deadline:'2026-12-31',notes:'UNESCO exige estar en etapa avanzada de estudios o haber terminado Bachelor/Master/PhD hace no más de 12 meses al emitir el Internship Agreement. No remunerada. Inglés o francés excelente.'},
    'oecd-yap-2027':{priority:'Por confirmar',status:'considering',deadline:'',title:'OECD Young Associates — próxima cohorte',notes:'La próxima cohorte 2027 aún debe confirmarse. Regla vigente del YAP: bachelor muy reciente, no estar inscrito ni tener máster/doctorado, nacionalidad de país OCDE, GPA mínimo y francés o inglés. Chile es país OCDE; falta confirmar fecha exacta de graduación y reglas 2027.'},
    'mundus-mapp-2027':{priority:'Viable',status:'preparing',deadline:'2026-12-01',notes:'2027–2029 abre 1 sep 2026. Para beca/ayuda financiera: cierre 1 dic 2026 23:59 CET. Inglés debe acreditarse al postular; IELTS 7, TOEFL iBT 95, Duolingo 130 u otras opciones aceptadas. No se admite envío tardío del test.'},
    'sciencespo-luksic-2027':{priority:'Viable',status:'preparing',deadline:'',notes:'Admisiones 2027 abren a fines de septiembre 2026. Luksic cubre matrícula completa + manutención por 2 años para chilenos residentes en Chile, sin doble nacionalidad UE, admitidos en School of Public Affairs o PSIA. La fecha 2027 de la beca todavía no está publicada; la página aún muestra la convocatoria anterior.'},
    'france-working-holiday':{priority:'Verificar edad',status:'considering',deadline:'',notes:'France-Visas mantiene actualmente cita Vacances-Travail en Santiago. Requiere nacionalidad chilena y edad dentro del límite del programa, además de no haberlo usado antes y recursos/pasaje de retorno. Confirmar edad antes de invertir tiempo.'}
  };

  if(typeof state==='undefined')return;
  for(const o of state.opportunities||[]){
    const a=AUDIT[o.id];
    if(a)Object.assign(o,a);
    for(const q of o.requirements||[]){
      if(q.id==='motivation' && state.documents?.some(d=>d.id==='gmail-motivation-es'||d.id==='gmail-motivation-fr')){
        q.state='easy';
        if(!/base/i.test(q.label))q.label=q.label+' · base 2022';
      }
    }
  }

  const actualReady=cat=>state.documents?.some(d=>d.category===cat&&d.status==='ready'&&d.fileStored);
  const historicalCV=()=>state.documents?.some(d=>d.category==='CV'&&d.status==='located');
  const historicalPassport=()=>state.documents?.some(d=>d.id==='gmail-passport'&&d.status==='located');

  if(typeof sync==='function'){
    sync=function(o){
      for(const q of o.requirements||[]){
        if(q.type!=='document')continue;
        if(actualReady(q.category)){q.state='ready';continue;}
        if(q.id==='cv'&&historicalCV()){q.state='easy';continue;}
        if(q.id==='passport'&&historicalPassport()){q.state='easy';continue;}
        q.state='action';
      }
    };
  }

  if(typeof openReq==='function'){
    openReq=function(id,rid){
      const o=state.opportunities.find(x=>x.id===id),q=(o?.requirements||[]).find(x=>x.id===rid);if(!q)return;
      if(q.type==='document'){
        let msg='Todavía no tenemos este documento actual.';
        if(q.id==='cv'&&historicalCV())msg='Tenemos CVs de 2022 en español y francés. Hay que actualizarlos, no empezar de cero.';
        if(q.id==='passport'&&historicalPassport())msg='Tenemos un pasaporte de 2022 localizado en Gmail. Hay que comprobar su vigencia.';
        if(actualReady(q.category))msg='Hay un archivo actual guardado.';
        openModal(`<h2>${esc(q.label)}</h2><p>${esc(msg)}</p><button class="button primary" id="u-doc">Subir versión actual</button>`);$('#u-doc').onclick=()=>$('#file-input').click();return;
      }
      const special=q.id==='english'?'Falta acreditar o confirmar el nivel exacto aceptado por esta convocatoria.':q.id==='motivation'?'Ya tenemos cartas de 2022 como base. Hay que adaptarlas a esta candidatura, no redactar desde cero.':'Completa este punto cuando tengamos la información.';
      openModal(`<h2>${esc(q.label)}</h2><p>${esc(special)}</p><div class="modal-actions"><button class="button primary" id="mark-done">Marcar listo</button></div>`);$('#mark-done').onclick=()=>{q.state='ready';save('Listo');closeModal();render()};
    };
  }

  save();
  if(typeof render==='function')render();
})();
