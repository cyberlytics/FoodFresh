/**
 * RegisterDocumentForm
 *
 */

import React, { useState } from 'react';
import { stringToHex } from '@polkadot/util';
import { TxButton } from '../../../substrate-lib/components';
import { useSubstrate } from '../../../substrate-lib';
import { useOrganizations } from '../../../hooks';
import {
  Form,
  FileUploaderDropContainer,
  Tile,
  TextInput,
  Dropdown
} from 'carbon-components-react';
import XXH from 'xxhashjs';

export default function Main({ accountPair, organization }) {
  /* State */
  const [status, setStatus] = useState([]);
  const [documentID, setDocumentID] = useState(1);
  const [organizations, setOrganizations] = useState([]);
  const [formState, setFormState] = useState({
    id: null,
    title: null,
    organization: null,
    document_file: null
  });

  /* Hooks */
  const { api } = useSubstrate();
  useOrganizations(api, accountPair, setOrganizations);

  const getDocumentsId = async () => {
    await api.query.documentRegistry.documentsOfOrganization(organization, documentIds => {
      api.query.documentRegistry.documents.multi(documentIds, documents => {
        const validDocuments = documents
          .filter(document => !document.isNone)
          .map(document => document.unwrap());
        setDocumentID(validDocuments.length + 1);
      });
    });
  };

  /* Event handler */
  const onTitleChange = event => {
    getDocumentsId();
    const newTitle = (event.target.value.length === 0 ? null : [['0x64657363', stringToHex(event.target.value)]]);
    setFormState({...formState, id: stringToHex(documentID), title: newTitle});
  };

  const onSharingChange = data => {
    getDocumentsId();
    setFormState({
      ...formState,
      id: stringToHex(documentID),
      organization: stringToHex(data.selectedItem.value)
    })
  };

  const onInputFileChange = (e) => {
    const file = e.target.files[0];
    const newParams = { ...formState };

    getDocumentsId();

    newParams.id = stringToHex(documentID);

    if (file) {
      let fileReader = new FileReader();
      fileReader.onloadend = e => {
        const fileContents = new Uint8Array(e.target.result);
        newParams.document_file = stringToHex('0x' + XXH.h64(fileContents.buffer, 0).toString(16));
      };
      fileReader.readAsArrayBuffer(file);
      setFormState(newParams);
    }
  };

  /* Render */
  return (
    <Form>
      <Tile className="card" style={{maxWidth: '100%'}}>
        <div className="tile-header">
          Register document
        </div>
        <div className="tile-content" style={{fontWeight: '300', fontSize: '14px'}}>
          <TextInput
            id="title"
            placeholder="Enter document title"
            labelText="Title"
            onChange={onTitleChange}
          />
          <br/>
          <FileUploaderDropContainer
            accept={[
              '.pdf',
              '.jpg',
              '.png'
            ]}
            style={{maxWidth: '100%' }}
            buttonKind="tertiary"
            buttonLabel="Add files"
            filenameStatus="edit"
            iconDescription="Clear file"
            labelText="Drag and drop or click to upload the PDF, or image (JPG, PNG) of this document."
            onAddFiles={onInputFileChange}
          />
          <br/>
          <Dropdown
            id="default"
            titleText="Share"
            label="Select an organization"
            items={organizations}
            itemToString={(item) => (item ? item.text : '')}
            onChange={onSharingChange}
          />
        </div>
        <div className="card-bottom">
          <TxButton
            accountPair={accountPair}
            label='Register'
            type='SIGNED-TX'
            style={{ display: 'block', float: 'right' }}
            setStatus={setStatus}
            attrs={{
              palletRpc: 'documentRegistry',
              callable: 'registerDocument',
              inputParams: [formState.id, organization, formState.title, formState.organization, formState.document_file],
              paramFields: [true, true, true, false, true]
            }}
          />
          <div style={{clear: 'both'}}/>
        </div>
        <div className="status-message">{status}</div>
      </Tile>
    </Form>
  );
};
