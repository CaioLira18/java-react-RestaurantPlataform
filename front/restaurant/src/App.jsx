import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Login from './pages/Login'
import Register from './pages/Register'
import Hamburgers from './pages/foodPages/Hamburgers'
import Cart from './pages/Cart'


function App() {

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/hamburguers" element={<Hamburgers />} />
        <Route path="/carrinho" element={<Cart />} />
      </Routes>
    </div>
  )
}

export default App
