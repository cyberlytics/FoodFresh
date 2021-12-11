import React, {Component} from 'react';
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
} from 'carbon-components-react';
import { black, white } from '@carbon/colors';
import AccountSelector from './AccountSelector';


export default class NavMenu extends Component {

  state = { activeItem: null }

  getAddressFromAccountSelector = (address) => {
    this.props.getAddress(address);
  }
  
  render() {
    let {activeItem} = this.state
    if (activeItem === null) {
      activeItem = window.location.pathname
    }
    return (
      <Header style={{ backgroundColor: white, borderBottom: '1px solid #d1d1d1', position: 'relative' }}>
        <HeaderName prefix='' style={{ color: black }}>
          ChainFresh
        </HeaderName>
        <HeaderNavigation aria-label="Carbon Tutorial">
          <HeaderMenuItem
            className={activeItem.includes('/dashboard') ? 'active' : '' }
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
            <AccountSelector sendAddressData={this.getAddressFromAccountSelector}/>
          </div>
        </HeaderNavigation>
      </Header>
    )
  }
}
