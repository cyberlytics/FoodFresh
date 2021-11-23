import React, { useEffect, useState } from 'react';
import { Message } from 'semantic-ui-react';
import { u8aToString } from '@polkadot/util';

import { useSubstrate } from '../substrate-lib';
import {
  DataTable,
  TableBody,
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "carbon-components-react";

export default function Main (props) {
  const { organization } = props;
  const { api } = useSubstrate();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    let unsub = null;

    const getProducts = async () => {
      unsub = await api.query.productRegistry.productsOfOrganization(organization, productIds => {
        api.query.productRegistry.products.multi(productIds, products => {
          const validProducts = products
            .filter(product => !product.isNone)
            .map(product => product.unwrap());
          setDocuments(validProducts);
        });
      });
    };

    if (organization) {
      getProducts();
    }

    return () => unsub && unsub();
  }, [organization, api, setDocuments]);

  if (!documents || documents.length === 0) {
    return <Message warning style={{borderRadius: 0}}>
      <Message.Header>No documents available for your organisation.</Message.Header>
      <p>Add a document using the form on the left.</p>
    </Message>;
  }

  const rows = documents.map(document => {
    return {
      id: u8aToString(document.id),
      owner: document.owner.toString(),
    };
  });

  const headers = [
    {
      key: 'id',
      header: 'ID',
    },
    {
      key: 'owner',
      header: 'Organization',
    },
  ];

  return (
    <DataTable rows={rows} headers={headers} isSortable>
      {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableHeader {...getHeaderProps({ header })}>
                  {header.header}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow {...getRowProps({ row })}>
                {row.cells.map((cell) => (
                  <TableCell key={cell.id}>{cell.value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DataTable>
  );
}
