import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Layout from "../components/Layout.jsx";
import Button from "../components/Button.jsx";
import { FiArrowLeft } from "react-icons/fi";
import "../alunos/alunoPerfil.css";

const formatarData = (dataStr) => {
  if (!dataStr) return "—";
  const partes = dataStr.split("-");
  if (partes.length === 3) {
    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
  }
  return dataStr;
};

export default function Analise() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aluno, setAluno] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const snap = await getDoc(doc(db, "alunos", id));
        if (snap.exists()) setAluno(snap.data());
      } catch (erro) {
        console.log("Erro ao buscar aluno:", erro);
      }
      setCarregando(false);
    };
    fetchAluno();
  }, [id]);

  const atualizarStatus = async (novoStatus) => {
    if (processando) return;

    setProcessando(true);
    try {
      await updateDoc(doc(db, "alunos", id), { status: novoStatus });
      alert(`Status atualizado para: ${novoStatus}`);
      navigate("/coordenacao/matriculas");
    } catch (erro) {
      console.log("Erro ao atualizar status:", erro);
    } finally {
      setProcessando(false);
    }
  };

  if (carregando) return <Layout><p>Carregando análise...</p></Layout>;
  if (!aluno) return <Layout><p>Aluno não encontrado.</p></Layout>;

  const { alunoData, documentos, habitacao, bens } = aluno;

  return (
    <Layout>
      <div className="perfil-header">
        <Button onClick={() => navigate("/coordenacao/matriculas")} className="btn-voltar">
          <FiArrowLeft /> Voltar
        </Button>
        <h1 className="perfil-titulo">Análise de {alunoData?.nome}</h1>
      </div>

      <hr className="perfil-divisor" />

      <div className="perfil-section">
        <h2>Dados Pessoais</h2>
        <div className="perfil-grid">
          <p><strong>Nome:</strong> {alunoData?.nome}</p>
          <p><strong>Nascimento:</strong> {formatarData(alunoData?.dataNascimento)}</p>
          <p><strong>Gênero:</strong> {alunoData?.genero}</p>
          <p><strong>Cor/Raça:</strong> {documentos?.corRaca}</p>
        </div>
      </div>

      <div className="perfil-section">
        <h2>Documentos e Filiação</h2>
        <div className="perfil-grid">
          <p><strong>RG:</strong> {documentos?.rg}</p>
          <p><strong>CPF:</strong> {documentos?.cpf || "Não informado"}</p>
          <p><strong>Nome do Pai:</strong> {documentos?.nomePai}</p>
          <p><strong>Nome da Mãe:</strong> {documentos?.nomeMae}</p>
        </div>
      </div>

      <div className="perfil-section">
        <h2>Responsável</h2>
        <div className="perfil-grid">
          <p><strong>Nome:</strong> {documentos?.responsavelNome}</p>
          <p><strong>Contato:</strong> {documentos?.responsavelContato}</p>
          <p><strong>Profissão:</strong> {documentos?.responsavelProfissao}</p>
        </div>
      </div>

      <div className="perfil-section">
        <h2>Bens</h2>
        <div className="perfil-grid">
          <p><strong>Carro:</strong> {bens?.carro}</p>
          <p><strong>Computador:</strong> {bens?.computador}</p>
          <p><strong>Geladeira:</strong> {bens?.geladeira}</p>
          <p><strong>Moto:</strong> {bens?.moto}</p>
          <p><strong>Televisão:</strong> {bens?.televisao}</p>
        </div>
      </div>

      <div className="perfil-section">
        <h2>Habitação</h2>
        <div className="perfil-grid">
          <p><strong>Situação:</strong> {habitacao?.situacao}</p>
          <p><strong>Abastecimento de água:</strong> {habitacao?.abastecimentoAgua}</p>
          <p><strong>Coleta de lixo:</strong> {habitacao?.coletaLixo}</p>
          <p><strong>Tratamento de esgoto:</strong> {habitacao?.tratamentoEsgoto}</p>
          <p><strong>Valor do aluguel:</strong> {habitacao?.valorAluguel || "—"}</p>
        </div>
      </div>

      <div className="perfil-acoes">
        <Button
          className="btn-aprovar"
          onClick={() => atualizarStatus("Aprovado")}
          disabled={processando}
        >
          {processando ? "Processando..." : "Aprovar Matrícula"}
        </Button>

        <Button
          className="btn-rejeitar"
          onClick={() => atualizarStatus("Cancelado")}
          disabled={processando}
        >
          {processando ? "Processando..." : "Rejeitar Matrícula"}
        </Button>
      </div>
    </Layout>
  );
}
