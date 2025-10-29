import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setSenha("");
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) return alert("Preencha todos os campos");

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/home");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          alert("Email não encontrado");
          break;
        case "auth/wrong-password":
          alert("Senha incorreta");
          break;
        case "auth/invalid-email":
          alert("Email inválido");
          break;
        case "auth/too-many-requests":
          alert("Muitas tentativas. Tente novamente mais tarde");
          break;
        default:
          alert("Erro ao fazer login: " + error.message);
      }
    }
  };

  const handleReset = async () => {
    if (!email) return alert("Digite seu email");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Email de recuperação enviado!");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          alert("Email não encontrado");
          break;
        case "auth/invalid-email":
          alert("Email inválido");
          break;
        default:
          alert("Erro ao enviar email: " + error.message);
      }
    }
  };

  const handleCadastrar = () => {
    navigate("/criar-conta");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img src={logo} alt="Logo" />
          <h2>Creche Estrela do Oriente</h2>
        </div>

        <input
          type="email"
          placeholder="username@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <div className="reset-link-container">
          <span className="reset-link" onClick={handleReset}>
            Esqueceu a senha?
          </span>
        </div>

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
