import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import "../components/Layout.css";
import logo from "../assets/logo.png";
import avatar from "../assets/avatar.png";

// Ícones
import {
  FiUsers, FiFolder, FiBarChart, FiHelpCircle, FiLogOut, FiSettings, FiSearch, FiBell, FiMessageSquare, FiHome
} from 'react-icons/fi';
import { FaGraduationCap, FaUserTie, FaUserCog } from 'react-icons/fa';

export default function Layout({ children }) {
  const [userName, setUserName] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (paths) => {
    const currentPath = location.pathname;
    return paths.some(path => currentPath === path);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "usuarios", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserName(userSnap.data().nome);
          } else {
            setUserName("Usuário sem perfil");
          }
        } catch (error) {
          console.error("Erro ao buscar nome do usuário:", error);
          setUserName("Erro ao carregar");
        }
      } else {
        setUserName("Visitante");
        navigate("/");
      }
      setIsLoadingUser(false);
    });

    return () => unsubscribe();
  }, [navigate]);


  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const displayUserName = isLoadingUser ? "Carregando..." : userName;

  return (
    <div className="home-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Logo" />
        </div>

        <div className="sidebar-menu-section">
          <p className="sidebar-main-menu">MENU</p>

          <button
            className={`menu-btn ${isActive(["/home", "/"]) ? "active" : ""}`}
            onClick={() => navigate("/home")}
          >
            <FiHome size={20} />
            Início
          </button>

          <button
            className={`menu-btn ${isActive(["/buscar-aluno", "/aluno-perfil"]) ? "active" : ""}`}
            onClick={() => navigate("/buscar-aluno")}
          >
            <FiUsers size={20} />
            Alunos
          </button>

          <button
            className={`menu-btn ${isActive(["/cadastrar-aluno"]) ? "active" : ""}`}
            onClick={() => navigate("/cadastrar-aluno")}
          >
            <FiFolder size={20} />
            Cadastro
          </button>

          <button
            className={`menu-btn ${isActive(["/relatorios"]) ? "active" : ""}`}
            onClick={() => navigate("/relatorios")}
            disabled
          >
            <FiBarChart size={20} />
            Relatórios
          </button>

          <button
            className={`menu-btn ${isActive(["/turmas"]) ? "active" : ""}`}
            onClick={() => navigate("/turmas")}
            disabled
          >
            <FaGraduationCap size={20} />
            Turmas
          </button>

          <button
            className={`menu-btn ${isActive(["/professores"]) ? "active" : ""}`}
            onClick={() => navigate("/professores")}
            disabled
          >
            <FaUserTie size={20} />
            Professores
          </button>

          <button
            className={`menu-btn ${isActive(["/colaboradores"]) ? "active" : ""}`}
            onClick={() => navigate("/colaboradores")}
            disabled
          >
            <FaUserCog size={20} />
            Colaboradores
          </button>
        </div>

        <div className="sidebar-bottom">
          <p className="sidebar-other">OUTROS</p>

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