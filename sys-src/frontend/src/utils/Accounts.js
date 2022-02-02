
// Get accounts list
export const getAccounts = keyring => keyring.getPairs().map(account => ({
  id: account.address,
  text: account.meta.name.toUpperCase(),
}));