import React, { useState } from "react";
import Layout from "../components/Layout.jsx";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx"; 
import "./Coordenacao.css";

export default function CriarTurma() {
  const [nome, setNome] = useState("");
  const [turno, setTurno] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSalvar = async () => {
    if (!nome.trim() || !turno.trim()) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "turmas"), {
        nome,
        turno,
        membros: [],
        totalMembros: 0,
      });

      alert("Turma criada com sucesso!");
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
      <div className="alunos-page-container">

        {/* Header da página */}
        <div className="page-header page-header-turmas">
          <h1>Criar Nova Turma</h1>
        </div>

        <div className="form-container">

          <label className="form-label">Nome da Turma</label>
          <input
            type="text"
            className="form-input"
            placeholder="Ex: 1º Ano A"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label className="form-label" style={{ marginTop: "15px" }}>
            Turno
          </label>
          <select
            className="form-input"
            value={turno}
            onChange={(e) => setTurno(e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="Manhã">Manhã</option>
            <option value="Tarde">Tarde</option>
          </select>

          <Button variant="verde" onClick={handleSalvar} disabled={loading} style={{ marginTop: "25px" }}>
            {loading ? "Salvando..." : "Confirmar"}
          </Button>

        </div>
      </div>
    </Layout>
  );
}
