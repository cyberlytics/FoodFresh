import React from 'react';
import { Row, Column, Tile } from 'carbon-components-react';
import AddToOrganization from './AddToOrganization';
import CreateOrganization from './CreateOrganization';

export default function Main (props) {
  const { accountPair } = props;

  return <div>
    <Tile className="card" style={{ maxWidth: '100%' }}>
      <div className="view-title">
        Organizations
      </div>
      <div className="view-description">
        With the Organization module, you can manage your organizations.
      </div>
    </Tile>
    <br/><br/>
    <Row>
      <Column sm={2} md={4} lg={6}>
        <CreateOrganization accountPair={accountPair} />
      </Column>
      <Column sm={2} md={4} lg={6}>
        <AddToOrganization accountPair={accountPair} />
      </Column>
    </Row>
  </div>;
}
