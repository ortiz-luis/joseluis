(() => {
  const KEY='joseluis-letter-builder-v3';
  const MARK='joseluis-letter-reference-v2';
  if(localStorage.getItem(MARK)) return;

  const reference={
    sender:{
      name:'Joseluis Esteban MORAGA NUÑEZ',
      address:'Cardenal José María Caro 1340\nJuan Pablo II, Temuco - Chile',
      phone:'+56 9 30 24 95 67',
      email:'j.moraga03@ufromail.cl',
      subtitle:'Estudiante de Sociología de la Universidad de La Frontera',
      signatureNote:'Matrícula 19810339K19'
    },
    es:{
      date:'Temuco de Chile, 22 de abril de 2022',
      recipient:'Sciences Po Rennes',
      address:'Bureau des Relations Internationales\n104 Bd de la Duchesse Anne\n35700 Rennes – France',
      subject:'Candidatura beca del Fondo de Solidaridad Internacional Institut d’Etudes Politiques de Rennes',
      opening:'Estimado Señor o Señora,',
      body:'Vivimos en un mundo cada vez más complejo y globalizado, en el que los fenómenos sociales deben comprenderse considerando tanto sus dimensiones locales como internacionales. Durante mi formación en Sociología en la Universidad de La Frontera he desarrollado un especial interés por estos procesos y por la forma en que la ciencia política y la sociología permiten analizarlos.\n\nMi interés por realizar estudios en Sciences Po Rennes surgió también a partir de la orientación y experiencia académica del profesor Ignacio Rodríguez. La posibilidad de cursar la Attestation d’Etudes Politiques en inglés representa para mí una oportunidad de ampliar mi formación, conocer otras perspectivas académicas y profundizar en el estudio de fenómenos políticos y sociales desde una mirada internacional.\n\nConsidero que esta experiencia me permitiría fortalecer mi capacidad para investigar problemas que articulan dimensiones locales y globales, además de desenvolverme en un contexto académico y cultural diferente. La obtención de esta beca sería un apoyo importante para concretar esta experiencia y continuar posteriormente desarrollando estudios e investigación en el área de las ciencias sociales.',
      closing:'Sin nada más que agregar, espero su pronta respuesta y les envío saludos cordiales,'
    },
    fr:{
      date:'Temuco, Chili, 22 avril 2022',
      recipient:'Sciences Po Rennes',
      address:'Bureau des Relations Internationales\n104 Bd de la Duchesse Anne\n35700 Rennes – France',
      subject:'Candidature',
      opening:'Madame, Monsieur,',
      body:'',
      closing:'Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées,'
    }
  };

  localStorage.setItem(KEY,JSON.stringify(reference));
  localStorage.setItem(MARK,'1');
  location.reload();
})();
