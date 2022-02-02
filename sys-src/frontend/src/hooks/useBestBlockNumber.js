import { useEffect } from "react";

const useBestBlockNumber = (api, finalized, setBlockNumber) => {
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
};

export default useBestBlockNumber;