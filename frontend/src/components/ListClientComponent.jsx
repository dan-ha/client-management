import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import ClientService from "../services/ClientService";

function ListClientComponent({ history }) {

  const [dataAll, setDataAll] = useState();
  const [listData, setListData] = useState();
  const [search, setSearch] = useState('');
  const [sortedBy, setSortedBy] = useState('');
  const [today] = useState(new Date(new Date().setHours(0,0,0,0)));

  useEffect(() => {
    ClientService.getClients()
      .then(res => {
        let list = [];
        res.data.forEach(client => {
          let d = {
            clientId: client.id,
            vehicleId: '',
            insuranceId: '',
            title: client.title,
            firstName: client.firstName,
            lastName: client.lastName,
            brand: '',
            model: '',
            companyName: '',
            validFrom: null,
            insuranceType: '',
            groupName: client.groupName
          };
          if (client.vehicles.length) {
            client.vehicles.forEach(vehicle => {
              d.vehicleId = vehicle.id;
              d.brand = vehicle.brand;
              d.model = vehicle.model;
              d.insuranceId = '';
              d.companyName = '';
              d.validFrom = null;
              d.insuranceType = '';
              if (vehicle.insurances.length) {
                vehicle.insurances.forEach(insurance => {
                  d.insuranceId = insurance.id;
                  d.companyName = insurance.companyName;
                  // we overwrite year to actual one, so we can sort them accordingly
                  d.validFrom = setCurrentYear(insurance.validFrom);
                  d.insuranceType = insurance.type;
                  list.push({ ...d });
                });
              } else {
                list.push({ ...d });
              }
            });
          } else {
            list.push({ ...d });
          }
        });
        setDataAll(list);
        setListData(list);
        setSortedBy('lastName');
      });
  }, []);

  const setCurrentYear = (dateString) => {
    if(dateString == null) return null;
    let d = new Date(dateString);
    d.setYear(today.getFullYear());
    return d;
  }

  // Search query - search by lastName or insurance comapny name
  useEffect(() => {
    if (search === '') {
      setListData(dataAll);
    } else {
      setListData(dataAll?.filter(d => 
        d.lastName?.toLowerCase().startsWith(search.toLowerCase())
        ||
        d.companyName?.toLowerCase().startsWith(search.toLowerCase()))
        );
    }
  }, [search]);

  // Sort by
  useEffect(() => {
    if (sortedBy === 'lastName') {
      let sorted = [...dataAll.sort(compareNames)];
      setDataAll(sorted);
      setListData(sorted);
      setSearch('');
    } else if (sortedBy === 'dateValid') {
      //classical sort by date
      dataAll.sort(compareValidFromDates);
      
      let beforeToday = [];
      let todayAndAfter = [];
      let nullValues = [];
      let sorted = [];
      // sort todayAndAfter, before and null values
      dataAll.forEach(d => {
        if(d.validFrom == null) {
          nullValues.push(d);
        } else {
          if(d.validFrom < today) {
            beforeToday.push(d);
          }
          if(d.validFrom >= today) {
            todayAndAfter.push(d);
          }
        }
      });
      sorted = [].concat(todayAndAfter, beforeToday, nullValues);

      setDataAll(sorted);
      setListData(sorted);
      setSearch('');
    } else if (sortedBy === 'companyName') {
      let sorted = [...dataAll.sort(compareCompanyNames)];
      setDataAll(sorted);
      setListData(sorted);
      setSearch('');
    }
  }, [sortedBy]);

  const tableRowClickHandler = (clientId, vehicleId) => {
    if(vehicleId) {
      history.push(`/client/${clientId}/vehicle/${vehicleId}`);
    } else {
      history.push(`/client/${clientId}`);
    }
  }

  const compareNames = (a, b) => {
    let nameA = a.lastName + a.firstName;
    let nameB = b.lastName + b.firstName;
    if(a.groupName !== null) {
      nameA = a.groupName + nameA;
    } 
    if(b.groupName !== null) {
      nameB = b.groupName + nameB;
    }
    if (nameA.toLowerCase() < nameB.toLowerCase()) {
      return -1;
    }
    if (nameA.toLowerCase() > nameB.toLowerCase()) {
      return 1;
    }
    return 0;
  }

  const compareValidFromDates = (a, b) => {
    return a.validFrom - b.validFrom;
  }

  const compareCompanyNames = (a, b) => {
    if (a.companyName < b.companyName) {
      return -1;
    }
    if (a.companyName > b.companyName) {
      return 1;
    }
    return 0;
  }

  return (
    <div>
      <br />
      <h2 className="text-center">Zoznam klientov a poistení</h2>
      <div className="float-end">
        <Link to="/client/add" className="btn btn-md btn-success mb-2">Pridať klienta</Link>
        &nbsp;&nbsp;
        <Link to="/clientGroup" className="btn btn-md btn-success mb-2">Pridať Skupinu</Link>
      </div>
      <div className="row">
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Hľadať..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="col-md-4 end-center">
          <label htmlFor="sortBy">Zoradiť podľa</label>
        </div>
        <div className="col-md-4">
          <select id="sortBy" className='form-control' onChange={e => setSortedBy(e.target.value)}>
            <option value="lastName">Priezviska</option>
            <option value="dateValid">Dátumu platnosti</option>
            <option value="companyName">Poisťovne</option>
          </select>
        </div>
      </div>
      <br/>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Meno</th>
            <th>Vozidlo</th>
            <th>Poisťovňa</th>
            <th>Poistenie</th>
          </tr>
        </thead>
        <tbody>
          {listData && listData.map(d =>
            <tr key={`${d.clientId}-${d.vehicleId}-${d.insuranceId}`} onClick={() => tableRowClickHandler(d.clientId, d.vehicleId)} className={d.insuranceId ? 'active' : 'passive'}>
              <td>{`${d.lastName} ${d.firstName} ${d.title}`} {d.groupName && <span>({d.groupName})</span>}</td>
              <td>{`${d.brand}-${d.model}`}</td>
              <td>{d.companyName}</td>
              <td>{d.insuranceType.toUpperCase()}</td>
            </tr>
          )}
          {!listData &&
            <tr>
              <td colSpan="4" className="text-center">
                <div className="spinner-border spinner-border-lg align-center"></div>
              </td>
            </tr>
          }
          {listData && !listData.length &&
            <tr>
              <td colSpan="4" className="text-center">
                <div className="p-2">Nenašli sa zhodujúci klienti</div>
              </td>
            </tr>
          }
        </tbody>
      </table>

    </div>
  )
}

export { ListClientComponent };