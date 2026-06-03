import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';

import App from '../client/App';
import { createDefaultStore } from '../client/store';

export const preloadApp = () => Promise.resolve();

export const renderPage = url => {
  const context = {};
  const store = createDefaultStore({});
  const appHtml = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={url} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  );

  return {
    context,
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>OB GYNE</title>
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script src="/bundle.js" defer></script>
  </body>
</html>`
  };
};
