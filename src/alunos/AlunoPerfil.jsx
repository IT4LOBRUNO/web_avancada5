import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Layout from "../components/Layout.jsx";
import Button from "../components/Button.jsx";
import { downloadBase64File } from "../components/DownloadHelper.jsx";
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import "./AlunoPerfil.css";


//Função de data tirada da internet
const formatarData = (dataStr) => {
  if (!dataStr) return "—";
  const partes = dataStr.split("-");
  if (partes.length === 3) {
    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
  }
  return dataStr;
};

export default function AlunoPerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aluno, setAluno] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const docRef = doc(db, "alunos", id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setAluno(snap.data());
        } else {
          setErro("Aluno não encontrado ou ID inválido.");
        }
      } catch (error) {
        console.error("Erro ao carregar aluno:", error);
        setErro("Falha ao carregar dados do aluno. Verifique sua conexão ou regras do Firestore.");
      } finally {
        setCarregando(false);
      }
    };
    fetchAluno();
  }, [id]);

  const handleDownload = (base64Data, filename) => {
    if (base64Data) {
      //fileToBase64 no formulário cria um DataURL
      //downloadBase64File precisa ser nesse formato.
      downloadBase64File(base64Data, filename);
    } else {
      alert("Arquivo não disponível ou corrompido.");
    }
  }

  if (carregando) return <Layout><p>Carregando perfil...</p></Layout>;
  if (erro) return <Layout><p style={{ color: 'red' }}>Erro: {erro}</p></Layout>;
  if (!aluno) return <Layout><p>Aluno não encontrado.</p></Layout>;

  const { alunoData, documentos, habitacao, bens, arquivos } = aluno;

  return (
    <Layout>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Button onClick={() => navigate('/buscar-aluno')} style={{ marginRight: '15px' }}>
          <FiArrowLeft /> Voltar à Busca
        </Button>
        <h1>Perfil de {alunoData?.nome || 'Aluno Desconhecido'}</h1>
      </div>

      <hr />

      {/*Dados Pessoais do Aluno*/}
      <div className="perfil-section">
        <h2>Dados Pessoais do Aluno</h2>
        <div className="perfil-grid">
          <p><strong>Nome Completo:</strong> {alunoData?.nome || '—'}</p>
          <p><strong>Data de Nasc.:</strong> {formatarData(alunoData?.dataNascimento)}</p>
          <p><strong>Gênero:</strong> {alunoData?.genero || '—'}</p>
          <p><strong>Cor/Raça:</strong> {documentos?.corRaca || '—'}</p>
        </div>
      </div>

      {/*Documentos do Aluno e Filiação*/}
      <div className="perfil-section">
        <h2>Documentos e Filiação</h2>
        <div className="perfil-grid">
          <p><strong>RG do Aluno:</strong> {documentos?.rg || '—'}</p>
          <p><strong>CPF do Aluno:</strong> {documentos?.cpf || 'Não Informado'}</p>
          <p><strong>Cartão SUS:</strong> {documentos?.sus || 'Não Informado'}</p>
          <p><strong>Nome do Pai:</strong> {documentos?.nomePai || 'Não Informado'}</p>
          <p><strong>Nome da Mãe:</strong> {documentos?.nomeMae || 'Não Informado'}</p>
        </div>
      </div>

      {/*Dados do Responsável*/}
      <div className="perfil-section">
        <h2>Dados do Responsável pela Matrícula</h2>
        <div className="perfil-grid">
          <p><strong>Nome:</strong> {documentos?.responsavelNome || '—'}</p>
          <p><strong>RG:</strong> {documentos?.responsavelRg || '—'}</p>
          <p><strong>CPF:</strong> {documentos?.responsavelCpf || 'Não Informado'}</p>
          <p><strong>Profissão:</strong> {documentos?.responsavelProfissao || 'Não Informado'}</p>
          <p><strong>Contato:</strong> {documentos?.responsavelContato || '—'}</p>
        </div>
      </div>

      {/*Situação Socioeconômica (Habitação)*/}
      <div className="perfil-section">
        <h2>Habitação e Saneamento</h2>
        <div className="perfil-grid">
          <p><strong>Situação:</strong> {habitacao?.situacao || '—'}</p>
          {habitacao?.situacao === 'alugada' && (
            <p><strong>Valor Aluguel (R$):</strong> {habitacao?.valorAluguel || '0,00'}</p>
          )}
          <p><strong>Água:</strong> {habitacao?.abastecimentoAgua || '—'}</p>
          <p><strong>Esgoto:</strong> {habitacao?.tratamentoEsgoto || '—'}</p>
          <p><strong>Lixo:</strong> {habitacao?.coletaLixo || '—'}</p>
        </div>
      </div>

      {/*Bens (Socioeconômico)*/}
      <div className="perfil-section">
        <h2>Bens e Equipamentos</h2>
        <div className="perfil-grid">
          <p><strong>Televisões:</strong> {bens?.televisao || 0}</p>
          <p><strong>Geladeiras:</strong> {bens?.geladeira || 0}</p>
          <p><strong>Computadores:</strong> {bens?.computador || 0}</p>
          <p><strong>Carros:</strong> {bens?.carro || 0}</p>
          <p><strong>Motos:</strong> {bens?.moto || 0}</p>
        </div>
      </div>


      {/*Documentos Anexados (Base64)*/}
      <div className="perfil-section">
        <h2>Documentos Anexados</h2>
        <p style={{ marginBottom: 15, fontSize: '0.9em', color: '#6c757d' }}>
          Clique para baixar os arquivos salvos em formato Base64.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {/*Certidão de Nascimento*/}
          <Button
            onClick={() => handleDownload(arquivos?.certidaoNascimentoBase64, "certidao.pdf")}
            disabled={!arquivos?.certidaoNascimentoBase64}
          >
            <FiDownload /> Certidao
          </Button>

          {/*Comprovante de Residência*/}
          <Button
            onClick={() => handleDownload(arquivos?.comprovanteResidenciaBase64, "comprovante_residencia.pdf")}
            disabled={!arquivos?.comprovanteResidenciaBase64}
          >
            <FiDownload /> Residencia
          </Button>
        </div>
      </div>
    </Layout>
  );
}