import { useEffect, useState } from 'react';

export default function Ventas() {
  const [combos, setCombos] = useState([]);
  const [churrascos, setChurrascos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('https://localhost:7125/api/dashboard/getCombos')
      .then(res => res.json())
      .then(setCombos);

    fetch('https://localhost:7125/api/churrascos') 
      .then(res => res.json())
      .then(setChurrascos);
  }, []);
const describirChurrasco = (c) => {
  const guarnicionesTexto = c.guarniciones
    ?.map(g => `Porción ${g.porcion}: ${g.guarniciones.join(', ')}`)
    .join(" | ") || "Sin guarniciones";

  return `Carne: ${c.tipoCarne} - Porciones: ${c.porciones} - Extras: ${c.porcionesExtra} - Término: ${c.terminoCoccion} - ${guarnicionesTexto}`;
};
  const agregarItem = (item, tipo) => {
    const existente = seleccionados.find(i => i.productoId === item.id && i.tipo === tipo);
    if (existente) {
      existente.cantidad += 1;
      setSeleccionados([...seleccionados]);
    } else {
      setSeleccionados([...seleccionados, {
        productoId: item.id,
        tipo: tipo,
        cantidad: 1,
        nombre: item.nombre,
        precio: item.precio || 40
      }]);
    }

    setTotal(prev => prev + (item.precio || 40));
  };

  const realizarVenta = () => {
    const dto = {
      total: total,
      combos: seleccionados.filter(i => i.tipo === 'combo').map(i => ({
        comboId: i.productoId,
        cantidad: i.cantidad
      })),
      churrascos: seleccionados.filter(i => i.tipo === 'churrasco').map(i => ({
        churrascoId: i.productoId,
        cantidad: i.cantidad
      }))
    };



    fetch('https://localhost:7125/api/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    })
      .then(res => {
        if (!res.ok) return res.json().then(err => { throw new Error(err.message); });
        return res.json();
      })
      .then(data => {
        alert("Venta registrada con éxito.");
        setSeleccionados([]);
        setTotal(0);
      })
      .catch(err => alert(`Error: ${err.message}`));
  };

  return (
    <div className="container mt-4">
      <h3>Simular Venta</h3>

      <h4>Combos</h4>
      <div className="row">
        {combos.map(c => (
          <div className="col-md-4 mb-3" key={`combo-${c.id}`}>
            <div className="card h-100">
              <div className="card-body">
                <h5>{c.nombre}</h5>
                <p>{c.descripcion}</p>
                <p><strong>Q{c.precio.toFixed(2)}</strong></p>
                <button className="btn btn-success" onClick={() => agregarItem(c, 'combo')}>Agregar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

 <h4>Platos individuales</h4>
<div className="row">
  {churrascos.map(c => (
    <div className="col-md-4 mb-3" key={`churrasco-${c.id}`}>
      <div className="card h-100">
        <div className="card-body">
          <h5>Plato #{c.id}</h5>
          <p>{describirChurrasco(c)}</p>
          <p><strong>Q40.00</strong></p>
          <button className="btn btn-primary" onClick={() => agregarItem(c, 'churrasco')}>Agregar</button>
        </div>
      </div>
    </div>
  ))}
</div>

      <h4>Resumen</h4>
      <ul className="list-group">
        {seleccionados.map((s, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
            {s.nombre} ({s.tipo}) x {s.cantidad}
            <span>Q{(s.precio * s.cantidad).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <h5>Total: Q{total.toFixed(2)}</h5>
        <button className="btn btn-warning" onClick={realizarVenta}>Realizar venta</button>
      </div>
    </div>
  );
}
