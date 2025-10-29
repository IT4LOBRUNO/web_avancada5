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

export default function FormularioSocioEconomico() {
  const location = useLocation();
  const navigate = useNavigate();
  const { alunoData, documentos } = location.state || {};

  // Protege a página: Redireciona se não estiver logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const [socioEconomico, setSocioEconomico] = useState({
    situacao: "",
    valorAluguel: "",
    abastecimentoAgua: "",
    tratamentoEsgoto: "",
    coletaLixo: "",
    televisao: 0,
    geladeira: 0,
    computador: 0,
    carro: 0,
    moto: 0,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    let newValue = value;

    // Garante que os campos de contagem sejam números inteiros não negativos
    if (['televisao', 'geladeira', 'computador', 'carro', 'moto'].includes(field)) {
      const num = parseInt(value, 10);
      newValue = (isNaN(num) || num < 0) ? 0 : num;
    }

    // Para valorAluguel (opcionalmente pode ser float)
    if (field === 'valorAluguel' && value === '') {
      newValue = ''; // Permite string vazia para o campo opcional
    }

    setSocioEconomico(prev => ({ ...prev, [field]: newValue }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  }

  const validate = () => {
    let newErrors = {};

    if (!socioEconomico.situacao) newErrors.situacao = "A situação habitacional é obrigatória.";
    if (!socioEconomico.abastecimentoAgua) newErrors.abastecimentoAgua = "O tipo de abastecimento de água é obrigatório.";
    if (!socioEconomico.tratamentoEsgoto) newErrors.tratamentoEsgoto = "O tipo de tratamento de esgoto é obrigatório.";
    if (!socioEconomico.coletaLixo) newErrors.coletaLixo = "A informação sobre a coleta de lixo é obrigatória.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;

    // Separa os dados em dois objetos menores para organização no Firestore
    const {
      situacao,
      valorAluguel,
      abastecimentoAgua,
      tratamentoEsgoto,
      coletaLixo,
      ...bens
    } = socioEconomico;

    const habitacao = { situacao, valorAluguel, abastecimentoAgua, tratamentoEsgoto, coletaLixo };

    navigate("/alunos/formulario-conclusao", {
      state: { alunoData, documentos, habitacao, bens },
    });
  };

  return (
    <Layout>
      <FormSection>
        <FormHeader title="Informações Socioeconômicas" subtitle={`Aluno: ${alunoData?.nome || 'Novo Aluno'}`} />

        <h3>Situação Habitacional e Saneamento *</h3>

        <SelectField
          label="Situação da Moradia *"
          value={socioEconomico.situacao}
          onChange={(v) => handleChange('situacao', v)}
          options={[
            { value: "", label: "Selecione..." },
            { value: "propria", label: "Própria" },
            { value: "alugada", label: "Alugada" },
            { value: "cedida", label: "Cedida" },
            { value: "ocupacao", label: "Ocupação" },
          ]}
        />
        <ValidationMessage message={errors.situacao} />

        {socioEconomico.situacao === 'alugada' && (
          <InputField
            label="Valor do Aluguel (R$)"
            type="number"
            value={socioEconomico.valorAluguel}
            onChange={(v) => handleChange('valorAluguel', v)}
            placeholder="0,00"
            min="0"
          />
        )}

        <SelectField
          label="Abastecimento de Água *"
          value={socioEconomico.abastecimentoAgua}
          onChange={(v) => handleChange('abastecimentoAgua', v)}
          options={[
            { value: "", label: "Selecione..." },
            { value: "rede", label: "Rede pública" },
            { value: "poco", label: "Poço/Cisterna" },
            { value: "outros", label: "Outros" },
          ]}
        />
        <ValidationMessage message={errors.abastecimentoAgua} />

        <SelectField
          label="Tratamento de Esgoto *"
          value={socioEconomico.tratamentoEsgoto}
          onChange={(v) => handleChange('tratamentoEsgoto', v)}
          options={[
            { value: "", label: "Selecione..." },
            { value: "rede", label: "Rede pública" },
            { value: "fossa", label: "Fossa séptica" },
            { value: "outros", label: "Outros" },
          ]}
        />
        <ValidationMessage message={errors.tratamentoEsgoto} />

        <SelectField
          label="Coleta de Lixo *"
          value={socioEconomico.coletaLixo}
          onChange={(v) => handleChange('coletaLixo', v)}
          options={[
            { value: "", label: "Selecione..." },
            { value: "coleta_direta", label: "Serviço de Coleta (Caminhão)" },
            { value: "queima", label: "Queima/Enterra" },
            { value: "outro", label: "Outros" },
          ]}
        />
        <ValidationMessage message={errors.coletaLixo} />

        <h3>Bens e Equipamentos (Opcional)</h3>
        <InputField label="Nº de Televisões" type="number" value={socioEconomico.televisao} onChange={(v) => handleChange('televisao', v)} placeholder="0" min="0" />
        <InputField label="Nº de Geladeiras" type="number" value={socioEconomico.geladeira} onChange={(v) => handleChange('geladeira', v)} placeholder="0" min="0" />
        <InputField label="Nº de Computadores/Notebooks" type="number" value={socioEconomico.computador} onChange={(v) => handleChange('computador', v)} placeholder="0" min="0" />
        <InputField label="Nº de Carros" type="number" value={socioEconomico.carro} onChange={(v) => handleChange('carro', v)} placeholder="0" min="0" />
        <InputField label="Nº de Motos" type="number" value={socioEconomico.moto} onChange={(v) => handleChange('moto', v)} placeholder="0" min="0" />

        <Button onClick={handleNext} style={{ marginTop: 20 }}>Próximo: Conclusão</Button>
      </FormSection>
    </Layout>
  );
}