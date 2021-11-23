import React, { useEffect, useState } from 'react';
import { Message } from 'semantic-ui-react';
import { u8aToString } from '@polkadot/util';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from 'carbon-components-react';

import { useSubstrate } from '../substrate-lib';
import { white } from "@carbon/colors";

export default function Main (props) {
  const { organization } = props;
  const { api } = useSubstrate();
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    let unsub = null;

    async function shipments (organization) {
      unsub = await api.query.productTracking.shipmentsOfOrganization(organization, shipmentIds => {
        api.query.productTracking.shipments.multi(shipmentIds, shipments => {
          const validShipments = shipments
            .filter(shipment => !shipment.isNone)
            .map(shipment => shipment.unwrap());
          setShipments(validShipments);
        });
      });
    }

    if (organization) {
      shipments(organization);
    } else {
      setShipments([]);
    }

    return () => unsub && unsub();
  }, [organization, api.query.productTracking]);

  if (!shipments || shipments.length === 0) {
    return <Message warning style={{borderRadius: 0}}>
      <Message.Header>No shipment registered for your organisation.</Message.Header>
      <p>Please create one using the above form.</p>
    </Message>;
  }

const rows = shipments.map(shipment => {
      const id = u8aToString(shipment.id);
      const products = shipment.products.map(p => u8aToString(p));
      return {
        id: id,
        owner: shipment.owner.toString(),
        status: shipment.status.toString(),
        products: products.map(p => {
          return <div key={`${id}-${p}`}>{p}</div>;
        })
      };
    });

const headers = [
  {
    key: 'id',
    header: 'ID',
  },
  {
    key: 'owner',
    header: 'Sender',
  },
  {
    key: 'status',
    header: 'Status',
  },
  {
    key: 'products',
    header: 'Products',
  },
];

  return <DataTable rows={rows} headers={headers}>
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
  </DataTable>;
}
