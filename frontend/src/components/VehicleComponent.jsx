import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { InsurancePzpComponent } from './InsurancePzpComponent';
import { InsuranceCascoComponent } from './InsuranceCascoComponent';
import { InsuranceGapComponent } from './InsuranceGapComponent';
import VehicleService from '../services/VehicleService';

function VehicleComponent({ history, match }) {

  const { clientId, vehicleId } = match.params;
  const isAddMode = vehicleId === 'add';
  const [isEditMode, setIsEditMode] = useState(isAddMode);
  const [vehicle, setVehicle] = useState({});

  const initialValues = {
    brand: '',
    model: '',
    licensePlateNumber: '',
    dateMade: '',
    technicalCardNo: '',
    volume: '',
    power: '',
    weight: '',
    color: '',
    fuel: '',
    type: '',
    gearBox: '',
    vin: '',
    notes: '',
  };

  const validationSchema = Yup.object().shape({
    brand: Yup.string().required('Značka je povinná'),
  });

  function clientInfoHandler() {
    history.push(`/client/${clientId}`);
  }

  function printHandler() {
    const win = window.open(`/client/${clientId}/vehicle/${vehicleId}/print`, "_blank");
    win.focus();
  }

  function deleteVehicleHandler() {
    if(window.confirm(`Naozaj chcete vymazať vozidlo ${vehicle.brand}-${vehicle.model}`)) {
      VehicleService.deleteVehicle(vehicleId)
      .then( () => {
        toast.success('Vozidlo úspešne vymazané');
        history.push(`/client/${clientId}`);
      })
      .catch(e => {
        toast.error('Nepodarilo sa vymazať vozidlo');
        console.log(e);
      });
    }
  }
  
  function editVehicleHandler() {
    setIsEditMode(true);
  }

  function cancelEditHandler(setFieldValue) {
    if(isAddMode) {
      history.push(`/client/${clientId}`);
    } else {
      setFormFields(vehicle, setFieldValue);
      setIsEditMode(false);
    }
  }

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus();
    if (isAddMode) {
      createVehicle(clientId, fields, setSubmitting);
    } else {
      updateVehicle(vehicleId, fields, setSubmitting);
    }
  }

  function createVehicle(clientId, fields, setSubmitting) {
    VehicleService.createVehicle(clientId, fields)
      .then((res) => {
        setSubmitting(false);
        setIsEditMode(false);
        history.push(`/client/${clientId}/vehicle/${res.data.id}`);
        toast.success('Úspešne pridané vozidlo');
      })
      .catch(() => {
        setSubmitting(false);
        toast.error('Nepodarilo sa pridať vozidlo');
      });
  }

  function updateVehicle(vehicleId, fields, setSubmitting) {
    VehicleService.updateVehicle(vehicleId, fields)
      .then((res) => {
        toast.success('Úspešne upravené vozidlo');
        setVehicle(res.data)
        setSubmitting(false);
        setIsEditMode(false);
      })
      .catch(() => {
        toast.error('Nepodarilo sa upraviť vozidlo');
        setSubmitting(false);
      });
  }

  function setFormFields(vehicle, setFieldValue) {
    const fields = ['brand', 'model', 'licensePlateNumber', 'dateMade', 'volume', 'power', 'weight', 'color', 'fuel', 'type', 'gearBox', 'vin', 'notes'];
    fields.forEach(field => {
      let value = vehicle[field] == null ? '' : vehicle[field];
      setFieldValue(field, value, false);
    });
  }

  return (
    <div>
      <br />
      <div className="row">
        <div className="col-md-2">
          <button className="btn btn-secondary" onClick={clientInfoHandler}>&#8592; Klient</button>
        </div>
        {!isAddMode &&
        <div className="col-md-3 offset-7 text-end">
          <button className="btn btn-secondary" onClick={printHandler}>Vytlačiť</button>
          &nbsp;&nbsp;
          <button className="btn btn-danger" onClick={deleteVehicleHandler}>Vymazať</button>
        </div>
        }
      </div>

      <div className="card col-md-10 offset-md-1">
        <br />
        <h3 className="text-center">{isAddMode ? 'Pridať nové vozidlo' : 'Informácie o vozidle'}</h3>
        <div className="card-body">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {function Render({ errors, touched, isSubmitting, setFieldValue }) {

              useEffect(() => {
                if (!isAddMode) {
                  // get client's vehicle and set form fields
                  VehicleService.getVehicleById(vehicleId).then(res => {
                    setVehicle(res.data);
                    setFormFields(res.data, setFieldValue);
                  });
                }
              }, []);

              return (
                <Form>
                  <div className="row">
                    <div className="form-group col-md-4">
                      <label>Značka</label>
                      <Field name="brand" type="text" className={'form-control' + (errors.brand && touched.brand ? ' is-invalid' : '')} readOnly={!isEditMode}/>
                      <ErrorMessage name="brand" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Model</label>
                      <Field name="model" type="text" className='form-control' readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group col-md-4">
                      <label>ŠPZ</label>
                      <Field name="licensePlateNumber" type="text" className="form-control" readOnly={!isEditMode}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-md-3">
                      <label>Dátum výroby</label>
                      <Field name="dateMade" type="text" className='form-control' readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group col-md-3">
                      <label>Technický preukaz</label>
                      <Field name="technicalCardNo" type="text" className="form-control" readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group col-md-3">
                      <label>Objem</label>
                      <Field name="volume" type="number" className='form-control' readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group col-md-3">
                      <label>Výkon(kw)</label>
                      <Field name="power" type="number" className="form-control" readOnly={!isEditMode}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-md-4">
                      <label>Hmotnosť</label>
                      <Field name="weight" type="number" className={'form-control' + (errors.weight && touched.weight ? ' is-invalid' : '')} readOnly={!isEditMode}/>
                      <ErrorMessage name="weight" component="div" className="invalid-feedback" />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Farba</label>
                      <Field name="color" type="text" className='form-control' readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group col-md-4">
                      <label>Palivo</label>
                      <Field name="fuel" type="text" className="form-control" readOnly={!isEditMode}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-md-4">
                      <label>Typ</label>
                      <Field name="type" type="text" className='form-control' readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group col-md-4">
                      <label>Prevodovka</label>
                      <Field name="gearBox" type="text" className="form-control" readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group col-md-4">
                      <label>VIN</label>
                      <Field name="vin" type="text" className="form-control" readOnly={!isEditMode}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-md-12">
                      <label>Poznamky</label>
                      <Field name="notes" as="textarea" className="form-control" readOnly={!isEditMode}/>
                    </div>
                  </div>
                  <br />
                  <div className="row float-end">
                    {isEditMode &&
                      <div className="form-group">
                        <button type="submit" disabled={isSubmitting} className="btn btn-success">
                          {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                          Uložiť
                        </button>
                        &nbsp;&nbsp;
                        <button className="btn btn-danger" onClick={() => cancelEditHandler(setFieldValue)}>Zrušiť</button>
                      </div>
                    }
                    {!isEditMode &&
                      <div className="form-group">
                        <button className="btn btn-primary" onClick={editVehicleHandler}>
                          Upraviť
                        </button>
                      </div>
                    }
                  </div>
                </Form>
              )
            }}
          </Formik>
        </div>

      </div>
      {!isAddMode && 
        <div>
          <InsurancePzpComponent match={match} />
          <InsuranceCascoComponent match={match} />
          <InsuranceGapComponent match={match} />
        </div>
      }
    </div>
  )
}

export { VehicleComponent };