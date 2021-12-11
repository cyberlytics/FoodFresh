import { useEffect, useState } from "react";

const useBestBlockNumber = (api, finalized) => {

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

  return [blockNumber];
};

export default useBestBlockNumber;