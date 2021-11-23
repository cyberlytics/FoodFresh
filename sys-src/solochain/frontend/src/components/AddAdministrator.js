import React, { useState } from 'react';
import { TxButton } from '../substrate-lib/components';

import { Tile, TextInput, Form } from 'carbon-components-react';

export default function Main(props) {
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({addressTo: null});
  const {accountPair} = props;

  const onChange = (event) => {
    setFormState({...formState, addressTo: event.target.value})
  };

  const {addressTo} = formState;

  return (
    <Form>
      <Tile className="white-tile">
        <div className="card-header">
          Add administrator
        </div>
        <div className="card-content">
          <TextInput
            placeholder="Address"
            labelText="Member"
            onChange={onChange}
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
}
