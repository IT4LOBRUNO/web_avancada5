import React, { useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import "../App.css";
import logo from "../assets/logo.png";

export default function CriarConta() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const navigate = useNavigate();

  const handleCriarConta = async () => {
    if (!nome || !email || !senha || !confirmaSenha) {
      return alert("Preencha todos os campos");
    }
    if (senha !== confirmaSenha) {
      return alert("As senhas não conferem");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Salva o nome no Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome,
        email: email,
      });

      // Desloga o usuário após salvar os dados
      await signOut(auth);

      alert("Conta criada com sucesso! Faça login.");
      navigate("/"); // redireciona para Login
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("Email já cadastrado");
          break;
        case "auth/invalid-email":
          alert("Email inválido");
          break;
        case "auth/weak-password":
          alert("Senha muito fraca (mínimo 6 caracteres)");
          break;
        default:
          alert("Erro ao criar conta: " + error.message);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img src={logo} alt="Logo" />
          <h1>Creche Estrela do Oriente</h1>
        </div>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmação de Senha"
          value={confirmaSenha}
          onChange={(e) => setConfirmaSenha(e.target.value)}
        />

        <button onClick={handleCriarConta}>Criar Conta</button>
        <button onClick={() => navigate("/")}>Voltar ao Login</button>
      </div>
    </div>
  );
}
