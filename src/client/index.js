import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createDefaultStore } from './store';
import { HashRouter } from 'react-router-dom';

import App from './App';

const store = createDefaultStore();

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);
