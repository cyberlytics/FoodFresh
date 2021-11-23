import React, { useState } from 'react';
import { Row, Column, Tile } from 'carbon-components-react';
import OrganizationSelector from './OrganizationSelector';
import ProductList from './ProductList';
import RegisterProductForm from './RegisterProductForm';

export default function Main(props) {
  const {accountPair} = props;
  const [selectedOrganization, setSelectedOrganization] = useState('');

  return (
    <div>
      <Tile className="white-tile">
        <div className="view-title">
          Products
        </div>
        <div className="view-description">
          Manage products here.
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
                               organization={selectedOrganization}/>
        </Column>
        <Column sm={2} md={4} lg={6}>
          <Tile style={{padding: 0, backgroundColor: "white"}}>
            <div className="card-header">
              Product list
            </div>
          </Tile>
          <ProductList accountPair={accountPair}
                       organization={selectedOrganization}/>
        </Column>
      </Row>
    </div>
  );
}
