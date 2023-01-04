import Cards from "./components/Cards";
import Navbar from "./components/Navbar";
import AddSong from "./components/AddSong";
import { Switch, Route } from 'react-router-dom'


function App() {
  return (
    <div className="app">
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Cards />
        </Route>
        <Route exact path="/addsong">
          <AddSong />
        </Route>
      </Switch>

    </div>
  );
}

export default App;
