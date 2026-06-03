import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { createDefaultStore } from './store';

export default function NextClientApp() {
  const storeRef = useRef(null);

  if (!storeRef.current) {
    storeRef.current = createDefaultStore();
  }

  return (
    <Provider store={storeRef.current}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
}
