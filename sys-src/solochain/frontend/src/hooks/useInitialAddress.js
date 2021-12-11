import { useEffect } from "react";

const useInitialAddress = (props, initialAddress) => {
  // Set the initial address
  useEffect(() => {
    props.sendAddressData(initialAddress);
  }, [initialAddress]);
};

export default useInitialAddress;