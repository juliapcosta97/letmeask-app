import '../styles/auth.scss';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg'
import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();

    //funcao para redirecionar para a pagina de criar sala
    async function handleCreateRoom() {

        //Verifica se o usuario esta autenticado
        if(!user) {
            //realiza a autenticacao via servico do Google (Firebase)
            await signInWithGoogle();
        }

        //redireciona para a pagina de criar sala
        history.push('/rooms/new');     
    }

    const [roomCode, setRoomCode] = useState('');

    async function handleJoinRoom(event:FormEvent) {
        //Nao atualizar a pagina no cloque do botao
        event.preventDefault();

        //Nao deixar o usuario colocar espacos em branco na caixa de texto
        if(roomCode.trim() === ''){
            return;
        }

        //Buscando dado do firebase por chave
        const roomRef = await database.ref(`/rooms/${roomCode}`).get();

        if(!roomRef.exists()) {
            alert('Room does not exists.');
            return;
        }

        if(roomRef.val().endedAt) {
            alert('Room already closed.');
            return;
        }

        history.push(`/rooms/${roomCode}`);
    }

    return (
        <div id="page-auth">
          <aside>
            <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
            <strong>Crie salas de Q&amp;A ao-vivo</strong>
            <p>Tire as dúvidas da sua audiência em tempo-real</p>
          </aside>
          <main>
            <div className="main-content">
              <img src={logoImg} alt="Letmeask" />
              <button onClick={handleCreateRoom} className="create-room">
                <img src={googleIconImg} alt="Logo do Google" />
                Crie sua sala com o Google
              </button>
              <div className="separator">ou entre em uma sala</div>
              <form onSubmit={handleJoinRoom}>
                <input 
                  type="text"
                  placeholder="Digite o código da sala"
                  onChange={event => setRoomCode(event.target.value)}
                  value={roomCode}
                />
                <Button type="submit">
                  Entrar na sala
                </Button>
              </form>
            </div>
          </main>
        </div>
      )
}