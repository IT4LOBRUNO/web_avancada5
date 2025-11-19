import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import InputField from "../components/InputField.jsx";
import SelectField from "../components/SelectField.jsx";
import Button from "../components/Button.jsx";
import FormSection from "../components/FormSection.jsx";
import FormHeader from "../components/FormHeader.jsx";
import ValidationMessage from "../components/ValidationMessage.jsx";
import validateBirthDate from "../components/ValidateData.jsx";

//Tela inicial de cadastro (Para informações básicas, serve somente para iniciar o processo)

import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function AlunoCadastrar() {
  const navigate = useNavigate();

  //Verifica se o usuário está logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/")
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const [alunoData, setAlunoData] = useState({
    nome: "",
    genero: "",
    dataNascimento: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!alunoData.nome.trim()) newErrors.nome = "O nome completo é obrigatório.";
    if (!alunoData.genero) newErrors.genero = "O gênero é obrigatório.";

    const birthDateError = validateBirthDate(alunoData.dataNascimento);
    if (birthDateError) newErrors.dataNascimento = birthDateError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleNext = () => {
    if (!validate()) return;
    navigate("/alunos/formulario-documentos", { state: { alunoData } });
  };

  const handleChange = (field, value) => {
    setAlunoData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <Layout>
      <FormSection>
        <FormHeader title="Novo Cadastro de Aluno" />

        <InputField
          label="Nome Completo *"
          value={alunoData.nome}
          onChange={(v) => handleChange('nome', v)}
          placeholder="Nome completo do aluno"
          required
        />
        <ValidationMessage message={errors.nome} />

        <SelectField
          label="Gênero *"
          value={alunoData.genero}
          onChange={(v) => handleChange('genero', v)}
          options={[
            { value: "", label: "Selecione..." },
            { value: "masculino", label: "Masculino" },
            { value: "feminino", label: "Feminino" },
            { value: "outro", label: "Outro" },
          ]}
        />
        <ValidationMessage message={errors.genero} />

        <InputField
          label="Data de Nascimento *"
          type="date"
          value={alunoData.dataNascimento}
          onChange={(v) => handleChange('dataNascimento', v)}
          required
        />
        <ValidationMessage message={errors.dataNascimento} />

        <Button onClick={handleNext} style={{ marginTop: 20 }}>
          Próximo: Documentos
        </Button>
      </FormSection>
    </Layout>
  );
}
