import React, { useState } from 'react';
import { TxButton } from '../substrate-lib/components';
import { Tile, TextInput, Form } from 'carbon-components-react';

export default function Main(props) {
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({addressTo: null});
  const {accountPair} = props;

  const onChange = event => {
    setFormState({addressTo: event.target.value});
  }

  const {addressTo} = formState;

  return (
    <Form>
      <Tile className="card" style={{maxWidth: '100%'}}>
        <div className="tile-header">
          Add member to organization
        </div>
        <div className="tile-content">
          <TextInput
            id="member"
            labelText="Member"
            type='text'
            placeholder='Enter address'
            state='addressTo'
            onChange={onChange}
          />
        </div>
        <div className="card-bottom">
          <TxButton
            accountPair={accountPair}
            label='Add'
            type='SIGNED-TX'
            setStatus={setStatus}
            style={{display: 'block', float: 'right'}}
            attrs={{
              palletRpc: 'registrar',
              callable: 'addToOrganization',
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
