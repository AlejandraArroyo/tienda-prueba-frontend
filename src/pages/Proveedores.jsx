import React, { useEffect, useState } from 'react';

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', descripcion: '', categoria: 'carne' });

  const fetchProveedores = async () => {
    const res = await fetch('https://localhost:7125/api/proveedores');
    const data = await res.json();
    setProveedores(data);
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleGuardar = async () => {
    await fetch('https://localhost:7125/api/proveedores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo),
    });
    setNuevo({ nombre: '', descripcion: '', categoria: 'carne' });
    fetchProveedores();
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Proveedores</h2>

      <div className="mb-3">
        <input className="form-control mb-2" placeholder="Nombre" value={nuevo.nombre}
          onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} />
        <textarea className="form-control mb-2" placeholder="Descripción" value={nuevo.descripcion}
          onChange={e => setNuevo({ ...nuevo, descripcion: e.target.value })}></textarea>
        <select className="form-select mb-2" value={nuevo.categoria}
          onChange={e => setNuevo({ ...nuevo, categoria: e.target.value })}>
          <option value="carne">Carne</option>
          <option value="dulce">Dulce</option>
        </select>
        <button className="btn btn-primary" onClick={handleGuardar}>Guardar</button>
      </div>

      <h4>Listado de Proveedores</h4>
      <ul className="list-group">
        {proveedores.map(p => (
          <li className="list-group-item" key={p.id}>
            <strong>{p.nombre}</strong> - {p.descripcion} ({p.categoria})
          </li>
        ))}
      </ul>
    </div>
  );
}
