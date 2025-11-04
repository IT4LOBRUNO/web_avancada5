import React, { useState, useEffect } from "react";
import Layout from "../components/Layout.jsx";
import Button from "../components/Button.jsx";
import SearchTable from "../components/SearchTable.jsx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import "../coordenacao/Coordenacao.css";

export default function AlunoBuscar() {
  const [busca, setBusca] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarAlunos = async () => {
      try {
        //Busca todos os documentos de 'alunos'
        const snapshot = await getDocs(collection(db, "alunos"));

        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAlunos(lista);
        setResultado(lista);
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
      setResultado(alunos);
      return;
    }

    const filtrados = alunos.filter((a) =>
      a.alunoData?.nome?.toLowerCase().includes(termo) ||
      a.documentos?.responsavelNome?.toLowerCase().includes(termo) ||
      a.documentos?.rg?.includes(termo)
    );
    setResultado(filtrados);
  };

  const handlePerfil = (alunoId) => {
    navigate(`/aluno-perfil/${alunoId}`);
  };
  // DD/MM/YYYY
  const formatarData = (dataStr) => {
    if (!dataStr) return "—";
    const partes = dataStr.split("-");
    if (partes.length === 3) {
      const [ano, mes, dia] = partes;
      return `${dia}/${mes}/${ano}`;
    }
    return dataStr;
  };

  const getStatusElement = (status) => {
    const statusValue = status || "—";
    let className = "";

    const normalized = statusValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (normalized.toLowerCase() === "pré-matricula" || normalized.toLowerCase() === "pre-matricula") {
      className = 'status-pre-matricula';
    } else if (normalized.toLowerCase() === "cancelado") {
      className = 'status-cancelado';
    } else if (normalized.toLowerCase() === "aprovado") {
      className = 'status-aprovado';
    } else if (normalized.toLowerCase() === "matriculado") {
      className = 'status-matriculado';
    }

    return <span className={className}>{statusValue}</span>;
  };



  if (loading) {
    return <Layout><Loading text="Carregando alunos..." /></Layout>;
  }

  return (
    <Layout>
      <div className="alunos-page-container">
        <div className="page-header">
          <div className="page-title-group">
            <h1>Buscar Aluno</h1>
          </div>
        </div>

        <div className="filter-controls-container">
          <div className="busca-input-group" style={{ flexGrow: 1 }}>
            <input
              type="text"
              className="busca-input"
              placeholder="Digite o nome do aluno ou responsável (Busca local)"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleBuscar(); }}
            />
            <Button onClick={handleBuscar}>Buscar</Button>
          </div>
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
            status: getStatusElement(aluno.status),
            actionPlaceholder: '',
          }))}
          onActionClick={(id) => handlePerfil(id)}
          actionLabel="Perfil"
        />
      </div>
    </Layout>
  );

}
