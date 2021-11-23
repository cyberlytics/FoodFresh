import React, { useState, createRef } from 'react';
import { Dimmer, Loader, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { SubstrateContextProvider, useSubstrate } from '../substrate-lib';
import { DeveloperConsole } from '../substrate-lib/components';
import { Documents, TopNavMenu } from '../components';
import { Grid } from 'carbon-components-react';


const Document = (props) => {
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const [accountAddress, setAccountAddress] = useState(null);
  const loader = text =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  const message = err =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
                 header='Error connecting to blockchain'
                 content={`${err}`}
        />
      </Grid.Column>
    </Grid>;

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader('Loading accounts');
  }

  const getAddress = (accountAddress) => {
    setAccountAddress(accountAddress);
  }
  const accountPair = accountAddress && keyringState === 'READY' && keyring.getPair(accountAddress);

  const contextRef = createRef();

  return (
    <div ref={contextRef}>
      <TopNavMenu getAddress={getAddress}/>
      <Grid>
        <br/><br/>
        <Documents accountPair={accountPair} />
      </Grid>
    </div>
  );
};

export default function MemberWithContext (props) {
  return (
    <SubstrateContextProvider>
      <Document {...props} />
      <DeveloperConsole />
    </SubstrateContextProvider>
  );
}
