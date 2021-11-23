import React, { useState } from 'react';

import OrganizationSelector from './OrganizationSelector';
import RegisterShipmentForm from './RegisterShipmentForm';
import ShipmentList from './ShipmentList';

import { Row, Column, Tile } from 'carbon-components-react';

export default function Main(props) {
  const {accountPair} = props;
  const [selectedOrganization, setSelectedOrganization] = useState('');

  return (
    <div>
      <Tile className="white-tile">
        <div className="view-title">
          Shipments
        </div>
        <div className="view-description">
          Manage shipments here.
        </div>
      </Tile>
      <br/>
      <Row style={{marginTop: '10px'}}>
        <Column sm={2} md={4} lg={6}>
          <OrganizationSelector
            accountPair={accountPair}
            setSelectedOrganization={setSelectedOrganization}
          />
          <br/>
          <RegisterShipmentForm accountPair={accountPair}
                                organization={selectedOrganization}/>
        </Column>
        <Column sm={2} md={4} lg={6}>
          <Tile className="white-tile">
            <div className="card-header">
              Shipments list
            </div>
          </Tile>
          <ShipmentList accountPair={accountPair}
                        organization={selectedOrganization}/>
        </Column>
      </Row>
    </div>
  );
}
