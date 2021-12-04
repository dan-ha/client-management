import React from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { Nav } from './components/Nav'
import { ListClientComponent } from './components/ListClientComponent';
import { ClientComponent } from './components/ClientComponent';
import { VehicleComponent } from './components/VehicleComponent';
import { PrintComponent } from './components/PrintComponent';
import { ClientGroupComponent } from './components/ClientGroupComponent';

function App() {

  return (
    <div>        
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar pauseOnFocusLoss={false} draggable={false} pauseOnHover={false}/>
      <Router >
        <Nav/>
        <div className="container">
          <Switch>
            <Route path="/" exact component={ListClientComponent}></Route>
            <Route path="/clients/" component={ListClientComponent}></Route>
            <Route path="/clientGroup" component={ClientGroupComponent}></Route>
            <Route path="/client/:clientId/vehicle/:vehicleId/print" component={PrintComponent}></Route>
            <Route path="/client/:clientId/vehicle/:vehicleId" component={VehicleComponent}></Route>
            <Route path="/client/:clientId" component={ClientComponent}></Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
