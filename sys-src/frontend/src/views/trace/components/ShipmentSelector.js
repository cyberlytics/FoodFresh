/**
 * ShipmentSelector
 *
 */

import React, { useState } from 'react';
import { Tile, Form, Dropdown } from 'carbon-components-react';
import { useSubstrate } from '../../../substrate-lib';
import { hexToString } from '@polkadot/util';
import { useShipments } from '../../../hooks/useShipment';

export default function Main({ organization, setSelectedShipment }) {
  /* State */
  const [shipments, setShipments] = useState([]);

  /* Hooks */
  const { api } = useSubstrate();
  useShipments(api, organization, setShipments, setSelectedShipment);

  /* Event handler */
  const handleSelectionClick = shipment => {
    setSelectedShipment(shipment);
  };

  /* Render */
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
};
