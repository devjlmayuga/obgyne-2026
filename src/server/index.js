const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

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
const spec = fs.readFileSync(
  path.join('./src/server/', 'api-doc.yaml'),
  'utf8'
);
const swaggerDoc = jsyaml.safeLoad(spec);
const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(express.static('./../../dist'));

// added this code for file upload...
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// so that the client side can call api on its own port.
app.use(
  '/',
  express.static('./../client', {
    setHeaders: res => {
      res.removeHeader('Access-Control-Allow-Origin');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    }
  })
);

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

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, middleware => {
  app.use(middleware.swaggerValidator());
  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
});

app.listen(process.env.PORT || 8080, () =>
  console.log('Listening on port', process.env.PORT || 8080)
);
