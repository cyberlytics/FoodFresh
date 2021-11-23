import React, { useState } from 'react';
import { TxButton } from '../substrate-lib/components';
import { Tile, TextInput, Form } from 'carbon-components-react';


export default function Main (props) {
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({ orgName: null });
  const { accountPair } = props;

  const onChange = (e, d) => {
    setFormState({ orgName: e.target.value});
  }

  const { orgName } = formState;

  return (
    <Form>
      <Tile className="card" style={{ maxWidth: '100%' }}>
        <div className="card-header">
          Create organization
        </div>
        <div className="card-content">
          <TextInput
            placeholder="Supply Chain Consortium"
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
