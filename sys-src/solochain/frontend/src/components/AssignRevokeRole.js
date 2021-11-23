import React, { useEffect, useState } from 'react';
import { hexToString } from '@polkadot/util';

import { Tile, Dropdown, TextInput, Form } from 'carbon-components-react';

import { useSubstrate } from '../substrate-lib';
import { TxButton } from '../substrate-lib/components';

export default function Main(props) {
  const {api} = useSubstrate();
  const {accountPair} = props;
  const [status, setStatus] = useState(null);
  const [roles, setRoles] = useState([]);
  const [formState, setFormState] = useState({
    assignRevoke: null, address: null, pallet: null, permission: null
  });

  useEffect(() => {
    let unsub = null;

    const getRoles = async () => {
      unsub = await api.query.rbac.roles(rawRoles => {
        const roles = rawRoles
          .map(r => r.toJSON())
          .map(r => ({...r, pallet: hexToString(r.pallet)}));
        setRoles(roles);
      });
    };

    if (accountPair) getRoles();
    return () => unsub && unsub();
  }, [accountPair, api, setRoles]);

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

  const dropdownAssignRevoke = [
    {text: 'Assign', id: 'assign', type: 'assignRevoke'},
    {text: 'Revoke', id: 'revoke', type: 'assignRevoke'}
  ];

  const dropdownRoles = roles
    .map(r => ({text: `${r.pallet} : ${r.permission}`, id: `${r.pallet}:${r.permission}`, type: 'role'}))
    .sort((a, b) => a.text.localeCompare(b.text));

  const {assignRevoke, address, pallet, permission} = formState;

  let rsRole = null;
  if (pallet && permission) {
    rsRole = api.createType('Role', {
      pallet: pallet,
      permission: api.createType('Permission', permission)
    });
  }

  return (
    <Form>
      <Tile className="white-tile">
        <div className="card-header">
          Assign / Revoke role
        </div>
        <div className="card-content">
          <Dropdown
            titleText="Assign or Revoke?"
            label="Select an assignment"
            items={dropdownAssignRevoke}
            itemToString={(item) => (item ? item.text : '')}
            onChange={onChange}
          />
          <br/>
          <Dropdown
            titleText="Permission"
            label="Select a permission"
            items={dropdownRoles}
            itemToString={(item) => (item ? item.text : '')}
            onChange={onChange}
          />
          <br/>
          <TextInput
            placeholder="Address"
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
