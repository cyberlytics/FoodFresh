/**
 * AssignRevokeRole
 *
 */

import React, { useState } from 'react';
import { TxButton } from '../../../substrate-lib/components';
import { Tile, Dropdown, Form } from 'carbon-components-react';
import { useSubstrate } from '../../../substrate-lib';
import { useRoles } from '../../../hooks';
import { getAccounts } from '../../../utils/Accounts';

export default function Main({ accountPair }) {
  /* State */
  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({
    assignRevoke: null,
    address: null,
    pallet: null,
    permission: null
  });
  const { assignRevoke, address, pallet, permission } = formState;

  /* Hooks */
  const { api, keyring } = useSubstrate();
  useRoles(api, accountPair, setRoles);

  const dropdownAssignRevoke = [
    {text: 'Assign', id: 'assign', type: 'assignRevoke'},
    {text: 'Revoke', id: 'revoke', type: 'assignRevoke'}
  ];

  const dropdownRoles = roles
    .map(r => ({text: `${r.pallet} : ${r.permission}`, id: `${r.pallet}:${r.permission}`, type: 'role'}))
    .sort((a, b) => a.text.localeCompare(b.text));

  let rsRole = null;
  if (pallet && permission) {
    rsRole = api.createType('Role', {
      pallet: pallet,
      permission: api.createType('Permission', permission)
    });
  }

  /* Event handler */
  const onChange = data => {
    (data.selectedItem.type === "role") ?
      setFormState({
        ...formState,
        pallet: data.selectedItem.id.split(':')[0],
        permission: data.selectedItem.id.split(':')[1]
      })
      : setFormState({...formState, [data.selectedItem.type]: data.selectedItem.id})
  };

  const inputChange = event => {
    setFormState({...formState, address: event.selectedItem.id})
  }

  /* Render */
  return (
    <Form>
      <Tile className="white-tile">
        <div className="tile-header">
          Assign / Revoke role
        </div>
        <div className="tile-content">
          <Dropdown
            id="assignment"
            titleText="Assignment"
            label="Select an assignment"
            items={dropdownAssignRevoke}
            itemToString={(item) => (item ? item.text : '')}
            onChange={onChange}
          />
          <br/>
          <Dropdown
            id="permission"
            titleText="Permission"
            label="Select a permission"
            items={dropdownRoles}
            itemToString={(item) => (item ? item.text : '')}
            onChange={onChange}
          />
          <br/>
          <Dropdown
            id="to"
            titleText="To"
            label="Select an account"
            items={getAccounts(keyring)}
            itemToString={(keyringOption) => (keyringOption ? keyringOption.text : '')}
            onChange={inputChange}
          />
        </div>

        <div className="card-bottom">
          <TxButton
            accountPair={accountPair}
            label={`${assignRevoke === 'revoke' ? 'Revoke' : 'Assign'}`}
            setStatus={setStatus}
            style={{display: 'block', float: 'right'}}
            type='SIGNED-TX'
            attrs={{
              palletRpc: 'rbac',
              callable: `${assignRevoke === 'revoke' ? 'revokeAccess' : 'assignRole'}`,
              inputParams: [address, rsRole],
              paramFields: [true, true]
            }}
          />
          <div style={{clear: 'both'}}/>
        </div>
        <div className="status-message">{status}</div>
      </Tile>
    </Form>
  );
};
