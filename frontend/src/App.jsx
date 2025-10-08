import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home/index'
import Simulacao1 from './pages/implatacao/index'
import Simulacao2 from './pages/substituicao/index'
import './styles/globals.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulação-implantação-de-pomar" element={<Simulacao1 />} />
        <Route path="/simulação-substituição-de-copa" element={<Simulacao2 />} />
      </Routes>
    </Router>
  )
}

export default App