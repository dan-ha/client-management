import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import VehicleService from '../services/VehicleService';

function ListVehicleComponent({ history, match }) {

  const { params } = match;
  const [vehicles, setVehicles] = useState(null);

  useEffect(() => {
    VehicleService.getVehicles(params.clientId)
      .then(res => setVehicles(res.data));
  }, [])
  
  function tableRowClickHandler(vehicleId) {
    history.push(`/client/${params.clientId}/vehicle/${vehicleId}`);
  }

  return (
    <div>
      <br/>
      <h2 className="text-center">Zoznam vozidiel</h2>
      <div className="float-end">
        <Link to={`/client/${params.clientId}/vehicle/add`} className="btn btn-md btn-success mb-2">Pridať vozidlo</Link>
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Značka</th>
            <th>Model</th>
            <th>ŠPZ</th>
          </tr>
        </thead>
        <tbody>
          {vehicles && vehicles.map(vehicle =>
            <tr key={vehicle.id} onClick={() => tableRowClickHandler(vehicle.id)}>
              <td>{vehicle.brand}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.licensePlateNumber}</td>
            </tr>
          )}
          {!vehicles &&
            <tr>
              <td colSpan="4" className="text-center">
                <div className="spinner-border spinner-border-lg align-center"></div>
              </td>
            </tr>
          }
          {vehicles && !vehicles.length &&
            <tr>
              <td colSpan="4" className="text-center">
                <div className="p-2">Klient nemá zaregistrované žiadne vozidlá</div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  )
}

export { ListVehicleComponent };