import axios from 'axios';

const CLIENT_API_BASE_URL = "http://localhost:8080/api/v1/clients";
const CLIENT_GROUP_API_BASE_URL = "http://localhost:8080/api/v1/clientGroups";

class ClientService {

  getClients() {
    return axios.get(CLIENT_API_BASE_URL);
  }

  getClientsWithoutGroup() {
    return axios.get(CLIENT_API_BASE_URL + '/noGroup');
  }

  getClientById(clientId) {
    return axios.get(CLIENT_API_BASE_URL + '/' + clientId);
  }

  createClient(client) {
    let parsedClient = this.parseDates(client, ['identificationCardExpDate']);
    if(client.permanentResidenceAddress.street == '' && client.permanentResidenceAddress.city == '' && client.permanentResidenceAddress.postalCode == '') {
      parsedClient.permanentResidenceAddress = null;
    }
    if(client.correspondenceAddress.street == '' && client.correspondenceAddress.city == '' && client.correspondenceAddress.postalCode == '') {
      parsedClient.correspondenceAddress = null;
    }
    if(client.casualAddress.street == '' && client.casualAddress.city == '' && client.casualAddress.postalCode == '') {
      parsedClient.casualAddress = null;
    }
    return axios.post(CLIENT_API_BASE_URL, parsedClient);
  }

  updateClient(clientId, client) {
    let parsedClient = this.parseDates(client, ['identificationCardExpDate']);
    if(client.permanentResidenceAddress.street == '' && client.permanentResidenceAddress.city == '' && client.permanentResidenceAddress.postalCode == '') {
      parsedClient.permanentResidenceAddress = null;
    }
    if(client.correspondenceAddress.street == '' && client.correspondenceAddress.city == '' && client.correspondenceAddress.postalCode == '') {
      parsedClient.correspondenceAddress = null;
    }
    if(client.casualAddress.street == '' && client.casualAddress.city == '' && client.casualAddress.postalCode == '') {
      parsedClient.casualAddress = null;
    }
    return axios.put(CLIENT_API_BASE_URL + '/' + clientId, parsedClient);
  }

  deleteClient(clientId) {
    return axios.delete(CLIENT_API_BASE_URL + '/' + clientId);
  }

  parseDates = (client, dateFields) => {
    let parsedClient = {...client};
    dateFields.forEach(dateField => {
      if(client[dateField] != '') {
        parsedClient[dateField] = new Date(client[dateField]);
      }
    });
    return parsedClient;
  }

  // CLIENT GROUPS
  getClientGroups() {
    return axios.get(CLIENT_GROUP_API_BASE_URL);
  }

  createClientGroup(groupName, clients) {
    return axios.post(CLIENT_GROUP_API_BASE_URL, {name: groupName, clients: clients})
  }

  deleteClientGroup(id) {
    return axios.delete(CLIENT_GROUP_API_BASE_URL + '/' + id);
  }
}

export default new ClientService();