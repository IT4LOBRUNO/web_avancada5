import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { useInactivityTimer } from "./Inactivity";
import { useUserRole } from "./role";
import Loading from "./Loading";

import "../components/Layout.css";
import logo from "../assets/logo.png";
import avatar from "../assets/avatar.png";

import { FiHelpCircle, FiLogOut, FiSettings, FiBell, FiMessageSquare, FiFolderPlus } from 'react-icons/fi';
import { IoHomeOutline } from "react-icons/io5";
import { LuUserSearch } from "react-icons/lu";
import { LiaClipboardListSolid } from "react-icons/lia";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { BiBarChart } from "react-icons/bi";
import { PiGraduationCap } from "react-icons/pi";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  //Busca informações de Grupo
  const {
    userGroup,
    isLoadingRole,
    currentUserName: userName
  } = useUserRole();

  //Monitora o tempo de sessão
  const { formattedCountdown, countdownSeconds, clearTimers } = useInactivityTimer(navigate, location);

  const isActive = (paths) => {
    const currentPath = location.pathname;
    return paths.some(path => currentPath === path);
  };

  // Logout manual
  const handleLogout = async () => {
    clearTimers();
    await signOut(auth);
    navigate("/");
  };

  const displayUserName = isLoadingRole ? "Carregando..." : userName;

  //Grupo 0:Alunos
  const showNotas = userGroup === 0;

  //Grupo 1:Colaboradores
  const showCoordenacao = userGroup === 1 || userGroup === 2;

  //Grupo 2:Coordenador/Diretor
  const showMatriculas = userGroup === 2;

  if (isLoadingRole) {
    return <Loading />;
  }

  return (
    <div className="home-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Logo" />
        </div>

        {/*Tempo de Inatividade*/}
        <div className={`inactivity-timer ${countdownSeconds <= 300 ? 'warning' : ''}`}>
          <p>Sessão expira em: <strong>{formattedCountdown}</strong></p>
        </div>

        <div className="sidebar-menu-section">
          <p className="sidebar-main-menu">MENU</p>

          {/*Botão sempre visivel*/}
          <button
            className={`menu-btn ${isActive(["/home", "/"]) ? "active" : ""}`}
            onClick={() => navigate("/home")}
          >
            <IoHomeOutline size={20} />
            Início
          </button>

          {/*Botões(Grupo 1 e Grupo 2*/}
          {showCoordenacao && (
            <>
              <button
                className={`menu-btn ${isActive(["/buscar-aluno", "/aluno-perfil"]) ? "active" : ""}`}
                onClick={() => navigate("/buscar-aluno")}
              >
                <LuUserSearch size={20} />
                Alunos
              </button>

              <button
                className={`menu-btn ${isActive(["/cadastrar-aluno"]) ? "active" : ""}`}
                onClick={() => navigate("/cadastrar-aluno")}
              >
                <FiFolderPlus size={20} />
                Cadastro
              </button>

              <button
                className={`menu-btn ${isActive(["/relatorios"]) ? "active" : ""}`}
                onClick={() => navigate("/relatorios")}
                disabled
              >
                <BiBarChart size={20} />
                Relatórios
              </button>

              <button
                className={`menu-btn ${isActive(["/coordenacao/turmas"]) ? "active" : ""}`}
                onClick={() => navigate("/coordenacao/turmas")}
              >
                <PiGraduationCap size={20} />
                Turmas
              </button>

            </>
          )}

          {/*Botão de Matrícula(Grupo 2)*/}
          {showMatriculas && (
            <button
              className={`menu-btn ${isActive(["/coordenacao/matriculas"]) ? "active" : ""}`}
              onClick={() => navigate("/coordenacao/matriculas")}
            >
              <LiaClipboardListSolid size={20} />
              Matrículas
            </button>
          )}

          {/*Botão de Notas(Grupo 0)*/}
          {showNotas && (
            <button
              className={`menu-btn ${isActive(["/Notas"]) ? "active" : ""}`}
              onClick={() => navigate("/Notas")}
            >
              <HiOutlinePencilSquare size={20} />
              Notas
            </button>
          )}

        </div>

        <div className="sidebar-bottom">
          <p className="sidebar-other">OUTROS</p>

          {/*Botões sempre visiveis*/}
          <button
            className={`menu-btn ${isActive(["/suporte"]) ? "active" : ""}`}
            onClick={() => navigate("/suporte")}
            disabled
          >
            <FiHelpCircle size={20} />
            Suporte
          </button>

          <button
            className={`menu-btn ${isActive(["/configuracoes"]) ? "active" : ""}`}
            onClick={() => navigate("/configuracoes")}
            disabled
          >
            <FiSettings size={20} />
            Configurações
          </button>

          <button className="menu-btn-sair" onClick={handleLogout}>
            <FiLogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      <main className="home-content">
        <div className="top-header">
          <div className="header-left-section"></div>
          <div className="user-profile">
            <FiBell className="notifications" />
            <FiMessageSquare className="messages" />
            <div className="user-info">
              <img src={avatar} alt="Avatar" className="user-avatar" />
              <span>{displayUserName}</span>
            </div>
          </div>
        </div>

        <div>{children}</div>
      </main>
    </div>
  );
}
