/**
 * Members
 *
 */

import React from 'react';
import { Row, Column, Tile } from 'carbon-components-react';
import CreateRole from './CreateRole';
import AssignRevokeRole from './AssignRevokeRole';
import AddSuperAdmin from './AddAdministrator';

export default function Main({ accountPair }) {
  return (
    <div>
      <Tile className="white-tile">
        <div className="view-title">
          Members
        </div>
        <div className="view-description">
          With the Member module, you can manage the permissions of participating members.
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
};
