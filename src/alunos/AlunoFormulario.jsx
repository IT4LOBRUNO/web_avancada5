import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import InputField from "../components/InputField.jsx";
import SelectField from "../components/SelectField.jsx";
import Button from "../components/Button.jsx";
import FormSection from "../components/FormSection.jsx";
import FormHeader from "../components/FormHeader.jsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";

export default function AlunoFormulario() {
  const { responsavelId } = useParams();
  const navigate = useNavigate();

  const [responsavelNome, setResponsavelNome] = useState("Carregando...");
  const [alunoData, setAlunoData] = useState({
    nome: "",
    genero: "",
    dataNascimento: "",
  });

  useEffect(() => {
    async function fetchResponsavel() {
      try {
        const docRef = doc(db, "responsaveis", responsavelId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setResponsavelNome(docSnap.data().nome || "Desconhecido");
        } else {
          setResponsavelNome("Não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar responsável:", error);
        setResponsavelNome("Erro ao carregar");
      }
    }

    fetchResponsavel();
  }, [responsavelId]);

  const handleNext = () => {
    const { nome, genero, dataNascimento } = alunoData;
    if (!nome || !genero || !dataNascimento) {
      return alert("Preencha todos os campos obrigatórios");
    }

    navigate("/alunos/formulario-documentos", {
      state: { responsavelId, responsavelNome, alunoData },
    });
  };

  return (
    <Layout>
      <FormSection>
        <FormHeader
          title="Cadastro de Aluno"
          subtitle={`Responsável selecionado: ${responsavelNome}`}
        />

        <InputField
          label="Nome"
          value={alunoData.nome}
          onChange={(v) => setAlunoData({ ...alunoData, nome: v })}
          placeholder="Nome do aluno"
        />

        <SelectField
          label="Gênero"
          value={alunoData.genero}
          onChange={(v) => setAlunoData({ ...alunoData, genero: v })}
          options={[
            { value: "", label: "Selecione" },
            { value: "masculino", label: "Masculino" },
            { value: "feminino", label: "Feminino" },
            { value: "outro", label: "Outro" },
          ]}
        />

        <InputField
          label="Data de Nascimento"
          type="date"
          value={alunoData.dataNascimento}
          onChange={(v) => setAlunoData({ ...alunoData, dataNascimento: v })}
        />

        <Button onClick={handleNext} style={{ marginTop: 20 }}>
          Próximo
        </Button>
      </FormSection>
    </Layout>
  );
}
