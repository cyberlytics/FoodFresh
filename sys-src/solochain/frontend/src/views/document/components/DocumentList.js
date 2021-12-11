import React from 'react';
import { Tile } from "carbon-components-react";
import { useSubstrate } from '../../../substrate-lib';
import { useDocuments } from "../../../hooks";
import { ListTable, ListWarning } from '../../../components';


export default function Main(props) {
  const { organization } = props;
  const { api, keyring } = useSubstrate();
  const [sharedDocuments] = useDocuments(api, keyring, organization)

  const rows = sharedDocuments.map(organization => {
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

  const hasDocuments = () => !sharedDocuments || sharedDocuments.length === 0;

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
}
