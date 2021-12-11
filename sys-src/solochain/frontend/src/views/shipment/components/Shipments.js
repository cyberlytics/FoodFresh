import React, { useState } from 'react';
import { Row, Column, Tile } from 'carbon-components-react';
import OrganizationSelector from '../../../components/OrganizationSelector';
import RegisterShipmentForm from './RegisterShipmentForm';
import ShipmentList from './ShipmentList';

/**
 * Shipments
 * Provides the layout with components of the shipments view.
 *
 * @param props
 * @returns {JSX.Element}
 */
export default function Main(props) {
  const { accountPair } = props;
  const [selectedOrganization, setSelectedOrganization] = useState('');

  return (
    <div>
      <Tile className="white-tile">
        <div className="view-title">
          Shipments
        </div>
        <div className="view-description">
          With the Shipment module, you can register shipments for your products.
        </div>
      </Tile>
      <br/><br/>
      <Row>
        <Column sm={2} md={4} lg={6}>
          <OrganizationSelector
            accountPair={accountPair}
            setSelectedOrganization={setSelectedOrganization}
          />
          <br/>
          <RegisterShipmentForm accountPair={accountPair}
                                organization={selectedOrganization}
          />
        </Column>
        <Column sm={2} md={4} lg={6}>
          <ShipmentList accountPair={accountPair}
                        organization={selectedOrganization}
          />
        </Column>
      </Row>
    </div>
  );
}
