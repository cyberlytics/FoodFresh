/**
 * OrganizationSelector
 *
 */

import React, { useState } from 'react';
import { Form, Tile, Dropdown } from 'carbon-components-react';
import { useSubstrate } from '../substrate-lib';
import { useOrganization } from '../hooks';

export default function Main(props) {
  const { api } = useSubstrate();
  const { accountPair, setSelectedOrganization } = props;
  const [organizations, setOrganizations] = useState([]);
  useOrganization(api, accountPair, setOrganizations, setSelectedOrganization);

  return (
    <Form>
      <Tile className="white-tile">
        <div className="tile-header">
          Organization
        </div>
        <div className="tile-content">
          <Dropdown
            id="organization"
            label='Select an organization'
            items={organizations}
            selectedItem={organizations[0]}
            itemToString={(item) => (item ? item.text : '')}
            onChange={(event) => setSelectedOrganization(event.selectedItem.id)}
          />
        </div>
      </Tile>
    </Form>
  );
};
