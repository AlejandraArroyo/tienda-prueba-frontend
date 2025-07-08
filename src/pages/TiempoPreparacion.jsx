import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TiempoPreparacion() {
    const [churrascos, setChurrascos] = useState([]);
    const [tiempos, setTiempos] = useState({});

    useEffect(() => {
        axios.get('https://localhost:7125/api/churrascos').then(res => {
            setChurrascos(res.data);
        });
    }, []);

    const guardarTiempo = (id) => {
        const minutos = tiempos[id];
        axios.put(`https://localhost:7125/api/churrascos/${id}/tiempo`, { minutos })
            .then(() => alert("Tiempo actualizado"))
            .catch(() => alert("Error al actualizar"));
    };

    const describirChurrasco = (c) => {
        const guarnicionesTexto = c.guarniciones
            ?.map(g => `Porción ${g.porcion}: ${g.guarniciones.join(', ')}`)
            .join(" | ") || "Sin guarniciones";
        return `Carne: ${c.tipoCarne} - Porciones: ${c.porciones} - Extras: ${c.porcionesExtra} - Término: ${c.terminoCoccion} - ${guarnicionesTexto}`;
    };

    return (
        <div className="container mt-4">
            <h3>Tiempo de preparación por plato</h3>
            {churrascos.map(c => (
                <div key={c.id} className="mb-3">
                    <strong>Plato ID {c.id}: {describirChurrasco(c)}</strong>
                    <input
                        type="number"
                        className="form-control w-25 d-inline mx-2"
                        placeholder="Minutos"
                        value={tiempos[c.id] || ""}
                        onChange={e => setTiempos({ ...tiempos, [c.id]: e.target.value })}
                    />
                    <button className="btn btn-success" onClick={() => guardarTiempo(c.id)}>
                        Guardar
                    </button>
                </div>
            ))}
        </div>
    );
}
