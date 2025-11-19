import React, { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout.jsx";
import SearchTable from "../components/SearchTable.jsx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import { FiFilter } from "react-icons/fi";
import "../coordenacao/Coordenacao.css";

export default function AlunoBuscar() {
  const [busca, setBusca] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    idade: "",
    status: null,
    corRaca: null,
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const navigate = useNavigate();

  const calcularIdade = (dataNascimentoStr) => {
    if (!dataNascimentoStr) return 0;
    const partes = dataNascimentoStr.split("-");
    if (partes.length !== 3) return 0;

    const [ano, mes, dia] = partes.map(Number);
    const dataNascimento = new Date(ano, mes - 1, dia);
    const hoje = new Date();

    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    if (
      hoje.getMonth() < dataNascimento.getMonth() ||
      (hoje.getMonth() === dataNascimento.getMonth() && hoje.getDate() < dataNascimento.getDate())
    ) {
      idade--;
    }
    return idade > 0 ? idade : 0;
  };

  const applyFilters = useCallback(() => {
    let list = [...alunos];
    const termo = busca.toLowerCase();

    //Filtro de busca de texto (Nome do Aluno, Responsável, RG/CPF)
    if (termo.length >= 3) {
      list = list.filter(a =>
        a.alunoData?.nome?.toLowerCase().includes(termo) ||
        a.documentos?.responsavelNome?.toLowerCase().includes(termo) ||
        a.documentos?.rg?.includes(termo) ||
        a.documentos?.cpf?.includes(termo)
      );
    } else if (termo.length > 0 && termo.length < 3) {
    }

    //Filtro de Status
    if (filters.status) {
      list = list.filter(a => a.status === filters.status);
    }

    //Filtro de Cor/Raça
    if (filters.corRaca) {
      list = list.filter(a =>
        a.documentos?.corRaca?.toLowerCase() === filters.corRaca.toLowerCase()
      );
    }

    //Filtro de idade exata
    if (filters.idade) {
      const idadeFiltrada = Number(filters.idade);
      if (!isNaN(idadeFiltrada)) {
        list = list.filter(a => calcularIdade(a.alunoData?.dataNascimento) === idadeFiltrada);
      }
    }

    setResultado(list);
  }, [alunos, busca, filters]);


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
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarAlunos();
  }, []);

  //Filtra sempre que houver alteração
  useEffect(() => {
    if (!loading) {
      applyFilters();
    } else {
      //Se não houver nada nos filtros retorna tudo
      setResultado(alunos);
    }
  }, [filters, alunos, busca, loading, applyFilters]);

  //Método que abre, fecha e muda o filtro
  const handleFilterChange = (type, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [type]: prevFilters[type] === value ? null : value
    }));
    setShowFilterMenu(false);
  };

  const removeFilter = (key) => setFilters(prev => ({ ...prev, [key]: null }));

  //Dropdown
  const FilterDropdown = () => {
    const corRacaOptions = ["Branca", "Preta", "Parda", "Indigena"];
    const statusOptions = ["Pré-matrícula", "Aprovado", "Cancelado", "Matriculado", "Rematricula"];

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
        <p className="filter-section-title">STATUS</p>
        <div className="filter-section">
          {statusOptions.map(option => <FilterItem key={option} label={option} type="status" value={option} />)}
        </div>

        <p className="filter-section-title filter-section-divider">RAÇA/COR</p>
        <div className="filter-section">
          {corRacaOptions.map(option => <FilterItem key={option} label={option} type="corRaca" value={option} />)}
        </div>
      </div>
    );
  };

  const handlePerfil = (alunoId) => {
    navigate(`/aluno-perfil/${alunoId}`);
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

    const normalized = statusValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    if (normalized === "pré-matricula" || normalized === "pre-matricula") {
      className = "status-pre-matricula";
    } else if (normalized === "cancelado") {
      className = "status-cancelado";
    } else if (normalized === "aprovado") {
      className = "status-aprovado";
    } else if (normalized === "matriculado") {
      className = "status-matriculado";
    } else if (normalized === "rematricula") {
      className = "status-rematricula";
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
          <div className="filter-button-wrapper">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`filter-button ${showFilterMenu ? 'filter-button-active' : 'filter-button-inactive'}`}
            >
              <FiFilter size={20} />
            </button>
            {showFilterMenu && <FilterDropdown />}
          </div>

          <div className="busca-input-group" style={{ flexGrow: 1, display: "flex", gap: "10px" }}>

            {/*Idade Exata*/}
            <input
              type="number"
              placeholder="Idade"
              value={filters.idade}
              onChange={(e) => setFilters(prev => ({ ...prev, idade: e.target.value }))}
              className="idade-input"
            />


            {/* Input de Busca por Nome/Status/Responsável (3) */}
            <input
              type="text"
              className="busca-input"
              placeholder="Buscar por nome, responsável ou RG/CPF (mín. 3 caracteres)"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') applyFilters(); }}
              style={{ flexGrow: 1 }}
            />
          </div>
        </div>

        {/* Visualização de filtros ativos */}
        <div className="active-filters-display">
          {Object.entries(filters).map(([key, value]) => value && (
            <div key={key} className="filter-tag">
              <span>{key === 'idade' ? 'Idade' : key}:</span> {value}
              <button onClick={() => removeFilter(key)} className="filter-tag-remove-btn">×</button>
            </div>
          ))}
        </div>

        {resultado.length === 0 && (busca.length > 0 || Object.values(filters).some(f => f)) && (
          <p className="busca-error">Nenhum aluno encontrado.</p>
        )}

        {/* Tabela de Resultados */}
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