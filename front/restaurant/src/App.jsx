import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './components/Home'
import { Route, Routes } from 'react-router-dom'


function App() {

  return (
    <div>
       <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
