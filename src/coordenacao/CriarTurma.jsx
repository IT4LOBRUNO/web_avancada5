import React, { useState } from "react";
import Layout from "../components/Layout.jsx";
import Button from "../components/Button.jsx";
import InputField from "../components/InputField.jsx";
import SelectField from "../components/SelectField.jsx";
import FormSection from "../components/FormSection.jsx";
import FormHeader from "../components/FormHeader.jsx";
import ValidationMessage from "../components/ValidationMessage.jsx";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function CriarTurma() {
  const [turmaData, setTurmaData] = useState({
    nome: "",
    turno: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};

    if (!turmaData.nome.trim()) newErrors.nome = "O nome da turma é obrigatório.";
    if (!turmaData.turno) newErrors.turno = "O turno é obrigatório.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setTurmaData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSalvar = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "turmas"), {
        nome: turmaData.nome,
        turno: turmaData.turno,
        membros: [],
        totalMembros: 0,
      });

      navigate("/coordenacao/turmas");
    } catch (error) {
      console.error("Erro ao criar turma:", error);
      alert("Erro ao criar turma, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <FormSection>
        <FormHeader title="Criar Nova Turma" />

        <InputField
          label="Nome da Turma *"
          value={turmaData.nome}
          onChange={(v) => handleChange("nome", v)}
          placeholder="Ex: 1º Ano A"
          required
        />
        <ValidationMessage message={errors.nome} />

        <SelectField
          label="Turno *"
          value={turmaData.turno}
          onChange={(v) => handleChange("turno", v)}
          options={[
            { value: "", label: "Selecione..." },
            { value: "Manhã", label: "Manhã" },
            { value: "Tarde", label: "Tarde" },
          ]}
        />
        <ValidationMessage message={errors.turno} />

        <Button
          variant="azul"
          onClick={handleSalvar}
          disabled={loading}
          style={{ marginTop: 20 }}
        >
          {loading ? "Salvando..." : "Confirmar"}
        </Button>
      </FormSection>
    </Layout>
  );
}
