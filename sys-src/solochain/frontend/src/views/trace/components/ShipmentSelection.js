import React, { useEffect, useState } from 'react';
import { Tile, Form, Dropdown } from "carbon-components-react";
import { useSubstrate } from '../../../substrate-lib';
import { hexToString } from '@polkadot/util';

export default function Main (props) {
  const { api } = useSubstrate();
  const { organization, setSelectedShipment } = props;
  const [shipments, setShipments] = useState([]);
  // const [selected, setSelected] = useState('');

  useEffect(() => {
    let unsub = null;

    async function shipments (organization) {
      unsub = await api.query.productTracking.shipmentsOfOrganization(organization, data => {
        setShipments(data);
        setSelectedShipment('');
        // setSelected('');
      });
    }

    if (organization) {
      shipments(organization);
    } else {
      setShipments([]);
      setSelectedShipment('');
      // setSelected('');
    }

    return () => unsub && unsub();
  }, [organization, api.query.productTracking, setSelectedShipment]);

  const handleSelectionClick = shipment => {
    setSelectedShipment(shipment);
    // setSelected(shipment);
  };

  return (
    <Form>
      <Tile className="white-tile">
        <div className="tile-header">
          Shipment
        </div>
        <div className="tile-content">
          <Dropdown
            id="shipmentSelector"
            label="Select a shipment"
            items={shipments.map(s => {
              const shipmentId = hexToString(s.toString());
              return { id: shipmentId, text: shipmentId };
            })}
            itemToString={(item) => (item ? item.text : '')}
            onChange={(event) => handleSelectionClick(event.selectedItem.id)}
          />
        </div>
      </Tile>
    </Form>
  );
}
