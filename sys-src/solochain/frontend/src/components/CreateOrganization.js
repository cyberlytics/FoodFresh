import React, { useState } from 'react';
import { TxButton } from '../substrate-lib/components';
import { Tile, TextInput, Form } from 'carbon-components-react';


export default function Main (props) {
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({ orgName: null });
  const { accountPair } = props;

  const onChange = event => {
    setFormState({ orgName: event.target.value});
  }

  const { orgName } = formState;

  return (
    <Form>
      <Tile className="card" style={{ maxWidth: '100%' }}>
        <div className="tile-header">
          Create organization
        </div>
        <div className="tile-content">
          <TextInput
            id="orgName"
            placeholder="Enter name"
            labelText="Name"
            state='orgName'
            onChange={onChange}
          />
        </div>
        <div className="card-bottom">
          <TxButton
              accountPair={accountPair}
              label='Create'
              type='SIGNED-TX'
              setStatus={setStatus}
              style={{display: 'block', float: 'right'}}
              attrs={{
                palletRpc: 'registrar',
                callable: 'createOrganization',
                inputParams: [orgName],
                paramFields: [true]
              }}
            />
          <div style={{clear: 'both'}}/>
        </div>
        <div className="status-message">{status}</div>
      </Tile>
    
  </Form>);
}
