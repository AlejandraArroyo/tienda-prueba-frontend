import React, { useEffect, useState } from 'react';

function CrearChurrasco() {
  const [tiposCarne, setTiposCarne] = useState([]);
  const [terminosCoccion, setTerminosCoccion] = useState([]);
  const [guarniciones, setGuarniciones] = useState([]);
  const [churrascos, setChurrascos] = useState([]);
  const [formData, setFormData] = useState({
    tipo_carne_id: '',
    termino_coccion_id: '',
    porciones: 1,
    porciones_extra: 0,
    guarnicionesPorPorcion: Array.from({ length: 1 }, () => [null, null])
  });

  useEffect(() => {
    fetch('https://localhost:7125/api/tiposcarne').then(res => res.json()).then(setTiposCarne);
    fetch('https://localhost:7125/api/terminoscoccion').then(res => res.json()).then(setTerminosCoccion);
    fetch('https://localhost:7125/api/guarniciones').then(res => res.json()).then(setGuarniciones);
    fetch('https://localhost:7125/api/churrascos').then(res => res.json()).then(setChurrascos);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuarnicionChange = (index, pos, value) => {
    const nuevasGuarniciones = [...formData.guarnicionesPorPorcion];
    nuevasGuarniciones[index][pos] = value;
    setFormData(prev => ({ ...prev, guarnicionesPorPorcion: nuevasGuarniciones }));
  };

  const handlePorcionesChange = (e) => {
    const porciones = parseInt(e.target.value);
    const guarnicionesPorPorcion = Array.from({ length: porciones }, () => [null, null]);
    setFormData(prev => ({ ...prev, porciones, guarnicionesPorPorcion }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const porcionesTotales = parseInt(formData.porciones);
    const guarnicionesPorPorcion = formData.guarnicionesPorPorcion;

    if (guarnicionesPorPorcion.length !== porcionesTotales ||
        guarnicionesPorPorcion.some(p => !p[0] || !p[1])) {
      alert("Debes seleccionar 2 guarniciones por cada porción.");
      return;
    }

    const datosChurrasco = {
      tipoCarneId: parseInt(formData.tipo_carne_id),
      terminoCoccionId: parseInt(formData.termino_coccion_id),
      porciones: porcionesTotales,
      porcionesExtra: parseInt(formData.porciones_extra),
      porcionGuarniciones: guarnicionesPorPorcion.map((guarniciones, index) => ({
        porcionNumero: index + 1,
        guarnicionIds: guarniciones.map(id => parseInt(id))
      }))
    };

    try {
      const response = await fetch('https://localhost:7125/api/churrascosGuardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosChurrasco)
      });

      if (response.ok) {
        alert('Churrasco creado exitosamente');
        fetch('https://localhost:7125/api/churrascos').then(res => res.json()).then(setChurrascos);
      } else {
        const errorText = await response.text();
        alert(errorText || 'Error al crear churrasco');
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error inesperado");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Configurar Nuevo Plato de Churrasco</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Tipo de carne</label>
          <select className="form-select" name="tipo_carne_id" onChange={handleChange}>
            <option value="">Seleccione</option>
            {tiposCarne.map(tc => (
              <option key={tc.id} value={tc.id}>{tc.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Término de cocción</label>
          <select className="form-select" name="termino_coccion_id" onChange={handleChange}>
            <option value="">Seleccione</option>
            {terminosCoccion.map(tc => (
              <option key={tc.id} value={tc.id}>{tc.descripcion}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Porciones</label>
          <select className="form-select" name="porciones" value={formData.porciones} onChange={handlePorcionesChange}>
            <option value={1}>1</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Porciones extra de guarniciones</label>
          <input className="form-control" type="number" name="porciones_extra" value={formData.porciones_extra} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label>Guarniciones por Porción</label>
          {formData.guarnicionesPorPorcion.map((guarnicionesPorEsta, index) => (
            <div key={index} className="d-flex gap-2 mb-2">
              <span>Porción {index + 1}:</span>
              {[0, 1].map(pos => (
                <select key={pos} className="form-select" value={guarnicionesPorEsta[pos] || ''} onChange={(e) => handleGuarnicionChange(index, pos, e.target.value)}>
                  <option value="">Selecciona guarnición {pos + 1}</option>
                  {guarniciones.map(g => (
                    <option key={g.id} value={g.id}>{g.nombre}</option>
                  ))}
                </select>
              ))}
            </div>
          ))}
        </div>

        <div className="text-end">
          <button className="btn btn-primary" type="submit">Guardar</button>
        </div>
      </form>

      <hr className="my-5" />

      <h4>Churrascos creados</h4>
      <table className="table table-bordered">
  <thead>
    <tr>
      <th>ID</th>
      <th>Tipo de carne</th>
      <th>Término</th>
      <th>Porciones</th>
      <th>Extras</th>
      <th>Guarniciones</th>
    </tr>
  </thead>
  <tbody>
    {churrascos.map(c => (
      <tr key={c.id}>
        <td>{c.id}</td>
        <td>{c.tipoCarne || '-'}</td>
        <td>{c.terminoCoccion || '-'}</td>
        <td>{c.porciones}</td>
        <td>{c.porcionesExtra}</td>
        <td>
          {c.guarniciones?.map(g => (
            <div key={g.porcion}>
              <strong>Porción {g.porcion}:</strong> {g.guarniciones.join(', ')}
            </div>
          )) || '-'}
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}

export default CrearChurrasco;
