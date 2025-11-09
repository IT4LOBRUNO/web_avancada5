import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
* Salva a foto de perfil de um aluno no Firestore.
* @param {string} alunoId
* @param {File} file
* @returns {Promise<string>}
*/
export async function salvarFotoPerfil(alunoId, file) {
  if (!file) throw new Error("Nenhum arquivo fornecido");
  if (!file.type.startsWith("image/")) throw new Error("Arquivo não é uma imagem");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result;

      try {
        const docRef = doc(db, "alunos", alunoId);
        await updateDoc(docRef, { fotoPerfil: base64String });
        resolve(base64String);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
