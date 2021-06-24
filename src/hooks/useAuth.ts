import { useContext } from "react";
import { AuthContext } from '../contexts/AuthContext'

//Exporta o objeto de contexto
export function useAuth() {
    const value = useContext(AuthContext);

    return value;
}