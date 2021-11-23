import React from 'react';

import CreateRole from './CreateRole';
import AssignRevokeRole from './AssignRevokeRole';
import AddSuperAdmin from './AddAdministrator';

import { Row, Column, Tile } from 'carbon-components-react';

export default function Main(props) {
  const {accountPair} = props;

  return (
    <div>
      <Tile className="white-tile">
        <div className="view-title">
          Members
        </div>
        <div className="view-description">
          Manage participating members and their permissions.
        </div>
      </Tile>

      <br/><br/>

      <Row>
        <Column sm={1} md={2} lg={4}>
          <CreateRole accountPair={accountPair}/>
        </Column>
        <Column sm={1} md={2} lg={4}>
          <AssignRevokeRole accountPair={accountPair}/>
        </Column>
        <Column sm={1} md={2} lg={4}>
          <AddSuperAdmin accountPair={accountPair}/>
        </Column>
      </Row>

    </div>
  );
}
