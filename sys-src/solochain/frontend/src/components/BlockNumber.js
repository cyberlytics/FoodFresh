import React, { useEffect, useState } from 'react';
import { useSubstrate } from '../substrate-lib';

function Main (props) {
  const { api } = useSubstrate();
  const { finalized } = props;
  const [blockNumber, setBlockNumber] = useState(0);

  const bestNumber = finalized
    ? api.derive.chain.bestNumberFinalized
    : api.derive.chain.bestNumber;

  useEffect(() => {
    let unsubscribeAll = null;

    bestNumber(number => {
      setBlockNumber(number.toNumber());
    }).then(unsub => {
        unsubscribeAll = unsub;
      })
      .catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [bestNumber]);

  return (
    <div>
      {finalized?
        <div className="org-header border-bottom">
          Finalized block
        </div>
        :
        <div className="org-header border-bottom">
          Current block
        </div>
      }
      <div className="org-content">
        {blockNumber}
      </div>
    </div>
  )
}

export default function BlockNumber (props) {
  const { api } = useSubstrate();
  return api.derive &&
    api.derive.chain &&
    api.derive.chain.bestNumber &&
    api.derive.chain.bestNumberFinalized ? (
      <Main {...props} />
    ) : null;
}
