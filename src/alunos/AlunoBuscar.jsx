import React, { useState, useEffect } from "react";
import Layout from "../components/Layout.jsx";
import Button from "../components/Button.jsx";
import SearchTable from "../components/SearchTable.jsx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx"; // Adiciona o componente Loading

export default function AlunoBuscar() {
  const [busca, setBusca] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento inicial
  const navigate = useNavigate();

  useEffect(() => {
    const carregarAlunos = async () => {
      try {
        // Busca todos os documentos na coleção "alunos"
        const snapshot = await getDocs(collection(db, "alunos"));

        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAlunos(lista);
        setResultado(lista); // Exibe todos os alunos inicialmente
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
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
      // Se o termo de busca for muito curto, podemos exibir todos os alunos novamente ou pedir mais caracteres.
      setResultado(alunos);
      return;
    }

    const filtrados = alunos.filter((a) =>
      // Busca pelo nome do aluno
      a.alunoData?.nome?.toLowerCase().includes(termo) ||
      // Opcional: Busca pelo nome do responsável ou RG do aluno
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

  if (loading) {
    return <Layout><Loading text="Carregando alunos..." /></Layout>;
  }

  return (
    <Layout>
      <h1 style={{ marginBottom: "20px" }}>Buscar Aluno</h1>

      <div style={{ display: "flex", marginBottom: "20px", gap: "10px" }}>
        <input
          type="text"
          placeholder="Digite o nome do aluno ou responsável (Busca local)"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <Button onClick={handleBuscar}>Buscar</Button>
      </div>

      {resultado.length === 0 && busca.length > 0 && (
        <p style={{ color: '#E53E3E', textAlign: 'center' }}>Nenhum aluno encontrado para o termo "{busca}".</p>
      )}

      <SearchTable
        headers={["Nome do Aluno", "CPF", "Nascimento", "Responsável", "Ações"]}
        rows={resultado.map((aluno) => ({
          id: aluno.id,
          nome: aluno.alunoData?.nome || "—",
          cpf: aluno.documentos?.cpf || "—",
          nascimento: formatarData(aluno.alunoData?.dataNascimento),
          responsavel: aluno.documentos?.responsavelNome || "—", // CORREÇÃO AQUI
        }))}
        onActionClick={(id) => handlePerfil(id)}
        actionLabel="Perfil"
      />
    </Layout>
  );
}