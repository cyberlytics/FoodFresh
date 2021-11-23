import React, { useState } from 'react';
import { TxButton } from '../substrate-lib/components';
import {
  Form,
  FileUploaderDropContainer,
  Tile,
  TextInput
} from 'carbon-components-react';

export default function Main(props) {
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({ title: null });
  const { accountPair } = props;

  const onChange = (event) => {
    setFormState({...formState, title: event.target.value})
  };

  return (
    <Form>
      <Tile className="card" style={{maxWidth: '100%'}}>
        <div className="card-header">
          Document
        </div>
        <div className="card-content" style={{fontWeight: '300', fontSize: '14px'}}>
          <TextInput
            placeholder="Enter document title"
            labelText="Title"
            onChange={onChange}
          />
          <br/>
          <FileUploaderDropContainer
            accept={[
              '.jpg',
              '.png',
              '.pdf'
            ]}
            buttonKind="primary"
            buttonLabel="Add files"
            filenameStatus="edit"
            iconDescription="Clear file"
            style={{maxWidth: '100%' }}
            labelText="Add the PDF, or image (JPEG, PNG) file of this document (1MB maximum)"
          />
          <br/>
          <TextInput
            placeholder="Select organization to share this document with."
            labelText="Sharing (optional)"
            onChange={onChange}
          />
        </div>
        <div className="card-bottom">

          <TxButton
            accountPair={accountPair}
            label='Add'
            type='SIGNED-TX'
            setStatus={setStatus}
            style={{
              display: 'block',
              float: 'right',
            }}
            attrs={{
              palletRpc: 'document',
              callable: 'addDocument',
              inputParams: [],
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
