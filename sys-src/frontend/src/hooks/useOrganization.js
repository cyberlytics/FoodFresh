import { useEffect } from 'react';
import { u8aToString } from '@polkadot/util';

/**
 * Provide organizations for organization selector.
 * @param api Substrate api
 * @param accountPair Available account pair
 * @param setOrganizations Organizations setter
 * @param setSelectedOrganization Set selected organization
 */
const useOrganization = (api, accountPair, setOrganizations, setSelectedOrganization) => {
  useEffect(() => {
    let unsub1 = null;
    let unsub2 = null;
    const addr = accountPair ? accountPair.address : null;

    const membersOf = async (addr) => {
      unsub2 = await api.query.registrar.membersOf(addr, rawData => {
        const orgs = rawData.map(r => ({value: r.toString(), text: r.toString()}));
        const defaultOrg = orgs.length > 0 ? orgs[0].value : '';

        setOrganizations(orgs);
        setSelectedOrganization(defaultOrg);
      });
    }

    const organizations = async (addr) => {
      unsub1 = await api.query.registrar.organizations(async rawData => {
        const strData = rawData.map(r => r.toString());

        if (strData.includes(addr)) {
          // Current account is an organization
          const nonce = await api.query.palletDid.attributeNonce([addr, 'Org']);
          const attrHash = api.registry.createType('(AccountId, Text, u64)', [addr, 'Org', nonce.subn(1)]).hash;
          const orgAttr = await api.query.palletDid.attributeOf([addr, attrHash]);
          setOrganizations([{id: addr, text: u8aToString(orgAttr.value)}]);
          setSelectedOrganization(addr);
        } else {
          membersOf(addr);
        }
      });
    }

    if (addr) organizations(addr);
    return () => {
      unsub1 && unsub1();
      unsub2 && unsub2();
    };
  }, [accountPair, api.query.palletDid, api.query.registrar, api.registry, setSelectedOrganization]);
};

export default useOrganization;