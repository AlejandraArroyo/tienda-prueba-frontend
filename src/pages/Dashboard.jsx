import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [combos, setCombos] = useState([]);
  const [inventarioCarne, setInventarioCarne] = useState([]);
  const [topDulces, setTopDulces] = useState([]);
  const [carneMasUsada, setCarneMasUsada] = useState(null);
  const [totalChurrascos, setTotalChurrascos] = useState(0);

  useEffect(() => {
    fetch('https://localhost:7125/api/dashboard/getCombos')
      .then(res => res.json())
      .then(setCombos);

    fetch('https://localhost:7125/api/dashboard/carnes')
      .then(res => res.json())
      .then(setInventarioCarne);

    fetch('https://localhost:7125/api/dashboard/dulcesunidad')
      .then(res => res.json())
      .then(setTopDulces);

    fetch('https://localhost:7125/api/dashboard/total-churrascos')
      .then(res => res.json())
      .then(setTotalChurrascos);

    fetch('https://localhost:7125/api/dashboard/carne-mas-usada')
      .then(res => res.json())
      .then(setCarneMasUsada);
  }, []);

const [ventasMensuales, setVentasMensuales] = useState([]);
  const [topCombos, setTopCombos] = useState([]);

  useEffect(() => {
    fetch('https://localhost:7125/api/dashboard/ventas-mensuales')
      .then(res => res.json())
      .then(setVentasMensuales);

    fetch('https://localhost:7125/api/dashboard/combos-mas-vendidos')
      .then(res => res.json())
      .then(setTopCombos);
  }, []);

  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
const handlePregunta = async () => {
  if (!pregunta.trim()) return;

  try {
    const apiKey = process.env.REACT_APP_OPENROUTER_KEY;
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "openrouter/cypher-alpha:free",
        messages: [
          {
            role: "user",
            content: `Eres un experto en churrascos y dulces típicos guatemaltecos.
    Según los datos actuales:
    - Carne más usada: ${carneMasUsada.nombre}
    - Stock: ${inventarioCarne.map(c => `${c.nombre} ${c.stockLibras}lbs`).join(', ')}
    - Combos disponibles: ${combos.length}
    - Top dulces: ${topDulces.map(d => `${d.nombre} (${d.stockUnidades}u)`).join(', ')}
    Responde con base en estos datos`
          },
          {
            role: "user",
            content: pregunta
          }
        ]
      })
    });

    const data = await response.json();

    if (data && data.choices && data.choices.length > 0) {
      setRespuesta(data.choices[0].message.content);
    } else {
      console.error("Respuesta inválida:", data);
      setRespuesta("Ocurrió un error al procesar la respuesta del asistente.");
    }

  } catch (error) {
    console.error("Error al consultar OpenAI:", error);
    setRespuesta("Ocurrió un error al consultar el asistente.");
  }
};




  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard</h2>

      {}
      <div className="d-flex flex-wrap gap-3 justify-content-between mb-4">
        <div className="card text-bg-primary flex-fill" style={{ minWidth: '250px' }}>
          <div className="card-body">
            <h5 className="card-title">Combos disponibles</h5>
            <p className="card-text display-6">{combos.length}</p>
          </div>
        </div>

        <div className="card text-bg-success flex-fill" style={{ minWidth: '250px' }}>
          <div className="card-body">
            <h5 className="card-title">Libras de carne por tipo</h5>
            <ul className="mb-0">
              {inventarioCarne.map((c, i) => (
                <li key={i}>{c.nombre} - {c.stockLibras} lbs</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card text-bg-info flex-fill" style={{ minWidth: '250px' }}>
          <div className="card-body">
            <h5 className="card-title">Churrascos creados</h5>
            <p className="card-text display-6">{totalChurrascos}</p>
          </div>
        </div>
      </div>

      {}
      <div className="d-flex flex-wrap gap-3 justify-content-between">
        <div className="card text-bg-danger flex-fill" style={{ minWidth: '250px' }}>
          <div className="card-body">
            <h5 className="card-title">Carne más utilizada</h5>
            {carneMasUsada ? (
              <p className="card-text display-6">
                {carneMasUsada.nombre} <small className="fs-6">({carneMasUsada.usos} usos)</small>
              </p>
            ) : (
              <p>Cargando...</p>
            )}
          </div>
        </div>

      
      </div>
 <div className="container mt-4">
     
      <div className="row">

       
        <div className="col-md-6">
          <div className="card text-bg-secondary mb-3">
            <div className="card-body">
              <h5 className="card-title">Ventas mensuales</h5>
              <ul className="mb-0">
                {ventasMensuales.map((v, i) => (
                  <li key={i}>{v.mes} - Q{v.total.toFixed(2)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        
        <div className="col-md-6">
          <div className="card text-bg-dark mb-3">
            <div className="card-body">
              <h5 className="card-title">Combos más vendidos</h5>
              <ul className="mb-0">
                {topCombos.map((c, i) => (
                  <li key={i}>{c.nombre} - {c.totalVendidos} vendidos</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>

      <div className="mt-4">
        <h4>Asistente inteligente</h4>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Pregúntale algo sobre los productos..."
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
        />
        <button onClick={handlePregunta} className="btn btn-dark">Consultar</button>

        {respuesta && (
          <div className="alert alert-secondary mt-3">
            <strong>Asistente:</strong> {respuesta}
          </div>
        )}
      </div>


      
    </div>




  );
}
