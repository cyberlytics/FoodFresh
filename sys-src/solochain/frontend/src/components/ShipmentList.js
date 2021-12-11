import React, { useEffect, useState } from 'react';
import { Tile } from 'carbon-components-react';
import { u8aToString } from '@polkadot/util';
import { useSubstrate } from '../substrate-lib';
import ListTable from './ListTable';
import ListWarning from './ListWarning';


export default function Main(props) {
  const { api } = useSubstrate();
  const { organization } = props;
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    let unsub = null;

    async function shipments(organization) {
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
      <div className="tile-header">Shipments table</div>
      {
        hasShipments() ?
          <ListWarning message={"No shipments to show here."}/> :
          <ListTable rows={rows} headers={headers}/>
      }
    </Tile>
  );
}
