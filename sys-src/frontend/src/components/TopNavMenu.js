/**
 * TopNavMenu
 *
 */

import React from 'react';
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
} from 'carbon-components-react';
import { black } from '@carbon/colors';
import AccountSelector from './AccountSelector';

export default function Main(props) {

  const getAddressFromAccountSelector = address => {
    props.getAddress(address);
  }

  return (
    <Header className="nav-header" aria-label="header">
      <HeaderName prefix='' style={{ color: black }}>
        ChainFresh
      </HeaderName>
      <HeaderNavigation aria-label="nav">
        <HeaderMenuItem
          style={{ color: black }}
          href="/"
        >
          Dashboard
        </HeaderMenuItem>
        <HeaderMenuItem
          style={{ color: black }}
          target='_blank'
          href="https://polkadot.js.org/apps/#/explorer?rpc=ws://127.0.0.1:9944"
        >
          Explorer
        </HeaderMenuItem>
        <div className="nav-right-bar">
          <AccountSelector sendAddressData={getAddressFromAccountSelector}/>
        </div>
      </HeaderNavigation>
    </Header>
  )
};
