import React, { useState } from "react";
import Layout from "../components/Layout";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import InputField from "../components/InputField.jsx";
import Button from "../components/Button.jsx";
import FileUploader from "../components/FileUploader.jsx";
import "../components/Components.css";

//Descontinuado depois de conversar com o professor

export default function ResponsaveisCriacao() {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    endereco: "",
    comprovante: null,
    rgCnh: null,
  });

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSalvar = async () => {
    const { nome, cpf, email, telefone, endereco, comprovante, rgCnh } = form;
    if (!nome || !cpf || !email || !telefone || !endereco)
      return alert("Preencha todos os campos obrigatórios");

    try {
      const base64Comprovante = comprovante ? await fileToBase64(comprovante) : "";
      const base64RgCnh = rgCnh ? await fileToBase64(rgCnh) : "";

      await addDoc(collection(db, "responsaveis"), {
        nome,
        cpf,
        email,
        telefone,
        endereco,
        comprovante: base64Comprovante,
        rgCnh: base64RgCnh,
        criadoEm: new Date(),
      });

      alert("Responsável cadastrado com sucesso!");
      setForm({
        nome: "",
        cpf: "",
        email: "",
        telefone: "",
        endereco: "",
        comprovante: null,
        rgCnh: null,
      });
    } catch (error) {
      alert("Erro ao cadastrar responsável: " + error.message);
    }
  };

  return (
    <Layout>
      <h1>Cadastrar Responsável</h1>

      <InputField label="Nome" value={form.nome} onChange={(v) => setForm({ ...form, nome: v })} />
      <InputField label="CPF" value={form.cpf} onChange={(v) => setForm({ ...form, cpf: v })} />
      <InputField label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
      <InputField label="Telefone" value={form.telefone} onChange={(v) => setForm({ ...form, telefone: v })} />
      <InputField label="Endereço" value={form.endereco} onChange={(v) => setForm({ ...form, endereco: v })} />

      <FileUploader
        label="Comprovante de residência (PDF)"
        onChange={(file) => setForm({ ...form, comprovante: file })}
      />
      <FileUploader
        label="RG ou CNH (PDF)"
        onChange={(file) => setForm({ ...form, rgCnh: file })}
      />

      <Button onClick={handleSalvar}>Salvar</Button>
    </Layout>
  );
}
