/**
 * ShipmentDetails
 *
 */

import React, { useState } from 'react';
import { Step } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import {
  Row,
  Column,
  Tile,
} from 'carbon-components-react';
import {
  Delivery32,
  Task32,
  Scan32,
  Home32
} from '@carbon/icons-react';
import { useSubstrate } from '../../../substrate-lib';
import {
  useShipment,
  useEventsOfShipment,
  useAllEventsOfShipment,
  useProductsOfShipment
} from '../../../hooks/useShipment';
import ShipmentOperations from './ShipmentOperations';

const ShipmentDetailsComponent = ({ accountPair, shipmentId }) => {
  /* State */
  const [shipment, setShipment] = useState(null);
  const [eventIndices, setEventIndices] = useState([]);
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);

  /* Hooks */
  const { api } = useSubstrate();
  useShipment(api, shipmentId, setShipment);
  useEventsOfShipment(api, shipmentId, setEventIndices);
  useAllEventsOfShipment(api, eventIndices, setEvents);
  useProductsOfShipment(api, shipment, setProducts);

  /* Render */
  return (
    shipment != null
      ? <Tile light>
        <div className="tile-content">
          <Row>
            <Column>
              <div className="shipping-header">Events</div>
              {events
                ? <Step.Group vertical size='small' style={{borderColor: "#fff", marginTop: 0}}>
                  {events.map((event, idx) => {
                      const eventType = event.event_type.toString();
                      return (
                        <Step key={idx} style={{borderColor: "#fff", padding: 0, marginBottom: '16px'}}>
                          {eventType === 'ShipmentRegistration'
                            ? <Task32/>
                            : eventType === 'ShipmentPickup'
                              ? <Delivery32/>
                              : eventType === 'ShipmentScan'
                                ? <Scan32/> : <Home32/>
                          }
                          <Step.Content style={{paddingLeft: "8px"}}>
                            <Step.Title
                              style={{fontSize: "14px"}}
                            >
                              {event.event_type.toString().substring(8)}
                            </Step.Title>
                            <Step.Description>
                              {new Date(event.timestamp.toNumber()).toLocaleString()}
                            </Step.Description>
                          </Step.Content>
                        </Step>
                      );
                    })} </Step.Group>
                : <p>No event found</p>
              }
            </Column>
            <Column>
              <div className="shipping-header">Details</div>
              <div>
                <div style={{paddingBottom: "16px"}}>
                  <div className="shipping-title">Owner:</div>
                  <p>{shipment.owner.toString()}</p>
                </div>
                <div style={{paddingBottom: "16px"}}>
                  <div className="shipping-title">Receiver:</div>
                  <p>{shipment.receiver.toString()}</p>
                </div>
                <div style={{paddingBottom: "16px"}}>
                  <div className="shipping-title">Registered:</div>
                  <p>{new Date(shipment.registered.toNumber()).toLocaleString()}</p>
                </div>
                <div style={{paddingBottom: "16px"}}>
                  <div className="shipping-title">Status:</div>
                  <p>{shipment.status.toString()}</p>
                </div>
              </div>
            </Column>
            <Column>
              <div className="shipping-header">Products</div>
              <div>
                {products
                  ? <div> {
                    products.map((product) =>
                      <div style={{paddingBottom: "16px"}}>
                        <div className="shipping-title">{product.id}</div>
                        <p>{product.desc}</p>
                      </div>
                    )}</div>
                  : <div>No product found</div>
                }
              </div>
            </Column>
            <Column>
              <div className="shipping-header">Operations</div>
              <ShipmentOperations accountPair={accountPair} shipment={shipment}/>
            </Column>
          </Row>
        </div>
      </Tile> : <div/>
  );
};

export default function ShipmentDetails(props) {
  const { api } = useSubstrate();
  return api ? <ShipmentDetailsComponent {...props} /> : null;
};
