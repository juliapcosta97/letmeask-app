import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import '../styles/auth.scss';

import { Button } from '../components/Button';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormEvent } from 'react';
import { useState } from 'react';
import { database } from '../services/firebase';

export function NewRoom() {
    const { user } = useAuth();
    const history = useHistory();

    //estado para salvar o nome da nova sala 
    const [newRoom, setNewRoom] = useState('');

    //funcao p/ evento do formulario criar sala
    async function handleCreateRoom(event:FormEvent) {

        //Nao atualizar a pagina no cloque do botao
        event.preventDefault();

        //Nao deixar o usuario colocar espacos em branco na caixa de texto
        if(newRoom.trim() === ''){
            return;
        }

        //Criando referencia pra um registro do banco de dados
        const roomRef = database.ref('rooms');

        //Colocando a informacao dentro do registro de rooms
        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id
        })

        history.push(`/rooms/${firebaseRoom.key}`);
    }

    return(
        <div id="page-auth">
           <aside>
               <img src={illustrationImg} alt="Ilustracao simbolizando perguntas e respostas" />
               <strong>Crie salas de Q&amp;A ao-vivo</strong>
               <p>Tire as dúvidas da sua audiencia em tempo-real</p>
           </aside> 

           <main>
               <div className="main-content">
                   <img src={logoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button>
                            Criar sala
                        </Button>
                    </form>

                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui </Link>
                    </p>
               </div>
           </main>    
        </div>
    ) 
}