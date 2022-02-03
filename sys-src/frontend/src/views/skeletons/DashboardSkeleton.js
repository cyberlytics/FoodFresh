/**
 * DashboardSkeleton
 * Displayed when the web frontend is not connected to any blockchain.
 */

import React from 'react';
import {
  Column,
  Grid,
  Row,
  Tile,
  ToastNotification,
  SkeletonText
} from 'carbon-components-react';
import {
  ArrowRight20,
  ColumnDependency32,
  Delivery32,
  Document32,
  Enterprise32,
  Tag32,
  UserMultiple32
} from '@carbon/icons-react';
import { black, gray70 } from '@carbon/colors';
import NavMenuSkeleton from './TopNavMenuSkeleton';

export default function DashboardSkeleton({ loading, toast }) {
  return (
    <div>
      <NavMenuSkeleton />
      <div>
        <Grid>
          <Row style={{ marginTop: '16px'}}>
            <Column sm={1} md={{ span: 2, offset: 1 }} lg={{ span: 4, offset: 0 }}>
              <Tile light>
                <div className="chaininfo-header border-bottom">
                  Blockchain mode
                </div>
                <SkeletonText />
              </Tile>
            </Column>
            <Column sm={2} md={2} lg={4} >
              <Column sm={{ span: 2, offset: 1 }} md={{ span: 8, offset: 0 }} lg={{ span: 12, offset: 0 }} >
                <Tile light>
                  <div className="chaininfo-header border-bottom">
                    Current block
                  </div>
                  <SkeletonText />
                </Tile>
              </Column>
            </Column>
            <Column sm={1} md={2} lg={4} >
              <Tile light>
                <div className="chaininfo-header border-bottom">
                  Finalized block
                </div>
                <SkeletonText />
              </Tile>
            </Column>
          </Row>

          <Row style={{ marginTop: '40px' }}>
            <Column sm={3} md={{ span: 6, offset: 1 }} lg={{ span: 4, offset: 0 }}>
              <h5 className="row-title" >Your organization’s modules</h5>
            </Column>
          </Row>

          <Row style={{ marginTop: '16px' }}>
            <Column sm={1} md={{ span: 2, offset: 1 }} lg={{ span: 4, offset: 0 }}>
              <Tile light>
                <div className="tile-header">
                  <Enterprise32 />
                </div>
                <div style={{height: '24px'}}/>
                <div className="card-bottom">
                  <div style={{ float: 'left', color: black }}>
                    Organizations
                  </div>
                  <div style={{ float: 'right' }}>
                    <ArrowRight20 color={gray70} />
                  </div>
                  <div style={{clear: 'both'}}/>
                </div>
              </Tile>
            </Column>
            <Column sm={2} md={2} lg={4} >
              <Column sm={{ span: 2, offset: 1 }} md={{ span: 8, offset: 0 }} lg={{ span: 12, offset: 0 }} >
                <Tile light>
                  <div className="tile-header">
                    <UserMultiple32 />
                  </div>
                  <div style={{height: '24px'}}/>
                  <div className="card-bottom">
                    <div style={{ float: 'left', color: black }}>
                      Members
                    </div>
                    <div style={{ float: 'right' }}>
                      <ArrowRight20 color={gray70} />
                    </div>
                    <div style={{clear: 'both'}}/>
                  </div>
                </Tile>
              </Column>
            </Column>
            <Column sm={1} md={2} lg={4} >
              <Tile light>
                <div className="tile-header">
                  <ColumnDependency32 />
                </div>
                <div style={{height: '24px'}}/>
                <div className="card-bottom">
                  <div style={{ float: 'left', color: black }}>
                    Tracking
                  </div>
                  <div style={{ float: 'right' }}>
                    <ArrowRight20 color={gray70} />
                  </div>
                  <div style={{clear: 'both'}}/>
                </div>
              </Tile>
            </Column>
          </Row>

          <Row style={{ marginTop: '20px' }}>
            <Column sm={1} md={{ span: 2, offset: 1 }} lg={{ span: 4, offset: 0 }}>
              <Tile light>
                <div className="tile-header">
                  <Delivery32 />
                </div>
                <div style={{height: '24px'}}/>
                <div className="card-bottom">
                  <div style={{ float: 'left', color: black }}>
                    Shipments
                  </div>
                  <div style={{ float: 'right' }}>
                    <ArrowRight20 color={gray70} />
                  </div>
                  <div style={{clear: 'both'}}/>
                </div>
              </Tile>
            </Column>
            <Column sm={2} md={2} lg={4} >
              <Column sm={{ span: 2, offset: 1 }} md={{ span: 8, offset: 0 }} lg={{ span: 12, offset: 0 }} >
                <Tile light>
                  <div className="tile-header">
                    <Tag32 />
                  </div>
                  <div style={{height: '24px'}}/>
                  <div className="card-bottom">
                    <div style={{ float: 'left', color: black }}>
                      Products
                    </div>
                    <div style={{ float: 'right' }}>
                      <ArrowRight20 color={gray70} />
                    </div>
                    <div style={{clear: 'both'}}/>
                  </div>
                </Tile>
              </Column>
            </Column>
            <Column sm={1} md={2} lg={4} >
              <Tile light>
                <div className="tile-header">
                  <Document32 />
                </div>
                <div style={{height: '24px'}}/>
                <div className="card-bottom">
                  <div style={{ float: 'left', color: black }}>
                    Documents
                  </div>
                  <div style={{ float: 'right' }}>
                    <ArrowRight20 color={gray70} />
                  </div>
                  <div style={{clear: 'both'}}/>
                </div>
              </Tile>
            </Column>
          </Row>
        </Grid>
      </div>
      {!loading
        ?
        <ToastNotification
          title={toast.title}
          caption={toast.caption}
          style={{ position: 'fixed', bottom: '0%'}}
        /> : null
      }
    </div>
  )
};
