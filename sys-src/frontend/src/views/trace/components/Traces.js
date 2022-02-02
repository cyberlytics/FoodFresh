/**
 * Traces
 *
 */

import React, { useState } from 'react';
import { Row, Column, Tile } from 'carbon-components-react';
import { OrganizationSelector } from '../../../components';
import ShipmentSelector from './ShipmentSelector';
import ShipmentDetails from './ShipmentDetails';

export default function Main({ accountPair }) {
  /* State */
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedShipment, setSelectedShipment] = useState('');

  /* Render */
  return (
    <div>
      <Tile className="white-tile">
        <div className="view-title">
          Traces
        </div>
        <div className="view-description">
          With the Trace module, you can trace the shipments of your products.
        </div>
      </Tile>
      <br/><br/>
      <Row>
        <Column sm={2} md={4} lg={6}>
          <OrganizationSelector accountPair={accountPair}
                                setSelectedOrganization={setSelectedOrganization}
          />
        </Column>
        <Column sm={2} md={4} lg={6}>
          <ShipmentSelector accountPair={accountPair}
                            organization={selectedOrganization}
                            setSelectedShipment={setSelectedShipment}
          />
        </Column>
      </Row>
      <br/><br/>
      <Row>
        <Column>
          <ShipmentDetails accountPair={accountPair}
                           shipmentId={selectedShipment}
          />
        </Column>
      </Row>
      <br/>
    </div>
  );
};
