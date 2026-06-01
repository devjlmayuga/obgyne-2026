const express = require('express');

const router = express.Router();
const medicineService = require('./../services/admin.medicine.service');
const isLogin = require('../middlewares/authentication.middleware').verify;

async function insertMedicine(req, res) {
  console.log('entering insertMedicine route');

  const data = req.body;

  const result = await medicineService.insertMedicine(data, res);
  res.send(result);
}

async function getMedicineList(req, res) {
  console.log('entering getMedicineList route');
  const query = req.query;
  const data = await medicineService.getMedicineList(query, res);
  res.send(data);
}

async function updateMedicine(req, res) {
  console.log('entering updateMedicine route');
  const data = req.body;

  const result = await medicineService.updateMedicine(data, res);
  res.send(result);
}

async function getMedicineInfoById(req, res) {
  console.log('entering getPatientInfoById route');

  const data = await medicineService.getMedicineInfoById(req.params.medicine_id, res);
  res.send(data);
}

async function deleteMedicine(req, res) {
  console.log('entering deleteMedicine route');

  const data = await medicineService.deleteMedicine(req.params.medicine_id, res);
  res.send(data);
}

async function getTotalSaleToday(req, res) {
  console.log('entering getTotalSaleToday route');

  const data = await medicineService.getTotalSaleToday(res);
  res.send(data);
}

router.post('/insert', isLogin, insertMedicine);
router.get('/get-list', isLogin, getMedicineList);
router.get('/get-info/:medicine_id', isLogin, getMedicineInfoById);
router.post('/update', isLogin, updateMedicine);
router.delete('/delete/:medicine_id', isLogin, deleteMedicine);
router.get('/get-total-sale/today', isLogin, getTotalSaleToday);

module.exports = router;
