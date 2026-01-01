import React from 'react'
import './App.css'
import AppPage from './page/AppPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './page/LandingPage';


const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/ruzzle" element={<AppPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
