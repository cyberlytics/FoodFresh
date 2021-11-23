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
import { white } from "@carbon/colors";

export default function Main (props) {
  const { organization } = props;
  const { api } = useSubstrate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let unsub = null;

    const getProducts = async () => {
      unsub = await api.query.productRegistry.productsOfOrganization(organization, productIds => {
        api.query.productRegistry.products.multi(productIds, products => {
          const validProducts = products
            .filter(product => !product.isNone)
            .map(product => product.unwrap());
          setProducts(validProducts);
        });
      });
    };

    if (organization) {
      getProducts();
    }

    return () => unsub && unsub();
  }, [organization, api, setProducts]);

  if (!products || products.length === 0) {
    return <Message warning style={{borderRadius: 0}}>
      <Message.Header>No product registered for your organisation.</Message.Header>
      <p>Register a product using the form on the left.</p>
    </Message>;
  }

  const rows = products.map(product => {
    const props = product.props.unwrap();
    return {
      id: u8aToString(product.id),
      owner: product.owner.toString(),
      description: u8aToString(props[0].value)
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
    {
      key: 'description',
      header: 'Description',
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
                  <TableCell key={cell.id} style={{ backgroundColor: white }}>{cell.value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DataTable>
  );
}
