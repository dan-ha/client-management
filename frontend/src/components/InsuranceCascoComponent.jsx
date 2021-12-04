import React, {useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import VehicleService from '../services/VehicleService';
import { useParams } from 'react-router';

function InsuranceCascoComponent() {
  const { vehicleId } = useParams();
  const[isAddMode, setIsAddMode] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [insurance, setInsurance] = useState({});

  const initialValues = {
    companyName: '',
    proposalNumber: '',
    contractNumber: '',
    validFrom: '',
    validUntil: '',
    vehicleValue: '',
    distanceDriven: '',
    price: '',
    interval: '',
    notes: ''
  }

  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required('Poisťovňa je povinná.'),
  });

  function cancelEditHandler(setFieldValue) {
    setFormFields(insurance, setFieldValue);
    setIsEditMode(false);
  }

  function deleteInsuranceHandler(setFieldValue) {
    if(window.confirm("Naozaj chcete vymazať toto CASCO?")) {
      VehicleService.deleteInsurance(insurance.id)
        .then( () => {
          toast.success('CASCO úspešne vymazané');
          setFormFields({}, setFieldValue);
          setIsAddMode(true);
          setIsEditMode(true);
        })
        .catch( e => {
          toast.error('Nepodarilo sa vymazať CASCO');
          console.log(e);
        });
    }
  }

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus();
    if(isAddMode) {
      createVehicleInsurance(vehicleId, fields, setSubmitting);
    } else {
      updateVehicleInsurance(insurance.id, fields, setSubmitting);
    }
  }

  function createVehicleInsurance(vehicleId, fields, setSubmitting) {
    const cascoInsurance = {...fields, type: 'casco'};
    VehicleService.createInsurance(vehicleId, cascoInsurance)
      .then((res) => {
        toast.success('Úspešne vytvorené CASCO');
        setInsurance(res.data);
        setSubmitting(false);
        setIsAddMode(false);
        setIsEditMode(false);
      })
      .catch((e) => {
        toast.error('Nepodarilo sa vytvoriť CASCO');
        setSubmitting(false);
        console.log(e);
      })
  }

  function updateVehicleInsurance(insuranceId, fields, setSubmitting) {
    VehicleService.updateInsurance(insuranceId, fields)
      .then((res) => {
        setInsurance(res.data);
        setSubmitting(false);
        setIsEditMode(false);
        toast.success('Úspešne upravené CASCO');
      })
      .catch((e) => {
        setSubmitting(false);
        toast.error('Nepodarilo sa upraviť CASCO');
        console.log(e);
      })
  }

  function setFormFields(insurance, setFieldValue) {
    // fields
    const fields = ['companyName', 'proposalNumber', 'contractNumber','validUntil', 'vehicleValue', 'distanceDriven', 'price', 'interval', 'notes'];
    fields.forEach(field => {
      let value = insurance[field] == null ? '' : insurance[field];
      setFieldValue(field, value, false);
    });
    // date fields
    const dateFields = ['validFrom'];
    dateFields.forEach(dateField => {
      if(insurance[dateField] !== null && insurance[dateField] != undefined) {
        let d = new Date(insurance[dateField]).toISOString().slice(0, 10);
        setFieldValue(dateField, d, false);
      } else {
        setFieldValue(dateField, '', false);
      }
    });
  }

  return (
    <div>
      <br/>
      <div className="card col-md-10 offset-md-1">
        <br/>
        <h3 className="text-center">{isAddMode ? 'Pridať nové CASCO' : 'CASCO poistenie'}</h3>
        <div className="card-body">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {
              function Render({errors, touched, isSubmitting, setFieldValue}) {

                useEffect(() => {
                  VehicleService.getInsuranceByTypeAndVehicleId('casco', vehicleId)
                    .then(res => {
                      let insurance = res.data[0];
                      if(insurance !== undefined) {
                        setIsAddMode(false);
                        setInsurance(insurance);
                        setFormFields(insurance, setFieldValue);
                      } else {
                        setIsAddMode(true);
                        setIsEditMode(true);
                        setInsurance({});
                      }
                    })
                }, []);

                return (
                  <Form>
                    <div className="row">
                      <div className="form-group col-md-4">
                        <label>Poisťovňa</label>
                        <Field name="companyName" type="text" className={'form-control' + (errors.companyName && touched.companyName ? ' is-invalid' : '')} readOnly={!isEditMode}/>
                        <ErrorMessage name="companyName" component="div" className="invalid-feedback"/>
                      </div>
                      <div className="form-group col-md-4">
                        <label>Číslo návrhu</label>
                        <Field name="proposalNumber" type="text" className="form-control" readOnly={!isEditMode}/>
                      </div>
                      <div className="form-group col-md-4">
                        <label>Číslo zmluvy</label>
                        <Field name="contractNumber" type="text" className="form-control" readOnly={!isEditMode}/>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-3">
                        <label>Platnosť zmluvy</label>
                        <Field name="validFrom" type="date" className="form-control" readOnly={!isEditMode}/>
                      </div>
                      <div className="form-group col-md-3">
                        <label>Platnosť zmluvy do</label>
                        <Field name="validUntil" type="text" className="form-control" readOnly={!isEditMode}/>
                      </div>
                      <div className="form-group col-md-3">
                        <label>Cena vozidla</label>
                        <Field name="vehicleValue" type="number" step="0.01" className="form-control" readOnly={!isEditMode}/>
                      </div>
                      <div className="form-group col-md-3">
                        <label>Počet najazdených km</label>
                        <Field name="distanceDriven" type="text" className="form-control" readOnly={!isEditMode}/>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-6">
                        <label>Poistné</label>
                        <Field name="price" type="number" step="0.01" min="0" className="form-control" readOnly={!isEditMode}/>
                      </div>
                      <div className="form-group col-md-6">
                        <label>Poistné obdobie</label>
                        <Field name="interval" as="select" className='form-control' disabled={!isEditMode}>
                          <option value=""></option>
                          <option value="3">Štvrťročná 1/4</option>
                          <option value="6">Polročná 1/2</option>
                          <option value="12">Ročná 1</option>
                        </Field>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group">
                        <label>Poznámky</label>
                        <Field name="notes" as="textarea" rows="4" className="form-control" readOnly={!isEditMode}/>
                      </div>
                    </div>
                    <br/>
                    <div className="row float-end">
                      {isEditMode && 
                        <div className="form-group">
                          <button type="submit" disabled={isSubmitting} className="btn btn-success">
                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Uložiť
                          </button>
                          &nbsp;&nbsp;
                          {!isAddMode &&
                              <button className="btn btn-danger" onClick={() => cancelEditHandler(setFieldValue)}>Zrušiť</button>
                          }
                        </div>
                      }
                      {!isEditMode &&
                        <div className="form-group">
                          <button className="btn btn-primary" onClick={() => setIsEditMode(true)}>
                            Upraviť
                          </button>
                          &nbsp;&nbsp;
                          {!isAddMode &&
                            <button className="btn btn-danger" onClick={(e) => {e.preventDefault(); deleteInsuranceHandler(setFieldValue)}}>
                              Vymazať
                            </button>
                          }
                        </div>
                      }
                    </div>
                  </Form>
                )

              }
            }
          </Formik>
        </div>
      </div>
      <br/>
    </div>
  )

}

export { InsuranceCascoComponent };