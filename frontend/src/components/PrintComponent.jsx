import React, { useEffect, useState } from "react";
import ClientService from "../services/ClientService";

function PrintComponent({match}) {
  const { clientId, vehicleId } = match.params;
  const [client, setClient] = useState({});
  const [vehicle, setVehicle] = useState({});
  const [pzp, setPzp] = useState();
  const [casco, setCasco] = useState();
  const [gap, setGap] = useState();

  useEffect(() => {
    document.getElementById('nav').hidden = true;
  }, []);

  useEffect(() => {
    ClientService.getClientById(clientId)
    .then(res => {
      console.log(res.data);
      let c = res.data;
      // format dates
      if(c.identificationCardExpDate != null) {
        let d = new Date(c.identificationCardExpDate).toISOString().slice(0, 10).split('-').reverse().join('.');
        c.identificationCardExpDate = d;
      }
      // Set Vehicle
      c.vehicles.forEach(v => {
        if(v.id == vehicleId) {
          let vehicleCopy = {...v};
          setVehicle(vehicleCopy);
        }
      });
      setClient(c);
    })
  }, []);

  useEffect(() => {
      vehicle?.insurances?.forEach(i => {
      let iCopy = {...i};
      if(iCopy.validFrom) {
        iCopy.validFrom = new Date(iCopy.validFrom).toISOString().slice(0,10).split('-').reverse().join('.');
      }
      // PZP
      if(iCopy.type == 'pzp') {
        setPzp(iCopy);
      }
      // CASCO
      if(iCopy.type == 'casco') {
        setCasco(iCopy);
      }
      // GAP
      if(iCopy.type == 'gap') {
        setGap(iCopy);
      }
      });
  }, [vehicle]);

  return (
    <div className="row">
      <h4 className="text-center">Informácie o klientovi</h4>
        <div className="col-6">
          <dl className="row">
            <dt className="col-4">Celé meno</dt>
            <dd className="col-8">{client.title} {client.firstName} {client.lastName}</dd>

            <dt className="col-4">Email</dt>
            <dd className="col-8">{client.emailAddress}</dd>

            <dt className="col-4">Telefon</dt>
            <dd className="col-8">{client.phoneNumber}</dd>
          </dl>
        </div>
        <div className="col-6">
          <dl className="row">
            <dt className="col-4">Rodné číslo</dt>
            <dd className="col-8">{client.identificationNumber}</dd>

            <dt className="col-4">Číslo OP/pas</dt>
            <dd className="col-8">{client.identificationCardNumber}</dd>

            <dt className="col-4">Platnosť OP</dt>
            <dd className="col-8">{client.identificationCardExpDate}</dd>
          </dl>
        </div>
        <dl className="row">
          {client.permanentResidenceAddress && 
            <div style={{display: "flex"}}>
              <dt className="col-4">Trvalý pobyt</dt>
              <dd className="col-8">{client.permanentResidenceAddress.street} {client.permanentResidenceAddress.houseNumber}, {client.permanentResidenceAddress.postalCode} {client.permanentResidenceAddress.city}</dd>
            </div>
          } 
          {client.correspondenceAddress &&
            <div style={{display: "flex"}}>
              <dt className="col-4">Korešpondenčná adresa</dt>
              <dd className="col-8">{client.correspondenceAddress.street} {client.correspondenceAddress.houseNumber}, {client.correspondenceAddress.postalCode} {client.correspondenceAddress.city}</dd>
            </div>
          }
         {client.casualAddress &&
          <div style={{display: "flex"}}>
            <dt className="col-4">Bežná adresa</dt>
            <dd className="col-8">{client.casualAddress.street} {client.casualAddress.houseNumber}, {client.casualAddress.postalCode} {client.casualAddress.city}</dd>
          </div>
         }
        </dl>


        <h4 className="text-center">Informácie o vozidle</h4>
        <div className="col-6">
          <dl className="row">
            <dt className="col-4">Značka</dt>
            <dd className="col-8">{vehicle.brand}</dd>

            <dt className="col-4">Model</dt>
            <dd className="col-8">{vehicle.model}</dd>

            <dt className="col-4">Vyrobené</dt>
            <dd className="col-8">{vehicle.dateMade}</dd>

            <dt className="col-4">Objem</dt>
            <dd className="col-8">{vehicle.volume}</dd>

            <dt className="col-4">Výkon</dt>
            <dd className="col-8">{vehicle.power}</dd>

            <dt className="col-4">Farba</dt>
            <dd className="col-8">{vehicle.color}</dd>

            <dt className="col-4">Palivo</dt>
            <dd className="col-8">{vehicle.fuel}</dd>
          </dl>
        </div>
        <div className="col-6">
          <dl className="row">
            <dt className="col-4">ŠPZ</dt>
            <dd className="col-8">{vehicle.licensePlateNumber}</dd>

            <dt className="col-4">Technický</dt>
            <dd className="col-8">{vehicle.technicalCardNo}</dd>

            <dt className="col-4">Hmotnosť</dt>
            <dd className="col-8">{vehicle.weight}</dd>

            <dt className="col-4">Typ</dt>
            <dd className="col-8">{vehicle.type}</dd>

            <dt className="col-4">Prevodovka</dt>
            <dd className="col-8">{vehicle.gearBox}</dd>

            <dt className="col-4">VIN</dt>
            <dd className="col-8">{vehicle.vin}</dd>
          </dl>
        </div>
        <dl className="row">
          <dt className="col-2">Poznámky</dt>
          <dd className="col-10">{vehicle.notes}</dd>
        </dl>
        
        {pzp &&
        <div className="row">
          <h4 className="text-center">PZP</h4>
            <div className="col-6">
              <dl className="row">
                <dt className="col-4">Poisťovňa</dt>
                 <dd className="col-8">{pzp.companyName}</dd>

                 <dt className="col-4">Číslo návrhu</dt>
                 <dd className="col-8">{pzp.proposalNumber}</dd>

                 <dt className="col-4">Číslo zmluvy</dt>
                 <dd className="col-8">{pzp.contractNumber}</dd>

                 <dt className="col-4">Platné od do</dt>
                 <dd className="col-8">{pzp.validFrom} - {pzp.validUntil}</dd>
               </dl>
             </div>
             <div className="col-6">
               <dl className="row">
                 <dt className="col-4">Poistné obd.</dt>
                 {pzp.interval == '3' &&
                  <dd className="col-8">Štvrťročná</dd>
                }
                {pzp.interval == '6' &&
                  <dd className="col-8">Polročná</dd>
                }
                {pzp.interval == '12' &&
                  <dd className="col-8">Ročná</dd>
                }
        
                <dt className="col-4">Poistné</dt>
                <dd className="col-8">{pzp.price}</dd>
              </dl>
            </div>
            <dl className="row">
              <dt className="col-2">Poznámky</dt>
              <dd className="col-10">{pzp.notes}</dd>
            </dl>
          </div>
        }
        {casco &&
        <div className="row">
        <h4 className="text-center">CASCO</h4>
        <div className="col-6">
          <dl className="row">
            <dt className="col-4">Poisťovňa</dt>
            <dd className="col-8">{casco.companyName}</dd>

            <dt className="col-4">Číslo návrhu</dt>
            <dd className="col-8">{casco.proposalNumber}</dd>

            <dt className="col-4">Číslo zmluvy</dt>
            <dd className="col-8">{casco.contractNumber}</dd>

            <dt className="col-4">Platné od do</dt>
            <dd className="col-8">{casco.validFrom} - {casco.valid}</dd>
          </dl>
        </div>
        <div className="col-6">
          <dl className="row">
            <dt className="col-4">Cena vozidla</dt>
            <dd className="col-8">{casco.vehicleValue}</dd>
            
            <dt className="col-4">Najazdené</dt>
            <dd className="col-8">{casco.distanceDriven}</dd>

            <dt className="col-4">Poistné obd.</dt>
            <dd className="col-8">{casco.interval}</dd>

            <dt className="col-4">Poistné</dt>
            <dd className="col-8">{casco.price}</dd>
          </dl>
        </div>
        <dl className="row">
          <dt className="col-2">Poznámky</dt>
          <dd className="col-10">{casco.notes}</dd>
        </dl>
        </div>
        }

        {gap && 
        <div className="row">
        <h4 className="text-center">GAP</h4>
        <div className="col-6">
          <dl className="row">
            <dt className="col-4">Poisťovňa</dt>
            <dd className="col-8">{gap.companyName}</dd>

            <dt className="col-4">Číslo návrhu</dt>
            <dd className="col-8">{gap.proposalNumber}</dd>

            <dt className="col-4">Číslo zmluvy</dt>
            <dd className="col-8">{gap.contractNumber}</dd>

            <dt className="col-4">Platné od</dt>
            <dd className="col-8">{gap.validFrom}</dd>
          </dl>
        </div>
        <div className="col-6">
          <dl className="row">
            <dt className="col-4">Poistné obd.</dt>
            <dd className="col-8">{gap.interval}</dd>
            
            <dt className="col-4">Poistné</dt>
            <dd className="col-8">{gap.price}</dd>

            <dt className="col-4">Poistná suma</dt>
            <dd className="col-8">{gap.valueCoverage}</dd>
          </dl>
        </div>
        <dl className="row">
          <dt className="col-2">Poznámky</dt>
          <dd className="col-10">{gap.notes}</dd>
        </dl>
        </div>
        }
    </div>
  )
}

export { PrintComponent }