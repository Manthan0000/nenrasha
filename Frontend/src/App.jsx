import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import About from './pages/About.jsx';
import Navbar from './components/Navbar.jsx';
import TopBar from './components/TopBar.jsx';
function App() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </div>
  )
}
export default App