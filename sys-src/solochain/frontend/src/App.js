import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import Dashboard from './views/Dashboard';
import Organization from './views/Organization'
import Member from './views/Member'
import Tracking from './views/Tracking'
import Shipment from './views/Shipment'
import Product from './views/Product'
import Document from './views/Document'
import './index.scss';

export default function App () {
  return (
    <Router>
      <Switch>
        <Route path="/dashboard/organization" component={Organization}/>
        <Route path="/dashboard/member" component={Member}/>
        <Route path="/dashboard/trace" component={Tracking}/>
        <Route path="/dashboard/shipment" component={Shipment}/>
        <Route path="/dashboard/product" component={Product}/>
        <Route path="/dashboard/document" component={Document}/>
        <Route path="/" component={Dashboard}/>
      </Switch>
    </Router>
  );
}
