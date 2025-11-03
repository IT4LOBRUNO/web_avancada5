import React from "react";
import Layout from "../components/Layout";

export default function Matriculas() {
  return (
    <Layout>
      {/* Container principal para aplicar padding e cor de fundo, 
        seguindo o padrão de conteúdo das outras páginas.
      */}
      <div className="alunos-page-container">
        {/* Cabeçalho da página de Matrículas */}
        <div className="page-header">
          <div className="page-title-group">
            <h1>Gestão de Matrículas</h1>
          </div>
        </div>

        {/* Conteúdo simples para teste da rota */}
        <div style={{ padding: '20px', backgroundColor: '#FFFFFF', borderRadius: '10px' }}>
          <p>Esta é a tela de Gestão de Matrículas.</p>
          <p>A rota está funcionando corretamente.</p>
        </div>
      </div>
    </Layout>
  );
}
