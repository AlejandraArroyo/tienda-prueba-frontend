import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Churrascos from './pages/Churrascos';
import Combos from './pages/Combos';
import ListadoDulces from './pages/ListadoDulces';
import Inventario from './pages/Inventario';
import Ventas from './pages/Ventas';

function App() {
  return (
    <Router>
      <div className="App">
        <h1 className="text-center mt-4">Tienda de Dulces y Churrascos </h1>

       <nav className="mt-3 mb-4">
  <ul className="nav nav-pills justify-content-center">
    <li className="nav-item">
      <a className="nav-link" href="/">Dashboard</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="/churrascos">Platos de Churrasco</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="/dulces">Dulces Típicos</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="/combos">Combos</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="/inventario">Inventario</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="/ventas">Ventas</a>
    </li>
  </ul>
</nav>


        <Routes>
          <Route path="/" element={<Dashboard />}  />
          <Route path="/inventario" element={<Inventario />} />
           <Route path="/combos" element={<Combos />} />
          <Route path="/dulces" element={<ListadoDulces />} />
          <Route path="/churrascos" element={<Churrascos />} />
           <Route path="/ventas" element={<Ventas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
