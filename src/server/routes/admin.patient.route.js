const express = require('express');
const multer = require("multer");
const storage = multer.diskStorage({});
const limits = { fileSize: 10 * 1024 * 1024 };
const upload = multer({ limits: limits, storage: storage });

const router = express.Router();
const patientService = require('./../services/admin.patient.service');
const isLogin = require('../middlewares/authentication.middleware').verify;

async function insertPatient(req, res) {
  console.log('entering insertPatient route');
  const data = req.body;
  const result = await patientService.insertPatient(data, res);
  res.send(result);
}

async function getPatientList(req, res) {
  console.log('entering getPatientList route');
  const query = req.query;
  const data = await patientService.getPatientList(query, res);
  res.send(data);
}

async function updatePatient(req, res) {
  console.log('entering updatePatient route');
  const data = req.body;
  const result = await patientService.updatePatient(data, res);
  res.send(result);
}

async function getPatientInfoById(req, res) {
  console.log('entering getPatientInfoById route');
  const data = await patientService.getPatientInfoById(req.params.patient_id, res);
  res.send(data);
}

async function deletePatient(req, res) {
  console.log('entering deletePatient route');
  const data = await patientService.deletePatient(req.params.patient_id, req.params.is_deleted, res);
  res.send(data);
}


async function insertTodayPatient(req, res) {
  console.log('entering insertTodayPatient route');
  const data = req.body;
  const result = await patientService.insertTodayPatient(data, res);
  res.send(result);
}


async function getTodaySchedulePatientList(req, res) {
  console.log('entering getTodaySchedulePatientList route');
  const data = await patientService.getTodaySchedulePatientList(res);
  res.send(data);
}

async function updateSchedulePatientStatus(req, res) {
  console.log('entering updateSchedulePatientStatus route');
  const data = req.body;
  const result = await patientService.updateSchedulePatientStatus(data, res);
  res.send(result);
}


async function prescribedPatientMedicine(req, res) {
  console.log('entering prescribedPatientMedicine route');
  const data = req.body;
  const result = await patientService.prescribedPatientMedicine(data, res);
  res.send(result);
}

async function purchasePatientMedicine(req, res) {
  console.log('entering purchasePatientMedicine route');
  const data = req.body;
  const result = await patientService.purchasePatientMedicine(data, res);
  // res.end();
}

async function savePatientCheckup(req, res) {
  console.log('entering savePatientCheckup route');
  const data = req.body;
  // await patientService.updatePatient(data.patient_info, res);
  const result = await patientService.savePatientCheckup(data, res);
  res.send(result);
}


async function updatePatientCheckup(req, res) {
  console.log('entering updatePatientCheckup route');
  const data = req.body;
  const result = await patientService.updatePatientCheckup(data, res);
  res.send(result);
}

async function getPatientCheckupHistoryList(req, res) {
  console.log('entering getPatientChkeckupHistoryList route');
  const patientId = req.params.patient_id;
  const data = await patientService.getPatientCheckupHistoryList(patientId, res);
  res.send(data);
}

async function getPatientCheckupHistoryByDate(req, res) {
  console.log('entering getPatientCheckupHistoryByDate route');
  const scId = req.params.schedule_checkup_id;
  const dateFrom = req.params.date;
  const data = await patientService.getPatientCheckupHistoryByDate(scId, dateFrom, res);
  res.send(data);
}

async function uploadFile(req, res) {
  console.log('entering upload route');
  const file = req.files[0];
  const data = req.body;
  await patientService.upload(file, data, res);
}

async function getPatientFileList(req, res) {
  console.log('entering upload route');
  const data = req.body;
  const result = await patientService.getPatientFileList(res);
  res.send(result);
}

async function getPatientConfinementList(req, res) {
  console.log('entering upload route');
  const result = await patientService.getPatientConfinementList(res);
  res.send(result);
}

async function saveMedicalHistory(req, res) {
  console.log('entering saveMedicalHistory route');
  const data = req.body;
console.log('route data', data);
	const result = await patientService.saveMedicalHistory(data, res);
  res.send(result);
}


async function updatePrescribedPatientMedicine(req, res) {
  console.log('entering updatePrescribedPatientMedicine route');
  const data = req.body;
  const schedule_checkup_id = req.params.schedule_checkup_id;
  const result = await patientService.updatePrescribedPatientMedicine(data, schedule_checkup_id, res);
  res.send(result);
}

async function searchPatient(req, res) {
  console.log('entering searchPatient route');
  const query = req.params.query;
  const result = await patientService.searchPatient(query, res);
  res.send(result);
}


