import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Login from './pages/Login'


function App() {

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
