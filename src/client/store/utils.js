import shortid from 'shortid';

export const emptyPayload = Object.freeze({});

export const generatePromiseId = () => `promise-${shortid.generate()}`;

export const isPayloadPromise = payload => {
  if (!payload) {
    return false;
  }

  if (payload.promise) {
    return typeof payload.promise.then === 'function';
  }

  return typeof payload.then === 'function';
};
