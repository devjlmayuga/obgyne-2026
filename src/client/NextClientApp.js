import React, { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { createDefaultStore } from './store';

export default function NextClientApp() {
  const storeRef = useRef(null);
  const [AppComponent, setAppComponent] = useState(null);
  const [loadError, setLoadError] = useState(null);

  if (!storeRef.current) {
    storeRef.current = createDefaultStore();
  }

  useEffect(() => {
    if (window.location.pathname === '/') {
      window.location.replace('/login');
      return undefined;
    }

    let isMounted = true;

    import('./App')
      .then(module => {
        if (isMounted) {
          setAppComponent(() => module.default);
        }
      })
      .catch(error => {
        console.error('Failed to load application shell.', error);
        if (isMounted) {
          setLoadError(error);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loadError) {
    return (
      <div className="app flex-row align-items-center">
        <div className="container text-center">
          <div className="animated fadeIn pt-3">
            Unable to load the application. Please refresh the page.
          </div>
        </div>
      </div>
    );
  }

  if (!AppComponent) {
    return (
      <div className="app flex-row align-items-center">
        <div className="container text-center">
          <div className="animated fadeIn pt-3">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Provider store={storeRef.current}>
      <BrowserRouter>
        <AppComponent />
      </BrowserRouter>
    </Provider>
  );
}
