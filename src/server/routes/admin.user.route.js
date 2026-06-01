const express = require('express');

const router = express.Router();
const userService = require('./../services/admin.user.service');
const isLogin = require('./../middlewares/authentication.middleware').verify;

async function insertData(req, res) {
  console.log('entering insertData route');
  // let requestBody = req.body;
  const data = await userService.insertData();
  res.send(data);
}

async function getList(req, res) {
  console.log('entering getList route');
  // let requestBody = req.body;
  const data = await userService.getList();
  res.send(data);
}

async function resetPassword(req, res) {
  console.log('entering resetPassword route');
  const data = await userService.resetPassword(req.body, res);
  res.send(data);
}

router.post('/insert', insertData);
router.get('/get', isLogin, getList);
router.post('/reset-password', resetPassword);

module.exports = router;
