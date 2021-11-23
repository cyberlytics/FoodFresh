import React, { useEffect, useState } from 'react';
import { useSubstrate } from '../substrate-lib';
import { u8aToString } from '@polkadot/util';
import { Form, Tile, Dropdown } from 'carbon-components-react';

export default function Main(props) {
  const {api} = useSubstrate();
  const {accountPair, setSelectedOrganization} = props;
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    let unsub1 = null;
    let unsub2 = null;
    const addr = accountPair ? accountPair.address : null;

    async function membersOf(addr) {
      unsub2 = await api.query.registrar.membersOf(addr, rawData => {
        const orgs = rawData.map(r => ({value: r.toString(), text: r.toString()}));
        const defaultOrg = orgs.length > 0 ? orgs[0].value : '';

        setOrganizations(orgs);
        setSelectedOrganization(defaultOrg);
      });
    }

    async function organizations(addr) {
      unsub1 = await api.query.registrar.organizations(async rawData => {
        const strData = rawData.map(r => r.toString());

        if (strData.includes(addr)) {
          // Current account is an org
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

  return (
    <Form>
      <Tile className="white-tile">
        <div className="card-header">
          Organization
        </div>
        <div className="card-content">
          <Dropdown
            id="default"
            placeholder='Select an organization'
            items={organizations}
            selectedItem={organizations[0]}
            itemToString={(item) => (item ? item.text : '')}
            onChange={(event) => setSelectedOrganization(event.selectedItem.id)}
          />
        </div>
      </Tile>
    </Form>
  );
}
