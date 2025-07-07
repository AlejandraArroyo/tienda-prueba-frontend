import React from 'react';

function Dashboard() {
  return (
    <div className="container mt-4">
      <h2>Panel Principal(Dashboard)</h2>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Ventas Diarias</h5>
              <p className="card-text display-6">Q0.00</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Ventas Mensuales</h5>
              <p className="card-text display-6">Q0.00</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title">Ganancias (Churrascos)</h5>
              <p className="card-text display-6">Q0.00</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
        <div className="card text-white bg-warning mb-3">
            <div className="card-body">
            <h5 className="card-title">Desperdicios y Mermas</h5>
            <p className="card-text display-6">0</p>
            </div>
        </div>
        </div>



      </div>

      <div className="row mt-2">
        <div className="col-md-6">
          <div className="card border-secondary mb-3">
            <div className="card-body">
              <h5 className="card-title">Platos Más Vendidos</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">—</li>
                <li className="list-group-item">—</li>
                <li className="list-group-item">—</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-secondary mb-3">
            <div className="card-body">
              <h5 className="card-title">Dulces Más Populares</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">—</li>
                <li className="list-group-item">—</li>
                <li className="list-group-item">—</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-12">
          <div className="card border-dark">
            <div className="card-body">
              <h5 className="card-title">Combinaciones de Guarniciones Frecuentes</h5>
              <p className="card-text">—</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>

    
  );
}

export default Dashboard;
