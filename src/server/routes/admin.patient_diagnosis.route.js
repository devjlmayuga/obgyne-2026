const express = require('express');

const router = express.Router();
const patientDiagnosisService = require('./../services/admin.patient_diagnosis.service');
const isLogin = require('../middlewares/authentication.middleware').verify;

async function insertPatientDiagnosis(req, res) {
  console.log('entering insertPatientDiagnosis route');
  const data = req.body;
  const result = await patientDiagnosisService.insertPatientDiagnosis(data, res);
  res.send(result);
}

async function getPatientDiagnosisList(req, res) {
  console.log('entering getPatientDiagnosisList route');
  const data = await patientDiagnosisService.getPatientDiagnosisList(res);
  res.send(data);
}

async function updatePatientDiagnosis(req, res) {
  console.log('entering updatePatientDiagnosis route');
  const data = req.body;
  const result = await patientDiagnosisService.updatePatientDiagnosis(data, res);
  res.send(result);
}

async function getPatientDiagnosisListByPatientId(req, res) {
  console.log('entering getPatientDiagnosisListByPatientId route');
  const data = await patientDiagnosisService.getPatientDiagnosisListByPatientId(req.params.patient_id, res);
  res.send(data);
}

async function deletePatientDiagnosis(req, res) {
  console.log('entering deletePatientDiagnosis route');
  const data = req.body;
  const result = await patientDiagnosisService.deletePatientDiagnosis(data, res);
  res.send(result);
}


router.post('/insert', isLogin, insertPatientDiagnosis);
router.get('/get-list', isLogin, getPatientDiagnosisList);
router.get('/get-list-by-patient-id/:patient_id', isLogin, getPatientDiagnosisListByPatientId);
router.post('/update', isLogin, updatePatientDiagnosis);
router.delete('/delete', isLogin, deletePatientDiagnosis);

module.exports = router;
