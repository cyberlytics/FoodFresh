import React, { useEffect, useState } from 'react';
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
import { u8aToString } from '@polkadot/util';
import ShipmentOperations from './ShipmentOperations';


function ShipmentDetailsComponent(props) {
  const {api} = useSubstrate();
  const [shipment, setShipment] = useState(null);
  const [eventIndices, setEventIndices] = useState([]);
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const {accountPair, shipmentId} = props;

  useEffect(() => {
    let unsubscribe;

    async function shipment(shipmentId) {
      await api.query.productTracking.shipments(shipmentId, async data => {
          if (!data || !data.value || !data.value.owner) {
            return;
          }

          const nonce = await api.query.palletDid.attributeNonce([data.value.owner, 'Org']);
          const attrHash = api.registry.createType('(AccountId, Text, u64)', [data.value.owner, 'Org', nonce.subn(1)]).hash;
          const orgAttr = await api.query.palletDid.attributeOf([data.value.owner, attrHash]);
          setShipment({...data.value, owner: u8aToString(orgAttr.value)});
        }
      );
    }

    if (shipmentId) {
      shipment(shipmentId);
    } else {
      setShipment(null);
      return () => unsubscribe && unsubscribe();
    }
  }, [api.query.palletDid, api.query.productTracking, api.registry, shipmentId]);

  useEffect(() => {
    let unsubscribe;

    async function eventsOfShipment(shipmentId) {
      await api.query.productTracking.eventsOfShipment(shipmentId, data =>
        setEventIndices(data ? data.map(x => x.toNumber()) : [])
      );
    }

    if (shipmentId) {
      eventsOfShipment(shipmentId);
    } else {
      setEventIndices([]);
      return () => unsubscribe && unsubscribe();
    }
  }, [api.query.productTracking, shipmentId]);

  useEffect(() => {
    let unsubscribe;

    async function allEvents(eventIndices) {
      const futures = eventIndices
        .map(idx => api.query.productTracking.allEvents(idx));
      Promise.all(futures)
        .then(data => {
          if (data) {
            const sorted = data
              .map(x => x.value)
              .sort((a, b) => a.timestamp.toNumber() - b.timestamp.toNumber());
            setEvents(sorted);
          } else {
            setEvents([]);
          }
        })
        .catch(e => console.log(e));
    }

    if (eventIndices) {
      allEvents(eventIndices);
    } else {
      setEvents([]);
      return () => unsubscribe && unsubscribe();
    }
  }, [api.query.productTracking, eventIndices]);

  useEffect(() => {
    let unsubscribe;

    async function products (shipment) {
      const futures = shipment.products
        .map(productId => api.query.productRegistry.products(productId.toString()));
      Promise.all(futures)
        .then(data => {
          if (data) {
            const validProducts = data
              .filter(product => !product.isNone)
              .map(product => product.unwrap())
              .map(product => {
              const props = product.props.unwrap();
              return {
                id: u8aToString(product.id),
                desc: u8aToString(props[0].value)
              };
            })
            setProducts(validProducts);
          } else {
            setProducts([]);
          }
        })
        .catch(e => console.log(e));
    }

    if (shipment && shipment.products) {
      products(shipment);
    } else {
      setProducts([]);
      return () => unsubscribe && unsubscribe();
    }
  }, [api.query.productRegistry, shipment]);

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
                  <div className="shipping-title">Registered:</div>
                  <p>{new Date(shipment.registered.toNumber()).toLocaleString()}</p>
                </div>
                <div style={{paddingBottom: "16px"}}>
                  <div className="shipping-title">Status:</div>
                  <p>{shipment.status.toString()}</p>
                </div>
                <div style={{paddingBottom: "16px"}}>
                  <div className="shipping-title">Delivered:</div>
                  <p>{shipment.delivered.value.toString().length > 0
                    ? new Date(shipment.delivered.value.toNumber()).toLocaleString() : ''
                  }</p>
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
}

export default function ShipmentDetails(props) {
  const { api } = useSubstrate();
  return api ? <ShipmentDetailsComponent {...props} /> : null;
}
