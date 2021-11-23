import React, { useState } from 'react';
import { Row, Column, Tile } from 'carbon-components-react';
import OrganizationSelector from './OrganizationSelector';
import ShipmentSelection from './ShipmentSelection';
import ShipmentDetails from './ShipmentDetails';

export default function Main(props) {
  const {accountPair} = props;
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedShipment, setSelectedShipment] = useState('');

  return (
    <div>
      <Tile className="white-tile">
        <div className="view-title">
          Tracking
        </div>
        <div className="view-description">
          Track shipments here.
        </div>
      </Tile>
      <br/><br/>

      <Row>
        <Column sm={2} md={4} lg={6}>
          <OrganizationSelector accountPair={accountPair}
                                setSelectedOrganization={setSelectedOrganization}/>
        </Column>
        <Column sm={2} md={4} lg={6}>
          <ShipmentSelection accountPair={accountPair}
                             organization={selectedOrganization}
                             setSelectedShipment={setSelectedShipment}/>
        </Column>
      </Row>
      <Row>
        <ShipmentDetails accountPair={accountPair} shipmentId={selectedShipment}/>
      </Row>
      <br/>
    </div>
  );
}
