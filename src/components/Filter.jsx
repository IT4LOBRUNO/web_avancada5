export default function filterAndSortAlunos(currentAlunos, currentBusca, currentFilters, calcularIdade) {
  let list = [...currentAlunos];
  const termo = currentBusca.toLowerCase();

  // Filtro de busca por nome ou status
  if (termo.length >= 3) {
    list = list.filter(a =>
      a.alunoData?.nome?.toLowerCase().includes(termo) ||
      a.status?.toLowerCase().includes(termo)
    );
  }

  // Filtro de Status
  if (currentFilters.status) {
    list = list.filter(a => a.status === currentFilters.status);
  }

  // Filtro de Cor/Raça
  if (currentFilters.corRaca) {
    list = list.filter(a =>
      a.documentos?.corRaca?.toLowerCase() === currentFilters.corRaca.toLowerCase()
    );
  }

  // Filtro de idade exata
  if (currentFilters.idade) {
    const idadeFiltrada = Number(currentFilters.idade);
    if (!isNaN(idadeFiltrada)) {
      list = list.filter(a => calcularIdade(a.alunoData?.dataNascimento) === idadeFiltrada);
    }
  }

  return list;
}
