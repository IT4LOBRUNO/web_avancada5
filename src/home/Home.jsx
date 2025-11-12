import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function Home() {
  const [avisos, setAvisos] = useState([]);
  const [avisoAleatorio, setAvisoAleatorio] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAvisos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "avisos"));
        const listaAvisos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAvisos(listaAvisos);

        if (listaAvisos.length > 0) {
          const aviso = listaAvisos[Math.floor(Math.random() * listaAvisos.length)];
          setAvisoAleatorio(aviso);
          setShowModal(true);
        }
      } catch (error) {
        console.error("Erro ao buscar avisos:", error);
      }
    };

    fetchAvisos();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Layout>
      <div className="alunos-page-container">
        <div className="page-header page-header-turmas">
          <div className="page-title-group">
            <h1>Bem Vindo!</h1>
          </div>
        </div>
      </div>

      {showModal && avisoAleatorio && (
        <div
          onClick={handleCloseModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "15px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
            }}
          >
            <img
              src={avisoAleatorio.imagem}
              alt="Aviso"
              style={{
                height: "600px",
                width: "auto",
                objectFit: "contain",
                display: "block",
                borderRadius: "8px",
              }}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
