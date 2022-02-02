/**
 * NodeInfo
 * Renders details about the blockchain in use.
 */

import React, { useState } from 'react';
import { useSubstrate } from '../../../substrate-lib';
import { useNodeInfo } from '../../../hooks';

const Main = () => {
  /* State */
  const [nodeInfo, setNodeInfo] = useState({});

  /* Hooks */
  const { api } = useSubstrate();
  useNodeInfo(api, setNodeInfo);

  /* Render */
  return (
    <div>
      <div className="chaininfo-header border-bottom">
        Blockchain mode
      </div>
      <div className="chaininfo-content">
        {nodeInfo.chain}
      </div>
    </div>
  );
};

export default function NodeInfo(props) {
  const { api } = useSubstrate();
  return api.rpc &&
  api.rpc.system &&
  api.rpc.system.chain &&
  api.rpc.system.name &&
  api.rpc.system.version ? (
    <Main {...props} />
  ) : null;
};
