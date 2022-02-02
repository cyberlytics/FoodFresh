import { useEffect } from 'react';

const useProducts = (api, organization, setProducts) => {

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
};

export default useProducts;