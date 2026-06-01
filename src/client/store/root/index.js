export const exportedKeys = ['userIdentity', 'patient'];
export const getStorableState = state => {
  const exportedState = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const key of exportedKeys) {
    exportedState[key] = { ...state[key] };
  }
  return exportedState;
};
