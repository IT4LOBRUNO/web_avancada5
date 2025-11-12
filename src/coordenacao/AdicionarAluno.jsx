import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import { collection, getDocs, doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import { useSearchParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import "../coordenacao/coordenacao.css";
import Button from "../components/Button.jsx";
import { useParams } from "react-router-dom";


export default function AdicionarAluno() {
    const [alunos, setAlunos] = useState([]);
    const [busca, setBusca] = useState("");
    const [loading, setLoading] = useState(true);
    const { turmaId } = useParams();


    useEffect(() => {
        const carregarAlunos = async () => {
            try {
                const snapshot = await getDocs(collection(db, "alunos"));
                const lista = snapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((aluno) => {
                        const s = (aluno.status || "")
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase();

                        return s === "aprovado";
                    });


                setAlunos(lista);
            } finally {
                setLoading(false);
            }
        };

        carregarAlunos();
    }, []);

    const alunosFiltrados = alunos.filter((a) =>
        (a.alunoData?.nome || "").toLowerCase().includes(busca.toLowerCase())
    );

    const adicionarAlunoNaTurma = async (alunoId) => {
        if (!turmaId) return;

        const turmaRef = doc(db, "turmas", turmaId);
        const alunoRef = doc(db, "alunos", alunoId);

        await updateDoc(turmaRef, {
            membros: arrayUnion(alunoId),
            totalMembros: increment(1)
        });

        await updateDoc(alunoRef, {
            status: "Matriculado"
        });

        setAlunos((prev) => prev.filter((a) => a.id !== alunoId));
    };


    if (loading) {
        return (
            <Layout>
                <Loading text="Carregando alunos aprovados..." />
            </Layout>
        );
    }

    const getStatusElement = (status) => {
        const normalized = (status || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        let className = "";
        if (normalized === "aprovado") className = "status-aprovado";
        else if (normalized === "matriculado") className = "status-matriculado";
        else if (normalized === "pre-matricula" || normalized === "pré-matricula")
            className = "status-pre-matricula";
        else if (normalized === "rematricula")
            className = "status-rematricula";
        else if (normalized === "cancelado")
            className = "status-cancelado";


        return <span className={className}>{status || "—"}</span>;
    };

    return (
        <Layout>
            <div className="alunos-page-container">
                <div className="page-header">
                    <div className="page-title-group">
                        <h1>Adicionar Aluno à Turma</h1>
                    </div>
                </div>

                <div className="busca-input-group" style={{ marginBottom: "15px" }}>
                    <input
                        type="text"
                        className="busca-input"
                        placeholder="Buscar aluno pelo nome..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>

                {alunosFiltrados.length === 0 ? (
                    <p className="busca-error">Nenhum aluno aprovado encontrado.</p>
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
                            {alunosFiltrados.map((aluno) => (
                                <tr key={aluno.id}>
                                    <td>{aluno.alunoData?.nome || "—"}</td>
                                    <td>{aluno.documentos?.responsavelNome || "—"}</td>
                                    <td>{getStatusElement(aluno.status)}</td>
                                    <td>
                                        <Button onClick={() => adicionarAlunoNaTurma(aluno.id)}>
                                            Adicionar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
}
