import promiseMiddleware from 'redux-promise-middleware';
import promise from 'redux-promise';
import thunk from 'redux-thunk';
import { debounce } from 'lodash';
import { createStore, compose, applyMiddleware } from 'redux';

import { getStorableState } from './root';
import { rootReducer as reduceRoot } from '../reducers';
import autoIdentifyMiddleware from './middleware/autoIdentifier';

export const REDUX_SCHEMA_VERSION = 13;
export const REDUX_DEBOUNCE_INTERVAL = 100; // in milliseconds
export const REDUX_STORAGE_KEY = 'applicationState';
const REDUX_DEV_TOOLS = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';
const canUseBrowserStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const getInitialState = () => {
  if (!canUseBrowserStorage()) {
    return {};
  }

  const stateJson = localStorage.getItem(REDUX_STORAGE_KEY);
  const state = JSON.parse(stateJson || null) || {};

  if (state.schemaVersion !== REDUX_SCHEMA_VERSION) {
    return {};
  }

  delete state.schemaVersion;

  return state;
};

let enhancers = null;

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const composeEnhancers = window[REDUX_DEV_TOOLS] || compose;

  enhancers = composeEnhancers(
    applyMiddleware(thunk, autoIdentifyMiddleware, promiseMiddleware(), promise)
  );
} else {
  enhancers = compose(applyMiddleware(thunk, autoIdentifyMiddleware, promiseMiddleware(), promise));
}

export const createDefaultStore = (rootState = getInitialState()) => {
  const store = createStore(reduceRoot, rootState, enhancers);

  if (!canUseBrowserStorage()) {
    return store;
  }

  const saveAppState = () => {
    const state = store.getState();
    const storableState = getStorableState(state);

    storableState.schemaVersion = REDUX_SCHEMA_VERSION;

    localStorage.setItem(REDUX_STORAGE_KEY, JSON.stringify(storableState));
  };

  window.dump = () => store.getState();
  window.invalidateToken = () => store.dispatch({ type: 'DEBUG_INVALIDATE_TOKEN' });

  store.subscribe(debounce(saveAppState, REDUX_DEBOUNCE_INTERVAL));

  return store;
};
