import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { IoTrashOutline } from "react-icons/io5";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "./Coordenacao.css";

export default function Avisos() {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarAvisos();
  }, []);

  const buscarAvisos = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "avisos"));
      const lista = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAvisos(lista);
    } catch (error) {
      console.error("Erro ao buscar avisos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarAviso = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      try {
        await addDoc(collection(db, "avisos"), {
          imagem: base64String,
          criadoEm: new Date().toISOString(),
        });
        await buscarAvisos();
      } catch (error) {
        console.error("Erro ao adicionar aviso:", error);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removerAviso = async (id) => {
    try {
      await deleteDoc(doc(db, "avisos", id));
      setAvisos((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Erro ao remover aviso:", error);
    }
  };

  return (
    <Layout>
      <div className="alunos-page-container">
        <div className="page-header page-header-turmas">
          <div className="page-title-group">
            <h1>Avisos</h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label htmlFor="inputAviso" className="botao-adicionar-aviso">
              + Adicionar aviso
            </label>
            <input
              id="inputAviso"
              type="file"
              accept="image/*"
              onChange={handleAdicionarAviso}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {loading ? (
          <p className="busca-error">Carregando avisos...</p>
        ) : avisos.length === 0 ? (
          <p className="busca-error">Nenhum aviso encontrado.</p>
        ) : (
          <div className="avisos-grid">
            {avisos.map((aviso) => (
              <div key={aviso.id} className="aviso-card">
                <div className="aviso-thumb-wrap">
                  <img className="aviso-thumb" src={aviso.imagem} alt="Aviso" />
                </div>
                <div className="aviso-actions">
                  <button
                    className="icon-btn"
                    title="Remover aviso"
                    onClick={() => removerAviso(aviso.id)}
                  >
                    <IoTrashOutline size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
