import React from 'react';
import { Row, Column, Tile } from 'carbon-components-react';

import AddToOrg from './AddToOrganization';
import CreateOrg from './CreateOrganization';

export default function Main (props) {
  const { accountPair } = props;

  return <div>
    <Tile className="card" style={{ maxWidth: '100%' }}>
      <div className="view-title">
        Organizations
      </div>
      <div className="view-description">
        Manage participating organisations.
      </div>
    </Tile>

    <br/><br/>

    <Row>
      <Column sm={2} md={4} lg={6}>
        <CreateOrg accountPair={accountPair} />
      </Column>
      <Column sm={2} md={4} lg={6}>
        <AddToOrg accountPair={accountPair} />
      </Column>
    </Row>
  </div>;
}
