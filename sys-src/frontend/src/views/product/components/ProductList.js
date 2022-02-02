/**
 * ProductList
 *
 */

import React, { useState } from 'react';
import { Tile } from 'carbon-components-react';
import { u8aToString } from '@polkadot/util';
import { useSubstrate } from '../../../substrate-lib';
import useProducts from '../../../hooks/useProducts';
import { ListTable, ListWarning } from '../../../components';

export default function Main({ organization }) {
  const [products, setProducts] = useState([]);
  const { api } = useSubstrate();
  useProducts(api, organization, setProducts);

  const rows = products.map(product => {
    const props = product.props.unwrap();
    return {
      id: u8aToString(product.id),
      owner: product.owner.toString(),
      description: u8aToString(props[0].value)
    };
  });

  const headers = [
    {
      key: 'id',
      header: 'ID',
    },
    {
      key: 'owner',
      header: 'Owner',
    },
    {
      key: 'description',
      header: 'Description',
    },
  ];

  const hasProducts = () => !products || products.length === 0;

  return (
    <Tile style={{ padding: 0, backgroundColor: "white" }}>
      <div className="tile-header">
        Products list
      </div>
      {
        hasProducts() ?
          <ListWarning message={"No products to show here."}/> :
          <ListTable rows={rows} headers={headers}/>
      }
    </Tile>
  );
};
