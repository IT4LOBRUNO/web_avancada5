import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import CriarConta from "./criarConta/CriarConta.jsx";
import Home from "./home/Home.jsx";
import ResponsaveisBusca from "./responsaveis/ResponsaveisBusca.jsx";
import ResponsaveisCriacao from "./responsaveis/ResponsaveisCriacao.jsx";
import AlunoBuscar from "./alunos/AlunoBuscar.jsx";
import AlunoCadastrar from "./alunos/AlunoCadastrar.jsx";
import AlunoFormulario from "./alunos/AlunoFormulario.jsx";
import FormularioDocumentos from "./alunos/FormularioDocumentos.jsx";
import FormularioSocioEconomico from "./alunos/FormularioSocioEconomico.jsx";
import FormularioConclusao from "./alunos/FormularioConclusao.jsx";
import AlunoPerfil from "./alunos/AlunoPerfil.jsx";
import Matriculas from "./coordenacao/Matriculas.jsx";
import Notas from "./alunos/Notas.jsx";
import Analise from "./coordenacao/Analise.jsx";
import Turmas from "./coordenacao/Turmas.jsx";
import CriarTurma from "./coordenacao/CriarTurma.jsx";
import AdicionarAluno from "./coordenacao/AdicionarAluno.jsx";
import EditarTurma from "./coordenacao/EditarTurma.jsx";
import Avisos from "./coordenacao/Avisos.jsx";
import Calendario from "./coordenacao/Calendario.jsx";
import Datas from "./responsaveis/Datas.jsx";


export default function App() {
  return (
    <Routes>
      {/* Autenticação */}
      <Route path="/" element={<Login />} />
      <Route path="/criar-conta" element={<CriarConta />} />
      <Route path="/home" element={<Home />} />


      {/* Alunos */}
      <Route path="/buscar-aluno" element={<AlunoBuscar />} />
      <Route path="/cadastrar-aluno" element={<AlunoCadastrar />} />
      <Route path="/cadastrar-aluno/:responsavelId" element={<AlunoFormulario />} />
      <Route path="/alunos/formulario-documentos" element={<FormularioDocumentos />} />
      <Route path="/alunos/formulario-socio-economico" element={<FormularioSocioEconomico />} />
      <Route path="/alunos/formulario-conclusao" element={<FormularioConclusao />} />
      <Route path="/aluno-perfil/:id" element={<AlunoPerfil />} />
      <Route path="/Notas" element={<Notas />} />

      {/* Turmas */}
      <Route path="/coordenacao/turmas" element={<Turmas />} />
      <Route path="/coordenacao/criarTurma" element={<CriarTurma />} />
      <Route path="/coordenacao/turmas/:turmaId" element={<Turmas />} />
      <Route path="/coordenacao/turmas/:turmaId/adicionar-aluno" element={<AdicionarAluno />} />
      <Route path="/coordenacao/turmas/:turmaId/editar" element={<EditarTurma />} />

      {/* Matrículas */}
      <Route path="/coordenacao/matriculas" element={<Matriculas />} />

      {/* Responsáveis (Descontinuado) */}
      <Route path="/buscar-responsavel" element={<ResponsaveisBusca />} />
      <Route path="/cadastrar-responsavel" element={<ResponsaveisCriacao />} />
      <Route path="/responsaveis/Data" element={<Datas />} />


      {/* Coordenação */}
      <Route path="/coordenacao/analise/:id" element={<Analise />} />
      <Route path="/coordenacao/avisos" element={<Avisos />} />
      <Route path="/coordenacao/calendario" element={<Calendario />} />

    </Routes>
  );
}
