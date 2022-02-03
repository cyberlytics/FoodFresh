import { useEffect } from 'react';
import { u8aToString } from "@polkadot/util";

const useProductsOfOrganization = (api, organization, setProducts) => {
  useEffect(() => {
    let unsub = null;

    async function productsOfOrg(organization) {
      unsub = await api.query.productRegistry.productsOfOrganization(organization,
        data => setProducts(data));
    }

    if (organization) productsOfOrg(organization);
    return () => unsub && unsub();
  }, [api.query.productRegistry, organization]);
};

const useOwner = (api, accountPair, setState) => {
  useEffect(() => {
    const setOwner = async () => {
      if (!accountPair) {
        return;
      }
      setState(state => ({...state, owner: accountPair.address}));
    }

    setOwner();
  }, [api.query.palletDid, api.registry, accountPair]);
};

const useShipment = (api, shipmentId, setShipment) => {
  useEffect(() => {
    let unsubscribe;

    const shipment = async shipmentId => {
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
    };

    if (shipmentId) {
      shipment(shipmentId);
    } else {
      setShipment(null);
      return () => unsubscribe && unsubscribe();
    }
  }, [api.query.palletDid, api.query.productTracking, api.registry, shipmentId]);
}

const useShipments = (api, organization, setShipments, setSelectedShipment) => {
  useEffect(() => {
    let unsub = null;

    const getShipments = async organization => {
      unsub = await api.query.productTracking.shipmentsOfOrganization(organization, data => {
        setShipments(data);
        setSelectedShipment('');
      });
    }

    if (organization) {
      getShipments(organization);
    } else {
      setShipments([]);
      setSelectedShipment('');
    }

    return () => unsub && unsub();
  }, [organization, api.query.productTracking, setSelectedShipment]);
};

const useShipmentsList = (api, organization, setShipments) => {
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
}

const useEventsOfShipment = (api, shipmentId, setEventIndices) => {
  useEffect(() => {
    let unsubscribe;

    const eventsOfShipment = async shipmentId => {
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
};

// Provide on-chain registered events for a selected shipment
const useAllEventsOfShipment = (api, eventIndices, setEvents) => {
  useEffect(() => {
    let unsubscribe;

    const allEvents = async eventIndices => {
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
};

const useProductsOfShipment = (api, shipment, setProducts) => {
  useEffect(() => {
    let unsubscribe;

    const products = async shipment => {
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
};

export {
  useProductsOfOrganization,
  useOwner,
  useShipment,
  useShipments,
  useShipmentsList,
  useEventsOfShipment,
  useAllEventsOfShipment,
  useProductsOfShipment
};