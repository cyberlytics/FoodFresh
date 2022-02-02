/**
 * ShipmentList
 *
 */

import React, { useState } from 'react';
import { Tile } from 'carbon-components-react';
import { u8aToString } from '@polkadot/util';
import { useSubstrate } from '../../../substrate-lib';
import { ListTable, ListWarning } from '../../../components';
import { useShipmentsList } from '../../../hooks/useShipment'

export default function Main({ organization }) {
  /* State */
  const [shipments, setShipments] = useState([]);

  /* Hooks */
  const { api } = useSubstrate();
  useShipmentsList(api, organization, setShipments)

  /* Data table content */
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

  const hasShipments = () => !shipments || shipments.length === 0;

  return (
    <Tile style={{padding: 0, backgroundColor: "white"}}>
      <div className="tile-header">Shipments list</div>
      {
        hasShipments() ?
          <ListWarning message={"No shipments to show here."}/> :
          <ListTable rows={rows} headers={headers}/>
      }
    </Tile>
  );
};
