import React, { useState, createRef } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { SubstrateContextProvider, useSubstrate } from '../substrate-lib';
import { DeveloperConsole } from '../substrate-lib/components';
import { Products, TopNavMenu } from '../components';
import { Grid } from 'carbon-components-react';
import DefaultSkeleton from "./skeletons/DefaultSkeleton";

const Member = () => {
  const { apiState, keyring, keyringState } = useSubstrate();
  const [accountAddress, setAccountAddress] = useState(null);
  const loader = text =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  if (apiState === 'ERROR') {
    return <DefaultSkeleton toast={{title: "Error", caption: "Please make sure the blockchain is running."}}/>
  }
  else if (apiState !== 'READY') {
    return loader('Connecting to blockchain...');
  }

  if (keyringState !== 'READY') {
    return loader('Loading accounts...');
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
        <Products accountPair={accountPair} />
      </Grid>
    </div>
  );
};

export default function MemberWithContext (props) {
  return (
    <SubstrateContextProvider>
      <Member {...props} />
      <DeveloperConsole />
    </SubstrateContextProvider>
  );
}
