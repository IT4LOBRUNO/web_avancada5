import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import Button from "../components/Button.jsx";
import "./Coordenacao.css";

export default function AdicionarAluno() {
    const { id } = useParams(); // ID da turma
    const navigate = useNavigate();
    const [alunos, setAlunos] = useState([]);
    const [turma, setTurma] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const alunosSnapshot = await getDocs(collection(db, "alunos"));
                const listaAlunos = alunosSnapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    .filter((aluno) => aluno.alunoData?.status === "Aprovado")
                    .map((aluno) => ({
                        id: aluno.id,
                        nome: aluno.alunoData?.nome || "Aluno sem nome",
                        foto: aluno.alunoData?.foto || null,
                        status: aluno.alunoData?.status,
                    }));

                setAlunos(listaAlunos);


                const turmaSnap = await getDocs(collection(db, "turmas"));
                const turmaData = turmaSnap.docs
                    .map((d) => ({ id: d.id, ...d.data() }))
                    .find((t) => t.id === id);

                setTurma(turmaData || null);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, [id]);

    const adicionarAlunoNaTurma = async (aluno) => {
        try {
            const turmaRef = doc(db, "turmas", id);

            await updateDoc(turmaRef, {
                membros: [...(turma.membros || []), aluno],
                totalMembros: (turma.totalMembros || 0) + 1,
            });

            alert(`✅ Aluno ${aluno.nome} foi adicionado à turma!`);
            navigate(`/coordenacao/turmas`);
        } catch (error) {
            console.error("Erro ao adicionar aluno:", error);
            alert("❌ Erro ao adicionar aluno.");
        }
    };

    if (loading) return <Layout><Loading text="Carregando alunos..." /></Layout>;

    return (
        <Layout>
            <div className="alunos-page-container">
                <div className="page-header">
                    <h1>Adicionar Aluno à Turma</h1>
                    <Button variant="cinza" onClick={() => navigate(-1)}>
                        Voltar
                    </Button>
                </div>

                {alunos.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#555" }}>
                        Nenhum aluno encontrado.
                    </p>
                ) : (
                    <ul className="turma-card-members-list">
                        {alunos.map((aluno) => (
                            <li
                                key={aluno.id}
                                className="turma-card-member-item"
                                onClick={() => adicionarAlunoNaTurma(aluno)}
                            >
                                <span>{aluno.nome}</span>
                                <span className="member-detail-arrow">+</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Layout>
    );
}
