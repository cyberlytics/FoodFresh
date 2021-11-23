import React, { useState, createRef } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import { Grid } from 'carbon-components-react';
import { SubstrateContextProvider, useSubstrate } from '../substrate-lib';
import { DeveloperConsole } from '../substrate-lib/components';
import { Organizations, TopNavMenu } from '../components';
import DefaultSkeleton from "./skeletons/DefaultSkeleton";


const Organization = () => {
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
          <Organizations accountPair={accountPair} />
        </Grid>
    </div>
  );
};

export default function OrganizationWithContext (props) {
  return (
    <SubstrateContextProvider>
      <Organization {...props} />
      <DeveloperConsole />
    </SubstrateContextProvider>
  );
}
