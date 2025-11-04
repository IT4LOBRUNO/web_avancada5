export default function filterAndSortAlunos(currentAlunos, currentBusca, currentFilters, calcularIdade) {
  let list = [...currentAlunos];
  const termo = currentBusca.toLowerCase();

  //Filtro de busca nome
  if (termo.length >= 3) {
    list = list.filter((a) =>
      a.alunoData?.nome?.toLowerCase().includes(termo) ||
      a.status?.toLowerCase().includes(termo)
    );
  }

  //Filtro de Status
  if (currentFilters.status) {
    list = list.filter((a) => a.status === currentFilters.status);
  }

  //Filtro de Cor/Raça
  if (currentFilters.corRaca) {
    list = list.filter((a) =>
      a.documentos?.corRaca?.toLowerCase() === currentFilters.corRaca.toLowerCase()
    );
  }

  // Filtro de idade
  if (currentFilters.sort) {
    list.sort((a, b) => {
      const idadeA = calcularIdade(a.alunoData?.dataNascimento);
      const idadeB = calcularIdade(b.alunoData?.dataNascimento);

      if (currentFilters.sort === 'Mais novo') {
        return idadeA - idadeB;
      } else if (currentFilters.sort === 'Mais velho') {
        return idadeB - idadeA;
      }
      return 0;
    });
  }

  return list;
}
