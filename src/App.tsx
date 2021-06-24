
import { BrowserRouter, Route, Switch } from "react-router-dom"

import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { AuthContextProvider } from './contexts/AuthContext';
import { Room } from "./pages/Room";

function App() {
  //Swtch serve para diferenciar as rotas de rooms
  return (
    <BrowserRouter >
      <Switch>
        <AuthContextProvider>
            <Route path="/" exact component={Home}/>
            <Route path="/rooms/new" exact component={NewRoom}/>
            <Route path="/rooms/:id" component={Room}/>
        </AuthContextProvider>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
