import React, { useEffect, useState } from 'react';
import { useSubstrate } from '../substrate-lib';
import { TxButton } from '../substrate-lib/components';
import { Form, Tile, Dropdown } from 'carbon-components-react';


function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;
  const [status, setStatus] = useState(null);
  const [palletRPCs, setPalletRPCs] = useState([]);
  const [permission, setPermission] = useState(0);

  const initFormState = {
    palletRpc: ''
  };

  const [formState, setFormState] = useState(initFormState);
  const { palletRpc } = formState;

  const permissionOptions = [
    {
      id: 'Execute',
      text: 'Execute',
    },
    {
      id: 'Manage',
      text: 'Manage',
    }
  ];

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updatePalletRPCs = () => {
    if (!api) { return; }
    const palletRPCs = Object.keys(api.tx).sort()
      .filter(pr => Object.keys(api.tx[pr]).length > 0)
      .map(pr => ({ id: pr, text: pr }));
    setPalletRPCs(palletRPCs);
  };

  useEffect(updatePalletRPCs, [api]);

  const onPalletCallableParamChange = event => {
    setFormState({palletRpc: event.selectedItem.id}); 
  };

return (
  <Form>
  <Tile className="white-tile">
    <div className="tile-header">
      Create role
    </div>
    <div className="tile-content">
      <Dropdown
        id="default"
        titleText="Pallet"
        label="Select a pallet"
        items={palletRPCs}
        state='palletRpc'
        itemToString={(item) => (item ? item.text : '')}
        onChange={onPalletCallableParamChange}
      />
      <br/>
      <Dropdown
        id="default"
        titleText="Permission"
        label="Select a permission"
        items={permissionOptions}
        itemToString={(item) => (item ? item.text : '')}
        onChange={(event) => setPermission(event.selectedItem.id)}
      />
    </div>
    <div className="card-bottom">
      <TxButton
        accountPair={accountPair}
        label='Create'
        setStatus={setStatus}
        style={{ display: 'block', float: 'right' }}
        type='SIGNED-TX'
        attrs={{
          palletRpc: 'rbac',
          callable: 'createRole',
          inputParams: [capitalizeFirstLetter(palletRpc), permission],
          paramFields: [true, true]
        }}
      />
      <div style={{clear: 'both'}}/>
    </div>
    <div className="status-message">{status}</div>
  </Tile>
</Form>
);
}

export default function CreateRole (props) {
  const { api } = useSubstrate();
  return api.tx ? <Main {...props} /> : null;
}
