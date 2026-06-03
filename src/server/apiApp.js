const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const loadEnvFile = () => {
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
    if (!key || process.env[key] != null) return;

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  });
};

loadEnvFile();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

app.use('/api', (req, res) => {
  res.status(404).send({ error: 'API route not found' });
});

module.exports = app;
