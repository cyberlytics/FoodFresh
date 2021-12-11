import { useEffect, useState } from "react";
import { hexToString } from "@polkadot/util";

const useRoles = (api, accountPair) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    let unsub = null;

    const getRoles = async () => {
      unsub = await api.query.rbac.roles(rawRoles => {
        const roles = rawRoles
          .map(r => r.toJSON())
          .map(r => ({...r, pallet: hexToString(r.pallet)}));
        setRoles(roles);
      });
    };

    if (accountPair) getRoles();
    return () => unsub && unsub();
  }, [accountPair, api]);

  return [roles]
};

export default useRoles;