import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
        <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About/>}></Route>
        </Routes>
      </Router>
     </div>
  );
}

export default App;
