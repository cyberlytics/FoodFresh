import React, { useState } from 'react';
import { stringToHex } from '@polkadot/util';
import { TxButton } from '../substrate-lib/components';
import { Tile, TextInput, Form } from 'carbon-components-react';

export default function RegisterProductForm(props) {
  const {accountPair, organization} = props;
  const [status, setStatus] = useState([]);
  const [params, setParams] = useState({id: null, props: null});

  const onChangeID = (event) => {
    const newParams = {...params};
    newParams.id = (event.target.value.length === 0 ? null : stringToHex(event.target.value));
    setParams(newParams);
  };

  const onChangeDesc = (event) => {
    const newParams = {...params};
    newParams.props = (event.target.value.length === 0 ? null : [['0x64657363', stringToHex(event.target.value)]]);
    setParams(newParams);
  };

  return (
    <Form>
      <Tile className="white-tile">
        <div className="card-header">
          Register product
        </div>
        <div className="card-content">
          <TextInput
            id="productID"
            labelText="Product identification number"
            placeholder="Enter product id"
            type='text'
            state='id'
            onChange={onChangeID}
          />
          <br/>
          <TextInput
            id="description"
            labelText="Description"
            placeholder="Enter product description"
            type='text'
            state='desc'
            onChange={onChangeDesc}
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
              palletRpc: 'productRegistry',
              callable: 'registerProduct',
              inputParams: [params.id, organization, params.props],
              paramFields: [true, true, true]
            }}
          />
          <div style={{clear: 'both'}}/>
        </div>
        <div className="status-message">{status}</div>
      </Tile>
    </Form>
  );
}
