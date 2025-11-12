import React, { useState } from "react";
import Layout from "../components/Layout";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import SearchBar from "../components/SearchBar";
import ResponsavelCard from "../components/ResponsavelCard";
import Button from "../components/Button";
import { downloadBase64File } from "../components/DownloadHelper";
import "../components/Components.css";

//Descontinuado depois de conversar com o professor

export default function ResponsaveisBusca() {
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState([]);

  const handleBuscar = async () => {
    if (!busca.trim()) return alert("Digite nome ou CPF");

    try {
      const qNome = query(
        collection(db, "responsaveis"),
        where("nome", ">=", busca),
        where("nome", "<=", busca + "\uf8ff")
      );
      const qCpf = query(
        collection(db, "responsaveis"),
        where("cpf", "==", busca)
      );

      const [snapshotNome, snapshotCpf] = await Promise.all([
        getDocs(qNome),
        getDocs(qCpf),
      ]);

      const lista = [
        ...snapshotNome.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...snapshotCpf.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ];

      //remove duplicados
      const unicos = Array.from(new Map(lista.map((r) => [r.id, r])).values());
      setResultados(unicos);
    } catch (error) {
      alert("Erro ao buscar responsáveis: " + error.message);
    }
  };

  return (
    <Layout>
      <h1>Buscar Responsável</h1>

      <SearchBar
        placeholder="Digite nome ou CPF"
        value={busca}
        onChange={setBusca}
      />

      <div style={{ marginTop: 12 }}>
        <Button onClick={handleBuscar}>Buscar</Button>
      </div>

      {resultados.length > 0 && (
        <div className="resultados-container" style={{ marginTop: 16 }}>
          {resultados.map((resp) => (
            <ResponsavelCard
              key={resp.id}
              responsavel={resp}
              onDownloadComprovante={() =>
                downloadBase64File(resp.comprovante, "comprovante.pdf")
              }
              onDownloadRgCnh={() =>
                downloadBase64File(resp.rgCnh, "rgcnh.pdf")
              }
            />
          ))}
        </div>
      )}
    </Layout>
  );
}
