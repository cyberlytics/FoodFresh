import React, { useEffect, useState } from 'react';
import { List, Message } from 'semantic-ui-react';
import { Tile } from "carbon-components-react";
import { useSubstrate } from '../substrate-lib';
import { hexToString } from '@polkadot/util';

export default function Main (props) {
  const { api } = useSubstrate();
  const { organization, setSelectedShipment } = props;
  const [shipments, setShipments] = useState([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    let unsub = null;

    async function shipments (organization) {
      unsub = await api.query.productTracking.shipmentsOfOrganization(organization, data => {
        setShipments(data);
        setSelectedShipment('');
        setSelected('');
      });
    }

    if (organization) {
      shipments(organization);
    } else {
      setShipments([]);
      setSelectedShipment('');
      setSelected('');
    }

    return () => unsub && unsub();
  }, [organization, api.query.productTracking, setSelectedShipment]);

  const handleSelectionClick = (ev, { data }) => {
    const shipment = hexToString(shipments[data].toString());
    setSelectedShipment(shipment);
    setSelected(shipment);
  };

  if (!shipments || shipments.length === 0) {
    return <Message warning style={{borderRadius: 0}}>
      <Message.Header>No shipment registered for your organisation.</Message.Header>
    </Message>;
  }

  return (
    <Tile className="white-tile">
      <div className="card-header">
        Select a shipment
      </div>
      <div style={{padding: '0 16px 8px 16px'}}>
        { shipments
        ? <List selection>
        { shipments.map((shipment, idx) => {
          const shipmentId = hexToString(shipment.toString());
          return <List.Item key={idx} active={selected === shipmentId} header={shipmentId}
                            onClick={handleSelectionClick} data={idx}/>;
        }) }</List>
        : <div>No shipment found</div> }
      </div>
    </Tile>
  );
}
