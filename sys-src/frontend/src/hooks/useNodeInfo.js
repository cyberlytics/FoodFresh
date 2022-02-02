import { useEffect } from 'react';

const useNodeInfo = (api, setNodeInfo) => {

  useEffect(() => {
    const getNodeInfo = async () => {
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
    getNodeInfo();
  }, [api.rpc.system]);
};

export default useNodeInfo;