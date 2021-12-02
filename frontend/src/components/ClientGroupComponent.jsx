import React, {useEffect, useState} from "react";
import { toast } from "react-toastify";
import ClientService from "../services/ClientService";
import { ListClientGroupComponent } from "./ListClientGroupComponent";

function ClientGroupComponent() {
  const [groupName, setGroupName] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState();
  const [clientsSelected, setClientsSelected] = useState([]);

  useEffect(() => {
    ClientService.getClientsWithoutGroup()
      .then(res => {
        let clientList = [];
        res.data.forEach(d => {
          clientList.push({
            id: d.id,
            title: d.title, 
            firstName: d.firstName,
            lastName: d.lastName,
          })
        });
        setClients(clientList);
        if(clientList.length > 0) {
          setSelectedClient(clientList[0].id);
        }
      });
  }, []);

  function addClientHandler(e) {
    e.preventDefault();
    if(clients.length > 0) {
      let client = {};
      let filteredOut = clients.filter(c => {
        if(c.id == selectedClient) {
          client = c;
        }
        return c.id != selectedClient;
      });
      setClients(filteredOut);
      if(filteredOut.length > 0) {
        setSelectedClient(filteredOut[0].id);
      }
      setClientsSelected([...clientsSelected, client]);
    }
  }

  function createGroupHandler(e) {
    e.preventDefault();
    let clients = clientsSelected.map(c => ({id: c.id}));
    ClientService.createClientGroup(groupName, clients)
      .then(() => {
        setGroupName("");
        setClientsSelected([]);
        toast.success("Skupina úspešne vytvorená");
      })
      .catch((e) => {
        console.log(e);
        toast.error("Nepodarilo sa vytvoriť skupinu");
      })
  }

  return (
    <div>
      <br/>
      <h3 className="text-center">Vytvoriť novú skupinu</h3>
      <div className="row">
        <div className="form-group col-md-3">
          <label>Názov skupiny</label>
          <input type="text" className="form-control" value={groupName} onChange={(e) => setGroupName(e.target.value)}/>
        </div>
        <div className="form-group col-md-3">
          <label>Vybrať klienta</label>
          <select className="form-control" value={selectedClient?.id} onChange={(e) => setSelectedClient(e.target.value)}>
          {clients && clients.map(c => 
              <option value={c.id} key={c.id}>{`${c.lastName} ${c.firstName} ${c.title}`}</option>
          )}
          </select>
        </div>
        <div className="form-group col-md-1">
          <label>&nbsp;</label>
          <button className="form-control btn btn-success" onClick={addClientHandler}>Pridať</button>
        </div>
        <div className="form-group col-md-3">
          <label>Klienti v skupine</label>
          <ul>
            {clientsSelected.map(c =>
              <li key={c.id}>{`${c.lastName} ${c.firstName} ${c.title}`}</li>
            )}
          </ul>
        </div>
        <div className="form-group col-md-2" style={{paddingTop: "24px"}}>
          <button className="form-control btn btn-success" onClick={createGroupHandler}>Vytvoriť skupinu</button>
        </div>
      </div>
      <ListClientGroupComponent/>
    </div>
  )
}

export { ClientGroupComponent }