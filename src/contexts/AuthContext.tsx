import firebase from "firebase";
import { ReactNode, useEffect, useState } from "react";
import { createContext } from "react";
import { auth } from "../services/firebase";

//Objetos
type User = {
    id: string;
    name: string;
    avatar: string;
}
  
type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

//Propriedade
type AuthContextProviderProps = {
  children: ReactNode;
}

// Criando um contexto para a autenticacao
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps){

    //Estado para guardar os dados do usuario logado
    const [user, setUser] = useState<User>();

    
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {

        if(user) {
          const { displayName , photoURL, uid } = user
  
          if(!displayName || !photoURL) {
            throw new Error('Missing information from Google Account.');
          }
    
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          }) 
        }
      })
  
      return () => {
        unsubscribe();
      }
  
    }, []);
  

    async function signInWithGoogle() {
      //Chama o provider da Autenticacao com Google
      const provider = new firebase.auth.GoogleAuthProvider();
  
      //Abre a autenticacao com o Google em um pop na tela
      const result = await  auth.signInWithPopup(provider);
  
      //verifica se o usuario foi autenticado
      if(result.user) {
        const { displayName , photoURL, uid } = result.user
  
        //Exibe um erro se o objeto usuario nao tiver foto nem nome
        if(!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
        }
  
        //Salva os dados do usuario no estado
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    }

    //Exibe o componente de autenticacao
    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }} >
            {props.children}
        </AuthContext.Provider>
    ); 
}