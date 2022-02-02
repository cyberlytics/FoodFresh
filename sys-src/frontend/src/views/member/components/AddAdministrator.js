/**
 * AddAdministrator
 *
 */

import React, { useState } from 'react';
import { TxButton } from '../../../substrate-lib/components';
import { Tile, Form, Dropdown } from 'carbon-components-react';
import { useSubstrate } from '../../../substrate-lib';
import { getAccounts } from '../../../utils/Accounts';

export default function Main({ accountPair }) {
  /* State */
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({addressTo: null});
  const { addressTo } = formState;

  /* Hooks */
  const { keyring } = useSubstrate();

  /* Event handler */
  const onAccountChange = event => {
    setFormState({...formState, addressTo: event.selectedItem.id})
  };

  /* Render */
  return (
    <Form>
      <Tile className="white-tile">
        <div className="tile-header">
          Add administrator
        </div>
        <div className="tile-content">
          <Dropdown
            id="account"
            titleText="Account"
            label="Select an account"
            items={getAccounts(keyring)}
            itemToString={(keyringOption) => (keyringOption ? keyringOption.text : '')}
            onChange={onAccountChange}
          />
        </div>
        <div className="card-bottom">
          <TxButton
            accountPair={accountPair}
            label='Add'
            type='SUDO-TX'
            setStatus={setStatus}
            style={{display: 'block', float: 'right'}}
            attrs={{
              palletRpc: 'rbac',
              callable: 'addSuperAdmin',
              inputParams: [addressTo],
              paramFields: [true]
            }}
          />
          <div style={{clear: 'both'}}/>
        </div>
        <div className="status-message">{status}</div>
      </Tile>
    </Form>
  );
};
