const express = require('express');

const router = express.Router();
const patientMedicineService = require('../services/admin.patient_medicine.service');
const isLogin = require('../middlewares/authentication.middleware').verify;

async function insertPatientMedicine(req, res) {
  console.log('entering insertPatientMedicine route');

  const data = req.body;

  const result = await patientMedicineService.insertPatientMedicine(data, res);
  res.send(result);
}

async function getPatientMedicineList(req, res) {
  console.log('entering getPatientMedicineList route');
  const query = req.query;
  const data = await patientMedicineService.getPatientMedicineList(query, res);
  res.send(data);
}

async function updatePatientMedicine(req, res) {
  console.log('entering updatePatientMedicine route');
  const data = req.body;

  const result = await patientMedicineService.updatePatientMedicine(data, res);
  res.send(result);
}

async function getPatientMedicineInfoById(req, res) {
  console.log('entering getPatientMedicineInfoById route');

  const data = await patientMedicineService.getPatientMedicineInfoById(req.params.medicine_id, res);
  res.send(data);
}

async function deletePatientMedicine(req, res) {
  console.log('entering deletePatientMedicine route');

  const data = await patientMedicineService.deletePatientMedicine(req.params.medicine_id, res);
  res.send(data);
}

async function getPatientMedicineListByPatientId(req, res) {
  console.log('entering getPatientMedicineListByPatientId route');
  const data = await patientMedicineService.getPatientMedicineListByPatientId(req.params.patient_id, res);
  res.send(data);
}

router.post('/insert', isLogin, insertPatientMedicine);
router.get('/get-list', isLogin, getPatientMedicineList);
router.get('/get-info/:medicine_id', isLogin, getPatientMedicineInfoById);
router.post('/update', isLogin, updatePatientMedicine);
router.delete('/delete/:medicine_id', isLogin, deletePatientMedicine);
router.get('/get-patient-medicine-list-by-id/:patient_id', isLogin, getPatientMedicineListByPatientId);

module.exports = router;
