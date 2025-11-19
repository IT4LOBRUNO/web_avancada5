import React from "react";
import "./Components.css";

//Descontinuado (Professor sugeriu a remoção do responsável no cadastro do aluno)

export default function ResponsavelCard({ responsavel, onDownloadComprovante, onDownloadRgCnh, onCadastrar }) {
  return (
    <div className="card">
      <p><strong>Nome:</strong> {responsavel.nome}</p>
      <p><strong>CPF:</strong> {responsavel.cpf}</p>
      <p><strong>Telefone:</strong> {responsavel.telefone}</p>
      <p><strong>Endereço:</strong> {responsavel.endereco}</p>
      <p><strong>Email:</strong> {responsavel.email}</p>


      <div className="card-buttons">
        {onDownloadComprovante && (
          <button onClick={() => onDownloadComprovante(responsavel)}>
            Baixar Comprovante
          </button>
        )}
        {onDownloadRgCnh && (
          <button onClick={() => onDownloadRgCnh(responsavel)}>
            Baixar RG/CNH
          </button>
        )}
        {onCadastrar && (
          <button onClick={() => onCadastrar(responsavel)}>
            Cadastrar Aluno
          </button>
        )}
      </div>
    </div>
  );
}
