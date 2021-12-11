import React, { useState } from 'react';
import { useRoles } from "../hooks";
import { useSubstrate } from '../substrate-lib';
import { TxButton } from '../substrate-lib/components';
import { Tile, Dropdown, TextInput, Form } from 'carbon-components-react';

export default function Main(props) {
  const { api } = useSubstrate();
  const { accountPair } = props;
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({
    assignRevoke: null,
    address: null,
    pallet: null,
    permission: null
  });
  const [roles] = useRoles(api, accountPair)
  const {assignRevoke, address, pallet, permission} = formState;

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
  const onChange = (data) => {
    (data.selectedItem.type === "role") ?
      setFormState({
        ...formState,
        pallet: data.selectedItem.id.split(':')[0],
        permission: data.selectedItem.id.split(':')[1]
      })
      : setFormState({...formState, [data.selectedItem.type]: data.selectedItem.id})
  };

  const inputChange = (event) => {
    setFormState({...formState, address: event.target.value})
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
            titleText="Assign or Revoke?"
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
          <TextInput
            id="to"
            placeholder="Enter address"
            labelText="To"
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
}
