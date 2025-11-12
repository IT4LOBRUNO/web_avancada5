import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { collection, doc, getDoc, getDocs, updateDoc, arrayRemove, increment } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import "../coordenacao/coordenacao.css";
import Button from "../components/Button.jsx";
import Modal from "../components/Modal.jsx";

export default function EditarTurma() {
    const { turmaId } = useParams();
    const navigate = useNavigate();

    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nomeTurma, setNomeTurma] = useState("");
    const [confirmModal, setConfirmModal] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                if (!turmaId) return;

                const turmaRef = doc(db, "turmas", turmaId);
                const turmaSnap = await getDoc(turmaRef);

                if (!turmaSnap.exists()) {
                    console.error("Turma não encontrada.");
                    setLoading(false);
                    return;
                }

                setNomeTurma(turmaSnap.data().nome || "");
                const membros = turmaSnap.data().membros || [];

                if (membros.length === 0) {
                    setAlunos([]);
                    setLoading(false);
                    return;
                }

                const alunosSnapshot = await getDocs(collection(db, "alunos"));
                const lista = alunosSnapshot.docs
                    .filter((doc) => membros.includes(doc.id))
                    .map((doc) => ({ id: doc.id, ...doc.data() }));

                setAlunos(lista);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
    }, [turmaId]);

    const salvarNomeTurma = async () => {
        if (!nomeTurma.trim()) return;

        try {
            await updateDoc(doc(db, "turmas", turmaId), {
                nome: nomeTurma.trim(),
            });
            alert("Nome da turma salvo com sucesso!");
            navigate("/turmas");
        } catch (error) {
            console.error("Erro ao salvar o nome da turma:", error);
            alert("Ocorreu um erro ao salvar o nome da turma.");
        }
    };

    const removerAluno = async (alunoId) => {
        const turmaRef = doc(db, "turmas", turmaId);
        const alunoRef = doc(db, "alunos", alunoId);

        await updateDoc(turmaRef, {
            membros: arrayRemove(alunoId),
            totalMembros: increment(-1),
        });

        await updateDoc(alunoRef, {
            status: "Rematricula",
        });

        setAlunos((prev) => prev.filter((a) => a.id !== alunoId));
    };

    if (loading) {
        return (
            <Layout>
                <Loading text="Carregando dados da turma..." />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="alunos-page-container">
                <div className="page-header">
                    <div className="page-title-group">
                        <h1>Editar Turma</h1>
                    </div>
                    <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                        <input
                            value={nomeTurma}
                            onChange={(e) => setNomeTurma(e.target.value)}
                            className="busca-input"
                            placeholder="Nome da Turma"
                            style={{ maxWidth: "350px" }}
                        />
                        <Button onClick={salvarNomeTurma}>Salvar Nome</Button>
                    </div>
                </div>

                {alunos.length === 0 ? (
                    <p className="busca-error">Nenhum aluno matriculado nesta turma.</p>
                ) : (
                    <table className="tabela-padrao">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Responsável</th>
                                <th>Status</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alunos.map((aluno) => (
                                <tr key={aluno.id}>
                                    <td>{aluno.alunoData?.nome || "—"}</td>
                                    <td>{aluno.documentos?.responsavelNome || "—"}</td>
                                    <td>{aluno.status || "—"}</td>
                                    <td>
                                        <Button
                                            onClick={() => {
                                                setAlunoSelecionado(aluno);
                                                setConfirmModal(true);
                                            }}
                                        >
                                            Remover da Turma
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {confirmModal && alunoSelecionado && (
                <Modal
                    title="Remover aluno da turma?"
                    message={`Tem certeza que deseja remover <strong>${alunoSelecionado?.alunoData?.nome}</strong> desta turma?`}
                    onConfirm={() => {
                        removerAluno(alunoSelecionado.id);
                        setConfirmModal(false);
                    }}
                    onCancel={() => setConfirmModal(false)}
                    confirmText="Remover"
                    cancelText="Cancelar"
                />
            )}
        </Layout>
    );
}
