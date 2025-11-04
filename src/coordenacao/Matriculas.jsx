import React, { useState, useEffect } from "react";
import Layout from "../components/Layout.jsx";
import Button from "../components/Button.jsx";
import SearchTable from "../components/SearchTable.jsx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import { FiFilter } from "react-icons/fi";
import "./Coordenacao.css";

import filterAndSortAlunos from "../components/Filter.jsx";

export default function Matriculas() {
  const [busca, setBusca] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sort: null, //'Mais velho', 'Mais novo'
    status: null, //'Pré-matrícula', 'Cancelado', 'Aprovado', 'Matriculado'
    corRaca: null, //'Branca', 'Preta', 'Parda', 'Indígena'
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const navigate = useNavigate();

  const calcularIdade = (dataNascimentoStr) => {
    if (!dataNascimentoStr) return 0;

    try {
      const partes = dataNascimentoStr.split("-");
      if (partes.length !== 3) return 0;

      const [ano, mes, dia] = partes.map(Number);
      const dataNascimento = new Date(ano, mes - 1, dia);

      const hoje = new Date();
      let idade = hoje.getFullYear() - dataNascimento.getFullYear();

      const mesAtual = hoje.getMonth();
      const diaAtual = hoje.getDate();
      const mesNascimento = dataNascimento.getMonth();
      const diaNascimento = dataNascimento.getDate();

      if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
        idade--;
      }

      return idade > 0 ? idade : 0;
    } catch (e) {
      console.error("Erro ao calcular idade:", e);
      return 0;
    }
  };

  function applyFilters() {
    const result = filterAndSortAlunos(alunos, busca, filters, calcularIdade);
    setResultado(result);
  }

  useEffect(() => {
    const carregarAlunos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "alunos"));

        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAlunos(lista);
      } catch (error) {
        console.error("Erro ao carregar alunos para Matrículas:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarAlunos();
  }, []);

  useEffect(() => {
    if (!loading) {
      applyFilters();
    }
  }, [filters, alunos, busca, loading]);

  const handleBuscar = () => {
    applyFilters();
  };

  const handleAnalisar = (alunoId) => {
    navigate(`/coordenacao/analise/${alunoId}`);
  };


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

  const handleFilterChange = (type, value) => {
    setFilters(prevFilters => {
      if (prevFilters[type] === value) {
        return { ...prevFilters, [type]: null };
      }
      return { ...prevFilters, [type]: value };
    });
    setShowFilterMenu(false);
  };

  const removeFilter = (key) => {
    setFilters(prevFilters => ({ ...prevFilters, [key]: null }));
  };

  const FilterDropdown = () => {
    const corRacaOptions = ["Branca", "Preta", "Parda", "Indígena"];
    const statusOptions = ["Pré-matrícula", "Aprovado", "Cancelado", "Matriculado"];
    const sortOptions = ["Mais velho", "Mais novo"];

    const FilterItem = ({ label, type, value }) => {
      const isActive = filters[type] === value;
      return (
        <div
          onClick={() => handleFilterChange(type, value)}
          className={`filter-item ${isActive ? 'filter-item-active' : ''}`}
        >
          {label}
        </div>
      );
    };

    return (
      <div className="filter-dropdown">
        <p className="filter-section-title">ORDENAÇÃO</p>
        <div className="filter-section">
          {sortOptions.map(option => (
            <FilterItem key={option} label={option} type="sort" value={option} />
          ))}
        </div>

        <p className="filter-section-title filter-section-divider">STATUS</p>
        <div className="filter-section">
          {statusOptions.map(option => (
            <FilterItem key={option} label={option} type="status" value={option} />
          ))}
        </div>

        <p className="filter-section-title filter-section-divider">RAÇA/COR</p>
        <div className="filter-section">
          {corRacaOptions.map(option => (
            <FilterItem key={option} label={option} type="corRaca" value={option} />
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <Layout><Loading text="Carregando dados de matrículas..." /></Layout>;
  }

  return (
    <Layout>
      <div className="alunos-page-container">
        <div className="page-header">
          <div className="page-title-group">
            <h1>Gestão de Matrículas</h1>
          </div>
        </div>

        <div className="filter-controls-container">
          {/*Botão de Filtro*/}
          <div className="filter-button-wrapper">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`filter-button ${showFilterMenu ? 'filter-button-active' : 'filter-button-inactive'}`}
            >
              <FiFilter size={20} />
            </button>
            {showFilterMenu && <FilterDropdown />}
          </div>

          <div className="busca-input-group" style={{ flexGrow: 1 }}>
            <input
              type="text"
              className="busca-input"
              placeholder="Buscar por nome do aluno ou status (Busca local)"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleBuscar();
              }}
            />
            <Button onClick={handleBuscar}>Buscar</Button>
          </div>
        </div>

        {/*Filtros*/}
        <div className="active-filters-display">
          {Object.entries(filters).map(([key, value]) => {
            if (value) {
              const labelMap = { sort: 'Ordenar', status: 'Status', corRaca: 'Raça/Cor' };
              const keyLabel = labelMap[key] || key;
              const displayValue = value.length > 15 ? value.substring(0, 12) + '...' : value;

              return (
                <div key={key} className="filter-tag">
                  <span>{keyLabel}:</span> {displayValue}
                  <button
                    onClick={() => removeFilter(key)}
                    className="filter-tag-remove-btn"
                  >
                    ×
                  </button>
                </div>
              );
            }
            return null;
          })}
        </div>

        {resultado.length === 0 && (busca.length > 0 || Object.values(filters).some(f => f)) && (
          <p className="busca-error">Nenhum aluno encontrado.</p>
        )}

        <SearchTable
          headers={["Nome do Aluno", "Nascimento", "Idade", "Raça/Cor", "Status", "Ações"]}
          rows={resultado.map((aluno) => ({
            id: aluno.id,
            nome: aluno.alunoData?.nome || "—",
            nascimento: formatarData(aluno.alunoData?.dataNascimento),
            idade: calcularIdade(aluno.alunoData?.dataNascimento) || "—",
            corRaca: aluno.documentos?.corRaca || "—",
            status: getStatusElement(aluno.status),
            actionPlaceholder: '',
          }))}
          onActionClick={(id) => handleAnalisar(id)}
          actionLabel="Analisar"
        />
      </div>
    </Layout>
  );
}
