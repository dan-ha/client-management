import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from "react-toastify";

import { ListVehicleComponent } from "./ListVehicleComponent";
import ClientService from "../services/ClientService";

function ClientComponent({ history, match }) {
  const { clientId } = match.params;
  const isAddMode = clientId === 'add';
  const [isEditMode, setIsEditMode] = useState(isAddMode);
  const [client, setClient] = useState({});

  const initialValues = {
    title: '',
    firstName: '',
    lastName: '',
    identificationNumber: '',
    identificationCardNumber: '',
    identificationCardExpDate: '',
    phoneNumber: '',
    emailAddress: '',
    permanentResidenceAddress: {street: '', houseNumber: '', city: '', postalCode: ''},
    correspondenceAddress: {street: '', houseNumber: '', city: '', postalCode: ''},
    casualAddress: {street: '', houseNumber: '', city: '', postalCode: ''},
  }

  const validationSchema = Yup.object().shape({
    lastName: Yup.string().required("Priezvisko je povinné"),
  });

  const cancelEditHandler = (setFieldValue) => {
    if(isAddMode) {
      history.push('/clients');
    } else {
      setFormFields(client, setFieldValue);
      setIsEditMode(false);
    }
  }

  const onSubmit = (fields, {setStatus, setSubmitting}) => {
    setStatus();
    if(isAddMode) {
      createClient(fields, setSubmitting);
    } else {
      updateClient(clientId, fields, setSubmitting);
    }
  }

  const createClient = (fields, setSubmitting) => {
    ClientService.createClient(fields)
      .then((res) => {
        setSubmitting(false);
        setClient(res.data);
        setIsEditMode(false);
        history.push(`/client/${res.data.id}`);
        toast.success('Klient úspešne vytvorený');
      })
      .catch(() => {
        setSubmitting(false);
        toast.error('Nepodarilo sa vytvoriť klienta');
      });
  }

  const updateClient = (clientId, fields, setSubmitting) => {
    ClientService.updateClient(clientId, fields)
    .then((res) => {
      setSubmitting(false);
      setClient(res.data);
      setIsEditMode(false);
      toast.success('Úspešne upravený klient');
    })
    .catch((e) => {
      console.log(e);
      toast.error('Nepodarilo sa upraviť klienta');
      setSubmitting(false);
    });
  }

  const setFormFields = (client, setFieldValue) => {
    const fields = ['title', 'firstName', 'lastName', 'identificationNumber', 'identificationCardNumber', 'phoneNumber', 'emailAddress'];
    fields.forEach(field => {
      let value = client[field] == null ? '' : client[field];
      setFieldValue(field, value, false);
    });
    // set dates
    const dateFields = ['identificationCardExpDate'];
    dateFields.forEach(dateField => {
      if(client[dateField] != null) {
        let d = new Date(client[dateField]).toISOString().slice(0, 10);
        setFieldValue(dateField, d, false);
      }
    });
    //set addresses
    const addresses = ['permanentResidenceAddress', 'correspondenceAddress', 'casualAddress'];
    addresses.forEach(field => {
      if(client[field] != null) {
         const addressAttr = ['city', 'postalCode', 'street', 'houseNumber'];
         addressAttr.forEach(adrField => {
           let value = client[field][adrField] == null ? '' : client[field][adrField];
           let fieldName = field + '.' + adrField;
           setFieldValue(fieldName, value, false);
         });
      }
    });
  }

  return (
    <div>
      <br/>
      <div className="card col-md-10 offset-md-1">
        <br />
        <h3 className="text-center">{isAddMode ? 'Pridať nového klienta' : 'Informácie o klientovi'}</h3>
        <div className="card-body">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {function Render({ errors, touched, isSubmitting, setFieldValue }) {

                useEffect(() => {
                  if(!isAddMode) {
                    ClientService.getClientById(clientId).then(res => {
                      setClient(res.data);
                      setFormFields(res.data, setFieldValue);
                    });
                  }
                }, []);

              return(
                <Form>
                  <div className="row">
                    <div className="form-group col-md-2">
                      <label>Titul</label>
                      <Field name="title" type="text" className='form-control' readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group col-md-5">
                      <label>Krstné meno</label>
                      <Field name="firstName" type="text" className='form-control' readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group col-md-5">
                      <label>Priezvisko</label>
                      <Field name="lastName" type="text" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} readOnly={!isEditMode}/>
                      <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-md-4">
                      <label>Rodné číslo</label>
                      <Field name="identificationNumber" type="text" className='form-control' readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group col-md-4">
                      <label>Číslo OP/pas</label>
                      <Field name="identificationCardNumber" type="text" className='form-control' readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group col-md-4">
                      <label>Dátum platnosti OP</label>
                      <Field name="identificationCardExpDate" type="date" className='form-control' readOnly={!isEditMode}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label>Telefónne číslo</label>
                      <Field name="phoneNumber" type="text" className='form-control' readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group col-md-6">
                      <label>Emailová adresa</label>
                      <Field name="emailAddress" type="text" className='form-control' readOnly={!isEditMode}/>
                    </div>
                  </div>
                  <div>
                    Trvalý pobyt
                    <div className="row">
                      <div className="form-group col-md-5">
                        <label>Ulica</label>
                        <Field name="permanentResidenceAddress.street" type="text" className='form-control' readOnly={!isEditMode}/>
                      </div>
                      <div className="form-group col-md-2">
                        <label>Číslo domu</label>
                        <Field name="permanentResidenceAddress.houseNumber" type="text" className='form-control' readOnly={!isEditMode}/>
                      </div>
                      <div className="form-group col-md-3">
                        <label>Mesto</label>
                        <Field name="permanentResidenceAddress.city" type="text" className='form-control' readOnly={!isEditMode}/>
                      </div>
                      <div className="form-group col-md-2">
                        <label>PSČ</label>
                        <Field name="permanentResidenceAddress.postalCode" type="text" className='form-control' readOnly={!isEditMode}/>
                      </div>
                    </div>
                  </div>
                  <div>
                    Korešpondečná adresa
                    <div className="row">
                      <div className="form-group col-md-5">
                        <label>Ulica</label>
                        <Field name="correspondenceAddress.street" type="text" className='form-control' readOnly={!isEditMode}/>
                      </div>
                      <div className="form-group col-md-2">
                        <label>Číslo domu</label>
                        <Field name="correspondenceAddress.houseNumber" type="text" className='form-control' readOnly={!isEditMode}/>
                      </div>
                      <div className="form-group col-md-3">
                        <label>Mesto</label>
                        <Field name="correspondenceAddress.city" type="text" className='form-control' readOnly={!isEditMode}/>
                      </div>
                      <div className="form-group col-md-2">
                        <label>PSČ</label>
                        <Field name="correspondenceAddress.postalCode" type="text" className='form-control' readOnly={!isEditMode}/>
                      </div>
                    </div>
                  </div>
                  <div>
                    Iná adresa
                    <div className="row">
                      <div className="form-group col-md-5">
                        <label>Ulica</label>
                        <Field name="casualAddress.street" type="text" className='form-control' readOnly={!isEditMode}/>
                      </div>
                      <div className="form-group col-md-2">
                        <label>Číslo domu</label>
                        <Field name="casualAddress.houseNumber" type="text" className='form-control' readOnly={!isEditMode}/>
                      </div>
                      <div className="form-group col-md-3">
                        <label>Mesto</label>
                        <Field name="casualAddress.city" type="text" className='form-control' readOnly={!isEditMode}/>
                      </div>
                      <div className="form-group col-md-2">
                        <label>PSČ</label>
                        <Field name="casualAddress.postalCode" type="text" className='form-control' readOnly={!isEditMode}/>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="row float-end">
                    {isEditMode &&
                      <div className="form-group">
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                          {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                          Uložiť
                        </button>
                        &nbsp;&nbsp;
                        <button className="btn btn-danger" onClick={() => cancelEditHandler(setFieldValue)}>Zrušiť</button>
                      </div>
                    }
                    {!isEditMode &&
                      <div className="form-group">
                        <button className="btn btn-primary" onClick={() => setIsEditMode(true)}>
                            Upraviť
                        </button>
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
      {!isAddMode && 
        <ListVehicleComponent/>
      }
    </div>
  )
}

export { ClientComponent };