import React, { useState } from 'react';
import { Row, Column, Tile } from 'carbon-components-react';
import AddDocument from './AddDocument';
import DocumentList from './DocumentList';
import OrganizationSelector from "./OrganizationSelector";

export default function Main (props) {
  const { accountPair } = props;
  const [selectedOrganization, setSelectedOrganization] = useState('');

  return (
    <div>
      <Tile className="white-tile">
        <div className="view-title">
          Documents
        </div>
        <div className="view-description">
          Manage documents here.
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
          <AddDocument accountPair={accountPair}
                       organization={selectedOrganization}/>
        </Column>
        <Column sm={2} md={4} lg={6}>
          <DocumentList accountPair={accountPair}
                        organization={selectedOrganization}/>
        </Column>
      </Row>
    </div>
  );
}
