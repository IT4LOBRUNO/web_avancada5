import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import Button from "../components/Button.jsx";
import FormSection from "../components/FormSection.jsx";
import FormHeader from "../components/FormHeader.jsx";
import InputField from "../components/InputField.jsx";
import SelectField from "../components/SelectField.jsx";
import ValidationMessage from "../components/ValidationMessage.jsx";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

// Função utilitária para limpar não-dígitos, útil para RG/CPF
const cleanNumeric = (value) => value.replace(/\D/g, '');

export default function FormularioDocumentos() {
  const location = useLocation();
  const navigate = useNavigate();
  const { alunoData } = location.state || {};

  // Protege a página
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const [documentos, setDocumentos] = useState({
    // Dados do Aluno
    rg: "",
    cpf: "",
    sus: "",
    corRaca: "",
    nomePai: "",
    nomeMae: "",

    // NOVOS DADOS DO RESPONSÁVEL
    responsavelNome: "",
    responsavelRg: "",
    responsavelCpf: "",
    responsavelProfissao: "",
    responsavelContato: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    // Aplica limpeza para campos numéricos/de identificação
    if (['rg', 'cpf', 'sus', 'responsavelRg', 'responsavelCpf', 'responsavelContato'].includes(field)) {
      value = cleanNumeric(value);
    }

    setDocumentos(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  }

  const validate = () => {
    let newErrors = {};

    // 1. Validação do Aluno
    if (!documentos.rg.trim()) {
      newErrors.rg = "O RG do aluno é obrigatório.";
    } else if (documentos.rg.length < 5) {
      newErrors.rg = "O RG do aluno deve ter pelo menos 5 dígitos.";
    }

    if (!documentos.corRaca) {
      newErrors.corRaca = "A cor/raça é obrigatória.";
    }

    // 2. Validação do Responsável (NOVAS VALIDAÇÕES OBRIGATÓRIAS)
    if (!documentos.responsavelNome.trim()) {
      newErrors.responsavelNome = "O nome do responsável é obrigatório.";
    }

    if (!documentos.responsavelRg.trim()) {
      newErrors.responsavelRg = "O RG do responsável é obrigatório.";
    } else if (documentos.responsavelRg.length < 5) {
      newErrors.responsavelRg = "O RG do responsável deve ter pelo menos 5 dígitos.";
    }

    if (!documentos.responsavelContato.trim()) {
      newErrors.responsavelContato = "O número de contato do responsável é obrigatório.";
    } else if (documentos.responsavelContato.length < 8) { // Ex: 8 para telefone fixo mínimo
      newErrors.responsavelContato = "O contato do responsável é inválido.";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    navigate("/alunos/formulario-socio-economico", { state: { alunoData, documentos } });
  };

  return (
    <Layout>
      <FormSection>
        <FormHeader title="Cadastro de Documentos" subtitle={`Aluno: ${alunoData?.nome || 'Novo Aluno'}`} />

        <h3>Documentos de Identificação do Aluno</h3>

        <InputField
          label="RG do Aluno *"
          value={documentos.rg}
          onChange={(v) => handleChange('rg', v)}
          placeholder="Apenas números (Ex: 123456789)"
          maxLength={15}
          keyboardType="numeric"
        />
        <ValidationMessage message={errors.rg} />

        <InputField
          label="CPF do Aluno (Opcional)"
          value={documentos.cpf}
          onChange={(v) => handleChange('cpf', v)}
          placeholder="Apenas números (Ex: 12345678900)"
          maxLength={11}
          keyboardType="numeric"
        />

        <InputField
          label="SUS do Aluno (Opcional)"
          value={documentos.sus}
          onChange={(v) => handleChange('sus', v)}
          placeholder="Número do Cartão SUS"
          maxLength={15}
          keyboardType="numeric"
        />

        <SelectField
          label="Cor/Raça do Aluno *"
          value={documentos.corRaca}
          onChange={(v) => handleChange('corRaca', v)}
          options={[
            { value: "", label: "Selecione..." },
            { value: "branca", label: "Branca" },
            { value: "preta", label: "Preta" },
            { value: "parda", label: "Parda" },
            { value: "indigena", label: "Indígena" },
          ]}
        />
        <ValidationMessage message={errors.corRaca} />

        <h3>Filiação do Aluno (Opcional)</h3>
        <InputField label="Nome do Pai" value={documentos.nomePai} onChange={(v) => handleChange('nomePai', v)} placeholder="Nome completo do pai" />
        <InputField label="Nome da Mãe" value={documentos.nomeMae} onChange={(v) => handleChange('nomeMae', v)} placeholder="Nome completo da mãe" />

        <h3 style={{ marginTop: 40 }}>Responsável*</h3>
        <InputField
          label="Nome do Responsável *"
          value={documentos.responsavelNome}
          onChange={(v) => handleChange('responsavelNome', v)}
          placeholder="Nome completo do responsável"
        />
        <ValidationMessage message={errors.responsavelNome} />

        <InputField
          label="RG do Responsável *"
          value={documentos.responsavelRg}
          onChange={(v) => handleChange('responsavelRg', v)}
          placeholder="RG do responsável (Apenas números)"
          maxLength={15}
          keyboardType="numeric"
        />
        <ValidationMessage message={errors.responsavelRg} />

        <InputField
          label="CPF do Responsável (Opcional)"
          value={documentos.responsavelCpf}
          onChange={(v) => handleChange('responsavelCpf', v)}
          placeholder="CPF do responsável (Apenas números)"
          maxLength={11}
          keyboardType="numeric"
        />

        <InputField
          label="Profissão do Responsável (Opcional)"
          value={documentos.responsavelProfissao}
          onChange={(v) => handleChange('responsavelProfissao', v)}
          placeholder="Profissão"
        />

        <InputField
          label="Número para Contato do Responsável *"
          value={documentos.responsavelContato}
          onChange={(v) => handleChange('responsavelContato', v)}
          placeholder="Ex: (00) 90000-0000"
          maxLength={11}
          keyboardType="numeric"
        />
        <ValidationMessage message={errors.responsavelContato} />


        <Button onClick={handleNext} style={{ marginTop: 20 }}>Próximo: Socioeconômico</Button>
      </FormSection>
    </Layout>
  );
}