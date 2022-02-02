import { useEffect } from "react";
import { hexToString } from "@polkadot/util";

const useRoles = (api, accountPair, setRoles) => {

  useEffect(() => {
    let unsubscribe = null;

    const getRoles = async () => {
      unsubscribe = await api.query.rbac.roles(rawRoles => {
        const roles = rawRoles
          .map(r => r.toJSON())
          .map(r => ({...r, pallet: hexToString(r.pallet)}));
        setRoles(roles);
      });
    };

    if (accountPair) getRoles();
    return () => unsubscribe && unsubscribe();
  }, [accountPair, api]);
};

export default useRoles;