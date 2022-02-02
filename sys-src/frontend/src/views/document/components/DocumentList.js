/**
 * DocumentList
 *
 */

import React, { useState } from 'react';
import { Tile } from 'carbon-components-react';
import { useSubstrate } from '../../../substrate-lib';
import { useDocuments } from '../../../hooks';
import { ListTable, ListWarning } from '../../../components';

export default function Main({ organization }) {
  /* State */
  const [documents, setDocuments] = useState([]);

  /* Hooks */
  const { api, keyring } = useSubstrate();
  useDocuments(api, keyring, organization, setDocuments);

  /* Data table content */
  const rows = documents.map(organization => {
    return {
      id: organization.id,
      title: organization.title,
      owner: organization.owner,
      name: organization.name
    };
  });

  const headers = [
    {
      key: 'id',
      header: 'Id',
    },
    {
      key: 'title',
      header: 'Title',
    },
    {
      key: 'owner',
      header: 'Owner',
    },
    {
      key: 'name',
      header: 'Shared with',
    },
  ];

  const hasDocuments = () => !documents || documents.length === 0;

  return (
    <Tile style={{ padding: 0, backgroundColor: "white" }}>
      <div className="tile-header">Documents list</div>
      {
        hasDocuments() ?
          <ListWarning message={"No documents to show here."}/> :
          <ListTable rows={rows} headers={headers}/>
      }
    </Tile>
  );
};
