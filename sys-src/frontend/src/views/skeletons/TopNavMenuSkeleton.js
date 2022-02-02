/**
 * NavMenuSkeleton
 * Renders a static navigation menu.
 */

import React from 'react';
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
} from 'carbon-components-react';
import { black, white } from '@carbon/colors';

export default function NavMenuSkeleton() {
  return (
    <Header style={{ backgroundColor: white, borderBottom: '1px solid #d1d1d1', position: 'relative' }}>
      <HeaderName prefix='' style={{ color: black }}>
        ChainFresh
      </HeaderName>
      <HeaderNavigation aria-label="navigation">
        <HeaderMenuItem style={{ color: black }}>
          Dashboard
        </HeaderMenuItem>
        <HeaderMenuItem style={{ color: black }}>
          Explorer
        </HeaderMenuItem>
      </HeaderNavigation>
    </Header>
  )
};
