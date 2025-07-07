import React, { useEffect, useState } from 'react';

function Inventario() {
  const [carnes, setCarnes] = useState([]);
  const [guarniciones, setGuarniciones] = useState([]);
  const [dulcesUnidad, setDulcesUnidad] = useState([]);
  const [dulcesCaja, setDulcesCaja] = useState([]);
  const [empaques, setEmpaques] = useState([]);
  const [combustibles, setCombustibles] = useState([]);

  const fetchData = async () => {
    const endpoints = [
      ['carnes', setCarnes],
      ['ingredientes', setGuarniciones],
      ['dulcesunidad', setDulcesUnidad],
      ['dulcescaja', setDulcesCaja],
      ['empaques', setEmpaques],
      ['combustible', setCombustibles]
    ];




   for (const [endpoint, setter] of endpoints) {
    try {
      const res = await fetch(`https://localhost:7125/api/inventario/${endpoint}`);
      if (!res.ok) throw new Error(`Error al cargar ${endpoint}: ${res.status}`);
      const data = await res.json();
      setter(data);
    } catch (error) {
      console.error(`Fallo al cargar ${endpoint}:`, error);
    }
  }
};
  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (tipo, item) => {
    const res = await fetch(`https://localhost:7125/api/${tipo}/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (res.ok) {
      alert('Actualizado correctamente');
      fetchData();
    } else {
      alert('Error al actualizar');
    }
  };

  const renderEditableTable = (titulo, tipo, data, campos) => (
    <div className="mb-4">
      <h4>{titulo}</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            {campos.map((c, i) => <th key={i}>{c.label}</th>)}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              {campos.map((c, j) => (
               <td key={j}>
  {c.customRender ? (
    c.customRender(item)
  ) : (
    <input
      className="form-control"
      value={item[c.key]}
      onChange={(e) => {
        const newData = [...data];
        newData[i][c.key] = c.type === 'number' ? parseFloat(e.target.value) : e.target.value;
        c.setter(newData);
      }}
    />
  )}
</td>

              ))}
              <td>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleEdit(tipo, item)}>
                  Guardar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Inventario </h2>
      {renderEditableTable('Carnes por libra', 'carnes', carnes, [
        { key: 'nombre', label: 'Tipo de Carne', type: 'text', setter: setCarnes },
        { key: 'stockLibras', label: 'Stock (lbs)', type: 'number', setter: setCarnes },
        { key: 'precioLibra', label: 'Precio/lb', type: 'number', setter: setCarnes }
        
      ])}
      
      {renderEditableTable('Ingredientes para Guarniciones', 'ingredientes', guarniciones, [
        { key: 'nombre', label: 'Nombre', type: 'text', setter: setGuarniciones },
        { key: 'stockLibras', label: 'Stock (lbs)', type: 'number', setter: setGuarniciones },
        { key: 'precioLibra', label: 'Precio/lb', type: 'number', setter: setGuarniciones }
      ])}

    {renderEditableTable('Dulces por unidad', 'dulcesunidad', dulcesUnidad, [
 
  { key: 'dulce.nombre', label: 'Nombre', customRender: (item) => item.dulce?.nombre || '' },
  { key: 'stockUnidades', label: 'Stock (unid)', type: 'number', setter: setDulcesUnidad },
  { key: 'precioUnitario', label: 'Precio/unit', type: 'number', setter: setDulcesUnidad }
])}



      {renderEditableTable('Dulces por caja', 'dulcescaja', dulcesCaja, [
        { key: 'dulce.nombre', label: 'Caja', customRender: (item) => `Caja - ${item.id}` },
        { key: 'dulce.nombre', label: 'Dulce', customRender: (item) => item.dulce?.nombre || '' },
        { key: 'cantidadUnidades', label: 'Unidades/caja', type: 'number', setter: setDulcesCaja },
        { key: 'stockCajas', label: 'Stock (cajas)', type: 'number', setter: setDulcesCaja },
        { key: 'precioCaja', label: 'Precio/caja', type: 'number', setter: setDulcesCaja }
      ])}

      {renderEditableTable('Cajas y Empaques', 'empaques', empaques, [
        { key: 'tipo', label: 'Tipo', type: 'text', setter: setEmpaques },
        { key: 'capacidadUnidades', label: 'Capacidad', type: 'number', setter: setEmpaques },
        { key: 'stock', label: 'Stock', type: 'number', setter: setEmpaques },
        { key: 'precio', label: 'Precio', type: 'number', setter: setEmpaques }
      ])}

      {renderEditableTable('Combustible (Carbón y Leña)', 'combustible', combustibles, [
        { key: 'tipo', label: 'Tipo', type: 'text', setter: setCombustibles },
        { key: 'descripcion', label: 'Descripción', type: 'text', setter: setCombustibles },
        { key: 'stockLibras', label: 'Stock (lbs)', type: 'number', setter: setCombustibles },
        { key: 'precioLibra', label: 'Precio/lb', type: 'number', setter: setCombustibles }
      ])}

    </div>
  );
}

export default Inventario;
