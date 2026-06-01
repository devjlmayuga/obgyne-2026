const express = require('express');

const router = express.Router();
const patientVitalsignsService = require('../services/admin.patient_vitalsigns.service');
const isLogin = require('../middlewares/authentication.middleware').verify;

async function insertPatientVitalsigns(req, res) {
  console.log('entering insertPatientVitalsigns route');
  const data = req.body;
  const result = await patientVitalsignsService.insertPatientVitalsigns(data, res);
  res.send(result);
}

async function getPatientVitalsignsList(req, res) {
  console.log('entering getPatientVitalsignsList route');
  const data = await patientVitalsignsService.getPatientVitalsignsList(res);
  res.send(data);
}

async function updatePatientVitalsigns(req, res) {
  console.log('entering updatePatientVitalsigns route');
  const data = req.body;
  const result = await patientVitalsignsService.updatePatientVitalsigns(data, res);
  res.send(result);
}

async function getPatientVitalsignsListByPatientId(req, res) {
  console.log('entering getPatientVitalsignsListByPatientId route');
  const data = await patientVitalsignsService.getPatientVitalsignsListByPatientId(req.params.patient_id, res);
  res.send(data);
}

async function deletePatientVitalsigns(req, res) {
  console.log('entering deletePatientVitalsigns route');
  const data = req.body;
  const result = await patientVitalsignsService.deletePatientVitalsigns(data, res);
  res.send(result);
}


router.post('/insert', isLogin, insertPatientVitalsigns);
router.get('/get-list', isLogin, getPatientVitalsignsList);
router.get('/get-list-by-patient-id/:patient_id', isLogin, getPatientVitalsignsListByPatientId);
router.post('/update', isLogin, updatePatientVitalsigns);
router.delete('/delete', isLogin, deletePatientVitalsigns);

module.exports = router;
