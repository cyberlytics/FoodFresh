import React, { useEffect, useState } from 'react';
import { useSubstrate } from '../../../substrate-lib';

function Main() {
  const {api} = useSubstrate();
  const [nodeInfo, setNodeInfo] = useState({});

  useEffect(() => {
    const getInfo = async () => {
      try {
        const [chain, nodeName, nodeVersion] = await Promise.all([
          api.rpc.system.chain(),
          api.rpc.system.name(),
          api.rpc.system.version()
        ]);
        setNodeInfo({chain, nodeName, nodeVersion});
      } catch (e) {
        console.error(e);
      }
    };
    getInfo();
  }, [api.rpc.system]);

  return (
    <div>
      <div className="chaininfo-header border-bottom">
        Blockchain mode
      </div>
      <div className="chaininfo-content">
        Solochain
      </div>
    </div>
  )
}

export default function NodeInfo(props) {
  const {api} = useSubstrate();
  return api.rpc &&
  api.rpc.system &&
  api.rpc.system.chain &&
  api.rpc.system.name &&
  api.rpc.system.version ? (
    <Main {...props} />
  ) : null;
}
