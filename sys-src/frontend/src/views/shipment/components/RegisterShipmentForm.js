/**
 * RegisterShipmentForm
 *
 */

import React, { useEffect, useState } from 'react';
import { Tile, Dropdown, TextInput, Form } from 'carbon-components-react';
import { useSubstrate } from '../../../substrate-lib';
import { TxButton } from '../../../substrate-lib/components';
import { hexToString } from '@polkadot/util';
import { useOwner, useProductsOfOrganization } from '../../../hooks/useShipment';
import { getAccounts } from '../../../utils/Accounts';

function RegisterShipmentFormComponent({ accountPair, organization }) {
  /* State */
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

  /* Hooks */
  const { api, keyring } = useSubstrate();
  useProductsOfOrganization(api, organization, setProducts);
  useOwner(api, accountPair, setState);

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

  /* Event handler */
  const onShipmentIdChange = event => {
    setState({...state, shipmentId: event.target.value});
  }

  const onReceiverChange = event => {
    setState({...state, receiver: event.selectedItem.id});
  }

  const productId1Change = org => {
    setState({...state, productId1: org});
  }

  const productId2Change = org => {
    setState({...state, productId2: org});
  }

  return (
    <Form>
      <Tile className="card" style={{maxWidth: '100%'}}>
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
            onChange={onShipmentIdChange}
          />
          <br/>
          <Dropdown
            id="receiver"
            titleText="Receiver"
            label="Select a receiver"
            items={getAccounts(keyring)}
            itemToString={(keyringOption) => (keyringOption ? keyringOption.text : '')}
            onChange={onReceiverChange}
          />
          <br/>
          <Dropdown
            id="product1"
            titleText="Product 1"
            label="Select a product"
            items={products.map(p => {
              const productId = hexToString(p.toString());
              return {id: productId, text: productId};
            })}
            itemToString={(item) => (item ? item.text : '')}
            onChange={(event) => productId1Change(event.selectedItem.id)}
          />
          <br/>
          <Dropdown
            id="product2"
            titleText="Product 2"
            label="Select a product"
            items={products.map(p => {
              const productId = hexToString(p.toString());
              return {id: productId, text: productId};
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
            style={{display: 'block', float: 'right'}}
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
    </Form>
  );
}

export default function RegisterShipmentForm(props) {
  const { api } = useSubstrate();
  return api.tx ? <RegisterShipmentFormComponent {...props}/> : null;
};
