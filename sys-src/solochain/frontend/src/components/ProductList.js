import React, { useEffect, useState } from 'react';
import { Tile } from 'carbon-components-react';
import { u8aToString } from '@polkadot/util';
import { useSubstrate } from '../substrate-lib';
import ListTable from './ListTable';
import ListWarning from './ListWarning';


export default function Main (props) {
  const { organization } = props;
  const { api } = useSubstrate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let unsub = null;

    const getProducts = async () => {
      unsub = await api.query.productRegistry.productsOfOrganization(organization, productIds => {
        api.query.productRegistry.products.multi(productIds, products => {
          const validProducts = products
            .filter(product => !product.isNone)
            .map(product => product.unwrap());
          setProducts(validProducts);
        });
      });
    };

    if (organization) {
      getProducts();
    }

    return () => unsub && unsub();
  }, [organization, api, setProducts]);

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
        Products table
      </div>
      {
        hasProducts() ?
          <ListWarning message={"No products to show here."}/> :
          <ListTable rows={rows} headers={headers}/>
      }
    </Tile>
  );
}
