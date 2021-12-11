import React from 'react';
import { useSubstrate } from '../../../substrate-lib';
import { useBestBlockNumber } from "../../../hooks";

function Main (props) {
  const { api } = useSubstrate();
  const { finalized } = props;
  const [blockNumber] = useBestBlockNumber(api, finalized);

  return (
    <div>
      {finalized?
        <div className="chaininfo-header border-bottom">
          Finalized block
        </div>
        :
        <div className="chaininfo-header border-bottom">
          Current block
        </div>
      }
      <div className="chaininfo-content">
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
