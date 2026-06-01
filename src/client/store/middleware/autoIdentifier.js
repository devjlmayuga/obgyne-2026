import { isPayloadPromise, generatePromiseId } from '../utils';

export const autoIdentifier = () => next => (action) => {
  const { payload, meta } = action;

  if (isPayloadPromise(payload) && !(meta && meta.promiseId)) {
    if (!action.meta) {
      action.meta = {};
    }

    const promiseId = generatePromiseId();

    payload.promiseId = promiseId;
    action.meta.promiseId = promiseId;
  }

  return next(action);
};

export default autoIdentifier;
