import { useEffect } from 'react';
import { stringToHex, u8aToString } from '@polkadot/util';

/**
 * Provide registered documents.
 * @param api Substrate api
 * @param keyring Available keyring
 * @param organization Organization owning the documents
 * @param setDocuments Documents setter
 */
const useDocuments = (api, keyring, organization, setDocuments) => {

  useEffect(() => {
    let unsubscribe = null;

    const fetchDocumentsOfOrganizations = async () => {
      unsubscribe = await api.query.registrar.organizations(async rawData => {
        const orgsList = rawData.map(r => ({value: r.toString(), text: r.toString()}));
        for (let i = 0; i < orgsList.length; i++) {
          let org = orgsList[i];
          let id = org.value;

          await api.query.documentRegistry.documentsOfOrganization(id, documentIds => {
            api.query.documentRegistry.documents.multi(documentIds, documents => {
              const validDocuments = documents
                .filter(document => !document.isNone)
                .map(document => document.unwrap());

              let orgs = [];
              const owners = keyring.getPairs().map(account => ({
                key: account.address,
                value: account.meta.name.toUpperCase()
              }));
              let maxCount = 0;

              for (let j = 0; j < validDocuments.length; j++) {
                let document = validDocuments[j];
                const documentId = stringToHex(u8aToString(document.id));
                const ori_title = document.title.unwrap();
                const org = u8aToString(document.organization);
                const owner = document.owner.toString();
                let owner_name = owner;
                for (let k = 0; k < owners.length; k++) {
                  if (owners[k].key === owner) {
                    owner_name = owners[k].value;
                  }
                }
                api.query.palletDid.attributeNonce([org, 'Org'])
                  .then(nonce => api.registry.createType('(AccountId, Text, u64)', [org, 'Org', nonce.subn(1)]))
                  .then(type => api.query.palletDid.attributeOf([org, type.hash]))
                  .then(orgAttr => {
                    let org_name = u8aToString(orgAttr.value);
                    let title = u8aToString(ori_title[0].value);
                    if (organization === org || organization === owner) {
                      orgs.push({id: documentId, title: title, name: org_name, owner: owner_name});
                    }
                    maxCount++;
                    if ((orgsList.length - 1 === i) && (validDocuments.length === maxCount)) {
                      setDocuments(orgs.sort((a, b) => a.id - b.id));
                    }
                  })
              }
            });
          });
        }
      });
    }

    fetchDocumentsOfOrganizations();

    return () => unsubscribe && unsubscribe();
  }, [organization, api, keyring]);
}

export default useDocuments;