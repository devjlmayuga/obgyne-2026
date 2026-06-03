import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createDefaultStore } from './store';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

const store = createDefaultStore();

const renderApp = () => {
  const root = (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );

  if (ReactDOM.hydrate) {
    ReactDOM.hydrate(root, document.getElementById('root'));
    return;
  }

  ReactDOM.render(root, document.getElementById('root'));
};

renderApp();
