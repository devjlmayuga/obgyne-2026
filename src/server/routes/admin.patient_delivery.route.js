const express = require('express');

const router = express.Router();
const patientDeliveryService = require('../services/admin.patient_delivery.service');
const isLogin = require('../middlewares/authentication.middleware').verify;

async function insertPatientDelivery(req, res) {
  console.log('entering insertPatientDelivery route');
  const data = req.body;
  const result = await patientDeliveryService.insertPatientDelivery(data, res);
  res.send(result);
}

async function getPatientDeliveryList(req, res) {
  console.log('entering getPatientDeliveryList route');
  const data = await patientDeliveryService.getPatientDeliveryList(res);
  res.send(data);
}

async function updatePatientDelivery(req, res) {
  console.log('entering updatePatientDelivery route');
  const data = req.body;
  const patient_id = req.params.patient_id
  const result = await patientDeliveryService.updatePatientDelivery(data, patient_id, res);
  res.send(result);
}

async function getPatientDeliveryListByPatientId(req, res) {
  console.log('entering getPatientDeliveryListByPatientId route');
  const data = await patientDeliveryService.getPatientDeliveryListByPatientId(req.params.patient_id, res);
  res.send(data);
}

async function deletePatientDelivery(req, res) {
  console.log('entering deletePatientDelivery route');
  const data = req.body;
  const result = await patientDeliveryService.deletePatientDelivery(data, res);
  res.send(result);
}


router.post('/insert', isLogin, insertPatientDelivery);
router.get('/get-list', isLogin, getPatientDeliveryList);
router.get('/get-list-by-patient-id/:patient_id', isLogin, getPatientDeliveryListByPatientId);
router.post('/update/:patient_id', isLogin, updatePatientDelivery);
router.delete('/delete', isLogin, deletePatientDelivery);

module.exports = router;
