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

  const { userGroup, isLoadingRole, currentUserName: userName } = useUserRole();
  const { formattedCountdown, countdownSeconds, clearTimers } = useInactivityTimer(navigate, location);

  const isActive = (paths) => paths.some(path => location.pathname === path);

  const handleLogout = async () => {
    clearTimers();
    await signOut(auth);
    navigate("/");
  };

  const displayUserName = isLoadingRole ? "Carregando..." : userName;

  // Botões principais do menu
  const menuButtons = [
    { label: "Início", icon: <IoHomeOutline size={20} />, path: "/home", groups: [0, 1, 2] },
    { label: "Alunos", icon: <LuUserSearch size={20} />, path: "/buscar-aluno", groups: [1, 2] },
    { label: "Cadastro", icon: <FiFolderPlus size={20} />, path: "/cadastrar-aluno", groups: [1, 2] },
    { label: "Relatórios", icon: <BiBarChart size={20} />, path: "/relatorios", groups: [1, 2], disabled: true },
    { label: "Turmas", icon: <PiGraduationCap size={20} />, path: "/coordenacao/turmas", groups: [1, 2] },
    { label: "Matrículas", icon: <LiaClipboardListSolid size={20} />, path: "/coordenacao/matriculas", groups: [2] },
    { label: "Notas", icon: <HiOutlinePencilSquare size={20} />, path: "/Notas", groups: [0] },
  ];

  const otherButtons = [
    { label: "Suporte", icon: <FiHelpCircle size={20} />, path: "/suporte", disabled: true },
    { label: "Configurações", icon: <FiSettings size={20} />, path: "/configuracoes", disabled: true },
  ];

  return (
    <div className="home-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Logo" />
        </div>

        <div className={`inactivity-timer ${countdownSeconds <= 300 ? 'warning' : ''}`}>
          <p>Sessão expira em: <strong>{formattedCountdown}</strong></p>
        </div>

        <div className="sidebar-menu-section">
          <p className="sidebar-main-menu">MENU</p>

          {/* Renderiza apenas quando userGroup estiver definido */}
          {!isLoadingRole && userGroup != null && menuButtons.map((btn, idx) => {
            if (!btn.groups.includes(userGroup)) return null; // não aparece se não é do grupo
            return (
              <button
                key={idx}
                className={`menu-btn ${isActive([btn.path]) ? "active" : ""}`}
                onClick={() => !btn.disabled && navigate(btn.path)}
                disabled={btn.disabled}
              >
                {btn.icon} {btn.label}
              </button>
            );
          })}
        </div>

        <div className="sidebar-bottom">
          <p className="sidebar-other">OUTROS</p>

          {otherButtons.map((btn, idx) => (
            <button
              key={idx}
              className={`menu-btn ${isActive([btn.path]) ? "active" : ""}`}
              onClick={() => !btn.disabled && navigate(btn.path)}
              disabled={btn.disabled}
            >
              {btn.icon} {btn.label}
            </button>
          ))}

          <button className="menu-btn-sair" onClick={handleLogout}>
            <FiLogOut size={20} /> Sair
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

        <div className="page-content">
          {isLoadingRole ? <Loading text="Carregando..." /> : children}
        </div>
      </main>
    </div>
  );
}
