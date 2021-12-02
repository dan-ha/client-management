import React from "react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react/cjs/react.development";
import ClientService from "../services/ClientService";

function ListClientGroupComponent() {

  const [groups, setGroups] = useState();

  useEffect(() => {
    ClientService.getClientGroups()
      .then(res => {
        setGroups(res.data);
      });
  })

  function deleteGroupHandler(id) {  
    if(window.confirm("Naozaj chcete vymazať túto skupinu?")) {
      ClientService.deleteClientGroup(id)
        .then(() => {
          toast.success('Skupina úspešne vymazaná');
          window.location.reload(false);
        })
        .catch(e => {
          console.log(e);
          toast.error('Nepodarilo sa vymazať skupinu');
        });
    }
  }

  return (
    <div>
      <br/>
      <h3 className="text-center">Zoznam Skupín</h3>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Názov skupiny</th>
            <th>Členovia</th>
            <th>Vymazať</th>
          </tr>
        </thead>
        <tbody>
          {groups && groups.map(group =>
            <tr key={group.id}>
              <td>{group.name}</td>
              <td>{group.clients.map(client => <span>{client.lastName},&nbsp;</span>)}</td>
              <td><button className="btn btn-danger btn-sm" onClick={(e) => {e.preventDefault(); deleteGroupHandler(group.id)}}>Vymazať</button></td>
            </tr>
          )}
          {!groups &&
            <tr>
              <td colSpan="3" className="text-center">
                <div className="spinner-border spinner-border-lg align-center"></div>
              </td>
            </tr>
          }
          {groups && !groups.length &&
            <tr>
              <td colSpan="3" className="text-center">
                <div className="p-2">Nie sú vytvorené žiadne skupiny</div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  )
}

export { ListClientGroupComponent }