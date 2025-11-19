import React from "react";
import "./Components.css";

//Descontinuado para SearchTable

export default function AlunoCard({ aluno, onEdit, onDelete }) {
  return (
    <div className="card">
      <p><strong>Nome:</strong> {aluno.nome}</p>
      <p><strong>Idade:</strong> {aluno.idade}</p>
      <p><strong>Turma:</strong> {aluno.turma}</p>

      <div className="card-buttons">
        {onEdit && <button onClick={() => onEdit(aluno)}>Editar</button>}
        {onDelete && <button onClick={() => onDelete(aluno)}>Excluir</button>}
      </div>
    </div>
  );
}
