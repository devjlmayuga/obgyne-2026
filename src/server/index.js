const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const nodeMajorVersion = Number(process.versions.node.split('.')[0]);
if (nodeMajorVersion !== 24) {
  console.error(`This server must run on Node.js 24.x. Current version: ${process.version}`);
  process.exit(1);
}

// Lightweight .env loader (avoids adding a dependency)
(() => {
  const envPath = path.resolve(__dirname, '../../.env');
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const eq = trimmed.indexOf('=');
    if (eq <= 0) return;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (!key) return;
    if (process.env[key] != null) return;

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
})();
const app = express();
const distPath = path.resolve(__dirname, '../../dist');

const installServerDomShim = () => {
  const ElementShim = function ElementShim() {};

  if (typeof global.window === 'undefined') {
    global.window = {
      addEventListener: () => {},
      removeEventListener: () => {},
      navigator: { userAgent: 'node.js' },
      requestAnimationFrame: callback => setTimeout(callback, 0),
      cancelAnimationFrame: id => clearTimeout(id),
      getComputedStyle: () => ({}),
      Element: ElementShim,
      HTMLElement: ElementShim
    };
  }

  global.window.Element = global.window.Element || ElementShim;
  global.window.HTMLElement = global.window.HTMLElement || ElementShim;
  global.window.requestAnimationFrame =
    global.window.requestAnimationFrame || (callback => setTimeout(callback, 0));
  global.window.cancelAnimationFrame =
    global.window.cancelAnimationFrame || (id => clearTimeout(id));
  global.window.getComputedStyle = global.window.getComputedStyle || (() => ({}));

  if (typeof global.document === 'undefined') {
    global.document = {
      body: { style: {} },
      documentElement: { style: {} },
      addEventListener: () => {},
      removeEventListener: () => {},
      querySelector: () => ({
        classList: {
          add: () => {},
          remove: () => {},
          contains: () => false
        },
        style: {}
      }),
      createElement: () => ({
        style: {},
        setAttribute: () => {},
        removeAttribute: () => {}
      })
    };
  }

  if (typeof global.navigator === 'undefined') {
    global.navigator = global.window.navigator;
  }

  global.Element = global.window.Element;
  global.HTMLElement = global.window.HTMLElement;
  global.requestAnimationFrame = global.window.requestAnimationFrame;
  global.cancelAnimationFrame = global.window.cancelAnimationFrame;
  global.getComputedStyle = global.window.getComputedStyle;
};

app.use(express.static(distPath));

// added this code for file upload...
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/admin/user', require('./routes/admin.user.route'));
app.use('/api/admin/patient', require('./routes/admin.patient.route'));
app.use('/api/admin/medicine', require('./routes/admin.medicine.route'));
app.use(
  '/api/admin/patient-diagnosis',
  require('./routes/admin.patient_diagnosis.route')
);
app.use(
  '/api/admin/patient-medicine',
  require('./routes/admin.patient_medicine.route')
);
app.use(
  '/api/admin/patient-delivery',
  require('./routes/admin.patient_delivery.route')
);
app.use(
  '/api/admin/patient-vitalsigns',
  require('./routes/admin.patient_vitalsigns.route')
);

const registerSsrRoutes = () => {
  const ssrBundlePath = path.join(distPath, 'server.js');
  if (!fs.existsSync(ssrBundlePath)) {
    throw new Error('SSR bundle is missing. Run `npm run build` before starting the server.');
  }

  installServerDomShim();
  const { preloadApp, renderPage } = require('../../dist/server.js');

  preloadApp().catch(error => {
    console.error('Failed to preload SSR application.', error);
    process.exit(1);
  });

  app.get('*', (req, res, next) => {
    try {
      if (req.path.startsWith('/api/')) {
        res.status(404).send({ error: 'API route not found' });
        return;
      }

      const { context, html } = renderPage(req.url);

      res.status(context.statusCode || 200).send(html);
    } catch (error) {
      next(error);
    }
  });
};

registerSsrRoutes();

if (require.main === module) {
  app.listen(process.env.PORT || 8080, () =>
    console.log('Listening on port', process.env.PORT || 8080)
  );
}

module.exports = app;
