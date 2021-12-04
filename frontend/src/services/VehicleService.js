import axios from 'axios'

const VEHICLE_API_BASE_URL = 'http://localhost:8080/api/v1/vehicles';
const INSURANCE_API_BASE_URL = 'http://localhost:8080/api/v1/insurances'

class VehicleService {

  getVehicles(ownerId) {
    return axios.get(VEHICLE_API_BASE_URL,{ params: { ownerId: ownerId } });
  }

  getVehicleById(vehicleId) {
    return axios.get(VEHICLE_API_BASE_URL + '/' + vehicleId);
  }

  createVehicle(clientId, vehicle) {
    let newVehicle = {...vehicle};
    newVehicle.owner = {id: clientId};    
    return axios.post(VEHICLE_API_BASE_URL, newVehicle);
  }

  updateVehicle(vehicleId, vehicle) {
    return axios.put(VEHICLE_API_BASE_URL + '/' + vehicleId, vehicle);
  }

  deleteVehicle(vehicleId) {
    return axios.delete(VEHICLE_API_BASE_URL + '/' + vehicleId);
  }

  // Vehicle INSURANCE
  getInsuranceByTypeAndVehicleId(type, vehicleId) {
    return axios.get(INSURANCE_API_BASE_URL, { params: {type: type, vehicleId: vehicleId}});
  }

  createInsurance(carId, insurance){
    let newInsurance = this.parseDates(insurance, ['validFrom']);
    newInsurance.vehicle = {id: carId};
    return axios.post(INSURANCE_API_BASE_URL, newInsurance);
  }

  updateInsurance(insuranceId, insurance) {
    let insuranceCopy = this.parseDates(insurance, ['validFrom']);
    return axios.put(INSURANCE_API_BASE_URL + '/' + insuranceId, insuranceCopy);
  }

  deleteInsurance(insuranceId) {
    return axios.delete(INSURANCE_API_BASE_URL + '/' + insuranceId);
  }

  parseDates = (obj, dateFields) => {
    let parsedObj = {...obj};
    dateFields.forEach(dateField => {
      if(obj[dateField] != '') {
        parsedObj[dateField] = new Date(obj[dateField]);
      }
    });
    return parsedObj;
  }
}

export default new VehicleService();