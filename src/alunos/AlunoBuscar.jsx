import React, { useState, useEffect } from "react";
import Layout from "../components/Layout.jsx";
import Button from "../components/Button.jsx";
import SearchTable from "../components/SearchTable.jsx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx"; // Adiciona o componente Loading
import "../components/Components.css"; // Importa o CSS para as novas classes

export default function AlunoBuscar() {
  const [busca, setBusca] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento inicial
  const navigate = useNavigate();

  useEffect(() => {
    const carregarAlunos = async () => {
      try {
        // Busca todos os documentos na coleção "alunos" (Coleção correta)
        const snapshot = await getDocs(collection(db, "alunos"));

        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAlunos(lista);
        setResultado(lista); // Exibe todos os alunos inicialmente
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
        // Mantido o alerta conforme o código original
        alert("Erro ao buscar dados dos alunos.");
      } finally {
        setLoading(false);
      }
    };
    carregarAlunos();
  }, []);

  const handleBuscar = () => {
    const termo = busca.toLowerCase();
    if (termo.length < 3) {
      // Se o termo de busca for muito curto, exibimos todos os alunos.
      setResultado(alunos);
      return;
    }

    const filtrados = alunos.filter((a) =>
      // Busca pelo nome do aluno
      a.alunoData?.nome?.toLowerCase().includes(termo) ||
      // Busca pelo nome do responsável ou RG do aluno
      a.documentos?.responsavelNome?.toLowerCase().includes(termo) ||
      a.documentos?.rg?.includes(termo)
    );
    setResultado(filtrados);
  };

  const handlePerfil = (alunoId) => {
    navigate(`/aluno-perfil/${alunoId}`);
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return "—";
    // A data está salva no formato YYYY-MM-DD
    const partes = dataStr.split("-");
    if (partes.length === 3) {
      const [ano, mes, dia] = partes;
      return `${dia}/${mes}/${ano}`;
    }
    return dataStr;
  };

  // Função para aplicar estilo condicional ao status
  const getStatusElement = (status) => {
    const statusValue = status || "—";
    let className = "status-matriculado"; // Classe padrão para outros status (Verde)

    if (statusValue === 'Pré-matrícula') {
      className = 'status-pre-matricula'; // Classe para Pré-matrícula (Amarelo)
    }

    // Retorna um elemento React com a classe CSS
    return <span className={className}>{statusValue}</span>;
  };


  if (loading) {
    return <Layout><Loading text="Carregando alunos..." /></Layout>;
  }

  return (
    <Layout>
      <h1 className="busca-header">Buscar Aluno</h1>

      <div className="busca-input-group">
        <input
          type="text"
          className="busca-input"
          placeholder="Digite o nome do aluno ou responsável (Busca local)"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Button onClick={handleBuscar}>Buscar</Button>
      </div>

      {resultado.length === 0 && busca.length > 0 && (
        <p className="busca-error">Nenhum aluno encontrado para o termo "{busca}".</p>
      )}

      <SearchTable
        headers={["Nome do Aluno", "CPF", "Nascimento", "Responsável", "Status", "Ações"]}
        rows={resultado.map((aluno) => ({
          id: aluno.id,
          nome: aluno.alunoData?.nome || "—",
          cpf: aluno.documentos?.cpf || "—",
          nascimento: formatarData(aluno.alunoData?.dataNascimento),
          responsavel: aluno.documentos?.responsavelNome || "—",
          status: getStatusElement(aluno.status), // 5ª Coluna: Valor do Status (Elemento React com classe)
          actionPlaceholder: '',
        }))}
        onActionClick={(id) => handlePerfil(id)}
        actionLabel="Perfil"
      />
    </Layout>
  );
}
