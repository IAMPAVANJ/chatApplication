
import './App.css';
import {Route} from 'react-router-dom';
import Login from './Components/authentication/login/Login';
import Register from './Components/authentication/register/register';
import HomePage from './pages/Homepage/HomePage';
function App() {
  return (
    <div className="App">
      <Route path="/login" component={Login}/>
      <Route path="/" component={HomePage} exact/>
      <Route path="/register" component={Register} />
    </div>
  );
}

export default App;