async function getPatientMedicalHistory(req, res) {
  console.log('entering getPatientMedicalHistory route');
  const patient_id = req.params.patient_id;
  const result = await patientService.getPatientMedicalHistory(patient_id, res);
  res.send(result);
}


async function getPrescribeMedicine(req, res) {
  console.log('entering getPrescribeMedicine route');
  const patient_id = req.params.patient_id;
  const result = await patientService.getPrescribeMedicine(patient_id, res);
  res.send(result);
}


async function schedulePatient(req, res) {
  console.log('entering schedulePatient route');
  const result = await patientService.schedulePatient(req.body, res);
  res.send(result);
}


async function getPatientTestResultByScheduleCheckupId(req, res) {
  console.log('entering getPatientTestResultByScheduleCheckupId route');
  const schedule_checkup_id = req.params.schedule_checkup_id;
  const result = await patientService.getPatientTestResultByScheduleCheckupId(schedule_checkup_id, res);
  res.send(result);
}


async function getPatientTestResultByPatientId(req, res) {
  console.log('entering getPatientTestResultByPatientId route');
  const patient_id = req.params.patient_id;
  const result = await patientService.getPatientTestResultByPatientId(patient_id, res);
  res.send(result);
}


async function isPatientDelivered(req, res) {
  console.log('entering isPatientDelivered route');
  const sc_checkup_history_id = req.params.sc_checkup_history_id;
  const is_delivered = req.params.is_delivered;
  const result = await patientService.isPatientDelivered(sc_checkup_history_id, is_delivered, res);
  res.send(result);
}


async function getPatientCheckupHistory(req, res) {
  console.log('entering getPatientCheckupHistory route');
  const patient_id = req.params.patient_id;
  await patientService.getPatientCheckupHistory(patient_id, req.query, res);
}


async function isPatientScheduledToday(req, res) {
  console.log('entering isPatientScheduledToday route');
  const patient_id = req.params.patient_id;
  await patientService.isPatientScheduledToday(patient_id, res);
}

async function deleteFile(req, res) {
  console.log('entering deleteFile route');
  const data = await patientService.deleteFile(req.params.google_id, res);
  res.send(data);
}


router.post('/insert', isLogin, insertPatient);
router.get('/get-list', isLogin, getPatientList);
router.get('/get-info/:patient_id', isLogin, getPatientInfoById);
router.post('/update', isLogin, updatePatient);
router.delete('/delete/:patient_id/:is_deleted', isLogin, deletePatient);
router.post('/insert/today-patient', isLogin, insertTodayPatient);
router.get('/get-list/today-patient', isLogin, getTodaySchedulePatientList);
router.post('/update/status/', isLogin, updateSchedulePatientStatus);
router.post('/prescribed-medicine', isLogin, prescribedPatientMedicine);
router.post('/purchase-medicine', isLogin, purchasePatientMedicine);
router.post('/checkup/save', isLogin, savePatientCheckup);
router.get('/checkup/history-list/:patient_id', isLogin, getPatientCheckupHistoryList);
router.get('/checkup/history-by-date/:schedule_checkup_id/:date', isLogin, getPatientCheckupHistoryByDate);
router.post('/upload', isLogin, upload.any(), uploadFile);
router.post('/get-file/list', isLogin, getPatientFileList);
router.get('/get-patient-confinement/list', isLogin, getPatientConfinementList);
router.post('/medical-hitory/save', isLogin, saveMedicalHistory);
router.post('/prescribed-medicine/update/:schedule_checkup_id', isLogin, updatePrescribedPatientMedicine);
router.get('/get-medical-history/:patient_id', isLogin, getPatientMedicalHistory);
router.get('/get-prescribe-medicine/:patient_id', isLogin, getPrescribeMedicine);
router.post('/schedule', isLogin, schedulePatient);
router.get('/get-uploaded-list/:schedule_checkup_id',isLogin, getPatientTestResultByScheduleCheckupId);
router.get('/file-list/:patient_id',isLogin, getPatientTestResultByPatientId);
router.post('/delivered/:sc_checkup_history_id/:is_delivered',isLogin, isPatientDelivered);
router.get('/checkup-history/:patient_id', isLogin, getPatientCheckupHistory);
router.post('/checkup/update', isLogin, updatePatientCheckup);
router.get('/is-scheduled-today/:patient_id', isLogin, isPatientScheduledToday);
router.delete('/delete-file/:google_id', isLogin, deleteFile);

module.exports = router;
