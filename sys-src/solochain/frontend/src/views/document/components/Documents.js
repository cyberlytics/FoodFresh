import React, { useState } from 'react';
import { Row, Column, Tile } from 'carbon-components-react';
import { OrganizationSelector } from '../../../components';
import RegisterDocumentForm from './RegisterDocumentForm';
import DocumentList from './DocumentList';

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
          With the Document module, you can claim ownership of a document and share it with other organizations.
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
          <RegisterDocumentForm accountPair={accountPair}
                                organization={selectedOrganization}
          />
          <br/>
        </Column>
        <Column sm={2} md={4} lg={6}>
          <DocumentList accountPair={accountPair}
                        organization={selectedOrganization}
          />
        </Column>
      </Row>
    </div>
  );
}
