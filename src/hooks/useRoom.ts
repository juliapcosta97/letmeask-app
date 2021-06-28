import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
    id:string,
    author: {
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}


type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>;
}>

export function useRoom(roomId:string) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = database.ref(`/rooms/${roomId}`);

        //Toda vez que mudar algo na sala, executa de novo
        roomRef.on('value', room => {
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            //converte o retorno do firebase em array
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key,value]) => {
                 return {
                     id: key,
                     content: value.content,
                     author: value.author,
                     isHighlighted: value.isHighLighted,
                     isAnswered: value.isAnswered,
                     likeCount: Object.values(value.likes ?? {}).length,
                     likeId: Object.entries(value.likes ?? {}).find(([key,like]) => like.authorId === user?.id)?.[0],   
                 }
            })

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })

        return () => {
            roomRef.off('value');
        }

    //toda vez que mudar o codigo da sala, roda o useEffect de novo    
    }, [roomId, user?.id])

    return { title, questions }
}