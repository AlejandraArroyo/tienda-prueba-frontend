import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function CrearCombo() {
    const [churrascos, setChurrascos] = useState([]);
    const [dulcesUnidad, setDulcesUnidad] = useState([]);
    const [dulcesCaja, setDulcesCaja] = useState([]);
    const [combo, setCombo] = useState({
        nombre: '',
        descripcion: '',
        precio: 0,
        churrascos: [],
        dulcesUnidad: [],
        dulcesCaja: [],
        tipo: 'personalizado'
    });

    useEffect(() => {
        fetch('https://localhost:7125/api/churrascos').then(res => res.json()).then(setChurrascos);
        fetch('https://localhost:7125/api/inventario/dulcesunidad').then(res => res.json()).then(setDulcesUnidad);
        fetch('https://localhost:7125/api/inventario/dulcescaja').then(res => res.json()).then(setDulcesCaja);
    }, []);

    const churrascosFamiliares = churrascos.filter(c => c.porciones >= 3); 
    const churrascosTodos = churrascos; 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCombo(prev => ({ ...prev, [name]: value }));
    };

    const agregarItem = (tipo) => {
        setCombo(prev => ({
            ...prev,
            [tipo]: [...prev[tipo], { id: '', cantidad: 1, tamaño_caja: 6 }]
        }));
    };

    const actualizarItem = (tipo, index, campo, valor) => {
        const nuevos = [...combo[tipo]];
        nuevos[index][campo] = campo === 'cantidad' || campo === 'tamaño_caja' ? parseInt(valor) : valor;
        setCombo(prev => ({ ...prev, [tipo]: nuevos }));
    };

    const quitarItem = (tipo, index) => {
        const nuevos = [...combo[tipo]];
        nuevos.splice(index, 1);
        setCombo(prev => ({ ...prev, [tipo]: nuevos }));
    };

    const cargarPredefinido = (tipo) => {
        if (tipo === 'familiar') {
            setCombo({
                nombre: 'Combo Familiar',
                descripcion: '1 plato familiar de churrasco + 1 caja de dulces',
                precio: 0,
                tipo: 'familiar',
                churrascos: [{ id: '', cantidad: 1 }],
                dulcesUnidad: [],
                dulcesCaja: [{ id: '', tamaño_caja: 12, cantidad: 1 }]
            });
        } else if (tipo === 'eventos') {
            setCombo({
                nombre: 'Combo Eventos',
                descripcion: '3 platos familiares + 2 cajas grandes',
                precio: 0,
                tipo: 'eventos',
                churrascos: Array(3).fill({ id: '', cantidad: 1 }),
                dulcesUnidad: [],
                dulcesCaja: Array(2).fill({ id: '', tamaño_caja: 24, cantidad: 1 })
            });
        } else {
            setCombo({
                nombre: '',
                descripcion: '',
                precio: 0,
                tipo: 'personalizado',
                churrascos: [],
                dulcesUnidad: [],
                dulcesCaja: []
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            nombre: combo.nombre,
            descripcion: combo.descripcion,
            precio: parseFloat(combo.precio),
            churrascos: combo.churrascos.map(c => ({ churrascoId: parseInt(c.id), cantidad: c.cantidad })),
            dulcesUnidad: combo.dulcesUnidad.map(d => ({ dulceId: parseInt(d.id), cantidad: d.cantidad })),
            dulcesCaja: combo.dulcesCaja.map(d => ({
                dulceId: parseInt(d.id),
                tamañoCaja: d.tamaño_caja,
                cantidad: d.cantidad
            }))
        };
        const res = await fetch('https://localhost:7125/api/combos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('Combo guardado exitosamente');
            cargarPredefinido('personalizado');
        } else {
            alert('Error al guardar combo');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Crear Combo</h2>
            <div className="btn-group mb-3">
                <button className="btn btn-outline-primary" onClick={() => cargarPredefinido('familiar')}>Combo Familiar</button>
                <button className="btn btn-outline-primary" onClick={() => cargarPredefinido('eventos')}>Combo Eventos</button>
                <button className="btn btn-outline-secondary" onClick={() => cargarPredefinido('personalizado')}>Combo Personalizado</button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Nombre del combo</label>
                    <input name="nombre" value={combo.nombre} onChange={handleChange} className="form-control" />
                </div>

                <div className="mb-3">
                    <label>Descripción</label>
                    <textarea name="descripcion" value={combo.descripcion} onChange={handleChange} className="form-control" />
                </div>

                <div className="mb-3">
                    <label>Precio</label>
                    <input name="precio" type="number" value={combo.precio} onChange={handleChange} className="form-control" />
                </div>

                <hr />
                <h5>Platos de churrasco</h5>
                {combo.churrascos.map((c, index) => (
                    <div key={index} className="d-flex gap-2 mb-2">
                        <select
                            value={c.id}
                            onChange={(e) => actualizarItem('churrascos', index, 'id', e.target.value)}
                            className="form-select">
                            <option value="">Seleccione churrasco</option>
                            {(combo.tipo === 'personalizado' ? churrascosTodos : churrascosFamiliares).map(ch => (
                                <option key={ch.id} value={ch.id}>
                                    {`Platillo ${ch.id} - ${ch.tipoCarne} - ${ch.porciones} porciones`}
                                </option>
                            ))}
                        </select>
                        <input type="number" className="form-control" value={c.cantidad}
                            onChange={(e) => actualizarItem('churrascos', index, 'cantidad', e.target.value)} />
                        {combo.tipo === 'personalizado' && (
                            <button type="button" className="btn btn-danger" onClick={() => quitarItem('churrascos', index)}>Quitar</button>
                        )}
                    </div>
                ))}
                {combo.tipo === 'personalizado' && (
                    <button type="button" className="btn btn-sm btn-outline-success mb-3"
                        onClick={() => agregarItem('churrascos')}>Agregar churrasco</button>
                )}

                <h5>Dulces por unidad</h5>
                {combo.dulcesUnidad.map((d, index) => (
                    <div key={index} className="d-flex gap-2 mb-2">
                        <select className="form-select" value={d.id} onChange={(e) => actualizarItem('dulcesUnidad', index, 'id', e.target.value)}>
                            <option value="">Seleccione dulce</option>
                            {dulcesUnidad.map(dulce => (
                                <option key={dulce.dulce.id} value={dulce.dulce.id}>{dulce.dulce.nombre}</option>
                            ))}
                        </select>
                        <input type="number" className="form-control" value={d.cantidad} onChange={(e) => actualizarItem('dulcesUnidad', index, 'cantidad', e.target.value)} />
                        <button type="button" className="btn btn-danger" onClick={() => quitarItem('dulcesUnidad', index)}>Quitar</button>
                    </div>
                ))}
                {combo.tipo === 'personalizado' && (
                    <button type="button" className="btn btn-sm btn-outline-success mb-3" onClick={() => agregarItem('dulcesUnidad')}>Agregar dulce unidad</button>
                )}

                <h5>Dulces por caja</h5>
                {combo.dulcesCaja.map((d, index) => (
                    <div key={index} className="d-flex gap-2 mb-2">
                        <select className="form-select" value={d.id} onChange={(e) => actualizarItem('dulcesCaja', index, 'id', e.target.value)}>
                            <option value="">Seleccione dulce</option>
                            {dulcesCaja.map(dulce => (
                                <option key={dulce.dulce.id} value={dulce.dulce.id}>{dulce.dulce.nombre}</option>
                            ))}
                        </select>
                        <select className="form-select" value={d.tamaño_caja} onChange={(e) => actualizarItem('dulcesCaja', index, 'tamaño_caja', e.target.value)}>
                            <option value={6}>6</option>
                            <option value={12}>12</option>
                            <option value={24}>24</option>
                        </select>
                        <input type="number" className="form-control" value={d.cantidad} onChange={(e) => actualizarItem('dulcesCaja', index, 'cantidad', e.target.value)} />
                        <button type="button" className="btn btn-danger" onClick={() => quitarItem('dulcesCaja', index)}>Quitar</button>
                    </div>
                ))}
                {combo.tipo === 'personalizado' && (
                    <button type="button" className="btn btn-sm btn-outline-success mb-4" onClick={() => agregarItem('dulcesCaja')}>Agregar dulce caja</button>
                )}

                <button className="btn btn-primary" type="submit">Guardar Combo</button>
            </form>
        </div>
    );
}

export default CrearCombo;