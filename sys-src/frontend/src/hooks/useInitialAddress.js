import { useEffect } from "react";

/**
 * Set the initial address.
 * @param props Properties
 * @param initialAddress Initial address to use
 */
const useInitialAddress = (props, initialAddress) => {
  useEffect(() => {
    props.sendAddressData(initialAddress);
  }, [props, initialAddress]);
};

export default useInitialAddress;