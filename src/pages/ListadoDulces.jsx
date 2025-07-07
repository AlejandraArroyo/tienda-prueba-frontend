import React, { useEffect, useState } from 'react';

function ListadoDulces() {
  const [dulces, setDulces] = useState([]);
  const [seleccion, setSeleccion] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://localhost:7125/api/dulces')
      .then(res => res.json())
      .then(data => setDulces(data))
      .catch(err => setError('No se pudieron cargar los dulces'));
  }, []);

  const handleTipoCambio = (id, tipo) => {
    setSeleccion(prev => ({
      ...prev,
      [id]: { tipo, cantidad: tipo === 'caja' ? 6 : 1 }
    }));
  };

  const handleCantidadCaja = (id, cantidad) => {
    setSeleccion(prev => ({
      ...prev,
      [id]: { ...prev[id], cantidad: parseInt(cantidad) }
    }));
  };

  const agregar = (id) => {
    const item = seleccion[id];
    const detalle = item?.tipo === 'unidad' ? '1 unidad' : `${item?.cantidad} unidades en caja`;
    alert(`Agregado: ${dulces.find(d => d.id === id)?.nombre} — ${detalle}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Dulces Típicos Guatemaltecos</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {dulces.map((dulce) => (
          <div key={dulce.id} className="col">
            <div className="card h-100 shadow-sm border-0" style={{ backgroundColor: '#fff8f0' }}>
              <div className="card-body">
                <h5 className="card-title text-primary">{dulce.nombre}</h5>
                <p className="card-text">{dulce.descripcion || 'Sin descripción'}</p>

                <div className="mb-2">
                  <label className="form-label">Tipo de compra</label>
                  <select
                    className="form-select"
                    value={seleccion[dulce.id]?.tipo || 'unidad'}
                    onChange={(e) => handleTipoCambio(dulce.id, e.target.value)}
                  >
                    <option value="unidad">Por unidad</option>
                    <option value="caja">Caja</option>
                  </select>
                </div>

                {seleccion[dulce.id]?.tipo === 'caja' && (
                  <div className="mb-2">
                    <label className="form-label">Tamaño de caja</label>
                    <select
                      className="form-select"
                      value={seleccion[dulce.id]?.cantidad || 6}
                      onChange={(e) => handleCantidadCaja(dulce.id, e.target.value)}
                    >
                      <option value={6}>6 unidades</option>
                      <option value={12}>12 unidades</option>
                      <option value={24}>24 unidades</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="card-footer bg-transparent border-0 text-end">
                <button className="btn btn-outline-primary btn-sm" onClick={() => agregar(dulce.id)}>
                  Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListadoDulces;
