import { useEffect } from "react";

/**
 * Derive current and finalized block number.
 * @param api Substrate api
 * @param finalized Derive finalized block number
 * @param setBlockNumber Block number setter
 */
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