import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import Dashboard from './views/dashboard';
import Document from './views/document'
import Organization from './views/organization'
import Member from './views/member'
import Trace from './views/trace'
import Shipment from './views/shipment'
import Product from './views/product'
import './index.scss';

export default function App () {
  return (
    <Router>
      <Switch>
        <Route path="/dashboard/organization" component={Organization}/>
        <Route path="/dashboard/member" component={Member}/>
        <Route path="/dashboard/trace" component={Trace}/>
        <Route path="/dashboard/shipment" component={Shipment}/>
        <Route path="/dashboard/product" component={Product}/>
        <Route path="/dashboard/document" component={Document}/>
        <Route path="/" component={Dashboard}/>
      </Switch>
    </Router>
  );
}
