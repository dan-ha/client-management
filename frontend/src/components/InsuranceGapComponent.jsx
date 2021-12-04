import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import VehicleService from "../services/VehicleService";
import { useParams } from 'react-router';

function InsuranceGapComponent() {
  const { vehicleId } = useParams();

  const [isAddMode, setIsAddMode] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const [insurance, setInsurance] = useState({});

  const initialValues = {
    companyName: '',
    proposalNumber: '',
    contractNumber: '',
    validFrom: '',
    interval: '',
    price: '',
    valueCoverage: '',
    notes: '',
  }

  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required('Poisťovňa je povinná.')
  });

  function cancelEditHandler(setFieldValue) {
    setFormFields(insurance, setFieldValue);
    setIsEditMode(false);
  }

  function deleteInsuranceHandler(setFieldValue) {
    if(window.confirm("Naozaj chcete vymazať toto GAP?")) {
      VehicleService.deleteInsurance(insurance.id)
        .then( () => {
          toast.success('GAP úspešne vymazané');
          setFormFields({}, setFieldValue);
          setIsAddMode(true);
          setIsEditMode(true);
        })
        .catch( e => {
          toast.error('Nepodarilo sa vymazať GAP');
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
    const gapInsurance = {...fields, type: 'gap'};
    VehicleService.createInsurance(vehicleId, gapInsurance)
      .then((res) => {
        toast.success('Úspešne vytvorené GAPko');
        setInsurance(res.data);
        setSubmitting(false);
        setIsAddMode(false);
        setIsEditMode(false);
      })
      .catch((e) => {
        toast.error('Nepodarilo sa vytvoriť GAPko');
        setSubmitting(false);
        console.log(e);
      })
  }

  function updateVehicleInsurance(insuranceId, fields, setSubmitting) {
    VehicleService.updateInsurance(insuranceId, fields)
      .then((res) => {
        toast.success('Úspešne upravené GAPko');
        setInsurance(res.data);
        setSubmitting(false);
        setIsEditMode(false);
      })
      .catch((e) => {
        setSubmitting(false);
        toast.error('Nepodarilo sa upraviť GAPko');
        console.log(e);
      })
  }

  function setFormFields(insurance, setFieldValue) {
    // fields
    const fields = ['companyName', 'proposalNumber', 'contractNumber', 'interval', 'price', 'valueCoverage', 'notes'];
    fields.forEach(field => {
      let value = insurance[field] == null ? '' : insurance[field];
      setFieldValue(field, value, false);
    });
    const dateFields = ['validFrom'];
    dateFields.forEach(dateField => {
      if(insurance[dateField] !== null && insurance[dateField] != undefined) {
        let d = new Date(insurance[dateField]).toISOString().slice(0,10);
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
      <h3 className="text-center">{isAddMode ? 'Pridať nové GAP' : 'GAP poistenie'}</h3>
      <div className="card-body">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {
            function Render({errors, touched, isSubmitting, setFieldValue}) {

              useEffect(() => {
                VehicleService.getInsuranceByTypeAndVehicleId('gap', vehicleId)
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
                  });
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
                      <label>Platnosť zmluvy od</label>
                      <Field name="validFrom" type="date" className="form-control" readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group col-md-3">
                      <label>Poistné obdobie</label>
                      <Field name="interval" type="number" step="1" min="0" className="form-control" readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group col-md-3">
                      <label>Poistné</label>
                      <Field name="price" type="number" step="0.01" min="0" className="form-control" readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group col-md-3">
                      <label>Poistná suma</label>
                      <Field name="valueCoverage" type="number" step="0.01" min="0" className="form-control" readOnly={!isEditMode}/>
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

export { InsuranceGapComponent };