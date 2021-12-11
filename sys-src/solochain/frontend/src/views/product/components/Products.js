import React, { useState } from 'react';
import { Row, Column, Tile } from 'carbon-components-react';
import OrganizationSelector from '../../../components/OrganizationSelector';
import ProductList from './ProductList';
import RegisterProductForm from './RegisterProductForm';


export default function Main(props) {
  const { accountPair } = props;
  const [selectedOrganization, setSelectedOrganization] = useState('');

  return (
    <div>
      <Tile className="white-tile">
        <div className="view-title">
          Products
        </div>
        <div className="view-description">
          With the Product module, you can register your trade items.
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
          <RegisterProductForm accountPair={accountPair}
                               organization={selectedOrganization}
          />
        </Column>
        <Column sm={2} md={4} lg={6}>
          <ProductList accountPair={accountPair}
                       organization={selectedOrganization}
          />
        </Column>
      </Row>
    </div>
  );
}
