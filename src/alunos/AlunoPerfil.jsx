import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Layout from "../components/Layout.jsx";
import Button from "../components/Button.jsx";
import { downloadBase64File } from "../components/DownloadHelper.jsx";
import { salvarFotoPerfil } from "../components/FotoPerfil.jsx";
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import "./AlunoPerfil.css";

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
      downloadBase64File(base64Data, filename);
    } else {
      alert("Arquivo não disponível ou corrompido.");
    }
  };

  const handleFotoPerfilChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const base64 = await salvarFotoPerfil(id, file);
      alert("Foto de perfil atualizada com sucesso!");
      setAluno(prev => ({ ...prev, fotoPerfil: base64 }));
    } catch (err) {
      console.error("Erro ao atualizar foto de perfil:", err);
      alert("Não foi possível atualizar a foto. Tente novamente.");
    }
  };

  if (carregando) return <Layout><p>Carregando perfil...</p></Layout>;
  if (erro) return <Layout><p className="erro-mensagem">Erro: {erro}</p></Layout>;
  if (!aluno) return <Layout><p>Aluno não encontrado.</p></Layout>;

  const { alunoData, documentos, habitacao, bens, arquivos } = aluno;

  return (
    <Layout>
      {/*Cabeçalho*/}
      <div className="aluno-cabecalho">
        <Button onClick={() => navigate('/buscar-aluno')}>
          <FiArrowLeft /> Voltar à Busca
        </Button>
        <h1>Perfil de {alunoData?.nome || 'Aluno Desconhecido'}</h1>
      </div>

      <hr />

      {/*Foto de Perfil*/}
      <div className="foto-perfil-container">
        <h2>Foto de Perfil</h2>
        <div className="foto-perfil-inner">
          {aluno?.fotoPerfil ? (
            <img
              src={aluno.fotoPerfil}
              alt="Avatar do Aluno"
              className="foto-perfil-img"
            />
          ) : (
            <div className="foto-perfil-placeholder">
              {aluno?.alunoData?.nome?.charAt(0) || '?'}
            </div>
          )}

          <input
            id="foto-perfil-input"
            type="file"
            accept="image/*"
            onChange={handleFotoPerfilChange}
            style={{ display: 'none' }}
          />

          <label htmlFor="foto-perfil-input" className="custom-file-button">
            Alterar Foto
          </label>
        </div>
      </div>


      {/*Dados Pessoais*/}
      <div className="perfil-section">
        <h2>Dados Pessoais do Aluno</h2>
        <div className="perfil-grid">
          <p><strong>Nome Completo:</strong> {alunoData?.nome || '—'}</p>
          <p><strong>Data de Nasc.:</strong> {formatarData(alunoData?.dataNascimento)}</p>
          <p><strong>Gênero:</strong> {alunoData?.genero || '—'}</p>
          <p><strong>Cor/Raça:</strong> {documentos?.corRaca || '—'}</p>
        </div>
      </div>

      {/*Documentos e Filiação*/}
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

      {/*Habitação*/}
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

      {/*Bens*/}
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

      {/*Documentos Anexados*/}
      <div className="perfil-section">
        <h2>Documentos Anexados</h2>
        <p className="documentos-info">
          Clique para baixar os arquivos.
        </p>
        <div className="documentos-buttons">
          <Button
            onClick={() => handleDownload(arquivos?.certidaoNascimentoBase64, "certidao.pdf")}
            disabled={!arquivos?.certidaoNascimentoBase64}
          >
            <FiDownload /> Certidao
          </Button>

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
