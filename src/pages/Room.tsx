import { useEffect } from 'react';
import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
    id: string;
}

type Questions = {
    id:string,
    author: {
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
}>

export function Room(){
    const {user} = useAuth();
    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Questions[]>([]);
    const [title, setTitle] = useState('');

    const roomId = params.id;

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
                     isHighLighted: value.isHighLighted,
                     isAnswered: value.isAnswered,   
                 }
            })

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })

    //toda vez que mudar o codigo da sala, roda o useEffect de novo    
    }, [roomId]);


    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if(newQuestion.trim() === '') {
            return;
        }

        if(!user) {
            throw new Error('You must be logged in');
        }

        //objeto que representa a nova pergunta e sera salvo no banco de dados
        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighLighted: false,
            isAnswered: false
        };

        await database.ref(`/rooms/${roomId}/questions`).push(question);
    
        //limpa a caixa de texto depois de enviar a pergunta
        setNewQuestion('');
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                        placeholder="O que voce quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                   />

                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faca seu login</button>.</span>
                        ) }
                        <Button type="submit" disabled={!user}>
                            Enviar pergunta
                        </Button>
                    </div>
                </form>


            </main>
        </div>
    );
}