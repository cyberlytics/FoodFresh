/**
 * Get accounts list
 * @param keyring Web3 injected keyring
 */
export const getAccounts = keyring => keyring.getPairs().map(account => ({
  id: account.address,
  text: account.meta.name.toUpperCase(),
}));