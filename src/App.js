import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.min.js";

import './App.css';
import './Components/Navbar'
import Navbar from './Components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
function App() {
  let mainPage;

  switch (window.location.pathname) {
    case "/":
      mainPage = <Home />
      break;
    case "/admin":
      mainPage = <Admin />
      break;
  }

  return (


  <div className="App">
    <Navbar/>
      <div>
        {mainPage}
      </div>
  </div>

    
  );
}

export default App;
