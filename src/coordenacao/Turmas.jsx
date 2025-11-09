import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import Button from "../components/Button.jsx";
import "./Coordenacao.css";

// Componente para o Card individual de cada Turma
const TurmaCard = ({ turma, onClick, onAddAluno }) => {
  const membros = turma.membros || [];
  const totalMembros = turma.totalMembros || 0;

  return (
    <div className="turma-card">
      <div className="turma-card-header">
        <h2 className="turma-card-title">
          {turma.nome || `Turma ${turma.id.substring(0, 4)}`}
        </h2>
        <span
          className="ver-tudo"
          onClick={(e) => {
            e.stopPropagation();
            onClick(turma.id);
          }}
        >
          Ver Tudo
        </span>
      </div>

      <div className="turma-card-members-info">{totalMembros} Membros</div>

      <ul className="turma-card-members-list">
        {membros.slice(0, 5).map((membro, index) => (
          <li
            key={index}
            className="turma-card-member-item"
            onClick={() => onClick(turma.id)}
          >
            <span className="member-name">{membro.nome}</span>
          </li>
        ))}

        {totalMembros === 0 && (
          <li
            className="turma-card-member-item"
            style={{
              justifyContent: "center",
              color: "#6b7280",
              padding: "15px 0",
            }}
          >
            <span>Turma vazia</span>
          </li>
        )}
      </ul>

      <div style={{ marginTop: "10px", display: "flex", gap: "10px", justifyContent: "center" }}>
        <Button variant="azul" onClick={() => onAddAluno(turma.id)}>
          Adicionar Aluno
        </Button>

        <Button variant="cinza" onClick={() => onClick(`editar:${turma.id}`)}>
          Editar Turma
        </Button>
      </div>

    </div>
  );
};

export default function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [busca, setBusca] = useState("");
  const [filteredTurmas, setFilteredTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "turmas"));
        let lista = [];

        for (const docTurma of querySnapshot.docs) {
          const turmaData = docTurma.data();
          let membrosDetalhados = [];

          if (Array.isArray(turmaData.membros)) {
            for (const uid of turmaData.membros) {
              const alunoRef = doc(db, "alunos", uid);
              const alunoSnap = await getDoc(alunoRef);

              if (alunoSnap.exists()) {
                const alunoData = alunoSnap.data();
                const nome = alunoData?.alunoData?.nome || "Aluno sem nome";

                membrosDetalhados.push({
                  id: uid,
                  nome,
                });
              }
            }
          }

          lista.push({
            id: docTurma.id,
            ...turmaData,
            membros: membrosDetalhados,
            totalMembros: membrosDetalhados.length,
          });
        }

        setTurmas(lista);
        setFilteredTurmas(lista);
      } catch (error) {
        console.error("Erro ao carregar turmas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurmas();
  }, []);

  const handleCriarTurma = () => navigate("/coordenacao/criarTurma");
  const handleAbrirTurma = (id) => navigate(`/coordenacao/turmas/${id}`);
  const handleAddAluno = (id) =>
    navigate(`/coordenacao/turmas/${id}/adicionar-aluno`);

  const handleBuscar = (texto) => {
    setBusca(texto);
    const termo = texto.toLowerCase();
    setFilteredTurmas(
      turmas.filter((t) => (t.nome || "").toLowerCase().includes(termo))
    );
  };

  if (loading)
    return (
      <Layout>
        <Loading text="Carregando turmas..." />
      </Layout>
    );

  return (
    <Layout>
      <div className="alunos-page-container">
        <div className="page-header page-header-turmas">
          <div className="page-title-group">
            <h1>Gestão de Turmas</h1>
          </div>

          <Button variant="verde" onClick={handleCriarTurma}>
            + Criar Turma
          </Button>
        </div>

        <div className="filter-controls-container">
          <div className="busca-input-group" style={{ flexGrow: 1 }}>
            <input
              type="text"
              className="busca-input"
              placeholder="Buscar turma por nome..."
              value={busca}
              onChange={(e) => handleBuscar(e.target.value)}
            />
          </div>
        </div>

        {filteredTurmas.length === 0 ? (
          <p className="busca-error">Nenhuma turma encontrada.</p>
        ) : (
          <div className="turmas-grid">
            {filteredTurmas.map((turma) => (
              <TurmaCard
                key={turma.id}
                turma={turma}
                onClick={(id) => {
                  if (id.startsWith("editar:")) {
                    const turmaId = id.replace("editar:", "");
                    navigate(`/coordenacao/turmas/${turmaId}/editar`);
                  } else {
                    handleAbrirTurma(id);
                  }
                }}
                onAddAluno={handleAddAluno}
              />

            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
