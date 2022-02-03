import { useEffect } from 'react';
import { u8aToString } from '@polkadot/util';

/**
 * Provide organization names instead of account names.
 * @param api Substrate api
 * @param accountPair Available account pair
 * @param setOrganizations Organizations setter
 */
const useOrganizations = (api, accountPair, setOrganizations) => {
  useEffect(() => {
    let unsub1 = null;
    let unsub2 = null;
    const addr = accountPair ? accountPair.address : null;

    const getOrganizations = async () => {
      unsub1 = await api.query.registrar.organizations(async rawData => {
        const organizations = rawData.map(r => ({ value: r.toString(), text: r.toString() }));
        let organizationList = [];
        for (let i = 0; i < organizations.length; i++) {
          let org = organizations[i];
          let id = org.value;
          let nonce = await api.query.palletDid.attributeNonce([id, 'Org']);
          let attrHash = api.registry.createType('(AccountId, Text, u64)', [id, 'Org', nonce.subn(1)]).hash;
          let orgAttr = await api.query.palletDid.attributeOf([id, attrHash]);
          let title = u8aToString(orgAttr.value);
          organizationList.push({ value: id, text: title });
        }
        setOrganizations(organizationList);
      });
    }

    if (addr) getOrganizations(addr);
    return () => {
      unsub1 && unsub1();
      unsub2 && unsub2();
    };
  }, [accountPair, api.query.palletDid, api.query.registrar, api.registry]);
};

export default useOrganizations;