(() => {
  if (typeof state === 'undefined' || typeof homePage !== 'function') return;

  homePage = function(){
    const active = state.opportunities.filter(o => o.status !== 'closed' && o.status !== 'excluded' && o.priority !== 'No elegible');
    const newN = active.filter(o => o.status === 'new').length;
    const dated = active
      .filter(o => o.deadline && days(o.deadline) >= 0)
      .sort((a,b) => a.deadline.localeCompare(b.deadline));
    const next = dated[0];
    const d = next ? days(next.deadline) : null;
    const urgent = d !== null && d <= 5;

    return `<section class="page app-home">
      <div class="app-state ${urgent ? 'urgent' : ''}"><span>${urgent ? '!' : '✓'}</span><strong>${urgent ? `${d} días` : 'Todo al día'}</strong></div>
      <div class="app-cards">
        <a href="#opportunities" class="app-card"><b>${active.length}</b><span>Procesos</span></a>
        <a href="#documents" class="app-card"><b>${state.documents.filter(d => d.status === 'ready' && d.storagePath).length}</b><span>Documentos</span></a>
        <a href="#opportunities" class="app-card"><b>${newN}</b><span>Nuevas</span></a>
      </div>
      ${next ? `<a href="#opportunity/${next.id}" class="next-line" style="display:block;text-decoration:none"><strong style="display:block;margin-bottom:3px">Próximo deadline</strong><span>${fmt(next.deadline)} · ${esc(next.title)}</span></a>` : ''}
    </section>`;
  };

  if (typeof render === 'function') render();
})();