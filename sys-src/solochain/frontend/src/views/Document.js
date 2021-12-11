import React, { useState, createRef } from 'react';
import { SubstrateContextProvider, useSubstrate } from '../substrate-lib';
import { DeveloperConsole } from '../substrate-lib/components';
import { Documents, TopNavMenu } from '../components';
import { Grid, Loading } from 'carbon-components-react';
import DefaultSkeleton from "./skeletons/DefaultSkeleton";


const Document = () => {
  const { apiState, keyring, keyringState } = useSubstrate();
  const [accountAddress, setAccountAddress] = useState(null);

  if (apiState === 'ERROR') {
    return <DefaultSkeleton toast={{title: "Error", caption: "Please make sure the blockchain is running."}}/>
  }
  else if (apiState !== 'READY' || keyringState !== 'READY') {
    return <Loading description="Loading" withOverlay={true}/>
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
