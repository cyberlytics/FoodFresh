import React, { useState } from 'react';
import { SubstrateContextProvider, useSubstrate } from '../../substrate-lib';
import { DeveloperConsole } from "../../substrate-lib/components";
import { Grid, Row, Column, Tile, ClickableTile, Loading } from 'carbon-components-react';
import {
  Enterprise32,
  UserMultiple32,
  Delivery32,
  Tag32,
  Document32,
  ColumnDependency32,
  ArrowRight20
} from '@carbon/icons-react';
import { black, blue70 } from '@carbon/colors';
import { TopNavMenu } from '../../components';
import NodeInfo from './components/NodeInfo';
import BlockNumber from './components/BlockNumber';
import DashboardSkeleton from "../skeletons/DashboardSkeleton";

/**
 * Dasboard
 * The main view of the ChainFresh dashboard.
 * */
const Dashboard = () => {

  const { apiState, keyringState } = useSubstrate();
  const [accountAddress, setAccountAddress] = useState(null);

  if (apiState === 'ERROR')
    return <DashboardSkeleton toast={{title: "Error", caption: "Please make sure the blockchain is running."}}/>
  else if (apiState !== 'READY' || keyringState !== 'READY') {
    return <Loading description="Loading" withOverlay={true}/>
  }

  const getAddress = accountAddress => {
    setAccountAddress(accountAddress)
  }
 
  return (
    <div >
      <TopNavMenu getAddress={getAddress}/>
      <div>
        <Grid>
          <br/><br/>
          <Row>
            <Column sm={1} md={{ span: 2, offset: 1 }} lg={{ span: 4, offset: 0 }}>
              <Tile light>
                <NodeInfo/>
              </Tile>
            </Column>
            <Column sm={2} md={2} lg={4} >
              <Column sm={{ span: 2, offset: 1 }} md={{ span: 8, offset: 0 }} lg={{ span: 12, offset: 0 }} >
                <Tile light>
                  <BlockNumber/>
                </Tile>
              </Column>
            </Column>
            <Column sm={1} md={2} lg={4} >
              <Tile light>
                <BlockNumber finalized/>
              </Tile>
            </Column>
          </Row>

          <Row style={{ marginTop: '40px' }}>
            <Column sm={3} md={{ span: 6, offset: 1 }} lg={{ span: 4, offset: 0 }}>
                <h5 className="row-title">Your organization’s modules</h5>
            </Column>
          </Row>
          <Row style={{ marginTop: '16px' }}>
            <Column sm={1} md={{ span: 2, offset: 1 }} lg={{ span: 4, offset: 0 }}>
              <ClickableTile light href="/dashboard/organization">
                <div className="tile-header">
                  <Enterprise32 />
                </div>
                <div style={{height: '24px'}}/>
                <div className="card-bottom">
                  <div style={{ float: 'left', color: black }}>
                    Organizations
                  </div>
                  <div style={{ float: 'right' }}>
                    <ArrowRight20 color={blue70} />
                  </div>
                  <div style={{clear: 'both'}}/>
                </div>
              </ClickableTile>
            </Column>
            <Column sm={2} md={2} lg={4} >
              <Column sm={{ span: 2, offset: 1 }} md={{ span: 8, offset: 0 }} lg={{ span: 12, offset: 0 }} >
                <ClickableTile light href='/dashboard/member'>
                  <div className="tile-header">
                    <UserMultiple32 />
                  </div>
                  <div style={{height: '24px'}}/>
                  <div className="card-bottom">
                    <div style={{ float: 'left', color: black }}>
                      Members
                    </div>
                    <div style={{ float: 'right' }}>
                      <ArrowRight20 color={blue70} />
                    </div>
                    <div style={{clear: 'both'}}/>
                  </div>
                </ClickableTile>
              </Column>
            </Column>
            <Column sm={1} md={2} lg={4} >
              <ClickableTile light href='/dashboard/document'>
                <div className="tile-header">
                  <Document32 />
                </div>
                <div style={{height: '24px'}}/>
                <div className="card-bottom">
                  <div style={{ float: 'left', color: black }}>
                    Documents
                  </div>
                  <div style={{ float: 'right' }}>
                    <ArrowRight20 color={blue70} />
                  </div>
                  <div style={{clear: 'both'}}/>
                </div>
              </ClickableTile>
            </Column>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Column sm={1} md={{ span: 2, offset: 1 }} lg={{ span: 4, offset: 0 }}>
              <ClickableTile light href="/dashboard/shipment">
                <div className="tile-header">
                  <Delivery32 />
                </div>
                <div style={{height: '24px'}}/>
                <div className="card-bottom">
                  <div style={{ float: 'left', color: black }}>
                    Shipments
                  </div>
                  <div style={{ float: 'right' }}>
                    <ArrowRight20 color={blue70} />
                  </div>
                  <div style={{clear: 'both'}}/>
                </div>
              </ClickableTile>
            </Column>
            <Column sm={2} md={2} lg={4} >
              <Column sm={{ span: 2, offset: 1 }} md={{ span: 8, offset: 0 }} lg={{ span: 12, offset: 0 }} >
                <ClickableTile light href='/dashboard/product'>
                  <div className="tile-header">
                    <Tag32 />
                  </div>
                  <div style={{height: '24px'}}/>
                  <div className="card-bottom">
                    <div style={{ float: 'left', color: black }}>
                      Products
                    </div>
                    <div style={{ float: 'right' }}>
                      <ArrowRight20 color={blue70} />
                    </div>
                    <div style={{clear: 'both'}}/>
                  </div>
                </ClickableTile>
              </Column>
            </Column>
            <Column sm={1} md={2} lg={4} >
              <ClickableTile light href='/dashboard/trace'>
                <div className="tile-header">
                  <ColumnDependency32 />
                </div>
                <div style={{height: '24px'}}/>
                <div className="card-bottom">
                  <div style={{ float: 'left', color: black }}>
                    Traces
                  </div>
                  <div style={{ float: 'right' }}>
                    <ArrowRight20 color={blue70} />
                  </div>
                  <div style={{clear: 'both'}}/>
                </div>
              </ClickableTile>
            </Column>
          </Row>
        </Grid>
      </div>
    </div>
  );
};

export default function DashboardWithContext () {
  return (
    <SubstrateContextProvider>
      <Dashboard/>
      <DeveloperConsole />
    </SubstrateContextProvider>
  );
}
