import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Churrascos from './pages/Churrascos';
import Combos from './pages/Combos';
import ListadoDulces from './pages/ListadoDulces';
import Inventario from './pages/Inventario';
import Ventas from './pages/Ventas';
import Proveedores  from './pages/Proveedores';
import TiempoPreparacion  from './pages/TiempoPreparacion';
<script
  crossOrigin="anonymous"
  src="//unpkg.com/react-scan/dist/auto.global.js"
></script>
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

    <li className="nav-item">
      <a className="nav-link" href="/proveedores">Proveedores</a>
    </li>
     <li className="nav-item">
      <a className="nav-link" href="/preparacion">Tiempo Preparacion</a>
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
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/preparacion" element={<TiempoPreparacion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
