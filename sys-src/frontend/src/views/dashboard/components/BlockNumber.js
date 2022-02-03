/**
 * BlockNumber
 * Renders the derived block number for current and finalized blocks.
 */

import React, { useState } from 'react';
import { useSubstrate } from '../../../substrate-lib';
import { useBestBlockNumber } from '../../../hooks';

const Main = ({ finalized }) => {
  /* State */
  const [blockNumber, setBlockNumber] = useState(0);

  /* Hooks */
  const { api } = useSubstrate();
  useBestBlockNumber(api, finalized, setBlockNumber);

  /* Render */
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
};

export default function BlockNumber(props) {
  const { api } = useSubstrate();
  return api.derive &&
    api.derive.chain &&
    api.derive.chain.bestNumber &&
    api.derive.chain.bestNumberFinalized ? (
      <Main {...props} />
    ) : null;
};
