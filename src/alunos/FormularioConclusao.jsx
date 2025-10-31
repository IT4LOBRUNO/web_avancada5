import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import Button from "../components/Button.jsx";
import FileUploader from "../components/FileUploader.jsx";
import FormSection from "../components/FormSection.jsx";
import FormHeader from "../components/FormHeader.jsx";
import Loading from "../components/Loading.jsx";
import ValidationMessage from "../components/ValidationMessage.jsx";
import { db, auth } from "../firebase/firebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });


export default function FormularioConclusao() {
  const location = useLocation();
  const navigate = useNavigate();
  const { alunoData, documentos, habitacao, bens } = location.state || {};

  const [arquivos, setArquivos] = useState({
    certidaoNascimento: null,
    comprovanteResidencia: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleFileChange = (campo, file) => {
    setArquivos((prev) => ({ ...prev, [campo]: file }));
    if (errors[campo]) {
      setErrors(prev => ({ ...prev, [campo]: null }));
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!arquivos.certidaoNascimento) {
      newErrors.certidaoNascimento = "A Certidão de Nascimento é obrigatória.";
    }
    if (!arquivos.comprovanteResidencia) {
      newErrors.comprovanteResidencia = "Comprovante de Residência é obrigatório.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !alunoData) return;
    if (!userId) {
      console.error("Sessão expirada ou usuário não autenticado.");
      alert("Sessão expirada ou usuário não autenticado. Por favor, faça login novamente.");
      setLoading(false);
      navigate("/");
      return;
    }

    setLoading(true);
    try {
      const certidaoBase64 = await fileToBase64(arquivos.certidaoNascimento);
      const comprovanteBase64 = await fileToBase64(arquivos.comprovanteResidencia);

      const alunoDoc = {
        alunoData,
        documentos,
        habitacao,
        bens,
        arquivos: {
          certidaoNascimentoBase64: certidaoBase64,
          comprovanteResidenciaBase64: comprovanteBase64,
        },
        createdBy: userId,
        createdAt: new Date(),
        status: 'Pré-matrícula',
      };

      await addDoc(collection(db, "alunos"), alunoDoc);

      alert(`Aluno ${alunoData.nome} salvo com sucesso!`);
      navigate("/home");
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);

      let errorMessage = "Ocorreu um erro ao salvar os dados. Verifique o console.";

      //Limite do firestore de 1MB
      if (error.message && error.message.includes("exceeds the maximum allowed") || error.message.includes("cannot be written because its size (1,530,505 bytes) ")) {
        errorMessage = "O documento é muito grande! Tente reenviar arquivos menores (PDFs com menos de 700KB no total).";
      } else if (error.message && error.message.includes("Permission denied")) {
        errorMessage = "Permissão negada. Verifique as regras do Firestore.";
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <FormSection>
        <FormHeader
          title="Conclusão do Cadastro"
          subtitle={`Aluno: ${alunoData?.nome || 'Novo Aluno'}`}
        />

        <h3>Envio de Documentos (Obrigatório)</h3>

        {/*Certidão de Nascimento*/}
        <FileUploader
          label="Certidão de Nascimento *"
          accept=".pdf,image/*"
          required
          onChange={(file) => handleFileChange("certidaoNascimento", file)}
        />
        <ValidationMessage message={errors.certidaoNascimento} />

        {/*Comprovante de Residência*/}
        <FileUploader
          label="Comprovante de Residência *"
          accept=".pdf,image/*"
          required
          onChange={(file) => handleFileChange("comprovanteResidencia", file)}
        />
        <ValidationMessage message={errors.comprovanteResidencia} />

        <p style={{ marginTop: 20, fontStyle: 'italic', fontSize: '13px', color: '#6C757D' }}>
          Os arquivos devem ser enviados no formato PDF e não podem exceder 700KB no total para o documento.
        </p>

        <Button
          onClick={handleSave}
          style={{ marginTop: 30 }}
          disabled={loading}
        >
          {loading ? <Loading text="Salvando..." /> : "Salvar Cadastro"}
        </Button>
      </FormSection>
    </Layout>
  );
}
