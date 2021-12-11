import React, { useEffect, useState } from 'react';
import { Tile, Dropdown, TextInput, Form } from 'carbon-components-react';
import { useSubstrate } from '../substrate-lib';
import { TxButton } from '../substrate-lib/components';
import { hexToString } from '@polkadot/util';


function RegisterShipmentFormComponent (props) {
  const { api } = useSubstrate();
  const { accountPair, organization } = props;
  const [status, setStatus] = useState(null);
  const [paramFields, setParamFields] = useState([]);
  const [products, setProducts] = useState([]);
  const [state, setState] = useState({
    shipmentId: '',
    owner: '',
    receiver: '',
    productId1: '',
    productId2: ''
  });

  const updateParamFields = () => {
    if (!api.tx.productTracking) {
      return;
    }
    const paramFields = api.tx.productTracking.registerShipment.meta.args.map(arg => ({
      name: arg.name.toString(),
      type: arg.type.toString()
    }));
    setParamFields(paramFields);
  };

  useEffect(updateParamFields, [api]);

  useEffect(() => {
    let unsub = null;

    async function productsOfOrg (organization) {
      unsub = await api.query.productRegistry.productsOfOrganization(organization,
        data => setProducts(data));
    }

    if (organization) productsOfOrg(organization);
    return () => unsub && unsub();
  }, [api.query.productRegistry, organization]);

  useEffect(() => {
    async function setOwner () {
      if (!accountPair) {
        return;
      }
      setState(state => ({ ...state, owner: accountPair.address }));
    }

    setOwner();
  }, [api.query.palletDid, api.registry, accountPair]);

  
  const shipmentChange = (event) => {
    setState({ ...state, shipmentId: event.target.value });
  }

  const receiverChange = (event) => {
    setState({ ...state, receiver: event.target.value });
  }
 
  const productId1Change = org => {
    setState({ ...state, productId1: org });
  }

  const productId2Change = org => {
    setState({ ...state, productId2: org });
  }

return <Form>
  <Tile className="card" style={{ maxWidth: '100%' }}>
    <div className="tile-header">
      Register shipment
    </div>
    <div className="tile-content">
      <TextInput
        id="shipmentId"
        labelText="Shipment identification number"
        placeholder="Enter shipment id"
        type='text'
        state='shipmentId'
        value={state.shipmentId}
        onChange={shipmentChange}
      />
      <br/>
      <TextInput
        id="receiver"
        labelText="Receiver"
        placeholder="Enter a receiver"
        type='text'
        state='receiver'
        value={state.receiver}
        onChange={receiverChange}
      />
      <br/>
      <Dropdown
        id="default"
        titleText="Product 1"
        label="Select a product"
        items={products.map(p => {
          const productId = hexToString(p.toString());
          return { id: productId, text: productId };
        })}
        itemToString={(item) => (item ? item.text : '')}
        onChange={(event) => productId1Change(event.selectedItem.id)}
      />
      <br/>
      <Dropdown
        id="default"
        titleText="Product 2"
        label="Select a product"
        items={products.map(p => {
          const productId = hexToString(p.toString());
          return { id: productId, text: productId };
        })}
        itemToString={(item) => (item ? item.text : '')}
        onChange={(event) => productId2Change(event.selectedItem.id)}
      />

    </div>
    <div className="card-bottom">
      <TxButton
        accountPair={accountPair}
        label='Register'
        type='SIGNED-TX'
        style={{ display: 'block', float: 'right' }}
        setStatus={setStatus}
        attrs={{
          palletRpc: 'productTracking',
          callable: 'registerShipment',
          inputParams: [state.shipmentId, state.owner, [state.productId1 || '', state.productId2 || ''].join(',')],
          paramFields: paramFields
        }}
      />
      <div style={{clear: 'both'}}/>
    </div>
    <div className="status-message">{status}</div>
  </Tile>
</Form>;

}

export default function RegisterShipmentForm (props) {
  const { api } = useSubstrate();
  return api.tx ? <RegisterShipmentFormComponent {...props}/> : null;
}
