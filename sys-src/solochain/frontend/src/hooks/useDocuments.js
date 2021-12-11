import { useEffect, useState } from "react";
import { stringToHex, u8aToString } from "@polkadot/util";

const useDocuments = (api, keyring, organization) => {

  const [documents, setDocuments] = useState([]);
  const [sharedDocuments, setSharedDocuments] = useState([]);

  useEffect(() => {
    let unsub1 = null;
    let unsub2 = null;

    const getDocuments = async () => {
      unsub1 = await api.query.documentRegistry.documentsOfOrganization(organization, documentIds => {
        api.query.documentRegistry.documents.multi(documentIds, documents => {

          const validDocuments = documents
            .filter(document => !document.isNone)
            .map(document => document.unwrap());

          let orgs = [];
          const owners = keyring.getPairs().map(account => ({
            key: account.address,
            value: account.meta.name.toUpperCase()
          }));

          for (let i = 0; i < validDocuments.length; i++) {
            let document = validDocuments[i];
            const id = stringToHex(u8aToString(document.id));
            const ori_title = document.title.unwrap();
            const org = u8aToString(document.organization);
            const owner = document.owner.toString();

            let owner_name = owner;
            for (let i = 0; i < owners.length; i++) {
              if (owners[i].key === owner) {
                owner_name = owners[i].value;
              }
            }
            api.query.palletDid.attributeNonce([org, 'Org'])
              .then(nonce => api.registry.createType('(AccountId, Text, u64)', [org, 'Org', nonce.subn(1)]))
              .then(type => api.query.palletDid.attributeOf([org, type.hash]))
              .then(orgAttr => {
                let org_name = u8aToString(orgAttr.value);
                let title = u8aToString(ori_title[0].value);

                orgs.push({id: id, title: title, name: org_name, owner: owner_name});
                if (orgs.length === validDocuments.length) {
                  setDocuments(orgs.sort((a, b) => a.id - b.id));
                }
              })
          }
        });
      });
    };

    const organizations = async () => {
      unsub2 = await api.query.registrar.organizations(async rawData => {
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
                      setSharedDocuments(orgs.sort((a, b) => a.id - b.id));
                    }
                  })
              }
            });
          });
        }
      });
    }

    organizations();
    if (organization) {
      getDocuments();
    }

    return () => {
      unsub1 && unsub1();
      unsub2 && unsub2();
    };
  }, [organization, api, setDocuments]);

  return [sharedDocuments, documents];
}

export default useDocuments;