import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/SideMenu';
import PrimPage from './pages/PrimPage';
import DijkstraPage from './pages/DijkstraPage';
import CRCPage from './pages/CRCPage';
import VectorDistanciaPage from './pages/VectorDistanciaPage';
import EstadoEnlacePage from './pages/EstadoEnlacePage';
import HammingPage from './pages/HammingPage';
import HomePage from './pages/HomePage'
import './App.css'

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
          <Routes>
            <Route path="/prim" element={<PrimPage />} />
            <Route path="/dijkstra" element={<DijkstraPage />} />
            <Route path="/vector-distancia" element={<VectorDistanciaPage />} />
            <Route path="/estado-enlace" element={<EstadoEnlacePage />} />
            <Route path="/hamming" element={<HammingPage />} />
            <Route path="/crc" element={<CRCPage />} />
            <Route path="/" element={<HomePage/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
