import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/**
 * * @returns {{
 * userGroup: number, 
 * isLoadingRole: boolean, 
 * currentUserName: string,
 * userId: string | null
 * }}
 */
export const useUserRole = () => {
  const [userGroup, setUserGroup] = useState(0); 
  const [isLoadingRole, setIsLoadingRole] = useState(true);
  const [currentUserName, setCurrentUserName] = useState("Carregando...");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const userRef = doc(db, "usuarios", user.uid);
          const userSnap = await getDoc(userRef);

          //Se não houver 'grupo' é tratado como 0
          if (userSnap.exists()) {
            const data = userSnap.data();
            setCurrentUserName(data.nome);
            const grupo = typeof data.grupo === 'number' ? data.grupo : 0;
            setUserGroup(grupo);
          } else {
            setCurrentUserName("Usuário sem perfil");
            setUserGroup(0);
          }
        } catch (error) {
          console.error("Erro ao buscar grupo do usuário:", error);
          setCurrentUserName("Erro ao carregar");
          //Erro restringe o acesso ao grupo 0
          setUserGroup(0); 
        } finally {
          setIsLoadingRole(false);
        }
      } else {
        //Usuário deslogado
        setUserId(null);
        setCurrentUserName("Visitante");
        setUserGroup(0);
        setIsLoadingRole(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { userGroup, isLoadingRole, currentUserName, userId };
};

